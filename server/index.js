/**
 * SmartWrite - Node.js Backend
 * Express REST API - Proxies to LanguageTool for grammar/spelling check
 */

import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;
const LANGUAGETOOL_API = "https://api.languagetool.org/v2/check";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

/**
 * Normalize LanguageTool response for frontend
 */
function normalizeMatches(data, text) {
  return (data.matches || []).map((m) => {
    const offset = m.offset ?? 0;
    const length = m.length ?? 0;
    const rule = m.rule ?? {};
    const categoryId = rule.category?.id ?? "";
    const isSpelling = categoryId.toUpperCase().includes("SPELL") || rule.id?.startsWith("MORFOLOGIK");
    const type = isSpelling ? "spelling" : "grammar";

    return {
      offset,
      length,
      type,
      message: m.message ?? rule.description ?? "Error",
      replacements: (m.replacements || []).filter((r) => r.value).map((r) => ({ value: r.value })),
      rule: { id: rule.id, description: rule.description, category: rule.category },
      context: { text: text.slice(Math.max(0, offset - 50), offset + length + 50), offset: Math.max(0, offset - 50) },
    };
  });
}

/**
 * POST /check - Check grammar and spelling
 */
app.post("/check", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing 'text' in request body" });
    }
    if (text.length > 20000) {
      return res.status(400).json({ error: "Text too long. Max 20,000 characters." });
    }

    const formData = new URLSearchParams({ text, language: "en-US" });
    const response = await fetch(LANGUAGETOOL_API, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    if (!response.ok) throw new Error("LanguageTool API error");
    const apiResult = await response.json();

    const matches = normalizeMatches(apiResult, text);
    res.json({ matches, language: apiResult.language?.name ?? "en-US" });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message ?? "Check failed" });
  }
});

app.listen(PORT, () => {
  console.log(`SmartWrite API running at http://127.0.0.1:${PORT}`);
});
