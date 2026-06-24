import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { checkAdminAuth } from '@/lib/superadmin-auth'

export async function POST(request: NextRequest) {
  const auth = checkAdminAuth(request)
  if (auth) return auth

  try {
    const { group_template_id, name, price_delta = 0, position = 0 } = await request.json()

    if (!group_template_id || !name) {
      return NextResponse.json({ error: 'group_template_id y name son requeridos' }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO variant_option_templates (group_template_id, name, position, price_delta, active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING *`,
      [group_template_id, name, position, price_delta]
    )

    return NextResponse.json({ ok: true, option: result.rows[0] })
  } catch (error) {
    console.error('[superadmin/variant-options POST]', error)
    return NextResponse.json({ error: 'Failed to create option' }, { status: 500 })
  }
}