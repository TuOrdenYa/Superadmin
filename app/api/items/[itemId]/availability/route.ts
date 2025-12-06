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

    const result = await query(
      `INSERT INTO menu_item_locations (tenant_id, item_id, location_id, active)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (tenant_id, item_id, location_id)
       DO UPDATE SET active = EXCLUDED.active
       RETURNING tenant_id, item_id, location_id, active`,
      [Number(tenant_id), Number(itemId), Number(location_id), active]
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
