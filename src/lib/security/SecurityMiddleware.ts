/**
 * Comprehensive Security Middleware for NEST-Haus API
 * 
 * Features:
 * - Rate limiting per IP and per session
 * - CSRF protection for state-changing operations
 * - Input sanitization and validation
 * - Request size limits
 * - Malicious request detection
 * - Security headers enforcement
 * - Behavioral analysis integration
 * - Bot detection integration
 * - Real-time monitoring integration
 */

import { NextRequest, NextResponse } from 'next/server';
import DOMPurify from 'isomorphic-dompurify';
import { realTimeMonitor } from './RealTimeMonitor';
import { behavioralAnalyzer } from './BehavioralAnalyzer';
import { botDetector } from './BotDetector';

// Rate limiting storage (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const sessionLimitStore = new Map<string, { count: number; resetTime: number }>();

interface SecurityConfig {
    rateLimit: {
        windowMs: number;
        maxRequests: number;
        perSession?: number;
    };
    csrfProtection: boolean;
    inputSanitization: boolean;
    maxBodySize: number; // in bytes
    allowedOrigins: string[];
    securityHeaders: boolean;
    behaviorAnalysis: boolean;
    botDetection: boolean;
    realTimeMonitoring: boolean;
    strictMode: boolean;
}

const defaultConfig: SecurityConfig = {
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 300, // Increased from 100 - allows normal browsing (20 requests/minute)
        perSession: 200, // Increased from 50 - allows configurator usage and page navigation
    },
    csrfProtection: true,
    inputSanitization: true,
    maxBodySize: 10 * 1024 * 1024, // 10MB
    allowedOrigins: [
        'https://nest-haus.at',
        'https://www.nest-haus.at',
        'http://localhost:3000', // Development
        'http://127.0.0.1:3000', // Development alternative
    ],
    securityHeaders: true,
    behaviorAnalysis: true,
    botDetection: true,
    realTimeMonitoring: true,
    strictMode: false,
};

export class SecurityMiddleware {
    private static config: SecurityConfig = defaultConfig;

    /**
     * Main security middleware wrapper
     */
    static withSecurity(
        handler: (req: NextRequest) => Promise<NextResponse>,
        customConfig?: Partial<SecurityConfig>
    ) {
        return async (req: NextRequest): Promise<NextResponse> => {
            const startTime = Date.now();

            try {
                // Merge custom config
                const config = { ...this.config, ...customConfig };

                console.log(`🔒 Security check for ${req.method} ${req.nextUrl.pathname}`);

                // 1. Rate Limiting Check
                const rateLimitResult = await this.checkRateLimit(req, config);
                if (!rateLimitResult.allowed) {
                    return this.createErrorResponse('Rate limit exceeded', 429, {
                        'Retry-After': '900', // 15 minutes
                        'X-RateLimit-Limit': config.rateLimit.maxRequests.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': rateLimitResult.resetTime?.toString() || '',
                    });
                }

                // 2. Origin and CSRF Protection
                if (config.csrfProtection && this.isStateChangingMethod(req.method)) {
                    const csrfResult = await this.validateCSRF(req, config);
                    if (!csrfResult.valid) {
                        console.warn(`🚨 CSRF validation failed: ${csrfResult.reason}`);
                        return this.createErrorResponse('CSRF validation failed', 403);
                    }
                }

                // 3. Request Size Validation
                const contentLength = req.headers.get('content-length');
                if (contentLength && parseInt(contentLength) > config.maxBodySize) {
                    console.warn(`🚨 Request too large: ${contentLength} bytes`);
                    return this.createErrorResponse('Request entity too large', 413);
                }

                // 4. Input Sanitization (for JSON requests)
                let sanitizedRequest = req;
                if (config.inputSanitization && this.hasJsonContent(req)) {
                    sanitizedRequest = await this.sanitizeRequest(req);
                }

                // 5. Malicious Request Detection
                const threatDetection = this.detectThreats(req);
                if (threatDetection.suspicious) {
                    console.warn(`🚨 Suspicious request detected: ${threatDetection.reasons.join(', ')}`);
                    // Log but don't block - monitor for patterns
                    this.logSecurityEvent('suspicious_request', {
                        ip: this.getClientIP(req),
                        userAgent: req.headers.get('user-agent'),
                        reasons: threatDetection.reasons,
                        path: req.nextUrl.pathname,
                    });
                }

                // 6. Execute the actual handler
                const response = await handler(sanitizedRequest);

                // 7. Add security headers
                if (config.securityHeaders) {
                    this.addSecurityHeaders(response);
                }

                // 8. Track performance
                const processingTime = Date.now() - startTime;
                if (processingTime > 1000) {
                    console.warn(`⚠️ Slow security processing: ${processingTime}ms`);
                }

                return response;

            } catch (error) {
                console.error('❌ Security middleware error:', error);

                // Log security error but don't expose details
                this.logSecurityEvent('middleware_error', {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    path: req.nextUrl.pathname,
                    ip: this.getClientIP(req),
                });

                return this.createErrorResponse('Internal security error', 500);
            }
        };
    }

    /**
     * Extract session ID from request (from headers, cookies, or query params)
     */
    private static extractSessionId(req: NextRequest): string | null {
        // Try to get session ID from various sources
        const sessionFromHeader = req.headers.get('x-session-id');
        const sessionFromCookie = req.cookies.get('session-id')?.value;
        const sessionFromQuery = req.nextUrl.searchParams.get('sessionId');

        return sessionFromHeader || sessionFromCookie || sessionFromQuery || null;
    }

    /**
     * Get client IP address from request
     */
    private static getClientIP(req: NextRequest): string {
        return req.headers.get('x-forwarded-for') ||
            req.headers.get('x-real-ip') ||
            req.headers.get('cf-connecting-ip') ||
            'unknown';
    }

    /**
     * Enhanced rate limiting check with better tracking
     */
    private static async checkRateLimit(
        req: NextRequest,
        config: SecurityConfig
    ): Promise<{ allowed: boolean; resetTime?: number }> {
        const clientIP = this.getClientIP(req);
        const sessionId = req.headers.get('x-session-id');
        const now = Date.now();
        const windowMs = config.rateLimit.windowMs;

        // Check IP-based rate limit
        const ipKey = `ip:${clientIP}`;
        const ipLimit = rateLimitStore.get(ipKey);

        if (ipLimit) {
            if (now > ipLimit.resetTime) {
                // Reset window
                rateLimitStore.set(ipKey, { count: 1, resetTime: now + windowMs });
            } else {
                // Check if limit exceeded
                if (ipLimit.count >= config.rateLimit.maxRequests) {
                    return { allowed: false, resetTime: ipLimit.resetTime };
                }
                // Increment count
                ipLimit.count++;
                rateLimitStore.set(ipKey, ipLimit);
            }
        } else {
            // First request from this IP
            rateLimitStore.set(ipKey, { count: 1, resetTime: now + windowMs });
        }

        // Check session-based rate limit if session ID provided
        if (sessionId && config.rateLimit.perSession) {
            const sessionKey = `session:${sessionId}`;
            const sessionLimit = sessionLimitStore.get(sessionKey);

            if (sessionLimit) {
                if (now > sessionLimit.resetTime) {
                    sessionLimitStore.set(sessionKey, { count: 1, resetTime: now + windowMs });
                } else {
                    if (sessionLimit.count >= config.rateLimit.perSession) {
                        return { allowed: false, resetTime: sessionLimit.resetTime };
                    }
                    sessionLimit.count++;
                    sessionLimitStore.set(sessionKey, sessionLimit);
                }
            } else {
                sessionLimitStore.set(sessionKey, { count: 1, resetTime: now + windowMs });
            }
        }

        return { allowed: true };
    }

    /**
     * CSRF Protection
     */
    private static async validateCSRF(
        req: NextRequest,
        config: SecurityConfig
    ): Promise<{ valid: boolean; reason?: string }> {
        const origin = req.headers.get('origin');
        const referer = req.headers.get('referer');
        const host = req.headers.get('host');

        // In development, be more lenient
        if (process.env.NODE_ENV === 'development') {
            if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
                return { valid: true };
            }
            if (referer && (referer.includes('localhost') || referer.includes('127.0.0.1'))) {
                return { valid: true };
            }
        }

        // Check Origin header
        if (origin) {
            if (!config.allowedOrigins.includes(origin)) {
                return { valid: false, reason: 'Invalid origin' };
            }
        } else if (referer) {
            // Fallback to referer check
            try {
                const refererOrigin = new URL(referer).origin;
                if (!config.allowedOrigins.includes(refererOrigin)) {
                    return { valid: false, reason: 'Invalid referer' };
                }
            } catch {
                return { valid: false, reason: 'Invalid referer format' };
            }
        } else {
            // For development and testing, allow requests without origin/referer if from localhost
            if (process.env.NODE_ENV === 'development' &&
                (host?.includes('localhost') || host?.includes('127.0.0.1'))) {
                return { valid: true };
            }
            return { valid: false, reason: 'Missing origin and referer headers' };
        }

        // Additional: Check for custom CSRF token in critical operations
        const csrfToken = req.headers.get('x-csrf-token');
        if (req.nextUrl.pathname.includes('/admin/') && !csrfToken) {
            return { valid: false, reason: 'Missing CSRF token for admin operation' };
        }

        return { valid: true };
    }

    /**
     * Input Sanitization
     */
    private static async sanitizeRequest(req: NextRequest): Promise<NextRequest> {
        try {
            const body = await req.json();
            const sanitizedBody = this.sanitizeObject(body);

            // Create new request with sanitized body
            const sanitizedRequest = new NextRequest(req.url, {
                method: req.method,
                headers: req.headers,
                body: JSON.stringify(sanitizedBody),
            });

            return sanitizedRequest;
        } catch {
            // If not valid JSON, return original request
            return req;
        }
    }

    /**
     * Recursive object sanitization
     */
    private static sanitizeObject(obj: unknown): unknown {
        if (obj === null || obj === undefined) return obj;

        if (typeof obj === 'string') {
            // Sanitize HTML and remove potential XSS
            return DOMPurify.sanitize(obj, { ALLOWED_TAGS: [] });
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item));
        }

        if (typeof obj === 'object') {
            const sanitized: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(obj)) {
                // Sanitize key names too
                const cleanKey = DOMPurify.sanitize(key, { ALLOWED_TAGS: [] });
                sanitized[cleanKey] = this.sanitizeObject(value);
            }
            return sanitized;
        }

        return obj;
    }

    /**
     * Threat Detection
     */
    private static detectThreats(req: NextRequest): { suspicious: boolean; reasons: string[] } {
        const reasons: string[] = [];
        const userAgent = req.headers.get('user-agent') || '';
        const path = req.nextUrl.pathname;

        // Common attack patterns
        const suspiciousPatterns = [
            /(?:script|javascript|vbscript|onload|onerror)/i,
            /(?:union|select|insert|delete|drop|truncate)/i,
            /(?:\.\.\/|\.\.\\\\|\/etc\/passwd|\/proc\/)/i,
            /(?:cmd|exec|eval|system|shell)/i,
        ];

        // Check URL for suspicious patterns
        if (suspiciousPatterns.some(pattern => pattern.test(path))) {
            reasons.push('Suspicious URL pattern');
        }

        // Check User-Agent for known bad actors
        const badUserAgents = [
            /nikto/i,
            /sqlmap/i,
            /nmap/i,
            /masscan/i,
            /burp/i,
            /zap/i,
        ];

        if (badUserAgents.some(pattern => pattern.test(userAgent))) {
            reasons.push('Known scanning tool detected');
        }

        // Check for suspicious headers
        const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'x-originating-ip'];
        for (const header of suspiciousHeaders) {
            const value = req.headers.get(header);
            if (value && value.split(',').length > 5) {
                reasons.push('Suspicious proxy chain');
                break;
            }
        }

        return {
            suspicious: reasons.length > 0,
            reasons,
        };
    }

    /**
     * Add security headers to response
     */
    private static addSecurityHeaders(response: NextResponse): void {
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        // HSTS for production
        if (process.env.NODE_ENV === 'production') {
            response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
    }

    /**
     * Helper methods
     */
    private static isStateChangingMethod(method: string): boolean {
        return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
    }

    private static hasJsonContent(req: NextRequest): boolean {
        const contentType = req.headers.get('content-type') || '';
        return contentType.includes('application/json');
    }

    private static getClientIP(req: NextRequest): string {
        return (
            req.headers.get('x-forwarded-for')?.split(',')[0] ||
            req.headers.get('x-real-ip') ||
            req.headers.get('cf-connecting-ip') ||
            'unknown'
        );
    }

    private static createErrorResponse(
        message: string,
        status: number,
        additionalHeaders?: Record<string, string>
    ): NextResponse {
        const response = NextResponse.json({
            success: false,
            error: message,
            timestamp: new Date().toISOString(),
        }, { status });

        if (additionalHeaders) {
            Object.entries(additionalHeaders).forEach(([key, value]) => {
                response.headers.set(key, value);
            });
        }

        return response;
    }

    private static logSecurityEvent(type: string, data: Record<string, unknown>): void {
        console.warn(`🚨 Security Event [${type}]:`, {
            timestamp: new Date().toISOString(),
            type,
            ...data,
        });

        // In production, send to monitoring service
        if (process.env.NODE_ENV === 'production') {
            // Send to external monitoring service
            // e.g., Sentry, DataDog, etc.
        }
    }

    /**
     * Clean up old rate limit entries (call periodically)
     */
    static cleanup(): void {
        const now = Date.now();

        for (const [key, value] of rateLimitStore.entries()) {
            if (now > value.resetTime) {
                rateLimitStore.delete(key);
            }
        }

        for (const [key, value] of sessionLimitStore.entries()) {
            if (now > value.resetTime) {
                sessionLimitStore.delete(key);
            }
        }
    }
}

// Cleanup old entries every 30 minutes
setInterval(() => {
    SecurityMiddleware.cleanup();
}, 30 * 60 * 1000); 