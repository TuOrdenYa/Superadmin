import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

// GET - List all users (super admin only)
export async function GET(request: NextRequest) {
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
      sql += ' WHERE u.tenant_id = $1';
      params.push(parseInt(tenantId));
    }
    
    sql += ' ORDER BY u.tenant_id, u.created_at DESC';

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

// POST - Create new user (super admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenant_id, location_id, email, full_name, role, password } = body;

    // Validate required fields
    if (!tenant_id || !email || !full_name || !role) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['admin', 'manager', 'waiter'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Validate location_id for manager/waiter
    if ((role === 'manager' || role === 'waiter') && !location_id) {
      return NextResponse.json(
        { ok: false, error: 'Location required for manager and waiter roles' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { ok: false, error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Generate password hash (use provided password or generate random one)
    const userPassword = password || Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(userPassword, 10);

    // Insert user
    const result = await query(
      `INSERT INTO users 
        (tenant_id, location_id, email, password_hash, full_name, role, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, true) 
       RETURNING id, tenant_id, location_id, email, full_name, role, is_active`,
      [
        parseInt(tenant_id),
        location_id ? parseInt(location_id) : null,
        email.toLowerCase().trim(),
        passwordHash,
        full_name.trim(),
        role,
      ]
    );

    return NextResponse.json({
      ok: true,
      user: result.rows[0],
      password: userPassword, // Return generated password (only shown once!)
    });
  } catch (error) {
    console.error('[admin/users POST] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
