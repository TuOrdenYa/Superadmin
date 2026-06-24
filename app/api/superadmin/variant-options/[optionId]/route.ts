import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { checkAdminAuth } from '@/lib/superadmin-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ optionId: string }> }
) {
  const auth = checkAdminAuth(request)
  if (auth) return auth

  try {
    const { optionId } = await params
    const body = await request.json()
    const { name, price_delta, active } = body

    const updates: string[] = []
    const values: any[] = []
    let i = 1

    if (name !== undefined)        { updates.push(`name = $${i++}`);        values.push(name) }
    if (price_delta !== undefined)  { updates.push(`price_delta = $${i++}`); values.push(price_delta) }
    if (active !== undefined)       { updates.push(`active = $${i++}`);      values.push(active) }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Sin campos para actualizar' }, { status: 400 })
    }

    values.push(optionId)

    const result = await query(
      `UPDATE variant_option_templates
       SET ${updates.join(', ')}
       WHERE id = $${i}
       RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Opción no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, option: result.rows[0] })
  } catch (error) {
    console.error('[superadmin/variant-options PATCH]', error)
    return NextResponse.json({ error: 'Failed to update option' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ optionId: string }> }
) {
  const auth = checkAdminAuth(request)
  if (auth) return auth

  try {
    const { optionId } = await params
    await query(`DELETE FROM variant_option_templates WHERE id = $1`, [optionId])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[superadmin/variant-options DELETE]', error)
    return NextResponse.json({ error: 'Failed to delete option' }, { status: 500 })
  }
}