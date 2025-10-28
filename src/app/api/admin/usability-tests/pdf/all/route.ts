import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JsonValue } from '@prisma/client/runtime/library';

/**
 * Export all usability tests as a single bundled PDF
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get('timeRange') || '7d';

        console.log(`📄 Generating bundled PDF for all tests in timeRange: ${timeRange}`);

        // Calculate date range - use null for "all" to fetch everything
        let startDate: Date | undefined = undefined;
        if (timeRange !== 'all') {
            const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
            startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
        }

        // Fetch all tests in range
        const tests = await prisma.usabilityTest.findMany({
            where: startDate ? {
                startedAt: { gte: startDate }
            } : {},
            include: {
                responses: {
                    orderBy: { timestamp: 'asc' }
                },
                interactions: {
                    orderBy: { timestamp: 'asc' }
                }
            },
            orderBy: { startedAt: 'desc' }
        });

        if (tests.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No tests found in the selected time range'
            }, { status: 404 });
        }

        console.log(`📄 Found ${tests.length} tests to include in bundled PDF`);

        // Generate HTML content for bundled PDF
        const htmlContent = generateBundledPDFHTML(tests, timeRange, startDate || new Date(0));

        // Return HTML that will automatically trigger print dialog for PDF generation
        const response = new NextResponse(htmlContent, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            }
        });

        return response;

    } catch (error) {
        console.error('❌ Bundled PDF generation error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to generate bundled PDF'
        }, { status: 500 });
    }
}

interface TestData {
    id: string;
    testId: string;
    status: string;
    participantName: string | null;
    startedAt: Date;
    completedAt?: Date | null;
    overallRating?: number | null;
    totalDuration?: number | null;
    deviceInfo: JsonValue;
    responses: Array<{
        id: string;
        timestamp: Date;
        testId: string;
        questionId: string;
        questionType: string;
        questionText: string;
        response: JsonValue;
        responseTime: number | null;
    }>;
    interactions: Array<Record<string, unknown>>;
}

function generateBundledPDFHTML(
    tests: TestData[],
    timeRange: string,
    startDate: Date
): string {
    const completedTests = tests.filter(t => t.status === 'COMPLETED').length;
    const testsWithRating = tests.filter(t => t.overallRating !== null && t.overallRating !== undefined);
    const averageRating = testsWithRating.length > 0
        ? testsWithRating.reduce((sum, t) => sum + (t.overallRating || 0), 0) / testsWithRating.length
        : 0;

    return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alpha Test Results Bundle - ${tests.length} Tests</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
            color: #1f2937;
            background: #ffffff;
            padding: 20px;
            max-width: 900px;
            margin: 0 auto;
        }
        
        .cover-header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
        }
        
        .cover-header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .cover-header p {
            font-size: 18px;
            opacity: 0.9;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .summary-card {
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #e5e7eb;
            text-align: center;
        }
        
        .summary-card.total { border-color: #3b82f6; background: #dbeafe; }
        .summary-card.completed { border-color: #22c55e; background: #dcfce7; }
        .summary-card.rating { border-color: #f59e0b; background: #fef3c7; }
        .summary-card.timerange { border-color: #8b5cf6; background: #f3e8ff; }
        
        .summary-card .value {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .summary-card.total .value { color: #1d4ed8; }
        .summary-card.completed .value { color: #15803d; }
        .summary-card.rating .value { color: #d97706; }
        .summary-card.timerange .value { color: #7c3aed; }
        
        .summary-card .label {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .test-item {
            margin-bottom: 40px;
            padding: 25px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            break-inside: avoid;
        }
        
        .test-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .test-title {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
        }
        
        .test-meta {
            text-align: right;
            font-size: 12px;
            color: #6b7280;
        }
        
        .test-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .test-stat {
            padding: 12px;
            background: white;
            border-radius: 6px;
            text-align: center;
            border: 1px solid #e5e7eb;
        }
        
        .test-stat .stat-label {
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 4px;
        }
        
        .test-stat .stat-value {
            font-size: 16px;
            font-weight: 700;
            color: #1f2937;
        }
        
        .responses-section {
            margin-top: 20px;
        }
        
        .responses-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 15px;
            padding: 8px 12px;
            background: #e0e7ff;
            border-radius: 4px;
        }
        
        .response-item {
            margin-bottom: 15px;
            padding: 12px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
        }
        
        .response-question {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 6px;
            font-size: 14px;
        }
        
        .response-answer {
            color: #374151;
            font-size: 13px;
            padding: 6px 8px;
            background: #f3f4f6;
            border-radius: 4px;
        }
        
        .response-answer.rating {
            background: #fef3c7;
            color: #92400e;
            font-weight: 600;
        }
        
        .no-responses {
            padding: 15px;
            text-align: center;
            color: #6b7280;
            font-style: italic;
            background: white;
            border-radius: 6px;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        .metadata {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }
        
        @media print {
            body {
                padding: 10px;
            }
            
            .test-item {
                break-inside: avoid;
                margin-bottom: 30px;
            }
            
            .cover-header {
                background: #4f46e5 !important;
                -webkit-print-color-adjust: exact;
            }
            
            .summary-card {
                break-inside: avoid;
            }
        }
    </style>
    <script>
        // Auto-trigger print dialog when page loads
        window.onload = function() {
            setTimeout(() => {
                window.print();
                // Close window after printing (if opened in popup)
                setTimeout(() => {
                    window.close();
                }, 1000);
            }, 500);
        };
    </script>
</head>
<body>
    <div class="cover-header">
        <h1>🧪 Alpha Test Results Bundle</h1>
        <p>Comprehensive Report: ${tests.length} Tests | ${timeRange === '30d' ? 'Last 30 Days' : timeRange === '90d' ? 'Last 90 Days' : 'All Time'}</p>
        <p>Generated on ${new Date().toLocaleDateString('de-DE')} at ${new Date().toLocaleTimeString('de-DE')}</p>
    </div>

    <div class="summary-grid">
        <div class="summary-card total">
            <div class="value">${tests.length}</div>
            <div class="label">Total Tests</div>
        </div>
        <div class="summary-card completed">
            <div class="value">${completedTests}</div>
            <div class="label">Completed Tests</div>
        </div>
        <div class="summary-card rating">
            <div class="value">${averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}</div>
            <div class="label">Avg Rating</div>
        </div>
        <div class="summary-card timerange">
            <div class="value">${timeRange === '30d' ? '30 Days' : timeRange === '90d' ? '90 Days' : 'All Time'}</div>
            <div class="label">Time Period</div>
        </div>
    </div>

    ${tests.map((test, index) => {
        // Process responses by step for better organization
        interface ProcessedResponse {
            questionId: string;
            questionText: string;
            questionType: string;
            response: unknown;
            responseTime: number | null;
            timestamp: Date;
        }

        const responsesByStep = test.responses.reduce((acc: Record<string, ProcessedResponse[]>, response) => {
            const responseData = response.response as Record<string, unknown>;
            const stepId = String(responseData?.stepId || 'unknown');

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
        }, {} as Record<string, ProcessedResponse[]>);

        const deviceInfo = test.deviceInfo as Record<string, unknown> || {};

        return `
        <div class="test-item ${index > 0 ? 'page-break' : ''}">
            <div class="test-header">
                <div class="test-title">
                    👤 ${test.participantName || 'Anonymous'} 
                    <span style="font-size: 14px; color: #6b7280; font-weight: normal;">
                        (${test.testId.substring(0, 8)}...)
                    </span>
                </div>
                <div class="test-meta">
                    <div><strong>Started:</strong> ${new Date(test.startedAt).toLocaleDateString('de-DE')} ${new Date(test.startedAt).toLocaleTimeString('de-DE')}</div>
                    ${test.completedAt ? `<div><strong>Completed:</strong> ${new Date(test.completedAt).toLocaleDateString('de-DE')} ${new Date(test.completedAt).toLocaleTimeString('de-DE')}</div>` : ''}
                </div>
            </div>

            <div class="test-overview">
                <div class="test-stat">
                    <div class="stat-label">Status</div>
                    <div class="stat-value">${test.status}</div>
                </div>
                <div class="test-stat">
                    <div class="stat-label">Rating</div>
                    <div class="stat-value">${test.overallRating ? `${test.overallRating.toFixed(1)}/6` : 'N/A'}</div>
                </div>
                <div class="test-stat">
                    <div class="stat-label">Duration</div>
                    <div class="stat-value">${test.totalDuration ? `${Math.round(test.totalDuration / 1000 / 60)}m` : 'N/A'}</div>
                </div>
                <div class="test-stat">
                    <div class="stat-label">Device</div>
                    <div class="stat-value">${deviceInfo.platform || 'Unknown'}</div>
                </div>
            </div>

            <div class="responses-section">
                <div class="responses-title">💬 User Responses (${test.responses.length} total)</div>
                ${Object.keys(responsesByStep).length > 0 ? `
                    ${Object.entries(responsesByStep).map(([stepId, responses]: [string, ProcessedResponse[]]) => `
                        <div style="margin-bottom: 20px;">
                            <div style="font-weight: 600; margin-bottom: 10px; color: #4f46e5; font-size: 14px;">
                                📝 ${stepId.replace('-', ' ').replace('_', ' ').toUpperCase()}
                            </div>
                            ${responses.map((response: ProcessedResponse) => `
                                <div class="response-item">
                                    <div class="response-question">${response.questionText}</div>
                                    <div class="response-answer ${response.questionType === 'RATING' ? 'rating' : ''}">
                                        ${response.questionType === 'RATING'
                ? `⭐ Rating: ${response.response || 'No rating'}/6`
                : (response.response || 'No response provided')
            }
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                ` : `
                    <div class="no-responses">
                        <p>No responses recorded for this test.</p>
                    </div>
                `}
            </div>
        </div>
        `;
    }).join('')}

    <div class="metadata">
        <p>Generated on ${new Date().toLocaleDateString('de-DE')} at ${new Date().toLocaleTimeString('de-DE')}</p>
        <p>NEST-Haus Alpha Test Results Bundle | Period: ${timeRange === 'all' ? 'All Time' : `${startDate.toLocaleDateString('de-DE')} - ${new Date().toLocaleDateString('de-DE')}`}</p>
        <p><em>Note: Interaction timelines excluded from PDF export for readability</em></p>
        <p><strong>Total Tests Included:</strong> ${tests.length} | <strong>Completed:</strong> ${completedTests} | <strong>Average Rating:</strong> ${averageRating > 0 ? averageRating.toFixed(1) + '/6' : 'N/A'}</p>
    </div>
</body>
</html>`;
}
