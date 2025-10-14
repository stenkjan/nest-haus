/**
 * Security Monitoring API Endpoints
 * 
 * Provides real-time security monitoring data and controls
 * for the NEST-Haus security system.
 * 
 * Endpoints:
 * - GET /api/security/dashboard - Real-time security dashboard data
 * - GET /api/security/events - Recent security events
 * - GET /api/security/alerts - Active security alerts
 * - POST /api/security/analyze - Analyze session behavior
 * - POST /api/security/report - Report security incident
 * - PUT /api/security/config - Update security configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { SecurityMiddleware } from '@/lib/security/SecurityMiddleware';
import { realTimeMonitor } from '@/lib/security/RealTimeMonitor';
import { behavioralAnalyzer } from '@/lib/security/BehavioralAnalyzer';
import { botDetector } from '@/lib/security/BotDetector';
import { z } from 'zod';

// Validation schemas
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

const analyzeRequestSchema = z.object({
    sessionId: z.string().min(1),
    forceAnalysis: z.boolean().default(false),
});

const reportIncidentSchema = z.object({
    sessionId: z.string().min(1),
    incidentType: z.string().min(1),
    description: z.string().min(1),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    metadata: z.record(z.any()).optional(),
});

/**
 * GET /api/security/dashboard
 * Get real-time security dashboard data
 */
async function handleGetDashboard(request: NextRequest): Promise<NextResponse> {
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

/**
 * GET /api/security/events
 * Get recent security events with filtering
 */
async function handleGetEvents(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const params = {
            limit: searchParams.get('limit'),
            type: searchParams.get('type'),
            severity: searchParams.get('severity'),
            sessionId: searchParams.get('sessionId'),
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
        let events = realTimeMonitor.getRecentEvents(limit, type);

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

/**
 * GET /api/security/alerts
 * Get active security alerts
 */
async function handleGetAlerts(request: NextRequest): Promise<NextResponse> {
    try {
        const alerts = realTimeMonitor.getActiveAlerts();

        return NextResponse.json({
            success: true,
            data: alerts,
            total: alerts.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('❌ Alerts retrieval error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to retrieve security alerts',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

/**
 * POST /api/security/analyze
 * Analyze session behavior and return security assessment
 */
async function handleAnalyzeSession(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const validation = analyzeRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({
                success: false,
                error: 'Invalid request body',
                details: validation.error.issues,
            }, { status: 400 });
        }

        const { sessionId, forceAnalysis } = validation.data;

        // Get behavioral analysis
        const behaviorAnalysis = behavioralAnalyzer.analyzeBehavior(sessionId);
        const behaviorPattern = behavioralAnalyzer.getBehaviorPattern(sessionId);

        // Get bot detection history
        const botDetectionHistory = botDetector.getDetectionHistory(sessionId);

        // Get recent security events for this session
        const recentEvents = realTimeMonitor.getRecentEvents(50).filter(
            event => event.sessionId === sessionId
        );

        // Calculate overall risk score
        const riskFactors = {
            behaviorRisk: behaviorAnalysis.suspicionScore,
            botRisk: botDetectionHistory.length > 0 ?
                Math.max(...botDetectionHistory.map(d => d.confidence)) : 0,
            eventRisk: recentEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length * 0.1,
        };

        const overallRisk = Math.min(1,
            riskFactors.behaviorRisk * 0.4 +
            riskFactors.botRisk * 0.4 +
            riskFactors.eventRisk * 0.2
        );

        const riskLevel = overallRisk >= 0.8 ? 'critical' :
            overallRisk >= 0.6 ? 'high' :
                overallRisk >= 0.4 ? 'medium' : 'low';

        // Log analysis if forced or high risk
        if (forceAnalysis || overallRisk >= 0.6) {
            realTimeMonitor.logSecurityEvent(
                sessionId,
                'behavioral_anomaly',
                riskLevel as any,
                `Security analysis performed: ${Math.round(overallRisk * 100)}% risk`,
                {
                    behaviorAnalysis,
                    riskFactors,
                    overallRisk,
                    forceAnalysis,
                }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                sessionId,
                overallRisk,
                riskLevel,
                riskFactors,
                behaviorAnalysis,
                behaviorPattern: behaviorPattern ? {
                    sessionDuration: behaviorPattern.lastActivity - behaviorPattern.sessionStart,
                    totalActions: behaviorPattern.mouseMovements.length +
                        behaviorPattern.keystrokes.length +
                        behaviorPattern.clicks.length +
                        behaviorPattern.scrollEvents.length,
                    mouseMovements: behaviorPattern.mouseMovements.length,
                    keystrokes: behaviorPattern.keystrokes.length,
                    clicks: behaviorPattern.clicks.length,
                    scrollEvents: behaviorPattern.scrollEvents.length,
                } : null,
                botDetectionHistory,
                recentEvents: recentEvents.slice(0, 10),
                recommendations: this.generateRecommendations(riskLevel, behaviorAnalysis, recentEvents),
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('❌ Session analysis error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to analyze session',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

/**
 * POST /api/security/report
 * Report a security incident
 */
async function handleReportIncident(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const validation = reportIncidentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({
                success: false,
                error: 'Invalid request body',
                details: validation.error.issues,
            }, { status: 400 });
        }

        const { sessionId, incidentType, description, severity, metadata } = validation.data;

        // Log the reported incident
        const event = realTimeMonitor.logSecurityEvent(
            sessionId,
            'suspicious_activity',
            severity,
            `Reported incident: ${incidentType} - ${description}`,
            {
                incidentType,
                reportedBy: 'manual',
                userAgent: request.headers.get('user-agent'),
                ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
                ...metadata,
            }
        );

        console.log(`🚨 Security incident reported: ${incidentType} for session ${sessionId}`);

        return NextResponse.json({
            success: true,
            data: {
                eventId: event.id,
                sessionId,
                incidentType,
                severity,
                timestamp: event.timestamp,
            },
            message: 'Security incident reported successfully',
        });
    } catch (error) {
        console.error('❌ Incident reporting error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to report security incident',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

/**
 * PUT /api/security/config
 * Update security configuration (admin only)
 */
async function handleUpdateConfig(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();

        // Basic validation - in production, add proper admin authentication
        const allowedUpdates = [
            'strictMode',
            'behaviorAnalysis',
            'botDetection',
            'realTimeMonitoring',
            'alertThresholds',
            'autoResponse',
        ];

        const updates: Record<string, any> = {};
        for (const [key, value] of Object.entries(body)) {
            if (allowedUpdates.includes(key)) {
                updates[key] = value;
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No valid configuration updates provided',
            }, { status: 400 });
        }

        // Update real-time monitor config
        if (updates.alertThresholds || updates.autoResponse || updates.realTimeMonitoring !== undefined) {
            realTimeMonitor.updateConfig(updates);
        }

        // Update bot detector config
        if (updates.botDetection !== undefined || updates.strictMode !== undefined) {
            botDetector.updateConfig({
                enabled: updates.botDetection,
                strictMode: updates.strictMode,
            });
        }

        console.log('🔧 Security configuration updated:', updates);

        return NextResponse.json({
            success: true,
            data: {
                updated: Object.keys(updates),
                timestamp: new Date().toISOString(),
            },
            message: 'Security configuration updated successfully',
        });
    } catch (error) {
        console.error('❌ Configuration update error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update security configuration',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

/**
 * Generate security recommendations based on analysis
 */
function generateRecommendations(
    riskLevel: string,
    behaviorAnalysis: any,
    recentEvents: any[]
): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'critical' || riskLevel === 'high') {
        recommendations.push('Consider implementing additional verification steps');
        recommendations.push('Monitor session closely for continued suspicious activity');
    }

    if (behaviorAnalysis.botProbability > 0.7) {
        recommendations.push('Implement CAPTCHA or similar bot verification');
        recommendations.push('Consider rate limiting for this session');
    }

    if (behaviorAnalysis.anomalies.length > 3) {
        recommendations.push('Review behavioral patterns for automation indicators');
        recommendations.push('Consider implementing progressive delays');
    }

    const criticalEvents = recentEvents.filter(e => e.severity === 'critical').length;
    if (criticalEvents > 0) {
        recommendations.push('Investigate critical security events immediately');
        recommendations.push('Consider temporary access restrictions');
    }

    if (recommendations.length === 0) {
        recommendations.push('Continue normal monitoring');
        recommendations.push('No immediate action required');
    }

    return recommendations;
}

// Apply security middleware to all endpoints
export const GET = SecurityMiddleware.withSecurity(async (request: NextRequest) => {
    const { pathname } = new URL(request.url);

    if (pathname.endsWith('/dashboard')) {
        return handleGetDashboard(request);
    } else if (pathname.endsWith('/events')) {
        return handleGetEvents(request);
    } else if (pathname.endsWith('/alerts')) {
        return handleGetAlerts(request);
    }

    return NextResponse.json({
        success: false,
        error: 'Endpoint not found',
    }, { status: 404 });
}, {
    rateLimit: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // More restrictive for security endpoints
    csrfProtection: false, // GET requests don't need CSRF protection
});

export const POST = SecurityMiddleware.withSecurity(async (request: NextRequest) => {
    const { pathname } = new URL(request.url);

    if (pathname.endsWith('/analyze')) {
        return handleAnalyzeSession(request);
    } else if (pathname.endsWith('/report')) {
        return handleReportIncident(request);
    }

    return NextResponse.json({
        success: false,
        error: 'Endpoint not found',
    }, { status: 404 });
}, {
    rateLimit: { windowMs: 15 * 60 * 1000, maxRequests: 50 }, // More restrictive for POST
    csrfProtection: true,
});

export const PUT = SecurityMiddleware.withSecurity(handleUpdateConfig, {
    rateLimit: { windowMs: 15 * 60 * 1000, maxRequests: 10 }, // Very restrictive for config updates
    csrfProtection: true,
});
