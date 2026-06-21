import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/tables/[tableId] - Get table info
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const { tableId } = await params;

    const result = await query(
      `SELECT t.id, t.name, t.location_id, t.tenant_id,
              l.name as location_name
       FROM tables t
       LEFT JOIN locations l ON l.id = t.location_id
       WHERE t.id::text = $1
       LIMIT 1`,
      [String(tableId)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, table: result.rows[0] });
  } catch (error) {
    console.error('Error fetching table:', error);
    return NextResponse.json({ error: 'Failed to fetch table' }, { status: 500 });
  }
}

// PUT /api/tables/[tableId] - Update table
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const { tableId } = await params;
    const body = await request.json();
    const { number, tenant_id } = body;

    if (!number) {
      return NextResponse.json({ error: 'number is required' }, { status: 400 });
    }

    const result = await query(
      `UPDATE tables SET name = $1 WHERE id::text = $2 AND tenant_id = $3 RETURNING *`,
      [number, String(tableId), String(tenant_id)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, table: result.rows[0] });
  } catch (error) {
    console.error('Error updating table:', error);
    return NextResponse.json({ error: 'Failed to update table' }, { status: 500 });
  }
}

// DELETE /api/tables/[tableId] - Delete table
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const { tableId } = await params;
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get('tenant_id');

    const result = await query(
      `DELETE FROM tables WHERE id::text = $1 ${tenant_id ? 'AND tenant_id = $2' : ''} RETURNING *`,
      tenant_id ? [String(tableId), String(tenant_id)] : [String(tableId)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting table:', error);
    return NextResponse.json({ error: 'Failed to delete table' }, { status: 500 });
  }
}