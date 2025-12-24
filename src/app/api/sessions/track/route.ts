import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import redis from '../../../../lib/redis'

// Track user selection
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      sessionId,
      category,
      selection,
      previousSelection,
      priceChange,
      totalPrice
    } = body

    if (!sessionId || !category || !selection) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update Redis session (this is the primary state store)
    if (redis) {
      const redisKey = `session:${sessionId}`
      const sessionData = await redis.get(redisKey)

      if (typeof sessionData === 'string') {
        const session = JSON.parse(sessionData)
        session.selections[category] = selection
        session.lastActivity = Date.now()
        session.totalPrice = totalPrice

        await redis.setex(redisKey, 7200, JSON.stringify(session))
      }
    }

    // Try to log selection event in PostgreSQL (fail-safe)
    try {
      // First, ensure the session exists in PostgreSQL
      const existingSession = await prisma.userSession.findUnique({
        where: { sessionId }
      })

      if (!existingSession) {
        // Session doesn't exist in PostgreSQL - create it with upsert to handle race conditions
        console.log(`🔧 Creating missing session in PostgreSQL: ${sessionId}`)
        await prisma.userSession.upsert({
          where: { sessionId },
          update: {
            // Update existing session if somehow created between check and create
            totalPrice: totalPrice || null,
            lastActivity: new Date()
          },
          create: {
            sessionId,
            ipAddress: 'unknown',
            userAgent: 'unknown',
            referrer: null,
            status: 'ACTIVE',
            totalPrice: totalPrice || null
          }
        })
      }

      // Now create the selection event
      await prisma.selectionEvent.create({
        data: {
          sessionId,
          category,
          selection,
          previousSelection: previousSelection || null,
          priceChange: priceChange || null,
          totalPrice: totalPrice || null,
          timeSpentMs: null // Could be calculated if needed
        }
      })

      // Update session last activity
      await prisma.userSession.update({
        where: { sessionId },
        data: {
          lastActivity: new Date(),
          totalPrice: totalPrice || null
        }
      })

    } catch (dbError) {
      // PostgreSQL tracking failed, but Redis update succeeded
      // This is non-blocking - the configurator continues to work
      console.warn(`⚠️ PostgreSQL tracking failed for session ${sessionId}:`, dbError)

      // Return success anyway since Redis (primary state) was updated successfully
    }

    return NextResponse.json({
      success: true,
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Failed to track selection:', error)

    // Even if tracking fails completely, return success to not block the user experience
    return NextResponse.json(
      {
        success: true, // Changed to true to not block user experience
        error: 'Tracking temporarily unavailable',
        timestamp: Date.now()
      },
      { status: 200 } // Changed to 200 to not show as error in frontend
    )
  }
} 