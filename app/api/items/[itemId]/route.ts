import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/items/:itemId - Get single item details
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

    const result = await query(
      `SELECT id, tenant_id, category_id, name, description, price, active, created_at, updated_at
       FROM menu_items
       WHERE id = $1 AND tenant_id = $2`,
      [itemId, tenant_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      item: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

// PUT /api/items/:itemId - Update menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const { tenant_id, name, description, price, category_id } = body;

    if (!tenant_id) {
      return NextResponse.json(
        { error: "tenant_id is required" },
        { status: 400 }
      );
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (price !== undefined) {
      updates.push(`price = $${paramCount++}`);
      values.push(price);
    }
    if (category_id !== undefined) {
      updates.push(`category_id = $${paramCount++}`);
      values.push(category_id);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    updates.push(`updated_at = now()`);
    values.push(itemId, tenant_id);

    const result = await query(
      `UPDATE menu_items
       SET ${updates.join(", ")}
       WHERE id = $${paramCount} AND tenant_id = $${paramCount + 1}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Item not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      item: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE /api/items/:itemId - Delete menu item
export async function DELETE(
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

    const result = await query(
      `DELETE FROM menu_items
       WHERE id = $1 AND tenant_id = $2
       RETURNING id`,
      [itemId, tenant_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
