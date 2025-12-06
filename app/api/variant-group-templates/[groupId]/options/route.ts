import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// POST /api/variant-group-templates/:groupId/options - Create option for a variant group
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
    const body = await request.json();
    const { name, position = 0, price_delta = 0 } = body;

    if (!name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO variant_option_templates (group_template_id, name, position, price_delta, active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING *`,
      [groupId, name, position, price_delta]
    );

    return NextResponse.json({
      ok: true,
      option: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating variant option:", error);
    return NextResponse.json(
      { error: "Failed to create variant option" },
      { status: 500 }
    );
  }
}

// GET /api/variant-group-templates/:groupId/options - Get all options for a variant group
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;

    const result = await query(
      `SELECT id, group_template_id, name, position, price_delta, active
       FROM variant_option_templates
       WHERE group_template_id = $1 AND active = true
       ORDER BY position, id`,
      [groupId]
    );

    return NextResponse.json({
      ok: true,
      options: result.rows,
    });
  } catch (error) {
    console.error("Error fetching variant options:", error);
    return NextResponse.json(
      { error: "Failed to fetch variant options" },
      { status: 500 }
    );
  }
}
