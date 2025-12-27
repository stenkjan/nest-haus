import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import redis from '../../../../lib/redis'
import { isDatabaseAvailable, isProductionEnvironment } from '@/lib/utils/environment'

// Finalize session when user leaves
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, config } = body

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      )
    }

    // Check if database is available
    if (!isDatabaseAvailable()) {
      if (!isProductionEnvironment()) {
        console.warn('⚠️ Session finalization skipped: Database not configured');
        return NextResponse.json({
          success: true,
          message: 'Finalization skipped (dev mode, database unavailable)',
          devMode: true,
          timestamp: Date.now()
        });
      } else {
        console.error('❌ CRITICAL: Cannot finalize session in production without database');
        return NextResponse.json(
          { success: false, error: 'Database not configured' },
          { status: 500 }
        );
      }
    }

    // Get session from Redis (if available)
    const redisKey = `session:${sessionId}`
    let sessionData = null;
    if (redis) {
      sessionData = await redis.get(redisKey);
    }
    
    let finalConfig = config
    if (sessionData) {
      // Handle both string and object responses from Redis
      const session = typeof sessionData === 'string' 
        ? JSON.parse(sessionData) 
        : sessionData
      
      finalConfig = {
        ...config,
        ...session.selections,
        sessionDuration: Date.now() - session.startTime
      }
    }

    // Update or create session in PostgreSQL (handles cases where session wasn't initially created)
    const session = await prisma.userSession.upsert({
      where: { sessionId },
      update: {
        endTime: new Date(),
        configurationData: finalConfig,
        totalPrice: config?.totalPrice || null,
        status: config?.totalPrice ? 'COMPLETED' : 'ABANDONED'
      },
      create: {
        sessionId,
        startTime: new Date(Date.now() - (finalConfig?.sessionDuration || 0)),
        endTime: new Date(),
        configurationData: finalConfig,
        totalPrice: config?.totalPrice || null,
        status: config?.totalPrice ? 'COMPLETED' : 'ABANDONED',
        userAgent: '',
        ipAddress: ''
      }
    })

    // Bot detection: Mark sessions with very short duration as bots
    if (session.endTime) {
      const MIN_HUMAN_DURATION = 2000; // 2 seconds in milliseconds
      const sessionDuration = session.endTime.getTime() - session.startTime.getTime();
      
      if (sessionDuration < MIN_HUMAN_DURATION && !session.isBot) {
        console.log(`🤖 Marking session as bot (duration: ${sessionDuration}ms)`);
        await prisma.userSession.update({
          where: { sessionId },
          data: {
            isBot: true,
            botDetectionMethod: 'short_duration',
            botConfidence: 0.95 // High confidence for very short sessions
          }
        });
      }
    }

    // Save final configuration if it exists
    if (config && config.totalPrice) {
      await prisma.popularConfiguration.upsert({
        where: {
          configurationHash: generateConfigHash(config)
        },
        update: {
          selectionCount: { increment: 1 },
          lastSelected: new Date()
        },
        create: {
          configurationHash: generateConfigHash(config),
          nestType: config.nest || 'unknown',
          gebaeudehuelle: config.gebaeudehuelle || 'unknown',
          innenverkleidung: config.innenverkleidung || 'unknown',
          fussboden: config.fussboden || 'unknown',
          pvanlage: config.pvanlage || null,
          fenster: config.fenster || null,
          planungspaket: config.planungspaket || null,
          totalPrice: config.totalPrice,
          selectionCount: 1
        }
      })
    }

    // Clean up Redis session (if Redis is available)
    if (redis) {
      await redis.del(redisKey);
    }

    return NextResponse.json({
      success: true,
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Failed to finalize session:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to finalize session',
        timestamp: Date.now()
      },
      { status: 500 }
    )
  }
}

// Helper function to generate configuration hash
function generateConfigHash(config: Record<string, unknown>): string {
  const hashData = {
    nest: config.nest || '',
    gebaeudehuelle: config.gebaeudehuelle || '',
    innenverkleidung: config.innenverkleidung || '',
    fussboden: config.fussboden || '',
    pvanlage: config.pvanlage || '',
    fenster: config.fenster || '',
    planungspaket: config.planungspaket || ''
  }
  
  return Buffer.from(JSON.stringify(hashData)).toString('base64')
} 