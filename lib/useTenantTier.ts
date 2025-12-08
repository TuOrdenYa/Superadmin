// Client-side hook to check tenant tier and feature access
import { useState, useEffect } from 'react';
import { ProductTier, hasFeature } from './product-tiers';

export interface TenantTierInfo {
  tier: ProductTier | null;
  loading: boolean;
  error: string | null;
  hasAccess: (feature: string) => boolean;
  canUseFeature: (feature: string) => { allowed: boolean; message?: string };
}

export function useTenantTier(tenantId: number | null): TenantTierInfo {
  const [tier, setTier] = useState<ProductTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantId) {
      setLoading(false);
      return;
    }

    const fetchTier = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/tenants/${tenantId}`);
        const data = await response.json();
        
        if (data.ok && data.tenant) {
          setTier(data.tenant.product_tier || 'light');
          setError(null);
        } else {
          setError('Failed to fetch tenant tier');
        }
      } catch (err) {
        setError('Error fetching tenant tier');
        console.error('Error fetching tier:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTier();
  }, [tenantId]);

  const hasAccess = (feature: string): boolean => {
    if (!tier) return false;
    return hasFeature(tier, feature as any);
  };

  const canUseFeature = (feature: string): { allowed: boolean; message?: string } => {
    if (!tier) {
      return { allowed: false, message: 'Tier information not available' };
    }

    const allowed = hasFeature(tier, feature as any);
    
    if (!allowed) {
      const featureNames: Record<string, string> = {
        table_management: 'Table Management',
        product_variants: 'Product Variants',
        order_management: 'Order Management',
        inventory_tracking: 'Inventory Tracking',
        advanced_reports: 'Advanced Reports',
        multi_location: 'Multiple Locations',
        staff_management: 'Staff Management',
      };

      const featureName = featureNames[feature] || feature;
      const requiredTier = feature === 'order_management' ? 'Plus' : 'Pro';
      
      return {
        allowed: false,
        message: `${featureName} requires ${requiredTier} tier. Upgrade to access this feature.`,
      };
    }

    return { allowed: true };
  };

  return {
    tier,
    loading,
    error,
    hasAccess,
    canUseFeature,
  };
}
