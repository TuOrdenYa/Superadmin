import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const orderResult = await query(
      `SELECT * FROM orders WHERE id = $1`,
      [id]
    );

    const itemsResult = await query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [id]
    );

    return NextResponse.json({
      ok: true,
      order: orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error('[GET /api/orders/:id] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error al obtener orden' },
      { status: 500 }
    );
  }
}
