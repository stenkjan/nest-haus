/**
 * Admin Action: Mark Short Sessions as Bots
 * 
 * One-time batch update to mark existing sessions with short duration as bots
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        console.log('🤖 Starting batch bot detection...');

        const MIN_HUMAN_DURATION = 2000; // 2 seconds in milliseconds

        // Find all sessions with endTime that aren't already marked as bots
        const sessions = await prisma.userSession.findMany({
            where: {
                endTime: { not: null },
                OR: [
                    { isBot: false },
                    { isBot: null }
                ]
            },
            select: {
                sessionId: true,
                startTime: true,
                endTime: true,
            }
        });

        console.log(`📊 Analyzing ${sessions.length} sessions...`);

        // Filter sessions that should be marked as bots
        const botsToMark = sessions.filter(session => {
            if (!session.endTime) return false;
            const duration = session.endTime.getTime() - session.startTime.getTime();
            return duration < MIN_HUMAN_DURATION;
        });

        console.log(`🤖 Found ${botsToMark.length} sessions to mark as bots`);

        if (botsToMark.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No sessions to mark as bots',
                updated: 0,
                totalAnalyzed: sessions.length
            });
        }

        // Batch update in chunks to avoid timeout
        const CHUNK_SIZE = 100;
        let totalUpdated = 0;

        for (let i = 0; i < botsToMark.length; i += CHUNK_SIZE) {
            const chunk = botsToMark.slice(i, i + CHUNK_SIZE);
            const sessionIds = chunk.map(s => s.sessionId);

            const result = await prisma.userSession.updateMany({
                where: {
                    sessionId: { in: sessionIds }
                },
                data: {
                    isBot: true,
                    botDetectionMethod: 'short_duration',
                    botConfidence: 0.95
                }
            });

            totalUpdated += result.count;
            console.log(`✅ Updated ${totalUpdated}/${botsToMark.length} sessions...`);
        }

        console.log(`🎉 Batch bot detection complete!`);

        return NextResponse.json({
            success: true,
            message: `Successfully marked ${totalUpdated} sessions as bots`,
            updated: totalUpdated,
            totalAnalyzed: sessions.length,
            percentageBots: ((totalUpdated / sessions.length) * 100).toFixed(2)
        });

    } catch (error) {
        console.error('❌ Error in batch bot detection:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to mark bots',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

