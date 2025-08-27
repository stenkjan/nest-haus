import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Start Usability Test API
 * 
 * Initializes a new usability test session and tracks device/browser information
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { testId, deviceInfo, startUrl, participantName } = body;

        if (!testId) {
            return NextResponse.json({
                error: 'Missing required field: testId'
            }, { status: 400 });
        }

        const startTime = Date.now();

        // Create or update usability test record (handle duplicates)
        const test = await prisma.usabilityTest.upsert({
            where: { testId },
            update: {
                // Update existing test if it exists
                status: 'IN_PROGRESS',
                updatedAt: new Date()
            },
            create: {
                // Create new test if it doesn't exist
                testId,
                testType: 'alpha',
                status: 'IN_PROGRESS',
                participantName: participantName || 'Anonymous',
                deviceInfo: {
                    ...deviceInfo,
                    startUrl,
                    browserInfo: {
                        userAgent: request.headers.get('user-agent'),
                        acceptLanguage: request.headers.get('accept-language'),
                        referer: request.headers.get('referer')
                    }
                },
                ipAddress: request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown'
            }
        });

        // Track initial interaction
        await prisma.testInteraction.create({
            data: {
                testId,
                stepId: 'test_start',
                eventType: 'test_initialized',
                success: true,
                additionalData: {
                    startUrl,
                    deviceInfo,
                    initializationTime: Date.now() - startTime
                }
            }
        });

        console.log(`🧪 Usability test started: ${testId}`);
        console.log(`🧪 Test record created with ID: ${test.id}`);

        return NextResponse.json({
            success: true,
            message: 'Usability test initialized successfully',
            data: {
                testId,
                sessionId: test.id,
                startedAt: test.startedAt
            }
        });

    } catch (error) {
        console.error('❌ Failed to start usability test:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to start usability test',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
