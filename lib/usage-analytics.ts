import { query } from './db';

export async function trackUsage(
  tenantId: number,
  featureName: string,
  actionType: 'view' | 'create' | 'update' | 'delete' | 'api_call',
  userId?: number,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await query(
      `INSERT INTO usage_analytics (tenant_id, feature_name, action_type, user_id, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [tenantId, featureName, actionType, userId || null, metadata ? JSON.stringify(metadata) : null]
    );
  } catch (error) {
    // Don't throw - analytics shouldn't break the app
    console.error('Error tracking usage:', error);
  }
}

export async function getUsageStats(
  tenantId: number,
  days: number = 30
): Promise<{
  feature_name: string;
  action_type: string;
  total_usage: number;
}[]> {
  try {
    const result = await query(
      `SELECT 
        feature_name,
        action_type,
        COUNT(*) as total_usage
       FROM usage_analytics
       WHERE tenant_id = $1 
         AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY feature_name, action_type
       ORDER BY total_usage DESC`,
      [tenantId]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return [];
  }
}

export async function getTenantUpgradeSuggestions(tenantId: number): Promise<{
  currentTier: string;
  suggestedTier?: string;
  reasons: string[];
}> {
  try {
    // Get tenant tier
    const tenantResult = await query(
      `SELECT product_tier FROM tenants WHERE id = $1`,
      [tenantId]
    );
    
    if (tenantResult.rowCount === 0) {
      return { currentTier: 'unknown', reasons: [] };
    }
    
    const currentTier = tenantResult.rows[0].product_tier || 'light';
    const reasons: string[] = [];
    let suggestedTier: string | undefined;

    // Get usage in last 30 days
    const usage = await getUsageStats(tenantId, 30);
    
    // Check if they're trying to use locked features
    const lockedFeatures = usage.filter(u => 
      (currentTier === 'light' && ['orders', 'table_management', 'variants'].includes(u.feature_name)) ||
      (currentTier === 'plus' && ['table_management', 'variants'].includes(u.feature_name))
    );

    if (currentTier === 'light') {
      const orderAttempts = usage.find(u => u.feature_name === 'orders');
      if (orderAttempts && orderAttempts.total_usage > 10) {
        reasons.push(`You've attempted to use order management ${orderAttempts.total_usage} times`);
        suggestedTier = 'plus';
      }
    }

    if (currentTier === 'plus') {
      const tableAttempts = usage.find(u => u.feature_name === 'table_management');
      const variantAttempts = usage.find(u => u.feature_name === 'variants');
      
      if ((tableAttempts && tableAttempts.total_usage > 5) || (variantAttempts && variantAttempts.total_usage > 5)) {
        reasons.push('You\'re trying to use Pro features');
        suggestedTier = 'pro';
      }
    }

    return {
      currentTier,
      suggestedTier,
      reasons,
    };
  } catch (error) {
    console.error('Error getting upgrade suggestions:', error);
    return { currentTier: 'unknown', reasons: [] };
  }
}
