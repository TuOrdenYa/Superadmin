import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenant_id, email, password } = body;

    // Validate required fields
    if (!tenant_id || !email || !password) {
      return NextResponse.json(
        { ok: false, error: 'tenant_id, email y password son requeridos' },
        { status: 400 }
      );
    }

    // Find user by tenant_id and email
    const result = await query(
      `SELECT u.id, u.tenant_id, u.full_name, u.email, u.password_hash, u.role, u.is_active, u.location_id, l.name as location_name
       FROM users u
       LEFT JOIN locations l ON u.location_id = l.id
       WHERE u.tenant_id = $1 AND lower(u.email) = lower($2) 
       LIMIT 1`,
      [Number(tenant_id), String(email).trim()]
    );

    const user = result.rows[0];

    // Check if user exists and is active
    if (!user || user.is_active === false) {
      return NextResponse.json(
        { ok: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(
      String(password),
      user.password_hash || ''
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { ok: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      uid: user.id,
      tenant_id: user.tenant_id,
      role: user.role,
      location_id: user.location_id || null,
    });

    // Return success response
    return NextResponse.json({
      ok: true,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        tenant_id: user.tenant_id,
        role: user.role,
        location_id: user.location_id || null,
        location_name: user.location_name || null,
      },
    });
  } catch (error) {
    console.error('[auth/login] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error interno' },
      { status: 500 }
    );
  }
}
