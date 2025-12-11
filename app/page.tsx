"use client";

import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import MobileMenu from "@/app/components/MobileMenu";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function LandingPage() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between w-full">
            {/* Logo and Tagline - always visible, left-aligned */}
            <Link href="/" className="flex items-center gap-3 min-w-0">
              <Image 
                src="/logo-tuordenya-orange.png" 
                alt="TuOrdenYa Logo" 
                width={40} 
                height={40}
                className="h-10 w-auto flex-shrink-0"
              />
              <span
                className="font-bold text-gray-700 text-base md:text-lg leading-tight min-w-0 block"
                style={{
                  wordBreak: 'keep-all',
                  maxWidth: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'inline-block'
                }}
              >
                <span className="hidden md:inline">{t('landing.tagline')}</span>
                <span className="md:hidden" style={{fontSize: '0.95rem', whiteSpace: 'normal'}}>
                  {t('landing.tagline')}
                </span>
              </span>
            </Link>
            {/* Hamburger for mobile - visible only on mobile */}
            <button
              className="md:hidden text-3xl text-gray-700 p-2 ml-auto"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
            {/* Desktop nav - right-aligned */}
            <nav className="hidden md:flex items-center gap-6 justify-end">
              {/* Products Dropdown */}
              {/* Products Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className="text-gray-700 hover:text-orange-600 font-medium flex items-center gap-1"
                >
                  {t('landing.products')}
                  <svg className={`w-4 h-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isProductsOpen && (
                  <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]">
                    <Link href="/pricing#light" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                      {t('tiers.light')} — {t('landing.menuQR')}
                    </Link>
                    <Link href="/pricing#plus" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                      {t('tiers.plus')} — {t('landing.ordersReports')}
                    </Link>
                    <Link href="/pricing#pro" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                      {t('tiers.pro')} — {t('landing.fullOperation')}
                    </Link>
                  </div>
                )}
              </div>

              <Link href="#faq" className="text-gray-700 hover:text-orange-600 font-medium">
                {t('landing.faqs')}
              </Link>
              <Link href="/backoffice/login" className="text-gray-700 hover:text-orange-600 font-medium">
                {t('landing.login')}
              </Link>
              <Link 
                href="/backoffice" 
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                {t('landing.startFree')}
              </Link>
              <LanguageSwitcher />
              <ThemeSwitcher />
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" key={locale}>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {t('landing.heroTitle')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-700">
              {t('landing.heroSubtitle')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('landing.heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/backoffice"
                className="px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-lg font-semibold"
              >
                {t('landing.startFreeCTA')}
              </Link>
            <Link 
              href="/pricing"
              className="px-8 py-4 bg-white text-orange-600 border-2 border-orange-600 rounded-lg hover:bg-orange-50 transition text-lg font-semibold"
            >
              {t('landing.viewPlans')}
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {t('landing.heroNote')}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white rounded-3xl shadow-xl my-12">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {t('landing.featuresTitle')}
          </h3>
          <p className="text-xl text-gray-600">
            {t('landing.featuresSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">📱</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">{t('landing.feature1Title')}</h4>
            <p className="text-gray-600">{t('landing.feature1Desc')}</p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">🍽️</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">{t('landing.feature2Title')}</h4>
            <p className="text-gray-600">{t('landing.feature2Desc')}</p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">📊</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">{t('landing.feature3Title')}</h4>
            <p className="text-gray-600">{t('landing.feature3Desc')}</p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">🪑</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">{t('landing.feature4Title')}</h4>
            <p className="text-gray-600">{t('landing.feature4Desc')}</p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">🎨</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">{t('landing.feature5Title')}</h4>
            <p className="text-gray-600">{t('landing.feature5Desc')}</p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-2xl">
            <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">🌎</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">{t('landing.feature6Title')}</h4>
            <p className="text-gray-600">{t('landing.feature6Desc')}</p>
          </div>
        </div>
      </section>

      {/* Pricing Teaser - reverted to hardcoded bilingual content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Debug log for translation function and locale */}
                {(() => {
                  if (typeof window !== 'undefined') {
                    console.log('DEBUG pricingTitle:', t('landing.pricingTitle'));
                    console.log('DEBUG locale:', locale);
                  }
                  return null;
                })()}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {t('landing.pricingTitle')}
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Light */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200 flex flex-col h-full">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{t('tiers.light')}</h4>
              <p className="text-4xl font-bold text-gray-900 mb-4">{t('landing.lightPrice')}</p>
              <p className="text-gray-600 mb-6">{t('pricing.startWithLight')}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{t('landing.lightFeature1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{t('landing.lightFeature2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{t('landing.lightFeature3')}</span>
                </li>
              </ul>
            </div>
            <div className="mt-auto">
              <Link 
                href="https://app.tuordenya.com/backoffice"
                className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                {t('landing.startFree')}
              </Link>
            </div>
          </div>

          {/* Plus */}
          <div className="bg-orange-600 p-8 rounded-2xl shadow-xl border-2 border-orange-700 transform scale-105 flex flex-col h-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-2xl font-bold text-white">{t('tiers.plus')}</h4>
                <span className="px-3 py-1 bg-white text-orange-600 text-xs font-bold rounded-full">
                  {t('landing.popular')}
                </span>
              </div>
              <p className="text-4xl font-bold text-white mb-4">{t('landing.plusPrice')}</p>
              <p className="text-orange-100 mb-6">{t('pricing.upgradeToPlus')}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span className="text-white">{t('landing.plusFeature1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span className="text-white">{t('landing.plusFeature2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span className="text-white">{t('landing.plusFeature3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span className="text-white">{t('landing.plusFeature4')}</span>
                </li>
              </ul>
            </div>
            <div className="mt-auto">
              <Link 
                href="/pricing"
                className="block w-full text-center px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                {t('landing.choosePlus')}
              </Link>
            </div>
          </div>

          {/* Pro */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200 flex flex-col h-full">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{t('tiers.pro')}</h4>
              <p className="text-4xl font-bold text-gray-900 mb-4">{t('landing.proPrice')}</p>
              <p className="text-gray-600 mb-6">{t('pricing.choosePro')}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{t('landing.proFeature1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{t('landing.proFeature2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{t('landing.proFeature3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{t('landing.proFeature4')}</span>
                </li>
              </ul>
            </div>
            <div className="mt-auto">
              <Link 
                href="/pricing"
                className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                {t('landing.choosePro')}
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/pricing"
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            {t('landing.comparePlansButton')}
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-3xl p-12 text-center text-white shadow-2xl flex flex-col h-full">
          <h3 className="text-3xl font-bold mb-4">
            {t('landing.finalCtaTitle')}
          </h3>
          <p className="text-xl mb-8 text-orange-100">
            {t('landing.finalCtaDesc')}
          </p>
          <div className="mt-auto">
            <Link 
              href="https://app.tuordenya.com/backoffice"
              className="inline-block px-8 py-4 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition text-lg font-semibold"
            >
              {t('landing.finalCtaButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <Image 
                  src="/logo-tuordenya-orange.png" 
                  alt="TuOrdenYa Logo" 
                  width={32} 
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {t('landing.companyInfo')}
              </p>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">{t('landing.footerProducts')}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/pricing#light" className="text-gray-600 hover:text-orange-600">
                    {t('landing.footerLight')}
                  </Link>
                </li>
                <li>
                  <Link href="/pricing#plus" className="text-gray-600 hover:text-orange-600">
                    {t('landing.footerPlus')}
                  </Link>
                </li>
                <li>
                  <Link href="/pricing#pro" className="text-gray-600 hover:text-orange-600">
                    {t('landing.footerPro')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">{t('landing.footerCompany')}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#faq" className="text-gray-600 hover:text-orange-600">
                    {t('landing.footerFaqs')}
                  </Link>
                </li>
                <li>
                  <Link href="/backoffice/login" className="text-gray-600 hover:text-orange-600">
                    {t('landing.footerLogin')}
                  </Link>
                </li>
                <li>
                  <Link href="/backoffice" className="text-gray-600 hover:text-orange-600">
                    {t('landing.footerRegister')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>© {new Date().getFullYear()} TuOrdenYa. {t('landing.footerCopyright')}</p>
            <div className="flex gap-4">
                <Link href="#productos" className="hover:text-orange-600">
                  {t('landing.footerProducts')}
                </Link>
                <Link href="#faq" className="hover:text-orange-600">
                  {t('landing.footerFaq')}
                </Link>
                <Link href="#contacto" className="hover:text-orange-600">
                  {t('landing.footerContact')}
                </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
