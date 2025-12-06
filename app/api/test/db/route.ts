import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Test database connection
export async function GET(request: NextRequest) {
  try {
    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        ok: false,
        error: 'DATABASE_URL environment variable is not set',
      }, { status: 500 });
    }

    // Mask the password in the URL for logging
    const maskedUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@');
    
    // Simple query to test connection
    const result = await query('SELECT NOW() as current_time, version() as pg_version');
    
    // Try to get tenant count
    const tenantResult = await query('SELECT COUNT(*) as tenant_count FROM tenants');
    
    return NextResponse.json({
      ok: true,
      message: 'Database connection successful',
      database_url_configured: true,
      database_url_preview: maskedUrl.substring(0, 60) + '...',
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
      database_url_configured: !!process.env.DATABASE_URL,
    }, { status: 500 });
  }
}
