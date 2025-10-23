/**
 * Performance API - Real Database Integration
 * 
 * Provides system performance metrics, API response times, and health monitoring.
 * Used by the /admin/performance page for performance monitoring and optimization.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface PerformanceData {
    apiMetrics: {
        avgResponseTime: number;
        medianResponseTime: number;
        maxResponseTime: number;
        errorRate: number;
        requestsPerMinute: number;
        slowestEndpoints: Array<{
            endpoint: string;
            avgTime: number;
            count: number;
        }>;
    };
    databaseMetrics: {
        avgQueryTime: number;
        slowestQueries: Array<{
            query: string;
            avgTime: number;
            count: number;
        }>;
        totalQueries: number;
    };
    userExperience: {
        avgPageLoadTime: number;
        avgImageLoadTime: number;
        avgPriceCalcTime: number;
        totalMeasurements: number;
    };
    recentErrors: Array<{
        timestamp: string;
        error: string;
        endpoint: string;
        count: number;
    }>;
    systemHealth: {
        status: 'healthy' | 'degraded' | 'critical';
        uptime: number;
        totalSessions: number;
        activeSessions: number;
    };
    metadata: {
        dataRange: {
            from: string;
            to: string;
        };
        lastUpdated: string;
        totalMetrics: number;
    };
}

class PerformanceService {
    /**
     * Get API performance metrics
     */
    static async getAPIMetrics(): Promise<PerformanceData['apiMetrics']> {
        try {
            const apiMetrics = await prisma.performanceMetric.findMany({
                where: {
                    metricName: {
                        in: ['api_response_time', 'api_error']
                    }
                },
                select: {
                    metricName: true,
                    value: true,
                    endpoint: true,
                    timestamp: true
                },
                orderBy: {
                    timestamp: 'desc'
                },
                take: 1000
            });

            // Calculate response time stats
            const responseTimes = apiMetrics
                .filter(m => m.metricName === 'api_response_time')
                .map(m => m.value);

            const avgResponseTime = responseTimes.length > 0
                ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
                : 0;

            const sortedTimes = [...responseTimes].sort((a, b) => a - b);
            const medianResponseTime = sortedTimes.length > 0
                ? sortedTimes[Math.floor(sortedTimes.length / 2)]
                : 0;

            const maxResponseTime = responseTimes.length > 0
                ? Math.max(...responseTimes)
                : 0;

            // Calculate error rate
            const totalRequests = responseTimes.length;
            const errorCount = apiMetrics.filter(m => m.metricName === 'api_error').length;
            const errorRate = totalRequests > 0
                ? Math.round((errorCount / (totalRequests + errorCount)) * 10000) / 100
                : 0;

            // Calculate requests per minute (last hour)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const recentRequests = apiMetrics.filter(m =>
                m.timestamp >= oneHourAgo && m.metricName === 'api_response_time'
            );
            const requestsPerMinute = Math.round(recentRequests.length / 60 * 10) / 10;

            // Find slowest endpoints
            const endpointTimes = new Map<string, number[]>();
            apiMetrics
                .filter(m => m.metricName === 'api_response_time' && m.endpoint)
                .forEach(m => {
                    const endpoint = m.endpoint || 'unknown';
                    if (!endpointTimes.has(endpoint)) {
                        endpointTimes.set(endpoint, []);
                    }
                    endpointTimes.get(endpoint)!.push(m.value);
                });

            const slowestEndpoints = Array.from(endpointTimes.entries())
                .map(([endpoint, times]) => ({
                    endpoint,
                    avgTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
                    count: times.length
                }))
                .sort((a, b) => b.avgTime - a.avgTime)
                .slice(0, 5);

            return {
                avgResponseTime,
                medianResponseTime,
                maxResponseTime,
                errorRate,
                requestsPerMinute,
                slowestEndpoints
            };
        } catch (error) {
            console.error('❌ Failed to get API metrics:', error);
            return {
                avgResponseTime: 0,
                medianResponseTime: 0,
                maxResponseTime: 0,
                errorRate: 0,
                requestsPerMinute: 0,
                slowestEndpoints: []
            };
        }
    }

    /**
     * Get database performance metrics
     */
    static async getDatabaseMetrics(): Promise<PerformanceData['databaseMetrics']> {
        try {
            const dbMetrics = await prisma.performanceMetric.findMany({
                where: {
                    metricName: 'db_query_time'
                },
                select: {
                    value: true,
                    additionalData: true
                },
                take: 500
            });

            const queryTimes = dbMetrics.map(m => m.value);
            const avgQueryTime = queryTimes.length > 0
                ? Math.round(queryTimes.reduce((a, b) => a + b, 0) / queryTimes.length)
                : 0;

            // Aggregate query statistics
            const queryStats = new Map<string, number[]>();
            dbMetrics.forEach(metric => {
                const data = metric.additionalData as { query?: string } | null;
                const query = data?.query || 'unknown';
                if (!queryStats.has(query)) {
                    queryStats.set(query, []);
                }
                queryStats.get(query)!.push(metric.value);
            });

            const slowestQueries = Array.from(queryStats.entries())
                .map(([query, times]) => ({
                    query: query.substring(0, 100), // Truncate long queries
                    avgTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
                    count: times.length
                }))
                .sort((a, b) => b.avgTime - a.avgTime)
                .slice(0, 5);

            return {
                avgQueryTime,
                slowestQueries,
                totalQueries: dbMetrics.length
            };
        } catch (error) {
            console.error('❌ Failed to get database metrics:', error);
            return {
                avgQueryTime: 0,
                slowestQueries: [],
                totalQueries: 0
            };
        }
    }

    /**
     * Get user experience metrics
     */
    static async getUserExperienceMetrics(): Promise<PerformanceData['userExperience']> {
        try {
            const uxMetrics = await prisma.performanceMetric.findMany({
                where: {
                    metricName: {
                        in: ['page_load_time', 'image_load_time', 'price_calc_time']
                    }
                },
                select: {
                    metricName: true,
                    value: true
                },
                take: 1000
            });

            const pageLoadTimes = uxMetrics
                .filter(m => m.metricName === 'page_load_time')
                .map(m => m.value);

            const imageLoadTimes = uxMetrics
                .filter(m => m.metricName === 'image_load_time')
                .map(m => m.value);

            const priceCalcTimes = uxMetrics
                .filter(m => m.metricName === 'price_calc_time')
                .map(m => m.value);

            return {
                avgPageLoadTime: pageLoadTimes.length > 0
                    ? Math.round(pageLoadTimes.reduce((a, b) => a + b, 0) / pageLoadTimes.length)
                    : 0,
                avgImageLoadTime: imageLoadTimes.length > 0
                    ? Math.round(imageLoadTimes.reduce((a, b) => a + b, 0) / imageLoadTimes.length)
                    : 0,
                avgPriceCalcTime: priceCalcTimes.length > 0
                    ? Math.round(priceCalcTimes.reduce((a, b) => a + b, 0) / priceCalcTimes.length)
                    : 0,
                totalMeasurements: uxMetrics.length
            };
        } catch (error) {
            console.error('❌ Failed to get user experience metrics:', error);
            return {
                avgPageLoadTime: 0,
                avgImageLoadTime: 0,
                avgPriceCalcTime: 0,
                totalMeasurements: 0
            };
        }
    }

    /**
     * Get recent errors
     */
    static async getRecentErrors(): Promise<PerformanceData['recentErrors']> {
        try {
            const errors = await prisma.performanceMetric.findMany({
                where: {
                    metricName: 'api_error'
                },
                select: {
                    timestamp: true,
                    endpoint: true,
                    additionalData: true
                },
                orderBy: {
                    timestamp: 'desc'
                },
                take: 50
            });

            // Group errors by endpoint and error message
            const errorGroups = new Map<string, { timestamp: Date; count: number; error: string }>();

            errors.forEach(error => {
                const data = error.additionalData as { error?: string } | null;
                const errorMsg = data?.error || 'Unknown error';
                const key = `${error.endpoint || 'unknown'}:${errorMsg}`;

                if (!errorGroups.has(key)) {
                    errorGroups.set(key, {
                        timestamp: error.timestamp,
                        count: 0,
                        error: errorMsg
                    });
                }
                errorGroups.get(key)!.count++;
            });

            return Array.from(errorGroups.entries())
                .map(([key, data]) => {
                    const endpoint = key.split(':')[0];
                    return {
                        timestamp: data.timestamp.toISOString(),
                        error: data.error,
                        endpoint,
                        count: data.count
                    };
                })
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 10);
        } catch (error) {
            console.error('❌ Failed to get recent errors:', error);
            return [];
        }
    }

    /**
     * Get system health status
     */
    static async getSystemHealth(): Promise<PerformanceData['systemHealth']> {
        try {
            const totalSessions = await prisma.userSession.count();
            const activeSessions = await prisma.userSession.count({
                where: {
                    status: 'ACTIVE'
                }
            });

            // Check recent error rate to determine health
            const recentMetrics = await prisma.performanceMetric.findMany({
                where: {
                    timestamp: {
                        gte: new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
                    }
                },
                select: {
                    metricName: true
                }
            });

            const totalRequests = recentMetrics.filter(m => m.metricName === 'api_response_time').length;
            const errorCount = recentMetrics.filter(m => m.metricName === 'api_error').length;
            const errorRate = totalRequests > 0 ? (errorCount / totalRequests) : 0;

            let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
            if (errorRate > 0.1) status = 'critical'; // > 10% error rate
            else if (errorRate > 0.05) status = 'degraded'; // > 5% error rate

            return {
                status,
                uptime: 99.9, // Placeholder - would need actual uptime tracking
                totalSessions,
                activeSessions
            };
        } catch (error) {
            console.error('❌ Failed to get system health:', error);
            return {
                status: 'degraded',
                uptime: 0,
                totalSessions: 0,
                activeSessions: 0
            };
        }
    }

    /**
     * Generate complete performance data
     */
    static async generatePerformanceData(): Promise<PerformanceData> {
        console.log('🔍 Generating performance data...');

        try {
            const [apiMetrics, databaseMetrics, userExperience, recentErrors, systemHealth] = await Promise.all([
                this.getAPIMetrics(),
                this.getDatabaseMetrics(),
                this.getUserExperienceMetrics(),
                this.getRecentErrors(),
                this.getSystemHealth()
            ]);

            const totalMetrics = await prisma.performanceMetric.count();

            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

            return {
                apiMetrics,
                databaseMetrics,
                userExperience,
                recentErrors,
                systemHealth,
                metadata: {
                    dataRange: {
                        from: twentyFourHoursAgo.toISOString(),
                        to: new Date().toISOString()
                    },
                    lastUpdated: new Date().toISOString(),
                    totalMetrics
                }
            };
        } catch (error) {
            console.error('❌ Error generating performance data:', error);
            throw error;
        }
    }
}

export async function GET() {
    const startTime = Date.now();

    try {
        console.log('📊 Fetching performance data...');

        const data = await PerformanceService.generatePerformanceData();

        const processingTime = Date.now() - startTime;
        console.log(`✅ Performance data generated in ${processingTime}ms`);

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
        console.error(`❌ Performance API error (${processingTime}ms):`, error);

        return NextResponse.json({
            success: false,
            error: 'Failed to fetch performance data',
            details: error instanceof Error ? error.message : 'Unknown error',
            performance: {
                processingTime,
                efficiency: 'error'
            }
        }, { status: 500 });
    }
}

