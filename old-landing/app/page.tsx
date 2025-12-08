import MarketingLayout from "../components/layout/MarketingLayout";

import HeroSection from "../components/landing/HeroSection";
import BenefitsSection from "../components/landing/BenefitsSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import ProDetailsSection from "../components/landing/ProDetailsSection";
import ProductsSection from "../components/landing/ProductsSection";
import FAQSection from "../components/landing/FAQSection";
import ContactSection from "../components/landing/ContactSection";
import dynamic from "next/dynamic";

// Below-the-fold sections lazily loaded; SSR retained for compatibility
const IntegrationsSection = dynamic(() => import("../components/landing/IntegrationsSection"), {
  loading: () => <div className="py-12 text-sm text-slate-500">Cargando integraciones…</div>,
});
const TestimonialsSection = dynamic(() => import("../components/landing/TestimonialsSection"), {
  loading: () => <div className="py-12 text-sm text-slate-500">Cargando testimonios…</div>,
});

export default function LandingPage() {
  return (
    <MarketingLayout>
      {/* HERO */}
      <HeroSection />

      {/* BENEFICIOS */}
      <BenefitsSection />

      {/* CÓMO FUNCIONA */}
      <HowItWorksSection />

      {/* PRO DETALLADO */}
      <ProDetailsSection />

      {/* INTEGRACIONES (lazy) */}
      <IntegrationsSection />

      {/* PRODUCTOS */}
      <ProductsSection />

      {/* TESTIMONIOS (lazy) */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* CONTACTO */}
      <ContactSection />
    </MarketingLayout>
  );
}
