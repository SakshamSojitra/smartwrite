import React, { useRef, useState } from 'react';

export default function CheckGrammarButton({ label = 'Check Grammar', onClick, onClear }) {
  const btnRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!btnRef.current || isFocused) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => !isFocused && setOpacity(0);

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={btnRef}
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        type="button"
        className="relative inline-flex w-fit h-12 items-center justify-center overflow-hidden rounded-full px-6 font-medium whitespace-nowrap transition-colors focus:outline-none bg-gradient-to-r from-[#9ba3fd] to-[#3d5af1]"
        style={{
          border: '2px solid rgba(0,0,0,0.08)',
          boxShadow: '0 10px 30px rgba(61,90,241,0.14)',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
          style={{
            opacity,
            background: `radial-gradient(100px circle at ${position.x}px ${position.y}px, rgba(101,111,226,0.55), rgba(61,90,241,0.12))`,
          }}
        />

        <span className="relative z-10" style={{ lineHeight: '1' }}>{label}</span>
      </button>

      {onClear ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClear();
          }}
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-blue-600 border border-blue-200 h-6 px-2 text-xs rounded-full"
          style={{
            zIndex: 30,
          }}
          aria-label="Clear text"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}
