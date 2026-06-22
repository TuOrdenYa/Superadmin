import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

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

export async function closePool(): Promise<void> {
  await pool.end();
}

export async function logSuspiciousActivity({
  user_id = null,
  tenant_id = null,
  email = null,
  ip_address = null,
  event_type,
  event_details = null,
}: {
  user_id?: number | null;
  tenant_id?: number | null;
  email?: string | null;
  ip_address?: string | null;
  event_type: string;
  event_details?: any;
}) {
  try {
    await query(
      `INSERT INTO suspicious_activity_log (user_id, tenant_id, email, ip_address, event_type, event_details)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user_id, tenant_id, email, ip_address, event_type, event_details ? JSON.stringify(event_details) : null]
    );
  } catch (err) {
    console.error('Failed to log suspicious activity:', err);
  }
}