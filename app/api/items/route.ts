import { NextRequest, NextResponse } from 'next/server';
import { handleCors } from '@/lib/cors';
import { query } from '@/lib/db';
import { withRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

async function handlePOST(request: NextRequest) {
  const corsHeaders = handleCors(request);
  if (corsHeaders instanceof NextResponse) return corsHeaders;
  try {
    const body = await request.json();
    const { tenant_id, category_id, name, description = null, price } = body;

    const p = Number(price);

    if (!tenant_id || !category_id || !name || isNaN(p) || p < 0) {
      return NextResponse.json(
        { ok: false, error: 'tenant_id, category_id, name y price requeridos' },
        { status: 400, headers: corsHeaders }
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
        { status: 404, headers: corsHeaders }
      );
    }

    const tenantUuid = tenantResult.rows[0].id;

    // Verify category exists - check both categories and category_templates
    const categoryCheck = await query(
      `SELECT id FROM categories WHERE id::text = $1 AND tenant_id = $2
       UNION
       SELECT id FROM category_templates WHERE id::text = $1`,
      [String(category_id), tenantUuid]
    );

    if (categoryCheck.rowCount === 0) {
      return NextResponse.json(
        { ok: false, error: 'Categoría no encontrada' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Insert new item
    const result = await query(
      `INSERT INTO menu_items (tenant_id, category_id, name, description, price, active)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING id, tenant_id, category_id, name, description, price, active`,
      [tenantUuid, String(category_id), String(name).trim(), description ? String(description).trim() : null, p]
    );

    return NextResponse.json({
      ok: true,
      product: result.rows[0],
    }, { headers: corsHeaders });
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