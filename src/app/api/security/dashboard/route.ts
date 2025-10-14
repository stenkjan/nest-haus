/**
 * Security Dashboard API Endpoint
 * GET /api/security/dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { SecurityMiddleware } from '@/lib/security/SecurityMiddleware';
import { realTimeMonitor } from '@/lib/security/RealTimeMonitor';
import { behavioralAnalyzer } from '@/lib/security/BehavioralAnalyzer';
import { botDetector } from '@/lib/security/BotDetector';

async function handleGetDashboard(_request: NextRequest): Promise<NextResponse> {
    try {
        const dashboardData = realTimeMonitor.getDashboardData();
        const behaviorStats = behavioralAnalyzer.getRealTimeStats();
        const botStats = botDetector.getRealTimeStats();

        return NextResponse.json({
            success: true,
            data: {
                ...dashboardData,
                behaviorAnalysis: behaviorStats,
                botDetection: botStats,
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('❌ Dashboard data error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to retrieve dashboard data',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

export const GET = SecurityMiddleware.withSecurity(handleGetDashboard, {
    rateLimit: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
    csrfProtection: false,
});
