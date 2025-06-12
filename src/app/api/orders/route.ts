import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import type { Prisma } from '@prisma/client'

// Create new order from cart
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, orderDetails, totalPrice } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items in order' },
        { status: 400 }
      )
    }

    if (!orderDetails?.customerInfo?.email) {
      return NextResponse.json(
        { success: false, error: 'Customer email required' },
        { status: 400 }
      )
    }

    // Create customer inquiry for the order
    const inquiry = await prisma.customerInquiry.create({
      data: {
        email: orderDetails.customerInfo.email,
        name: orderDetails.customerInfo.name || null,
        phone: orderDetails.customerInfo.phone || null,
        message: `Bestellung mit ${items.length} Konfiguration(en). ${orderDetails.notes || ''}`.trim(),
        configurationData: {
          items,
          orderSummary: {
            totalItems: items.length,
            totalPrice,
            timestamp: Date.now()
          }
        } as Prisma.InputJsonValue,
        totalPrice,
        status: 'NEW',
        preferredContact: 'EMAIL'
      }
    })

    // Log each configuration as separate selection events
    for (const item of items) {
      if (item.sessionId) {
        // Mark session as converted
        await prisma.userSession.updateMany({
          where: { sessionId: item.sessionId },
          data: { status: 'COMPLETED' }
        })

        // Track conversion event
        await prisma.selectionEvent.create({
          data: {
            sessionId: item.sessionId,
            category: 'order',
            selection: 'converted',
            totalPrice: totalPrice
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      orderId: inquiry.id,
      message: 'Order created successfully',
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        timestamp: Date.now()
      },
      { status: 500 }
    )
  }
} 