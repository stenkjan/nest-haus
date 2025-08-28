import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper functions for qualitative analysis
function extractKeyThemes(responses: string[]): Array<{ theme: string; count: number; examples: string[] }> {
    if (responses.length === 0) return [];

    // Simple keyword extraction (can be enhanced with NLP)
    const keywords = [
        { theme: 'Navigation', keywords: ['navigation', 'navigieren', 'menü', 'menu', 'finden', 'suchen'] },
        { theme: 'Design', keywords: ['design', 'aussehen', 'schön', 'hässlich', 'farbe', 'layout'] },
        { theme: 'Usability', keywords: ['einfach', 'schwer', 'kompliziert', 'benutzerfreundlich', 'intuitive'] },
        { theme: 'Performance', keywords: ['langsam', 'schnell', 'laden', 'performance', 'geschwindigkeit'] },
        { theme: 'Content', keywords: ['inhalt', 'text', 'information', 'verständlich', 'klar'] },
        { theme: 'Configurator', keywords: ['konfigurator', 'konfiguration', 'auswahl', 'optionen'] },
        { theme: 'Mobile', keywords: ['mobile', 'handy', 'smartphone', 'tablet', 'responsive'] },
        { theme: 'Errors', keywords: ['fehler', 'error', 'problem', 'bug', 'kaputt'] }
    ];

    return keywords.map(({ theme, keywords: themeKeywords }) => {
        const matchingResponses = responses.filter(response =>
            themeKeywords.some(keyword =>
                response.toLowerCase().includes(keyword.toLowerCase())
            )
        );

        return {
            theme,
            count: matchingResponses.length,
            examples: matchingResponses.slice(0, 3) // First 3 examples
        };
    }).filter(item => item.count > 0)
        .sort((a, b) => b.count - a.count);
}

function analyzeSentiment(responses: string[]): { positive: number; neutral: number; negative: number } {
    if (responses.length === 0) return { positive: 0, neutral: 0, negative: 0 };

    const positiveWords = ['gut', 'toll', 'super', 'perfekt', 'einfach', 'schön', 'gefällt', 'zufrieden', 'excellent'];
    const negativeWords = ['schlecht', 'schwer', 'kompliziert', 'hässlich', 'langsam', 'fehler', 'problem', 'frustrierend'];

    let positive = 0;
    let negative = 0;
    let neutral = 0;

    responses.forEach(response => {
        const lowerResponse = response.toLowerCase();
        const hasPositive = positiveWords.some(word => lowerResponse.includes(word));
        const hasNegative = negativeWords.some(word => lowerResponse.includes(word));

        if (hasPositive && !hasNegative) {
            positive++;
        } else if (hasNegative && !hasPositive) {
            negative++;
        } else {
            neutral++;
        }
    });

    return {
        positive: Math.round((positive / responses.length) * 100),
        neutral: Math.round((neutral / responses.length) * 100),
        negative: Math.round((negative / responses.length) * 100)
    };
}

// Configuration Analytics Processing
function processConfigurationAnalytics(tests: Array<{ testId: string; interactions?: Array<Record<string, unknown>> }>) {
    const configSelections = new Map<string, { category: string; value: string; name: string; count: number }>();
    const pageTimeData = new Map<string, { path: string; title: string; totalTime: number; visits: number; sessions: Set<string> }>();
    const clickedPages = new Map<string, { path: string; title: string; visits: number; sessions: Set<string> }>();
    const sectionTimeData = new Map<string, { section: string; path: string; totalTime: number; visits: number; sessions: Set<string> }>();

    tests.forEach(test => {
        const testId = test.testId;
        const interactions = (test.interactions || []) as Array<Record<string, unknown>>;

        // Process configurator selections
        interactions
            .filter((i: Record<string, unknown>) => i.eventType === 'configurator_selection')
            .forEach((interaction: Record<string, unknown>) => {
                const additionalData = interaction.additionalData as Record<string, unknown> || {};
                const data = additionalData.data as Record<string, unknown> || {};

                const category = String(data.category || 'unknown');
                const value = String(data.value || 'unknown');
                const name = String(data.name || value);

                const key = `${category}-${value}`;
                if (configSelections.has(key)) {
                    configSelections.get(key)!.count++;
                } else {
                    configSelections.set(key, { category, value, name, count: 1 });
                }
            });

        // Process page visits for time analytics
        const pageVisits = interactions.filter((i: Record<string, unknown>) => i.eventType === 'page_visit');

        pageVisits.forEach((visit: Record<string, unknown>, index: number) => {
            const additionalData = visit.additionalData as Record<string, unknown> || {};
            const data = additionalData.data as Record<string, unknown> || {};
            const path = String(data.path || '/');
            const title = String(data.title || path);
            const timestamp = new Date(visit.timestamp as string | number | Date).getTime();

            // Skip test pages
            if (path.includes('alpha-test') || path.includes('test')) return;

            // Calculate time spent on page
            const nextVisit = pageVisits[index + 1];
            if (nextVisit) {
                const nextTimestamp = new Date(nextVisit.timestamp as string | number | Date).getTime();
                const timeSpent = nextTimestamp - timestamp;

                if (pageTimeData.has(path)) {
                    const existing = pageTimeData.get(path)!;
                    existing.totalTime += timeSpent;
                    existing.visits++;
                    existing.sessions.add(testId);
                } else {
                    pageTimeData.set(path, {
                        path,
                        title,
                        totalTime: timeSpent,
                        visits: 1,
                        sessions: new Set([testId])
                    });
                }
            }
        });

        // Process button clicks for navigation analytics
        interactions
            .filter((i: Record<string, unknown>) => i.eventType === 'button_click')
            .forEach((click: Record<string, unknown>) => {
                const additionalData = click.additionalData as Record<string, unknown> || {};
                const data = additionalData.data as Record<string, unknown> || {};
                const path = String(data.path || '/');

                // Skip landing page, konfigurator, warenkorb, and test pages
                if (path === '/' || path.includes('konfigurator') || path.includes('warenkorb') || path.includes('alpha-test') || path.includes('test')) return;

                const title = getPageTitle(path);

                if (clickedPages.has(path)) {
                    const existing = clickedPages.get(path)!;
                    existing.visits++;
                    existing.sessions.add(testId);
                } else {
                    clickedPages.set(path, {
                        path,
                        title,
                        visits: 1,
                        sessions: new Set([testId])
                    });
                }
            });

        // Process section routes (hash-based navigation)
        pageVisits.forEach((visit: Record<string, unknown>, index: number) => {
            const additionalData = visit.additionalData as Record<string, unknown> || {};
            const data = additionalData.data as Record<string, unknown> || {};
            const path = String(data.path || '/');
            const timestamp = new Date(visit.timestamp as string | number | Date).getTime();

            // Check if it's a section route (contains #)
            if (path.includes('#')) {
                const [basePath, section] = path.split('#');
                const sectionKey = `${basePath}#${section}`;

                // Calculate time spent on section
                const nextVisit = pageVisits[index + 1];
                if (nextVisit) {
                    const nextTimestamp = new Date(nextVisit.timestamp as string | number | Date).getTime();
                    const timeSpent = nextTimestamp - timestamp;

                    if (sectionTimeData.has(sectionKey)) {
                        const existing = sectionTimeData.get(sectionKey)!;
                        existing.totalTime += timeSpent;
                        existing.visits++;
                        existing.sessions.add(testId);
                    } else {
                        sectionTimeData.set(sectionKey, {
                            section,
                            path: sectionKey,
                            totalTime: timeSpent,
                            visits: 1,
                            sessions: new Set([testId])
                        });
                    }
                }
            }
        });
    });

    // Convert maps to arrays and calculate averages
    const configSelectionsArray = Array.from(configSelections.values())
        .sort((a, b) => b.count - a.count);

    const pageTimeArray = Array.from(pageTimeData.values())
        .map(item => ({
            path: item.path,
            title: item.title,
            totalTime: item.totalTime,
            avgTime: item.visits > 0 ? item.totalTime / item.visits : 0,
            visits: item.visits,
            sessions: item.sessions.size
        }))
        .sort((a, b) => b.avgTime - a.avgTime);

    const clickedPagesArray = Array.from(clickedPages.values())
        .map(item => ({
            path: item.path,
            title: item.title,
            totalTime: 0,
            avgTime: 0,
            visits: item.visits,
            sessions: item.sessions.size
        }))
        .sort((a, b) => b.visits - a.visits);

    const sectionTimeArray = Array.from(sectionTimeData.values())
        .map(item => ({
            section: item.section,
            path: item.path,
            totalTime: item.totalTime,
            avgTime: item.visits > 0 ? item.totalTime / item.visits : 0,
            visits: item.visits,
            sessions: item.sessions.size
        }))
        .sort((a, b) => b.avgTime - a.avgTime);

    return {
        configSelections: configSelectionsArray,
        pageTimeData: pageTimeArray,
        clickedPages: clickedPagesArray,
        sectionTimeData: sectionTimeArray
    };
}

function getPageTitle(path: string): string {
    const titleMap: Record<string, string> = {
        '/unser-part': 'Unser Part',
        '/dein-part': 'Dein Part',
        '/kontakt': 'Kontakt',
        '/warum-wir': 'Warum Wir',
        '/entdecken': 'Entdecken'
    };
    return titleMap[path] || path;
}

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
        console.log(`📊 Date range: ${startDate.toISOString()} to ${new Date().toISOString()}`);

        // Update abandoned tests (30 minutes timeout) - TEMPORARILY DISABLED DUE TO PRISMA DEPLOYMENT ISSUE
        // const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        // const abandonedCount = await prisma.usabilityTest.updateMany({
        //     where: {
        //         status: 'IN_PROGRESS',
        //         startedAt: { lt: thirtyMinutesAgo }
        //     },
        //     data: {
        //         status: 'ABANDONED',
        //         updatedAt: new Date()
        //     }
        // });

        // if (abandonedCount.count > 0) {
        //     console.log(`📊 Marked ${abandonedCount.count} tests as ABANDONED (30+ minutes inactive)`);
        // }

        // Get all tests in range - TEMPORARILY MOCKED DUE TO PRISMA DEPLOYMENT ISSUE
        // const tests = await prisma.usabilityTest.findMany({
        //     where: {
        //         startedAt: { gte: startDate }
        //     },
        //     include: {
        //         responses: true,
        //         interactions: true
        //     },
        //     orderBy: { startedAt: 'desc' }
        // });
        
        // Mock data for testing
        const tests: Array<{
            testId: string;
            status: string;
            overallRating: number | null;
            totalDuration: number | null;
            errorCount: number;
            consoleErrors: Array<unknown> | null;
            participantName: string | null;
            startedAt: Date;
            completedAt: Date | null;
            deviceInfo: Record<string, unknown> | null;
            id: string;
            responses: Array<Record<string, unknown>>;
            interactions: Array<Record<string, unknown>>;
        }> = [];

        console.log(`📊 Found ${tests.length} tests in date range`);
        if (tests.length > 0) {
            console.log(`📊 Sample test IDs: ${tests.slice(0, 3).map(t => t.testId).join(', ')}`);
        }

        // Calculate summary metrics - TEMPORARILY MOCKED
        const totalTests = tests.length;
        const completedTests = tests.filter(t => t.status === 'COMPLETED').length;
        const _abandonedTests = tests.filter(t => t.status === 'ABANDONED').length;
        const _errorTests = tests.filter(t => t.status === 'ERROR').length;

        const _completionRate = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;

        // Calculate average ratings
        const completedTestsWithRating = tests.filter(t => t.overallRating !== null);
        const _averageRating = completedTestsWithRating.length > 0
            ? completedTestsWithRating.reduce((sum, t) => sum + (t.overallRating || 0), 0) / completedTestsWithRating.length
            : 0;

        // Calculate average duration
        const testsWithDuration = tests.filter(t => t.totalDuration !== null);
        const _averageDuration = testsWithDuration.length > 0
            ? testsWithDuration.reduce((sum, t) => sum + (t.totalDuration || 0), 0) / testsWithDuration.length
            : 0;

        // Define current question IDs (only show questions that are currently in the test)
        const currentQuestionIds = [
            'purchase-completion-issue',
            'overall-satisfaction',
            'navigation-ease',
            'configurator-usability',
            'content-clarity',
            'purchase-process',
            'content-readability',
            'most-helpful-feature',
            'biggest-challenge',
            'missing-information',
            'improvement-suggestions'
        ];

        // Analyze responses by question (filter to only current questions)
        const allResponses = tests.flatMap(t => t.responses);
        const responsesByQuestion = allResponses
            .filter(response => currentQuestionIds.includes(response.questionId))
            .reduce((acc, response) => {
                if (!acc[response.questionId]) {
                    acc[response.questionId] = {
                        questionId: response.questionId,
                        questionText: response.questionText,
                        questionType: response.questionType,
                        responses: [],
                        averageRating: undefined,
                        responseCount: 0
                    };
                }

                acc[response.questionId].responses.push(response.response as Record<string, unknown>);
                acc[response.questionId].responseCount++;

                // Calculate average for rating questions
                if (response.questionType === 'RATING') {
                    const values = acc[response.questionId].responses
                        .map(r => typeof r === 'object' && r && 'value' in r ? (r as Record<string, unknown>).value : null)
                        .filter(v => v !== null && typeof v === 'number') as number[];

                    if (values.length > 0) {
                        acc[response.questionId].averageRating = values.reduce((sum, v) => sum + v, 0) / values.length;
                    }
                }

                return acc;
            }, {} as Record<string, {
                questionId: string;
                questionText: string;
                questionType: string;
                averageRating?: number;
                responseCount: number;
                responses: Array<Record<string, unknown>>;
            }>);

        // Device/Browser analytics
        // Enhanced device and browser statistics
        const deviceStats = {} as Record<string, number>;
        const browserStats = {} as Record<string, number>;
        const platformStats = {} as Record<string, number>;
        const performanceStats = {
            totalLoadTime: 0,
            testDurations: [] as number[],
            errorRates: [] as number[],
            completionRates: [] as number[]
        };

        tests.forEach(test => {
            // Device info analysis
            if (test.deviceInfo && typeof test.deviceInfo === 'object') {
                const deviceInfo = test.deviceInfo as Record<string, unknown>;
                const userAgent = test.userAgent || '';

                // Enhanced browser detection
                const getBrowserInfo = (ua: string) => {
                    if (ua.includes('Edg/')) return 'Edge';
                    if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
                    if (ua.includes('Firefox/')) return 'Firefox';
                    if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
                    if (ua.includes('Opera/') || ua.includes('OPR/')) return 'Opera';
                    return 'Unknown';
                };

                // Enhanced device type detection
                const getDeviceType = (deviceInfo: Record<string, unknown>) => {
                    const viewport = deviceInfo.viewport;
                    if (viewport && typeof viewport === 'object' && 'width' in viewport) {
                        const viewportObj = viewport as { width: number };
                        if (viewportObj.width <= 768) return 'Mobile';
                        if (viewportObj.width <= 1024) return 'Tablet';
                    }

                    if (deviceInfo.isMobile) return 'Mobile';
                    if (deviceInfo.isTablet) return 'Tablet';
                    return 'Desktop';
                };

                const platform = String(deviceInfo.platform || 'Unknown');
                const browser = getBrowserInfo(userAgent);
                const deviceType = getDeviceType(deviceInfo);

                // Update statistics
                deviceStats[deviceType] = (deviceStats[deviceType] || 0) + 1;
                browserStats[browser] = (browserStats[browser] || 0) + 1;
                platformStats[platform] = (platformStats[platform] || 0) + 1;
            }

            // Performance statistics
            if (test.totalDuration) {
                performanceStats.testDurations.push(test.totalDuration);
            }

            if (test.completionRate) {
                performanceStats.completionRates.push(test.completionRate);
            }

            // Error rate calculation
            const totalInteractions = (test.interactions || []).length;
            if (totalInteractions > 0) {
                const errorRate = (test.errorCount / totalInteractions) * 100;
                performanceStats.errorRates.push(errorRate);
            }
        });

        // Error analysis - TEMPORARILY MOCKED
        const _errorAnalysis = tests.reduce((acc, test) => {
            acc.totalErrors += test.errorCount;

            if (test.consoleErrors && Array.isArray(test.consoleErrors)) {
                acc.consoleErrors += test.consoleErrors.length;
            }

            const failedInteractions = (test.interactions || []).filter((i: Record<string, unknown>) => !i.success);
            acc.interactionErrors += failedInteractions.length;

            return acc;
        }, {
            totalErrors: 0,
            consoleErrors: 0,
            interactionErrors: 0
        });

        // Session tracking analytics - TEMPORARILY MOCKED
        const _sessionTrackingStats = tests.reduce((acc, test) => {
            const interactions = (test.interactions || []) as Array<Record<string, unknown>>;

            // Count interaction types
            interactions.forEach(interaction => {
                const eventType = interaction.eventType;
                acc.totalInteractions++;

                switch (eventType) {
                    case 'page_visit':
                        acc.pageVisits++;
                        break;
                    case 'button_click':
                        acc.buttonClicks++;
                        break;
                    case 'configurator_selection':
                        acc.configuratorSelections++;
                        break;
                    case 'form_interaction':
                        acc.formInteractions++;
                        break;
                }
            });

            // Track unique pages visited per test
            const uniquePages = new Set();
            interactions
                .filter(i => i.eventType === 'page_visit')
                .forEach(i => {
                    const additionalData = i.additionalData as Record<string, unknown> || {};
                    const data = additionalData.data as Record<string, unknown> || {};
                    const path = String(data.path || '/');
                    uniquePages.add(path);
                });

            if (uniquePages.size > 0) {
                acc.avgPagesPerSession = (acc.avgPagesPerSession * acc.sessionsWithPages + uniquePages.size) / (acc.sessionsWithPages + 1);
                acc.sessionsWithPages++;
            }

            return acc;
        }, {
            totalInteractions: 0,
            pageVisits: 0,
            buttonClicks: 0,
            configuratorSelections: 0,
            formInteractions: 0,
            avgPagesPerSession: 0,
            sessionsWithPages: 0
        });

        // Recent tests for quick overview - TEMPORARILY MOCKED
        const _recentTests = tests.slice(0, 10).map(test => ({
            id: test.id,
            testId: test.testId,
            status: test.status,
            participantName: test.participantName || 'Anonymous',
            startedAt: test.startedAt,
            completedAt: test.completedAt,
            overallRating: test.overallRating,
            completionRate: test.completionRate,
            errorCount: test.errorCount,
            duration: test.totalDuration,
            deviceType: getDeviceType(test.deviceInfo as Record<string, unknown> || {}),
            interactionCount: (test.interactions || []).length
        }));

        // Calculate performance metrics - TEMPORARILY MOCKED
        const _avgTestDuration = performanceStats.testDurations.length > 0
            ? performanceStats.testDurations.reduce((a, b) => a + b, 0) / performanceStats.testDurations.length
            : 0;

        const _avgErrorRate = performanceStats.errorRates.length > 0
            ? performanceStats.errorRates.reduce((a, b) => a + b, 0) / performanceStats.errorRates.length
            : 0;

        const _avgCompletionRate = performanceStats.completionRates.length > 0
            ? performanceStats.completionRates.reduce((a, b) => a + b, 0) / performanceStats.completionRates.length
            : 0;

        // AI-powered qualitative analysis (simplified for now)
        const qualitativeResponses = Object.values(responsesByQuestion)
            .filter(q => q.questionType === 'text')
            .flatMap(q => q.responses.map(r => r.response as string))
            .filter(r => r && r.length > 0);

        const _qualitativeInsights = {
            totalResponses: qualitativeResponses.length,
            averageLength: qualitativeResponses.length > 0
                ? Math.round(qualitativeResponses.reduce((sum, r) => sum + r.length, 0) / qualitativeResponses.length)
                : 0,
            keyThemes: extractKeyThemes(qualitativeResponses),
            sentiment: analyzeSentiment(qualitativeResponses)
        };

        // Configuration Analytics - TEMPORARILY MOCKED
        const _configurationAnalytics = processConfigurationAnalytics(tests.map(test => ({
            testId: test.testId,
            interactions: test.interactions || []
        })));

        // TEMPORARY: Return mock analytics data to test frontend
        const analytics = {
            summary: {
                totalTests: 0,
                completedTests: 0,
                abandonedTests: 0,
                errorTests: 0,
                completionRate: 0,
                averageRating: 0,
                averageDuration: 0,
                avgTestDuration: 0,
                avgErrorRate: 0,
                avgCompletionRate: 0
            },
            sessionTracking: {
                totalInteractions: 0,
                pageVisits: 0,
                buttonClicks: 0,
                configuratorSelections: 0,
                formInteractions: 0,
                avgPagesPerSession: 0,
                sessionsWithTracking: 0
            },
            configurationAnalytics: {
                configSelections: [],
                pageTimeData: [],
                clickedPages: [],
                sectionTimeData: []
            },
            questionAnalysis: [],
            deviceStats: {},
            browserStats: {},
            platformStats: {},
            performanceMetrics: {
                testDurations: [],
                errorRates: [],
                completionRates: [],
                averages: {
                    duration: 0,
                    errorRate: 0,
                    completionRate: 0
                }
            },
            qualitativeInsights: {
                totalResponses: 0,
                averageLength: 0,
                keyThemes: [],
                sentiment: { positive: 0, neutral: 0, negative: 0 }
            },
            errorAnalysis: {
                totalErrors: 0,
                consoleErrors: 0,
                interactionErrors: 0
            },
            recentTests: [],
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

/**
 * DELETE - Reset all usability test data
 * 
 * Removes all test records, responses, and interactions from the database
 */
export async function DELETE(_request: NextRequest) {
    try {
        console.log('🗑️ Starting usability test data reset...');

        // Delete in correct order due to foreign key constraints
        // 1. Delete test interactions first
        const deletedInteractions = await prisma.testInteraction.deleteMany({});
        console.log(`🗑️ Deleted ${deletedInteractions.count} test interactions`);

        // 2. Delete usability responses
        const deletedResponses = await prisma.usabilityResponse.deleteMany({});
        console.log(`🗑️ Deleted ${deletedResponses.count} usability responses`);

        // 3. Delete usability tests
        const deletedTests = await prisma.usabilityTest.deleteMany({});
        console.log(`🗑️ Deleted ${deletedTests.count} usability tests`);

        const totalDeleted = deletedInteractions.count + deletedResponses.count + deletedTests.count;

        console.log(`✅ Usability test data reset complete! Removed ${totalDeleted} total records`);

        return NextResponse.json({
            success: true,
            message: 'All usability test data has been reset',
            deletedCounts: {
                tests: deletedTests.count,
                responses: deletedResponses.count,
                interactions: deletedInteractions.count,
                total: totalDeleted
            }
        });

    } catch (error) {
        console.error('❌ Failed to reset usability test data:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to reset test data',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

async function getTestDetails(testId: string) {
    try {
        console.log(`🔍 API: Getting test details for testId: ${testId}`);

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
            console.log(`🔍 API: Test not found for testId: ${testId}`);
            return NextResponse.json({
                error: 'Test not found'
            }, { status: 404 });
        }

        console.log(`🔍 API: Found test with ${test.responses.length} responses and ${(test.interactions || []).length} interactions`);

        if ((test.interactions || []).length > 0) {
            console.log(`🔍 API: Sample interactions:`, (test.interactions || []).slice(0, 3).map(i => ({
                eventType: i.eventType,
                elementId: i.elementId,
                stepId: i.stepId,
                timestamp: i.timestamp
            })));
        }

        // Process responses by step
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

        // Process interactions by step
        const interactionsByStep = (test.interactions || []).reduce((acc, interaction) => {
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
        }, {} as Record<string, Array<Record<string, unknown>>>);

        const responseData = {
            success: true,
            data: {
                test: {
                    id: test.id,
                    testId: test.testId,
                    participantName: test.participantName,
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
                interactions: test.interactions || [], // Add raw interactions for debugging
                timeline: [...test.responses, ...(test.interactions || [])]
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    .map(item => ({
                        type: 'questionId' in item ? 'response' : 'interaction',
                        timestamp: item.timestamp,
                        data: item
                    }))
            }
        };

        console.log(`🔍 API: Returning test details with:`, {
            testId: test.testId,
            responseCount: test.responses.length,
            interactionCount: (test.interactions || []).length,
            interactionsByStepKeys: Object.keys(interactionsByStep),
            timelineLength: responseData.data.timeline.length
        });

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('❌ Failed to get test details:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to get test details',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

function getDeviceType(deviceInfo: Record<string, unknown>): string {
    if (!deviceInfo || typeof deviceInfo !== 'object') return 'unknown';

    const viewport = deviceInfo.viewport;
    if (viewport && typeof viewport === 'object' && 'width' in viewport) {
        const viewportObj = viewport as { width: number };
        return viewportObj.width < 768 ? 'mobile' : 'desktop';
    }

    return 'unknown';
}
