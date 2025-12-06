import { Pool, QueryResult, QueryResultRow } from 'pg';

// Create a single pool instance with minimal connections for Supabase
// Using pgbouncer transaction mode for better connection handling
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: connectionString?.includes('?') 
    ? `${connectionString}&pgbouncer=true` 
    : `${connectionString}?pgbouncer=true`,
  max: 1, // Single connection per instance for serverless
  idleTimeoutMillis: 10000, // Release connections faster
  connectionTimeoutMillis: 5000,
});

// Helper function for queries
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Query executed', { duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Close pool (for graceful shutdown)
export async function closePool(): Promise<void> {
  await pool.end();
}

