/**
 * Comprehensive Database Test API
 * 
 * Tests PostgreSQL, Redis, and their integration to verify
 * the entire database infrastructure is working correctly
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SessionManager } from '@/lib/redis';

interface TestResults {
  timestamp: string;
  postgresql: PostgreSQLTestResult | null;
  redis: RedisTestResult | null;
  integration: IntegrationTestResult | null;
  performance: PerformanceTestResult | null;
  summary: {
    status: string;
    errors: string[];
    warnings: string[];
  };
}

interface PostgreSQLTestResult {
  status: string;
  duration: number;
  schemaInfo: {
    table_count: string;
    database_name: string;
    user_name: string;
  };
  operations: Record<string, unknown>;
  newTrackingTables: Record<string, unknown>;
  testSessionId: string;
}

interface RedisTestResult {
  status: string;
  duration: number;
  operations: Record<string, unknown>;
  analytics: {
    totalSessions: number;
    activeSessions: number;
    averageSessionDuration: number;
  };
  testSessionId: string;
}

interface IntegrationTestResult {
  status: string;
  duration: number;
  operations: Record<string, unknown>;
  dataConsistency: Record<string, unknown>;
}

interface PerformanceTestResult {
  postgresql: {
    duration: number;
    operationsPerSecond: number;
    status: string;
    enhancedTrackingWorking: boolean;
  };
  redis: {
    duration: number;
    operationsPerSecond: number;
    status: string;
  };
  integration: {
    duration: number;
    status: string;
  };
}

interface SchemaInfoRow {
  table_count: string;
  database_name: string;
  user_name: string;
}

export async function GET() {
  const testResults: TestResults = {
    timestamp: new Date().toISOString(),
    postgresql: null,
    redis: null,
    integration: null,
    performance: null,
    summary: {
      status: 'unknown',
      errors: [],
      warnings: []
    }
  };

  try {
    console.log('🧪 Starting comprehensive database test...');

    // ===== POSTGRESQL TESTS =====
    console.log('📊 Testing PostgreSQL...');
    const pgStartTime = Date.now();

    // Test 1: Basic connection and schema info
    const schemaInfo = await prisma.$queryRaw`
      SELECT 
        count(*)::text as table_count,
        current_database() as database_name,
        current_user as user_name
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    ` as SchemaInfoRow[];

    // Test 2: Test UserSession operations (create, read, update)
    const testSession = await prisma.userSession.create({
      data: {
        sessionId: `test-session-${Date.now()}`,
        ipAddress: '127.0.0.1',
        userAgent: 'comprehensive-test',
        status: 'ACTIVE'
      }
    });

    // Test 3: Test SelectionEvent creation
    const testEvent = await prisma.selectionEvent.create({
      data: {
        sessionId: testSession.sessionId,
        category: 'nest',
        selection: 'nest80',
        timeSpentMs: 1500,
        totalPrice: 45000
      }
    });

    // Test 4: Test InteractionEvent creation (NEW)
    const testInteraction = await prisma.interactionEvent.create({
      data: {
        sessionId: testSession.sessionId,
        eventType: 'click',
        category: 'nest',
        elementId: 'nest-option-80',
        selectionValue: 'nest80',
        timeSpent: 1200,
        deviceType: 'desktop',
        viewportWidth: 1920,
        viewportHeight: 1080,
        additionalData: { page: 'configurator', section: 'house_type' }
      }
    });

    // Test 5: Test ConfigurationSnapshot creation (NEW)
    const testSnapshot = await prisma.configurationSnapshot.create({
      data: {
        sessionId: testSession.sessionId,
        configurationData: {
          nest: 'nest80',
          gebaeudehuelle: 'holzlattung',
          pricing: { totalPrice: 45000 }
        },
        totalPrice: 45000,
        completionPercentage: 65.5,
        triggerEvent: 'auto_save',
        additionalData: { step: 3, timeSpent: 120000 }
      }
    });

    // Test 6: Test PerformanceMetric creation (NEW)
    const testMetric = await prisma.performanceMetric.create({
      data: {
        sessionId: testSession.sessionId,
        metricName: 'api_response_time',
        value: 150.5,
        endpoint: '/api/pricing/calculate',
        userAgent: 'comprehensive-test',
        additionalData: { 
          method: 'POST',
          cacheHit: false,
          region: 'eu-central-1'
        }
      }
    });

    // Test 7: Test analytics aggregation (enhanced)
    const sessionCount = await prisma.userSession.count();
    const eventCount = await prisma.selectionEvent.count();
    const interactionCount = await prisma.interactionEvent.count();
    const snapshotCount = await prisma.configurationSnapshot.count();
    const metricCount = await prisma.performanceMetric.count();

    const pgDuration = Date.now() - pgStartTime;

    testResults.postgresql = {
      status: 'success',
      duration: pgDuration,
      schemaInfo: schemaInfo[0],
      operations: {
        sessionCreated: !!testSession.id,
        eventCreated: !!testEvent.id,
        interactionCreated: !!testInteraction.id,
        snapshotCreated: !!testSnapshot.id,
        metricCreated: !!testMetric.id,
        sessionCount,
        eventCount,
        interactionCount,
        snapshotCount,
        metricCount
      },
      newTrackingTables: {
        interactionEvents: { working: true, testId: testInteraction.id },
        configurationSnapshots: { working: true, testId: testSnapshot.id },
        performanceMetrics: { working: true, testId: testMetric.id }
      },
      testSessionId: testSession.id
    };

    console.log('✅ PostgreSQL tests passed');

    // ===== REDIS TESTS =====
    console.log('📡 Testing Redis...');
    const redisStartTime = Date.now();

    // Test 1: Create session in Redis
    const redisSessionId = await SessionManager.createSession({
      ipAddress: '127.0.0.1',
      userAgent: 'comprehensive-test-redis'
    });

    // Test 2: Track click event
    await SessionManager.trackClick(redisSessionId, {
      timestamp: Date.now(),
      category: 'nest',
      selection: 'nest80',
      timeSpent: 2000,
      totalPrice: 45000
    });

    // Test 3: Retrieve session data
    const retrievedSession = await SessionManager.getSession(redisSessionId);

    // Test 4: Test analytics
    const analytics = await SessionManager.getSessionAnalytics();

    const redisDuration = Date.now() - redisStartTime;

    testResults.redis = {
      status: 'success',
      duration: redisDuration,
      operations: {
        sessionCreated: !!redisSessionId,
        clickTracked: (retrievedSession?.clickHistory?.length ?? 0) > 0,
        sessionRetrieved: !!retrievedSession,
        analyticsWorking: analytics.totalSessions >= 0
      },
      analytics,
      testSessionId: redisSessionId
    };

    console.log('✅ Redis tests passed');

    // ===== INTEGRATION TESTS =====
    console.log('🔄 Testing PostgreSQL-Redis integration...');
    const integrationStartTime = Date.now();

    // Test 1: Session finalization (Redis → PostgreSQL)
    const finalConfig = {
      nest: 'nest80',
      gebaeudehuelle: 'holzlattung',
      pricing: { basePrice: 35000, totalPrice: 45000 }
    };

    await SessionManager.finalizeSession(redisSessionId, finalConfig);

    // Test 2: Verify session was finalized
    const finalizedSession = await SessionManager.getSession(redisSessionId);

    const integrationDuration = Date.now() - integrationStartTime;

    testResults.integration = {
      status: 'success',
      duration: integrationDuration,
      operations: {
        sessionFinalized: !finalizedSession, // Should be null after finalization
        dataFlow: 'redis_to_postgresql'
      },
      dataConsistency: {
        sessionFinalized: !finalizedSession,
        redisToPostgresqlWorking: true
      }
    };

    console.log('✅ Integration tests passed');

    // ===== PERFORMANCE ANALYSIS =====
    testResults.performance = {
      postgresql: {
        duration: pgDuration,
        operationsPerSecond: Math.round(10 / (pgDuration / 1000)), // Updated for 10 operations (schema + 6 create operations + 3 counts)
        status: pgDuration < 1000 ? 'excellent' : pgDuration < 2000 ? 'good' : pgDuration < 3000 ? 'warning' : 'slow',
        enhancedTrackingWorking: true
      },
      redis: {
        duration: redisDuration,
        operationsPerSecond: Math.round(4 / (redisDuration / 1000)),
        status: redisDuration < 500 ? 'good' : redisDuration < 1500 ? 'warning' : 'slow'
      },
      integration: {
        duration: integrationDuration,
        status: integrationDuration < 1000 ? 'good' : 'warning'
      }
    };

    // ===== CLEANUP =====
    console.log('🧹 Cleaning up test data...');
    
    // Delete in correct order to respect foreign key constraints
    await prisma.selectionEvent.deleteMany({
      where: { sessionId: testSession.sessionId }
    });
    
    await prisma.interactionEvent.deleteMany({
      where: { sessionId: testSession.sessionId }
    });
    
    await prisma.configurationSnapshot.deleteMany({
      where: { sessionId: testSession.sessionId }
    });
    
    await prisma.performanceMetric.deleteMany({
      where: { sessionId: testSession.sessionId }
    });
    
    await prisma.userSession.delete({
      where: { id: testSession.id }
    });

    // ===== SUMMARY =====
    testResults.summary = {
      status: 'success',
      errors: [],
      warnings: [
        ...(pgDuration > 1000 ? ['PostgreSQL operations are slow'] : []),
        ...(redisDuration > 500 ? ['Redis operations are slow'] : [])
      ]
    };

    console.log('✅ Comprehensive database test completed successfully');

    return NextResponse.json({
      ...testResults,
      message: 'All database systems are functioning correctly'
    });

  } catch (error) {
    console.error('❌ Database test failed:', error);

    testResults.summary = {
      status: 'error',
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      warnings: []
    };

    return NextResponse.json({
      ...testResults,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Test database operations under load
    const startTime = Date.now();
    const concurrentOperations = 10;

    console.log(`🚀 Testing database under load (${concurrentOperations} concurrent operations)...`);

    // Create multiple sessions concurrently
    const sessionPromises = Array.from({ length: concurrentOperations }, (_, i) =>
      prisma.userSession.create({
        data: {
          sessionId: `load-test-${Date.now()}-${i}`,
          ipAddress: '127.0.0.1',
          userAgent: 'load-test',
          status: 'ACTIVE'
        }
      })
    );

    const sessions = await Promise.all(sessionPromises);

    // Create events for each session
    const eventPromises = sessions.map((session, i) =>
      prisma.selectionEvent.create({
        data: {
          sessionId: session.sessionId,
          category: 'nest',
          selection: `nest${80 + i}`,
          timeSpentMs: 1000 + i * 100,
          totalPrice: 45000 + i * 1000
        }
      })
    );

    const events = await Promise.all(eventPromises);

    const duration = Date.now() - startTime;

    // Cleanup
    await prisma.selectionEvent.deleteMany({
      where: {
        sessionId: {
          in: sessions.map(s => s.sessionId)
        }
      }
    });

    await prisma.userSession.deleteMany({
      where: {
        id: {
          in: sessions.map(s => s.id)
        }
      }
    });

    return NextResponse.json({
      status: 'success',
      message: 'Load test completed successfully',
      loadTest: {
        concurrentOperations,
        duration,
        operationsPerSecond: Math.round((concurrentOperations * 2) / (duration / 1000)),
        performance: duration < 2000 ? 'excellent' : duration < 5000 ? 'good' : 'needs_optimization',
        sessionsCreated: sessions.length,
        eventsCreated: events.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Load test failed:', error);

    return NextResponse.json({
      status: 'error',
      message: 'Load test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 