import React from "react";
import SuggestionCard from "./SuggestionCard";

export default function SuggestionPanel({ errors, text, onApply, hasChecked }) {
  return (
    <aside className="suggestion-panel">
      <h3 className="suggestion-panel__title">Corrections & Suggestions</h3>
      <p className="suggestion-panel__hint">
        Click &quot;Check Grammar&quot; to analyze. Hover over highlighted errors for quick suggestions.
      </p>
      <div className="suggestion-panel__list">
        {errors.length === 0 ? (
          <p className={`suggestion-panel__empty ${hasChecked ? "suggestion-panel__empty--success" : ""}`}>
            {hasChecked ? "✓ No errors found! Your text looks good." : 'Click "Check Grammar" to analyze your text.'}
          </p>
        ) : (
          errors.map((err, i) => (
            <SuggestionCard
              key={`${err.offset}-${i}`}
              error={err}
              errorText={text.slice(err.offset, err.offset + err.length)}
              onApply={onApply}
            />
          ))
        )}
      </div>
    </aside>
  );
}
