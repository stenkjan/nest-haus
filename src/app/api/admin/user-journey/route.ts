/**
 * User Journey API - Real Database Integration
 * 
 * Provides insights into user navigation patterns, drop-off points, and journey completion rates.
 * Used by the /admin/user-journey page for funnel analysis.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface UserJourneyData {
    dropOffPoints: Array<{
        step: string;
        users: number;
        dropOffRate: number;
        avgTimeSpent: number;
    }>;
    commonPaths: Array<{
        path: string;
        frequency: number;
        conversionRate: number;
    }>;
    timeSpentByStep: Array<{
        step: string;
        avgTime: number;
        medianTime: number;
        minTime: number;
        maxTime: number;
    }>;
    funnelSteps: Array<{
        step: string;
        stepNumber: number;
        users: number;
        completionRate: number;
        dropOffCount: number;
    }>;
    metadata: {
        totalSessions: number;
        completedJourneys: number;
        averageSteps: number;
        averageCompletionTime: number;
        dataRange: {
            from: string;
            to: string;
        };
        lastUpdated: string;
    };
}

class UserJourneyService {
    /**
     * Get funnel steps with drop-off analysis
     */
    static async getFunnelAnalysis(): Promise<UserJourneyData['funnelSteps']> {
        try {
            const sessions = await prisma.userSession.findMany({
                select: {
                    status: true,
                    configurationData: true,
                    selectionEvents: {
                        select: {
                            category: true,
                            timestamp: true
                        },
                        orderBy: {
                            timestamp: 'asc'
                        }
                    }
                }
            });

            // Define funnel steps
            const funnelSteps = [
                { step: 'Started Configuration', key: 'started' },
                { step: 'Selected Nest Type', key: 'nestType' },
                { step: 'Selected Building Envelope', key: 'gebaeudehuelle' },
                { step: 'Selected Interior', key: 'innenverkleidung' },
                { step: 'Selected Flooring', key: 'fussboden' },
                { step: 'Completed Configuration', key: 'completed' },
            ];

            const stepCounts = new Map<string, number>();

            // Initialize counts
            funnelSteps.forEach(step => stepCounts.set(step.key, 0));

            // Count users at each step
            sessions.forEach(session => {
                stepCounts.set('started', (stepCounts.get('started') || 0) + 1);

                const config = session.configurationData as Record<string, unknown> | null;
                if (config) {
                    if (config.nestType) stepCounts.set('nestType', (stepCounts.get('nestType') || 0) + 1);
                    if (config.gebaeudehuelle) stepCounts.set('gebaeudehuelle', (stepCounts.get('gebaeudehuelle') || 0) + 1);
                    if (config.innenverkleidung) stepCounts.set('innenverkleidung', (stepCounts.get('innenverkleidung') || 0) + 1);
                    if (config.fussboden) stepCounts.set('fussboden', (stepCounts.get('fussboden') || 0) + 1);
                }

                if (session.status === 'COMPLETED') {
                    stepCounts.set('completed', (stepCounts.get('completed') || 0) + 1);
                }
            });

            const totalUsers = stepCounts.get('started') || 1;

            return funnelSteps.map((step, index) => {
                const users = stepCounts.get(step.key) || 0;
                const previousUsers = index > 0 ? (stepCounts.get(funnelSteps[index - 1].key) || 0) : totalUsers;
                const dropOffCount = previousUsers - users;

                return {
                    step: step.step,
                    stepNumber: index + 1,
                    users,
                    completionRate: totalUsers > 0 ? Math.round((users / totalUsers) * 100) / 100 : 0,
                    dropOffCount: Math.max(0, dropOffCount)
                };
            });
        } catch (error) {
            console.error('❌ Failed to get funnel analysis:', error);
            return [];
        }
    }

    /**
     * Get common user paths through configurator
     */
    static async getCommonPaths(): Promise<UserJourneyData['commonPaths']> {
        try {
            const sessions = await prisma.userSession.findMany({
                select: {
                    status: true,
                    selectionEvents: {
                        select: {
                            category: true,
                            selection: true,
                            timestamp: true
                        },
                        orderBy: {
                            timestamp: 'asc'
                        }
                    }
                },
                where: {
                    selectionEvents: {
                        some: {}
                    }
                },
                take: 500
            });

            const pathCounts = new Map<string, { count: number; conversions: number }>();

            sessions.forEach(session => {
                if (session.selectionEvents.length === 0) return;

                // Create path from selections
                const path = session.selectionEvents
                    .map(event => event.category)
                    .join(' → ');

                if (!pathCounts.has(path)) {
                    pathCounts.set(path, { count: 0, conversions: 0 });
                }

                const pathData = pathCounts.get(path)!;
                pathData.count++;

                if (session.status === 'COMPLETED') {
                    pathData.conversions++;
                }
            });

            // Convert to array and sort by frequency
            return Array.from(pathCounts.entries())
                .map(([path, data]) => ({
                    path,
                    frequency: data.count,
                    conversionRate: data.count > 0 ? Math.round((data.conversions / data.count) * 100) / 100 : 0
                }))
                .sort((a, b) => b.frequency - a.frequency)
                .slice(0, 10); // Top 10 paths
        } catch (error) {
            console.error('❌ Failed to get common paths:', error);
            return [];
        }
    }

    /**
     * Get time spent per configurator step
     */
    static async getTimeSpentByStep(): Promise<UserJourneyData['timeSpentByStep']> {
        try {
            const interactions = await prisma.interactionEvent.findMany({
                select: {
                    category: true,
                    timeSpent: true
                },
                where: {
                    timeSpent: {
                        not: null,
                        gt: 0
                    }
                }
            });

            // Group by category
            const timeByCategory = new Map<string, number[]>();

            interactions.forEach(interaction => {
                if (!interaction.category || !interaction.timeSpent) return;

                if (!timeByCategory.has(interaction.category)) {
                    timeByCategory.set(interaction.category, []);
                }

                // Convert BigInt to Number
                timeByCategory.get(interaction.category)!.push(Number(interaction.timeSpent));
            });

            // Calculate stats for each category
            return Array.from(timeByCategory.entries())
                .map(([step, times]) => {
                    times.sort((a, b) => a - b);
                    const avg = times.reduce((a, b) => a + b, 0) / times.length;
                    const median = times[Math.floor(times.length / 2)];

                    return {
                        step,
                        avgTime: Math.round(avg),
                        medianTime: median,
                        minTime: times[0],
                        maxTime: times[times.length - 1]
                    };
                })
                .sort((a, b) => b.avgTime - a.avgTime);
        } catch (error) {
            console.error('❌ Failed to get time spent by step:', error);
            return [];
        }
    }

    /**
     * Get drop-off points analysis
     */
    static async getDropOffPoints(): Promise<UserJourneyData['dropOffPoints']> {
        try {
            // Get all sessions with their last interaction
            const sessions = await prisma.userSession.findMany({
                select: {
                    status: true,
                    selectionEvents: {
                        select: {
                            category: true,
                            timestamp: true
                        },
                        orderBy: {
                            timestamp: 'desc'
                        },
                        take: 1
                    },
                    interactionEvents: {
                        select: {
                            timeSpent: true
                        }
                    }
                },
                where: {
                    status: {
                        not: 'COMPLETED'
                    }
                }
            });

            // Group by last step
            const dropOffByStep = new Map<string, { count: number; totalTime: number }>();

            sessions.forEach(session => {
                const lastStep = session.selectionEvents[0]?.category || 'Landing Page';

                if (!dropOffByStep.has(lastStep)) {
                    dropOffByStep.set(lastStep, { count: 0, totalTime: 0 });
                }

                const stepData = dropOffByStep.get(lastStep)!;
                stepData.count++;

                // Sum time spent
                const timeSpent = session.interactionEvents.reduce((sum, event) =>
                    sum + (event.timeSpent || 0), 0
                );
                stepData.totalTime += timeSpent;
            });

            const totalDropOffs = sessions.length;

            return Array.from(dropOffByStep.entries())
                .map(([step, data]) => ({
                    step,
                    users: data.count,
                    dropOffRate: totalDropOffs > 0 ? Math.round((data.count / totalDropOffs) * 100) / 100 : 0,
                    avgTimeSpent: data.count > 0 ? Math.round(data.totalTime / data.count) : 0
                }))
                .sort((a, b) => b.users - a.users);
        } catch (error) {
            console.error('❌ Failed to get drop-off points:', error);
            return [];
        }
    }

    /**
     * Generate complete user journey data
     */
    static async generateUserJourneyData(): Promise<UserJourneyData> {
        console.log('🔍 Generating user journey data...');

        try {
            const [funnelSteps, commonPaths, timeSpentByStep, dropOffPoints, sessionStats] = await Promise.all([
                this.getFunnelAnalysis(),
                this.getCommonPaths(),
                this.getTimeSpentByStep(),
                this.getDropOffPoints(),
                prisma.userSession.aggregate({
                    _count: { id: true },
                    _avg: { totalPrice: true }
                })
            ]);

            // Get completed journeys count
            const completedCount = await prisma.userSession.count({
                where: { status: 'COMPLETED' }
            });

            // Calculate average steps
            const sessionsWithEvents = await prisma.userSession.findMany({
                select: {
                    selectionEvents: {
                        select: { id: true }
                    }
                },
                take: 100
            });

            const totalSteps = sessionsWithEvents.reduce((sum, session) =>
                sum + session.selectionEvents.length, 0
            );
            const averageSteps = sessionsWithEvents.length > 0 ?
                Math.round(totalSteps / sessionsWithEvents.length * 10) / 10 : 0;

            // Get average completion time for completed sessions
            const completedSessions = await prisma.userSession.findMany({
                where: {
                    status: 'COMPLETED',
                    endTime: { not: null }
                },
                select: {
                    startTime: true,
                    endTime: true
                },
                take: 100
            });

            let averageCompletionTime = 0;
            if (completedSessions.length > 0) {
                const totalTime = completedSessions.reduce((sum, session) => {
                    if (!session.endTime) return sum;
                    return sum + (session.endTime.getTime() - session.startTime.getTime());
                }, 0);
                averageCompletionTime = Math.round(totalTime / completedSessions.length / 1000); // Convert to seconds
            }

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            return {
                dropOffPoints,
                commonPaths,
                timeSpentByStep,
                funnelSteps,
                metadata: {
                    totalSessions: sessionStats._count.id,
                    completedJourneys: completedCount,
                    averageSteps,
                    averageCompletionTime,
                    dataRange: {
                        from: thirtyDaysAgo.toISOString(),
                        to: new Date().toISOString()
                    },
                    lastUpdated: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error('❌ Error generating user journey data:', error);
            throw error;
        }
    }
}

export async function GET() {
    const startTime = Date.now();

    try {
        console.log('📊 Fetching user journey data...');

        const data = await UserJourneyService.generateUserJourneyData();

        const processingTime = Date.now() - startTime;
        console.log(`✅ User journey data generated in ${processingTime}ms`);

        return NextResponse.json({
            success: true,
            data,
            performance: {
                processingTime,
                efficiency: processingTime < 1000 ? 'excellent' : processingTime < 3000 ? 'good' : 'needs_attention'
            },
            metadata: {
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                dataSource: 'postgresql'
            }
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error(`❌ User journey API error (${processingTime}ms):`, error);

        return NextResponse.json({
            success: false,
            error: 'Failed to fetch user journey data',
            details: error instanceof Error ? error.message : 'Unknown error',
            performance: {
                processingTime,
                efficiency: 'error'
            }
        }, { status: 500 });
    }
}

