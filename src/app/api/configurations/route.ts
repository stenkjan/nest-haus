import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// Save user configuration
export async function POST(request: Request) {
  try {
    const config = await request.json()

    if (!config.sessionId || !config.nest) {
      return NextResponse.json(
        { success: false, error: 'Session ID and nest type required' },
        { status: 400 }
      )
    }

    // Save as customer inquiry if email provided
    if (config.email) {
      const inquiry = await prisma.customerInquiry.create({
        data: {
          sessionId: config.sessionId,
          email: config.email,
          name: config.name || null,
          phone: config.phone || null,
          message: config.message || null,
          configurationData: config,
          totalPrice: config.totalPrice || null,
          status: 'NEW'
        }
      })

      return NextResponse.json({
        success: true,
        inquiryId: inquiry.id,
        message: 'Configuration saved as customer inquiry',
        timestamp: Date.now()
      })
    }

    // Otherwise, update the session with final configuration
    await prisma.userSession.update({
      where: { sessionId: config.sessionId },
      data: {
        configurationData: config,
        totalPrice: config.totalPrice || null,
        status: 'COMPLETED'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Configuration saved to session',
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Failed to save configuration:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save configuration',
        timestamp: Date.now()
      },
      { status: 500 }
    )
  }
} 