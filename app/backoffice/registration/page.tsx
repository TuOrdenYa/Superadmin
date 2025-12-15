
"use client";
export const dynamic = "force-dynamic";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import Turnstile, { TurnstileHandle } from "@/app/components/Turnstile";
import { useLanguage } from "@/lib/LanguageContext";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

console.log("TURNSTILE_SITE_KEY value:", TURNSTILE_SITE_KEY, typeof TURNSTILE_SITE_KEY);
export default function RegistrationPage() {
  if (!TURNSTILE_SITE_KEY || typeof TURNSTILE_SITE_KEY !== 'string') {
    console.warn('Turnstile site key is missing or not a string! Check NEXT_PUBLIC_TURNSTILE_SITE_KEY in your environment.');
  }
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    restaurant: "",
    tenantId: "",
    mobile: "",
    preferred_language: "es"
  });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Memoized callback for Turnstile
  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!turnstileToken) {
      setError('Please complete the Turnstile challenge.');
      if (turnstileRef.current) turnstileRef.current.reset();
      return;
    }
    const res = await fetch('/api/register-tenant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, turnstileToken }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Registration failed. Please try again.');
      if (turnstileRef.current) turnstileRef.current.reset();
      setForm(f => ({ ...f, turnstileToken: "" }));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <img src="/logo-tuordenya-orange.png" alt="TuOrdenYa Logo" className="h-12 w-auto" />
          <LanguageSwitcher />
        </div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">{t('registration.title')}</h2>
          <p className="text-black">{t('registration.subtitle')}</p>
        </div>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {submitted ? (
          <div className="text-center">
            <p className="mb-4 text-green-600 font-semibold">{t('registration.success')}</p>
            <Link href="/backoffice/login" className="text-orange-600 hover:underline">{t('registration.goToLogin')}</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-black mb-2">{t('registration.tenantId')}</label>
              <input
                type="text"
                name="tenantId"
                value={form.tenantId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
                placeholder={t('registration.tenantIdPlaceholder')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">{t('registration.name')}</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
                placeholder={t('registration.namePlaceholder')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">{t('registration.email')}</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
                placeholder={t('registration.emailPlaceholder')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">{t('registration.password')}</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
                placeholder={t('registration.passwordPlaceholder')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">{t('registration.restaurant')}</label>
              <input
                type="text"
                name="restaurant"
                value={form.restaurant}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
                placeholder={t('registration.restaurantPlaceholder')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">{t('registration.mobile')}</label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
                placeholder={t('registration.mobilePlaceholder')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">{t('registration.language')}</label>
              <select
                name="preferred_language"
                value={form.preferred_language}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            {/* Cloudflare Turnstile */}
            <div className="mb-4">
              <Turnstile ref={turnstileRef} siteKey={TURNSTILE_SITE_KEY} onSuccess={handleTurnstileSuccess} />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
            >
              {t('registration.register')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
