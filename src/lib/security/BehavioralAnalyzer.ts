/**
 * Behavioral Analysis System
 * 
 * Analyzes user behavior patterns to detect suspicious activity,
 * bot behavior, and potential security threats.
 * 
 * Features:
 * - Mouse movement pattern analysis
 * - Keyboard timing analysis
 * - Click pattern detection
 * - Scroll behavior analysis
 * - Navigation pattern tracking
 * - Session anomaly detection
 */

export interface BehaviorPattern {
    mouseMovements: MouseMovement[];
    keystrokes: Keystroke[];
    clicks: ClickEvent[];
    scrollEvents: ScrollEvent[];
    navigationEvents: NavigationEvent[];
    sessionStart: number;
    lastActivity: number;
}

export interface MouseMovement {
    x: number;
    y: number;
    timestamp: number;
    velocity: number;
    acceleration: number;
}

export interface Keystroke {
    key: string;
    timestamp: number;
    duration: number; // Key press duration
    interval: number; // Time since last keystroke
}

export interface ClickEvent {
    x: number;
    y: number;
    timestamp: number;
    elementType: string;
    elementId?: string;
    doubleClick: boolean;
}

export interface ScrollEvent {
    deltaY: number;
    timestamp: number;
    scrollTop: number;
    velocity: number;
}

export interface NavigationEvent {
    from: string;
    to: string;
    timestamp: number;
    method: 'click' | 'keyboard' | 'programmatic';
}

export interface BehaviorAnalysis {
    suspicionScore: number; // 0-1, higher = more suspicious
    botProbability: number; // 0-1, higher = more likely bot
    humanLikelihood: number; // 0-1, higher = more likely human
    anomalies: string[];
    confidence: number; // 0-1, confidence in analysis
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export class BehavioralAnalyzer {
    private static instance: BehavioralAnalyzer | null = null;
    private behaviorPatterns = new Map<string, BehaviorPattern>();
    private analysisHistory = new Map<string, BehaviorAnalysis[]>();

    // Thresholds for anomaly detection
    private static readonly THRESHOLDS = {
        // Mouse movement thresholds
        MIN_MOUSE_MOVEMENTS: 10, // Minimum movements for human-like behavior
        MAX_VELOCITY: 2000, // Pixels per second
        MIN_VELOCITY_VARIANCE: 0.1, // Variance in velocity (bots have consistent velocity)

        // Keystroke thresholds
        MIN_KEYSTROKE_INTERVAL: 50, // Milliseconds between keystrokes
        MAX_KEYSTROKE_INTERVAL: 2000, // Maximum human typing interval
        MIN_KEYSTROKE_VARIANCE: 0.15, // Variance in typing rhythm

        // Click thresholds
        MIN_CLICK_INTERVAL: 100, // Minimum time between clicks
        MAX_CLICK_PRECISION: 5, // Pixel precision (bots click exact pixels)

        // Scroll thresholds
        MIN_SCROLL_VARIANCE: 0.2, // Variance in scroll behavior
        MAX_SCROLL_VELOCITY: 5000, // Pixels per second

        // Session thresholds
        MIN_SESSION_DURATION: 5000, // 5 seconds minimum
        MAX_ACTIONS_PER_SECOND: 10, // Maximum human actions per second
    };

    private constructor() { }

    static getInstance(): BehavioralAnalyzer {
        if (!BehavioralAnalyzer.instance) {
            BehavioralAnalyzer.instance = new BehavioralAnalyzer();
        }
        return BehavioralAnalyzer.instance;
    }

    /**
     * Initialize behavior tracking for a session
     */
    initializeSession(sessionId: string): void {
        const pattern: BehaviorPattern = {
            mouseMovements: [],
            keystrokes: [],
            clicks: [],
            scrollEvents: [],
            navigationEvents: [],
            sessionStart: Date.now(),
            lastActivity: Date.now(),
        };

        this.behaviorPatterns.set(sessionId, pattern);
        this.analysisHistory.set(sessionId, []);

        console.log(`🧠 Behavioral analysis initialized for session: ${sessionId}`);
    }

    /**
     * Track mouse movement
     */
    trackMouseMovement(sessionId: string, x: number, y: number): void {
        const pattern = this.behaviorPatterns.get(sessionId);
        if (!pattern) return;

        const timestamp = Date.now();
        const lastMovement = pattern.mouseMovements[pattern.mouseMovements.length - 1];

        let velocity = 0;
        let acceleration = 0;

        if (lastMovement) {
            const distance = Math.sqrt(
                Math.pow(x - lastMovement.x, 2) + Math.pow(y - lastMovement.y, 2)
            );
            const timeDiff = timestamp - lastMovement.timestamp;
            velocity = distance / (timeDiff || 1);

            if (pattern.mouseMovements.length > 1) {
                acceleration = (velocity - lastMovement.velocity) / (timeDiff || 1);
            }
        }

        pattern.mouseMovements.push({
            x,
            y,
            timestamp,
            velocity,
            acceleration,
        });

        // Keep only last 100 movements for performance
        if (pattern.mouseMovements.length > 100) {
            pattern.mouseMovements.shift();
        }

        pattern.lastActivity = timestamp;
    }

    /**
     * Track keystroke
     */
    trackKeystroke(sessionId: string, key: string, duration: number): void {
        const pattern = this.behaviorPatterns.get(sessionId);
        if (!pattern) return;

        const timestamp = Date.now();
        const lastKeystroke = pattern.keystrokes[pattern.keystrokes.length - 1];
        const interval = lastKeystroke ? timestamp - lastKeystroke.timestamp : 0;

        pattern.keystrokes.push({
            key,
            timestamp,
            duration,
            interval,
        });

        // Keep only last 50 keystrokes
        if (pattern.keystrokes.length > 50) {
            pattern.keystrokes.shift();
        }

        pattern.lastActivity = timestamp;
    }

    /**
     * Track click event
     */
    trackClick(
        sessionId: string,
        x: number,
        y: number,
        elementType: string,
        elementId?: string,
        doubleClick = false
    ): void {
        const pattern = this.behaviorPatterns.get(sessionId);
        if (!pattern) return;

        const timestamp = Date.now();

        pattern.clicks.push({
            x,
            y,
            timestamp,
            elementType,
            elementId,
            doubleClick,
        });

        // Keep only last 30 clicks
        if (pattern.clicks.length > 30) {
            pattern.clicks.shift();
        }

        pattern.lastActivity = timestamp;
    }

    /**
     * Track scroll event
     */
    trackScroll(sessionId: string, deltaY: number, scrollTop: number): void {
        const pattern = this.behaviorPatterns.get(sessionId);
        if (!pattern) return;

        const timestamp = Date.now();
        const lastScroll = pattern.scrollEvents[pattern.scrollEvents.length - 1];
        const velocity = lastScroll
            ? Math.abs(deltaY) / ((timestamp - lastScroll.timestamp) || 1)
            : 0;

        pattern.scrollEvents.push({
            deltaY,
            timestamp,
            scrollTop,
            velocity,
        });

        // Keep only last 30 scroll events
        if (pattern.scrollEvents.length > 30) {
            pattern.scrollEvents.shift();
        }

        pattern.lastActivity = timestamp;
    }

    /**
     * Track navigation event
     */
    trackNavigation(
        sessionId: string,
        from: string,
        to: string,
        method: 'click' | 'keyboard' | 'programmatic'
    ): void {
        const pattern = this.behaviorPatterns.get(sessionId);
        if (!pattern) return;

        pattern.navigationEvents.push({
            from,
            to,
            timestamp: Date.now(),
            method,
        });

        // Keep only last 10 navigation events
        if (pattern.navigationEvents.length > 10) {
            pattern.navigationEvents.shift();
        }

        pattern.lastActivity = Date.now();
    }

    /**
     * Analyze behavior pattern and return analysis
     */
    analyzeBehavior(sessionId: string): BehaviorAnalysis {
        const pattern = this.behaviorPatterns.get(sessionId);
        if (!pattern) {
            return this.createDefaultAnalysis('No behavior pattern found');
        }

        const anomalies: string[] = [];
        let suspicionScore = 0;
        let botProbability = 0;
        let humanLikelihood = 1;

        // Analyze mouse movements
        const mouseAnalysis = this.analyzeMouseMovements(pattern.mouseMovements);
        suspicionScore += mouseAnalysis.suspicion;
        botProbability += mouseAnalysis.botIndicators;
        anomalies.push(...mouseAnalysis.anomalies);

        // Analyze keystrokes
        const keystrokeAnalysis = this.analyzeKeystrokes(pattern.keystrokes);
        suspicionScore += keystrokeAnalysis.suspicion;
        botProbability += keystrokeAnalysis.botIndicators;
        anomalies.push(...keystrokeAnalysis.anomalies);

        // Analyze clicks
        const clickAnalysis = this.analyzeClicks(pattern.clicks);
        suspicionScore += clickAnalysis.suspicion;
        botProbability += clickAnalysis.botIndicators;
        anomalies.push(...clickAnalysis.anomalies);

        // Analyze scroll behavior
        const scrollAnalysis = this.analyzeScrollBehavior(pattern.scrollEvents);
        suspicionScore += scrollAnalysis.suspicion;
        botProbability += scrollAnalysis.botIndicators;
        anomalies.push(...scrollAnalysis.anomalies);

        // Analyze session patterns
        const sessionAnalysis = this.analyzeSessionPattern(pattern);
        suspicionScore += sessionAnalysis.suspicion;
        botProbability += sessionAnalysis.botIndicators;
        anomalies.push(...sessionAnalysis.anomalies);

        // Normalize scores
        suspicionScore = Math.min(1, suspicionScore / 5);
        botProbability = Math.min(1, botProbability / 5);
        humanLikelihood = Math.max(0, 1 - botProbability);

        const confidence = this.calculateConfidence(pattern);
        const riskLevel = this.determineRiskLevel(suspicionScore, botProbability);

        const analysis: BehaviorAnalysis = {
            suspicionScore,
            botProbability,
            humanLikelihood,
            anomalies: anomalies.filter(Boolean),
            confidence,
            riskLevel,
        };

        // Store analysis history
        const history = this.analysisHistory.get(sessionId) || [];
        history.push(analysis);
        this.analysisHistory.set(sessionId, history);

        console.log(`🧠 Behavior analysis for ${sessionId}:`, {
            suspicionScore: Math.round(suspicionScore * 100) + '%',
            botProbability: Math.round(botProbability * 100) + '%',
            riskLevel,
            anomalies: anomalies.length,
        });

        return analysis;
    }

    /**
     * Analyze mouse movement patterns
     */
    private analyzeMouseMovements(movements: MouseMovement[]): {
        suspicion: number;
        botIndicators: number;
        anomalies: string[];
    } {
        const anomalies: string[] = [];
        let suspicion = 0;
        let botIndicators = 0;

        if (movements.length === 0) {
            anomalies.push('No mouse movements detected');
            botIndicators += 0.8; // Strong bot indicator
            return { suspicion, botIndicators, anomalies };
        }

        if (movements.length < BehavioralAnalyzer.THRESHOLDS.MIN_MOUSE_MOVEMENTS) {
            anomalies.push('Insufficient mouse movements for human behavior');
            suspicion += 0.3;
            botIndicators += 0.4;
        }

        // Analyze velocity patterns
        const velocities = movements.map(m => m.velocity).filter(v => v > 0);
        if (velocities.length > 0) {
            const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
            const velocityVariance = this.calculateVariance(velocities);

            if (avgVelocity > BehavioralAnalyzer.THRESHOLDS.MAX_VELOCITY) {
                anomalies.push('Unrealistic mouse velocity detected');
                suspicion += 0.4;
                botIndicators += 0.3;
            }

            if (velocityVariance < BehavioralAnalyzer.THRESHOLDS.MIN_VELOCITY_VARIANCE) {
                anomalies.push('Mouse velocity too consistent (bot-like)');
                suspicion += 0.5;
                botIndicators += 0.6;
            }
        }

        // Analyze movement patterns (straight lines, perfect curves)
        const straightLineRatio = this.calculateStraightLineRatio(movements);
        if (straightLineRatio > 0.7) {
            anomalies.push('Too many straight-line mouse movements');
            suspicion += 0.3;
            botIndicators += 0.4;
        }

        return { suspicion, botIndicators, anomalies };
    }

    /**
     * Analyze keystroke patterns
     */
    private analyzeKeystrokes(keystrokes: Keystroke[]): {
        suspicion: number;
        botIndicators: number;
        anomalies: string[];
    } {
        const anomalies: string[] = [];
        let suspicion = 0;
        let botIndicators = 0;

        if (keystrokes.length === 0) {
            return { suspicion, botIndicators, anomalies };
        }

        // Analyze typing rhythm
        const intervals = keystrokes.map(k => k.interval).filter(i => i > 0);
        if (intervals.length > 0) {
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const intervalVariance = this.calculateVariance(intervals);

            if (avgInterval < BehavioralAnalyzer.THRESHOLDS.MIN_KEYSTROKE_INTERVAL) {
                anomalies.push('Typing too fast for human behavior');
                suspicion += 0.4;
                botIndicators += 0.5;
            }

            if (intervalVariance < BehavioralAnalyzer.THRESHOLDS.MIN_KEYSTROKE_VARIANCE) {
                anomalies.push('Typing rhythm too consistent (bot-like)');
                suspicion += 0.5;
                botIndicators += 0.6;
            }
        }

        // Analyze key press durations
        const durations = keystrokes.map(k => k.duration);
        const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
        const durationVariance = this.calculateVariance(durations);

        if (avgDuration < 10) {
            anomalies.push('Key press duration too short');
            suspicion += 0.3;
            botIndicators += 0.4;
        }

        if (durationVariance < 0.1) {
            anomalies.push('Key press duration too consistent');
            suspicion += 0.4;
            botIndicators += 0.5;
        }

        return { suspicion, botIndicators, anomalies };
    }

    /**
     * Analyze click patterns
     */
    private analyzeClicks(clicks: ClickEvent[]): {
        suspicion: number;
        botIndicators: number;
        anomalies: string[];
    } {
        const anomalies: string[] = [];
        let suspicion = 0;
        let botIndicators = 0;

        if (clicks.length === 0) {
            return { suspicion, botIndicators, anomalies };
        }

        // Analyze click timing
        const intervals = [];
        for (let i = 1; i < clicks.length; i++) {
            intervals.push(clicks[i].timestamp - clicks[i - 1].timestamp);
        }

        if (intervals.length > 0) {
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const intervalVariance = this.calculateVariance(intervals);

            if (avgInterval < BehavioralAnalyzer.THRESHOLDS.MIN_CLICK_INTERVAL) {
                anomalies.push('Clicking too fast');
                suspicion += 0.4;
                botIndicators += 0.5;
            }

            if (intervalVariance < 0.1 && intervals.length > 3) {
                anomalies.push('Click timing too consistent');
                suspicion += 0.5;
                botIndicators += 0.6;
            }
        }

        // Analyze click precision (bots click exact pixels)
        const clickPrecision = this.calculateClickPrecision(clicks);
        if (clickPrecision < BehavioralAnalyzer.THRESHOLDS.MAX_CLICK_PRECISION) {
            anomalies.push('Click precision too high (bot-like)');
            suspicion += 0.6;
            botIndicators += 0.7;
        }

        return { suspicion, botIndicators, anomalies };
    }

    /**
     * Analyze scroll behavior
     */
    private analyzeScrollBehavior(scrollEvents: ScrollEvent[]): {
        suspicion: number;
        botIndicators: number;
        anomalies: string[];
    } {
        const anomalies: string[] = [];
        let suspicion = 0;
        let botIndicators = 0;

        if (scrollEvents.length === 0) {
            return { suspicion, botIndicators, anomalies };
        }

        // Analyze scroll velocity
        const velocities = scrollEvents.map(s => s.velocity);
        const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
        const velocityVariance = this.calculateVariance(velocities);

        if (avgVelocity > BehavioralAnalyzer.THRESHOLDS.MAX_SCROLL_VELOCITY) {
            anomalies.push('Scroll velocity too high');
            suspicion += 0.3;
            botIndicators += 0.3;
        }

        if (velocityVariance < BehavioralAnalyzer.THRESHOLDS.MIN_SCROLL_VARIANCE) {
            anomalies.push('Scroll behavior too consistent');
            suspicion += 0.4;
            botIndicators += 0.5;
        }

        return { suspicion, botIndicators, anomalies };
    }

    /**
     * Analyze overall session pattern
     */
    private analyzeSessionPattern(pattern: BehaviorPattern): {
        suspicion: number;
        botIndicators: number;
        anomalies: string[];
    } {
        const anomalies: string[] = [];
        let suspicion = 0;
        let botIndicators = 0;

        const sessionDuration = pattern.lastActivity - pattern.sessionStart;
        const totalActions =
            pattern.mouseMovements.length +
            pattern.keystrokes.length +
            pattern.clicks.length +
            pattern.scrollEvents.length;

        // Check session duration
        if (sessionDuration < BehavioralAnalyzer.THRESHOLDS.MIN_SESSION_DURATION) {
            anomalies.push('Session too short');
            suspicion += 0.2;
        }

        // Check action rate
        const actionsPerSecond = totalActions / (sessionDuration / 1000);
        if (actionsPerSecond > BehavioralAnalyzer.THRESHOLDS.MAX_ACTIONS_PER_SECOND) {
            anomalies.push('Action rate too high for human behavior');
            suspicion += 0.5;
            botIndicators += 0.6;
        }

        // Check for programmatic navigation
        const programmaticNav = pattern.navigationEvents.filter(
            n => n.method === 'programmatic'
        ).length;
        if (programmaticNav > pattern.navigationEvents.length * 0.5) {
            anomalies.push('Too much programmatic navigation');
            suspicion += 0.4;
            botIndicators += 0.5;
        }

        return { suspicion, botIndicators, anomalies };
    }

    /**
     * Calculate variance for a set of numbers
     */
    private calculateVariance(numbers: number[]): number {
        if (numbers.length < 2) return 0;

        const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;

        return variance / (mean * mean); // Coefficient of variation
    }

    /**
     * Calculate straight line ratio in mouse movements
     */
    private calculateStraightLineRatio(movements: MouseMovement[]): number {
        if (movements.length < 3) return 0;

        let straightLines = 0;
        for (let i = 2; i < movements.length; i++) {
            const p1 = movements[i - 2];
            const p2 = movements[i - 1];
            const p3 = movements[i];

            // Calculate if three points are roughly in a straight line
            const slope1 = (p2.y - p1.y) / (p2.x - p1.x || 1);
            const slope2 = (p3.y - p2.y) / (p3.x - p2.x || 1);

            if (Math.abs(slope1 - slope2) < 0.1) {
                straightLines++;
            }
        }

        return straightLines / (movements.length - 2);
    }

    /**
     * Calculate click precision (average distance from element center)
     */
    private calculateClickPrecision(clicks: ClickEvent[]): number {
        if (clicks.length < 2) return 100; // Default to high precision

        let totalDeviation = 0;
        for (let i = 1; i < clicks.length; i++) {
            const distance = Math.sqrt(
                Math.pow(clicks[i].x - clicks[i - 1].x, 2) +
                Math.pow(clicks[i].y - clicks[i - 1].y, 2)
            );
            totalDeviation += distance;
        }

        return totalDeviation / (clicks.length - 1);
    }

    /**
     * Calculate confidence in analysis based on data availability
     */
    private calculateConfidence(pattern: BehaviorPattern): number {
        let confidence = 0;

        // More mouse movements = higher confidence
        confidence += Math.min(0.3, pattern.mouseMovements.length / 100);

        // More keystrokes = higher confidence  
        confidence += Math.min(0.2, pattern.keystrokes.length / 50);

        // More clicks = higher confidence
        confidence += Math.min(0.2, pattern.clicks.length / 20);

        // Longer session = higher confidence
        const sessionMinutes = (pattern.lastActivity - pattern.sessionStart) / 60000;
        confidence += Math.min(0.3, sessionMinutes / 5);

        return Math.min(1, confidence);
    }

    /**
     * Determine risk level based on scores
     */
    private determineRiskLevel(
        suspicionScore: number,
        botProbability: number
    ): 'low' | 'medium' | 'high' | 'critical' {
        const maxScore = Math.max(suspicionScore, botProbability);

        if (maxScore >= 0.8) return 'critical';
        if (maxScore >= 0.6) return 'high';
        if (maxScore >= 0.4) return 'medium';
        return 'low';
    }

    /**
     * Create default analysis for error cases
     */
    private createDefaultAnalysis(reason: string): BehaviorAnalysis {
        return {
            suspicionScore: 0,
            botProbability: 0,
            humanLikelihood: 1,
            anomalies: [reason],
            confidence: 0,
            riskLevel: 'low',
        };
    }

    /**
     * Get behavior pattern for a session
     */
    getBehaviorPattern(sessionId: string): BehaviorPattern | undefined {
        return this.behaviorPatterns.get(sessionId);
    }

    /**
     * Get analysis history for a session
     */
    getAnalysisHistory(sessionId: string): BehaviorAnalysis[] {
        return this.analysisHistory.get(sessionId) || [];
    }

    /**
     * Clean up old sessions
     */
    cleanupOldSessions(maxAge: number = 24 * 60 * 60 * 1000): void {
        const now = Date.now();
        const sessionsToDelete: string[] = [];

        for (const [sessionId, pattern] of this.behaviorPatterns.entries()) {
            if (now - pattern.lastActivity > maxAge) {
                sessionsToDelete.push(sessionId);
            }
        }

        sessionsToDelete.forEach(sessionId => {
            this.behaviorPatterns.delete(sessionId);
            this.analysisHistory.delete(sessionId);
        });

        if (sessionsToDelete.length > 0) {
            console.log(`🧠 Cleaned up ${sessionsToDelete.length} old behavior sessions`);
        }
    }

    /**
     * Get real-time statistics
     */
    getRealTimeStats(): {
        activeSessions: number;
        totalAnalyses: number;
        riskDistribution: Record<string, number>;
        avgSuspicionScore: number;
    } {
        const activeSessions = this.behaviorPatterns.size;
        let totalAnalyses = 0;
        const riskDistribution: Record<string, number> = {
            low: 0,
            medium: 0,
            high: 0,
            critical: 0,
        };
        let totalSuspicion = 0;
        let suspicionCount = 0;

        for (const analyses of this.analysisHistory.values()) {
            totalAnalyses += analyses.length;

            if (analyses.length > 0) {
                const latest = analyses[analyses.length - 1];
                riskDistribution[latest.riskLevel]++;
                totalSuspicion += latest.suspicionScore;
                suspicionCount++;
            }
        }

        return {
            activeSessions,
            totalAnalyses,
            riskDistribution,
            avgSuspicionScore: suspicionCount > 0 ? totalSuspicion / suspicionCount : 0,
        };
    }
}

// Export singleton instance
export const behavioralAnalyzer = BehavioralAnalyzer.getInstance();
