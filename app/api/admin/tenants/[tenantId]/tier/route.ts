import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// PUT /api/admin/tenants/[tenantId]/tier - Update tenant product tier
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await params;
    const body = await request.json();
    const { product_tier, subscription_status, subscription_end_date } = body;

    // Validate product tier
    if (product_tier && !['light', 'plus', 'pro'].includes(product_tier)) {
      return NextResponse.json(
        { ok: false, error: 'product_tier must be light, plus, or pro' },
        { status: 400 }
      );
    }

    // Validate subscription status
    if (subscription_status && !['active', 'inactive', 'trial', 'expired'].includes(subscription_status)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid subscription_status' },
        { status: 400 }
      );
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (product_tier) {
      updates.push(`product_tier = $${paramCount++}`);
      values.push(product_tier);
    }

    if (subscription_status) {
      updates.push(`subscription_status = $${paramCount++}`);
      values.push(subscription_status);
    }

    if (subscription_end_date !== undefined) {
      updates.push(`subscription_end_date = $${paramCount++}`);
      values.push(subscription_end_date);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = NOW()`);
    values.push(tenantId);

    const sql = `
      UPDATE tenants 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, slug, product_tier, subscription_status, 
                subscription_start_date, subscription_end_date, updated_at
    `;

    const result = await query(sql, values);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { ok: false, error: 'Tenant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      tenant: result.rows[0],
    });
  } catch (error) {
    console.error('[PUT /api/admin/tenants/[tenantId]/tier] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update tenant tier' },
      { status: 500 }
    );
  }
}
