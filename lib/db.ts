import { Pool, QueryResult, QueryResultRow } from 'pg';

// Ensure DATABASE_URL has pgbouncer parameter for Vercel
const connectionString = process.env.DATABASE_URL?.includes('?') 
  ? `${process.env.DATABASE_URL}&pgbouncer=true`
  : `${process.env.DATABASE_URL}?pgbouncer=true`;

// Create a single pool instance optimized for serverless
const pool = new Pool({
  connectionString,
  max: 1, // Serverless functions should use 1 connection
  idleTimeoutMillis: 0, // Disable idle timeout for serverless
  connectionTimeoutMillis: 10000, // Increase timeout to 10s
  allowExitOnIdle: true, // Allow process to exit when idle
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

