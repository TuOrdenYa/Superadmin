'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import esMessages from '@/messages/es.json';
import enMessages from '@/messages/en.json';

type Locale = 'es' | 'en';
type Messages = typeof esMessages;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const messages: Record<Locale, Messages> = {
  es: esMessages,
  en: enMessages,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');

  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && (saved === 'es' || saved === 'en')) {
      setLocaleState(saved);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('en')) {
        setLocaleState('en');
      } else {
        setLocaleState('es'); // Default to Spanish
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = messages[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
