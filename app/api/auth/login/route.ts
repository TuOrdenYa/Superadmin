
import { NextRequest, NextResponse } from 'next/server';
import { query, logSuspiciousActivity } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';


export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req) => {
    try {
      const body = await req.json();
      const { tenant_tax_id, email, password, turnstileToken } = body;

      // Verify Turnstile token with Cloudflare
      if (!turnstileToken) {
        return NextResponse.json({ ok: false, error: 'Missing Turnstile token.' }, { status: 400 });
      }
      const cfSecret = process.env.TURNSTILE_SECRET_KEY;
      if (!cfSecret) {
        return NextResponse.json({ ok: false, error: 'Server misconfiguration: missing Turnstile secret.' }, { status: 500 });
      }
      const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(cfSecret)}&response=${encodeURIComponent(turnstileToken)}`,
      });
      const cfData = await cfRes.json();
      if (!cfData.success) {
        return NextResponse.json({ ok: false, error: 'Turnstile verification failed.' }, { status: 400 });
      }

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
                u.failed_login_attempts, u.lockout_until,
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
        // Log suspicious activity: failed login (user not found or inactive)
        await logSuspiciousActivity({
          user_id: null,
          tenant_id,
          email,
          ip_address: req.headers.get('x-forwarded-for') || req.ip || null,
          event_type: 'failed_login',
          event_details: { reason: 'user_not_found_or_inactive' }
        });
        return NextResponse.json(
          { ok: false, error: 'Credenciales inválidas' },
          { status: 401 }
        );
      }

      // Check for lockout
      if (user.lockout_until && new Date(user.lockout_until) > new Date()) {
        // Log suspicious activity: attempted login to locked account
        await logSuspiciousActivity({
          user_id: user.id,
          tenant_id,
          email,
          ip_address: req.headers.get('x-forwarded-for') || req.ip || null,
          event_type: 'login_attempt_locked',
          event_details: { lockout_until: user.lockout_until }
        });
        return NextResponse.json(
          { ok: false, error: 'Cuenta bloqueada por demasiados intentos fallidos. Intenta nuevamente más tarde.' },
          { status: 403 }
        );
      }

      // Verify password
      const isValidPassword = await verifyPassword(
        String(password),
        user.password_hash || ''
      );

      if (!isValidPassword) {
        // Increment failed attempts
        let failedAttempts = (user.failed_login_attempts || 0) + 1;
        let lockoutUntil = null;
        let lockoutTriggered = false;
        if (failedAttempts >= 5) {
          // Lock for 15 minutes
          lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
          lockoutTriggered = true;
        }
        await query(
          'UPDATE users SET failed_login_attempts = $1, lockout_until = $2 WHERE id = $3',
          [failedAttempts, lockoutUntil, user.id]
        );
        // Log suspicious activity: failed login (bad password)
        await logSuspiciousActivity({
          user_id: user.id,
          tenant_id,
          email,
          ip_address: req.headers.get('x-forwarded-for') || req.ip || null,
          event_type: lockoutTriggered ? 'account_lockout' : 'failed_login',
          event_details: {
            failedAttempts,
            lockoutUntil,
            reason: 'bad_password'
          }
        });
        return NextResponse.json(
          { ok: false, error: failedAttempts >= 5 ? 'Cuenta bloqueada por demasiados intentos fallidos. Intenta nuevamente en 15 minutos.' : 'Credenciales inválidas' },
          { status: failedAttempts >= 5 ? 403 : 401 }
        );
      } else {
        // Reset failed attempts and lockout
        if (user.failed_login_attempts > 0 || user.lockout_until) {
          await query(
            'UPDATE users SET failed_login_attempts = 0, lockout_until = NULL WHERE id = $1',
            [user.id]
          );
        }
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
