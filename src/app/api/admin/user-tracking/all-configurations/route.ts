/**
 * All Configurations API - Detailed Session Data
 * 
 * Returns all user sessions with complete configuration data and tracking information
 */

import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface ConfigurationWithDetails {
    sessionId: string;
    startTime: string;
    endTime: string | null;
    status: string;
    totalPrice: number;

    // Configuration data
    configuration: {
        nestType: string;
        gebaeudehuelle: string;
        innenverkleidung: string;
        fussboden: string;
        pvanlage: string;
        fenster: string;
        planungspaket: string;
    };

    // Session metadata
    metadata: {
        ipAddress: string | null;
        userAgent: string | null;
        referrer: string | null;
        utmSource: string | null;
        duration: number; // in seconds
    };

    // Tracking data
    tracking: {
        selectionEventsCount: number;
        interactionEventsCount: number;
        snapshotsCount: number;
        lastActivity: string;
    };

    // Payment information (from Stripe)
    payment: {
        paymentIntentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paymentAmount: number | null;
        paidAt: string | null;
        inquiryStatus: string | null;
    } | null;
}

/**
 * Parse configuration data safely
 */
function parseConfigurationData(data: unknown): {
    nestType: string;
    gebaeudehuelle: string;
    innenverkleidung: string;
    fussboden: string;
    pvanlage: string;
    fenster: string;
    planungspaket: string;
} {
    try {
        if (!data || typeof data !== 'object') {
            return {
                nestType: 'Unknown',
                gebaeudehuelle: 'Unknown',
                innenverkleidung: 'Unknown',
                fussboden: 'Unknown',
                pvanlage: 'None',
                fenster: 'Standard',
                planungspaket: 'Basic'
            };
        }

        const config = data as Record<string, unknown>;

        const extractValue = (field: unknown): string => {
            if (typeof field === 'string') return field;
            if (field && typeof field === 'object' && 'value' in field) {
                const valueField = field as { value?: unknown };
                return typeof valueField.value === 'string' ? valueField.value : 'Unknown';
            }
            return 'Unknown';
        };

        return {
            nestType: extractValue(config.nestType) || extractValue(config.nest) || 'Unknown',
            gebaeudehuelle: extractValue(config.gebaeudehuelle) || 'Unknown',
            innenverkleidung: extractValue(config.innenverkleidung) || 'Unknown',
            fussboden: extractValue(config.fussboden) || 'Unknown',
            pvanlage: extractValue(config.pvanlage) || 'None',
            fenster: extractValue(config.fenster) || 'Standard',
            planungspaket: extractValue(config.planungspaket) || 'Basic',
        };
    } catch (error) {
        console.error('Failed to parse configuration data:', error);
        return {
            nestType: 'Unknown',
            gebaeudehuelle: 'Unknown',
            innenverkleidung: 'Unknown',
            fussboden: 'Unknown',
            pvanlage: 'None',
            fenster: 'Standard',
            planungspaket: 'Basic'
        };
    }
}

export async function GET() {
    try {
        console.log('📊 Fetching all configurations with details...');

        // Get all sessions with cart status or higher
        const sessions = await prisma.userSession.findMany({
            where: {
                status: { in: ['IN_CART', 'COMPLETED', 'CONVERTED'] },
                configurationData: { not: Prisma.JsonNull }
            },
            include: {
                selectionEvents: {
                    select: { id: true }
                },
                interactionEvents: {
                    select: { id: true }
                },
                configurationSnapshots: {
                    select: { id: true }
                }
            },
            orderBy: {
                startTime: 'desc'
            },
            take: 100 // Limit to last 100 configurations
        });

        // Get payment information for sessions that have associated inquiries
        const sessionIds = sessions.map(s => s.sessionId);
        const inquiries = await prisma.customerInquiry.findMany({
            where: {
                sessionId: { in: sessionIds }
            },
            select: {
                sessionId: true,
                paymentIntentId: true,
                paymentStatus: true,
                paymentMethod: true,
                paymentAmount: true,
                paidAt: true,
                status: true
            }
        });

        // Create a map for quick lookup
        const inquiryMap = new Map(
            inquiries.map(inq => [inq.sessionId, inq])
        );

        const configurations: ConfigurationWithDetails[] = sessions.map(session => {
            const config = parseConfigurationData(session.configurationData);
            const duration = session.endTime
                ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000)
                : 0;

            // Get payment info if available
            const inquiry = inquiryMap.get(session.sessionId);
            const payment = inquiry ? {
                paymentIntentId: inquiry.paymentIntentId,
                paymentStatus: inquiry.paymentStatus,
                paymentMethod: inquiry.paymentMethod,
                paymentAmount: inquiry.paymentAmount,
                paidAt: inquiry.paidAt?.toISOString() || null,
                inquiryStatus: inquiry.status
            } : null;

            return {
                sessionId: session.sessionId,
                startTime: session.startTime.toISOString(),
                endTime: session.endTime?.toISOString() || null,
                status: session.status,
                totalPrice: session.totalPrice || 0,

                configuration: config,

                metadata: {
                    ipAddress: session.ipAddress,
                    userAgent: session.userAgent,
                    referrer: session.referrer,
                    utmSource: session.utmSource,
                    duration
                },

                tracking: {
                    selectionEventsCount: session.selectionEvents.length,
                    interactionEventsCount: session.interactionEvents.length,
                    snapshotsCount: session.configurationSnapshots.length,
                    lastActivity: session.lastActivity.toISOString()
                },

                payment
            };
        });

        console.log(`✅ Found ${configurations.length} configurations`);

        return NextResponse.json({
            success: true,
            data: configurations,
            metadata: {
                total: configurations.length,
                lastUpdated: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ Error fetching all configurations:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch configurations',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

