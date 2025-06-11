/**
 * Redis Connection Test API
 * 
 * Simple endpoint to verify Redis connectivity during setup
 */

import { NextResponse } from 'next/server';
import { SessionManager } from '@/lib/redis';

export async function GET() {
  try {
    // Test basic Redis connection
    const testSessionId = await SessionManager.createSession({
      ipAddress: 'test',
      userAgent: 'setup-test',
    });

    // Test retrieval
    const session = await SessionManager.getSession(testSessionId);

    if (session) {
      return NextResponse.json({
        status: 'success',
        message: 'Redis connection successful',
        sessionId: testSessionId,
        timestamp: new Date().toISOString(),
      });
    } else {
      throw new Error('Session not found after creation');
    }
  } catch (error) {
    console.error('Redis connection test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Redis connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Test analytics functionality
    const analytics = await SessionManager.getSessionAnalytics('day');
    
    return NextResponse.json({
      status: 'success',
      message: 'Redis analytics test successful',
      analytics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Redis analytics test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Redis analytics test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 