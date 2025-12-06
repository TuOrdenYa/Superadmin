import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/tenants/[tenant]/locations - List locations for tenant
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  try {
    const { tenant } = await params;

    const result = await query(
      `SELECT id, tenant_id, name
       FROM locations
       WHERE tenant_id = $1
       ORDER BY name`,
      [Number(tenant)]
    );

    return NextResponse.json({
      ok: true,
      locations: result.rows,
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
