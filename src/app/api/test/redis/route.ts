/**
 * Redis Connection Test Endpoint
 * 
 * Tests Redis connectivity for session management
 * Used by integration tests and debugging
 */

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export async function GET(_request: NextRequest) {
  try {
    // Initialize Redis client for testing
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    // Test Redis connection with a simple ping
    const testKey = `test:connection:${Date.now()}`;
    const testValue = 'connection-test';
    
    // Test set and get operations
    await redis.setex(testKey, 10, testValue); // Expire in 10 seconds
    const retrievedValue = await redis.get(testKey);
    
    // Clean up test key
    await redis.del(testKey);
    
    const connectionSuccess = retrievedValue === testValue;
    
    if (!connectionSuccess) {
      throw new Error(`Redis set/get test failed. Expected: ${testValue}, Got: ${retrievedValue}`);
    }
    
    // Test ping
    const pingResult = await redis.ping();
    
    // Get basic info (Upstash Redis doesn't support INFO command)
    const redisVersion = 'upstash-redis';
    
    return NextResponse.json({
      success: true,
      message: 'Redis connection successful',
      data: {
        connectionTest: 'passed',
        pingResult,
        redisVersion,
        timestamp: new Date().toISOString(),
        testKey,
        testResult: retrievedValue === testValue
      }
    });

  } catch (error) {
    console.error('❌ Redis connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Redis connection failed',
      error: error instanceof Error ? error.message : 'Unknown Redis error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
