// Product tier types and feature access control
// Defines what features are available in each subscription tier

export type ProductTier = 'light' | 'plus' | 'pro';

export type SubscriptionStatus = 'active' | 'inactive' | 'trial' | 'expired';

export interface TenantSubscription {
  product_tier: ProductTier;
  subscription_status: SubscriptionStatus;
  subscription_start_date: Date | null;
  subscription_end_date: Date | null;
}

// Feature flags for each tier
export const TIER_FEATURES = {
  light: {
    // Core features
    digital_menu: true,
    qr_codes: true,
    whatsapp_button: true,
    basic_branding: true,
    
    // Disabled features
    menu_management: true,  // Can edit their own menu
    order_management: false,
    table_management: false,
    variants_management: false,
    reports: false,
    kitchen_display: false,
    multi_location: false,
    staff_accounts: false,
  },
  
  plus: {
    // Inherit Light features
    digital_menu: true,
    qr_codes: true,
    whatsapp_button: true,
    basic_branding: true,
    menu_management: true,
    
    // Plus-specific features
    order_management: true,
    basic_reports: true,
    order_history: true,
    
    // Still disabled
    table_management: false,
    variants_management: false,
    kitchen_display: false,
    multi_location: false,
    staff_accounts: true,  // Limited staff accounts
  },
  
  pro: {
    // All features enabled
    digital_menu: true,
    qr_codes: true,
    whatsapp_button: true,
    basic_branding: true,
    menu_management: true,
    order_management: true,
    table_management: true,
    variants_management: true,
    reports: true,
    advanced_reports: true,
    kitchen_display: true,
    multi_location: true,
    staff_accounts: true,
    tips_management: true,
    shift_closing: true,
    bill_splitting: true,
  },
} as const;

// Helper function to check if a feature is available for a tier
export function hasFeature(tier: ProductTier, feature: keyof typeof TIER_FEATURES.pro): boolean {
  return TIER_FEATURES[tier][feature as keyof typeof TIER_FEATURES[typeof tier]] === true;
}

// Helper function to check if subscription is active
export function isSubscriptionActive(status: SubscriptionStatus): boolean {
  return status === 'active' || status === 'trial';
}

// Get human-readable tier name
export function getTierDisplayName(tier: ProductTier): string {
  const names = {
    light: 'Light - Menú + QR',
    plus: 'Plus - Pedidos + Reportes',
    pro: 'Pro - Operación Completa',
  };
  return names[tier];
}

// Get tier description
export function getTierDescription(tier: ProductTier): string {
  const descriptions = {
    light: 'Menú digital, código QR y botón de WhatsApp',
    plus: 'Todo lo de Light + registro de pedidos y reportes básicos',
    pro: 'Operación completa: mesas, cocina, cuentas, propinas y reportes avanzados',
  };
  return descriptions[tier];
}

// Feature requirement error message
export function getFeatureUpgradeMessage(feature: string, requiredTier: ProductTier): string {
  return `Esta función requiere plan ${getTierDisplayName(requiredTier)}. Contacta a soporte para actualizar.`;
}
