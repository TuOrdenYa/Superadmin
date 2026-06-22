import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/tenants/[tenant]/profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  try {
    const { tenant } = await params;

    const result = await query(
      `SELECT id, name, slug, tax_id, logo_url, primary_color, secondary_color, 
              description, instagram, whatsapp, product_tier, subscription_status
       FROM tenants WHERE tax_id = $1 OR id::text = $1 LIMIT 1`,
      [String(tenant)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, profile: result.rows[0] });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT /api/tenants/[tenant]/profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  try {
    const { tenant } = await params;
    const body = await request.json();
    const { name, logo_url, primary_color, secondary_color, description, instagram, whatsapp } = body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name) { updates.push(`name = $${paramCount++}`); values.push(name.trim()); }
    if (logo_url !== undefined) { updates.push(`logo_url = $${paramCount++}`); values.push(logo_url); }
    if (primary_color) { updates.push(`primary_color = $${paramCount++}`); values.push(primary_color); }
    if (secondary_color) { updates.push(`secondary_color = $${paramCount++}`); values.push(secondary_color); }
    if (description !== undefined) { updates.push(`description = $${paramCount++}`); values.push(description); }
    if (instagram !== undefined) { updates.push(`instagram = $${paramCount++}`); values.push(instagram); }
    if (whatsapp !== undefined) { updates.push(`whatsapp = $${paramCount++}`); values.push(whatsapp); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(String(tenant));

    const result = await query(
      `UPDATE tenants SET ${updates.join(', ')}
       WHERE tax_id = $${paramCount} OR id::text = $${paramCount}
       RETURNING id, name, slug, logo_url, primary_color, secondary_color, description, instagram, whatsapp`,
      values
    );

    return NextResponse.json({ ok: true, profile: result.rows[0] });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}