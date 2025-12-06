import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Simple test query
    const result = await query('SELECT NOW() as now, version() as version');
    
    return NextResponse.json({
      ok: true,
      database: 'connected',
      timestamp: result.rows[0].now,
      version: result.rows[0].version,
    });
  } catch (error: any) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Database connection failed',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
