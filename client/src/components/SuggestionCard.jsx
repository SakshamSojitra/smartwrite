import React from "react";

export default function SuggestionCard({ error, errorText, onApply }) {
  const type = (error.rule?.category?.id ?? "").toUpperCase().includes("SPELL") ? "spelling" : "grammar";
  const replacements = (error.replacements || []).slice(0, 5).map((r) => (typeof r === "string" ? r : r.value) ?? "").filter(Boolean);
  const message = error.message ?? error.rule?.description ?? "Error";

  return (
    <div className={`suggestion-card suggestion-card--${type}`}>
      <div className="suggestion-card__text">"{errorText}"</div>
      <div className="suggestion-card__message">{message}</div>
      <div className="suggestion-card__chips">
        {replacements.map((r, i) => (
          <button
            key={i}
            type="button"
            className="suggestion-card__chip"
            onClick={() => onApply(error.offset, error.length, r)}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
