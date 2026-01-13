/**
 * Usage Alerts Service
 * 
 * Monitors service capacity and sends alerts when limits are approached
 * Integrates with email service to notify admins proactively
 */

import { UsageMonitor, type Warning } from './UsageMonitor';

export interface AlertConfig {
    enabled: boolean;
    thresholds: {
        warning: number; // Percentage (default: 70%)
        critical: number; // Percentage (default: 90%)
    };
    emailRecipients: string[];
    checkInterval: number; // Minutes (default: 60)
}

const defaultConfig: AlertConfig = {
    enabled: true,
    thresholds: {
        warning: 70,
        critical: 90,
    },
    emailRecipients: ['admin@hoam-house.com'], // Configure in production
    checkInterval: 60, // Check every hour
};

/**
 * Usage Alerts - Proactive capacity monitoring
 */
export class UsageAlerts {
    private static config: AlertConfig = defaultConfig;
    private static lastAlertTime: Record<string, number> = {};
    private static readonly ALERT_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

    /**
     * Configure alert system
     */
    static configure(config: Partial<AlertConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * Check usage and send alerts if needed
     */
    static async checkAndAlert(): Promise<{ checked: boolean; warnings: Warning[]; alertsSent: number }> {
        if (!this.config.enabled) {
            return { checked: false, warnings: [], alertsSent: 0 };
        }

        try {
            // Get current usage
            const warnings = await UsageMonitor.checkCapacityWarnings();

            if (warnings.length === 0) {
                console.log('✅ All services within capacity limits');
                return { checked: true, warnings: [], alertsSent: 0 };
            }

            // Filter warnings that need alerts
            const warningsNeedingAlerts = warnings.filter((warning) =>
                this.shouldSendAlert(warning)
            );

            if (warningsNeedingAlerts.length === 0) {
                console.log(`⚠️  ${warnings.length} warnings found, but all in cooldown period`);
                return { checked: true, warnings, alertsSent: 0 };
            }

            // Send alerts for critical warnings
            let alertsSent = 0;
            for (const warning of warningsNeedingAlerts) {
                const sent = await this.sendAlert(warning);
                if (sent) {
                    alertsSent++;
                    this.recordAlertSent(warning.service);
                }
            }

            console.log(`📧 Sent ${alertsSent} capacity alerts`);
            return { checked: true, warnings, alertsSent };
        } catch (error) {
            console.error('❌ Failed to check and alert:', error);
            return { checked: false, warnings: [], alertsSent: 0 };
        }
    }

    /**
     * Send alert for a specific warning
     */
    private static async sendAlert(warning: Warning): Promise<boolean> {
        try {
            const subject = this.getAlertSubject(warning);
            const body = this.getAlertBody(warning);

            console.log(`📧 Sending ${warning.level} alert for ${warning.service}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body: ${body}`);

            // In production, integrate with Resend:
            // await sendEmail({
            //   to: this.config.emailRecipients,
            //   subject,
            //   html: body,
            // });

            return true;
        } catch (error) {
            console.error(`Failed to send alert for ${warning.service}:`, error);
            return false;
        }
    }

    /**
     * Check if alert should be sent (respects cooldown period)
     */
    private static shouldSendAlert(warning: Warning): boolean {
        const lastAlert = this.lastAlertTime[warning.service];

        if (!lastAlert) {
            return true; // Never sent before
        }

        const timeSinceLastAlert = Date.now() - lastAlert;
        return timeSinceLastAlert >= this.ALERT_COOLDOWN;
    }

    /**
     * Record that an alert was sent
     */
    private static recordAlertSent(service: string): void {
        this.lastAlertTime[service] = Date.now();
    }

    /**
     * Generate alert subject line
     */
    private static getAlertSubject(warning: Warning): string {
        const emoji = warning.level === 'critical' ? '🚨' : '⚠️';
        return `${emoji} NEST-Haus: ${warning.service} at ${warning.percentage}%`;
    }

    /**
     * Generate alert email body
     */
    private static getAlertBody(warning: Warning): string {
        const urgency = warning.level === 'critical'
            ? 'CRITICAL - Immediate action required'
            : 'WARNING - Action recommended soon';

        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${warning.level === 'critical' ? '#dc2626' : '#f59e0b'};">
          ${warning.level === 'critical' ? '🚨' : '⚠️'} Service Capacity Alert
        </h2>
        
        <p><strong>Urgency:</strong> ${urgency}</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Service:</strong> ${warning.service}</p>
          <p style="margin: 10px 0 0 0;"><strong>Capacity:</strong> ${warning.percentage}%</p>
        </div>
        
        <h3>Issue:</h3>
        <p>${warning.message}</p>
        
        <h3>Recommendation:</h3>
        <p>${warning.recommendation}</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <p style="font-size: 14px; color: #6b7280;">
          <strong>What to do:</strong><br>
          1. Check the admin dashboard at /admin/usage<br>
          2. Review current usage trends<br>
          3. Take action based on the recommendation above<br>
          4. Monitor the service closely over the next 24-48 hours
        </p>
        
        <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
          This is an automated alert from NEST-Haus Usage Monitoring System.<br>
          Sent: ${new Date().toLocaleString('de-AT', {
            dateStyle: 'full',
            timeStyle: 'short'
        })}
        </p>
      </div>
    `;
    }

    /**
     * Get alert history (for debugging)
     */
    static getAlertHistory(): Record<string, string> {
        const history: Record<string, string> = {};

        for (const [service, timestamp] of Object.entries(this.lastAlertTime)) {
            const date = new Date(timestamp);
            history[service] = date.toLocaleString('de-AT', {
                dateStyle: 'medium',
                timeStyle: 'short',
            });
        }

        return history;
    }

    /**
     * Reset alert cooldowns (for testing)
     */
    static resetAlertCooldowns(): void {
        this.lastAlertTime = {};
        console.log('🔄 Alert cooldowns reset');
    }

    /**
     * Manual check with console output (for admin dashboard)
     */
    static async performManualCheck(): Promise<{
        timestamp: string;
        warnings: Warning[];
        alertsEnabled: boolean;
        nextAutoCheck: string;
    }> {
        const warnings = await UsageMonitor.checkCapacityWarnings();
        const nextCheck = new Date(Date.now() + this.config.checkInterval * 60 * 1000);

        return {
            timestamp: new Date().toISOString(),
            warnings,
            alertsEnabled: this.config.enabled,
            nextAutoCheck: nextCheck.toISOString(),
        };
    }
}

