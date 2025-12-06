import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// PUT /api/variant-option-templates/:optionId - Update variant option
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ optionId: string }> }
) {
  try {
    const { optionId } = await params;
    const body = await request.json();
    const { name, position, price_delta, active } = body;

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
    if (price_delta !== undefined) {
      updates.push(`price_delta = $${paramCount++}`);
      values.push(price_delta);
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

    values.push(optionId);

    const result = await query(
      `UPDATE variant_option_templates
       SET ${updates.join(", ")}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Variant option not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      option: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating variant option:", error);
    return NextResponse.json(
      { error: "Failed to update variant option" },
      { status: 500 }
    );
  }
}

// DELETE /api/variant-option-templates/:optionId - Delete variant option
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ optionId: string }> }
) {
  try {
    const { optionId } = await params;

    const result = await query(
      `DELETE FROM variant_option_templates
       WHERE id = $1
       RETURNING id`,
      [optionId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Variant option not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Variant option deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting variant option:", error);
    return NextResponse.json(
      { error: "Failed to delete variant option" },
      { status: 500 }
    );
  }
}
