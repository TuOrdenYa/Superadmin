import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Test database connection
export async function GET(request: NextRequest) {
  try {
    // Simple query to test connection
    const result = await query('SELECT NOW() as current_time, version() as pg_version');
    
    // Try to get tenant count
    const tenantResult = await query('SELECT COUNT(*) as tenant_count FROM tenants');
    
    return NextResponse.json({
      ok: true,
      message: 'Database connection successful',
      current_time: result.rows[0].current_time,
      pg_version: result.rows[0].pg_version,
      tenant_count: tenantResult.rows[0].tenant_count,
    });
  } catch (error: any) {
    console.error('[GET /api/test/db] error:', error);
    return NextResponse.json({
      ok: false,
      error: error.message,
      code: error.code,
      detail: error.detail || 'No additional details',
    }, { status: 500 });
  }
}
