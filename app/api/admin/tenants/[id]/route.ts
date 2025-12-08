import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/admin/tenants/[id] - Get tenant by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = await query(
      `SELECT id, name, slug, product_tier, subscription_status
       FROM tenants
       WHERE id = $1`,
      [Number(id)]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { ok: false, error: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      tenant: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch tenant" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/tenants/[id] - Update tenant tier
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { product_tier, subscription_status } = body;

    // Validate tier
    const validTiers = ['light', 'plus', 'pro'];
    if (product_tier && !validTiers.includes(product_tier)) {
      return NextResponse.json(
        { ok: false, error: "Invalid product tier" },
        { status: 400 }
      );
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (product_tier) {
      updates.push(`product_tier = $${paramCount++}`);
      values.push(product_tier);
    }

    if (subscription_status) {
      updates.push(`subscription_status = $${paramCount++}`);
      values.push(subscription_status);
    }

    updates.push(`updated_at = NOW()`);
    values.push(Number(id));

    const result = await query(
      `UPDATE tenants 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING id, name, slug, product_tier, subscription_status`,
      values
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { ok: false, error: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      tenant: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating tenant:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update tenant" },
      { status: 500 }
    );
  }
}
