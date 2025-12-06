import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// PUT /api/variant-group-templates/:groupId - Update variant group template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
    const body = await request.json();
    const { name, position, required, max_select, active } = body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (position !== undefined) {
      updates.push(`position = $${paramCount++}`);
      values.push(position);
    }
    if (required !== undefined) {
      updates.push(`required = $${paramCount++}`);
      values.push(required);
    }
    if (max_select !== undefined) {
      updates.push(`max_select = $${paramCount++}`);
      values.push(max_select);
    }
    if (active !== undefined) {
      updates.push(`active = $${paramCount++}`);
      values.push(active);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(groupId);

    const result = await query(
      `UPDATE variant_group_templates
       SET ${updates.join(", ")}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Variant group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      group: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating variant group:", error);
    return NextResponse.json(
      { error: "Failed to update variant group" },
      { status: 500 }
    );
  }
}

// DELETE /api/variant-group-templates/:groupId - Delete variant group template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;

    const result = await query(
      `DELETE FROM variant_group_templates
       WHERE id = $1
       RETURNING id`,
      [groupId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Variant group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Variant group deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting variant group:", error);
    return NextResponse.json(
      { error: "Failed to delete variant group" },
      { status: 500 }
    );
  }
}
