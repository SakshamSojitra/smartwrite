import React from "react";

export default function Tooltip({ visible, message, suggestions, x, y }) {
  const text = suggestions?.slice(0, 3).map((s) => (typeof s === "string" ? s : s.value) ?? "").filter(Boolean).join(", ") || message;
  if (!visible || !text) return null;

  return (
    <div className="tooltip" style={{ left: x, top: y + 20 }} role="tooltip">
      {text}
    </div>
  );
}
