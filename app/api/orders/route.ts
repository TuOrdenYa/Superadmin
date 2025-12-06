import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

function asValidId(v: any): number | null {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenant_id,
      location_id,
      table_id,
      items,
      to_go = false,
      allergies = null,
      chef_notes = null,
      table_label = null,
    } = body;

    const tId = asValidId(tenant_id);
    const lId = asValidId(location_id);

    if (!tId || !lId || !Array.isArray(items)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Faltan datos requeridos (tenant_id, location_id, items)',
        },
        { status: 400 }
      );
    }

    let finalTableId = asValidId(table_id);

    // Check if table exists
    if (finalTableId) {
      const tableExists = await query(
        `SELECT 1 FROM tables WHERE id = $1`,
        [finalTableId]
      );
      if (tableExists.rowCount === 0) {
        finalTableId = null;
      }
    }

    // Create order
    const orderResult = await query(
      `INSERT INTO orders (tenant_id, location_id, table_id, status, total, to_go, allergies, chef_notes, table_label)
       VALUES ($1, $2, $3, 'OPEN', 0, $4, $5, $6, $7) 
       RETURNING *`,
      [tId, lId, finalTableId, to_go === true, allergies, chef_notes, table_label]
    );

    const order = orderResult.rows[0];
    let total = 0;

    // Insert order items
    for (const it of items) {
      const name = String(it?.name ?? '').trim();
      const qty = Number(it?.qty ?? 0);
      const price = Number(it?.price ?? 0);

      if (!name || qty <= 0 || price < 0) continue;

      await query(
        `INSERT INTO order_items (order_id, name, qty, price) 
         VALUES ($1, $2, $3, $4)`,
        [order.id, name, qty, price]
      );

      total += qty * price;
    }

    // Update order total
    await query(
      `UPDATE orders SET total = $1, updated_at = now() WHERE id = $2`,
      [total, order.id]
    );

    return NextResponse.json({
      ok: true,
      order_id: order.id,
      total,
    });
  } catch (error) {
    console.error('[POST /api/orders] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error al crear orden' },
      { status: 500 }
    );
  }
}
