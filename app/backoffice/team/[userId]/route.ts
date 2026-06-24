import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// PUT /api/backoffice/team/[userId] — activar/desactivar
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const { tenant_id, is_active } = await request.json()

    if (!tenant_id) {
      return NextResponse.json({ ok: false, error: 'tenant_id requerido' }, { status: 400 })
    }

    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant_id)]
    )
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Tenant no encontrado' }, { status: 404 })
    }
    const tenantUuid = tenantResult.rows[0].id

    const result = await query(
      `UPDATE users SET is_active = $1
       WHERE id::text = $2 AND tenant_id = $3
       RETURNING id, email, full_name, role, is_active`,
      [is_active, userId, tenantUuid]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, user: result.rows[0] })
  } catch (error) {
    console.error('[backoffice/team PUT]', error)
    return NextResponse.json({ ok: false, error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE /api/backoffice/team/[userId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const { searchParams } = new URL(request.url)
    const tenant_id = searchParams.get('tenant_id')

    if (!tenant_id) {
      return NextResponse.json({ ok: false, error: 'tenant_id requerido' }, { status: 400 })
    }

    const tenantResult = await query(
      `SELECT id FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant_id)]
    )
    if (tenantResult.rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Tenant no encontrado' }, { status: 404 })
    }
    const tenantUuid = tenantResult.rows[0].id

    const userCheck = await query(
      `SELECT role FROM users WHERE id::text = $1 AND tenant_id = $2`,
      [userId, tenantUuid]
    )
    if (userCheck.rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Usuario no encontrado' }, { status: 404 })
    }
    if (userCheck.rows[0].role === 'admin') {
      return NextResponse.json({ ok: false, error: 'No se puede eliminar al admin' }, { status: 403 })
    }

    await query(
      `DELETE FROM users WHERE id::text = $1 AND tenant_id = $2`,
      [userId, tenantUuid]
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[backoffice/team DELETE]', error)
    return NextResponse.json({ ok: false, error: 'Failed to delete user' }, { status: 500 })
  }
}