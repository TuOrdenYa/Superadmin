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

    const result = await query(
      `UPDATE menu_items 
       SET active = $1, updated_at = now() 
       WHERE id = $2 AND tenant_id = $3
       RETURNING id, tenant_id, category_id, name, description, price, active`,
      [active, Number(itemId), Number(tenant_id)]
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
