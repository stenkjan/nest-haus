/**
 * Database Connection Test Endpoint
 * 
 * Tests PostgreSQL/Prisma connectivity
 * Used by integration tests and debugging
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    // Test database connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Test if we can access a table (check if schema is properly set up)
    const sessionCount = await prisma.userSession.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        connectionTest: result,
        sessionCount,
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL via Prisma'
      }
    });

  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown database error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}










