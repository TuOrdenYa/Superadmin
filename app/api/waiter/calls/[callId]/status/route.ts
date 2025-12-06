import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// PATCH /api/waiter/calls/:callId/status - Update waiter call status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ callId: string }> }
) {
  try {
    const { callId } = await params;
    const body = await request.json();
    const { status } = body;

    // Valid statuses: PENDING, IN_PROGRESS, RESOLVED
    const validStatuses = ["PENDING", "IN_PROGRESS", "RESOLVED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE waiter_calls
       SET status = $1, updated_at = now()
       WHERE id = $2
       RETURNING *`,
      [status, callId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Call not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      call: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating waiter call:", error);
    return NextResponse.json(
      { error: "Failed to update waiter call" },
      { status: 500 }
    );
  }
}
