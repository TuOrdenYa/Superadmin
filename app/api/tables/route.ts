import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/tables - List all tables for a location
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location_id = searchParams.get("location_id");

    if (!location_id) {
      return NextResponse.json(
        { error: "location_id is required" },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT id, location_id, number, created_at
       FROM tables
       WHERE location_id = $1
       ORDER BY number`,
      [location_id]
    );

    return NextResponse.json({
      ok: true,
      tables: result.rows,
    });
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json(
      { error: "Failed to fetch tables" },
      { status: 500 }
    );
  }
}

// POST /api/tables - Create a new table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location_id, number } = body;

    if (!location_id || !number) {
      return NextResponse.json(
        { error: "location_id and number are required" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO tables (location_id, number)
       VALUES ($1, $2)
       RETURNING *`,
      [location_id, number]
    );

    return NextResponse.json({
      ok: true,
      table: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating table:", error);
    return NextResponse.json(
      { error: "Failed to create table" },
      { status: 500 }
    );
  }
}
