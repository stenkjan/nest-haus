/**
 * All Configurations API - Detailed Session Data
 * 
 * Returns all user sessions with complete configuration data and tracking information
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getIPFilterClause } from '@/lib/analytics-filter';
import { calculateModularPrice } from '@/constants/configurator';

interface DetailedItem {
    value: string;
    name: string;
    price: number;
    description?: string;
    squareMeters?: number;
    quantity?: number;
}

interface ConfigurationWithDetails {
    sessionId: string;
    sessionName: string; // NEW: Human-readable session name
    startTime: string;
    endTime: string | null;
    status: string;
    totalPrice: number;
    isOhneNestMode: boolean; // NEW: Track if user went direct to Vorentwurf

    // User location & activity metadata
    userLocation: {
        country: string | null;
        city: string | null;
        ipAddress: string | null;
    };
    userActivity: {
        timeSpent: number; // in seconds
        clickCount: number;
    };
    visitCount: number;
    userIdentifier: string | null;

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
        lastActivity: string;
        interactionEvents: Array<{
            id: string;
            eventType: string;
            category: string;
            elementId: string | null;
            selectionValue: string | null;
            timestamp: string;
        }>;
        pageVisitsCount: number;
        clickEventsCount: number;
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
 * Note: Stored prices might be relative (upgrade/downgrade), so we return them as-is
 * and handle absolute price calculation in parseConfigurationData
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
                quantity: typeof item.quantity === 'number' ? item.quantity : undefined,
            };
        }
    }

    return null;
}

/**
 * Calculate belichtungspaket price based on Hoam size and fenster material
 * Same logic as PriceCalculator.calculateBelichtungspaketPrice
 */
function calculateBelichtungspaketPrice(
    belichtungspaketValue: string,
    nestValue: string,
    fensterValue: string
): number {
    try {
        // Get Hoam size in square meters
        const nestSizeMap: Record<string, number> = {
            'nest80': 80,
            'nest100': 100,
            'nest120': 120,
            'nest140': 140,
            'nest160': 160
        };

        const nestSize = nestSizeMap[nestValue] || 80;

        // Get percentage based on belichtungspaket option
        const percentageMap: Record<string, number> = {
            'light': 0.15,   // 15%
            'medium': 0.22,  // 22%
            'bright': 0.28   // 28%
        };

        const percentage = percentageMap[belichtungspaketValue] || 0.12;

        // Calculate square meters for belichtungspaket
        const beleuchtungsSquareMeters = Math.ceil(nestSize * percentage);

        // Get fenster material price per sqm
        // CRITICAL: These values MUST match configuratorData.ts fenster options
        const fensterPriceMap: Record<string, number> = {
            'pvc_fenster': 280,     // PVC - RAL 9016 Kunststoff
            'holz': 400,            // Fichte - Holz
            'aluminium_schwarz': 700, // Aluminium Dunkel - RAL 9005 Tiefschwarz
            'aluminium_weiss': 700   // Aluminium Hell - RAL 9016 Reinweiß
        };

        const fensterPricePerSqm = fensterPriceMap[fensterValue] || 280;

        // Calculate total price
        const totalPrice = beleuchtungsSquareMeters * fensterPricePerSqm;

        return totalPrice;
    } catch (error) {
        console.error('Error calculating belichtungspaket price:', error);
        return 0;
    }
}

/**
 * Calculate absolute prices for configuration items
 * This corrects any negative/relative prices stored in the database
 */
function calculateAbsolutePrices(config: Record<string, unknown>): {
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
} {
    try {
        // Extract all items
        const nest = extractDetailedItem(config.nest);
        const gebaeudehuelle = extractDetailedItem(config.gebaeudehuelle);
        const innenverkleidung = extractDetailedItem(config.innenverkleidung);
        const fussboden = extractDetailedItem(config.fussboden);
        const belichtungspaket = extractDetailedItem(config.belichtungspaket);
        const pvanlage = extractDetailedItem(config.pvanlage);
        const fenster = extractDetailedItem(config.fenster);
        const stirnseite = extractDetailedItem(config.stirnseite);
        const planungspaket = extractDetailedItem(config.planungspaket);
        const geschossdecke = extractDetailedItem(config.geschossdecke);
        const bodenaufbau = extractDetailedItem(config.bodenaufbau);
        const kamindurchzug = extractDetailedItem(config.kamindurchzug);
        const fussbodenheizung = extractDetailedItem(config.fussbodenheizung);
        const fundament = extractDetailedItem(config.fundament);

        // Calculate absolute prices ONLY for core combination items that can have negative prices
        // Items like belichtungspaket, fenster, pvanlage, etc. are already stored with correct absolute prices
        if (nest && gebaeudehuelle && innenverkleidung && fussboden) {
            // Calculate base price (default combination)
            const basePrice = calculateModularPrice(
                nest.value,
                'trapezblech',
                'laerche',
                'ohne_belag'
            );

            // Calculate individual upgrade prices for each option
            const gebaeudehulleUpgrade = calculateModularPrice(nest.value, gebaeudehuelle.value, 'laerche', 'ohne_belag') - basePrice;
            const innenverkleidungUpgrade = calculateModularPrice(nest.value, 'trapezblech', innenverkleidung.value, 'ohne_belag') - basePrice;
            const fussbodenUpgrade = calculateModularPrice(nest.value, 'trapezblech', 'laerche', fussboden.value) - basePrice;

            // Recalculate fussboden - use combination pricing (not size-dependent)
            // Stone floors (kalkstein_kanafar, schiefer_massiv, parkett) are part of combination pricing
            let recalculatedFussboden = fussboden;
            if (fussboden) {
                recalculatedFussboden = fussbodenUpgrade > 0 ? { ...fussboden, price: fussbodenUpgrade } : { ...fussboden, price: 0 };
            }

            // Recalculate belichtungspaket price (dynamic based on nest size and fenster)
            let recalculatedBelichtungspaket = belichtungspaket;
            if (belichtungspaket && nest && fenster) {
                const calculatedPrice = calculateBelichtungspaketPrice(
                    belichtungspaket.value,
                    nest.value,
                    fenster.value
                );
                recalculatedBelichtungspaket = {
                    ...belichtungspaket,
                    price: calculatedPrice
                };
            }

            // Calculate total price for quantity-based items
            let recalculatedGeschossdecke = geschossdecke;
            if (geschossdecke && geschossdecke.quantity && geschossdecke.quantity > 0) {
                recalculatedGeschossdecke = {
                    ...geschossdecke,
                    price: geschossdecke.price * geschossdecke.quantity
                };
            }

            let recalculatedPvanlage = pvanlage;
            if (pvanlage && pvanlage.quantity && pvanlage.quantity > 0) {
                recalculatedPvanlage = {
                    ...pvanlage,
                    price: pvanlage.price * pvanlage.quantity
                };
            }

            // Fenster price is always 0 (included in belichtungspaket)
            let recalculatedFenster = fenster;
            if (fenster) {
                recalculatedFenster = { ...fenster, price: 0 };
            }

            return {
                // Core items: show base + upgrades
                nest: { ...nest, price: basePrice },
                gebaeudehuelle: gebaeudehulleUpgrade > 0 ? { ...gebaeudehuelle, price: gebaeudehulleUpgrade } : { ...gebaeudehuelle, price: 0 },
                innenverkleidung: innenverkleidungUpgrade > 0 ? { ...innenverkleidung, price: innenverkleidungUpgrade } : { ...innenverkleidung, price: 0 },
                fussboden: recalculatedFussboden,

                // Recalculated items
                belichtungspaket: recalculatedBelichtungspaket,
                pvanlage: recalculatedPvanlage,
                geschossdecke: recalculatedGeschossdecke,
                fenster: recalculatedFenster,

                // Other items: use stored prices as-is
                stirnseite,
                planungspaket,
                bodenaufbau,
                kamindurchzug,
                fussbodenheizung,
                fundament,
            };
        }

        // If core items are missing, return all items as-is
        return {
            nest,
            gebaeudehuelle,
            innenverkleidung,
            fussboden,
            belichtungspaket,
            pvanlage,
            fenster,
            stirnseite,
            planungspaket,
            geschossdecke,
            bodenaufbau,
            kamindurchzug,
            fussbodenheizung,
            fundament,
        };
    } catch (error) {
        console.error('Error calculating absolute prices:', error);
        // Fall back to original extraction
        return {
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
        };
    }
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

        // Calculate absolute prices for all items
        const absolutePrices = calculateAbsolutePrices(config);

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
            detailed: absolutePrices
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
function generateSessionName(startTime: Date, name: string | null, _sessionId: string): string {
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
        console.log('📊 Fetching all user sessions with details...');

        // Get ALL sessions (not just cart sessions) to show all user activity
        const sessions = await prisma.userSession.findMany({
            where: getIPFilterClause(), // Filter out excluded IPs
            include: {
                selectionEvents: {
                    select: { id: true }
                },
                interactionEvents: {
                    select: {
                        id: true,
                        eventType: true,
                        category: true,
                        elementId: true,
                        selectionValue: true,
                        timestamp: true,
                    },
                    orderBy: { timestamp: 'desc' },
                    take: 50 // Limit to last 50 interaction events per session
                }
            },
            orderBy: {
                startTime: 'desc'
            },
            take: 1000 // Increased limit to show more sessions (was 100)
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
            inquiries.map(inq => [inq.sessionId || '', inq])
        );

        const configurations: ConfigurationWithDetails[] = sessions.map(session => {
            const { simple, detailed } = parseConfigurationData(session.configurationData);
            // Calculate duration: use endTime if available, otherwise use lastActivity for active sessions
            const duration = session.endTime
                ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000)
                : session.lastActivity
                    ? Math.round((session.lastActivity.getTime() - session.startTime.getTime()) / 1000)
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
                isOhneNestMode: session.isOhneNestMode,

                // User location & activity metadata
                userLocation: {
                    country: session.country,
                    city: session.city,
                    ipAddress: session.ipAddress,
                },
                userActivity: {
                    timeSpent: duration,
                    clickCount: session.interactionEvents.filter(e => e.eventType === 'click').length,
                },
                visitCount: session.visitCount,
                userIdentifier: session.userIdentifier,

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
                    lastActivity: session.lastActivity.toISOString(),
                    interactionEvents: session.interactionEvents.map(event => ({
                        id: event.id,
                        eventType: event.eventType,
                        category: event.category,
                        elementId: event.elementId,
                        selectionValue: event.selectionValue,
                        timestamp: event.timestamp.toISOString()
                    })),
                    pageVisitsCount: session.interactionEvents.filter(e => e.eventType === 'page_visit').length,
                    clickEventsCount: session.interactionEvents.filter(e => e.eventType === 'click').length,
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
