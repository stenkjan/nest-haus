import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const sessionId = request.nextUrl.searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({
                success: false,
                error: 'Session ID is required',
            }, { status: 400 });
        }

        console.log(`📊 Fetching session data for: ${sessionId}`);

        // Get session from database
        const session = await prisma.userSession.findUnique({
            where: { sessionId },
            select: {
                sessionId: true,
                configurationData: true,
                totalPrice: true,
                status: true,
                lastActivity: true,
            },
        });

        if (!session) {
            return NextResponse.json({
                success: false,
                error: 'Session not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            session,
            timestamp: Date.now(),
        });

    } catch (error) {
        console.error('Get session error:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to fetch session data',
        }, { status: 500 });
    }
}

