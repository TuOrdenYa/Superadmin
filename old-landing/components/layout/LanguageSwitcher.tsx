"use client";

import { useI18n } from "@/components/i18n/LanguageContext";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-700/70 bg-slate-900/60 p-1">
      <button
        type="button"
        onClick={() => setLocale("es")}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          locale === "es"
            ? "bg-[#FF6F3C] text-slate-950"
            : "text-slate-400 hover:text-slate-200"
        }`}
        aria-label="Español"
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          locale === "en"
            ? "bg-[#FF6F3C] text-slate-950"
            : "text-slate-400 hover:text-slate-200"
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
