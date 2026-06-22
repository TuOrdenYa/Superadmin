import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// PUT /api/items/:itemId/variant-groups/:groupTemplateId - Update variant group association
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string; groupTemplateId: string }> }
) {
  try {
    const { itemId, groupTemplateId } = await params;
    const body = await request.json();
    const { tenant_id, active } = body;

    if (!tenant_id || active === undefined) {
      return NextResponse.json({ error: "tenant_id and active are required" }, { status: 400 });
    }

    // Resolve tenant UUID
    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant_id)]
    );
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }
    const tenantUuid = tenantResult.rows[0].id;

    const result = await query(
      `UPDATE item_variant_groups
       SET active_override = $1
       WHERE tenant_id = $2 AND item_id::text = $3 AND group_template_id::text = $4
       RETURNING *`,
      [active, tenantUuid, String(itemId), String(groupTemplateId)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Association not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, association: result.rows[0] });
  } catch (error) {
    console.error("Error updating variant group association:", error);
    return NextResponse.json({ error: "Failed to update association" }, { status: 500 });
  }
}

// DELETE /api/items/:itemId/variant-groups/:groupTemplateId - Remove variant group from item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string; groupTemplateId: string }> }
) {
  try {
    const { itemId, groupTemplateId } = await params;
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get("tenant_id");

    if (!tenant_id) {
      return NextResponse.json({ error: "tenant_id is required" }, { status: 400 });
    }

    // Resolve tenant UUID
    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant_id)]
    );
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }
    const tenantUuid = tenantResult.rows[0].id;

    const result = await query(
      `DELETE FROM item_variant_groups
       WHERE tenant_id = $1 AND item_id::text = $2 AND group_template_id::text = $3
       RETURNING *`,
      [tenantUuid, String(itemId), String(groupTemplateId)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Association not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Variant group removed from item" });
  } catch (error) {
    console.error("Error removing variant group:", error);
    return NextResponse.json({ error: "Failed to remove variant group" }, { status: 500 });
  }
}