"use client";


import { useState } from "react";
import Link from "next/link";
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';


export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitted(false);
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to send reset email.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
      <div className="bg-white rounded-lg shadow-2xl flex max-w-2xl w-full">
        {/* Left side: Logo */}
        <div className="hidden md:flex flex-col items-center justify-center bg-white rounded-l-lg p-8 border-r border-gray-100">
          <img src="/logo-tuordenya-orange.png" alt="TuOrdenYa Logo" className="h-16 w-auto mb-4" />
        </div>
        {/* Right side: Form */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div />
            <LanguageSwitcher />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-black text-left">{t('login.forgotPassword')}</h2>
          {submitted ? (
            <div className="text-green-600 font-semibold text-center mb-4">
              {t('forgotPassword.sentMessage', 'If an account exists for that email, a reset link has been sent.')}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-black mb-2">{t('login.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
                  placeholder={t('registration.emailPlaceholder')}
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
              >
                {t('forgotPassword.sendLink', 'Send Reset Link')}
              </button>
            </form>
          )}
          <div className="mt-6 text-center">
            <Link href="/backoffice/login" className="text-orange-600 hover:underline">{t('login.title')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
