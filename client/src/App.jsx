import React, { useState, useCallback } from "react";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import CheckGrammarButton from "./components/CheckGrammarButton";
import { BackgroundSnippets } from "@/components/ui/background-snippets";
import TextEditor from "./components/TextEditor";
import SuggestionPanel from "./components/SuggestionPanel";
import Tooltip from "./components/Tooltip";
import { countWords, countChars, getReadabilityScore } from "./utils/textUtils";
import "./App.css";

// Backend API URL (dev server runs on port 5000)
const API_URL = "http://localhost:5000/check";

export default function App() {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, message: "", suggestions: [], x: 0, y: 0 });

  const wordCount = countWords(text);
  const charCount = countChars(text);
  const readability = getReadabilityScore(text);

  const checkGrammar = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      alert("Please enter some text to check.");
      return;
    }
    setLoading(true);
    setHasChecked(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      // Try to parse JSON only when body is present and content-type is JSON
      let data = null;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        // fallback: attempt to read text (may be empty)
        const txt = await res.text();
        try {
          data = txt ? JSON.parse(txt) : null;
        } catch (e) {
          data = null;
        }
      }

      if (!res.ok) throw new Error((data && data.error) || res.statusText || "Check failed");
      setErrors((data && data.matches) || []);
    } catch (err) {
      alert("Could not check grammar. " + (err.message ?? "Please try again."));
      setErrors([]);
    } finally {
      setLoading(false);
    }
  }, [text]);

  const handleClear = useCallback(() => {
    setText("");
    setErrors([]);
    setHasChecked(false);
    setTooltip((t) => ({ ...t, visible: false }));
  }, []);

  const handleApply = useCallback((offset, length, replacement) => {
    setText((prev) => prev.slice(0, offset) + replacement + prev.slice(offset + length));
    setErrors((prev) => prev.filter((e) => !(e.offset === offset && e.length === length)));
  }, []);

  const handleSpanHover = useCallback((e, err) => {
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      message: err.message ?? "",
      suggestions: err.replacements ?? [],
      x: rect.left,
      y: rect.bottom,
    });
  }, []);

  const handleSpanLeave = useCallback(() => {
    setTooltip((t) => ({ ...t, visible: false }));
  }, []);

  const handleTextChange = useCallback((newText) => {
    setText(newText);
    if (errors.length > 0) setErrors([]);
  }, [errors.length]);

  return (
    <>
      <div className="fixed inset-0 -z-10 w-full h-full" aria-hidden>
        <BackgroundSnippets variant="grid" />
      </div>
      <div className="app relative">
        <Header />
        <StatsBar
          wordCount={wordCount}
          charCount={charCount}
          readability={readability !== null ? `Grade ${readability}` : null}
          errorCount={errors.length}
        />
        <main className="app__main">
          <section className="app__editor">
            <TextEditor
              value={text}
              onChange={handleTextChange}
              errors={errors}
              onSpanHover={handleSpanHover}
              onSpanLeave={handleSpanLeave}
              placeholder="Type or paste your text here... We will check spelling and grammar."
            />
            <div className="app__buttons flex w-full items-center">
              <div className="flex gap-3 items-center">
                <CheckGrammarButton label="Check Grammar" onClick={checkGrammar} />
              </div>
              <div className="ml-auto">
                <LiquidButton
                  variant="outline"
                  onClick={handleClear}
                  className="text-blue-600 border-blue-200 hover:bg-white/90 h-11 text-base px-6 py-2 rounded-full"
                >
                  Clear
                </LiquidButton>
              </div>
            </div>
          </section>
          <SuggestionPanel errors={errors} text={text} onApply={handleApply} hasChecked={hasChecked} />
        </main>
        <footer className="app__footer">Powered by LanguageTool API • English • Free & Open</footer>
        <Tooltip {...tooltip} />
      </div>
    </>
  );
}
