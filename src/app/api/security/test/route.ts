/**
 * Security Test API Endpoint
 * 
 * Provides endpoints to run security tests safely
 * 
 * ⚠️ WARNING: Only enable in development/staging environments!
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    simulateDDoS,
    testBotDetection,
    testBehavioralAnalysis,
    testContentProtection,
    runAllSecurityTests
} from '@/test/security/SecurityTestSuite';

// Only allow in development
if (process.env.NODE_ENV === 'production') {
    throw new Error('Security testing endpoints are not available in production');
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('test');

    try {
        let results;

        switch (testType) {
            case 'ddos':
                const target = searchParams.get('target') || '/api/security/dashboard';
                results = await simulateDDoS(target);
                break;

            case 'bot':
                results = await testBotDetection();
                break;

            case 'behavior':
                results = await testBehavioralAnalysis();
                break;

            case 'content':
                results = await testContentProtection();
                break;

            case 'all':
                results = await runAllSecurityTests();
                break;

            default:
                return NextResponse.json({
                    success: false,
                    error: 'Invalid test type',
                    availableTests: ['ddos', 'bot', 'behavior', 'content', 'all'],
                    usage: {
                        ddos: 'GET /api/security/test?test=ddos&target=/api/endpoint',
                        bot: 'GET /api/security/test?test=bot',
                        behavior: 'GET /api/security/test?test=behavior',
                        content: 'GET /api/security/test?test=content',
                        all: 'GET /api/security/test?test=all',
                    }
                }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            testType,
            results,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
        });

    } catch (error) {
        console.error('Security test error:', error);
        return NextResponse.json({
            success: false,
            error: 'Security test failed',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { testType, config } = body;

        // Custom test configurations can be passed via POST
        let results;

        switch (testType) {
            case 'ddos':
                // Allow custom DDoS parameters
                results = await simulateDDoS(config?.target || '/api/security/dashboard');
                break;

            case 'custom':
                // Run custom test scenario
                if (config?.scenario === 'burst') {
                    // Simulate burst attack
                    const promises = [];
                    for (let i = 0; i < (config.requests || 50); i++) {
                        promises.push(
                            fetch(`http://localhost:3000${config.target || '/api/security/dashboard'}`, {
                                headers: {
                                    'User-Agent': config.userAgent || 'Security-Test-Client',
                                    'X-Test-Request': `burst-${i}`,
                                }
                            })
                        );
                    }

                    const responses = await Promise.all(promises);
                    const rateLimited = responses.filter(r => r.status === 429).length;

                    results = {
                        totalRequests: promises.length,
                        rateLimited,
                        successRate: (promises.length - rateLimited) / promises.length,
                        protectionRate: rateLimited / promises.length,
                    };
                }
                break;

            default:
                return NextResponse.json({
                    success: false,
                    error: 'Invalid POST test type',
                    availableTests: ['ddos', 'custom'],
                }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            testType,
            results,
            config,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('Security test POST error:', error);
        return NextResponse.json({
            success: false,
            error: 'Security test failed',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
