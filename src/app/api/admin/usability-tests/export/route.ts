import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Export usability test data in various formats
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format') || 'excel';
        const timeRange = searchParams.get('timeRange') || '7d';

        console.log(`📊 Exporting usability test data - Format: ${format}, Range: ${timeRange}`);

        // Calculate date range
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Improved test status management (same as main route)
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const inProgressTests = await prisma.usabilityTest.findMany({
            where: {
                status: 'IN_PROGRESS',
                startedAt: { lt: twoHoursAgo }
            },
            include: {
                responses: true,
                interactions: true
            }
        });

        for (const test of inProgressTests) {
            const hasFeedbackResponses = test.responses.some(r => {
                const responseData = r.response as Record<string, unknown>;
                return responseData?.stepId === 'feedback-phase';
            });

            const hasProgressedBeyondInitial = test.responses.length > 0 ||
                test.interactions.some(i => i.stepId !== 'test_start');

            if (hasFeedbackResponses && test.startedAt < twoHoursAgo) {
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

                await prisma.usabilityTest.update({
                    where: { id: test.id },
                    data: {
                        status: 'COMPLETED',
                        completedAt: new Date(),
                        overallRating,
                        completionRate: 100,
                        updatedAt: new Date()
                    }
                });
            } else if (!hasProgressedBeyondInitial && test.startedAt < twentyFourHoursAgo) {
                await prisma.usabilityTest.update({
                    where: { id: test.id },
                    data: {
                        status: 'ABANDONED',
                        updatedAt: new Date()
                    }
                });
            }
        }

        // Get all tests with full details
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

        console.log(`📊 Found ${tests.length} tests for export`);

        if (format === 'excel') {
            return await generateExcelExport(tests, timeRange);
        }

        return NextResponse.json({
            success: false,
            error: 'Unsupported export format'
        }, { status: 400 });

    } catch (error) {
        console.error('❌ Export error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to export data'
        }, { status: 500 });
    }
}

async function generateExcelExport(tests: Array<Record<string, unknown>>, timeRange: string) {
    // Create Excel-like CSV content (can be opened in Excel)
    const headers = [
        'Participant Name',
        'Test ID',
        'Status',
        'Started At',
        'Completed At',
        'Duration (minutes)',
        'Overall Rating',
        'Completion Rate (%)',
        'Error Count',
        'Device Type',
        'Platform',
        'Language',
        'Viewport',
        'Screen Resolution',
        'IP Address',
        'User Agent',
        'Total Interactions',
        'Question Responses'
    ];

    // Add dynamic question columns
    const allQuestions = new Set<string>();
    tests.forEach(test => {
        const responses = test.responses as Array<Record<string, unknown>> || [];
        responses.forEach((response: Record<string, unknown>) => {
            allQuestions.add(String(response.questionText));
        });
    });

    const questionHeaders = Array.from(allQuestions).sort();
    const fullHeaders = [...headers, ...questionHeaders];

    // Generate CSV content with UTF-8 BOM for proper Excel encoding
    const BOM = '\uFEFF';
    let csvContent = BOM + fullHeaders.map(header => `"${header}"`).join(',') + '\n';

    tests.forEach(test => {
        const deviceInfo = test.deviceInfo as Record<string, unknown> || {};
        const viewport = (deviceInfo.viewport as Record<string, unknown>);
        const screen = (deviceInfo.screen as Record<string, unknown>);

        const viewportStr = viewport ? `${viewport.width}×${viewport.height}` : '';
        const screenStr = screen ? `${screen.width}×${screen.height}` : '';

        const duration = typeof test.totalDuration === 'number' ? Math.round(test.totalDuration / 1000 / 60) : '';
        const completionRate = typeof test.completionRate === 'number' ? test.completionRate.toFixed(1) : '';
        const overallRating = typeof test.overallRating === 'number' ? test.overallRating.toFixed(1) : '';

        // Create responses map
        const responsesMap = new Map<string, string>();
        const responses = test.responses as Array<Record<string, unknown>> || [];
        responses.forEach((response: Record<string, unknown>) => {
            const responseData = response.response as Record<string, unknown>;
            const value = response.questionType === 'RATING'
                ? `${responseData?.value || 'N/A'}/6`
                : String(responseData?.value || 'No response');
            responsesMap.set(String(response.questionText), value);
        });

        const responsesSummary = responses.length
            ? `${responses.length} responses`
            : 'No responses';

        const interactions = test.interactions as Array<Record<string, unknown>> || [];

        const row = [
            test.participantName || 'Anonymous',
            test.testId,
            test.status,
            new Date(String(test.startedAt)).toLocaleString(),
            test.completedAt ? new Date(String(test.completedAt)).toLocaleString() : '',
            duration,
            overallRating,
            completionRate,
            test.errorCount || 0,
            getDeviceType(deviceInfo),
            deviceInfo.platform || '',
            deviceInfo.language || '',
            viewportStr,
            screenStr,
            test.ipAddress || '',
            test.userAgent || '',
            interactions.length,
            responsesSummary,
            // Add question responses
            ...questionHeaders.map(question => responsesMap.get(question) || '')
        ];

        csvContent += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });

    // Create response with proper headers for CSV download (opens in Excel)
    const response = new NextResponse(csvContent, {
        status: 200,
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="alpha-test-results-${timeRange}-${new Date().toISOString().split('T')[0]}.csv"`,
            'Cache-Control': 'no-cache'
        }
    });

    return response;
}

function getDeviceType(deviceInfo: Record<string, unknown>): string {
    const viewport = deviceInfo.viewport as Record<string, unknown>;

    if (!viewport) return 'Unknown';

    const width = typeof viewport.width === 'number' ? viewport.width : 0;
    if (width <= 768) return 'Mobile';
    if (width <= 1024) return 'Tablet';
    return 'Desktop';
}
