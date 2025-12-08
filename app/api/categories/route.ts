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
      `SELECT id, tenant_id, name, position, active, template_id, is_custom
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
    const { tenant_id, name, position = 0, active = true, is_custom = true } = body;

    if (!tenant_id || !name) {
      return NextResponse.json(
        { error: 'tenant_id and name are required' },
        { status: 400 }
      );
    }

    // Get tenant's product tier
    const tenantResult = await query(
      'SELECT product_tier FROM tenants WHERE id = $1',
      [tenant_id]
    );

    if (tenantResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    const tier = tenantResult.rows[0].product_tier;

    // Only enforce limits for custom categories
    if (is_custom) {
      // Check custom category count
      const countResult = await query(
        'SELECT COUNT(*) as count FROM categories WHERE tenant_id = $1 AND is_custom = true',
        [tenant_id]
      );
      const customCount = parseInt(countResult.rows[0].count);

      // Enforce tier limits
      const limits = {
        light: 0,    // No custom categories
        plus: 3,     // 3 custom categories
        pro: 999     // Unlimited
      };

      const limit = limits[tier as keyof typeof limits] || 0;

      if (customCount >= limit) {
        return NextResponse.json(
          { 
            error: 'Custom category limit reached',
            limit,
            current: customCount,
            tier
          },
          { status: 403 }
        );
      }
    }

    const result = await query(
      `INSERT INTO categories (tenant_id, name, position, active, is_custom)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tenant_id, name, position, active, is_custom]
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
