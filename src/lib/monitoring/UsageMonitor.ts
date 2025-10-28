/**
 * Usage Monitor Service
 * 
 * Tracks service limits and usage across all infrastructure components:
 * - Rate limiting (SecurityMiddleware)
 * - PostgreSQL database (Prisma)
 * - Redis (Upstash)
 * - Email service (Resend)
 * - Blob storage (Vercel)
 * 
 * Provides real-time capacity monitoring for admin dashboard
 */

import { prisma } from '@/lib/prisma';

// Type definitions for usage metrics
export interface RateLimitInfo {
    current: number;
    limit: number;
    resetTime: number;
    percentage: number;
    window: string; // e.g., "15 minutes"
}

export interface DatabaseInfo {
    records: {
        sessions: number;
        selectionEvents: number;
        interactionEvents: number;
        configurations: number;
        total: number;
    };
    storage: number; // MB
    connections: number;
    limit: {
        records: number; // Estimated max before performance degrades
        storage: number; // MB
        connections: number;
    };
    percentage: number;
}

export interface RedisInfo {
    commands: number; // Estimated today's usage
    storage: number; // MB
    limit: {
        commands: number; // Daily limit
        storage: number; // MB
    };
    percentage: number;
}

export interface EmailInfo {
    sent: number; // This month
    limit: {
        daily: number;
        monthly: number;
    };
    percentage: number;
}

export interface StorageInfo {
    used: number; // GB
    limit: number; // GB
    percentage: number;
}

export interface ServiceLimits {
    rateLimit: RateLimitInfo;
    database: DatabaseInfo;
    redis: RedisInfo;
    email: EmailInfo;
    storage: StorageInfo;
    warnings: Warning[];
    timestamp: string;
}

export interface Warning {
    service: string;
    level: 'warning' | 'critical'; // warning = 70-90%, critical = >90%
    percentage: number;
    message: string;
    recommendation: string;
}

/**
 * Usage Monitor - Tracks capacity across all services
 */
export class UsageMonitor {
    // Service limits configuration
    private static readonly LIMITS = {
        database: {
            storage: 512, // MB (free tier)
            connections: 60,
            records: 100000, // Estimated max for good performance
        },
        redis: {
            commands: 10000, // Per day (free tier)
            storage: 256, // MB
        },
        email: {
            daily: 100, // Free tier
            monthly: 3000, // Free tier
        },
        storage: {
            total: 100, // GB (Hobby plan)
        },
        rateLimit: {
            ipBased: 300, // Per 15 min
            sessionBased: 200, // Per 15 min
            windowMs: 15 * 60 * 1000,
        },
    };

    /**
     * Get current rate limit usage
     * Note: This reads from SecurityMiddleware's in-memory store
     */
    static async getRateLimitUsage(): Promise<RateLimitInfo> {
        // For now, return estimated usage since rateLimitStore is in-memory
        // In production, this should read from Redis or shared state

        const now = Date.now();
        const resetTime = now + (15 * 60 * 1000); // 15 minutes from now

        // Estimate current usage based on active sessions
        const activeSessions = await this.getActiveSessionCount();
        const estimated = Math.min(activeSessions * 5, this.LIMITS.rateLimit.ipBased); // ~5 requests per session

        return {
            current: estimated,
            limit: this.LIMITS.rateLimit.ipBased,
            resetTime,
            percentage: (estimated / this.LIMITS.rateLimit.ipBased) * 100,
            window: "15 minutes",
        };
    }

    /**
     * Get database metrics from Prisma
     */
    static async getDatabaseUsage(): Promise<DatabaseInfo> {
        try {
            // Get record counts in parallel (removed configurationSnapshot)
            const [sessionCount, eventCount, interactionCount] = await Promise.all([
                prisma.userSession.count(),
                prisma.selectionEvent.count(),
                prisma.interactionEvent.count(),
            ]);

            const totalRecords = sessionCount + eventCount + interactionCount;

            // Estimate storage: ~1KB per record average
            const estimatedMB = totalRecords / 1000;

            // Get active connections (estimated)
            const activeConnections = 5; // Typical for small app

            return {
                records: {
                    sessions: sessionCount,
                    selectionEvents: eventCount,
                    interactionEvents: interactionCount,
                    total: totalRecords,
                },
                storage: Math.round(estimatedMB * 10) / 10, // Round to 1 decimal
                connections: activeConnections,
                limit: this.LIMITS.database,
                percentage: (estimatedMB / this.LIMITS.database.storage) * 100,
            };
        } catch (error) {
            console.error('Failed to get database usage:', error);
            return {
                records: { sessions: 0, selectionEvents: 0, interactionEvents: 0, configurations: 0, total: 0 },
                storage: 0,
                connections: 0,
                limit: this.LIMITS.database,
                percentage: 0,
            };
        }
    }

    /**
     * Get Redis usage metrics
     * Note: Upstash provides usage stats via their dashboard
     * This provides estimated local tracking
     */
    static async getRedisUsage(): Promise<RedisInfo> {
        try {
            // Estimate commands based on active sessions
            const activeSessions = await this.getActiveSessionCount();
            const estimatedCommands = activeSessions * 10; // ~10 commands per session per day

            // Estimate storage based on session count
            const estimatedStorageMB = (activeSessions * 2) / 1000; // ~2KB per session

            return {
                commands: estimatedCommands,
                storage: Math.round(estimatedStorageMB * 10) / 10,
                limit: this.LIMITS.redis,
                percentage: (estimatedCommands / this.LIMITS.redis.commands) * 100,
            };
        } catch (error) {
            console.error('Failed to get Redis usage:', error);
            return {
                commands: 0,
                storage: 0,
                limit: this.LIMITS.redis,
                percentage: 0,
            };
        }
    }

    /**
     * Get email service usage
     * Note: Resend provides usage stats via API
     * This provides estimated local tracking
     */
    static async getEmailUsage(): Promise<EmailInfo> {
        try {
            // Get count of customer inquiries this month as proxy for emails sent
            const firstDayOfMonth = new Date();
            firstDayOfMonth.setDate(1);
            firstDayOfMonth.setHours(0, 0, 0, 0);

            const inquiryCount = await prisma.customerInquiry.count({
                where: {
                    createdAt: {
                        gte: firstDayOfMonth,
                    },
                },
            });

            // Each inquiry typically sends 2-3 emails (confirmation + admin notification)
            const estimatedEmails = inquiryCount * 2.5;

            return {
                sent: Math.round(estimatedEmails),
                limit: this.LIMITS.email,
                percentage: (estimatedEmails / this.LIMITS.email.monthly) * 100,
            };
        } catch (error) {
            console.error('Failed to get email usage:', error);
            return {
                sent: 0,
                limit: this.LIMITS.email,
                percentage: 0,
            };
        }
    }

    /**
     * Get blob storage usage
     * Note: Vercel provides usage stats via dashboard
     * This provides estimated tracking
     */
    static async getStorageUsage(): Promise<StorageInfo> {
        // Current images: ~50MB
        // For beta, minimal growth expected
        const estimatedGB = 0.05; // 50MB = 0.05GB

        return {
            used: estimatedGB,
            limit: this.LIMITS.storage.total,
            percentage: (estimatedGB / this.LIMITS.storage.total) * 100,
        };
    }

    /**
     * Get comprehensive usage report for all services
     */
    static async getUsageReport(): Promise<ServiceLimits> {
        const [rateLimit, database, redis, email, storage] = await Promise.all([
            this.getRateLimitUsage(),
            this.getDatabaseUsage(),
            this.getRedisUsage(),
            this.getEmailUsage(),
            this.getStorageUsage(),
        ]);

        const warnings = this.generateWarnings({
            rateLimit,
            database,
            redis,
            email,
            storage,
        });

        return {
            rateLimit,
            database,
            redis,
            email,
            storage,
            warnings,
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Check if any service is approaching capacity (>70%)
     */
    static async checkCapacityWarnings(): Promise<Warning[]> {
        const report = await this.getUsageReport();
        return report.warnings;
    }

    /**
     * Generate warnings for services approaching capacity
     */
    private static generateWarnings(services: Omit<ServiceLimits, 'warnings' | 'timestamp'>): Warning[] {
        const warnings: Warning[] = [];

        // Check each service
        const checks = [
            {
                name: 'Rate Limiting',
                percentage: services.rateLimit.percentage,
                recommendation: 'Consider implementing request caching or upgrading rate limits',
            },
            {
                name: 'Database Storage',
                percentage: services.database.percentage,
                recommendation: 'Upgrade to paid tier (8GB for €5/mo) or implement data archival',
            },
            {
                name: 'Redis Commands',
                percentage: services.redis.percentage,
                recommendation: 'Optimize Redis usage or upgrade to paid tier (100k commands/day)',
            },
            {
                name: 'Email Service',
                percentage: services.email.percentage,
                recommendation: 'Upgrade Resend plan or implement email batching',
            },
            {
                name: 'Blob Storage',
                percentage: services.storage.percentage,
                recommendation: 'Storage capacity is high, no immediate action needed',
            },
        ];

        for (const check of checks) {
            if (check.percentage >= 90) {
                warnings.push({
                    service: check.name,
                    level: 'critical',
                    percentage: Math.round(check.percentage),
                    message: `${check.name} is at critical capacity (${Math.round(check.percentage)}%)`,
                    recommendation: check.recommendation,
                });
            } else if (check.percentage >= 70) {
                warnings.push({
                    service: check.name,
                    level: 'warning',
                    percentage: Math.round(check.percentage),
                    message: `${check.name} is approaching capacity (${Math.round(check.percentage)}%)`,
                    recommendation: check.recommendation,
                });
            }
        }

        return warnings;
    }

    /**
     * Helper: Get count of active sessions (last 24 hours)
     */
    private static async getActiveSessionCount(): Promise<number> {
        try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            return await prisma.userSession.count({
                where: {
                    lastActivity: {
                        gte: yesterday,
                    },
                },
            });
        } catch (error) {
            console.error('Failed to get active session count:', error);
            return 0;
        }
    }
}

