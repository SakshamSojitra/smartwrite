import React from "react";
import { AnimatedText } from "./ui/animated-text";

export default function Header() {
  return (
    <header className="header">
      <AnimatedText
        text="SmartWrite"
        gradientColors="linear-gradient(90deg, #2563eb, #fff, #2563eb)"
        gradientAnimationDuration={2}
        hoverEffect
        className="py-2"
        textClassName="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-bold"
      />
      <p className="header__tagline">Intelligent Grammar & Spell Checker</p>
    </header>
  );
}
