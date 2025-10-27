/**
 * All Configurations API - Detailed Session Data
 * 
 * Returns all user sessions with complete configuration data and tracking information
 */

import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface DetailedItem {
    value: string;
    name: string;
    price: number;
    description?: string;
    squareMeters?: number;
}

interface ConfigurationWithDetails {
    sessionId: string;
    sessionName: string; // NEW: Human-readable session name
    startTime: string;
    endTime: string | null;
    status: string;
    totalPrice: number;

    // Simple configuration strings
    configuration: {
        nestType: string;
        gebaeudehuelle: string;
        innenverkleidung: string;
        fussboden: string;
        pvanlage: string;
        fenster: string;
        planungspaket: string;
        geschossdecke: string;
        belichtungspaket: string;
        stirnseite: string;
        kamindurchzug: string;
        fussbodenheizung: string;
        bodenaufbau: string;
        fundament: string;
    };

    // Detailed configuration with full item data
    detailedConfiguration: {
        nest: DetailedItem | null;
        gebaeudehuelle: DetailedItem | null;
        innenverkleidung: DetailedItem | null;
        fussboden: DetailedItem | null;
        pvanlage: DetailedItem | null;
        fenster: DetailedItem | null;
        planungspaket: DetailedItem | null;
        geschossdecke: DetailedItem | null;
        belichtungspaket: DetailedItem | null;
        stirnseite: DetailedItem | null;
        kamindurchzug: DetailedItem | null;
        fussbodenheizung: DetailedItem | null;
        bodenaufbau: DetailedItem | null;
        fundament: DetailedItem | null;
    };

    // Contact information from inquiry
    contactInfo: {
        name: string | null;
        email: string | null;
        phone: string | null;
        preferredContact: string | null;
        bestTimeToCall: string | null;
        message: string | null;
    } | null;

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
 * Extract value from configuration field (handles both string and object formats)
 */
function extractValue(field: unknown): string {
    if (typeof field === 'string') return field;
    if (field && typeof field === 'object' && 'value' in field) {
        const valueField = field as { value?: unknown };
        return typeof valueField.value === 'string' ? valueField.value : 'Unknown';
    }
    return 'Unknown';
}

/**
 * Extract full item details from configuration field
 */
function extractDetailedItem(field: unknown): DetailedItem | null {
    if (!field) return null;

    if (typeof field === 'object' && field !== null) {
        const item = field as Record<string, unknown>;

        // Check if it has the structure of a ConfigurationItem
        if ('value' in item && 'name' in item && 'price' in item) {
            return {
                value: typeof item.value === 'string' ? item.value : 'Unknown',
                name: typeof item.name === 'string' ? item.name : 'Unknown',
                price: typeof item.price === 'number' ? item.price : 0,
                description: typeof item.description === 'string' ? item.description : undefined,
                squareMeters: typeof item.squareMeters === 'number' ? item.squareMeters : undefined,
            };
        }
    }

    return null;
}

/**
 * Parse configuration data safely
 */
function parseConfigurationData(data: unknown): {
    simple: ConfigurationWithDetails['configuration'];
    detailed: ConfigurationWithDetails['detailedConfiguration'];
} {
    try {
        if (!data || typeof data !== 'object') {
            return {
                simple: {
                    nestType: 'Unknown',
                    gebaeudehuelle: 'Unknown',
                    innenverkleidung: 'Unknown',
                    fussboden: 'Unknown',
                    pvanlage: 'None',
                    fenster: 'Standard',
                    planungspaket: 'Basic',
                    geschossdecke: 'None',
                    belichtungspaket: 'None',
                    stirnseite: 'None',
                    kamindurchzug: 'None',
                    fussbodenheizung: 'None',
                    bodenaufbau: 'None',
                    fundament: 'None',
                },
                detailed: {
                    nest: null,
                    gebaeudehuelle: null,
                    innenverkleidung: null,
                    fussboden: null,
                    pvanlage: null,
                    fenster: null,
                    planungspaket: null,
                    geschossdecke: null,
                    belichtungspaket: null,
                    stirnseite: null,
                    kamindurchzug: null,
                    fussbodenheizung: null,
                    bodenaufbau: null,
                    fundament: null,
                }
            };
        }

        const config = data as Record<string, unknown>;

        return {
            simple: {
                nestType: extractValue(config.nest || config.nestType) || 'Unknown',
                gebaeudehuelle: extractValue(config.gebaeudehuelle) || 'Unknown',
                innenverkleidung: extractValue(config.innenverkleidung) || 'Unknown',
                fussboden: extractValue(config.fussboden) || 'Unknown',
                pvanlage: extractValue(config.pvanlage) || 'None',
                fenster: extractValue(config.fenster) || 'Standard',
                planungspaket: extractValue(config.planungspaket) || 'Basic',
                geschossdecke: extractValue(config.geschossdecke) || 'None',
                belichtungspaket: extractValue(config.belichtungspaket) || 'None',
                stirnseite: extractValue(config.stirnseite) || 'None',
                kamindurchzug: extractValue(config.kamindurchzug) || 'None',
                fussbodenheizung: extractValue(config.fussbodenheizung) || 'None',
                bodenaufbau: extractValue(config.bodenaufbau) || 'None',
                fundament: extractValue(config.fundament) || 'None',
            },
            detailed: {
                nest: extractDetailedItem(config.nest),
                gebaeudehuelle: extractDetailedItem(config.gebaeudehuelle),
                innenverkleidung: extractDetailedItem(config.innenverkleidung),
                fussboden: extractDetailedItem(config.fussboden),
                pvanlage: extractDetailedItem(config.pvanlage),
                fenster: extractDetailedItem(config.fenster),
                planungspaket: extractDetailedItem(config.planungspaket),
                geschossdecke: extractDetailedItem(config.geschossdecke),
                belichtungspaket: extractDetailedItem(config.belichtungspaket),
                stirnseite: extractDetailedItem(config.stirnseite),
                kamindurchzug: extractDetailedItem(config.kamindurchzug),
                fussbodenheizung: extractDetailedItem(config.fussbodenheizung),
                bodenaufbau: extractDetailedItem(config.bodenaufbau),
                fundament: extractDetailedItem(config.fundament),
            }
        };
    } catch (error) {
        console.error('Failed to parse configuration data:', error);
        return {
            simple: {
                nestType: 'Unknown',
                gebaeudehuelle: 'Unknown',
                innenverkleidung: 'Unknown',
                fussboden: 'Unknown',
                pvanlage: 'None',
                fenster: 'Standard',
                planungspaket: 'Basic',
                geschossdecke: 'None',
                belichtungspaket: 'None',
                stirnseite: 'None',
                kamindurchzug: 'None',
                fussbodenheizung: 'None',
                bodenaufbau: 'None',
                fundament: 'None',
            },
            detailed: {
                nest: null,
                gebaeudehuelle: null,
                innenverkleidung: null,
                fussboden: null,
                pvanlage: null,
                fenster: null,
                planungspaket: null,
                geschossdecke: null,
                belichtungspaket: null,
                stirnseite: null,
                kamindurchzug: null,
                fussbodenheizung: null,
                bodenaufbau: null,
                fundament: null,
            }
        };
    }
}

/**
 * Generate human-readable session name
 */
function generateSessionName(startTime: Date, name: string | null, sessionId: string): string {
    const dateStr = startTime.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYmmDD

    if (name) {
        // Extract surname (last word in name)
        const nameParts = name.trim().split(/\s+/);
        const surname = nameParts[nameParts.length - 1];
        return `${dateStr}_${surname}`;
    }

    // Fall back to userXX format - extract user number from sessionId or use time-based
    const timeBasedNum = Math.floor((startTime.getHours() * 3600 + startTime.getMinutes() * 60 + startTime.getSeconds()) / 100);
    const userNum = String(timeBasedNum).padStart(2, '0');
    return `${dateStr}_user${userNum}`;
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

        // Get payment and contact information for sessions that have associated inquiries
        const sessionIds = sessions.map(s => s.sessionId);
        const inquiries = await prisma.customerInquiry.findMany({
            where: {
                sessionId: { in: sessionIds }
            },
            select: {
                sessionId: true,
                name: true,
                email: true,
                phone: true,
                preferredContact: true,
                bestTimeToCall: true,
                message: true,
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
            inquiries.map(inq => [inq.sessionId!, inq])
        );

        const configurations: ConfigurationWithDetails[] = sessions.map(session => {
            const { simple, detailed } = parseConfigurationData(session.configurationData);
            const duration = session.endTime
                ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000)
                : 0;

            // Get inquiry info if available
            const inquiry = inquiryMap.get(session.sessionId);

            // Generate session name
            const sessionName = generateSessionName(
                session.startTime,
                inquiry?.name || null,
                session.sessionId
            );

            // Extract contact info
            const contactInfo = inquiry ? {
                name: inquiry.name,
                email: inquiry.email,
                phone: inquiry.phone,
                preferredContact: inquiry.preferredContact,
                bestTimeToCall: inquiry.bestTimeToCall,
                message: inquiry.message,
            } : null;

            // Extract payment info
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
                sessionName,
                startTime: session.startTime.toISOString(),
                endTime: session.endTime?.toISOString() || null,
                status: session.status,
                totalPrice: session.totalPrice || 0,

                configuration: simple,
                detailedConfiguration: detailed,
                contactInfo,

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
