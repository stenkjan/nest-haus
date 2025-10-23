/**
 * Conversions API - Real Database Integration
 * 
 * Provides conversion funnel analysis, revenue tracking, and traffic source analysis.
 * Used by the /admin/conversion page for conversion rate optimization.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface ConversionsData {
    funnelSteps: Array<{
        step: string;
        stepNumber: number;
        users: number;
        conversionRate: number;
        dropOff: number;
    }>;
    revenue: {
        total: number;
        byPriceRange: Array<{
            range: string;
            amount: number;
            count: number;
            percentage: number;
        }>;
        byConfiguration: Array<{
            configuration: string;
            revenue: number;
            count: number;
        }>;
    };
    trafficSources: Array<{
        source: string;
        visitors: number;
        conversions: number;
        rate: number;
        revenue: number;
    }>;
    trends: {
        weekly: Array<{
            week: string;
            visitors: number;
            conversions: number;
            revenue: number;
            conversionRate: number;
        }>;
        monthly: Array<{
            month: string;
            visitors: number;
            conversions: number;
            revenue: number;
            conversionRate: number;
        }>;
    };
    metadata: {
        totalVisitors: number;
        totalConversions: number;
        overallConversionRate: number;
        totalRevenue: number;
        averageOrderValue: number;
        dataRange: {
            from: string;
            to: string;
        };
        lastUpdated: string;
    };
}

class ConversionsService {
    /**
     * Get conversion funnel with step-by-step analysis
     */
    static async getConversionFunnel(): Promise<ConversionsData['funnelSteps']> {
        try {
            const totalVisitors = await prisma.userSession.count();

            const steps = [
                { step: 'Visited Site', count: totalVisitors },
                {
                    step: 'Started Configuration',
                    count: await prisma.userSession.count({
                        where: {
                            selectionEvents: {
                                some: {}
                            }
                        }
                    })
                },
                {
                    step: 'Completed Configuration',
                    count: await prisma.userSession.count({
                        where: {
                            configurationData: {
                                not: Prisma.JsonNull
                            },
                            totalPrice: {
                                not: null,
                                gt: 0
                            }
                        }
                    })
                },
                {
                    step: 'Submitted Inquiry',
                    count: await prisma.customerInquiry.count()
                },
                {
                    step: 'Paid Deposit',
                    count: await prisma.customerInquiry.count({
                        where: {
                            paymentStatus: 'PAID'
                        }
                    })
                },
            ];

            return steps.map((step, index) => {
                const previousCount = index > 0 ? steps[index - 1].count : totalVisitors;
                const dropOff = previousCount - step.count;

                return {
                    step: step.step,
                    stepNumber: index + 1,
                    users: step.count,
                    conversionRate: totalVisitors > 0 ? Math.round((step.count / totalVisitors) * 10000) / 100 : 0,
                    dropOff: Math.max(0, dropOff)
                };
            });
        } catch (error) {
            console.error('❌ Failed to get conversion funnel:', error);
            return [];
        }
    }

    /**
     * Get revenue analysis
     */
    static async getRevenueAnalysis(): Promise<ConversionsData['revenue']> {
        try {
            // Get all paid inquiries
            const paidInquiries = await prisma.customerInquiry.findMany({
                where: {
                    paymentStatus: 'PAID',
                    paymentAmount: {
                        not: null,
                        gt: 0
                    }
                },
                select: {
                    paymentAmount: true,
                    totalPrice: true,
                    configurationData: true
                }
            });

            const totalRevenue = paidInquiries.reduce((sum, inquiry) =>
                sum + (inquiry.paymentAmount || 0), 0
            );

            // Revenue by price range (based on total config price, not deposit)
            const priceRanges = [
                { range: '100k-150k', min: 100000, max: 150000, amount: 0, count: 0 },
                { range: '150k-200k', min: 150000, max: 200000, amount: 0, count: 0 },
                { range: '200k-250k', min: 200000, max: 250000, amount: 0, count: 0 },
                { range: '250k-300k', min: 250000, max: 300000, amount: 0, count: 0 },
                { range: '300k+', min: 300000, max: Infinity, amount: 0, count: 0 }
            ];

            paidInquiries.forEach(inquiry => {
                if (!inquiry.totalPrice) return;
                const range = priceRanges.find(r => inquiry.totalPrice! >= r.min && inquiry.totalPrice! < r.max);
                if (range) {
                    range.amount += inquiry.paymentAmount || 0;
                    range.count++;
                }
            });

            const byPriceRange = priceRanges.map(range => ({
                range: range.range,
                amount: range.amount,
                count: range.count,
                percentage: totalRevenue > 0 ? Math.round((range.amount / totalRevenue) * 100) : 0
            }));

            // Revenue by configuration type
            const configRevenue = new Map<string, { revenue: number; count: number }>();

            paidInquiries.forEach(inquiry => {
                const config = inquiry.configurationData as Record<string, unknown> | null;
                const nestType = config?.nestType as string || 'Unknown';

                if (!configRevenue.has(nestType)) {
                    configRevenue.set(nestType, { revenue: 0, count: 0 });
                }

                const data = configRevenue.get(nestType)!;
                data.revenue += inquiry.paymentAmount || 0;
                data.count++;
            });

            const byConfiguration = Array.from(configRevenue.entries())
                .map(([configuration, data]) => ({
                    configuration,
                    revenue: data.revenue,
                    count: data.count
                }))
                .sort((a, b) => b.revenue - a.revenue);

            return {
                total: totalRevenue,
                byPriceRange,
                byConfiguration
            };
        } catch (error) {
            console.error('❌ Failed to get revenue analysis:', error);
            return {
                total: 0,
                byPriceRange: [],
                byConfiguration: []
            };
        }
    }

    /**
     * Get traffic source analysis
     */
    static async getTrafficSources(): Promise<ConversionsData['trafficSources']> {
        try {
            const sessions = await prisma.userSession.findMany({
                select: {
                    referrer: true,
                    status: true
                }
            });

            const sourceData = new Map<string, { visitors: number; conversions: number; revenue: number }>();

            // Process sessions
            sessions.forEach(session => {
                const source = session.referrer || 'Direct';

                if (!sourceData.has(source)) {
                    sourceData.set(source, { visitors: 0, conversions: 0, revenue: 0 });
                }

                const data = sourceData.get(source)!;
                data.visitors++;

                if (session.status === 'COMPLETED') {
                    data.conversions++;
                }
            });

            // Get revenue per source (this is a simplified version - would need to join with customer inquiries)
            // Get paid inquiries with their sessionIds
            const paidInquiries = await prisma.customerInquiry.findMany({
                where: {
                    paymentStatus: 'PAID',
                    sessionId: {
                        not: null
                    }
                },
                select: {
                    paymentAmount: true,
                    sessionId: true
                }
            });

            // Get sessions with referrer info for those sessionIds
            const sessionIds = paidInquiries
                .map(i => i.sessionId)
                .filter((id): id is string => id !== null);
            
            const sessions = await prisma.userSession.findMany({
                where: {
                    sessionId: {
                        in: sessionIds
                    }
                },
                select: {
                    sessionId: true,
                    referrer: true
                }
            });

            // Create a map of sessionId to referrer
            const sessionMap = new Map(
                sessions.map(s => [s.sessionId, s.referrer])
            );

            paidInquiries.forEach(inquiry => {
                const referrer = sessionMap.get(inquiry.sessionId!) || 'Direct';
                const source = referrer;
                const data = sourceData.get(source);
                if (data) {
                    data.revenue += inquiry.paymentAmount || 0;
                }
            });

            return Array.from(sourceData.entries())
                .map(([source, data]) => ({
                    source,
                    visitors: data.visitors,
                    conversions: data.conversions,
                    rate: data.visitors > 0 ? Math.round((data.conversions / data.visitors) * 10000) / 100 : 0,
                    revenue: data.revenue
                }))
                .sort((a, b) => b.visitors - a.visitors)
                .slice(0, 10); // Top 10 sources
        } catch (error) {
            console.error('❌ Failed to get traffic sources:', error);
            return [];
        }
    }

    /**
     * Get conversion trends over time
     */
    static async getTrends(): Promise<ConversionsData['trends']> {
        try {
            const fourWeeksAgo = new Date();
            fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

            const sessions = await prisma.userSession.findMany({
                where: {
                    startTime: {
                        gte: fourWeeksAgo
                    }
                },
                select: {
                    startTime: true,
                    status: true
                }
            });

            // Weekly trends
            const weeklyData = new Map<string, { visitors: number; conversions: number; revenue: number }>();

            sessions.forEach(session => {
                const weekStart = new Date(session.startTime);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                const weekKey = `KW ${Math.ceil((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;

                if (!weeklyData.has(weekKey)) {
                    weeklyData.set(weekKey, { visitors: 0, conversions: 0, revenue: 0 });
                }

                const week = weeklyData.get(weekKey)!;
                week.visitors++;
                if (session.status === 'COMPLETED') {
                    week.conversions++;
                }
            });

            const weekly = Array.from(weeklyData.entries())
                .map(([week, data]) => ({
                    week,
                    visitors: data.visitors,
                    conversions: data.conversions,
                    revenue: data.revenue,
                    conversionRate: data.visitors > 0 ? Math.round((data.conversions / data.visitors) * 10000) / 100 : 0
                }))
                .sort((a, b) => a.week.localeCompare(b.week));

            // Monthly trends (last 6 months)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const monthlySessions = await prisma.userSession.findMany({
                where: {
                    startTime: {
                        gte: sixMonthsAgo
                    }
                },
                select: {
                    startTime: true,
                    status: true
                }
            });

            const monthlyData = new Map<string, { visitors: number; conversions: number; revenue: number }>();

            monthlySessions.forEach(session => {
                const monthKey = session.startTime.toISOString().substring(0, 7); // YYYY-MM

                if (!monthlyData.has(monthKey)) {
                    monthlyData.set(monthKey, { visitors: 0, conversions: 0, revenue: 0 });
                }

                const month = monthlyData.get(monthKey)!;
                month.visitors++;
                if (session.status === 'COMPLETED') {
                    month.conversions++;
                }
            });

            const monthly = Array.from(monthlyData.entries())
                .map(([month, data]) => ({
                    month,
                    visitors: data.visitors,
                    conversions: data.conversions,
                    revenue: data.revenue,
                    conversionRate: data.visitors > 0 ? Math.round((data.conversions / data.visitors) * 10000) / 100 : 0
                }))
                .sort((a, b) => a.month.localeCompare(b.month));

            return {
                weekly,
                monthly
            };
        } catch (error) {
            console.error('❌ Failed to get trends:', error);
            return {
                weekly: [],
                monthly: []
            };
        }
    }

    /**
     * Generate complete conversions data
     */
    static async generateConversionsData(): Promise<ConversionsData> {
        console.log('🔍 Generating conversions data...');

        try {
            const [funnelSteps, revenue, trafficSources, trends] = await Promise.all([
                this.getConversionFunnel(),
                this.getRevenueAnalysis(),
                this.getTrafficSources(),
                this.getTrends()
            ]);

            // Calculate metadata
            const totalVisitors = await prisma.userSession.count();
            const totalConversions = await prisma.customerInquiry.count({
                where: { paymentStatus: 'PAID' }
            });

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            return {
                funnelSteps,
                revenue,
                trafficSources,
                trends,
                metadata: {
                    totalVisitors,
                    totalConversions,
                    overallConversionRate: totalVisitors > 0 ? Math.round((totalConversions / totalVisitors) * 10000) / 100 : 0,
                    totalRevenue: revenue.total,
                    averageOrderValue: totalConversions > 0 ? Math.round(revenue.total / totalConversions) : 0,
                    dataRange: {
                        from: thirtyDaysAgo.toISOString(),
                        to: new Date().toISOString()
                    },
                    lastUpdated: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error('❌ Error generating conversions data:', error);
            throw error;
        }
    }
}

export async function GET() {
    const startTime = Date.now();

    try {
        console.log('📊 Fetching conversions data...');

        const data = await ConversionsService.generateConversionsData();

        const processingTime = Date.now() - startTime;
        console.log(`✅ Conversions data generated in ${processingTime}ms`);

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
        console.error(`❌ Conversions API error (${processingTime}ms):`, error);

        return NextResponse.json({
            success: false,
            error: 'Failed to fetch conversions data',
            details: error instanceof Error ? error.message : 'Unknown error',
            performance: {
                processingTime,
                efficiency: 'error'
            }
        }, { status: 500 });
    }
}

