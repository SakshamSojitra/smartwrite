import React from "react";

export default function StatsBar({ wordCount, charCount, readability, errorCount }) {
  return (
    <div className="stats-bar">
      <div className="stats-bar__item">
        <span className="stats-bar__label">Words</span>
        <span className="stats-bar__value">{wordCount}</span>
      </div>
      <div className="stats-bar__item">
        <span className="stats-bar__label">Characters</span>
        <span className="stats-bar__value">{charCount}</span>
      </div>
      <div className="stats-bar__item">
        <span className="stats-bar__label">Readability</span>
        <span className="stats-bar__value">{readability ?? "—"}</span>
      </div>
      <div className="stats-bar__item">
        <span className="stats-bar__label">Errors</span>
        <span className="stats-bar__value">{errorCount}</span>
      </div>
    </div>
  );
}
