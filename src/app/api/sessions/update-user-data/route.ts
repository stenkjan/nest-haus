import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

// Validation schema for user data update
const userDataSchema = z.object({
    sessionId: z.string().min(1),
    userData: z.object({
        name: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
        addressLine2: z.string().optional(),
        propertyNumber: z.string().optional(),
        cadastralCommunity: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        notes: z.string().optional(),
        service: z.string().optional(), // 'grundstueck-check' or 'appointment'
    }),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = userDataSchema.parse(body);

        const { sessionId, userData } = validatedData;

        console.log(`📝 Updating user data for session: ${sessionId}`);

        // Get existing session to merge data
        const existingSession = await prisma.userSession.findUnique({
            where: { sessionId },
        });

        // Merge existing configuration with new user data
        const existingConfig = existingSession?.configurationData as Record<string, unknown> || {};
        const mergedConfig = {
            ...existingConfig,
            userData: {
                ...(typeof existingConfig.userData === 'object' && existingConfig.userData !== null 
                    ? existingConfig.userData 
                    : {}),
                ...userData,
                updatedAt: new Date().toISOString(),
            },
        };

        // Update session with user data
        const session = await prisma.userSession.upsert({
            where: { sessionId },
            update: {
                configurationData: mergedConfig as Prisma.InputJsonValue,
                lastActivity: new Date(),
                updatedAt: new Date(),
            },
            create: {
                sessionId,
                configurationData: mergedConfig as Prisma.InputJsonValue,
                lastActivity: new Date(),
                ipAddress: request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
                referrer: request.headers.get('referer'),
            },
        });

        console.log(`✅ User data updated successfully for session: ${sessionId}`);

        return NextResponse.json({
            success: true,
            sessionId: session.sessionId,
            timestamp: Date.now(),
        });

    } catch (error) {
        console.error('User data update error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                error: 'Invalid data format',
                details: error.errors,
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            error: 'Failed to update user data',
        }, { status: 500 });
    }
}

