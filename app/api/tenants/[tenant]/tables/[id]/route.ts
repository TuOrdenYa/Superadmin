import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// PUT /api/tenants/[tenant]/tables/[id] - Update table
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string; id: string }> }
) {
  try {
    const { tenant, id } = await params;
    const body = await request.json();
    const { number } = body;

    if (!number) {
      return NextResponse.json(
        { error: 'number is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE tables
       SET number = $1
       WHERE id = $2 AND tenant_id = $3
       RETURNING *`,
      [number, id, tenant]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      table: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating table:', error);
    return NextResponse.json(
      { error: 'Failed to update table' },
      { status: 500 }
    );
  }
}

// DELETE /api/tenants/[tenant]/tables/[id] - Delete table
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string; id: string }> }
) {
  try {
    const { tenant, id } = await params;

    const result = await query(
      `DELETE FROM tables
       WHERE id = $1 AND tenant_id = $2
       RETURNING *`,
      [id, tenant]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      table: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting table:', error);
    return NextResponse.json(
      { error: 'Failed to delete table' },
      { status: 500 }
    );
  }
}
