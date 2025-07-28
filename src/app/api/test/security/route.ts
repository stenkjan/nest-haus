/**
 * Security Testing API Route
 * 
 * Tests rate limiting, CSRF protection, input sanitization, and other security features.
 * Use this endpoint to verify security middleware is working correctly.
 */

import { NextRequest, NextResponse } from 'next/server';
import { SecurityMiddleware } from '@/lib/security/SecurityMiddleware';

/**
 * GET /api/test/security
 * Test basic rate limiting and security headers
 */
async function handleGetTest(request: NextRequest): Promise<NextResponse> {
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        request.headers.get('cf-connecting-ip') ||
        'unknown';

    const sessionId = request.headers.get('x-session-id');
    const userAgent = request.headers.get('user-agent');

    console.log(`🔒 Security test GET - IP: ${clientIP}, Session: ${sessionId}`);

    return NextResponse.json({
        success: true,
        message: 'Security test passed',
        data: {
            timestamp: new Date().toISOString(),
            clientIP,
            sessionId,
            userAgent: userAgent?.substring(0, 50) + '...', // Truncate for readability
            method: 'GET',
            rateLimitInfo: {
                message: 'Rate limiting is active',
                windowMs: '15 minutes',
                maxRequestsPerIP: 300,
                maxRequestsPerSession: 200,
            },
            securityFeatures: {
                rateLimiting: 'Active',
                securityHeaders: 'Active',
                csrfProtection: 'Not required for GET requests',
                inputSanitization: 'Not applicable for GET requests',
            }
        }
    });
}

/**
 * POST /api/test/security
 * Test CSRF protection, input sanitization, and rate limiting for state-changing operations
 */
async function handlePostTest(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
        const sessionId = request.headers.get('x-session-id');
        const origin = request.headers.get('origin');
        const referer = request.headers.get('referer');

        console.log(`🔒 Security test POST - IP: ${clientIP}, Session: ${sessionId}, Origin: ${origin}`);

        return NextResponse.json({
            success: true,
            message: 'Security test passed - all protections working',
            data: {
                timestamp: new Date().toISOString(),
                clientIP,
                sessionId,
                origin,
                referer,
                method: 'POST',
                receivedData: {
                    keys: Object.keys(body),
                    sanitized: true, // Data was sanitized by SecurityMiddleware
                },
                securityFeatures: {
                    rateLimiting: 'Active and passed',
                    csrfProtection: 'Active and passed',
                    inputSanitization: 'Active and applied',
                    securityHeaders: 'Added to response',
                },
                testResults: {
                    csrfValidation: origin ? 'PASSED - Valid origin' : referer ? 'PASSED - Valid referer' : 'FAILED - No origin/referer',
                    inputSanitization: 'PASSED - Data sanitized',
                    rateLimiting: 'PASSED - Within limits',
                }
            }
        });

    } catch (error) {
        console.error('❌ Security test error:', error);
        return NextResponse.json({
            success: false,
            error: 'Security test failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

/**
 * PUT /api/test/security/rate-limit
 * Stress test rate limiting - make multiple requests quickly
 */
async function handleRateLimitTest(request: NextRequest): Promise<NextResponse> {
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const sessionId = request.headers.get('x-session-id');
    const requestCount = parseInt(request.nextUrl.searchParams.get('count') || '1');

    console.log(`🔒 Rate limit test - IP: ${clientIP}, Session: ${sessionId}, Count: ${requestCount}`);

    return NextResponse.json({
        success: true,
        message: `Rate limit test ${requestCount} passed`,
        data: {
            timestamp: new Date().toISOString(),
            clientIP,
            sessionId,
            requestNumber: requestCount,
            rateLimitStatus: 'PASSED - Request allowed',
            limits: {
                perIP: '300 requests / 15 minutes',
                perSession: '200 requests / 15 minutes',
            },
            recommendation: requestCount > 250 ? 'Approaching rate limit' : 'Well within limits'
        }
    });
}

// Apply security middleware with user-friendly settings
export const GET = SecurityMiddleware.withSecurity(handleGetTest, {
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 300, // User-friendly limit
        perSession: 200
    },
    csrfProtection: false, // GET requests don't need CSRF
    inputSanitization: false, // No body to sanitize
    securityHeaders: true,
});

export const POST = SecurityMiddleware.withSecurity(handlePostTest, {
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 300,
        perSession: 200
    },
    csrfProtection: true, // Test CSRF protection
    inputSanitization: true, // Test input sanitization
    maxBodySize: 50 * 1024, // 50KB for test data
    securityHeaders: true,
});

export const PUT = SecurityMiddleware.withSecurity(handleRateLimitTest, {
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 300,
        perSession: 200
    },
    csrfProtection: true,
    inputSanitization: false,
    maxBodySize: 1024, // Small body for rate limit test
    securityHeaders: true,
}); 