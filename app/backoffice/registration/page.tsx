"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import Turnstile from "@/app/components/Turnstile";
import { useLanguage } from "@/lib/LanguageContext";

export default function RegistrationPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    restaurant: "",
    tenantId: "",
    mobile: ""
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/register-tenant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      // Optionally handle error
      alert('Registration failed. Please try again.');
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
          {submitted ? (
            <div className="text-center">
              <p className="mb-4 text-green-600 font-semibold">{t('registration.success')}</p>
              <Link href="/backoffice/login" className="text-orange-600 hover:underline">{t('registration.goToLogin')}</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                          {/* Cloudflare Turnstile */}
                          <div className="mb-4">
                            <Turnstile siteKey="0x4AAAAAACF8ADIKXca1zxCC" onSuccess={(token) => { /* Optionally handle token */ }} />
                          </div>
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
