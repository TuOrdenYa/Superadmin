"use client";
import { useState, useEffect } from "react";

export default function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className={`ml-4 px-3 py-1 rounded-full border border-gray-300 bg-white text-xs font-medium flex items-center gap-2 transition-colors ${dark ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}
      aria-label="Cambiar tema"
    >
      {dark ? "🌚" : "🌞"}
    </button>
  );
}
