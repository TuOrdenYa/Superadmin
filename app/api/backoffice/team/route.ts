import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import bcrypt from 'bcrypt'
import { isPasswordStrong } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/backoffice/team?tenant_id=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenant_id')

    if (!tenantId) {
      return NextResponse.json({ ok: false, error: 'tenant_id requerido' }, { status: 400 })
    }

    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenantId)]
    )
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ ok: true, users: [] })
    }
    const tenantUuid = tenantResult.rows[0].id

    const result = await query(
      `SELECT u.id, u.email, u.full_name, u.role, u.is_active, u.location_id,
              l.name as location_name
       FROM users u
       LEFT JOIN locations l ON u.location_id = l.id
       WHERE u.tenant_id = $1
       ORDER BY u.created_at DESC`,
      [tenantUuid]
    )

    return NextResponse.json({ ok: true, users: result.rows })
  } catch (error) {
    console.error('[backoffice/team GET]', error)
    return NextResponse.json({ ok: false, error: 'Failed to fetch team' }, { status: 500 })
  }
}

// POST /api/backoffice/team — crear usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenant_id, full_name, email, role, location_id, password } = body

    if (!tenant_id || !full_name || !email || !role) {
      return NextResponse.json({ ok: false, error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const validRoles = ['admin', 'manager', 'waiter', 'kitchen']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ ok: false, error: 'Rol inválido' }, { status: 400 })
    }

    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant_id)]
    )
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Tenant no encontrado' }, { status: 404 })
    }
    const tenantUuid = tenantResult.rows[0].id

    const existing = await query(
      'SELECT id FROM users WHERE email = $1 AND tenant_id = $2',
      [email.toLowerCase().trim(), tenantUuid]
    )
    if (existing.rows.length > 0) {
      return NextResponse.json({ ok: false, error: 'El email ya existe' }, { status: 409 })
    }

    let userPassword = password
    if (userPassword) {
      if (!isPasswordStrong(userPassword)) {
        return NextResponse.json(
          { ok: false, error: 'La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, número y carácter especial.' },
          { status: 400 }
        )
      }
    } else {
      userPassword = Math.random().toString(36).slice(-6).toUpperCase() + Math.random().toString(36).slice(-6) + '!1'
    }
    const passwordHash = await bcrypt.hash(userPassword, 10)

    // Admin no tiene location_id
    const finalLocationId = role === 'admin' ? null : (location_id || null)

    const result = await query(
      `INSERT INTO users (tenant_id, location_id, email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING id, email, full_name, role, is_active, location_id`,
      [tenantUuid, finalLocationId, email.toLowerCase().trim(), passwordHash, full_name.trim(), role]
    )

    return NextResponse.json({ ok: true, user: result.rows[0], password: userPassword })
  } catch (error) {
    console.error('[backoffice/team POST]', error)
    return NextResponse.json({ ok: false, error: 'Failed to create user' }, { status: 500 })
  }
}