/**
 * DevTools Detection System
 * Detects when developer tools are opened and implements countermeasures
 */

export interface DevToolsConfig {
    enabled: boolean;
    threshold: number; // Pixel difference threshold for detection
    checkInterval: number; // Check interval in milliseconds
    onDetected?: () => void;
    redirectUrl?: string;
    showWarning?: boolean;
    warningMessage?: string;
    blockAccess?: boolean;
}

export interface BehaviorMetrics {
    mouseMovements: number;
    clickPatterns: number[];
    scrollBehavior: number[];
    timingPatterns: number[];
    keyboardEvents: number;
}

export class DevToolsDetector {
    private static instance: DevToolsDetector | null = null;
    private config: DevToolsConfig;
    private isDetected = false;
    private checkInterval: NodeJS.Timeout | null = null;
    private behaviorMetrics: BehaviorMetrics = {
        mouseMovements: 0,
        clickPatterns: [],
        scrollBehavior: [],
        timingPatterns: [],
        keyboardEvents: 0,
    };

    private static defaultConfig: DevToolsConfig = {
        enabled: false, // Disabled by default to prevent false positives
        threshold: 200, // Higher threshold for better accuracy
        checkInterval: 2000, // Less frequent checks
        redirectUrl: '/access-denied',
        showWarning: false, // Don't show warnings by default
        warningMessage: 'Developer tools detected. Access restricted for security reasons.',
        blockAccess: false, // Don't block access by default
    };

    private constructor(config: Partial<DevToolsConfig> = {}) {
        this.config = { ...DevToolsDetector.defaultConfig, ...config };
    }

    /**
     * Get singleton instance
     */
    static getInstance(config: Partial<DevToolsConfig> = {}): DevToolsDetector {
        if (!DevToolsDetector.instance) {
            DevToolsDetector.instance = new DevToolsDetector(config);
        }
        return DevToolsDetector.instance;
    }

    /**
     * Start DevTools detection
     */
    start(): void {
        if (!this.config.enabled || typeof window === 'undefined') {
            console.log('🔒 DevTools detection disabled or not in browser environment');
            return;
        }

        console.log('🔒 Starting DevTools detection system');

        // Start window size monitoring
        this.startWindowSizeMonitoring();

        // Start behavioral analysis
        this.startBehavioralAnalysis();

        // Block common DevTools shortcuts
        this.blockDevToolsShortcuts();

        // Monitor console access
        this.monitorConsoleAccess();
    }

    /**
     * Stop DevTools detection
     */
    stop(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        console.log('🔒 DevTools detection stopped');
    }

    /**
     * Monitor window size changes to detect DevTools
     */
    private startWindowSizeMonitoring(): void {
        const checkDevTools = () => {
            // More sophisticated detection to reduce false positives
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;

            // Only trigger if both dimensions suggest DevTools AND the difference is significant
            const significantWidthDiff = widthDiff > this.config.threshold;
            const significantHeightDiff = heightDiff > this.config.threshold;

            // Additional checks to reduce false positives
            const isLikelyDevTools = (significantWidthDiff || significantHeightDiff) &&
                (widthDiff > 100 || heightDiff > 100) && // Minimum difference
                window.innerWidth > 400 && window.innerHeight > 300; // Reasonable window size

            if (isLikelyDevTools && !this.isDetected) {
                this.handleDevToolsDetected('Window size monitoring');
            }
        };

        // Initial check
        checkDevTools();

        // Periodic checks
        this.checkInterval = setInterval(checkDevTools, this.config.checkInterval);

        // Listen for resize events
        window.addEventListener('resize', checkDevTools);
    }

    /**
     * Start behavioral analysis to detect suspicious activity
     */
    private startBehavioralAnalysis(): void {
        // Track mouse movements
        document.addEventListener('mousemove', () => {
            this.behaviorMetrics.mouseMovements++;
        });

        // Track click patterns
        document.addEventListener('click', (_e) => {
            this.behaviorMetrics.clickPatterns.push(Date.now());

            // Keep only last 10 clicks
            if (this.behaviorMetrics.clickPatterns.length > 10) {
                this.behaviorMetrics.clickPatterns.shift();
            }
        });

        // Track scroll behavior
        document.addEventListener('scroll', () => {
            this.behaviorMetrics.scrollBehavior.push(Date.now());

            // Keep only last 10 scrolls
            if (this.behaviorMetrics.scrollBehavior.length > 10) {
                this.behaviorMetrics.scrollBehavior.shift();
            }
        });

        // Track keyboard events
        document.addEventListener('keydown', () => {
            this.behaviorMetrics.keyboardEvents++;
        });

        // Analyze behavior periodically
        setInterval(() => {
            this.analyzeBehavior();
        }, 10000); // Every 10 seconds
    }

    /**
     * Analyze user behavior for bot-like patterns
     */
    private analyzeBehavior(): void {
        const { mouseMovements, clickPatterns, keyboardEvents } = this.behaviorMetrics;

        // Calculate bot score
        let botScore = 0;

        // No mouse movements (headless browser)
        if (mouseMovements === 0) {
            botScore += 0.4;
        }

        // Rapid sequential clicks
        if (clickPatterns.length >= 3) {
            const intervals = [];
            for (let i = 1; i < clickPatterns.length; i++) {
                intervals.push(clickPatterns[i] - clickPatterns[i - 1]);
            }
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

            if (avgInterval < 100) {
                botScore += 0.3;
            }
        }

        // No keyboard activity
        if (keyboardEvents === 0 && mouseMovements > 100) {
            botScore += 0.2;
        }

        // Perfect timing patterns (likely bot)
        const variance = this.calculateVariance(clickPatterns);
        if (variance < 0.1 && clickPatterns.length > 5) {
            botScore += 0.3;
        }

        // Only trigger on very high bot scores to reduce false positives
        if (botScore > 0.9) {
            this.handleDevToolsDetected('Behavioral analysis - bot detected');
        }

        // Reset metrics
        this.behaviorMetrics.mouseMovements = 0;
        this.behaviorMetrics.keyboardEvents = 0;
    }

    /**
     * Calculate variance in timing patterns
     */
    private calculateVariance(timings: number[]): number {
        if (timings.length < 2) return 0;

        const intervals = [];
        for (let i = 1; i < timings.length; i++) {
            intervals.push(timings[i] - timings[i - 1]);
        }

        const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const squaredDiffs = intervals.map(interval => Math.pow(interval - mean, 2));
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / intervals.length;

        return variance / (mean * mean); // Normalized variance
    }

    /**
     * Block common DevTools keyboard shortcuts
     */
    private blockDevToolsShortcuts(): void {
        document.addEventListener('keydown', (e) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                this.handleDevToolsDetected('F12 key pressed');
                return false;
            }

            // Ctrl+Shift+I (Windows/Linux)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.handleDevToolsDetected('Ctrl+Shift+I pressed');
                return false;
            }

            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                this.handleDevToolsDetected('Ctrl+Shift+J pressed');
                return false;
            }

            // Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.handleDevToolsDetected('Ctrl+U pressed');
                return false;
            }

            // Cmd+Option+I (Mac)
            if (e.metaKey && e.altKey && e.key === 'i') {
                e.preventDefault();
                this.handleDevToolsDetected('Cmd+Option+I pressed');
                return false;
            }

            // Cmd+Option+J (Mac Console)
            if (e.metaKey && e.altKey && e.key === 'j') {
                e.preventDefault();
                this.handleDevToolsDetected('Cmd+Option+J pressed');
                return false;
            }

            return true;
        });
    }

    /**
     * Monitor console access attempts
     */
    private monitorConsoleAccess(): void {
        // Override console methods to detect usage
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => {
            this.handleDevToolsDetected('Console.log accessed');
            return originalLog.apply(console, args);
        };

        console.error = (...args) => {
            this.handleDevToolsDetected('Console.error accessed');
            return originalError.apply(console, args);
        };

        console.warn = (...args) => {
            this.handleDevToolsDetected('Console.warn accessed');
            return originalWarn.apply(console, args);
        };

        // Detect debugger statements
        const originalEval = window.eval;
        window.eval = (code: string) => {
            if (code.includes('debugger')) {
                this.handleDevToolsDetected('Debugger statement detected');
            }
            return originalEval(code);
        };
    }

    /**
     * Handle DevTools detection
     */
    private handleDevToolsDetected(method: string): void {
        if (this.isDetected) return;

        this.isDetected = true;
        console.warn(`🚨 DevTools detected via: ${method}`);

        // Call custom handler if provided
        if (this.config.onDetected) {
            this.config.onDetected();
        }

        // Show warning
        if (this.config.showWarning) {
            this.showWarning();
        }

        // Block access or redirect
        if (this.config.blockAccess) {
            this.blockAccess();
        }
    }

    /**
     * Show warning message
     */
    private showWarning(): void {
        const warning = document.createElement('div');
        warning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-family: Arial, sans-serif;
      z-index: 999999;
      text-align: center;
      padding: 20px;
      box-sizing: border-box;
    `;

        warning.innerHTML = `
      <div>
        <h2>⚠️ Access Restricted</h2>
        <p>${this.config.warningMessage}</p>
        <p><small>This page will redirect in 3 seconds...</small></p>
      </div>
    `;

        document.body.appendChild(warning);

        // Auto-redirect after 3 seconds
        setTimeout(() => {
            if (this.config.redirectUrl) {
                window.location.href = this.config.redirectUrl;
            }
        }, 3000);
    }

    /**
     * Block access to the page
     */
    private blockAccess(): void {
        // Clear page content
        document.body.innerHTML = '';
        document.head.innerHTML = '';

        // Redirect if URL provided
        if (this.config.redirectUrl) {
            setTimeout(() => {
                window.location.href = this.config.redirectUrl!;
            }, 1000);
        }
    }

    /**
     * Get current behavior metrics
     */
    getBehaviorMetrics(): BehaviorMetrics {
        return { ...this.behaviorMetrics };
    }

    /**
     * Check if DevTools are currently detected
     */
    isDevToolsDetected(): boolean {
        return this.isDetected;
    }

    /**
     * Reset detection state
     */
    reset(): void {
        this.isDetected = false;
        this.behaviorMetrics = {
            mouseMovements: 0,
            clickPatterns: [],
            scrollBehavior: [],
            timingPatterns: [],
            keyboardEvents: 0,
        };
    }
}

// Export convenience function for easy initialization
export function initializeDevToolsDetection(config: Partial<DevToolsConfig> = {}): DevToolsDetector {
    const detector = DevToolsDetector.getInstance(config);
    detector.start();
    return detector;
}
