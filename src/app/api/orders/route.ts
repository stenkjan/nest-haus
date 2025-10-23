import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// Create new order from cart
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, orderDetails, totalPrice, paymentIntentId } = body

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

    // Determine payment status based on whether payment was made
    const paymentStatus = paymentIntentId ? 'PAID' : 'PENDING';
    const inquiryStatus = paymentIntentId ? 'CONVERTED' : 'NEW';

    // Check for existing inquiry to prevent duplicates
    // Strategy: Check by sessionId OR (email + created within last 24 hours)
    const sessionIds = items.map((item: { sessionId?: string }) => item.sessionId).filter(Boolean);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const existingInquiry = await prisma.customerInquiry.findFirst({
      where: {
        OR: [
          // Match by sessionId if available
          sessionIds.length > 0 ? { sessionId: { in: sessionIds } } : {},
          // Match by email + recent timeframe
          {
            AND: [
              { email: orderDetails.customerInfo.email },
              { createdAt: { gte: twentyFourHoursAgo } },
            ],
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let inquiry;

    if (existingInquiry) {
      // Update existing inquiry with payment info and order details
      console.log(`[Deduplication] Updating existing inquiry ${existingInquiry.id} for ${orderDetails.customerInfo.email}`);

      inquiry = await prisma.customerInquiry.update({
        where: { id: existingInquiry.id },
        data: {
          // Update with new order details
          name: orderDetails.customerInfo.name || existingInquiry.name,
          phone: orderDetails.customerInfo.phone || existingInquiry.phone,
          message: `Bestellung mit ${items.length} Konfiguration(en). ${orderDetails.notes || ''}`.trim(),
          configurationData: {
            items,
            orderSummary: {
              totalItems: items.length,
              totalPrice,
              timestamp: Date.now(),
            },
          },
          totalPrice,
          status: inquiryStatus,
          // Update payment information
          paymentIntentId: paymentIntentId || existingInquiry.paymentIntentId,
          paymentStatus,
          paymentAmount: paymentIntentId ? totalPrice : existingInquiry.paymentAmount,
          paymentCurrency: paymentIntentId ? 'eur' : existingInquiry.paymentCurrency,
          paidAt: paymentIntentId ? new Date() : existingInquiry.paidAt,
        },
      });
    } else {
      // Create new customer inquiry for the order
      console.log(`[New Inquiry] Creating inquiry for ${orderDetails.customerInfo.email}`);

      inquiry = await prisma.customerInquiry.create({
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
              timestamp: Date.now(),
            },
          },
          totalPrice,
          status: inquiryStatus,
          preferredContact: 'EMAIL',
          // Link to session if available
          sessionId: sessionIds[0] || null,
          // Payment-related fields
          paymentIntentId: paymentIntentId || null,
          paymentStatus,
          paymentAmount: paymentIntentId ? totalPrice : null,
          paymentCurrency: paymentIntentId ? 'eur' : null,
          paidAt: paymentIntentId ? new Date() : null,
        },
      });
    }

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