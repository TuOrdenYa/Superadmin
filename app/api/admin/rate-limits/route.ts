import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { checkAdminAuth } from '@/lib/superadmin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (auth) return auth;

  try {
    const result = await query(`
      SELECT
        tenant_id,
        tenant_name,
        product_tier,
        window_start,
        request_count,
        rate_limit,
        is_limited
      FROM rate_limit_status
      ORDER BY request_count DESC
      LIMIT 50
    `);
    return NextResponse.json({
      ok: true,
      rate_limits: result.rows,
    });
  } catch (error) {
    console.error('Error fetching rate limits:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch rate limits' },
      { status: 500 }
    );
  }
}