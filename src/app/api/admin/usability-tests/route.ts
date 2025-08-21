import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Admin Usability Tests API
 * 
 * Provides analytics and insights from usability tests
 */

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get('timeRange') || '7d';
        const testId = searchParams.get('testId');

        // If specific test requested
        if (testId) {
            return await getTestDetails(testId);
        }

        // Calculate date range
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        console.log(`📊 Generating usability test analytics for ${timeRange}`);

        // Get all tests in range
        const tests = await prisma.usabilityTest.findMany({
            where: {
                startedAt: { gte: startDate }
            },
            include: {
                responses: true,
                interactions: true
            },
            orderBy: { startedAt: 'desc' }
        });

        // Calculate summary metrics
        const totalTests = tests.length;
        const completedTests = tests.filter(t => t.status === 'COMPLETED').length;
        const abandonedTests = tests.filter(t => t.status === 'ABANDONED').length;
        const errorTests = tests.filter(t => t.status === 'ERROR').length;

        const completionRate = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;

        // Calculate average ratings
        const completedTestsWithRating = tests.filter(t => t.overallRating !== null);
        const averageRating = completedTestsWithRating.length > 0
            ? completedTestsWithRating.reduce((sum, t) => sum + (t.overallRating || 0), 0) / completedTestsWithRating.length
            : 0;

        // Calculate average duration
        const testsWithDuration = tests.filter(t => t.totalDuration !== null);
        const averageDuration = testsWithDuration.length > 0
            ? testsWithDuration.reduce((sum, t) => sum + (t.totalDuration || 0), 0) / testsWithDuration.length
            : 0;

        // Analyze responses by question
        const allResponses = tests.flatMap(t => t.responses);
        const responsesByQuestion = allResponses.reduce((acc, response) => {
            if (!acc[response.questionId]) {
                acc[response.questionId] = {
                    questionId: response.questionId,
                    questionText: response.questionText,
                    questionType: response.questionType,
                    responses: [],
                    averageRating: null,
                    responseCount: 0
                };
            }

            acc[response.questionId].responses.push(response.response);
            acc[response.questionId].responseCount++;

            // Calculate average for rating questions
            if (response.questionType === 'RATING') {
                const values = acc[response.questionId].responses
                    .map(r => typeof r === 'object' && r && 'value' in r ? (r as any).value : null)
                    .filter(v => v !== null);

                if (values.length > 0) {
                    acc[response.questionId].averageRating = values.reduce((sum, v) => sum + v, 0) / values.length;
                }
            }

            return acc;
        }, {} as Record<string, any>);

        // Device/Browser analytics
        const deviceStats = tests.reduce((acc, test) => {
            if (test.deviceInfo && typeof test.deviceInfo === 'object') {
                const deviceInfo = test.deviceInfo as any;
                const platform = deviceInfo.platform || 'unknown';
                const viewport = deviceInfo.viewport;

                if (!acc[platform]) {
                    acc[platform] = 0;
                }
                acc[platform]++;

                // Track mobile vs desktop
                if (viewport && viewport.width) {
                    const isMobile = viewport.width < 768;
                    const deviceType = isMobile ? 'mobile' : 'desktop';
                    if (!acc[deviceType]) {
                        acc[deviceType] = 0;
                    }
                    acc[deviceType]++;
                }
            }
            return acc;
        }, {} as Record<string, number>);

        // Error analysis
        const errorAnalysis = tests.reduce((acc, test) => {
            acc.totalErrors += test.errorCount;

            if (test.consoleErrors && Array.isArray(test.consoleErrors)) {
                acc.consoleErrors += test.consoleErrors.length;
            }

            const failedInteractions = test.interactions.filter(i => !i.success);
            acc.interactionErrors += failedInteractions.length;

            return acc;
        }, {
            totalErrors: 0,
            consoleErrors: 0,
            interactionErrors: 0
        });

        // Recent tests for quick overview
        const recentTests = tests.slice(0, 10).map(test => ({
            id: test.id,
            testId: test.testId,
            status: test.status,
            startedAt: test.startedAt,
            completedAt: test.completedAt,
            overallRating: test.overallRating,
            completionRate: test.completionRate,
            errorCount: test.errorCount,
            duration: test.totalDuration,
            deviceType: getDeviceType(test.deviceInfo)
        }));

        const analytics = {
            summary: {
                totalTests,
                completedTests,
                abandonedTests,
                errorTests,
                completionRate: Math.round(completionRate * 100) / 100,
                averageRating: Math.round(averageRating * 100) / 100,
                averageDuration: Math.round(averageDuration / 1000 / 60 * 100) / 100, // minutes
            },
            questionAnalysis: Object.values(responsesByQuestion),
            deviceStats,
            errorAnalysis,
            recentTests,
            timeRange,
            generatedAt: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            data: analytics
        });

    } catch (error) {
        console.error('❌ Failed to generate usability test analytics:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to generate analytics',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

async function getTestDetails(testId: string) {
    try {
        const test = await prisma.usabilityTest.findUnique({
            where: { testId },
            include: {
                responses: {
                    orderBy: { timestamp: 'asc' }
                },
                interactions: {
                    orderBy: { timestamp: 'asc' }
                }
            }
        });

        if (!test) {
            return NextResponse.json({
                error: 'Test not found'
            }, { status: 404 });
        }

        // Process responses by step
        const responsesByStep = test.responses.reduce((acc, response) => {
            const responseData = response.response as any;
            const stepId = responseData?.stepId || 'unknown';

            if (!acc[stepId]) {
                acc[stepId] = [];
            }

            acc[stepId].push({
                questionId: response.questionId,
                questionText: response.questionText,
                questionType: response.questionType,
                response: responseData?.value,
                responseTime: response.responseTime,
                timestamp: response.timestamp
            });

            return acc;
        }, {} as Record<string, any[]>);

        // Process interactions by step
        const interactionsByStep = test.interactions.reduce((acc, interaction) => {
            if (!acc[interaction.stepId]) {
                acc[interaction.stepId] = [];
            }

            acc[interaction.stepId].push({
                eventType: interaction.eventType,
                elementId: interaction.elementId,
                elementText: interaction.elementText,
                duration: interaction.duration,
                success: interaction.success,
                errorMessage: interaction.errorMessage,
                timestamp: interaction.timestamp,
                additionalData: interaction.additionalData
            });

            return acc;
        }, {} as Record<string, any[]>);

        return NextResponse.json({
            success: true,
            data: {
                test: {
                    id: test.id,
                    testId: test.testId,
                    status: test.status,
                    startedAt: test.startedAt,
                    completedAt: test.completedAt,
                    totalDuration: test.totalDuration,
                    overallRating: test.overallRating,
                    completionRate: test.completionRate,
                    errorCount: test.errorCount,
                    deviceInfo: test.deviceInfo,
                    consoleErrors: test.consoleErrors
                },
                responsesByStep,
                interactionsByStep,
                timeline: [...test.responses, ...test.interactions]
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    .map(item => ({
                        type: 'questionId' in item ? 'response' : 'interaction',
                        timestamp: item.timestamp,
                        data: item
                    }))
            }
        });

    } catch (error) {
        console.error('❌ Failed to get test details:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to get test details',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

function getDeviceType(deviceInfo: any): string {
    if (!deviceInfo || typeof deviceInfo !== 'object') return 'unknown';

    const viewport = deviceInfo.viewport;
    if (viewport && viewport.width) {
        return viewport.width < 768 ? 'mobile' : 'desktop';
    }

    return 'unknown';
}
