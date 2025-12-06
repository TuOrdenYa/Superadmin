import { query } from './lib/db.js';

async function checkDatabase() {
  console.log('🔍 Checking Supabase Database...\n');

  try {
    // Check what tables exist
    console.log('📊 Tables in database:');
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    tables.rows.forEach(t => console.log(`  - ${t.table_name}`));

    console.log('\n📦 Data counts:');
    
    // Check tenants
    const tenants = await query('SELECT COUNT(*) as count FROM tenants');
    console.log(`  Tenants: ${tenants.rows[0].count}`);
    
    // Check locations
    const locations = await query('SELECT COUNT(*) as count FROM locations');
    console.log(`  Locations: ${locations.rows[0].count}`);
    
    // Check categories
    const categories = await query('SELECT COUNT(*) as count FROM categories');
    console.log(`  Categories: ${categories.rows[0].count}`);
    
    // Check menu_items
    const items = await query('SELECT COUNT(*) as count FROM menu_items');
    console.log(`  Menu Items: ${items.rows[0].count}`);
    
    // Check users
    const users = await query('SELECT COUNT(*) as count FROM users');
    console.log(`  Users: ${users.rows[0].count}`);
    
    // Check orders
    const orders = await query('SELECT COUNT(*) as count FROM orders');
    console.log(`  Orders: ${orders.rows[0].count}`);

    console.log('\n🔍 Sample data:');
    
    // Show tenants
    const tenantData = await query('SELECT * FROM tenants LIMIT 3');
    console.log('\n  Tenants:', JSON.stringify(tenantData.rows, null, 2));
    
    // Show locations
    const locationData = await query('SELECT * FROM locations LIMIT 3');
    console.log('\n  Locations:', JSON.stringify(locationData.rows, null, 2));
    
    // Show categories
    const categoryData = await query('SELECT * FROM categories LIMIT 3');
    console.log('\n  Categories:', JSON.stringify(categoryData.rows, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

checkDatabase();
