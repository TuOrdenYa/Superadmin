
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';


export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req) => {
    try {
      const body = await req.json();
      const { tenant_tax_id, email, password } = body;

      // Validate required fields
      if (!tenant_tax_id || !email || !password) {
        return NextResponse.json(
          { ok: false, error: 'tenant_tax_id, email y password son requeridos' },
          { status: 400 }
        );
      }

      // Look up tenant by tax_id
      const tenantResult = await query(
        'SELECT id, tax_id FROM tenants WHERE tax_id = $1 LIMIT 1',
        [String(tenant_tax_id)]
      );
      if (!tenantResult.rows.length) {
        return NextResponse.json(
          { ok: false, error: 'Tenant not found' },
          { status: 404 }
        );
      }
      const tenant_id = tenantResult.rows[0].id;

      // Find user by tenant_id and email WITH tier info in one query
      const result = await query(
        `SELECT u.id, u.tenant_id, u.full_name, u.email, u.password_hash, u.role, u.is_active, u.location_id, 
                l.name as location_name,
                t.product_tier,
                t.subscription_status
         FROM users u
         LEFT JOIN locations l ON u.location_id = l.id
         LEFT JOIN tenants t ON u.tenant_id = t.id
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
          tenant_tax_id: user.tenant_tax_id,
          role: user.role,
          location_id: user.location_id || null,
          location_name: user.location_name || null,
          product_tier: user.product_tier || 'pro',
          subscription_status: user.subscription_status || 'active',
        },
      });
    } catch (error) {
      console.error('[auth/login] error:', error);
      return NextResponse.json(
        { ok: false, error: 'Error interno' },
        { status: 500 }
      );
    }
  });
}
