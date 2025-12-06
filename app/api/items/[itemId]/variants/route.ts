import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/items/:itemId/variants - Get all variant groups for an item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get("tenant_id");

    if (!tenant_id) {
      return NextResponse.json(
        { error: "tenant_id is required" },
        { status: 400 }
      );
    }

    // Get all variant groups associated with this item
    const result = await query(
      `SELECT 
        vgt.id as group_id,
        vgt.name as group_name,
        vgt.position,
        vgt.required,
        vgt.max_select,
        ivg.active_override as item_active
       FROM item_variant_groups ivg
       JOIN variant_group_templates vgt ON ivg.group_template_id = vgt.id
       WHERE ivg.tenant_id = $1 AND ivg.item_id = $2
       ORDER BY vgt.position, vgt.id`,
      [tenant_id, itemId]
    );

    // Get all options for each group
    const groupsWithOptions = await Promise.all(
      result.rows.map(async (group) => {
        const optionsResult = await query(
          `SELECT 
            vot.id as option_id,
            vot.name as option_name,
            vot.position,
            vot.price_delta,
            ivo.active as item_active,
            ivo.price_delta as item_price_delta
           FROM variant_option_templates vot
           LEFT JOIN item_variant_options ivo ON 
             ivo.option_template_id = vot.id AND 
             ivo.tenant_id = $1 AND 
             ivo.item_id = $2 AND
             ivo.group_template_id = $3
           WHERE vot.group_template_id = $3 AND vot.active = true
           ORDER BY vot.position, vot.id`,
          [tenant_id, itemId, group.group_id]
        );

        return {
          ...group,
          options: optionsResult.rows,
        };
      })
    );

    return NextResponse.json({
      ok: true,
      variants: groupsWithOptions,
    });
  } catch (error) {
    console.error("Error fetching item variants:", error);
    return NextResponse.json(
      { error: "Failed to fetch item variants" },
      { status: 500 }
    );
  }
}

// POST /api/items/:itemId/variants - Associate variant group with item
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const { tenant_id, group_template_id, active = true } = body;

    if (!tenant_id || !group_template_id) {
      return NextResponse.json(
        { error: "tenant_id and group_template_id are required" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO item_variant_groups (tenant_id, item_id, group_template_id, active_override)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (tenant_id, item_id, group_template_id) 
       DO UPDATE SET active_override = $4
       RETURNING *`,
      [tenant_id, itemId, group_template_id, active]
    );

    return NextResponse.json({
      ok: true,
      association: result.rows[0],
    });
  } catch (error) {
    console.error("Error associating variant group:", error);
    return NextResponse.json(
      { error: "Failed to associate variant group" },
      { status: 500 }
    );
  }
}
