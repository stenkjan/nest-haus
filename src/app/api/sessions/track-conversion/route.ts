/**
 * Conversion Tracking Endpoint
 * 
 * Tracks successful payments and marks sessions as CONVERTED.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ConversionRequest {
    sessionId: string;
    paymentIntentId: string;
    totalPrice: number;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as ConversionRequest;
        const { sessionId, paymentIntentId, totalPrice } = body;

        if (!sessionId) {
            return NextResponse.json({
                error: 'Session ID is required'
            }, { status: 400 });
        }

        console.log(`💰 Conversion tracked for session: ${sessionId}`);

        // Update session to CONVERTED status
        await prisma.userSession.updateMany({
            where: { sessionId },
            data: {
                status: 'CONVERTED',
                totalPrice,
                endTime: new Date(),
                lastActivity: new Date(),
                updatedAt: new Date()
            }
        });

        console.log(`✅ Session ${sessionId} marked as CONVERTED`);

        return NextResponse.json({
            success: true,
            sessionId,
            status: 'CONVERTED',
            paymentIntentId,
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('❌ Conversion tracking error:', error);

        // Return success to not block user experience
        return NextResponse.json({
            success: true,
            error: 'Tracking temporarily unavailable'
        });
    }
}

