/**
 * Admin Security Monitoring API
 * 
 * Provides real-time security metrics and threat data from RealTimeMonitor
 * Endpoint: GET /api/admin/security
 */

import { NextRequest, NextResponse } from 'next/server';
import { RealTimeMonitor } from '@/lib/security/RealTimeMonitor';

/**
 * GET /api/admin/security
 * 
 * Returns comprehensive security monitoring data including:
 * - Current threat level
 * - Recent security events
 * - Active alerts
 * - Statistics (24h events, bot detections, etc.)
 */
export async function GET(_request: NextRequest) {
    const startTime = Date.now();

    try {
        console.log('🔒 Admin security monitoring request started');

        // Get security monitoring instance
        const monitor = RealTimeMonitor.getInstance();

        // Get comprehensive dashboard data
        const dashboardData = monitor.getDashboardData();

        const processingTime = Date.now() - startTime;

        console.log(`✅ Security data generated in ${processingTime}ms`);
        console.log(`Threat Level: ${dashboardData.threatLevel}`);
        console.log(`Active Alerts: ${dashboardData.activeAlerts.length}`);
        console.log(`Recent Events: ${dashboardData.recentEvents.length}`);

    return NextResponse.json({
      success: true,
      data: {
        threatLevel: dashboardData.threatLevel,
        metrics: {
          totalEvents: dashboardData.metrics.totalEvents,
          activeSessions: dashboardData.metrics.activeSessions,
          averageRiskScore: dashboardData.metrics.averageRiskScore,
          botDetectionRate: dashboardData.metrics.botDetectionRate,
          averageResponseTime: dashboardData.metrics.responseTime,
          eventsBySeverity: dashboardData.metrics.eventsBySeverity,
        },
        statistics: dashboardData.statistics,
        recentEvents: dashboardData.recentEvents.map(event => ({
          id: event.id,
          type: event.type,
          severity: event.severity,
          timestamp: event.timestamp,
          description: event.description,
          resolved: event.resolved,
        })),
        activeAlerts: dashboardData.activeAlerts.map(alert => ({
          id: alert.id,
          severity: alert.severity,
          message: alert.description,
          timestamp: alert.timestamp,
          type: alert.type,
        })),
      },
      performance: {
        processingTime,
        efficiency: processingTime < 500 ? 'excellent' : 'acceptable',
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    });
    } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error('❌ Security monitoring failed:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate security report',
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
 * Health check endpoint
 * HEAD /api/admin/security
 */
export async function HEAD() {
    try {
        const monitor = RealTimeMonitor.getInstance();
        const data = monitor.getDashboardData();

        return new Response(null, {
            status: 200,
            headers: {
                'X-Security-Monitor-Health': 'healthy',
                'X-Threat-Level': data.threatLevel,
                'X-Last-Check': new Date().toISOString(),
            },
        });
    } catch {
        return new Response(null, {
            status: 503,
            headers: {
                'X-Security-Monitor-Health': 'unhealthy',
                'X-Last-Check': new Date().toISOString(),
            },
        });
    }
}

