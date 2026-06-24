import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { checkAdminAuth } from '@/lib/superadmin-auth'

// GET /api/superadmin/notes?tenant_id=xxx
export async function GET(request: NextRequest) {
  const auth = checkAdminAuth(request)
  if (auth) return auth

  try {
    const { searchParams } = new URL(request.url)
    const tenant_id = searchParams.get('tenant_id')

    const sql = tenant_id
      ? `SELECT n.id, n.tenant_id, n.text, n.created_at, t.name as tenant_name
         FROM superadmin_notes n
         JOIN tenants t ON n.tenant_id = t.id
         WHERE n.tenant_id = $1
         ORDER BY n.created_at DESC`
      : `SELECT n.id, n.tenant_id, n.text, n.created_at, t.name as tenant_name
         FROM superadmin_notes n
         JOIN tenants t ON n.tenant_id = t.id
         ORDER BY n.created_at DESC`

    const result = tenant_id
      ? await query(sql, [tenant_id])
      : await query(sql)

    return NextResponse.json({ ok: true, notes: result.rows })
  } catch (error) {
    console.error('[superadmin/notes GET]', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

// POST /api/superadmin/notes
export async function POST(request: NextRequest) {
  const auth = checkAdminAuth(request)
  if (auth) return auth

  try {
    const { tenant_id, text } = await request.json()

    if (!tenant_id || !text?.trim()) {
      return NextResponse.json({ error: 'tenant_id y text son requeridos' }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO superadmin_notes (tenant_id, text)
       VALUES ($1, $2)
       RETURNING *`,
      [tenant_id, text.trim()]
    )

    return NextResponse.json({ ok: true, note: result.rows[0] })
  } catch (error) {
    console.error('[superadmin/notes POST]', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}