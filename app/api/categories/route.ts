import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenant_id');

    if (!tenantId) {
      return NextResponse.json(
        { ok: false, error: 'tenant_id es requerido' },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT id, tenant_id, name, position, active, template_id
       FROM categories 
       WHERE tenant_id = $1 
       ORDER BY position, name`,
      [Number(tenantId)]
    );

    return NextResponse.json({
      ok: true,
      categories: result.rows,
    });
  } catch (error) {
    console.error('[GET /api/categories] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenant_id, name, position = 0, active = true } = body;

    if (!tenant_id || !name) {
      return NextResponse.json(
        { error: 'tenant_id and name are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO categories (tenant_id, name, position, active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [tenant_id, name, position, active]
    );

    return NextResponse.json({
      ok: true,
      category: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
