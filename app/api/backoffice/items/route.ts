import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenant_id');
    const locationId = searchParams.get('location_id');

    if (!tenantId) {
      return NextResponse.json(
        { ok: false, error: 'tenant_id es requerido' },
        { status: 400 }
      );
    }

    const sql = `
      SELECT it.id, it.tenant_id, it.category_id, c.name AS category_name,
             it.name, it.description, it.price AS price_base, it.active AS global_active,
             mil.location_id AS override_location_id, mil.active AS location_active, mil.price_override,
             COALESCE(mil.price_override, it.price) AS price_effective,
             ((it.active IS TRUE) AND (mil.active IS DISTINCT FROM FALSE)) AS effective_active
        FROM menu_items it
        JOIN categories c ON c.id = it.category_id
        LEFT JOIN menu_item_locations mil
               ON mil.item_id = it.id 
               AND mil.tenant_id = it.tenant_id 
               AND ($2::INT IS NOT NULL AND mil.location_id = $2)
       WHERE it.tenant_id = $1
       ORDER BY c.position, c.id, it.id`;

    const params = [Number(tenantId), locationId ? Number(locationId) : null];
    const result = await query(sql, params);

    return NextResponse.json({
      ok: true,
      items: result.rows,
    });
  } catch (error) {
    console.error('[GET /api/backoffice/items] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error al obtener items' },
      { status: 500 }
    );
  }
}
