# SmartWrite: Intelligent Grammar & Spell Checker

A hackathon-ready web application that checks grammar and spelling, highlights mistakes, and suggests corrections using AI/NLP.

![SmartWrite](https://img.shields.io/badge/SmartWrite-Grammar%20Checker-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![Flask](https://img.shields.io/badge/Flask-3.0-lightgrey)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** installed on your machine
- **pip** (Python package manager)
- An internet connection (for LanguageTool API)

### Run Locally

```bash
# 1. Navigate to project folder
cd smartwrite

# 2. Create virtual environment (recommended)
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run the app
python app.py
```

Open your browser at **http://127.0.0.1:5000**

---

## 📁 Project Structure

```
smartwrite/
├── app.py                 # Flask backend - REST API & main logic
├── requirements.txt       # Python dependencies
├── README.md              # This file
├── templates/
│   └── index.html         # Main HTML page
└── static/
    ├── css/
    │   └── style.css      # Styles - responsive, dark theme
    └── js/
        └── main.js        # Frontend logic - highlighting, suggestions
```

---

## 🏗️ Architecture & Flow

### High-Level Architecture

```
┌─────────────────┐     HTTP POST /check      ┌─────────────────┐
│                 │  { "text": "..." }        │                 │
│    Frontend     │ ──────────────────────▶   │  Flask Backend  │
│  (HTML/CSS/JS)  │                           │    (app.py)     │
│                 │ ◀──────────────────────   │                 │
│                 │  { "matches": [...] }     └────────┬────────┘
└─────────────────┘                                    │
                                                       │ HTTPS
                                                       ▼
                                              ┌─────────────────┐
                                              │ LanguageTool    │
                                              │ Public API      │
                                              │ api.languagetool│
                                              └─────────────────┘
```

### Request Flow

1. **User types text** → Stats bar updates (word count, readability).
2. **User clicks "Check Grammar"** → Frontend sends `POST /check` with JSON `{ "text": "..." }`.
3. **Backend** → Forwards text to LanguageTool API (free, no API key).
4. **LanguageTool** → Returns grammar/spelling matches with positions and suggestions.
5. **Backend** → Normalizes response, returns `{ matches: [...] }`.
6. **Frontend** → Highlights errors (red = spelling, blue = grammar), populates suggestions panel.
7. **User hovers** → Tooltip shows quick suggestions.
8. **User clicks suggestion chip** → Text is replaced with correction.

### Data Format

**API Request:**
```json
{ "text": "I has a apple." }
```

**API Response (simplified):**
```json
{
  "matches": [
    {
      "offset": 2,
      "length": 3,
      "type": "grammar",
      "message": "Use \"have\" instead of \"has\"",
      "replacements": [{ "value": "have" }]
    },
    {
      "offset": 8,
      "length": 5,
      "type": "spelling",
      "message": "Use \"an\" instead of \"a\" (indefinite article before vowel)",
      "replacements": [{ "value": "an" }]
    }
  ]
}
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Spelling errors** | Red underline, detected via LanguageTool |
| **Grammar errors** | Blue underline, detected via LanguageTool |
| **Suggestions panel** | Side panel with all corrections and click-to-apply |
| **Hover tooltips** | Quick suggestions on hover over highlighted text |
| **Word count** | Real-time word count |
| **Character count** | Real-time character count |
| **Readability score** | Approximate Flesch-Kincaid grade level |
| **Responsive design** | Works on desktop and mobile |
| **Clear / Check buttons** | Easy workflow |

---

## 🎯 Hackathon Demo Script

**1. Opening (30 sec)**  
> "SmartWrite is an intelligent grammar and spell checker. It highlights mistakes, suggests corrections, and runs completely free using the LanguageTool API."

**2. Live Demo (2 min)**  
- Paste sample text with errors, e.g.:  
  *"I has went to the store yesterday. Their was alot of peoples."*
- Click **Check Grammar**.
- Show red underlines (spelling) and blue underlines (grammar).
- Hover over errors to show tooltip.
- Click a suggestion chip to apply correction.
- Point out word count, readability score.

**3. Tech Stack (30 sec)**  
> "Frontend: vanilla HTML, CSS, JS. Backend: Python Flask. NLP: LanguageTool public API. No API key, fully free."

**4. Future Scope (30 sec)**  
> "We can add more languages, a local LanguageTool server for offline use, browser extension, and deeper readability analytics."

---

## 🔮 Future Scope

| Enhancement | Description |
|-------------|-------------|
| **Multi-language** | Support Spanish, French, German via LanguageTool |
| **Offline mode** | Run local LanguageTool server (Java) for no internet |
| **Browser extension** | Check text on any webpage |
| **Export / Share** | Export corrected text, share reports |
| **Style suggestions** | Tone, clarity, conciseness |
| **AI summarization** | Summarize long text |
| **User accounts** | Save preferences, history |
| **API rate limit handling** | Queue requests, retry with backoff |

---

## 📝 API Reference

### `POST /check`

**Request:**
```http
POST /check
Content-Type: application/json

{ "text": "Your text to check" }
```

**Response (200 OK):**
```json
{
  "matches": [
    {
      "offset": 0,
      "length": 5,
      "type": "spelling",
      "message": "Did you mean...?",
      "replacements": [{ "value": "correct" }],
      "rule": { "id": "...", "description": "...", "category": { "id": "SPELLING" } },
      "context": { "text": "...", "offset": 0 }
    }
  ],
  "language": "en-US"
}
```

**Errors:**
- `400` - Missing or invalid `text` in body
- `500` - Internal server error
- `502` - LanguageTool API unavailable

---

## 🛠️ Constraints & Notes

- **LanguageTool API**: Free public API, ~20 requests/minute per IP. For heavy use, consider self-hosting LanguageTool.
- **Text limit**: 20,000 characters per request (configurable in `app.py`).
- **Language**: English (en-US) by default. Change in `app.py` payload if needed.

---

## 📄 License

MIT License - feel free to use for hackathons and projects.

---

**Built for hackathons • Beginner-friendly • Free to run**
