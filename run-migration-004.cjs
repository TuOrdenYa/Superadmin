// Script to run migration 004 - Add custom categories support
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔄 Running migration 004_add_custom_categories.sql...');
    
    const migrationPath = path.join(__dirname, 'sql', 'migrations', '004_add_custom_categories.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
    // Check results
    const result = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE is_custom = false) as predefined_count,
        COUNT(*) FILTER (WHERE is_custom = true) as custom_count
      FROM categories
    `);
    
    console.log('\n📊 Category counts:');
    console.log(`   Predefined categories: ${result.rows[0].predefined_count}`);
    console.log(`   Custom categories: ${result.rows[0].custom_count}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration();
