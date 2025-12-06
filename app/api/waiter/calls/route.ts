import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/waiter/calls - List active waiter calls
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get("tenant_id");
    const location_id = searchParams.get("location_id");
    const status = searchParams.get("status") || "PENDING";

    if (!tenant_id || !location_id) {
      return NextResponse.json(
        { error: "tenant_id and location_id are required" },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT wc.*, t.number as table_number
       FROM waiter_calls wc
       LEFT JOIN tables t ON wc.table_id = t.id
       WHERE wc.tenant_id = $1 AND wc.location_id = $2 AND wc.status = $3
       ORDER BY wc.created_at DESC`,
      [tenant_id, location_id, status]
    );

    return NextResponse.json({
      ok: true,
      calls: result.rows,
    });
  } catch (error) {
    console.error("Error fetching waiter calls:", error);
    return NextResponse.json(
      { error: "Failed to fetch waiter calls" },
      { status: 500 }
    );
  }
}

// POST /api/waiter/calls - Create a new waiter call
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenant_id, location_id, table_id, message } = body;

    if (!tenant_id || !location_id || !table_id) {
      return NextResponse.json(
        { error: "tenant_id, location_id, and table_id are required" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO waiter_calls (tenant_id, location_id, table_id, message, status)
       VALUES ($1, $2, $3, $4, 'PENDING')
       RETURNING *`,
      [tenant_id, location_id, table_id, message || null]
    );

    return NextResponse.json({
      ok: true,
      call: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating waiter call:", error);
    return NextResponse.json(
      { error: "Failed to create waiter call" },
      { status: 500 }
    );
  }
}
