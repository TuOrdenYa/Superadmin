import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { checkAdminAuth } from '@/lib/superadmin-auth';

export async function POST(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (auth) return auth;

  try {
    const { tax_id } = await request.json();

    if (!tax_id) {
      return NextResponse.json({ ok: false, error: 'tax_id requerido' }, { status: 400 });
    }

    // Buscar el tenant
    const tenantResult = await query(
      `SELECT id, tax_id, name, product_tier, subscription_status
       FROM tenants
       WHERE tax_id = $1 OR id::text = $1
       LIMIT 1`,
      [String(tax_id)]
    );

    if (!tenantResult.rows.length) {
      return NextResponse.json({ ok: false, error: 'Tenant no encontrado' }, { status: 404 });
    }

    const tenant = tenantResult.rows[0];

    // Buscar el usuario admin del tenant
    const userResult = await query(
      `SELECT u.id, u.full_name, u.email, u.role, u.location_id,
              l.name as location_name
       FROM users u
       LEFT JOIN locations l ON u.location_id = l.id
       WHERE u.tenant_id = $1
         AND u.role = 'admin'
         AND u.is_active = true
       ORDER BY u.created_at ASC
       LIMIT 1`,
      [tenant.id]
    );

    if (!userResult.rows.length) {
      return NextResponse.json(
        { ok: false, error: 'Este tenant no tiene usuario admin activo' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Generar JWT igual al del login normal
    const token = generateToken({
      uid: user.id,
      tenant_id: tenant.id,
      role: user.role,
      location_id: user.location_id || null,
    });

    return NextResponse.json({
      ok: true,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        tenant_id: tenant.id,
        tenant_tax_id: tenant.tax_id,
        role: user.role,
        location_id: user.location_id || null,
        location_name: user.location_name || null,
        product_tier: tenant.product_tier || 'pro',
        subscription_status: tenant.subscription_status || 'active',
      },
    });
  } catch (error) {
    console.error('[superadmin/impersonate] error:', error);
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 });
  }
}