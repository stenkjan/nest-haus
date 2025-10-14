/**
 * Bot Detection System
 * 
 * Advanced bot detection using multiple detection methods:
 * - Headless browser detection
 * - Automation tool detection (Selenium, Puppeteer, etc.)
 * - Behavioral pattern analysis
 * - Browser fingerprinting
 * - Network pattern analysis
 */

import { BehavioralAnalyzer, type BehaviorAnalysis } from './BehavioralAnalyzer';

export interface BotDetectionConfig {
    enabled: boolean;
    strictMode: boolean; // More aggressive detection
    blockOnDetection: boolean;
    logDetections: boolean;
    notifyOnDetection: boolean;
    whitelistedUserAgents: string[];
    blacklistedUserAgents: string[];
}

export interface BotDetectionResult {
    isBot: boolean;
    confidence: number; // 0-1
    detectionMethods: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    allowAccess: boolean;
    reasons: string[];
}

export interface BrowserFingerprint {
    userAgent: string;
    platform: string;
    language: string;
    timezone: string;
    screenResolution: string;
    colorDepth: number;
    hardwareConcurrency: number;
    deviceMemory?: number;
    webDriver: boolean;
    phantom: boolean;
    selenium: boolean;
    puppeteer: boolean;
    headless: boolean;
    plugins: string[];
    webgl: string;
    canvas: string;
}

export class BotDetector {
    private static instance: BotDetector | null = null;
    private config: BotDetectionConfig;
    private detectionHistory = new Map<string, BotDetectionResult[]>();
    private behavioralAnalyzer: BehavioralAnalyzer;

    private static readonly DEFAULT_CONFIG: BotDetectionConfig = {
        enabled: true,
        strictMode: false,
        blockOnDetection: false,
        logDetections: true,
        notifyOnDetection: true,
        whitelistedUserAgents: [],
        blacklistedUserAgents: [
            'HeadlessChrome',
            'PhantomJS',
            'SlimerJS',
            'HtmlUnit',
            'Selenium',
            'WebDriver',
            'bot',
            'crawler',
            'spider',
        ],
    };

    // Known bot indicators
    private static readonly BOT_INDICATORS = {
        // Headless browser indicators
        HEADLESS_CHROME: /HeadlessChrome/i,
        PHANTOM_JS: /PhantomJS/i,
        SELENIUM: /selenium|webdriver/i,
        PUPPETEER: /puppeteer/i,

        // Automation tools
        AUTOMATION_TOOLS: /automation|automated|bot|crawler|spider|scraper/i,

        // Suspicious user agents
        SUSPICIOUS_UA: /^Mozilla\/5\.0$/,
        EMPTY_UA: /^$/,

        // Known bot patterns
        BOT_PATTERNS: [
            /googlebot/i,
            /bingbot/i,
            /slurp/i,
            /duckduckbot/i,
            /baiduspider/i,
            /yandexbot/i,
            /facebookexternalhit/i,
            /twitterbot/i,
            /linkedinbot/i,
            /whatsapp/i,
            /telegram/i,
        ],
    };

    private constructor(config: Partial<BotDetectionConfig> = {}) {
        this.config = { ...BotDetector.DEFAULT_CONFIG, ...config };
        this.behavioralAnalyzer = BehavioralAnalyzer.getInstance();
    }

    static getInstance(config: Partial<BotDetectionConfig> = {}): BotDetector {
        if (!BotDetector.instance) {
            BotDetector.instance = new BotDetector(config);
        }
        return BotDetector.instance;
    }

    /**
     * Perform comprehensive bot detection
     */
    async detectBot(
        sessionId: string,
        userAgent: string,
        fingerprint?: Partial<BrowserFingerprint>,
        ipAddress?: string
    ): Promise<BotDetectionResult> {
        if (!this.config.enabled) {
            return this.createAllowResult('Bot detection disabled');
        }

        console.log(`🤖 Running bot detection for session: ${sessionId}`);

        const detectionMethods: string[] = [];
        const reasons: string[] = [];
        let botScore = 0;
        let maxConfidence = 0;

        // 1. User Agent Analysis
        const uaResult = this.analyzeUserAgent(userAgent);
        if (uaResult.isBot) {
            detectionMethods.push('User-Agent Analysis');
            reasons.push(...uaResult.reasons);
            botScore += uaResult.confidence * 0.3;
            maxConfidence = Math.max(maxConfidence, uaResult.confidence);
        }

        // 2. Browser Fingerprint Analysis
        if (fingerprint) {
            const fpResult = this.analyzeBrowserFingerprint(fingerprint);
            if (fpResult.isBot) {
                detectionMethods.push('Browser Fingerprint');
                reasons.push(...fpResult.reasons);
                botScore += fpResult.confidence * 0.4;
                maxConfidence = Math.max(maxConfidence, fpResult.confidence);
            }
        }

        // 3. Behavioral Analysis
        const behaviorAnalysis = this.behavioralAnalyzer.analyzeBehavior(sessionId);
        if (behaviorAnalysis.botProbability > 0.6) {
            detectionMethods.push('Behavioral Analysis');
            reasons.push(`Bot probability: ${Math.round(behaviorAnalysis.botProbability * 100)}%`);
            reasons.push(...behaviorAnalysis.anomalies);
            botScore += behaviorAnalysis.botProbability * 0.5;
            maxConfidence = Math.max(maxConfidence, behaviorAnalysis.confidence);
        }

        // 4. Network Pattern Analysis
        if (ipAddress) {
            const networkResult = await this.analyzeNetworkPatterns(ipAddress);
            if (networkResult.isBot) {
                detectionMethods.push('Network Analysis');
                reasons.push(...networkResult.reasons);
                botScore += networkResult.confidence * 0.2;
                maxConfidence = Math.max(maxConfidence, networkResult.confidence);
            }
        }

        // 5. Timing Analysis
        const timingResult = this.analyzeTimingPatterns(sessionId);
        if (timingResult.isBot) {
            detectionMethods.push('Timing Analysis');
            reasons.push(...timingResult.reasons);
            botScore += timingResult.confidence * 0.3;
            maxConfidence = Math.max(maxConfidence, timingResult.confidence);
        }

        // Calculate final scores
        const isBot = this.config.strictMode ? botScore > 0.4 : botScore > 0.6;
        const confidence = Math.min(1, maxConfidence);
        const riskLevel = this.determineRiskLevel(botScore, confidence);
        const allowAccess = this.shouldAllowAccess(isBot, riskLevel, userAgent);

        const result: BotDetectionResult = {
            isBot,
            confidence,
            detectionMethods,
            riskLevel,
            allowAccess,
            reasons: reasons.slice(0, 10), // Limit reasons for performance
        };

        // Store detection history
        const history = this.detectionHistory.get(sessionId) || [];
        history.push(result);
        this.detectionHistory.set(sessionId, history);

        // Log detection if enabled
        if (this.config.logDetections && isBot) {
            console.warn(`🤖 Bot detected for session ${sessionId}:`, {
                confidence: Math.round(confidence * 100) + '%',
                methods: detectionMethods,
                riskLevel,
                allowAccess,
            });
        }

        return result;
    }

    /**
     * Analyze User Agent for bot indicators
     */
    private analyzeUserAgent(userAgent: string): {
        isBot: boolean;
        confidence: number;
        reasons: string[];
    } {
        const reasons: string[] = [];
        let confidence = 0;

        // Check for empty or suspicious user agent
        if (!userAgent || userAgent.trim().length === 0) {
            reasons.push('Empty user agent');
            confidence = 0.9;
            return { isBot: true, confidence, reasons };
        }

        // Check blacklisted user agents
        for (const blacklisted of this.config.blacklistedUserAgents) {
            if (userAgent.toLowerCase().includes(blacklisted.toLowerCase())) {
                reasons.push(`Blacklisted user agent: ${blacklisted}`);
                confidence = Math.max(confidence, 0.8);
            }
        }

        // Check whitelisted user agents
        for (const whitelisted of this.config.whitelistedUserAgents) {
            if (userAgent.toLowerCase().includes(whitelisted.toLowerCase())) {
                return { isBot: false, confidence: 0, reasons: ['Whitelisted user agent'] };
            }
        }

        // Check for headless indicators
        if (BotDetector.BOT_INDICATORS.HEADLESS_CHROME.test(userAgent)) {
            reasons.push('Headless Chrome detected');
            confidence = Math.max(confidence, 0.9);
        }

        if (BotDetector.BOT_INDICATORS.PHANTOM_JS.test(userAgent)) {
            reasons.push('PhantomJS detected');
            confidence = Math.max(confidence, 0.9);
        }

        if (BotDetector.BOT_INDICATORS.SELENIUM.test(userAgent)) {
            reasons.push('Selenium WebDriver detected');
            confidence = Math.max(confidence, 0.8);
        }

        if (BotDetector.BOT_INDICATORS.PUPPETEER.test(userAgent)) {
            reasons.push('Puppeteer detected');
            confidence = Math.max(confidence, 0.8);
        }

        // Check for automation tools
        if (BotDetector.BOT_INDICATORS.AUTOMATION_TOOLS.test(userAgent)) {
            reasons.push('Automation tool detected in user agent');
            confidence = Math.max(confidence, 0.7);
        }

        // Check for suspicious patterns
        if (BotDetector.BOT_INDICATORS.SUSPICIOUS_UA.test(userAgent)) {
            reasons.push('Suspicious user agent pattern');
            confidence = Math.max(confidence, 0.6);
        }

        // Check for known bots (but allow them)
        for (const pattern of BotDetector.BOT_INDICATORS.BOT_PATTERNS) {
            if (pattern.test(userAgent)) {
                // These are legitimate bots, allow them but log
                return { isBot: true, confidence: 0.9, reasons: ['Legitimate bot detected'] };
            }
        }

        // Check user agent structure
        if (userAgent.length < 10 || userAgent.length > 500) {
            reasons.push('Unusual user agent length');
            confidence = Math.max(confidence, 0.4);
        }

        // Check for missing common browser indicators
        if (!userAgent.includes('Mozilla') && !userAgent.includes('Chrome') &&
            !userAgent.includes('Firefox') && !userAgent.includes('Safari') &&
            !userAgent.includes('Edge')) {
            reasons.push('Missing common browser indicators');
            confidence = Math.max(confidence, 0.5);
        }

        return {
            isBot: confidence > 0.6,
            confidence,
            reasons,
        };
    }

    /**
     * Analyze browser fingerprint for bot indicators
     */
    private analyzeBrowserFingerprint(fingerprint: Partial<BrowserFingerprint>): {
        isBot: boolean;
        confidence: number;
        reasons: string[];
    } {
        const reasons: string[] = [];
        let confidence = 0;

        // Check for webdriver property
        if (fingerprint.webDriver) {
            reasons.push('WebDriver property detected');
            confidence = Math.max(confidence, 0.9);
        }

        // Check for headless indicators
        if (fingerprint.headless) {
            reasons.push('Headless browser detected');
            confidence = Math.max(confidence, 0.9);
        }

        // Check for automation tools
        if (fingerprint.phantom) {
            reasons.push('PhantomJS detected');
            confidence = Math.max(confidence, 0.9);
        }

        if (fingerprint.selenium) {
            reasons.push('Selenium detected');
            confidence = Math.max(confidence, 0.9);
        }

        if (fingerprint.puppeteer) {
            reasons.push('Puppeteer detected');
            confidence = Math.max(confidence, 0.9);
        }

        // Check for missing plugins (headless browsers often have no plugins)
        if (fingerprint.plugins && fingerprint.plugins.length === 0) {
            reasons.push('No browser plugins detected');
            confidence = Math.max(confidence, 0.4);
        }

        // Check for suspicious screen resolution
        if (fingerprint.screenResolution) {
            const [width, height] = fingerprint.screenResolution.split('x').map(Number);
            if (width === 1024 && height === 768) {
                reasons.push('Default headless screen resolution');
                confidence = Math.max(confidence, 0.5);
            }
        }

        // Check for missing hardware concurrency
        if (fingerprint.hardwareConcurrency === 1) {
            reasons.push('Single core detected (possible emulation)');
            confidence = Math.max(confidence, 0.3);
        }

        // Check for missing device memory
        if (fingerprint.deviceMemory === undefined) {
            reasons.push('Device memory not available');
            confidence = Math.max(confidence, 0.2);
        }

        // Check for suspicious timezone
        if (fingerprint.timezone && fingerprint.timezone === 'UTC') {
            reasons.push('UTC timezone (possible headless)');
            confidence = Math.max(confidence, 0.3);
        }

        // Check for missing WebGL or Canvas fingerprint
        if (!fingerprint.webgl || fingerprint.webgl.length < 10) {
            reasons.push('Missing or invalid WebGL fingerprint');
            confidence = Math.max(confidence, 0.4);
        }

        if (!fingerprint.canvas || fingerprint.canvas.length < 10) {
            reasons.push('Missing or invalid Canvas fingerprint');
            confidence = Math.max(confidence, 0.4);
        }

        return {
            isBot: confidence > 0.6,
            confidence,
            reasons,
        };
    }

    /**
     * Analyze network patterns for bot indicators
     */
    private async analyzeNetworkPatterns(ipAddress: string): Promise<{
        isBot: boolean;
        confidence: number;
        reasons: string[];
    }> {
        const reasons: string[] = [];
        let confidence = 0;

        // Check for localhost/private IPs (often used by bots)
        if (this.isPrivateIP(ipAddress)) {
            reasons.push('Private/localhost IP detected');
            confidence = Math.max(confidence, 0.3);
        }

        // Check for known bot IP ranges (would need external service)
        // This is a placeholder - in production, you'd check against bot IP databases
        if (this.isKnownBotIP(ipAddress)) {
            reasons.push('Known bot IP range');
            confidence = Math.max(confidence, 0.8);
        }

        // Check for VPN/Proxy indicators (high request rates from same IP)
        const requestCount = await this.getRecentRequestCount(ipAddress);
        if (requestCount > 100) { // Threshold for suspicious activity
            reasons.push(`High request rate: ${requestCount} requests`);
            confidence = Math.max(confidence, 0.6);
        }

        return {
            isBot: confidence > 0.6,
            confidence,
            reasons,
        };
    }

    /**
     * Analyze timing patterns for bot indicators
     */
    private analyzeTimingPatterns(sessionId: string): {
        isBot: boolean;
        confidence: number;
        reasons: string[];
    } {
        const reasons: string[] = [];
        let confidence = 0;

        const pattern = this.behavioralAnalyzer.getBehaviorPattern(sessionId);
        if (!pattern) {
            return { isBot: false, confidence: 0, reasons: ['No timing data available'] };
        }

        const sessionDuration = pattern.lastActivity - pattern.sessionStart;
        const totalActions =
            pattern.mouseMovements.length +
            pattern.keystrokes.length +
            pattern.clicks.length +
            pattern.scrollEvents.length;

        // Check for too many actions in short time
        if (sessionDuration < 5000 && totalActions > 50) {
            reasons.push('Too many actions in short time');
            confidence = Math.max(confidence, 0.7);
        }

        // Check for perfectly regular intervals
        if (pattern.clicks.length > 3) {
            const intervals = [];
            for (let i = 1; i < pattern.clicks.length; i++) {
                intervals.push(pattern.clicks[i].timestamp - pattern.clicks[i - 1].timestamp);
            }

            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const variance = intervals.reduce((sum, interval) => {
                return sum + Math.pow(interval - avgInterval, 2);
            }, 0) / intervals.length;

            if (variance < 100) { // Very consistent timing
                reasons.push('Perfectly regular click intervals');
                confidence = Math.max(confidence, 0.8);
            }
        }

        // Check for inhuman speed
        const actionsPerSecond = totalActions / (sessionDuration / 1000);
        if (actionsPerSecond > 20) {
            reasons.push(`Inhuman action rate: ${actionsPerSecond.toFixed(1)}/sec`);
            confidence = Math.max(confidence, 0.9);
        }

        return {
            isBot: confidence > 0.6,
            confidence,
            reasons,
        };
    }

    /**
     * Check if IP is private/localhost
     */
    private isPrivateIP(ip: string): boolean {
        const privateRanges = [
            /^127\./, // localhost
            /^192\.168\./, // private class C
            /^10\./, // private class A
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // private class B
            /^::1$/, // IPv6 localhost
            /^fc00:/, // IPv6 private
        ];

        return privateRanges.some(range => range.test(ip));
    }

    /**
     * Check if IP is in known bot ranges (placeholder)
     */
    private isKnownBotIP(ip: string): boolean {
        // This would typically check against external bot IP databases
        // For now, just return false
        return false;
    }

    /**
     * Get recent request count for IP (placeholder)
     */
    private async getRecentRequestCount(ipAddress: string): Promise<number> {
        // This would typically check Redis or database for recent requests
        // For now, return 0
        return 0;
    }

    /**
     * Determine risk level based on bot score and confidence
     */
    private determineRiskLevel(
        botScore: number,
        confidence: number
    ): 'low' | 'medium' | 'high' | 'critical' {
        const adjustedScore = botScore * confidence;

        if (adjustedScore >= 0.8) return 'critical';
        if (adjustedScore >= 0.6) return 'high';
        if (adjustedScore >= 0.4) return 'medium';
        return 'low';
    }

    /**
     * Determine if access should be allowed
     */
    private shouldAllowAccess(
        isBot: boolean,
        riskLevel: string,
        userAgent: string
    ): boolean {
        // Always allow legitimate bots (search engines, social media crawlers)
        for (const pattern of BotDetector.BOT_INDICATORS.BOT_PATTERNS) {
            if (pattern.test(userAgent)) {
                return true; // Allow legitimate bots
            }
        }

        // Block if configured to block on detection
        if (this.config.blockOnDetection && isBot) {
            return false;
        }

        // Block critical risk level in strict mode
        if (this.config.strictMode && riskLevel === 'critical') {
            return false;
        }

        // Default to allow (with logging)
        return true;
    }

    /**
     * Create a default "allow" result
     */
    private createAllowResult(reason: string): BotDetectionResult {
        return {
            isBot: false,
            confidence: 0,
            detectionMethods: [],
            riskLevel: 'low',
            allowAccess: true,
            reasons: [reason],
        };
    }

    /**
     * Get detection history for a session
     */
    getDetectionHistory(sessionId: string): BotDetectionResult[] {
        return this.detectionHistory.get(sessionId) || [];
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<BotDetectionConfig>): void {
        this.config = { ...this.config, ...newConfig };
        console.log('🤖 Bot detection config updated:', newConfig);
    }

    /**
     * Get current configuration
     */
    getConfig(): BotDetectionConfig {
        return { ...this.config };
    }

    /**
     * Get real-time statistics
     */
    getRealTimeStats(): {
        totalDetections: number;
        botDetections: number;
        riskDistribution: Record<string, number>;
        detectionMethods: Record<string, number>;
    } {
        let totalDetections = 0;
        let botDetections = 0;
        const riskDistribution: Record<string, number> = {
            low: 0,
            medium: 0,
            high: 0,
            critical: 0,
        };
        const detectionMethods: Record<string, number> = {};

        for (const history of this.detectionHistory.values()) {
            for (const result of history) {
                totalDetections++;
                if (result.isBot) botDetections++;
                riskDistribution[result.riskLevel]++;

                for (const method of result.detectionMethods) {
                    detectionMethods[method] = (detectionMethods[method] || 0) + 1;
                }
            }
        }

        return {
            totalDetections,
            botDetections,
            riskDistribution,
            detectionMethods,
        };
    }

    /**
     * Clean up old detection history
     */
    cleanupOldDetections(maxAge: number = 24 * 60 * 60 * 1000): void {
        // This would clean up old detection records
        // For now, just log
        console.log('🤖 Cleaning up old bot detection records');
    }
}

// Export singleton instance
export const botDetector = BotDetector.getInstance();
