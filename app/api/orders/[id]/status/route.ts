import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

const ALLOWED_STATUSES = ['OPEN', 'READY', 'SERVED', 'PAID', 'CLOSED'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { ok: false, error: 'Estado inválido' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE orders 
       SET status = $1, updated_at = now() 
       WHERE id = $2 
       RETURNING id, status, tenant_id, location_id, updated_at`,
      [status, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { ok: false, error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    const row = result.rows[0];

    return NextResponse.json({
      ok: true,
      order: {
        id: row.id,
        status: row.status,
        updated_at: row.updated_at,
      },
    });
  } catch (error) {
    console.error('[PATCH /api/orders/:id/status] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error al actualizar estado' },
      { status: 500 }
    );
  }
}
