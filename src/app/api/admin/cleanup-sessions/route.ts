/**
 * Session Cleanup API
 * 
 * Removes bad/test sessions from the database
 * Used to clean up data that skews analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionIds } = body;

        if (!sessionIds || !Array.isArray(sessionIds) || sessionIds.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'sessionIds array is required'
            }, { status: 400 });
        }

        // Delete the sessions and all related data (cascading deletes)
        const result = await prisma.userSession.deleteMany({
            where: {
                sessionId: { in: sessionIds }
            }
        });

        console.log(`🗑️ Deleted ${result.count} sessions:`, sessionIds);

        return NextResponse.json({
            success: true,
            deletedCount: result.count,
            sessionIds
        });

    } catch (error) {
        console.error('❌ Session cleanup error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to delete sessions',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Use POST with { sessionIds: [...] } to delete sessions',
        example: {
            sessionIds: ['20251021_user555', '20251022_user602']
        }
    });
}

