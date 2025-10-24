import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for session sync
const sessionSyncSchema = z.object({
    sessionId: z.string().min(1),
    configuration: z.object({
        sessionId: z.string(),
        nest: z.object({
            category: z.string(),
            value: z.string(),
            name: z.string(),
            price: z.number(),
        }).nullable().optional(),
        gebaeudehuelle: z.object({
            category: z.string(),
            value: z.string(),
            name: z.string(),
            price: z.number(),
        }).nullable().optional(),
        totalPrice: z.number(),
        timestamp: z.number(),
    }).passthrough(), // Allow additional properties
    currentPrice: z.number(),
    timestamp: z.number().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = sessionSyncSchema.parse(body);

        const { sessionId, configuration, currentPrice } = validatedData;

        // Upsert session configuration (create or update)
        const session = await prisma.userSession.upsert({
            where: { sessionId },
            update: {
                configurationData: JSON.parse(JSON.stringify(configuration)),
                totalPrice: currentPrice,
                lastActivity: new Date(),
                updatedAt: new Date(),
            },
            create: {
                sessionId,
                configurationData: JSON.parse(JSON.stringify(configuration)),
                totalPrice: currentPrice,
                lastActivity: new Date(),
                ipAddress: request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
            },
        });

        // Create SelectionEvent records for each selection in the configuration
        // This ensures admin dashboards can track user journey and popular configurations
        const config = configuration as Record<string, { value?: string; price?: number; category?: string } | null | undefined>;
        const categories = [
            'nest', 'gebaeudehuelle', 'innenverkleidung', 'fussboden',
            'belichtungspaket', 'pvanlage', 'fenster', 'stirnseite', 'planungspaket',
            'kamindurchzug', 'fussbodenheizung', 'bodenaufbau', 'geschossdecke', 'fundament'
        ];

        // Filter and create selection events for valid selections
        const selectionEventPromises = categories
            .filter(category => {
                const selection = config[category];
                return selection && typeof selection === 'object' && selection.value;
            })
            .map(category => {
                const selection = config[category];
                if (!selection || typeof selection !== 'object' || !selection.value) {
                    return Promise.resolve();
                }

                return prisma.selectionEvent.create({
                    data: {
                        sessionId,
                        category,
                        selection: selection.value,
                        totalPrice: currentPrice,
                        timestamp: new Date()
                    }
                }).catch(error => {
                    // Log but don't fail if selection event creation fails
                    console.warn(`⚠️ Failed to create SelectionEvent for ${category}:`, error);
                });
            });

        // Execute all selection event creations
        await Promise.all(selectionEventPromises);

        return NextResponse.json({
            success: true,
            sessionId: session.sessionId,
            timestamp: Date.now(),
        });

    } catch (error) {
        console.error('Session sync error:', error);

        // Return success to not block user experience
        return NextResponse.json({
            success: true,
            error: 'Session sync temporarily unavailable',
        });
    }
}
