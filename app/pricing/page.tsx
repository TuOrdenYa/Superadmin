'use client';

import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

export default function PricingPage() {
  const { t, locale } = useLanguage();
  
  const tiers = [
    {
      name: 'Light',
      price: locale === 'es' ? 'Gratis' : 'Free',
      color: 'gray',
      description: locale === 'es' ? 'Perfecto para comenzar con menús digitales' : 'Perfect for getting started with digital menus',
      features: [
        { name: locale === 'es' ? 'Menú Digital' : 'Digital Menu', included: true },
        { name: locale === 'es' ? 'Código QR' : 'QR Code', included: true },
        { name: locale === 'es' ? 'Categorías Básicas' : 'Basic Categories', included: true },
        { name: locale === 'es' ? 'Items de Menú Ilimitados' : 'Unlimited Menu Items', included: true },
        { name: locale === 'es' ? 'Diseño Responsive' : 'Responsive Design', included: true },
        { name: locale === 'es' ? 'Gestión de Pedidos' : 'Order Management', included: false },
        { name: locale === 'es' ? 'Gestión de Mesas' : 'Table Management', included: false },
        { name: locale === 'es' ? 'Variantes de Productos' : 'Product Variants', included: false },
        { name: locale === 'es' ? 'Reportes Avanzados' : 'Advanced Reports', included: false },
        { name: locale === 'es' ? 'Multi-Sucursal' : 'Multi-Location', included: false },
      ],
    },
    {
      name: 'Plus',
      price: '$29',
      priceNote: locale === 'es' ? '/mes' : '/mo',
      color: 'blue',
      description: locale === 'es' ? 'Todo en Light, más gestión de pedidos' : 'Everything in Light, plus order management',
      popular: true,
      features: [
        { name: locale === 'es' ? 'Todo en Light' : 'Everything in Light', included: true },
        { name: locale === 'es' ? 'Gestión de Pedidos' : 'Order Management', included: true },
        { name: locale === 'es' ? 'Sistema de Cocina (KDS)' : 'Kitchen Display System', included: true },
        { name: locale === 'es' ? 'Historial y Reportes' : 'History & Reports', included: true },
        { name: locale === 'es' ? 'Gestión de Clientes' : 'Customer Management', included: true },
        { name: locale === 'es' ? 'Analíticas Básicas' : 'Basic Analytics', included: true },
        { name: locale === 'es' ? 'Gestión de Mesas' : 'Table Management', included: false },
        { name: locale === 'es' ? 'Variantes de Productos' : 'Product Variants', included: false },
        { name: locale === 'es' ? 'Reportes Avanzados' : 'Advanced Reports', included: false },
        { name: locale === 'es' ? 'Multi-Sucursal' : 'Multi-Location', included: false },
      ],
    },
    {
      name: 'Pro',
      price: '$79',
      priceNote: locale === 'es' ? '/mes' : '/mo',
      color: 'purple',
      description: locale === 'es' ? 'Solución completa para restaurantes' : 'Complete solution for restaurants',
      features: [
        { name: locale === 'es' ? 'Todo en Plus' : 'Everything in Plus', included: true },
        { name: locale === 'es' ? 'Gestión de Mesas' : 'Table Management', included: true },
        { name: locale === 'es' ? 'Variantes y Opciones' : 'Variants & Options', included: true },
        { name: locale === 'es' ? 'Multi-Sucursal' : 'Multi-Location', included: true },
        { name: locale === 'es' ? 'Analíticas Avanzadas' : 'Advanced Analytics', included: true },
        { name: locale === 'es' ? 'Gestión de Personal' : 'Staff Management', included: true },
        { name: locale === 'es' ? 'Control de Inventario' : 'Inventory Control', included: true },
        { name: locale === 'es' ? 'Soporte Prioritario' : 'Priority Support', included: true },
        { name: locale === 'es' ? 'Marca Personalizada' : 'Custom Branding', included: true },
        { name: locale === 'es' ? 'Acceso API' : 'API Access', included: true },
      ],
    },
  ];

  const colorClasses = {
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      badge: 'bg-gray-600',
      button: 'bg-gray-600 hover:bg-gray-700',
    },
    blue: {
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      badge: 'bg-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-300',
      badge: 'bg-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Language Switcher */}
        <div className="flex justify-end mb-6">
          <LanguageSwitcher />
        </div>
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier) => {
            const colors = colorClasses[tier.color as keyof typeof colorClasses];
            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl shadow-xl overflow-hidden border-2 ${
                  tier.popular ? 'ring-4 ring-blue-500 ring-opacity-50' : colors.border
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-orange-600 text-white px-4 py-1 text-sm font-bold">
                    POPULAR
                  </div>
                )}
                
                <div className={`${colors.bg} p-8`}>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                    <span className={`px-2 py-1 ${colors.badge} text-white text-xs font-bold rounded`}>
                      {tier.name.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-bold text-gray-900">{tier.price}</span>
                    {tier.priceNote && (
                      <span className="text-gray-600 ml-2">{tier.priceNote}</span>
                    )}
                  </div>
                  <button
                    className={`w-full ${colors.button} text-white py-3 rounded-lg font-semibold transition`}
                  >
                    {tier.name === 'Light' ? t('pricing.getStarted') : t('pricing.contactSales')}
                  </button>
                </div>

                <div className="bg-white p-8">
                  <h4 className="font-bold text-gray-900 mb-4">{t('pricing.featuresIncluded')}</h4>
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        {feature.included ? (
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('pricing.needHelp')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
            <div>
              <h3 className="font-bold text-lg mb-2">{t('pricing.startWithLight')}</h3>
              <ul className="space-y-2 ml-4">
                <li>• {locale === 'es' ? 'Solo necesitas un menú digital' : 'You only need a digital menu'}</li>
                <li>• {locale === 'es' ? 'Quieres pedidos con código QR' : 'You want QR code ordering'}</li>
                <li>• {locale === 'es' ? 'Recién estás comenzando' : "You're just getting started"}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">{t('pricing.upgradeToPlus')}</h3>
              <ul className="space-y-2 ml-4">
                <li>• {locale === 'es' ? 'Quieres gestionar pedidos digitalmente' : 'You want to manage orders digitally'}</li>
                <li>• {locale === 'es' ? 'Necesitas sistema de pantalla de cocina' : 'You need kitchen display system'}</li>
                <li>• {locale === 'es' ? 'Quieres análisis de pedidos' : 'You want order analytics'}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">{t('pricing.choosePro')}</h3>
              <ul className="space-y-2 ml-4">
                <li>• {locale === 'es' ? 'Necesitas gestión de mesas' : 'You need table management'}</li>
                <li>• {locale === 'es' ? 'Ofreces personalizaciones de productos' : 'You offer product customizations'}</li>
                <li>• {locale === 'es' ? 'Tienes múltiples ubicaciones' : 'You have multiple locations'}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">{t('pricing.questions')}</h3>
              <p className="text-gray-600">
                {t('pricing.contactAdmin')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
