import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authorization = request.headers.get('authorization');
    const token = getTokenFromHeader(authorization || '');

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'No token' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { ok: false, error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Get user details with tenant information
    const userResult = await query(
      `SELECT u.id, u.tenant_id, u.full_name, u.email, u.role, u.is_active, u.location_id, t.name AS tenant_name
       FROM users u 
       JOIN tenants t ON t.id = u.tenant_id
       WHERE u.id = $1 
       LIMIT 1`,
      [payload.uid]
    );

    const user = userResult.rows[0];

    if (!user || user.is_active === false) {
      return NextResponse.json(
        { ok: false, error: 'Usuario inválido' },
        { status: 401 }
      );
    }

    // Get locations for this tenant
    const locationsResult = await query(
      `SELECT id, name, TRUE AS is_active 
       FROM locations 
       WHERE tenant_id = $1 
       ORDER BY id`,
      [user.tenant_id]
    );

    return NextResponse.json({
      ok: true,
      user: {
        ...user,
        locations: locationsResult.rows,
      },
    });
  } catch (error) {
    console.error('[auth/me] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Error interno' },
      { status: 500 }
    );
  }
}
