import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// PUT /api/tables/:tableId - Update table number
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const { tableId } = await params;
    const body = await request.json();
    const { number } = body;

    if (!number) {
      return NextResponse.json(
        { error: "number is required" },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE tables
       SET number = $1
       WHERE id = $2
       RETURNING *`,
      [number, tableId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      table: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating table:", error);
    return NextResponse.json(
      { error: "Failed to update table" },
      { status: 500 }
    );
  }
}

// DELETE /api/tables/:tableId - Delete table
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const { tableId } = await params;

    const result = await query(
      `DELETE FROM tables
       WHERE id = $1
       RETURNING id`,
      [tableId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting table:", error);
    return NextResponse.json(
      { error: "Failed to delete table" },
      { status: 500 }
    );
  }
}
