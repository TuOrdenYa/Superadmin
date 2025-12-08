'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

interface AnalyticsData {
  usage: {
    feature_name: string;
    action_type: string;
    total_usage: number;
  }[];
  suggestions: {
    currentTier: string;
    suggestedTier?: string;
    reasons: string[];
  };
}

export default function SubscriptionPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [tenantId, setTenantId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get tenant ID from localStorage (same as backoffice)
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('user');
        
        if (!token || !userStr) {
          router.push('/backoffice/login');
          return;
        }

        const userData = JSON.parse(userStr);
        setTenantId(userData.tenant_id);
      } catch (error) {
        router.push('/backoffice/login');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (tenantId) {
      fetchAnalytics();
    }
  }, [tenantId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/analytics?tenant_id=${tenantId}`);
      const data = await res.json();
      if (data.ok) {
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestUpgrade = () => {
    alert(t('subscription.requestUpgrade') + ' ' + suggestedTier?.toUpperCase() + '!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  const currentTier = analytics?.suggestions.currentTier || 'light';
  const suggestedTier = analytics?.suggestions.suggestedTier;

  const tierInfo = {
    light: {
      name: 'Light',
      color: 'gray',
      features: locale === 'es' 
        ? ['Menú Digital', 'Códigos QR', 'Categorías Básicas']
        : ['Digital Menu', 'QR Codes', 'Basic Categories'],
    },
    plus: {
      name: 'Plus',
      color: 'blue',
      features: locale === 'es'
        ? ['Todo en Light', 'Gestión de Pedidos', 'Pantalla de Cocina', 'Reportes']
        : ['Everything in Light', 'Order Management', 'Kitchen Display', 'Reports'],
    },
    pro: {
      name: 'Pro',
      color: 'purple',
      features: locale === 'es'
        ? ['Todo en Plus', 'Gestión de Mesas', 'Variantes', 'Multi-Sucursal', 'Análisis Avanzados']
        : ['Everything in Plus', 'Table Management', 'Variants', 'Multi-Location', 'Advanced Analytics'],
    },
  };

  const current = tierInfo[currentTier as keyof typeof tierInfo];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{t('subscription.title')}</h1>
            <p className="text-gray-600 mt-2">{t('subscription.subtitle')}</p>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Current Plan */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('subscription.currentPlan')}</h2>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-lg font-bold text-lg ${
                  currentTier === 'pro' ? 'bg-purple-100 text-purple-700' :
                  currentTier === 'plus' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {current.name.toUpperCase()}
                </span>
                <span className="text-green-600 font-semibold">✓ {t('common.active')}</span>
              </div>
            </div>
            <a
              href="/pricing"
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
            >
              {t('subscription.viewAllPlans')}
            </a>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold text-gray-900 mb-3">{t('subscription.yourFeatures')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {current.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade Suggestion */}
        {suggestedTier && analytics?.suggestions.reasons.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl shadow-lg p-8 mb-8 border-2 border-orange-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('subscription.upgradeRecommended')} {suggestedTier.toUpperCase()}
                </h3>
                <p className="text-gray-700 mb-4">{t('subscription.basedOnUsage')}</p>
                <ul className="space-y-2 mb-6">
                  {analytics.suggestions.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-orange-600">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleRequestUpgrade}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
                >
                  {t('subscription.requestUpgrade')} {suggestedTier.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Usage Analytics */}
        {analytics && analytics.usage.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('subscription.usageAnalytics')}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('subscription.feature')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('subscription.action')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('subscription.usageCount')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.usage.slice(0, 10).map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.feature_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.action_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                        {item.total_usage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
