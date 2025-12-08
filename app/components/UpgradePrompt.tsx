'use client';

import { ProductTier } from '@/lib/product-tiers';
import { useLanguage } from '@/lib/LanguageContext';

interface UpgradePromptProps {
  feature: string;
  currentTier: ProductTier;
  requiredTier?: 'plus' | 'pro';
  message?: string;
}

export default function UpgradePrompt({ 
  feature, 
  currentTier, 
  requiredTier = 'pro',
  message 
}: UpgradePromptProps) {
  const { t, locale } = useLanguage();
  
  const tierColors = {
    light: 'bg-gray-100 border-gray-300',
    plus: 'bg-orange-50 border-orange-300',
    pro: 'bg-purple-50 border-purple-300',
  };

  const requiredTierColors = {
    plus: 'bg-orange-600',
    pro: 'bg-purple-600',
  };

  const defaultMessage = message || 
    (locale === 'es' 
      ? `Esta función requiere el plan ${requiredTier.toUpperCase()}. Por favor contacte a su administrador para actualizar.`
      : `This feature requires the ${requiredTier.toUpperCase()} plan. Please contact your administrator to upgrade.`
    );

  return (
    <div className={`border-2 rounded-lg p-6 ${tierColors[currentTier]}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg 
            className="w-12 h-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            🔒 {t('upgrade.featureLocked')}
          </h3>
          <p className="text-gray-700 mb-4">
            {defaultMessage}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{t('upgrade.current')}</span>
              <span className={`px-3 py-1 text-xs font-bold rounded border-2 ${
                currentTier === 'pro' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                currentTier === 'plus' ? 'bg-orange-100 text-orange-900 border-orange-300' :
                'bg-gray-100 text-gray-900 border-gray-300'
              }`}>
                {currentTier.toUpperCase()}
              </span>
            </div>
            <div className="text-gray-900 text-xl">→</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{t('upgrade.required')}</span>
              <span className={`px-3 py-1 text-xs font-bold rounded text-white ${requiredTierColors[requiredTier]}`}>
                {requiredTier.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <a 
              href="/pricing" 
              className="inline-block bg-gradient-to-r from-orange-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
            >
              {t('upgrade.viewOptions')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
