import React, { useRef, useCallback } from "react";

/**
 * Highlight overlay - renders error underlines over the textarea
 */
function HighlightOverlay({ text, errors, onSpanHover, onSpanLeave }) {
  const sorted = [...errors].sort((a, b) => a.offset - b.offset);
  let lastIndex = 0;
  const parts = [];

  for (const err of sorted) {
    if (err.offset < lastIndex) continue;
    const before = text.slice(lastIndex, err.offset);
    const errorText = text.slice(err.offset, err.offset + err.length);
    if (before) parts.push({ key: `b-${lastIndex}`, type: "text", content: before });
    const type = (err.rule?.category?.id ?? "").toUpperCase().includes("SPELL") ? "spelling" : "grammar";
    parts.push({ key: `e-${err.offset}`, type: "highlight", content: errorText, errorType: type, err });
    lastIndex = err.offset + err.length;
  }
  if (lastIndex < text.length) parts.push({ key: `e-${lastIndex}`, type: "text", content: text.slice(lastIndex) });

  return (
    <div className="text-editor__overlay" aria-hidden>
      {parts.map((p) =>
        p.type === "text" ? (
          <span key={p.key}>{p.content}</span>
        ) : (
          <span
            key={p.key}
            className={`text-editor__highlight text-editor__highlight--${p.errorType}`}
            onMouseEnter={(e) => onSpanHover?.(e, p.err)}
            onMouseLeave={onSpanLeave}
          >
            {p.content}
          </span>
        )
      )}
    </div>
  );
}

export default function TextEditor({ value, onChange, errors, onSpanHover, onSpanLeave, placeholder, disabled }) {
  const textareaRef = useRef(null);

  const handleScroll = useCallback(() => {
    const wrapper = textareaRef.current?.parentElement;
    const overlay = wrapper?.querySelector(".text-editor__overlay");
    if (overlay) overlay.scrollTop = textareaRef.current.scrollTop;
  }, []);

  return (
    <div className="text-editor">
      <div className="text-editor__wrapper">
        {value && errors.length > 0 && (
          <HighlightOverlay text={value} errors={errors} onSpanHover={onSpanHover} onSpanLeave={onSpanLeave} />
        )}
        <textarea
          ref={textareaRef}
          className="text-editor__input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          disabled={disabled}
          spellCheck={false}
          rows={12}
        />
      </div>
    </div>
  );
}
