import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Create new menu item
async function handlePOST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenant_id, category_id, name, description = null, price } = body;

    const tId = Number(tenant_id);
    const cId = Number(category_id);
    const p = Number(price);

    if (!tId || !cId || !name || isNaN(p) || p < 0) {
      return NextResponse.json(
        { ok: false, error: 'tenant_id, category_id, name y price requeridos' },
        { status: 400 }
      );
    }

    // Verify category exists for this tenant
    const categoryCheck = await query(
      `SELECT id FROM categories WHERE id = $1 AND tenant_id = $2`,
      [cId, tId]
    );

    if (categoryCheck.rowCount === 0) {
      return NextResponse.json(
        { ok: false, error: 'Categoría no encontrada para el tenant' },
        { status: 404 }
      );
    }

    // Insert new item
    const result = await query(
      `INSERT INTO menu_items (tenant_id, category_id, name, description, price, active)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING id, tenant_id, category_id, name, description, price, active`,
      [tId, cId, String(name).trim(), description ? String(description).trim() : null, p]
    );

    return NextResponse.json({
      ok: true,
      product: result.rows[0],
    });
  } catch (error) {
    console.error('[POST /api/items] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, handlePOST);
}
