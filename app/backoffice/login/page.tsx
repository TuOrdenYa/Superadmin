'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

export default function BackofficeLoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('1'); // Allow user to select
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
          tenant_id: parseInt(tenantId),
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
        <div className="flex justify-end mb-4">
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
              type="number"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-semibold"
              placeholder={t('login.tenantIdPlaceholder')}
              required
              min="1"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t('login.signingIn') : t('login.signIn')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-black font-semibold">
            {t('login.demoCredentials')}
          </p>
        </div>
      </div>
    </div>
  );
}
