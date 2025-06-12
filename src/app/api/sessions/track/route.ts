import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { redis } from '../../../../lib/redis'

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

    // Update Redis session
    const redisKey = `session:${sessionId}`
    const sessionData = await redis.get(redisKey)
    
    if (sessionData) {
      const session = JSON.parse(sessionData)
      session.selections[category] = selection
      session.lastActivity = Date.now()
      session.totalPrice = totalPrice
      
      await redis.setex(redisKey, 7200, JSON.stringify(session))
    }

    // Log selection event in PostgreSQL
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

    return NextResponse.json({
      success: true,
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Failed to track selection:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to track selection',
        timestamp: Date.now()
      },
      { status: 500 }
    )
  }
} 