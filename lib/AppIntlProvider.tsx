"use client";
import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';

export default function AppIntlProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState({});
  const [locale, setLocale] = useState('es');

  useEffect(() => {
    const storedLocale = localStorage.getItem('locale') || 'es';
    setLocale(storedLocale);
    import(`../messages/${storedLocale}.json`).then((mod) => setMessages(mod.default));
  }, []);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
