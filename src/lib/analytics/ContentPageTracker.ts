/**
 * Content Page Session Tracking Service
 * 
 * Tracks user interactions on content pages (warenkorb, kontakt, dein-nest, entwurf, nest-system)
 * for analytics and conversion optimization.
 * 
 * Features:
 * - Page visit tracking with time spent
 * - Section-based interaction tracking
 * - Form interaction monitoring
 * - Conversion funnel analysis
 * - Performance monitoring
 */

import { SessionManager } from '@/lib/redis';

export interface ContentPageSession {
    sessionId: string;
    pageType: 'warenkorb' | 'kontakt' | 'dein-nest' | 'entwurf' | 'nest-system' | 'warum-wir';
    startTime: number;
    endTime?: number;
    currentSection?: string;
    interactions: ContentInteraction[];
    deviceInfo: {
        type: 'mobile' | 'tablet' | 'desktop';
        width: number;
        height: number;
    };
    source: {
        referrer?: string;
        utmSource?: string;
        utmMedium?: string;
        utmCampaign?: string;
    };
}

export interface ContentInteraction {
    id: string;
    timestamp: number;
    type: 'click' | 'hover' | 'scroll' | 'form_start' | 'form_submit' | 'section_view' | 'cta_click';
    elementId: string;
    elementType: 'button' | 'link' | 'form' | 'section' | 'input' | 'cta';
    value?: string;
    context: {
        sectionId?: string;
        sectionTitle?: string;
        timeInSection?: number;
        scrollPosition?: number;
        formField?: string;
    };
}

export interface ContentAnalytics {
    pageType: string;
    totalVisits: number;
    averageTimeSpent: number;
    bounceRate: number;
    mostPopularSections: Array<{ sectionId: string; views: number; averageTime: number }>;
    conversionPoints: Array<{ elementId: string; clicks: number; conversionRate: number }>;
    formAnalytics: {
        starts: number;
        completions: number;
        abandonmentPoints: Array<{ field: string; abandonmentRate: number }>;
    };
}

export class ContentPageTracker {
    private static sessions = new Map<string, ContentPageSession>();
    private static readonly ANALYTICS_KEY_PREFIX = 'content_analytics:';
    private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    /**
     * Initialize content page session
     */
    static async initializeSession(
        sessionId: string,
        pageType: ContentPageSession['pageType'],
        deviceInfo: ContentPageSession['deviceInfo'],
        source: ContentPageSession['source']
    ): Promise<ContentPageSession> {
        console.log(`📊 Initializing content session: ${pageType} [${sessionId}]`);

        const session: ContentPageSession = {
            sessionId,
            pageType,
            startTime: Date.now(),
            interactions: [],
            deviceInfo,
            source,
        };

        // Store in memory for real-time access
        this.sessions.set(sessionId, session);

        // Store in Redis for persistence
        await SessionManager.setContentSession(sessionId, session);

        // Track page visit analytics
        await this.trackPageVisit(pageType, deviceInfo, source);

        return session;
    }

    /**
     * Track user interaction on content page
     */
    static async trackInteraction(
        sessionId: string,
        interaction: Omit<ContentInteraction, 'id' | 'timestamp'>
    ): Promise<void> {
        const session = this.sessions.get(sessionId) || await SessionManager.getContentSession(sessionId) as ContentPageSession;
        if (!session) {
            console.warn(`⚠️ No session found for interaction tracking: ${sessionId}`);
            return;
        }

        const fullInteraction: ContentInteraction = {
            id: `${sessionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            ...interaction,
        };

        session.interactions.push(fullInteraction);
        this.sessions.set(sessionId, session);

        // Update Redis
        await SessionManager.updateContentSession(sessionId, session);

        // Send to database for analytics (non-blocking)
        this.sendToDatabase(sessionId, fullInteraction).catch(error => {
            console.warn('⚠️ Failed to store interaction in database:', error);
        });

        console.log(`📊 Tracked ${interaction.type} on ${session.pageType}: ${interaction.elementId}`);
    }

    /**
     * Track section view with timing
     */
    static async trackSectionView(
        sessionId: string,
        sectionId: string,
        sectionTitle: string,
        timeSpentInPreviousSection?: number
    ): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (!session) return;

        // Update current section
        session.currentSection = sectionId;

        await this.trackInteraction(sessionId, {
            type: 'section_view',
            elementId: sectionId,
            elementType: 'section',
            context: {
                sectionId,
                sectionTitle,
                timeInSection: timeSpentInPreviousSection,
            },
        });
    }

    /**
     * Track form interactions
     */
    static async trackFormInteraction(
        sessionId: string,
        formId: string,
        action: 'start' | 'submit' | 'abandon',
        fieldName?: string,
        _value?: string
    ): Promise<void> {
        const interactionType = action === 'start' ? 'form_start' : 'form_submit';

        await this.trackInteraction(sessionId, {
            type: interactionType,
            elementId: formId,
            elementType: 'form',
            value: action,
            context: {
                formField: fieldName,
            },
        });

        // Track form analytics
        await this.updateFormAnalytics(sessionId, action, fieldName);
    }

    /**
     * Track CTA clicks with conversion context
     */
    static async trackCTAClick(
        sessionId: string,
        ctaId: string,
        ctaText: string,
        targetUrl: string,
        sectionId?: string
    ): Promise<void> {
        await this.trackInteraction(sessionId, {
            type: 'cta_click',
            elementId: ctaId,
            elementType: 'cta',
            value: targetUrl,
            context: {
                sectionId,
                sectionTitle: ctaText,
            },
        });

        // Track conversion analytics
        await this.updateConversionAnalytics(sessionId, ctaId, targetUrl);
    }

    /**
     * Finalize session when user leaves page
     */
    static async finalizeSession(sessionId: string): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (!session) return;

        session.endTime = Date.now();
        const sessionDuration = session.endTime - session.startTime;

        console.log(`📊 Finalizing content session: ${session.pageType} [${sessionDuration}ms]`);

        // Final update to Redis
        await SessionManager.updateContentSession(sessionId, session);

        // Send complete session to database
        await this.sendSessionToDatabase(session);

        // Update analytics
        await this.updateSessionAnalytics(session);

        // Clean up memory
        this.sessions.delete(sessionId);
    }

    /**
     * Get analytics for a specific page type
     */
    static async getPageAnalytics(pageType: string, timeRange = '30d'): Promise<ContentAnalytics> {
        const cacheKey = `${this.ANALYTICS_KEY_PREFIX}${pageType}:${timeRange}`;

        // Try to get from cache first
        const cached = await SessionManager.get(cacheKey);
        if (cached && typeof cached === 'string') {
            return JSON.parse(cached);
        }

        // Calculate analytics from database
        const analytics = await this.calculatePageAnalytics(pageType, timeRange);

        // Cache for 1 hour
        await SessionManager.setex(cacheKey, 3600, JSON.stringify(analytics));

        return analytics;
    }

    /**
     * Get real-time session data
     */
    static async getRealTimeData(): Promise<{
        activeSessions: number;
        pageDistribution: Record<string, number>;
        currentInteractions: number;
    }> {
        const activeSessions = this.sessions.size;
        const pageDistribution: Record<string, number> = {};
        let totalInteractions = 0;

        for (const session of this.sessions.values()) {
            pageDistribution[session.pageType] = (pageDistribution[session.pageType] || 0) + 1;
            totalInteractions += session.interactions.length;
        }

        return {
            activeSessions,
            pageDistribution,
            currentInteractions: totalInteractions,
        };
    }

    /**
     * Private helper methods
     */
    private static async trackPageVisit(
        pageType: string,
        _deviceInfo: ContentPageSession['deviceInfo'],
        _source: ContentPageSession['source']
    ): Promise<void> {
        const today = new Date().toISOString().split('T')[0];
        const visitKey = `page_visits:${pageType}:${today}`;

        // Increment daily visit counter
        await SessionManager.incr(visitKey);
        await SessionManager.expire(visitKey, 7 * 24 * 3600); // Keep for 7 days
    }

    private static async sendToDatabase(
        sessionId: string,
        interaction: ContentInteraction
    ): Promise<void> {
        try {
            await fetch('/api/sessions/track-interaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    interaction: {
                        eventType: interaction.type,
                        category: 'content_page',
                        elementId: interaction.elementId,
                        selectionValue: interaction.value,
                        timeSpent: interaction.context.timeInSection,
                        additionalData: interaction.context,
                    },
                }),
            });
        } catch (error) {
            console.warn('Failed to send interaction to database:', error);
        }
    }

    private static async sendSessionToDatabase(session: ContentPageSession): Promise<void> {
        try {
            await fetch('/api/sessions/finalize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: session.sessionId,
                    pageType: session.pageType,
                    startTime: new Date(session.startTime),
                    endTime: session.endTime ? new Date(session.endTime) : null,
                    totalInteractions: session.interactions.length,
                    deviceInfo: session.deviceInfo,
                    source: session.source,
                    sessionData: {
                        interactions: session.interactions,
                        sections: this.extractSectionData(session),
                        conversions: this.extractConversionData(session),
                    },
                }),
            });
        } catch (error) {
            console.warn('Failed to send session to database:', error);
        }
    }

    private static async updateFormAnalytics(
        sessionId: string,
        action: string,
        fieldName?: string
    ): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (!session) return;

        const analyticsKey = `form_analytics:${session.pageType}`;
        const analytics = await SessionManager.hgetall(analyticsKey) || {};

        switch (action) {
            case 'start':
                analytics.starts = (parseInt(analytics.starts || '0') + 1).toString();
                break;
            case 'submit':
                analytics.completions = (parseInt(analytics.completions || '0') + 1).toString();
                break;
            case 'abandon':
                if (fieldName) {
                    const abandonKey = `abandon_${fieldName}`;
                    analytics[abandonKey] = (parseInt(analytics[abandonKey] || '0') + 1).toString();
                }
                break;
        }

        await SessionManager.hmset(analyticsKey, analytics);
        await SessionManager.expire(analyticsKey, 7 * 24 * 3600);
    }

    private static async updateConversionAnalytics(
        sessionId: string,
        ctaId: string,
        _targetUrl: string
    ): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (!session) return;

        const conversionKey = `conversions:${session.pageType}:${ctaId}`;
        await SessionManager.incr(conversionKey);
        await SessionManager.expire(conversionKey, 30 * 24 * 3600); // Keep for 30 days
    }

    private static async updateSessionAnalytics(session: ContentPageSession): Promise<void> {
        const duration = (session.endTime || Date.now()) - session.startTime;
        const analyticsKey = `session_analytics:${session.pageType}`;

        const analytics = await SessionManager.hgetall(analyticsKey) || {};

        analytics.total_sessions = (parseInt(analytics.total_sessions || '0') + 1).toString();
        analytics.total_duration = (parseInt(analytics.total_duration || '0') + duration).toString();

        // Calculate bounce rate (less than 30 seconds or no interactions)
        const isBounce = duration < 30000 || session.interactions.length <= 1;
        if (isBounce) {
            analytics.bounces = (parseInt(analytics.bounces || '0') + 1).toString();
        }

        await SessionManager.hmset(analyticsKey, analytics);
        await SessionManager.expire(analyticsKey, 30 * 24 * 3600);
    }

    private static async calculatePageAnalytics(
        pageType: string,
        _timeRange: string
    ): Promise<ContentAnalytics> {
        // This would typically query the database
        // For now, return from Redis analytics
        const analyticsKey = `session_analytics:${pageType}`;
        const analytics = await SessionManager.hgetall(analyticsKey) || {};

        const totalSessions = parseInt(analytics.total_sessions || '0');
        const totalDuration = parseInt(analytics.total_duration || '0');
        const bounces = parseInt(analytics.bounces || '0');

        return {
            pageType,
            totalVisits: totalSessions,
            averageTimeSpent: totalSessions > 0 ? totalDuration / totalSessions : 0,
            bounceRate: totalSessions > 0 ? (bounces / totalSessions) * 100 : 0,
            mostPopularSections: [], // Would be calculated from database
            conversionPoints: [], // Would be calculated from database
            formAnalytics: {
                starts: parseInt(analytics.form_starts || '0'),
                completions: parseInt(analytics.form_completions || '0'),
                abandonmentPoints: [], // Would be calculated from database
            },
        };
    }

    private static extractSectionData(session: ContentPageSession) {
        const sectionInteractions = session.interactions.filter(i => i.type === 'section_view');
        return sectionInteractions.map(i => ({
            sectionId: i.elementId,
            timestamp: i.timestamp,
            timeSpent: i.context.timeInSection || 0,
        }));
    }

    private static extractConversionData(session: ContentPageSession) {
        const conversionInteractions = session.interactions.filter(i => i.type === 'cta_click');
        return conversionInteractions.map(i => ({
            ctaId: i.elementId,
            targetUrl: i.value,
            timestamp: i.timestamp,
            sectionId: i.context.sectionId,
        }));
    }

    /**
     * Clean up old sessions
     */
    static cleanup(): void {
        const now = Date.now();

        for (const [sessionId, session] of this.sessions.entries()) {
            const age = now - session.startTime;
            if (age > this.SESSION_TIMEOUT) {
                this.finalizeSession(sessionId);
            }
        }
    }
}

// Cleanup old sessions every 10 minutes
setInterval(() => {
    ContentPageTracker.cleanup();
}, 10 * 60 * 1000); 