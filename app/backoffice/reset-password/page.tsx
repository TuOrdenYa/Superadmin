"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

function ResetPasswordPageInner() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitted(false);
    setLoading(true);
    if (!password || password.length < 8) {
      setError(t('registration.password') + ": min 8 characters");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError(t('resetPassword.noMatch', 'Passwords do not match'));
      setLoading(false);
      return;
    }
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || t('resetPassword.failed', 'Failed to reset password.'));
    }
    setLoading(false);
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
          <h2 className="text-2xl font-bold mb-4 text-black text-left">{t('resetPassword.title', 'Reset Password')}</h2>
          {submitted ? (
            <div className="text-green-600 font-semibold text-center mb-4">
              {t('resetPassword.success', 'Your password has been reset. You may now log in.')}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-black mb-2">{t('registration.password')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
                  placeholder={t('registration.passwordPlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">{t('resetPassword.confirm', 'Confirm Password')}</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
                  placeholder={t('resetPassword.confirmPlaceholder', 'Re-enter your new password')}
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('resetPassword.submit', 'Reset Password')}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordPageInner />
    </Suspense>
  );
}
