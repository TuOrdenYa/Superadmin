import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = parseInt(searchParams.get('tenant_id') || '1', 10);
    const locationId = searchParams.get('location_id')
      ? parseInt(searchParams.get('location_id')!, 10)
      : null;

    // Query menu items
    const sql = `
      SELECT 
        mi.id,
        mi.name,
        mi.description,
        mi.price,
        mi.active,
        c.id as category_id,
        c.name as category_name
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE mi.tenant_id = $1
        AND mi.active = true
        AND (c.active = true OR c.active IS NULL)
      ORDER BY c.name, mi.name
    `;

    const params = [tenantId];
    const result = await query(sql, params);

    return NextResponse.json({
      ok: true,
      menu: result.rows,
      tenant_id: tenantId,
      location_id: locationId,
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}
