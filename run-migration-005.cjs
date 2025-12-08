// Script to run migration 005 - Add rate limiting
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔄 Running migration 005_add_rate_limiting.sql...');
    
    const migrationPath = path.join(__dirname, 'sql', 'migrations', '005_add_rate_limiting.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
    // Check results
    const result = await pool.query(`
      SELECT COUNT(*) as count FROM rate_limits
    `);
    
    console.log('\n📊 Rate limits table created');
    console.log(`   Current records: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration();
