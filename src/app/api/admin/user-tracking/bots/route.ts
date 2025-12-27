/**
 * Bot Analytics API
 * 
 * Returns sessions detected as bots/scrapers for analysis
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getIPFilterClause } from '@/lib/analytics-filter';

interface BotSession {
    sessionId: string;
    startTime: string;
    endTime: string | null;
    duration: number; // in seconds
    ipAddress: string | null;
    userAgent: string | null;
    country: string | null;
    city: string | null;
    botDetectionMethod: string | null;
    botConfidence: number | null;
}

interface BotAnalyticsResponse {
    success: boolean;
    data: {
        sessions: BotSession[];
        statistics: {
            totalBots: number;
            byDetectionMethod: Record<string, number>;
            byCountry: Record<string, number>;
            avgDuration: number;
        };
    };
    metadata: {
        lastUpdated: string;
    };
}

export async function GET() {
    try {
        console.log('📊 Fetching bot sessions...');

        // Get all bot sessions
        const botSessions = await prisma.userSession.findMany({
            where: {
                ...getIPFilterClause(),
                isBot: true,
            },
            select: {
                sessionId: true,
                startTime: true,
                endTime: true,
                ipAddress: true,
                userAgent: true,
                country: true,
                city: true,
                botDetectionMethod: true,
                botConfidence: true,
            },
            orderBy: {
                startTime: 'desc'
            },
            take: 500 // Limit to last 500 bot sessions
        });

        // Calculate statistics
        const byDetectionMethod: Record<string, number> = {};
        const byCountry: Record<string, number> = {};
        let totalDuration = 0;
        let sessionsWithDuration = 0;

        const formattedSessions: BotSession[] = botSessions.map(session => {
            // Track detection methods
            const method = session.botDetectionMethod || 'unknown';
            byDetectionMethod[method] = (byDetectionMethod[method] || 0) + 1;

            // Track countries
            const country = session.country || 'Unknown';
            byCountry[country] = (byCountry[country] || 0) + 1;

            // Calculate duration
            let duration = 0;
            if (session.endTime) {
                duration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000);
                totalDuration += duration;
                sessionsWithDuration++;
            }

            return {
                sessionId: session.sessionId,
                startTime: session.startTime.toISOString(),
                endTime: session.endTime?.toISOString() || null,
                duration,
                ipAddress: session.ipAddress,
                userAgent: session.userAgent,
                country: session.country,
                city: session.city,
                botDetectionMethod: session.botDetectionMethod,
                botConfidence: session.botConfidence,
            };
        });

        const avgDuration = sessionsWithDuration > 0 
            ? Math.round(totalDuration / sessionsWithDuration) 
            : 0;

        const response: BotAnalyticsResponse = {
            success: true,
            data: {
                sessions: formattedSessions,
                statistics: {
                    totalBots: botSessions.length,
                    byDetectionMethod,
                    byCountry,
                    avgDuration,
                }
            },
            metadata: {
                lastUpdated: new Date().toISOString()
            }
        };

        console.log(`✅ Found ${botSessions.length} bot sessions`);

        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Error fetching bot sessions:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch bot sessions',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

