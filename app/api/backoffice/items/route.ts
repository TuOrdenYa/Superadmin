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

    // Get tenant UUID from tax_id or uuid
    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenantId)]
    );

    if (tenantResult.rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Tenant no encontrado' },
        { status: 404 }
      );
    }

    const tenantUuid = tenantResult.rows[0].id;

    // Simple query without menu_item_locations since table doesn't exist
    const sql = `
      SELECT it.id, it.tenant_id, it.category_id,
             COALESCE(c.name, ct.name) AS category_name,
             it.name, it.description, it.price, it.active
        FROM menu_items it
        LEFT JOIN categories c ON c.id = it.category_id
        LEFT JOIN category_templates ct ON ct.id = it.category_id
       WHERE it.tenant_id = $1
       ORDER BY it.id`;

    const result = await query(sql, [tenantUuid]);

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