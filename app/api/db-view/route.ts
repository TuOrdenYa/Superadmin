import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Test connection
    const timeResult = await query('SELECT NOW() as time');
    
    // Get all tenants
    const tenantsResult = await query(`
      SELECT id, name, slug, product_tier, subscription_status 
      FROM tenants 
      ORDER BY id
    `);
    
    // Get all users
    const usersResult = await query(`
      SELECT id, full_name, email, tenant_id, role, is_active 
      FROM users 
      ORDER BY tenant_id, id
    `);
    
    // Get menu items
    const itemsResult = await query(`
      SELECT id, name, tenant_id, price, active 
      FROM menu_items 
      ORDER BY tenant_id, id
    `);
    
    return NextResponse.json({
      ok: true,
      time: timeResult.rows[0].time,
      tenants: tenantsResult.rows,
      users: usersResult.rows,
      items: itemsResult.rows,
    });
  } catch (error: any) {
    console.error('Database view error:', error);
    return NextResponse.json({
      ok: false,
      error: error.message,
      code: error.code,
    }, { status: 500 });
  }
}
