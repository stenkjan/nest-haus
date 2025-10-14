/**
 * Content Page Analytics API
 * 
 * Provides analytics data for content pages (warenkorb, kontakt, entdecken, etc.)
 * Secured with SecurityMiddleware and optimized for performance.
 */

import { NextRequest, NextResponse } from 'next/server';
import { SecurityMiddleware } from '@/lib/security/SecurityMiddleware';
import { ContentPageTracker } from '@/lib/analytics/ContentPageTracker';
import { z } from 'zod';

// Validation schemas
const analyticsQuerySchema = z.object({
    pageType: z.enum(['warenkorb', 'kontakt', 'konzept', 'entdecken', 'warum-wir', 'dein-part']).optional(),
    timeRange: z.enum(['7d', '30d', '90d']).default('30d'),
    metric: z.enum(['overview', 'real-time', 'conversions', 'sections']).default('overview'),
});

const trackingSchema = z.object({
    sessionId: z.string().min(1),
    pageType: z.enum(['warenkorb', 'kontakt', 'konzept', 'entdecken', 'warum-wir', 'dein-part']),
    interaction: z.object({
        type: z.enum(['click', 'hover', 'scroll', 'form_start', 'form_submit', 'section_view', 'cta_click']),
        elementId: z.string(),
        elementType: z.enum(['button', 'link', 'form', 'section', 'input', 'cta']),
        value: z.string().optional(),
        context: z.object({
            sectionId: z.string().optional(),
            sectionTitle: z.string().optional(),
            timeInSection: z.number().optional(),
            scrollPosition: z.number().optional(),
            formField: z.string().optional(),
        }).optional(),
    }),
    deviceInfo: z.object({
        type: z.enum(['mobile', 'tablet', 'desktop']),
        width: z.number(),
        height: z.number(),
    }).optional(),
});

/**
 * GET /api/content/analytics
 * Retrieve analytics data for content pages
 */
async function handleGetAnalytics(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const params = {
            pageType: searchParams.get('pageType'),
            timeRange: searchParams.get('timeRange') || '30d',
            metric: searchParams.get('metric') || 'overview',
        };

        const validation = analyticsQuerySchema.safeParse(params);
        if (!validation.success) {
            return NextResponse.json({
                success: false,
                error: 'Invalid query parameters',
                details: validation.error.issues,
            }, { status: 400 });
        }

        const { pageType, timeRange, metric } = validation.data;

        console.log(`📊 Content analytics request: ${metric} for ${pageType || 'all'} (${timeRange})`);

        switch (metric) {
            case 'real-time':
                const realTimeData = await ContentPageTracker.getRealTimeData();
                return NextResponse.json({
                    success: true,
                    data: realTimeData,
                    timestamp: new Date().toISOString(),
                });

            case 'overview':
                if (!pageType) {
                    // Get overview for all pages
                    const allPages = ['warenkorb', 'kontakt', 'entdecken', 'konzept', 'warum-wir', 'dein-part'];
                    const overviewData = await Promise.all(
                        allPages.map(async (page) => ({
                            pageType: page,
                            analytics: await ContentPageTracker.getPageAnalytics(page, timeRange),
                        }))
                    );

                    return NextResponse.json({
                        success: true,
                        data: overviewData,
                        timeRange,
                        timestamp: new Date().toISOString(),
                    });
                } else {
                    // Get specific page analytics
                    const analytics = await ContentPageTracker.getPageAnalytics(pageType, timeRange);
                    return NextResponse.json({
                        success: true,
                        data: analytics,
                        pageType,
                        timeRange,
                        timestamp: new Date().toISOString(),
                    });
                }

            case 'conversions':
                // Get conversion data (would typically query database)
                const conversionData = {
                    totalConversions: 0, // Would calculate from database
                    conversionRate: 0,
                    topConvertingElements: [],
                    conversionFunnel: [],
                };

                return NextResponse.json({
                    success: true,
                    data: conversionData,
                    pageType,
                    timeRange,
                    timestamp: new Date().toISOString(),
                });

            case 'sections':
                // Get section analytics (would typically query database)
                const sectionData = {
                    mostViewedSections: [],
                    averageTimePerSection: {},
                    sectionDropOffRates: {},
                };

                return NextResponse.json({
                    success: true,
                    data: sectionData,
                    pageType,
                    timeRange,
                    timestamp: new Date().toISOString(),
                });

            default:
                return NextResponse.json({
                    success: false,
                    error: 'Invalid metric type',
                }, { status: 400 });
        }

    } catch (error) {
        console.error('❌ Content analytics error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to retrieve analytics data',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

/**
 * POST /api/content/analytics
 * Track content page interactions
 */
async function handleTrackInteraction(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const validation = trackingSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({
                success: false,
                error: 'Invalid tracking data',
                details: validation.error.issues,
            }, { status: 400 });
        }

        const { sessionId, pageType, interaction, deviceInfo } = validation.data;

        console.log(`📊 Tracking ${interaction.type} on ${pageType}: ${interaction.elementId}`);

        // Initialize session if needed
        if (deviceInfo) {
            const source = {
                referrer: request.headers.get('referer') || undefined,
                utmSource: new URL(request.url).searchParams.get('utm_source') || undefined,
                utmMedium: new URL(request.url).searchParams.get('utm_medium') || undefined,
                utmCampaign: new URL(request.url).searchParams.get('utm_campaign') || undefined,
            };

            await ContentPageTracker.initializeSession(sessionId, pageType, deviceInfo, source);
        }

        // Track the interaction
        await ContentPageTracker.trackInteraction(sessionId, {
            type: interaction.type,
            elementId: interaction.elementId,
            elementType: interaction.elementType,
            value: interaction.value,
            context: interaction.context || {},
        });

        return NextResponse.json({
            success: true,
            message: 'Interaction tracked successfully',
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('❌ Content tracking error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to track interaction',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

/**
 * PUT /api/content/analytics
 * Update session information (finalize, update section, etc.)
 */
async function handleUpdateSession(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { sessionId, action, data } = body;

        if (!sessionId || !action) {
            return NextResponse.json({
                success: false,
                error: 'Missing sessionId or action',
            }, { status: 400 });
        }

        console.log(`📊 Session update: ${action} for ${sessionId}`);

        switch (action) {
            case 'finalize':
                await ContentPageTracker.finalizeSession(sessionId);
                break;

            case 'section_change':
                if (data?.sectionId && data?.sectionTitle) {
                    await ContentPageTracker.trackSectionView(
                        sessionId,
                        data.sectionId,
                        data.sectionTitle,
                        data.timeSpentInPreviousSection
                    );
                }
                break;

            case 'form_interaction':
                if (data?.formId && data?.action) {
                    await ContentPageTracker.trackFormInteraction(
                        sessionId,
                        data.formId,
                        data.action,
                        data.fieldName,
                        data.value
                    );
                }
                break;

            case 'cta_click':
                if (data?.ctaId && data?.ctaText && data?.targetUrl) {
                    await ContentPageTracker.trackCTAClick(
                        sessionId,
                        data.ctaId,
                        data.ctaText,
                        data.targetUrl,
                        data.sectionId
                    );
                }
                break;

            default:
                return NextResponse.json({
                    success: false,
                    error: 'Invalid action type',
                }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: `Session ${action} completed`,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('❌ Session update error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update session',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

// Apply security middleware to all handlers
export const GET = SecurityMiddleware.withSecurity(handleGetAnalytics, {
    rateLimit: { windowMs: 15 * 60 * 1000, maxRequests: 200 }, // Higher limit for analytics
    csrfProtection: false, // GET requests don't need CSRF
});

export const POST = SecurityMiddleware.withSecurity(handleTrackInteraction, {
    rateLimit: { windowMs: 15 * 60 * 1000, maxRequests: 500, perSession: 200 }, // High limit for tracking
    maxBodySize: 50 * 1024, // 50KB max for tracking data
});

export const PUT = SecurityMiddleware.withSecurity(handleUpdateSession, {
    rateLimit: { windowMs: 15 * 60 * 1000, maxRequests: 100, perSession: 50 },
    maxBodySize: 10 * 1024, // 10KB max for session updates
}); 