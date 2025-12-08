// locales/types.ts

export type Locale = "es" | "en";

export type ProductVariant = "light" | "plus" | "pro";

export type ProductContent = {
  id: string;
  variant: ProductVariant;
  label: string;
  title: string;
  description: string;
  bullets: string[];
  bottomNote?: string;
  recommended?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};

export type NavbarContent = {
  subtitle: string;
  backToHome: string;
  howItWorks: string;
  products: string;
  faq: string;
  demo: string;
  light: string;
  plus: string;
  pro: string;
};

export type HeroContent = {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  planCtaLabel: {
    Light: string;
    Plus: string;
    Pro: string;
  };
  secondaryCta: string;
  segments: string[];
  summary?: HeroSummaryContent;
};

export type HeroSummaryContent = {
  suiteLabel: string;
  title: string;
  chip: string;
  lightTitle: string;
  lightChip: string;
  lightText: string;
  plusTitle: string;
  plusChip: string;
  plusText: string;
  proTitle: string;
  proChip: string;
  proText: string;
  footer: string;
};

export type BenefitsSectionColumn = {
  items: string[];
};

export type BenefitsSectionContent = {
  title: string;
  subtitle: string;
  columns: BenefitsSectionColumn[];
};

export type IntegrationsCardContent = {
  title: string;
  description: string;
};

export type IntegrationsSectionContent = {
  title: string;
  subtitle: string;
  cards: IntegrationsCardContent[];
};

export type ProductsSectionContent = {
  title: string;
  subtitle: string;
  products: ProductContent[];
  recommendedLabel?: string;
};

export type ContactSectionFormInterestOption = {
  value: string; // "light" | "plus" | "pro" | "unsure"
  label: string;
};

export type ContactSectionFormContent = {
  nameLabel: string;
  namePlaceholder: string;
  restaurantLabel: string;
  restaurantPlaceholder: string;
  whatsappLabel: string;
  whatsappPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  interestLabel: string;
  interestPlaceholder: string;
  interestOptions: ContactSectionFormInterestOption[];
  notesLabel: string;
  notesPlaceholder: string;
  submitLabel: string;
  submitLabelLoading?: string;
  privacyNotice: string;
  whatsappIntro?: string;
  sourceLabel?: string;
};

export type ContactSectionContent = {
  title: string;
  subtitle: string;
  bullets: string[];
  form: ContactSectionFormContent;
};

export type FAQItemContent = {
  question: string;
  answer: string;
};

export type FAQSectionContent = {
  title: string;
  subtitle: string;
  items: FAQItemContent[];
};

export type HowItWorksStepContent = {
  label: string; // "1", "2", "3"
  title: string;
  description: string;
};

export type HowItWorksSectionContent = {
  title: string;
  subtitle: string;
  steps: HowItWorksStepContent[];
};

export type ProDetailsCardContent = {
  title: string;
  badge?: string;
  description: string;
  bullets: string[];
};

export type ProDetailsSectionContent = {
  title: string;
  subtitle: string;
  cards: ProDetailsCardContent[];
  note?: string;
  ctaLabel?: string;
};

export type TestimonialItemContent = {
  quote: string;
  name: string;
  role: string;
};

export type TestimonialsSectionContent = {
  title: string;
  subtitle: string;
  items: TestimonialItemContent[];
};

export type FooterContent = {
  copyright: string;
  products: string;
  faq: string;
  contact: string;
};

// ================= Product Page Extended Content Types =================
export interface ProductPageSummaryStat { label: string; value: string }

export interface ProductPageSummaryContent {
  label?: string;
  planName?: string;
  chip?: string;
  stats?: ProductPageSummaryStat[];
  includesTitle?: string;
  includesList?: string[];
  footer?: string;
}

export interface ProductPageDetailsFeature { title: string; text: string }

export interface ProductPageDetailsContent {
  title?: string;
  subtitle?: string;
  features?: ProductPageDetailsFeature[];
}

export interface ProductPageUpgradeContent {
  title?: string;
  subtitle?: string;
  bullets?: string[];
}

export interface ProductPageSuitabilityContent {
  title?: string;
  bullets?: string[];
}

export interface ProductPageContent {
  ctaLabel: string;
  detailCtaLabel: string;
  badge?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  bullets?: string[];
  segments?: string[];
  summary?: ProductPageSummaryContent;
  details?: ProductPageDetailsContent;
  upgrade?: ProductPageUpgradeContent;
  suitability?: ProductPageSuitabilityContent;
}

export type HomeContent = {
  navbar: NavbarContent;
  hero: HeroContent;
  benefitsSection: BenefitsSectionContent;
  integrationsSection: IntegrationsSectionContent;
  productsSection: ProductsSectionContent;
  contactSection: ContactSectionContent;
  faqSection: FAQSectionContent;
  howItWorksSection: HowItWorksSectionContent;
  proDetailsSection: ProDetailsSectionContent;
  testimonialsSection: TestimonialsSectionContent;
  footer: FooterContent;
  site?: { title: string };
  pages?: {
    light?: ProductPageContent;
    plus?: ProductPageContent;
    pro?: ProductPageContent;
  };
};
