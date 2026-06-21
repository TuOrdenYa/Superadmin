import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/tenants/[tenant]/locations - List locations for tenant
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  try {
    const { tenant } = await params;

    const result = await query(
      `SELECT l.id, l.tenant_id, l.name, l.address, l.phone, l.slug
       FROM locations l
       INNER JOIN tenants t ON t.id = l.tenant_id
       WHERE t.tax_id = $1 OR t.id::text = $1
       ORDER BY l.name`,
      [String(tenant)]
    );

    return NextResponse.json({ ok: true, locations: result.rows });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

// POST /api/tenants/[tenant]/locations - Create new location
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  try {
    const { tenant } = await params;
    const body = await request.json();
    const { name, address, phone } = body;

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    // Get tenant UUID
    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant)]
    );

    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const tenantUuid = tenantResult.rows[0].id;

    const result = await query(
      `INSERT INTO locations (tenant_id, name, address, phone, slug)
 VALUES ($1, $2, $3, $4, substr(md5(random()::text), 1, 8))
 RETURNING id, tenant_id, name, address, phone, slug`,
      [tenantUuid, name.trim(), address || null, phone || null]
    );

    return NextResponse.json({ ok: true, location: result.rows[0] });
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
  }
}

// PUT /api/tenants/[tenant]/locations - Update location
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  try {
    const { tenant } = await params;
    const body = await request.json();
    const { id, name, address, phone } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'id and name are required' }, { status: 400 });
    }

    // Get tenant UUID
    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant)]
    );

    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const tenantUuid = tenantResult.rows[0].id;

    const result = await query(
      `UPDATE locations SET name = $1, address = $2, phone = $3
       WHERE id::text = $4 AND tenant_id = $5
       RETURNING id, tenant_id, name, address, phone`,
      [name.trim(), address || null, phone || null, String(id), tenantUuid]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, location: result.rows[0] });
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
  }
}

// DELETE /api/tenants/[tenant]/locations/[id] handled separately
// This handles DELETE with id in body
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  try {
    const { tenant } = await params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // Get tenant UUID
    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant)]
    );

    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const tenantUuid = tenantResult.rows[0].id;

    const result = await query(
      `DELETE FROM locations WHERE id::text = $1 AND tenant_id = $2 RETURNING id`,
      [String(id), tenantUuid]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}