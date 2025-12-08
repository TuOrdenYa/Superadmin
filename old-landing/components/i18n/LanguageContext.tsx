"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";

import type { HomeContent, Locale } from "../../locales/types";
import { homeEs } from "../../locales/es/home";
import { homeEn } from "../../locales/en/home";

import { benefitsEs } from "../../locales/es/benefits";
import { benefitsEn } from "../../locales/en/benefits";

import { integrationsEs } from "../../locales/es/integrations";
import { integrationsEn } from "../../locales/en/integrations";

/* ===============================================
   TIPOS DEL CONTEXTO
   =============================================== */
type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;

  home: HomeContent;
  benefits: typeof benefitsEs;
  integrations: typeof integrationsEs;
};

/* ===============================================
   CREACIÓN DEL CONTEXTO
   =============================================== */
const I18nContext = createContext<I18nContextValue | undefined>(undefined);

/* ===============================================
   PROVIDER
   =============================================== */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es");

  // Detectar idioma del navegador (opcional)
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const lang = navigator.language.slice(0, 2).toLowerCase();
      if (lang === "en") setLocale("en");
    }
  }, []);

  // Selección de textos por idioma
  const home = locale === "es" ? homeEs : homeEn;
  const benefits = locale === "es" ? benefitsEs : benefitsEn;
  const integrations = locale === "es" ? integrationsEs : integrationsEn;

  // Memo del valor del Provider para evitar renders innecesarios
  const value = useMemo(
    () => ({
      locale,
      setLocale,
      home,
      benefits,
      integrations,
    }),
    [locale, home, benefits, integrations]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/* ===============================================
   HOOK useI18n
   =============================================== */
export function useI18n() {
  const ctx = useContext(I18nContext);

  if (!ctx) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }

  return ctx;
}
