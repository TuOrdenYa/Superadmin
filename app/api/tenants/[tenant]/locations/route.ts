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
      `SELECT l.id, l.tenant_id, l.name
       FROM locations l
       INNER JOIN tenants t ON t.id = l.tenant_id
       WHERE t.tax_id = $1 OR t.id::text = $1
       ORDER BY l.name`,
      [String(tenant)]
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