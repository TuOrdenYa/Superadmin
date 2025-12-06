import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/tenants/[tenant]/tables - List tables (optionally filter by location)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  try {
    const { tenant } = await params;
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('location_id');

    let sql = `
      SELECT t.id, t.location_id, t.number, t.tenant_id, 
             l.name as location_name
      FROM tables t
      LEFT JOIN locations l ON t.location_id = l.id
      WHERE t.tenant_id = $1
    `;
    const queryParams: any[] = [tenant];

    if (locationId) {
      sql += ' AND t.location_id = $2';
      queryParams.push(locationId);
    }

    sql += ' ORDER BY t.location_id, t.number';

    const result = await query(sql, queryParams);

    return NextResponse.json({
      ok: true,
      tables: result.rows,
    });
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tables' },
      { status: 500 }
    );
  }
}

// POST /api/tenants/[tenant]/tables - Create new table
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  try {
    const { tenant } = await params;
    const body = await request.json();
    const { location_id, number } = body;

    if (!location_id || !number) {
      return NextResponse.json(
        { error: 'location_id and number are required' },
        { status: 400 }
      );
    }

    // Check if table number already exists in this location
    const existing = await query(
      `SELECT id FROM tables 
       WHERE tenant_id = $1 AND location_id = $2 AND number = $3`,
      [tenant, location_id, number]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Table number already exists in this location' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO tables (tenant_id, location_id, number)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [tenant, location_id, number]
    );

    return NextResponse.json({
      ok: true,
      table: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating table:', error);
    return NextResponse.json(
      { error: 'Failed to create table' },
      { status: 500 }
    );
  }
}
