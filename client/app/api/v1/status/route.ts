import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    apiVersion: 'v1',
    server: 'running (Next.js serverless)'
  }, { status: 200 });
}
