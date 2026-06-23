import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';
import { isPasswordStrong } from '@/lib/auth';
import { checkAdminAuth } from '@/lib/superadmin-auth';

// GET - List users for a tenant
export async function GET(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (auth) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenant_id');

    let sql = `
      SELECT
        u.id,
        u.tenant_id,
        u.location_id,
        u.email,
        u.full_name,
        u.role,
        u.is_active,
        u.created_at,
        t.name as tenant_name,
        l.name as location_name
      FROM users u
      LEFT JOIN tenants t ON u.tenant_id = t.id
      LEFT JOIN locations l ON u.location_id = l.id
    `;

    const params: any[] = [];
    if (tenantId) {
      const tenantResult = await query(
        `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
        [String(tenantId)]
      );
      if (tenantResult.rows.length === 0) {
        return NextResponse.json({ ok: true, users: [] });
      }
      sql += ' WHERE u.tenant_id = $1';
      params.push(tenantResult.rows[0].id);
    }

    sql += ' ORDER BY u.created_at DESC';

    const result = await query(sql, params);

    return NextResponse.json({
      ok: true,
      users: result.rows,
    });
  } catch (error) {
    console.error('[admin/users GET] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (auth) return auth;

  try {
    const body = await request.json();
    const { tenant_id, location_id, email, full_name, role, password } = body;

    if (!tenant_id || !email || !full_name || !role) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validRoles = ['admin', 'manager', 'waiter', 'kitchen'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    if ((role === 'manager' || role === 'waiter' || role === 'kitchen') && !location_id) {
      return NextResponse.json(
        { ok: false, error: 'Location required for manager, waiter and kitchen roles' },
        { status: 400 }
      );
    }

    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant_id)]
    );
    if (tenantResult.rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Tenant not found' },
        { status: 404 }
      );
    }
    const tenantUuid = tenantResult.rows[0].id;

    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 AND tenant_id = $2',
      [email.toLowerCase().trim(), tenantUuid]
    );
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { ok: false, error: 'Email already exists' },
        { status: 409 }
      );
    }

    let userPassword = password;
    if (userPassword) {
      if (!isPasswordStrong(userPassword)) {
        return NextResponse.json(
          { ok: false, error: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.' },
          { status: 400 }
        );
      }
    } else {
      userPassword = Math.random().toString(36).slice(-6).toUpperCase() + Math.random().toString(36).slice(-6) + '!1';
    }
    const passwordHash = await bcrypt.hash(userPassword, 10);

    const result = await query(
      `INSERT INTO users
        (tenant_id, location_id, email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING id, tenant_id, location_id, email, full_name, role, is_active`,
      [
        tenantUuid,
        location_id ? String(location_id) : null,
        email.toLowerCase().trim(),
        passwordHash,
        full_name.trim(),
        role,
      ]
    );

    return NextResponse.json({
      ok: true,
      user: result.rows[0],
      password: userPassword,
    });
  } catch (error) {
    console.error('[admin/users POST] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}