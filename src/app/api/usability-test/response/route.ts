import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Save Usability Test Responses API
 * 
 * Stores user responses to test questions
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { testId, stepId, responses } = body;

        if (!testId || !stepId || !responses || !Array.isArray(responses)) {
            return NextResponse.json({
                error: 'Missing required fields: testId, stepId, responses (array)'
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

        // Save all responses for this step
        const savedResponses = await Promise.all(
            responses.map(async (response: any) => {
                const { questionId, questionType, questionText, response: responseValue, responseTime } = response;

                return await prisma.usabilityResponse.create({
                    data: {
                        testId,
                        questionId,
                        questionType: questionType.toUpperCase(),
                        questionText,
                        response: {
                            value: responseValue,
                            stepId,
                            timestamp: new Date().toISOString(),
                            responseTime
                        },
                        responseTime
                    }
                });
            })
        );

        // Update test progress
        const totalResponses = await prisma.usabilityResponse.count({
            where: { testId }
        });

        // Calculate completion rate (assuming 15 total questions across all steps)
        const estimatedTotalQuestions = 15;
        const completionRate = Math.min((totalResponses / estimatedTotalQuestions) * 100, 100);

        await prisma.usabilityTest.update({
            where: { testId },
            data: {
                completionRate,
                updatedAt: new Date()
            }
        });

        // Track step completion
        await prisma.testInteraction.create({
            data: {
                testId,
                stepId,
                eventType: 'step_responses_saved',
                success: true,
                additionalData: {
                    responsesCount: responses.length,
                    completionRate,
                    processingTime: Date.now() - startTime
                }
            }
        });

        console.log(`📝 Test responses saved: ${responses.length} responses for step ${stepId} (${testId})`);

        return NextResponse.json({
            success: true,
            message: 'Responses saved successfully',
            data: {
                testId,
                stepId,
                responsesCount: savedResponses.length,
                completionRate,
                totalResponses
            }
        });

    } catch (error) {
        console.error('❌ Failed to save test responses:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to save responses',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
