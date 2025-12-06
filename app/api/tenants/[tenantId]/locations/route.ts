import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await params;

    if (!tenantId) {
      return NextResponse.json(
        { ok: false, error: 'tenantId inválido' },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT id, name, TRUE AS is_active 
       FROM locations 
       WHERE tenant_id = $1 
       ORDER BY id`,
      [Number(tenantId)]
    );

    return NextResponse.json({
      ok: true,
      locations: result.rows,
    });
  } catch (error) {
    console.error('[GET /api/tenants/:tenantId/locations] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error al obtener locaciones' },
      { status: 500 }
    );
  }
}

// POST /api/tenants/:tenantId/locations - Create new location
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO locations (tenant_id, name)
       VALUES ($1, $2)
       RETURNING *`,
      [Number(tenantId), name]
    );

    return NextResponse.json({
      ok: true,
      location: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
}
