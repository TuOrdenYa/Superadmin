import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const { tenant_id, location_id, active } = body;

    if (!itemId || !tenant_id || !location_id || typeof active !== 'boolean') {
      return NextResponse.json(
        { ok: false, error: 'Parámetros inválidos' },
        { status: 400 }
      );
    }

    // Get tenant UUID
    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant_id)]
    );

    if (tenantResult.rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Tenant no encontrado' },
        { status: 404 }
      );
    }

    const tenantUuid = tenantResult.rows[0].id;

    const result = await query(
      `INSERT INTO menu_item_locations (tenant_id, item_id, location_id, active)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (tenant_id, item_id, location_id)
       DO UPDATE SET active = EXCLUDED.active
       RETURNING tenant_id, item_id, location_id, active`,
      [tenantUuid, String(itemId), String(location_id), active]
    );

    return NextResponse.json({
      ok: true,
      availability: result.rows[0],
    });
  } catch (error) {
    console.error('[PUT /api/items/:itemId/availability] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error al actualizar disponibilidad' },
      { status: 500 }
    );
  }
}