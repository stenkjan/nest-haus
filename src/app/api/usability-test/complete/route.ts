import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Complete Usability Test API
 * 
 * Finalizes the test and calculates summary metrics
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { testId, totalDuration, consoleErrors, completionRate, finalUrl } = body;

        if (!testId) {
            return NextResponse.json({
                error: 'Missing required field: testId'
            }, { status: 400 });
        }

        const startTime = Date.now();

        // Ensure test exists
        const test = await prisma.usabilityTest.findUnique({
            where: { testId },
            include: {
                responses: true,
                interactions: true
            }
        });

        if (!test) {
            return NextResponse.json({
                error: 'Test not found'
            }, { status: 404 });
        }

        // Calculate overall rating from responses
        const ratingResponses = test.responses.filter(r =>
            r.questionType === 'RATING' &&
            typeof r.response === 'object' &&
            r.response &&
            'value' in r.response
        );

        const overallRating = ratingResponses.length > 0
            ? ratingResponses.reduce((sum, r) => {
                const responseObj = r.response as { value: number };
                return sum + responseObj.value;
            }, 0) / ratingResponses.length
            : null;

        // Count errors
        const errorCount = test.interactions.filter(i => !i.success).length +
            (consoleErrors ? consoleErrors.length : 0);

        // Update test with final data
        const completedTest = await prisma.usabilityTest.update({
            where: { testId },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                totalDuration,
                overallRating,
                completionRate: completionRate || 100,
                errorCount,
                consoleErrors: consoleErrors || [],
                updatedAt: new Date()
            }
        });

        // Record final interaction
        await prisma.testInteraction.create({
            data: {
                testId,
                stepId: 'test_complete',
                eventType: 'test_completed',
                success: true,
                additionalData: {
                    finalUrl,
                    totalDuration,
                    overallRating,
                    completionRate,
                    errorCount,
                    totalResponses: test.responses.length,
                    totalInteractions: test.interactions.length,
                    processingTime: Date.now() - startTime
                }
            }
        });

        // Generate summary for admin
        const summary = {
            testId,
            duration: totalDuration,
            overallRating,
            completionRate,
            errorCount,
            totalResponses: test.responses.length,
            totalInteractions: test.interactions.length + 1, // +1 for completion
            deviceInfo: test.deviceInfo,
            startedAt: test.startedAt,
            completedAt: completedTest.completedAt
        };

        console.log(`✅ Usability test completed: ${testId}`);
        console.log(`📊 Summary: ${overallRating?.toFixed(1)}/10 rating, ${completionRate}% completion, ${errorCount} errors`);

        return NextResponse.json({
            success: true,
            message: 'Test completed successfully',
            data: {
                testId,
                summary,
                completedAt: completedTest.completedAt
            }
        });

    } catch (error) {
        console.error('❌ Failed to complete usability test:', error);

        // Try to mark test as error state
        try {
            await prisma.usabilityTest.update({
                where: { testId },
                data: {
                    status: 'ERROR',
                    updatedAt: new Date()
                }
            });
        } catch (updateError) {
            console.error('Failed to update test status to ERROR:', updateError);
        }

        return NextResponse.json({
            success: false,
            error: 'Failed to complete test',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
