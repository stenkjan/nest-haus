/**
 * Security Events API Endpoint
 * GET /api/security/events
 */

import { NextRequest, NextResponse } from 'next/server';
import { SecurityMiddleware } from '@/lib/security/SecurityMiddleware';
import { realTimeMonitor, type SecurityEventType } from '@/lib/security/RealTimeMonitor';
import { z } from 'zod';

const eventQuerySchema = z.object({
    limit: z.coerce.number().min(1).max(1000).default(100),
    type: z.enum([
        'bot_detection',
        'behavioral_anomaly',
        'rate_limit_exceeded',
        'suspicious_activity',
        'content_protection_violation',
        'devtools_detection',
        'injection_attempt',
        'brute_force_attempt',
        'data_breach_attempt',
        'unauthorized_access',
        'performance_anomaly'
    ]).optional(),
    severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    sessionId: z.string().optional(),
});

async function handleGetEvents(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const params = {
            limit: searchParams.get('limit') || undefined,
            type: searchParams.get('type') || undefined,
            severity: searchParams.get('severity') || undefined,
            sessionId: searchParams.get('sessionId') || undefined,
        };

        const validation = eventQuerySchema.safeParse(params);
        if (!validation.success) {
            return NextResponse.json({
                success: false,
                error: 'Invalid query parameters',
                details: validation.error.issues,
            }, { status: 400 });
        }

        const { limit, type, severity, sessionId } = validation.data;
        let events = realTimeMonitor.getRecentEvents(limit, type as SecurityEventType);

        // Apply additional filters
        if (severity) {
            events = events.filter(event => event.severity === severity);
        }

        if (sessionId) {
            events = events.filter(event => event.sessionId === sessionId);
        }

        return NextResponse.json({
            success: true,
            data: events,
            total: events.length,
            filters: { limit, type, severity, sessionId },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('❌ Events retrieval error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to retrieve security events',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

export const GET = SecurityMiddleware.withSecurity(handleGetEvents, {
    rateLimit: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
    csrfProtection: false,
});
