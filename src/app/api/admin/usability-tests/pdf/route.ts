import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JsonValue } from '@prisma/client/runtime/library';

/**
 * Export individual usability test as PDF
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const testId = searchParams.get('testId');

        if (!testId) {
            return NextResponse.json({
                success: false,
                error: 'Missing testId parameter'
            }, { status: 400 });
        }

        console.log(`📄 Generating PDF for test: ${testId}`);

        // Fetch test details
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
                success: false,
                error: 'Test not found'
            }, { status: 404 });
        }

        // Process responses by step for better organization
        const responsesByStep = test.responses.reduce((acc, response) => {
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
        }, {} as Record<string, Array<Record<string, unknown>>>);

        // Generate HTML content for PDF
        const htmlContent = generateTestPDFHTML(test, responsesByStep);

        // Return HTML that will automatically trigger print dialog for PDF generation
        const response = new NextResponse(htmlContent, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            }
        });

        return response;

    } catch (error) {
        console.error('❌ PDF generation error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to generate PDF'
        }, { status: 500 });
    }
}

interface SingleTestData {
    id: string;
    testId: string;
    status: string;
    participantName: string | null;
    startedAt: Date;
    completedAt?: Date | null;
    overallRating?: number | null;
    totalDuration?: number | null;
    completionRate?: number | null;
    deviceInfo: JsonValue;
    responses: Array<Record<string, unknown>>;
}

function generateTestPDFHTML(
    test: SingleTestData,
    responsesByStep: Record<string, Array<Record<string, unknown>>>
): string {
    const deviceInfo = test.deviceInfo as Record<string, unknown> || {};
    const viewport = deviceInfo.viewport as Record<string, unknown>;
    const screen = deviceInfo.screen as Record<string, unknown>;

    return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alpha Test Results - ${test.participantName || 'Anonymous'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #ffffff;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .header h1 {
            color: #1f2937;
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #6b7280;
            font-size: 16px;
        }
        
        .overview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .overview-card {
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        
        .overview-card.status { background-color: #dbeafe; border-color: #3b82f6; }
        .overview-card.rating { background-color: #dcfce7; border-color: #22c55e; }
        .overview-card.duration { background-color: #f3e8ff; border-color: #8b5cf6; }
        .overview-card.completion { background-color: #fed7aa; border-color: #f97316; }
        
        .overview-card .label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        
        .overview-card.status .label { color: #1d4ed8; }
        .overview-card.rating .label { color: #15803d; }
        .overview-card.duration .label { color: #7c3aed; }
        .overview-card.completion .label { color: #ea580c; }
        
        .overview-card .value {
            font-size: 20px;
            font-weight: 700;
        }
        
        .overview-card.status .value { color: #1e40af; }
        .overview-card.rating .value { color: #166534; }
        .overview-card.duration .value { color: #6d28d9; }
        .overview-card.completion .value { color: #c2410c; }
        
        .section {
            margin-bottom: 30px;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        
        .section h2 {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .device-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .device-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }
        
        .device-item .label {
            font-weight: 600;
            color: #374151;
        }
        
        .device-item .value {
            color: #6b7280;
        }
        
        .response-item {
            margin-bottom: 20px;
            padding: 15px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
        }
        
        .response-question {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
        }
        
        .response-answer {
            color: #374151;
            padding: 8px 12px;
            background: #f3f4f6;
            border-radius: 4px;
        }
        
        .response-answer.rating {
            background: #fef3c7;
            color: #92400e;
            font-weight: 600;
        }
        
        .step-section {
            margin-bottom: 25px;
        }
        
        .step-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 10px;
            padding: 8px 12px;
            background: #e0e7ff;
            border-radius: 4px;
        }
        
        .no-responses {
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-style: italic;
        }
        
        .metadata {
            margin-top: 30px;
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
            
            .overview-grid {
                grid-template-columns: repeat(4, 1fr);
            }
            
            .section {
                break-inside: avoid;
                margin-bottom: 20px;
            }
            
            .response-item {
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
    <div class="header">
        <h1>🧪 Alpha Test Results</h1>
        <p><strong>Participant:</strong> ${test.participantName || 'Anonymous'} | <strong>Test ID:</strong> ${test.testId.substring(0, 12)}...</p>
        <p><strong>Date:</strong> ${new Date(test.startedAt).toLocaleDateString('de-DE')} at ${new Date(test.startedAt).toLocaleTimeString('de-DE')}</p>
    </div>

    <div class="overview-grid">
        <div class="overview-card status">
            <div class="label">Status</div>
            <div class="value">${test.status}</div>
        </div>
        <div class="overview-card rating">
            <div class="label">Overall Rating</div>
            <div class="value">${test.overallRating ? `${test.overallRating.toFixed(1)}/6` : 'N/A'}</div>
        </div>
        <div class="overview-card duration">
            <div class="label">Duration</div>
            <div class="value">${test.totalDuration ? `${Math.round(test.totalDuration / 1000 / 60)}m` : 'N/A'}</div>
        </div>
        <div class="overview-card completion">
            <div class="label">Completion</div>
            <div class="value">${test.completionRate ? `${test.completionRate.toFixed(0)}%` : 'N/A'}</div>
        </div>
    </div>

    ${deviceInfo && Object.keys(deviceInfo).length > 0 ? `
    <div class="section">
        <h2>📱 Device Information</h2>
        <div class="device-grid">
            <div class="device-item">
                <span class="label">Platform:</span>
                <span class="value">${deviceInfo.platform || 'Unknown'}</span>
            </div>
            <div class="device-item">
                <span class="label">Language:</span>
                <span class="value">${deviceInfo.language || 'Unknown'}</span>
            </div>
            <div class="device-item">
                <span class="label">Viewport:</span>
                <span class="value">${viewport ? `${viewport.width}×${viewport.height}` : 'Unknown'}</span>
            </div>
            <div class="device-item">
                <span class="label">Screen:</span>
                <span class="value">${screen ? `${screen.width}×${screen.height}` : 'Unknown'}</span>
            </div>
        </div>
    </div>
    ` : ''}

    <div class="section">
        <h2>💬 User Responses (${test.responses.length} total)</h2>
        ${Object.keys(responsesByStep).length > 0 ? `
            ${Object.entries(responsesByStep).map(([stepId, responses]) => `
                <div class="step-section">
                    <div class="step-title">📝 ${stepId.replace('-', ' ').replace('_', ' ').toUpperCase()}</div>
                    ${responses.map((response: Record<string, unknown>) => `
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

    <div class="metadata">
        <p>Generated on ${new Date().toLocaleDateString('de-DE')} at ${new Date().toLocaleTimeString('de-DE')}</p>
        <p>NEST-Haus Alpha Test Results | Test Duration: ${test.totalDuration ? `${Math.round(test.totalDuration / 1000 / 60)} minutes` : 'N/A'}</p>
        <p><em>Note: Interaction timeline excluded from PDF export for readability</em></p>
    </div>
</body>
</html>`;
}
