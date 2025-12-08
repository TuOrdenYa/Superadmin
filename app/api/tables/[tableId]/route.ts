import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { checkFeatureAccess, createTierErrorResponse } from "@/lib/tier-access";

// PUT /api/tables/:tableId - Update table number
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const { tableId } = await params;
    const body = await request.json();
    const { number, tenant_id } = body;

    if (!number || !tenant_id) {
      return NextResponse.json(
        { error: "number and tenant_id are required" },
        { status: 400 }
      );
    }

    // Check tier access - Tables feature requires Pro tier
    const access = await checkFeatureAccess(parseInt(tenant_id), 'table_management');
    if (!access.allowed) {
      return NextResponse.json(
        createTierErrorResponse(access.message || 'Access denied', access.tier || 'light'),
        { status: 403 }
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
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get("tenant_id");

    if (!tenant_id) {
      return NextResponse.json(
        { error: "tenant_id is required" },
        { status: 400 }
      );
    }

    // Check tier access - Tables feature requires Pro tier
    const access = await checkFeatureAccess(parseInt(tenant_id), 'table_management');
    if (!access.allowed) {
      return NextResponse.json(
        createTierErrorResponse(access.message || 'Access denied', access.tier || 'light'),
        { status: 403 }
      );
    }

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
