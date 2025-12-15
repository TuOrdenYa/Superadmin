import { NextResponse } from 'next/server';

export function handleCors(request: Request) {
  // Allow all origins for development; restrict in production as needed
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers });
  }

  return headers;
}
