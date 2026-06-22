import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenant_id');
    const locationId = searchParams.get('location_id');

    if (!tenantId) {
      return NextResponse.json({ ok: false, error: 'tenant_id is required' }, { status: 400 });
    }

    // Resolve tenant UUID
    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 OR slug = $1 LIMIT 1`,
      [String(tenantId)]
    );
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Tenant not found' }, { status: 404 });
    }
    const tenantUuid = tenantResult.rows[0].id;

    // Build query — join with category_templates OR categories
    let sql = `
      SELECT 
        mi.id,
        mi.name,
        mi.description,
        mi.price,
        mi.active,
        mi.category_id,
        mi.image_url,
        COALESCE(c.name, ct.name) as category_name
      FROM menu_items mi
      LEFT JOIN categories c ON c.id::text = mi.category_id::text AND c.tenant_id = mi.tenant_id
      LEFT JOIN category_templates ct ON ct.id::text = mi.category_id::text
      WHERE mi.tenant_id = $1
        AND mi.active = true
    `;

    const params: any[] = [tenantUuid];

    // If location_id provided, filter by menu_item_locations availability
    if (locationId) {
      sql += `
        AND (
          NOT EXISTS (
            SELECT 1 FROM menu_item_locations mil
            WHERE mil.item_id = mi.id AND mil.location_id::text = $2
          )
          OR EXISTS (
            SELECT 1 FROM menu_item_locations mil
            WHERE mil.item_id = mi.id AND mil.location_id::text = $2 AND mil.active = true
          )
        )
      `;
      params.push(String(locationId));
    }

    sql += ` ORDER BY COALESCE(c.name, ct.name), mi.name`;

    const result = await query(sql, params);

    return NextResponse.json({
      ok: true,
      items: result.rows,
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return withRateLimit(request, handleGET);
}