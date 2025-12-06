import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/admin/tenants/[id] - Get tenant by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = await query(
      `SELECT id, name, slug
       FROM tenants
       WHERE id = $1`,
      [Number(id)]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { ok: false, error: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      tenant: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch tenant" },
      { status: 500 }
    );
  }
}
