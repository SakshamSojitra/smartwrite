"""
SmartWrite - Intelligent Grammar & Spell Checker
Flask Backend - REST API using LanguageTool (free public API)

Architecture:
    - POST /check: Accepts JSON { "text": "..." }, returns grammar/spelling matches
    - Uses LanguageTool public API (https://api.languagetool.org) - free, no API key
    - Returns error positions, types, messages, and suggestions
"""

import requests
from flask import Flask, request, jsonify, render_template

# Initialize Flask app
app = Flask(__name__)

# LanguageTool public API (free, 20 requests/min per IP)
LANGUAGETOOL_API = "https://api.languagetool.org/v2/check"


def check_text_with_languagetool(text: str) -> dict:
    """
    Send text to LanguageTool API for grammar and spelling check.
    
    Args:
        text: The text to check
        
    Returns:
        API response as dictionary
    """
    payload = {
        "text": text,
        "language": "en-US",  # English
    }
    response = requests.post(
        LANGUAGETOOL_API,
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def normalize_matches(data: dict, text: str) -> list:
    """
    Normalize LanguageTool API response for frontend consumption.
    
    Maps API format to our format:
    - offset, length: character position
    - type: 'spelling' or 'grammar'
    - message: human-readable description
    - replacements: list of suggested corrections
    - context: for displaying surrounding text
    """
    matches = []
    for m in data.get("matches", []):
        offset = m.get("offset", 0)
        length = m.get("length", 0)
        rule = m.get("rule", {})
        category = rule.get("category", {})
        category_id = category.get("id", "")
        
        # Determine if spelling or grammar error
        is_spelling = "SPELL" in category_id.upper() or rule.get("id", "").startswith("MORFOLOGIK")
        error_type = "spelling" if is_spelling else "grammar"
        
        matches.append({
            "offset": offset,
            "length": length,
            "type": error_type,
            "message": m.get("message", rule.get("description", "Error")),
            "replacements": [{"value": r.get("value", "")} for r in m.get("replacements", []) if r.get("value")],
            "rule": {
                "id": rule.get("id"),
                "description": rule.get("description"),
                "category": category,
            },
            "context": {
                "text": text[max(0, offset - 50) : offset + length + 50],
                "offset": max(0, offset - 50),
            },
        })
    return matches


@app.route("/")
def index():
    """Serve the main HTML page."""
    return render_template("index.html")


@app.route("/check", methods=["POST"])
def check():
    """
    REST API endpoint: Check grammar and spelling.
    
    Request:  { "text": "Your text here" }
    Response: { "matches": [...], "language": "en-US" }
    
    Each match: offset, length, type, message, replacements
    """
    try:
        # Parse JSON body
        data = request.get_json(force=True, silent=True)
        if not data or "text" not in data:
            return jsonify({"error": "Missing 'text' in request body"}), 400
        
        text = data["text"]
        if not isinstance(text, str):
            return jsonify({"error": "text must be a string"}), 400
        
        # Limit text length to avoid API abuse (LanguageTool allows ~100k chars)
        if len(text) > 20000:
            return jsonify({"error": "Text too long. Maximum 20,000 characters."}), 400
        
        # Call LanguageTool API
        api_result = check_text_with_languagetool(text)
        
        # Normalize matches for frontend
        matches = normalize_matches(api_result, text)
        
        return jsonify({
            "matches": matches,
            "language": api_result.get("language", {}).get("name", "en-US"),
        })
        
    except requests.RequestException as e:
        return jsonify({"error": f"LanguageTool API error: {str(e)}"}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Run development server
    app.run(debug=True, port=5000)
