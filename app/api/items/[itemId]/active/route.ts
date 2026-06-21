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
    const { tenant_id, active } = body;

    if (!itemId || !tenant_id || typeof active !== 'boolean') {
      return NextResponse.json(
        { ok: false, error: 'Parámetros inválidos' },
        { status: 400 }
      );
    }

    // Get tenant UUID from tax_id or uuid
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
      `UPDATE menu_items 
       SET active = $1
       WHERE id::text = $2 AND tenant_id = $3
       RETURNING id, tenant_id, category_id, name, description, price, active`,
      [active, String(itemId), tenantUuid]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { ok: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      product: result.rows[0],
    });
  } catch (error) {
    console.error('[PUT /api/items/:itemId/active] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error al actualizar estado' },
      { status: 500 }
    );
  }
}