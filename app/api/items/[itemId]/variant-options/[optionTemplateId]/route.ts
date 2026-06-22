import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// PUT /api/items/:itemId/variant-options/:optionTemplateId - Override variant option price/active
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string; optionTemplateId: string }> }
) {
  try {
    const { itemId, optionTemplateId } = await params;
    const body = await request.json();
    const { tenant_id, active, price_delta_override } = body;

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

    // Get group_template_id from option
    const groupResult = await query(
      `SELECT group_template_id FROM variant_option_templates WHERE id::text = $1`,
      [String(optionTemplateId)]
    );
    if (groupResult.rows.length === 0) {
      return NextResponse.json({ error: "Variant option not found" }, { status: 404 });
    }
    const group_template_id = groupResult.rows[0].group_template_id;

    const result = await query(
      `INSERT INTO item_variant_options (tenant_id, item_id, group_template_id, option_template_id, active, price_delta)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (tenant_id, item_id, option_template_id)
       DO UPDATE SET 
         active = COALESCE($5, item_variant_options.active),
         price_delta = COALESCE($6, item_variant_options.price_delta)
       RETURNING *`,
      [tenantUuid, String(itemId), group_template_id, String(optionTemplateId), active, price_delta_override]
    );

    return NextResponse.json({ ok: true, override: result.rows[0] });
  } catch (error) {
    console.error("Error updating variant option override:", error);
    return NextResponse.json({ error: "Failed to update variant option override" }, { status: 500 });
  }
}