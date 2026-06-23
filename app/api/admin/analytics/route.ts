import { NextRequest, NextResponse } from 'next/server';
import { getUsageStats, getTenantUpgradeSuggestions } from '@/lib/usage-analytics';
import { checkAdminAuth } from '@/lib/superadmin-auth';

// GET /api/admin/analytics - Get usage analytics and upgrade suggestions
export async function GET(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (auth) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenant_id');
    const days = searchParams.get('days') || '30';

    if (!tenantId) {
      return NextResponse.json(
        { ok: false, error: 'tenant_id is required' },
        { status: 400 }
      );
    }

    const [usageStats, upgradeSuggestions] = await Promise.all([
      getUsageStats(parseInt(tenantId), parseInt(days)),
      getTenantUpgradeSuggestions(parseInt(tenantId)),
    ]);

    return NextResponse.json({
      ok: true,
      usage: usageStats,
      suggestions: upgradeSuggestions,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}