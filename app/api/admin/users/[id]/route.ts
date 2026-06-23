import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';
import { checkAdminAuth } from '@/lib/superadmin-auth';

// PUT /api/admin/users/[id] - Update user (activate/deactivate)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = checkAdminAuth(request);
  if (auth) return auth;

  try {
    const { id } = await params;
    const body = await request.json();
    const { tenant_id, is_active, full_name, role, location_id, password } = body;

    if (!tenant_id) {
      return NextResponse.json({ ok: false, error: 'tenant_id is required' }, { status: 400 });
    }

    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant_id)]
    );
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Tenant not found' }, { status: 404 });
    }
    const tenantUuid = tenantResult.rows[0].id;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (typeof is_active === 'boolean') { updates.push(`is_active = $${paramCount++}`); values.push(is_active); }
    if (full_name) { updates.push(`full_name = $${paramCount++}`); values.push(full_name.trim()); }
    if (role) { updates.push(`role = $${paramCount++}`); values.push(role); }
    if (location_id !== undefined) { updates.push(`location_id = $${paramCount++}`); values.push(location_id || null); }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updates.push(`password_hash = $${paramCount++}`);
      values.push(hash);
    }

    if (updates.length === 0) {
      return NextResponse.json({ ok: false, error: 'No fields to update' }, { status: 400 });
    }

    values.push(String(id), tenantUuid);

    const result = await query(
      `UPDATE users SET ${updates.join(', ')}
       WHERE id::text = $${paramCount} AND tenant_id = $${paramCount + 1}
       RETURNING id, email, full_name, role, is_active, location_id`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user: result.rows[0] });
  } catch (error) {
    console.error('[admin/users PUT] error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = checkAdminAuth(request);
  if (auth) return auth;

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get('tenant_id');

    if (!tenant_id) {
      return NextResponse.json({ ok: false, error: 'tenant_id is required' }, { status: 400 });
    }

    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant_id)]
    );
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Tenant not found' }, { status: 404 });
    }
    const tenantUuid = tenantResult.rows[0].id;

    const userCheck = await query(
      `SELECT role FROM users WHERE id::text = $1 AND tenant_id = $2`,
      [String(id), tenantUuid]
    );
    if (userCheck.rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    }
    if (userCheck.rows[0].role === 'admin') {
      return NextResponse.json({ ok: false, error: 'Cannot delete admin users' }, { status: 403 });
    }

    await query(
      `DELETE FROM users WHERE id::text = $1 AND tenant_id = $2`,
      [String(id), tenantUuid]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[admin/users DELETE] error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to delete user' }, { status: 500 });
  }
}