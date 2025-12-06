import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/variant-group-templates - List all variant group templates
export async function GET(request: NextRequest) {
  try {
    const result = await query(
      `SELECT id, name, position, required, max_select, active
       FROM variant_group_templates
       WHERE active = true
       ORDER BY position, id`
    );

    return NextResponse.json({
      ok: true,
      groups: result.rows,
    });
  } catch (error) {
    console.error("Error fetching variant groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch variant groups" },
      { status: 500 }
    );
  }
}

// POST /api/variant-group-templates - Create a new variant group template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position = 0, required = false, max_select = 1 } = body;

    if (!name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO variant_group_templates (name, position, required, max_select, active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING *`,
      [name, position, required, max_select]
    );

    return NextResponse.json({
      ok: true,
      group: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating variant group:", error);
    return NextResponse.json(
      { error: "Failed to create variant group" },
      { status: 500 }
    );
  }
}
