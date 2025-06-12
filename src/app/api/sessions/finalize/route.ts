import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import redis from '../../../../lib/redis'

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

    // Get session from Redis
    const redisKey = `session:${sessionId}`
    const sessionData = await redis.get(redisKey)
    
    let finalConfig = config
    if (sessionData) {
      const session = JSON.parse(sessionData)
      finalConfig = {
        ...config,
        ...session.selections,
        sessionDuration: Date.now() - session.startTime
      }
    }

    // Update session in PostgreSQL
    await prisma.userSession.update({
      where: { sessionId },
      data: {
        endTime: new Date(),
        configurationData: finalConfig,
        totalPrice: config?.totalPrice || null,
        status: config?.totalPrice ? 'COMPLETED' : 'ABANDONED'
      }
    })

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

    // Clean up Redis session
    await redis.del(redisKey)

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