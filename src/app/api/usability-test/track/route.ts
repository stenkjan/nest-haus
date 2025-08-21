import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Track Usability Test Interactions API
 * 
 * Records user interactions during the usability test
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            testId,
            stepId,
            eventType,
            elementId,
            elementText,
            duration,
            success = true,
            errorMessage,
            additionalData
        } = body;

        if (!testId || !stepId || !eventType) {
            return NextResponse.json({
                error: 'Missing required fields: testId, stepId, eventType'
            }, { status: 400 });
        }

        const startTime = Date.now();

        // Ensure test exists
        const test = await prisma.usabilityTest.findUnique({
            where: { testId }
        });

        if (!test) {
            return NextResponse.json({
                error: 'Test not found'
            }, { status: 404 });
        }

        // Record interaction
        const interaction = await prisma.testInteraction.create({
            data: {
                testId,
                stepId,
                eventType,
                elementId,
                elementText,
                duration,
                success,
                errorMessage,
                additionalData: {
                    ...additionalData,
                    userAgent: request.headers.get('user-agent'),
                    timestamp: new Date().toISOString(),
                    processingTime: Date.now() - startTime
                }
            }
        });

        // Update test last activity
        await prisma.usabilityTest.update({
            where: { testId },
            data: {
                updatedAt: new Date()
            }
        });

        // Track errors if any
        if (!success && errorMessage) {
            await prisma.usabilityTest.update({
                where: { testId },
                data: {
                    errorCount: {
                        increment: 1
                    }
                }
            });
        }

        console.log(`🎯 Test interaction tracked: ${eventType} on ${stepId} (${testId})`);

        return NextResponse.json({
            success: true,
            message: 'Interaction tracked successfully',
            data: {
                interactionId: interaction.id,
                testId,
                stepId,
                eventType,
                timestamp: interaction.timestamp
            }
        });

    } catch (error) {
        console.error('❌ Failed to track test interaction:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to track interaction',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
