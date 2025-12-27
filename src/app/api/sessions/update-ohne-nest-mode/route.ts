/**
 * Update Ohne-Hoam Mode Endpoint
 * 
 * Updates the isOhneNestMode flag for a session when user navigates to warenkorb with ?mode=ohne-nest
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface UpdateOhneNestModeRequest {
    sessionId: string;
    isOhneNestMode: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as UpdateOhneNestModeRequest;
        const { sessionId, isOhneNestMode } = body;

        if (!sessionId) {
            return NextResponse.json({
                error: 'Session ID is required'
            }, { status: 400 });
        }

        console.log(`🏠 Updating session ${sessionId} ohne-Hoam mode to: ${isOhneNestMode}`);

        // Update session's ohne-Hoam mode flag
        await prisma.userSession.updateMany({
            where: { sessionId },
            data: {
                isOhneNestMode,
                updatedAt: new Date()
            }
        });

        console.log(`✅ Session ${sessionId} ohne-Hoam mode updated successfully`);

        return NextResponse.json({
            success: true,
            sessionId,
            isOhneNestMode,
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('❌ Error updating ohne-Hoam mode:', error);

        // Return success to not block user experience
        return NextResponse.json({
            success: true,
            error: 'Update temporarily unavailable'
        });
    }
}

