'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
const esMessages = require('../messages/es.json');
const enMessages = require('../messages/en.json');

type Locale = 'es' | 'en';
type Messages = typeof esMessages;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const messages: Record<Locale, Messages> = {
  es: esMessages,
  en: enMessages,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');
  const [currentMessages, setCurrentMessages] = useState<Messages>(esMessages);

  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem('locale') as Locale;
    let detectedLocale: Locale = 'es';
    if (saved && (saved === 'es' || saved === 'en')) {
      detectedLocale = saved;
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('en')) {
        detectedLocale = 'en';
      }
    }
    setLocaleState(detectedLocale);
    setCurrentMessages(detectedLocale === 'en' ? enMessages : esMessages);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setCurrentMessages(newLocale === 'en' ? enMessages : esMessages);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = currentMessages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || (fallback !== undefined ? fallback : key);
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
