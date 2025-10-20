/**
 * Admin Usage Monitoring API
 * 
 * Provides real-time service usage metrics for admin dashboard
 * Endpoint: GET /api/admin/usage
 */

import { NextRequest, NextResponse } from 'next/server';
import { UsageMonitor } from '@/lib/monitoring/UsageMonitor';
import { UsageAlerts } from '@/lib/monitoring/UsageAlerts';

/**
 * GET /api/admin/usage
 * 
 * Returns comprehensive usage metrics for all services
 * 
 * Query parameters:
 * - check_alerts=true: Trigger manual alert check
 */
export async function GET(request: NextRequest) {
    const startTime = Date.now();

    try {
        const { searchParams } = new URL(request.url);
        const checkAlerts = searchParams.get('check_alerts') === 'true';

        console.log('📊 Admin usage request started');

        // Get usage report
        const usage = await UsageMonitor.getUsageReport();

        // Optionally check alerts
        let alertStatus = null;
        if (checkAlerts) {
            alertStatus = await UsageAlerts.performManualCheck();
        }

        const processingTime = Date.now() - startTime;

        console.log(`✅ Usage report generated in ${processingTime}ms`);
        console.log(`Warnings: ${usage.warnings.length}`);

        return NextResponse.json({
            success: true,
            data: usage,
            alertStatus,
            performance: {
                processingTime,
                efficiency: processingTime < 1000 ? 'excellent' : 'acceptable',
            },
            metadata: {
                timestamp: new Date().toISOString(),
                version: '1.0.0',
            },
        });
    } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error('❌ Usage monitoring failed:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate usage report',
                details: error instanceof Error ? error.message : 'Unknown error',
                performance: {
                    processingTime,
                    efficiency: 'failed',
                },
                metadata: {
                    timestamp: new Date().toISOString(),
                    version: '1.0.0',
                },
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/usage/reset-alerts
 * 
 * Reset alert cooldowns (for testing)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const action = body.action;

        if (action === 'reset_cooldowns') {
            UsageAlerts.resetAlertCooldowns();
            return NextResponse.json({
                success: true,
                message: 'Alert cooldowns reset',
            });
        }

        if (action === 'check_now') {
            const result = await UsageAlerts.checkAndAlert();
            return NextResponse.json({
                success: true,
                result,
            });
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Invalid action',
            },
            { status: 400 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process request',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * Health check endpoint
 * HEAD /api/admin/usage
 */
export async function HEAD() {
    try {
        // Quick connectivity test
        await UsageMonitor.getDatabaseUsage();

        return new Response(null, {
            status: 200,
            headers: {
                'X-Usage-Monitor-Health': 'healthy',
                'X-Last-Check': new Date().toISOString(),
            },
        });
    } catch {
        return new Response(null, {
            status: 503,
            headers: {
                'X-Usage-Monitor-Health': 'unhealthy',
                'X-Last-Check': new Date().toISOString(),
            },
        });
    }
}

