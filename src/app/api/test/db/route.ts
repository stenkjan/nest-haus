/**
 * Database Connection Test API
 * 
 * Simple endpoint to verify PostgreSQL connectivity during setup
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test basic Prisma connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Test if we can access the database schema
    const tableCountResult = await prisma.$queryRaw`
      SELECT count(*)::text as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    ` as { table_count: string }[];

    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      connectionTest: result,
      schemaInfo: {
        tableCount: tableCountResult[0]?.table_count || '0',
        connection: 'active'
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Test database operations - try to get a count of any existing tables
    const dbStatus = await prisma.$executeRaw`SELECT current_database(), current_user, version()`;
    
    return NextResponse.json({
      status: 'success',
      message: 'Database operations test successful',
      dbStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database operations test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database operations test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 