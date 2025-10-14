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
    const configSelections = new Map<string, { category: string; value: string; name: string; count: number; tests: Set<string> }>();
    const pageTimeData = new Map<string, { path: string; title: string; totalTime: number; visits: number; sessions: Set<string> }>();
    const clickedPages = new Map<string, { path: string; title: string; visits: number; sessions: Set<string> }>();
    const sectionTimeData = new Map<string, { section: string; path: string; totalTime: number; visits: number; sessions: Set<string> }>();

    tests.forEach(test => {
        const testId = test.testId;
        const interactions = (test.interactions || []) as Array<Record<string, unknown>>;

        // Process configurator selections - track unique tests per selection
        const testSelections = new Set<string>(); // Track unique selections per test
        interactions
            .filter((i: Record<string, unknown>) => i.eventType === 'configurator_selection')
            .forEach((interaction: Record<string, unknown>) => {
                const additionalData = interaction.additionalData as Record<string, unknown> || {};
                const data = additionalData.data as Record<string, unknown> || {};

                const category = String(data.category || 'unknown');
                const value = String(data.value || 'unknown');
                const name = String(data.name || value);

                const key = `${category}-${value}`;
                testSelections.add(key); // Only add once per test

                if (!configSelections.has(key)) {
                    configSelections.set(key, { category, value, name, count: 0, tests: new Set() });
                }
            });

        // Now count each unique selection once per test
        testSelections.forEach(key => {
            const selection = configSelections.get(key)!;
            selection.tests.add(testId);
            selection.count = selection.tests.size; // Count = number of unique tests
        });

        // Process page visits for time analytics
        const pageVisits = interactions.filter((i: Record<string, unknown>) => i.eventType === 'page_visit');

        // Debug: Log what we're processing for this test
        if (pageVisits.length > 0) {
            console.log(`📊 Test ${testId}: Found ${pageVisits.length} page visits, ${interactions.length} total interactions`);
        }

        pageVisits.forEach((visit: Record<string, unknown>, index: number) => {
            const additionalData = visit.additionalData as Record<string, unknown> || {};
            const data = additionalData.data as Record<string, unknown> || {};
            const path = String(data.path || visit.stepId || '/');
            const title = String(data.title || getPageTitle(path));
            const timestamp = new Date(visit.timestamp as string | number | Date).getTime();

            // Skip only direct test pages, but allow normal navigation
            if (path === '/alpha-test' || path === '/alpha-tests' || path.startsWith('/admin/') || path.includes('/test/')) return;

            // Calculate time spent on page
            const nextVisit = pageVisits[index + 1];
            if (nextVisit) {
                const nextTimestamp = new Date(nextVisit.timestamp as string | number | Date).getTime();
                const timeSpent = nextTimestamp - timestamp;

                // Only count reasonable time spans (between 1 second and 10 minutes)
                if (timeSpent > 1000 && timeSpent < 600000) {
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
            } else {
                // For the last page visit or single visits, add a visit count
                // Estimate time based on average session duration if available
                const estimatedTime = 30000; // 30 seconds default for single page visits

                if (pageTimeData.has(path)) {
                    const existing = pageTimeData.get(path)!;
                    existing.visits++;
                    existing.sessions.add(testId);
                    // Add estimated time for single visits
                    if (existing.totalTime === 0) {
                        existing.totalTime = estimatedTime;
                    }
                } else {
                    pageTimeData.set(path, {
                        path,
                        title,
                        totalTime: estimatedTime, // Give single visits some time value
                        visits: 1,
                        sessions: new Set([testId])
                    });
                }
            }
        });

        // Process button clicks for navigation analytics
        const clickableInteractions = interactions.filter((i: Record<string, unknown>) =>
            i.eventType === 'button_click' ||
            i.eventType === 'navigation' ||
            i.eventType === 'page_visit'
        );

        // Debug: Log clickable interactions for this test
        if (clickableInteractions.length > 0) {
            console.log(`📊 Test ${testId}: Found ${clickableInteractions.length} clickable interactions`);
        }

        clickableInteractions
            .forEach((click: Record<string, unknown>) => {
                const additionalData = click.additionalData as Record<string, unknown> || {};
                const data = additionalData.data as Record<string, unknown> || {};
                const path = String(data.path || click.stepId || '/');

                // Skip only direct test pages, but allow normal navigation
                if (path === '/alpha-test' || path === '/alpha-tests' || path.startsWith('/admin/') || path.includes('/test/')) return;

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

        // Process section routes (hash-based navigation and configurator sections)
        interactions
            .filter((i: Record<string, unknown>) =>
                i.eventType === 'page_visit' ||
                i.eventType === 'section_navigation' ||
                i.eventType === 'configurator_selection'
            )
            .forEach((visit: Record<string, unknown>, _index: number) => {
                const additionalData = visit.additionalData as Record<string, unknown> || {};
                const data = additionalData.data as Record<string, unknown> || {};
                const path = String(data.path || visit.stepId || '/');
                const timestamp = new Date(visit.timestamp as string | number | Date).getTime();

                let section = '';
                let sectionKey = '';

                // Check if it's a section route (contains #)
                if (path.includes('#')) {
                    const [basePath, sectionPart] = path.split('#');
                    section = sectionPart;
                    sectionKey = `${basePath}#${section}`;
                } else if (visit.eventType === 'configurator_selection') {
                    // Handle configurator sections
                    section = String(data.category || 'configurator');
                    sectionKey = `/konfigurator#${section}`;
                } else if (path.includes('/konfigurator')) {
                    // Handle configurator page sections
                    section = 'configurator';
                    sectionKey = '/konfigurator#main';
                } else {
                    // Skip test-related paths for section analytics too
                    if (path.includes('alpha-test') || path.includes('/test/') || path.includes('alpha-tests') || path.includes('/admin/')) {
                        return; // Skip this interaction
                    }

                    // Create section from page path
                    const pathParts = path.split('/').filter(p => p);
                    if (pathParts.length > 0) {
                        section = pathParts[pathParts.length - 1];
                        sectionKey = `${path}#${section}`;
                    }
                }

                if (section && sectionKey) {
                    // Calculate time spent on section
                    const allInteractions = interactions.filter(i =>
                        new Date(i.timestamp as string).getTime() > timestamp
                    );
                    const nextInteraction = allInteractions[0];

                    if (nextInteraction) {
                        const nextTimestamp = new Date(nextInteraction.timestamp as string | number | Date).getTime();
                        const timeSpent = nextTimestamp - timestamp;

                        if (timeSpent > 0 && timeSpent < 300000) { // Max 5 minutes per section
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
                }
            });
    });

    // Convert maps to arrays and calculate averages
    const configSelectionsArray = Array.from(configSelections.values())
        .map(item => ({
            category: item.category,
            value: item.value,
            name: item.name,
            count: item.count // This is now the number of unique tests that selected this option
        }))
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

    // Debug logging
    console.log(`📊 Configuration Analytics Processing Complete:`);
    console.log(`   - Config Selections: ${configSelectionsArray.length} items`);
    if (configSelectionsArray.length > 0) {
        console.log(`   - Top config selection: ${configSelectionsArray[0].name} (${configSelectionsArray[0].count} tests selected this)`);
    }
    console.log(`   - Page Time Data: ${pageTimeArray.length} pages`);
    if (pageTimeArray.length > 0) {
        console.log(`   - Page time sample:`, pageTimeArray.slice(0, 3).map(p => `${p.title}: ${Math.round(p.avgTime / 1000)}s (${p.visits} visits)`));
    }
    console.log(`   - Clicked Pages: ${clickedPagesArray.length} pages`);
    if (clickedPagesArray.length > 0) {
        console.log(`   - Clicked pages sample:`, clickedPagesArray.slice(0, 3).map(p => `${p.title}: ${p.visits} clicks`));
    }
    console.log(`   - Section Time Data: ${sectionTimeArray.length} sections`);

    if (pageTimeArray.length > 0) {
        console.log(`   - Top page by time: ${pageTimeArray[0].title} (${Math.round(pageTimeArray[0].avgTime / 1000)}s)`);
    }
    if (clickedPagesArray.length > 0) {
        console.log(`   - Most clicked page: ${clickedPagesArray[0].title} (${clickedPagesArray[0].visits} visits)`);
    }
    if (sectionTimeArray.length > 0) {
        console.log(`   - Top section by time: ${sectionTimeArray[0].section} (${Math.round(sectionTimeArray[0].avgTime / 1000)}s)`);
    }

    // Debug: Log sample interactions to understand data structure
    if (tests.length > 0) {
        const sampleTest = tests[0];
        const sampleInteractions = (sampleTest.interactions || []).slice(0, 5);
        console.log(`📊 Sample interactions from test ${sampleTest.testId}:`);
        sampleInteractions.forEach((interaction, i) => {
            const additionalData = interaction.additionalData as Record<string, unknown> || {};
            const data = additionalData.data as Record<string, unknown> || {};
            const path = String(data.path || interaction.stepId || '/');
            const isFiltered = path.includes('alpha-test') || path.includes('/test/') || path.includes('alpha-tests') || path.includes('/admin/');

            console.log(`   ${i + 1}. Event: ${interaction.eventType}, Step: ${interaction.stepId}, Path: ${path} ${isFiltered ? '(FILTERED)' : '(COUNTED)'}`);
            if (interaction.additionalData) {
                console.log(`      Data: buttonText=${data.buttonText}, elementType=${data.elementType}`);
            }
        });
    }

    return {
        configSelections: configSelectionsArray,
        pageTimeData: pageTimeArray,
        clickedPages: clickedPagesArray,
        sectionTimeData: sectionTimeArray
    };
}

function getPageTitle(path: string): string {
    const titleMap: Record<string, string> = {
        '/entwurf': 'Entwurf',
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

        // Improved test status management
        try {
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            // Get tests that might need status updates
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

            let autoCompletedCount = 0;
            let abandonedCount = 0;
            let autoCompleted24hCount = 0;

            for (const test of inProgressTests) {
                // Check if user has completed feedback questionnaire responses
                const hasFeedbackResponses = test.responses.some(r => {
                    const responseData = r.response as Record<string, unknown>;
                    return responseData?.stepId === 'feedback-phase';
                });

                // Check if user has progressed beyond initial steps
                const hasProgressedBeyondInitial = test.responses.length > 0 ||
                    test.interactions.some(i => i.stepId !== 'test_start');

                // Auto-complete tests that are older than 24 hours regardless of progress
                if (test.startedAt < twentyFourHoursAgo) {
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

                    // Calculate duration from start to now (24+ hours)
                    const totalDuration = Date.now() - test.startedAt.getTime();

                    await prisma.usabilityTest.update({
                        where: { id: test.id },
                        data: {
                            status: 'COMPLETED',
                            completedAt: new Date(),
                            overallRating,
                            totalDuration,
                            completionRate: hasProgressedBeyondInitial ? 100 : 0,
                            updatedAt: new Date()
                        }
                    });
                    autoCompleted24hCount++;
                } else if (hasFeedbackResponses && test.startedAt < twoHoursAgo) {
                    // Auto-complete tests that have feedback responses and are older than 2 hours
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
                    autoCompletedCount++;
                } else if (!hasProgressedBeyondInitial && test.startedAt < twentyFourHoursAgo) {
                    // Only abandon tests that haven't progressed beyond initial steps (fallback for edge cases)
                    await prisma.usabilityTest.update({
                        where: { id: test.id },
                        data: {
                            status: 'ABANDONED',
                            updatedAt: new Date()
                        }
                    });
                    abandonedCount++;
                }
            }

            if (autoCompleted24hCount > 0) {
                console.log(`📊 Auto-completed ${autoCompleted24hCount} tests after 24+ hours (regardless of progress)`);
            }
            if (autoCompletedCount > 0) {
                console.log(`📊 Auto-completed ${autoCompletedCount} tests with feedback responses (2+ hours inactive)`);
            }
            if (abandonedCount > 0) {
                console.log(`📊 Marked ${abandonedCount} tests as ABANDONED (24+ hours inactive, no progress)`);
            }
        } catch (statusUpdateError) {
            console.warn('⚠️ Failed to update test statuses:', statusUpdateError);
            // Continue with the rest of the function
        }

        // Get all tests in range - with error handling for Prisma deployment issues
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let tests: Array<any> = [];

        try {
            tests = await prisma.usabilityTest.findMany({
                where: {
                    startedAt: { gte: startDate }
                },
                include: {
                    responses: true,
                    interactions: true
                },
                orderBy: { startedAt: 'desc' }
            });
        } catch (prismaError) {
            console.error('❌ Prisma findMany error:', prismaError);
            // Return empty results if Prisma fails - allows dashboard to work without data
            tests = [];
            console.log('📊 Using fallback: returning empty test results due to Prisma connection issue');
        }

        console.log(`📊 Found ${tests.length} tests in date range`);
        if (tests.length > 0) {
            console.log(`📊 Sample test IDs: ${tests.slice(0, 3).map(t => t.testId).join(', ')}`);
        }

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

        // Define current question IDs (only show questions that are currently in the test)
        const currentQuestionIds = [
            // Rating questions (1-6 scale)
            'navigation-ease',
            'configurator-usability',
            'nest-haus-understanding',
            'purchase-process',
            'configurator-options',
            'website-overall',
            'purchase-intention',
            // Open text questions
            'content-display-issues',
            'main-challenge',
            'nest-haus-concept-understanding',
            'missing-information',
            'improvement-suggestions',
            'advantages-disadvantages',
            'purchase-to-move-in-process',
            'window-wall-positioning',
            'house-categorization',
            'additional-costs',
            'unclear-topics',
            'confusing-elements',
            'detailed-description-needs'
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
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .map((r: any) => typeof r === 'object' && r && 'value' in r ? (r as Record<string, unknown>).value : null)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .filter((v: any) => v !== null && typeof v === 'number') as number[];

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

        // Error analysis
        const errorAnalysis = tests.reduce((acc, test) => {
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

        // Session tracking analytics
        const sessionTrackingStats = tests.reduce((acc, test) => {
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

        // Recent tests for quick overview
        const recentTests = tests.map(test => ({
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

        // Calculate performance metrics
        const avgTestDuration = performanceStats.testDurations.length > 0
            ? performanceStats.testDurations.reduce((a, b) => a + b, 0) / performanceStats.testDurations.length
            : 0;

        const avgErrorRate = performanceStats.errorRates.length > 0
            ? performanceStats.errorRates.reduce((a, b) => a + b, 0) / performanceStats.errorRates.length
            : 0;

        const avgCompletionRate = performanceStats.completionRates.length > 0
            ? performanceStats.completionRates.reduce((a, b) => a + b, 0) / performanceStats.completionRates.length
            : 0;

        // AI-powered qualitative analysis (simplified for now)
        const qualitativeResponses = Object.values(responsesByQuestion)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((q: any) => q.questionType === 'text')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .flatMap((q: any) => q.responses.map((r: any) => r.response as string))
            .filter(r => r && r.length > 0);

        const qualitativeInsights = {
            totalResponses: qualitativeResponses.length,
            averageLength: qualitativeResponses.length > 0
                ? Math.round(qualitativeResponses.reduce((sum, r) => sum + r.length, 0) / qualitativeResponses.length)
                : 0,
            keyThemes: extractKeyThemes(qualitativeResponses),
            sentiment: analyzeSentiment(qualitativeResponses)
        };

        // Configuration Analytics
        const configurationAnalytics = processConfigurationAnalytics(tests.map(test => ({
            testId: test.testId,
            interactions: test.interactions || []
        })));

        const analytics = {
            summary: {
                totalTests,
                completedTests,
                abandonedTests,
                errorTests,
                completionRate: Math.round(completionRate * 100) / 100,
                averageRating: Math.round(averageRating * 100) / 100,
                averageDuration: Math.round(averageDuration / 1000 / 60 * 100) / 100, // minutes
                avgTestDuration: Math.round(avgTestDuration / 1000 / 60 * 100) / 100, // minutes
                avgErrorRate: Math.round(avgErrorRate * 100) / 100,
                avgCompletionRate: Math.round(avgCompletionRate * 100) / 100
            },
            sessionTracking: {
                totalInteractions: sessionTrackingStats.totalInteractions,
                pageVisits: sessionTrackingStats.pageVisits,
                buttonClicks: sessionTrackingStats.buttonClicks,
                configuratorSelections: sessionTrackingStats.configuratorSelections,
                formInteractions: sessionTrackingStats.formInteractions,
                avgPagesPerSession: Math.round(sessionTrackingStats.avgPagesPerSession * 100) / 100,
                sessionsWithTracking: sessionTrackingStats.sessionsWithPages
            },
            configurationAnalytics,
            questionAnalysis: Object.values(responsesByQuestion),
            deviceStats,
            browserStats,
            platformStats,
            performanceMetrics: {
                testDurations: performanceStats.testDurations,
                errorRates: performanceStats.errorRates,
                completionRates: performanceStats.completionRates,
                averages: {
                    duration: avgTestDuration,
                    errorRate: avgErrorRate,
                    completionRate: avgCompletionRate
                }
            },
            qualitativeInsights,
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
