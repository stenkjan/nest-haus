import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '../../../lib/prisma'
import redis from '../../../lib/redis'

// Create new session
export async function POST(_request: Request) {
  try {
    const headersList = headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    const referrer = headersList.get('referer') || null

    // Generate unique session ID
    const sessionId = `config_${Date.now()}_${Math.random().toString(36).substring(2)}`

    // Create session in PostgreSQL
    const _session = await prisma.userSession.create({
      data: {
        sessionId,
        ipAddress,
        userAgent,
        referrer,
        status: 'ACTIVE'
      }
    })

    // Initialize session in Redis
    await redis.setex(`session:${sessionId}`, 7200, JSON.stringify({
      sessionId,
      startTime: Date.now(),
      selections: {},
      lastActivity: Date.now()
    }))

    return NextResponse.json({
      success: true,
      sessionId,
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Failed to create session:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create session',
        timestamp: Date.now()
      },
      { status: 500 }
    )
  }
} 