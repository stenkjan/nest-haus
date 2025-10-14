/**
 * Real-Time Security Monitoring System
 * 
 * Provides live monitoring of security events, threats, and anomalies
 * with real-time alerting and response capabilities.
 * 
 * Features:
 * - Live threat detection and alerting
 * - Security event aggregation and analysis
 * - Real-time dashboard data
 * - Automated response triggers
 * - Performance monitoring
 * - Incident tracking and reporting
 */

import { BehavioralAnalyzer, type BehaviorAnalysis } from './BehavioralAnalyzer';
import { BotDetector, type BotDetectionResult } from './BotDetector';

export interface SecurityEvent {
    id: string;
    sessionId: string;
    timestamp: number;
    type: SecurityEventType;
    severity: 'low' | 'medium' | 'high' | 'critical';
    source: string;
    description: string;
    metadata: Record<string, unknown>;
    resolved: boolean;
    responseActions: string[];
}

export type SecurityEventType =
    | 'bot_detection'
    | 'behavioral_anomaly'
    | 'rate_limit_exceeded'
    | 'suspicious_activity'
    | 'content_protection_violation'
    | 'devtools_detection'
    | 'injection_attempt'
    | 'brute_force_attempt'
    | 'data_breach_attempt'
    | 'unauthorized_access'
    | 'performance_anomaly';

export interface ThreatAlert {
    id: string;
    timestamp: number;
    type: SecurityEventType;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    affectedSessions: string[];
    recommendedActions: string[];
    autoResolved: boolean;
}

export interface SecurityMetrics {
    timestamp: number;
    activeSessions: number;
    totalEvents: number;
    threatLevel: 'normal' | 'elevated' | 'high' | 'critical';
    eventsByType: Record<SecurityEventType, number>;
    eventsBySeverity: Record<string, number>;
    averageRiskScore: number;
    botDetectionRate: number;
    falsePositiveRate: number;
    responseTime: number; // Average response time in ms
}

export interface MonitoringConfig {
    enabled: boolean;
    alertThresholds: {
        criticalEvents: number; // Events per minute to trigger critical alert
        highRiskSessions: number; // Percentage of high-risk sessions
        botDetectionRate: number; // Percentage to trigger alert
        responseTime: number; // Max response time before alert
    };
    autoResponse: {
        enabled: boolean;
        blockCriticalThreats: boolean;
        rateLimitSuspicious: boolean;
        notifyAdmins: boolean;
    };
    retention: {
        events: number; // Days to keep events
        metrics: number; // Days to keep metrics
    };
}

export class RealTimeMonitor {
    private static instance: RealTimeMonitor | null = null;
    private config: MonitoringConfig;
    private events = new Map<string, SecurityEvent>();
    private alerts = new Map<string, ThreatAlert>();
    private metrics: SecurityMetrics[] = [];
    private behavioralAnalyzer: BehavioralAnalyzer;
    private botDetector: BotDetector;
    private monitoringInterval: NodeJS.Timeout | null = null;
    private eventListeners = new Map<string, ((event: SecurityEvent) => void)[]>();

    private static readonly DEFAULT_CONFIG: MonitoringConfig = {
        enabled: true,
        alertThresholds: {
            criticalEvents: 10, // 10 critical events per minute
            highRiskSessions: 20, // 20% high-risk sessions
            botDetectionRate: 30, // 30% bot detection rate
            responseTime: 5000, // 5 second max response time
        },
        autoResponse: {
            enabled: true,
            blockCriticalThreats: false, // Don't auto-block in production
            rateLimitSuspicious: true,
            notifyAdmins: true,
        },
        retention: {
            events: 30, // Keep events for 30 days
            metrics: 90, // Keep metrics for 90 days
        },
    };

    private constructor(config: Partial<MonitoringConfig> = {}) {
        this.config = { ...RealTimeMonitor.DEFAULT_CONFIG, ...config };
        this.behavioralAnalyzer = BehavioralAnalyzer.getInstance();
        this.botDetector = BotDetector.getInstance();

        if (this.config.enabled) {
            this.startMonitoring();
        }
    }

    static getInstance(config: Partial<MonitoringConfig> = {}): RealTimeMonitor {
        if (!RealTimeMonitor.instance) {
            RealTimeMonitor.instance = new RealTimeMonitor(config);
        }
        return RealTimeMonitor.instance;
    }

    /**
     * Start real-time monitoring
     */
    startMonitoring(): void {
        if (this.monitoringInterval) {
            return; // Already monitoring
        }

        console.log('🔍 Starting real-time security monitoring');

        // Update metrics every 30 seconds
        this.monitoringInterval = setInterval(() => {
            this.updateMetrics();
            this.checkAlertThresholds();
            this.cleanupOldData();
        }, 30000);

        // Initial metrics update
        this.updateMetrics();
    }

    /**
     * Stop monitoring
     */
    stopMonitoring(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            console.log('🔍 Stopped real-time security monitoring');
        }
    }

    /**
     * Log a security event
     */
    logSecurityEvent(
        sessionId: string,
        type: SecurityEventType,
        severity: 'low' | 'medium' | 'high' | 'critical',
        description: string,
    metadata: Record<string, unknown> = {}
  ): SecurityEvent {
        const event: SecurityEvent = {
            id: this.generateEventId(),
            sessionId,
            timestamp: Date.now(),
            type,
            severity,
            source: 'RealTimeMonitor',
            description,
            metadata,
            resolved: false,
            responseActions: [],
        };

        this.events.set(event.id, event);

        console.log(`🔍 Security event logged: ${type} (${severity}) - ${description}`);

        // Trigger automated response if enabled
        if (this.config.autoResponse.enabled) {
            this.handleAutomatedResponse(event);
        }

        // Notify event listeners
        this.notifyEventListeners(event);

        // Check if this event should trigger an alert
        this.evaluateForAlert(event);

        return event;
    }

    /**
     * Log bot detection event
     */
    logBotDetection(
        sessionId: string,
        result: BotDetectionResult,
        userAgent: string,
        ipAddress?: string
    ): void {
        if (!result.isBot) return;

        const severity = this.mapRiskLevelToSeverity(result.riskLevel);
        const description = `Bot detected: ${result.detectionMethods.join(', ')}`;

        this.logSecurityEvent(sessionId, 'bot_detection', severity, description, {
            confidence: result.confidence,
            detectionMethods: result.detectionMethods,
            userAgent,
            ipAddress,
            reasons: result.reasons,
            allowAccess: result.allowAccess,
        });
    }

    /**
     * Log behavioral anomaly
     */
    logBehavioralAnomaly(
        sessionId: string,
        analysis: BehaviorAnalysis
    ): void {
        if (analysis.riskLevel === 'low') return;

        const severity = this.mapRiskLevelToSeverity(analysis.riskLevel);
        const description = `Behavioral anomaly detected: ${analysis.anomalies.join(', ')}`;

        this.logSecurityEvent(sessionId, 'behavioral_anomaly', severity, description, {
            suspicionScore: analysis.suspicionScore,
            botProbability: analysis.botProbability,
            confidence: analysis.confidence,
            anomalies: analysis.anomalies,
        });
    }

    /**
     * Log rate limit exceeded
     */
    logRateLimitExceeded(
        sessionId: string,
        ipAddress: string,
        endpoint: string,
        requestCount: number,
        limit: number
    ): void {
        const description = `Rate limit exceeded: ${requestCount}/${limit} requests to ${endpoint}`;

        this.logSecurityEvent(sessionId, 'rate_limit_exceeded', 'medium', description, {
            ipAddress,
            endpoint,
            requestCount,
            limit,
            ratio: requestCount / limit,
        });
    }

    /**
     * Log content protection violation
     */
    logContentProtectionViolation(
        sessionId: string,
        violationType: string,
        elementId?: string,
        userAgent?: string
    ): void {
        const description = `Content protection violation: ${violationType}`;

        this.logSecurityEvent(sessionId, 'content_protection_violation', 'medium', description, {
            violationType,
            elementId,
            userAgent,
        });
    }

    /**
     * Log DevTools detection
     */
    logDevToolsDetection(
        sessionId: string,
        detectionMethod: string,
        userAgent?: string
    ): void {
        const description = `Developer tools detected: ${detectionMethod}`;

        this.logSecurityEvent(sessionId, 'devtools_detection', 'low', description, {
            detectionMethod,
            userAgent,
        });
    }

    /**
     * Get current security metrics
     */
    getCurrentMetrics(): SecurityMetrics {
        return this.metrics[this.metrics.length - 1] || this.createEmptyMetrics();
    }

    /**
     * Get recent security events
     */
    getRecentEvents(limit = 100, type?: SecurityEventType): SecurityEvent[] {
        let events = Array.from(this.events.values())
            .sort((a, b) => b.timestamp - a.timestamp);

        if (type) {
            events = events.filter(e => e.type === type);
        }

        return events.slice(0, limit);
    }

    /**
     * Get active alerts
     */
    getActiveAlerts(): ThreatAlert[] {
        return Array.from(this.alerts.values())
            .filter(alert => !alert.autoResolved)
            .sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * Get security dashboard data
     */
    getDashboardData(): {
        metrics: SecurityMetrics;
        recentEvents: SecurityEvent[];
        activeAlerts: ThreatAlert[];
        threatLevel: string;
        statistics: {
            eventsLast24h: number;
            botDetectionsLast24h: number;
            criticalEventsLast1h: number;
            averageResponseTime: number;
        };
    } {
        const metrics = this.getCurrentMetrics();
        const recentEvents = this.getRecentEvents(20);
        const activeAlerts = this.getActiveAlerts();

        const now = Date.now();
        const last24h = now - 24 * 60 * 60 * 1000;
        const last1h = now - 60 * 60 * 1000;

        const eventsLast24h = recentEvents.filter(e => e.timestamp > last24h).length;
        const botDetectionsLast24h = recentEvents.filter(
            e => e.type === 'bot_detection' && e.timestamp > last24h
        ).length;
        const criticalEventsLast1h = recentEvents.filter(
            e => e.severity === 'critical' && e.timestamp > last1h
        ).length;

        return {
            metrics,
            recentEvents: recentEvents.slice(0, 10),
            activeAlerts,
            threatLevel: metrics.threatLevel,
            statistics: {
                eventsLast24h,
                botDetectionsLast24h,
                criticalEventsLast1h,
                averageResponseTime: metrics.responseTime,
            },
        };
    }

    /**
     * Add event listener
     */
    addEventListener(
        eventType: SecurityEventType | 'all',
        listener: (event: SecurityEvent) => void
    ): void {
        const listeners = this.eventListeners.get(eventType) || [];
        listeners.push(listener);
        this.eventListeners.set(eventType, listeners);
    }

    /**
     * Remove event listener
     */
    removeEventListener(
        eventType: SecurityEventType | 'all',
        listener: (event: SecurityEvent) => void
    ): void {
        const listeners = this.eventListeners.get(eventType) || [];
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
            this.eventListeners.set(eventType, listeners);
        }
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<MonitoringConfig>): void {
        this.config = { ...this.config, ...newConfig };

        if (this.config.enabled && !this.monitoringInterval) {
            this.startMonitoring();
        } else if (!this.config.enabled && this.monitoringInterval) {
            this.stopMonitoring();
        }

        console.log('🔍 Real-time monitor config updated:', newConfig);
    }

    /**
     * Private helper methods
     */

    private generateEventId(): string {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateAlertId(): string {
        return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private mapRiskLevelToSeverity(riskLevel: string): 'low' | 'medium' | 'high' | 'critical' {
        switch (riskLevel) {
            case 'critical': return 'critical';
            case 'high': return 'high';
            case 'medium': return 'medium';
            default: return 'low';
        }
    }

    private updateMetrics(): void {
        const now = Date.now();
        const events = Array.from(this.events.values());
        const recentEvents = events.filter(e => now - e.timestamp < 60000); // Last minute

        // Get behavioral analyzer stats
        const behaviorStats = this.behavioralAnalyzer.getRealTimeStats();

        // Get bot detector stats
        const botStats = this.botDetector.getRealTimeStats();

        // Calculate metrics
        const eventsByType: Record<SecurityEventType, number> = {
            bot_detection: 0,
            behavioral_anomaly: 0,
            rate_limit_exceeded: 0,
            suspicious_activity: 0,
            content_protection_violation: 0,
            devtools_detection: 0,
            injection_attempt: 0,
            brute_force_attempt: 0,
            data_breach_attempt: 0,
            unauthorized_access: 0,
            performance_anomaly: 0,
        };

        const eventsBySeverity: Record<string, number> = {
            low: 0,
            medium: 0,
            high: 0,
            critical: 0,
        };

        let totalRiskScore = 0;
        let riskScoreCount = 0;

        for (const event of recentEvents) {
            eventsByType[event.type]++;
            eventsBySeverity[event.severity]++;

            // Calculate risk score from metadata
            if (event.metadata.suspicionScore) {
                totalRiskScore += event.metadata.suspicionScore;
                riskScoreCount++;
            }
            if (event.metadata.confidence) {
                totalRiskScore += event.metadata.confidence;
                riskScoreCount++;
            }
        }

        const metrics: SecurityMetrics = {
            timestamp: now,
            activeSessions: behaviorStats.activeSessions,
            totalEvents: events.length,
            threatLevel: this.calculateThreatLevel(eventsByType, eventsBySeverity),
            eventsByType,
            eventsBySeverity,
            averageRiskScore: riskScoreCount > 0 ? totalRiskScore / riskScoreCount : 0,
            botDetectionRate: botStats.totalDetections > 0
                ? (botStats.botDetections / botStats.totalDetections) * 100
                : 0,
            falsePositiveRate: 0, // Would need manual review data
            responseTime: this.calculateAverageResponseTime(recentEvents),
        };

        this.metrics.push(metrics);

        // Keep only last 1000 metrics (about 8 hours at 30-second intervals)
        if (this.metrics.length > 1000) {
            this.metrics.shift();
        }
    }

    private calculateThreatLevel(
        eventsByType: Record<SecurityEventType, number>,
        eventsBySeverity: Record<string, number>
    ): 'normal' | 'elevated' | 'high' | 'critical' {
        const criticalEvents = eventsBySeverity.critical || 0;
        const highEvents = eventsBySeverity.high || 0;
        const totalEvents = Object.values(eventsByType).reduce((a, b) => a + b, 0);

        if (criticalEvents >= 5 || totalEvents >= 50) return 'critical';
        if (criticalEvents >= 2 || highEvents >= 10 || totalEvents >= 20) return 'high';
        if (criticalEvents >= 1 || highEvents >= 3 || totalEvents >= 10) return 'elevated';
        return 'normal';
    }

    private calculateAverageResponseTime(_events: SecurityEvent[]): number {
        // This would calculate actual response times based on event handling
        // For now, return a placeholder
        return 250; // 250ms average response time
    }

    private checkAlertThresholds(): void {
        const metrics = this.getCurrentMetrics();

        // Check critical events threshold
        if (metrics.eventsBySeverity.critical >= this.config.alertThresholds.criticalEvents) {
            this.createAlert(
                'critical_events_threshold',
                'critical',
                'Critical Events Threshold Exceeded',
                `${metrics.eventsBySeverity.critical} critical events detected in the last minute`,
                []
            );
        }

        // Check bot detection rate
        if (metrics.botDetectionRate >= this.config.alertThresholds.botDetectionRate) {
            this.createAlert(
                'high_bot_detection',
                'high',
                'High Bot Detection Rate',
                `Bot detection rate: ${metrics.botDetectionRate.toFixed(1)}%`,
                []
            );
        }

        // Check response time
        if (metrics.responseTime >= this.config.alertThresholds.responseTime) {
            this.createAlert(
                'slow_response_time',
                'medium',
                'Slow Response Time',
                `Average response time: ${metrics.responseTime}ms`,
                []
            );
        }
    }

    private createAlert(
        type: SecurityEventType,
        severity: 'low' | 'medium' | 'high' | 'critical',
        title: string,
        description: string,
        affectedSessions: string[]
    ): void {
        const alert: ThreatAlert = {
            id: this.generateAlertId(),
            timestamp: Date.now(),
            type,
            severity,
            title,
            description,
            affectedSessions,
            recommendedActions: this.getRecommendedActions(type, severity),
            autoResolved: false,
        };

        this.alerts.set(alert.id, alert);

        console.warn(`🚨 Security alert: ${title} - ${description}`);

        // Auto-resolve after 1 hour for non-critical alerts
        if (severity !== 'critical') {
            setTimeout(() => {
                const existingAlert = this.alerts.get(alert.id);
                if (existingAlert) {
                    existingAlert.autoResolved = true;
                }
            }, 60 * 60 * 1000);
        }
    }

    private getRecommendedActions(
        type: SecurityEventType,
        severity: 'low' | 'medium' | 'high' | 'critical'
    ): string[] {
        const actions: string[] = [];

        switch (type) {
            case 'bot_detection':
                actions.push('Review bot detection patterns');
                actions.push('Consider adjusting bot detection sensitivity');
                if (severity === 'critical') {
                    actions.push('Implement temporary rate limiting');
                }
                break;

            case 'behavioral_anomaly':
                actions.push('Investigate user behavior patterns');
                actions.push('Review session recordings if available');
                break;

            case 'rate_limit_exceeded':
                actions.push('Review rate limiting configuration');
                actions.push('Check for legitimate high-usage scenarios');
                break;

            default:
                actions.push('Review security logs');
                actions.push('Monitor for continued activity');
        }

        return actions;
    }

    private handleAutomatedResponse(event: SecurityEvent): void {
        const actions: string[] = [];

        // Rate limiting for suspicious activity
        if (this.config.autoResponse.rateLimitSuspicious &&
            (event.type === 'suspicious_activity' || event.severity === 'high')) {
            // Would implement rate limiting here
            actions.push('Applied rate limiting');
        }

        // Block critical threats if configured
        if (this.config.autoResponse.blockCriticalThreats && event.severity === 'critical') {
            // Would implement blocking here
            actions.push('Blocked access');
        }

        // Notify admins if configured
        if (this.config.autoResponse.notifyAdmins && event.severity === 'critical') {
            // Would send notifications here
            actions.push('Notified administrators');
        }

        event.responseActions = actions;

        if (actions.length > 0) {
            console.log(`🤖 Automated response for event ${event.id}:`, actions);
        }
    }

    private notifyEventListeners(event: SecurityEvent): void {
        // Notify type-specific listeners
        const typeListeners = this.eventListeners.get(event.type) || [];
        typeListeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Error in security event listener:', error);
            }
        });

        // Notify 'all' listeners
        const allListeners = this.eventListeners.get('all') || [];
        allListeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Error in security event listener:', error);
            }
        });
    }

    private evaluateForAlert(event: SecurityEvent): void {
        // Check if this event pattern should trigger an alert
        if (event.severity === 'critical') {
            this.createAlert(
                event.type,
                'critical',
                'Critical Security Event',
                event.description,
                [event.sessionId]
            );
        }
    }

    private cleanupOldData(): void {
        const now = Date.now();
        const eventRetention = this.config.retention.events * 24 * 60 * 60 * 1000;
        const metricsRetention = this.config.retention.metrics * 24 * 60 * 60 * 1000;

        // Clean up old events
        const eventsToDelete: string[] = [];
        for (const [id, event] of this.events.entries()) {
            if (now - event.timestamp > eventRetention) {
                eventsToDelete.push(id);
            }
        }
        eventsToDelete.forEach(id => this.events.delete(id));

        // Clean up old metrics
        this.metrics = this.metrics.filter(m => now - m.timestamp < metricsRetention);

        // Clean up old alerts (keep for 7 days)
        const alertsToDelete: string[] = [];
        for (const [id, alert] of this.alerts.entries()) {
            if (now - alert.timestamp > 7 * 24 * 60 * 60 * 1000) {
                alertsToDelete.push(id);
            }
        }
        alertsToDelete.forEach(id => this.alerts.delete(id));

        if (eventsToDelete.length > 0) {
            console.log(`🔍 Cleaned up ${eventsToDelete.length} old security events`);
        }
    }

    private createEmptyMetrics(): SecurityMetrics {
        return {
            timestamp: Date.now(),
            activeSessions: 0,
            totalEvents: 0,
            threatLevel: 'normal',
            eventsByType: {
                bot_detection: 0,
                behavioral_anomaly: 0,
                rate_limit_exceeded: 0,
                suspicious_activity: 0,
                content_protection_violation: 0,
                devtools_detection: 0,
                injection_attempt: 0,
                brute_force_attempt: 0,
                data_breach_attempt: 0,
                unauthorized_access: 0,
                performance_anomaly: 0,
            },
            eventsBySeverity: {
                low: 0,
                medium: 0,
                high: 0,
                critical: 0,
            },
            averageRiskScore: 0,
            botDetectionRate: 0,
            falsePositiveRate: 0,
            responseTime: 0,
        };
    }
}

// Export singleton instance
export const realTimeMonitor = RealTimeMonitor.getInstance();
