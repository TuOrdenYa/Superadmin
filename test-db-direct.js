import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgresql://postgres.jqpelyhmichbtmbhcckp:xYsDt1XPrvTXTOlb@aws-1-sa-east-1.pooler.supabase.com:6543/postgres',
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

async function test() {
  try {
    console.log('Testing connection...');
    const result = await pool.query('SELECT NOW() as time');
    console.log('✅ SUCCESS!');
    console.log('Time:', result.rows[0].time);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Code:', error.code);
    console.error('Detail:', error.detail);
    process.exit(1);
  }
}

test();
