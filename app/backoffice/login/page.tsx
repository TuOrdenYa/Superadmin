"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import Turnstile from '@/app/components/Turnstile';
import { useLanguage } from '@/lib/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_tax_id: tenantId,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.ok && data.token) {
        // Store token
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to backoffice
        const tenantId = data.user.tenant_id;
        router.push(`/backoffice/${tenantId}`);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <img src="/logo-tuordenya-orange.png" alt="TuOrdenYa Logo" className="h-12 w-auto" />
          <LanguageSwitcher />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">{t('login.title')}</h1>
          <p className="text-black">{t('login.subtitle')}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              {t('login.tenantId')}
            </label>
            <input
              type="text"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
              placeholder={t('login.tenantIdPlaceholder')}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              {t('login.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
              placeholder={t('login.emailPlaceholder')}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              {t('login.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
              placeholder={t('login.passwordPlaceholder')}
              required
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {/* Cloudflare Turnstile */}
          <div className="mb-4">
            <Turnstile siteKey="0x4AAAAAACF8ADIKXca1zxCC" onSuccess={(token) => { /* Optionally handle token */ }} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t('login.signingIn') : t('login.signIn')}
          </button>
        </form>
        <div className="mt-6 text-center">
          <div className="flex flex-col gap-2 mt-6">
            <button
              type="button"
              className="w-full px-6 py-2 bg-gray-100 text-blue-700 rounded-lg hover:bg-blue-50 font-medium transition-colors"
              // TODO: Add forgot password logic here
            >
              {t('login.forgotPassword')}
            </button>
            <button
              type="button"
              className="w-full px-6 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 font-medium transition-colors"
              onClick={() => router.push('/backoffice/registration')}
            >
              {t('login.register')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
