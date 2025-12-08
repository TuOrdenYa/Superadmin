'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <button
        onClick={() => setLocale('es')}
        className={`px-3 py-1 rounded font-semibold text-sm transition ${
          locale === 'es'
            ? 'bg-orange-600 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        🇪🇸 ES
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1 rounded font-semibold text-sm transition ${
          locale === 'en'
            ? 'bg-orange-600 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
