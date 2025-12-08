'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-gray-300 bg-white p-1">
      <button
        onClick={() => setLocale('es')}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          locale === 'es'
            ? 'bg-[#FF6F3C] text-white'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          locale === 'en'
            ? 'bg-[#FF6F3C] text-white'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        EN
      </button>
    </div>
  );
}
