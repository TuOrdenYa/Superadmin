import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const results: any = {};

    // Check tables
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    results.tables = tables.rows.map(t => t.table_name);

    // Count data
    const tenants = await query('SELECT COUNT(*) as count FROM tenants');
    const locations = await query('SELECT COUNT(*) as count FROM locations');
    const categories = await query('SELECT COUNT(*) as count FROM categories');
    const items = await query('SELECT COUNT(*) as count FROM menu_items');
    const users = await query('SELECT COUNT(*) as count FROM users');
    const orders = await query('SELECT COUNT(*) as count FROM orders');

    results.counts = {
      tenants: parseInt(tenants.rows[0].count),
      locations: parseInt(locations.rows[0].count),
      categories: parseInt(categories.rows[0].count),
      menu_items: parseInt(items.rows[0].count),
      users: parseInt(users.rows[0].count),
      orders: parseInt(orders.rows[0].count),
    };

    // Sample data
    const tenantData = await query('SELECT * FROM tenants LIMIT 3');
    const locationData = await query('SELECT * FROM locations LIMIT 3');
    const categoryData = await query('SELECT * FROM categories LIMIT 3');

    results.sampleData = {
      tenants: tenantData.rows,
      locations: locationData.rows,
      categories: categoryData.rows,
    };

    return NextResponse.json({ ok: true, ...results });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
