import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { checkAdminAuth } from '@/lib/superadmin-auth'

// PATCH /api/superadmin/variant-groups/[groupId] — editar nombre, required, max_select, active
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const auth = checkAdminAuth(request)
  if (auth) return auth

  try {
    const { groupId } = await params
    const body = await request.json()
    const { name, required, max_select, active } = body

    const updates: string[] = []
    const values: any[] = []
    let i = 1

    if (name !== undefined)       { updates.push(`name = $${i++}`);       values.push(name) }
    if (required !== undefined)   { updates.push(`required = $${i++}`);   values.push(required) }
    if (max_select !== undefined) { updates.push(`max_select = $${i++}`); values.push(max_select) }
    if (active !== undefined)     { updates.push(`active = $${i++}`);     values.push(active) }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Sin campos para actualizar' }, { status: 400 })
    }

    values.push(groupId)

    const result = await query(
      `UPDATE variant_group_templates
       SET ${updates.join(', ')}
       WHERE id = $${i} AND tenant_id IS NULL
       RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Grupo no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, group: result.rows[0] })
  } catch (error) {
    console.error('[superadmin/variant-groups PATCH]', error)
    return NextResponse.json({ error: 'Failed to update variant group' }, { status: 500 })
  }
}