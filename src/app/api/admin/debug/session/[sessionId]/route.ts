/**
 * Debug Endpoint - Session Inspector
 * 
 * Provides detailed inspection of a specific session's data for troubleshooting tracking issues.
 * Shows UserSession, SelectionEvents, CustomerInquiry, and raw configuration data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params;

        if (!sessionId) {
            return NextResponse.json({
                error: 'Session ID is required'
            }, { status: 400 });
        }

        console.log(`🔍 Debugging session: ${sessionId}`);

        // Fetch all related data in parallel
        const [userSession, selectionEvents, interactionEvents, customerInquiry] = await Promise.all([
            // Get UserSession
            prisma.userSession.findUnique({
                where: { sessionId },
                include: {
                    selectionEvents: {
                        orderBy: { timestamp: 'asc' }
                    },
                    interactionEvents: {
                        orderBy: { timestamp: 'asc' },
                        take: 50 // Limit to last 50 interactions
                    }
                }
            }),

            // Get SelectionEvents separately for detailed view
            prisma.selectionEvent.findMany({
                where: { sessionId },
                orderBy: { timestamp: 'asc' }
            }),

            // Get InteractionEvents
            prisma.interactionEvent.findMany({
                where: { sessionId },
                orderBy: { timestamp: 'asc' },
                take: 100
            }),

            // Get related CustomerInquiry
            prisma.customerInquiry.findFirst({
                where: { sessionId },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        if (!userSession) {
            return NextResponse.json({
                error: 'Session not found',
                sessionId,
                tip: 'Session may not have been created yet or may have expired'
            }, { status: 404 });
        }

        // Parse configuration data
        let parsedConfig = null;
        let configKeys: string[] = [];
        if (userSession.configurationData && typeof userSession.configurationData === 'object') {
            parsedConfig = userSession.configurationData;
            configKeys = Object.keys(parsedConfig);
        }

        // Calculate session duration
        const duration = userSession.endTime
            ? userSession.endTime.getTime() - userSession.startTime.getTime()
            : Date.now() - userSession.startTime.getTime();

        const durationMinutes = Math.floor(duration / 1000 / 60);
        const durationSeconds = Math.floor((duration / 1000) % 60);

        // Build response
        const debugData = {
            sessionId,
            found: true,
            timestamp: new Date().toISOString(),

            // Session Overview
            session: {
                id: userSession.id,
                sessionId: userSession.sessionId,
                status: userSession.status,
                ipAddress: userSession.ipAddress,
                userAgent: userSession.userAgent,
                referrer: userSession.referrer,
                utmSource: userSession.utmSource,
                startTime: userSession.startTime,
                endTime: userSession.endTime,
                lastActivity: userSession.lastActivity,
                totalPrice: userSession.totalPrice,
                duration: `${durationMinutes}m ${durationSeconds}s`,
                createdAt: userSession.createdAt,
                updatedAt: userSession.updatedAt
            },

            // Configuration Data
            configuration: {
                hasData: !!parsedConfig,
                keys: configKeys,
                totalPrice: userSession.totalPrice,
                raw: parsedConfig,
                selections: configKeys.length > 0 ? configKeys.map(key => {
                    const configRecord = parsedConfig as Record<string, unknown>;
                    const value = configRecord[key];
                    return {
                        category: key,
                        value: typeof value === 'object' && value !== null && 'value' in value
                            ? (value as { value?: unknown }).value
                            : (typeof value === 'string' ? value : JSON.stringify(value)),
                        price: typeof value === 'object' && value !== null && 'price' in value
                            ? (value as { price?: unknown }).price
                            : null
                    };
                }) : []
            },

            // Selection Events
            selectionEvents: {
                count: selectionEvents.length,
                events: selectionEvents.map(event => ({
                    id: event.id,
                    category: event.category,
                    selection: event.selection,
                    previousSelection: event.previousSelection,
                    totalPrice: event.totalPrice,
                    priceChange: event.priceChange,
                    timestamp: event.timestamp,
                    timeSpentMs: event.timeSpentMs
                }))
            },

            // Interaction Events Summary
            interactionEvents: {
                count: interactionEvents.length,
                totalShown: Math.min(interactionEvents.length, 100),
                eventTypes: interactionEvents.reduce((acc, event) => {
                    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>),
                recentEvents: interactionEvents.slice(-10).map(event => ({
                    eventType: event.eventType,
                    category: event.category,
                    elementId: event.elementId,
                    timestamp: event.timestamp
                }))
            },

            // Customer Inquiry
            customerInquiry: customerInquiry ? {
                id: customerInquiry.id,
                email: customerInquiry.email,
                name: customerInquiry.name,
                phone: customerInquiry.phone,
                status: customerInquiry.status,
                paymentStatus: customerInquiry.paymentStatus,
                totalPrice: customerInquiry.totalPrice,
                hasConfiguration: !!customerInquiry.configurationData,
                createdAt: customerInquiry.createdAt
            } : null,

            // Analysis
            analysis: {
                hasUserSession: true,
                hasConfigurationData: !!parsedConfig,
                hasSelectionEvents: selectionEvents.length > 0,
                hasCustomerInquiry: !!customerInquiry,
                isCompleted: userSession.status === 'COMPLETED',
                dataQuality: {
                    configurationKeys: configKeys.length,
                    selectionEvents: selectionEvents.length,
                    interactionEvents: interactionEvents.length,
                    missingData: [] as string[]
                }
            }
        };

        // Identify missing data
        if (!parsedConfig) {
            debugData.analysis.dataQuality.missingData.push('No configuration data');
        }
        if (selectionEvents.length === 0) {
            debugData.analysis.dataQuality.missingData.push('No selection events recorded');
        }
        if (!customerInquiry && userSession.status === 'COMPLETED') {
            debugData.analysis.dataQuality.missingData.push('Session completed but no customer inquiry found');
        }

        return NextResponse.json(debugData);

    } catch (error) {
        console.error('❌ Debug endpoint error:', error);
        return NextResponse.json({
            error: 'Failed to fetch debug data',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

