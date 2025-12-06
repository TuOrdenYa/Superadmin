// Middleware to check tenant product tier and feature access
import { query } from '@/lib/db';
import { ProductTier, hasFeature, isSubscriptionActive, getFeatureUpgradeMessage } from './product-tiers';

export interface TenantTierInfo {
  id: number;
  product_tier: ProductTier;
  subscription_status: string;
  has_access: boolean;
}

// Get tenant tier information from database
export async function getTenantTier(tenantId: number): Promise<TenantTierInfo | null> {
  try {
    const result = await query(
      `SELECT id, product_tier, subscription_status 
       FROM tenants 
       WHERE id = $1`,
      [tenantId]
    );

    if (result.rowCount === 0) {
      return null;
    }

    const tenant = result.rows[0];
    const has_access = isSubscriptionActive(tenant.subscription_status);

    return {
      id: tenant.id,
      product_tier: tenant.product_tier,
      subscription_status: tenant.subscription_status,
      has_access,
    };
  } catch (error) {
    console.error('Error fetching tenant tier:', error);
    return null;
  }
}

// Check if tenant has access to a specific feature
export async function checkFeatureAccess(
  tenantId: number,
  feature: string
): Promise<{ allowed: boolean; message?: string; tier?: ProductTier }> {
  const tierInfo = await getTenantTier(tenantId);

  if (!tierInfo) {
    return {
      allowed: false,
      message: 'Tenant not found',
    };
  }

  if (!tierInfo.has_access) {
    return {
      allowed: false,
      message: 'Subscription expired or inactive',
      tier: tierInfo.product_tier,
    };
  }

  const allowed = hasFeature(tierInfo.product_tier, feature as any);

  if (!allowed) {
    // Determine which tier is required for this feature
    let requiredTier: ProductTier = 'pro';
    if (hasFeature('plus', feature as any)) {
      requiredTier = 'plus';
    }

    return {
      allowed: false,
      message: getFeatureUpgradeMessage(feature, requiredTier),
      tier: tierInfo.product_tier,
    };
  }

  return {
    allowed: true,
    tier: tierInfo.product_tier,
  };
}

// Helper to create a tier-gated API response
export function createTierErrorResponse(message: string, currentTier: ProductTier, status: number = 403) {
  return {
    ok: false,
    error: message,
    current_tier: currentTier,
    upgrade_required: true,
  };
}
