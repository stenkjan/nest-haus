/**
 * Security Testing Suite for NEST-Haus
 * 
 * This file contains various testing scenarios to validate
 * the security implementations including DDoS protection,
 * bot detection, and behavioral analysis.
 * 
 * ⚠️ WARNING: Only use these tests on your own development/staging environment!
 */

import { NextRequest, NextResponse } from 'next/server';
import { SecurityMiddleware } from '@/lib/security/SecurityMiddleware';

// Test configuration
const TEST_CONFIG = {
    // DDoS simulation settings
    ddos: {
        requestsPerSecond: 50,
        duration: 10, // seconds
        concurrentConnections: 20,
    },
    // Bot simulation settings
    bot: {
        userAgents: [
            'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            'HeadlessChrome/91.0.4472.124',
            'PhantomJS/2.1.1',
            'selenium-webdriver',
            'puppeteer-core',
        ],
        requestPatterns: {
            perfectTiming: true,
            noMouseMovement: true,
            rapidClicks: true,
        }
    },
    // Rate limiting test
    rateLimit: {
        burstSize: 100,
        timeWindow: 60, // seconds
    }
};

/**
 * DDoS Simulation Test
 * Tests rate limiting and DDoS protection
 */
export async function simulateDDoS(targetEndpoint: string = '/api/security/dashboard') {
    console.log('🚨 Starting DDoS simulation test...');
    console.log(`Target: ${targetEndpoint}`);
    console.log(`Config: ${TEST_CONFIG.ddos.requestsPerSecond} req/sec for ${TEST_CONFIG.ddos.duration} seconds`);

    const results = {
        totalRequests: 0,
        successfulRequests: 0,
        rateLimitedRequests: 0,
        errorRequests: 0,
        averageResponseTime: 0,
        startTime: Date.now(),
        endTime: 0,
    };

    const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://your-domain.com';

    // Function to make a single request
    const makeRequest = async (requestId: number): Promise<{ success: boolean; responseTime: number; status: number }> => {
        const startTime = Date.now();

        try {
            const response = await fetch(`${baseUrl}${targetEndpoint}`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'DDoS-Test-Client',
                    'X-Test-Request': `ddos-${requestId}`,
                    'X-Session-ID': `test-session-${Math.floor(requestId / 10)}`, // Group requests by session
                },
            });

            const responseTime = Date.now() - startTime;

            return {
                success: response.ok,
                responseTime,
                status: response.status,
            };
        } catch (error) {
            return {
                success: false,
                responseTime: Date.now() - startTime,
                status: 0,
            };
        }
    };

    // Create request batches
    const requestPromises: Promise<any>[] = [];
    const totalRequests = TEST_CONFIG.ddos.requestsPerSecond * TEST_CONFIG.ddos.duration;
    const requestInterval = 1000 / TEST_CONFIG.ddos.requestsPerSecond;

    for (let i = 0; i < totalRequests; i++) {
        const delay = (i % TEST_CONFIG.ddos.requestsPerSecond) * requestInterval;

        const requestPromise = new Promise(resolve => {
            setTimeout(async () => {
                const result = await makeRequest(i);
                results.totalRequests++;

                if (result.success) {
                    results.successfulRequests++;
                } else if (result.status === 429) {
                    results.rateLimitedRequests++;
                } else {
                    results.errorRequests++;
                }

                resolve(result);
            }, delay + Math.floor(i / TEST_CONFIG.ddos.requestsPerSecond) * 1000);
        });

        requestPromises.push(requestPromise);
    }

    // Execute all requests
    const requestResults = await Promise.all(requestPromises);

    results.endTime = Date.now();
    results.averageResponseTime = requestResults.reduce((sum: number, result: any) => sum + result.responseTime, 0) / requestResults.length;

    // Print results
    console.log('\n📊 DDoS Simulation Results:');
    console.log(`Total Duration: ${(results.endTime - results.startTime) / 1000}s`);
    console.log(`Total Requests: ${results.totalRequests}`);
    console.log(`Successful Requests: ${results.successfulRequests} (${(results.successfulRequests / results.totalRequests * 100).toFixed(1)}%)`);
    console.log(`Rate Limited: ${results.rateLimitedRequests} (${(results.rateLimitedRequests / results.totalRequests * 100).toFixed(1)}%)`);
    console.log(`Errors: ${results.errorRequests} (${(results.errorRequests / results.totalRequests * 100).toFixed(1)}%)`);
    console.log(`Average Response Time: ${results.averageResponseTime.toFixed(2)}ms`);

    // Evaluate protection effectiveness
    const protectionEffectiveness = results.rateLimitedRequests / results.totalRequests;
    if (protectionEffectiveness > 0.7) {
        console.log('✅ DDoS Protection: EXCELLENT (>70% requests rate limited)');
    } else if (protectionEffectiveness > 0.5) {
        console.log('⚠️ DDoS Protection: GOOD (50-70% requests rate limited)');
    } else {
        console.log('❌ DDoS Protection: NEEDS IMPROVEMENT (<50% requests rate limited)');
    }

    return results;
}

/**
 * Bot Detection Test
 * Tests various bot detection mechanisms
 */
export async function testBotDetection() {
    console.log('🤖 Starting Bot Detection Test...');

    const results = {
        totalTests: 0,
        detectedAsBots: 0,
        falsePositives: 0,
        falseNegatives: 0,
    };

    const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://your-domain.com';

    // Test 1: Known bot user agents
    console.log('\n🔍 Testing known bot user agents...');
    for (const userAgent of TEST_CONFIG.bot.userAgents) {
        try {
            const response = await fetch(`${baseUrl}/api/security/dashboard`, {
                headers: {
                    'User-Agent': userAgent,
                    'X-Test-Type': 'bot-detection',
                },
            });

            results.totalTests++;

            // Check if request was blocked or flagged
            if (response.status === 403) {
                results.detectedAsBots++;
                console.log(`✅ Detected: ${userAgent.substring(0, 50)}...`);
            } else {
                console.log(`⚠️ Not blocked: ${userAgent.substring(0, 50)}...`);
            }
        } catch (error) {
            console.log(`❌ Error testing: ${userAgent.substring(0, 50)}...`);
        }
    }

    // Test 2: Behavioral bot patterns
    console.log('\n🔍 Testing behavioral bot patterns...');

    // Simulate perfect timing (bot-like behavior)
    const perfectTimingTest = async () => {
        const requests = [];
        for (let i = 0; i < 10; i++) {
            requests.push(
                fetch(`${baseUrl}/api/security/events`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'X-Session-ID': 'perfect-timing-test',
                        'X-Test-Type': 'perfect-timing',
                    },
                })
            );

            // Perfect 100ms intervals (very bot-like)
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return Promise.all(requests);
    };

    try {
        const timingResults = await perfectTimingTest();
        const blockedRequests = timingResults.filter(r => r.status === 403).length;

        results.totalTests += 10;
        results.detectedAsBots += blockedRequests;

        console.log(`Perfect timing test: ${blockedRequests}/10 requests blocked`);
    } catch (error) {
        console.log('❌ Error in perfect timing test');
    }

    // Test 3: Rapid burst requests (bot-like)
    console.log('\n🔍 Testing rapid burst requests...');

    try {
        const burstRequests = Array.from({ length: 20 }, (_, i) =>
            fetch(`${baseUrl}/api/security/dashboard`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'X-Session-ID': 'burst-test',
                    'X-Test-Type': 'rapid-burst',
                },
            })
        );

        const burstResults = await Promise.all(burstRequests);
        const blockedBurst = burstResults.filter(r => r.status === 403 || r.status === 429).length;

        results.totalTests += 20;
        results.detectedAsBots += blockedBurst;

        console.log(`Rapid burst test: ${blockedBurst}/20 requests blocked`);
    } catch (error) {
        console.log('❌ Error in rapid burst test');
    }

    // Print results
    console.log('\n📊 Bot Detection Results:');
    console.log(`Total Tests: ${results.totalTests}`);
    console.log(`Detected as Bots: ${results.detectedAsBots} (${(results.detectedAsBots / results.totalTests * 100).toFixed(1)}%)`);

    const detectionRate = results.detectedAsBots / results.totalTests;
    if (detectionRate > 0.8) {
        console.log('✅ Bot Detection: EXCELLENT (>80% detection rate)');
    } else if (detectionRate > 0.6) {
        console.log('⚠️ Bot Detection: GOOD (60-80% detection rate)');
    } else {
        console.log('❌ Bot Detection: NEEDS IMPROVEMENT (<60% detection rate)');
    }

    return results;
}

/**
 * Behavioral Analysis Test
 * Tests behavioral pattern detection
 */
export async function testBehavioralAnalysis() {
    console.log('🧠 Starting Behavioral Analysis Test...');

    const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://your-domain.com';

    const sessionId = `behavioral-test-${Date.now()}`;

    // Test 1: Simulate human-like behavior
    console.log('\n👤 Simulating human-like behavior...');

    const humanBehavior = async () => {
        // Simulate realistic mouse movements, clicks, and pauses
        const events = [
            { type: 'mouse_move', delay: 150 + Math.random() * 100 },
            { type: 'mouse_move', delay: 200 + Math.random() * 150 },
            { type: 'click', delay: 300 + Math.random() * 200 },
            { type: 'scroll', delay: 500 + Math.random() * 300 },
            { type: 'keystroke', delay: 180 + Math.random() * 120 },
            { type: 'mouse_move', delay: 250 + Math.random() * 200 },
        ];

        for (const event of events) {
            await new Promise(resolve => setTimeout(resolve, event.delay));

            // Send behavioral data to API
            try {
                await fetch(`${baseUrl}/api/security/events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Session-ID': sessionId,
                    },
                    body: JSON.stringify({
                        sessionId,
                        interaction: {
                            eventType: event.type,
                            category: 'behavioral_test',
                            elementId: 'test-element',
                            timeSpent: event.delay,
                            deviceInfo: {
                                type: 'desktop',
                                width: 1920,
                                height: 1080,
                            },
                        },
                    }),
                });
            } catch (error) {
                console.log(`Error sending ${event.type} event:`, error);
            }
        }
    };

    await humanBehavior();

    // Test 2: Analyze the behavior
    console.log('\n📊 Analyzing behavior patterns...');

    try {
        const analysisResponse = await fetch(`${baseUrl}/api/security/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId,
                forceAnalysis: true,
            }),
        });

        if (analysisResponse.ok) {
            const analysisResult = await analysisResponse.json();

            console.log('\n📊 Behavioral Analysis Results:');
            console.log(`Session ID: ${sessionId}`);
            console.log(`Overall Risk: ${(analysisResult.data.overallRisk * 100).toFixed(1)}%`);
            console.log(`Risk Level: ${analysisResult.data.riskLevel}`);
            console.log(`Bot Probability: ${(analysisResult.data.behaviorAnalysis.botProbability * 100).toFixed(1)}%`);
            console.log(`Human Likelihood: ${(analysisResult.data.behaviorAnalysis.humanLikelihood * 100).toFixed(1)}%`);
            console.log(`Confidence: ${(analysisResult.data.behaviorAnalysis.confidence * 100).toFixed(1)}%`);

            if (analysisResult.data.behaviorAnalysis.anomalies.length > 0) {
                console.log(`Anomalies: ${analysisResult.data.behaviorAnalysis.anomalies.join(', ')}`);
            }

            return analysisResult.data;
        } else {
            console.log('❌ Failed to get behavioral analysis');
        }
    } catch (error) {
        console.log('❌ Error in behavioral analysis:', error);
    }
}

/**
 * Content Protection Test
 * Tests content protection violations
 */
export async function testContentProtection() {
    console.log('🛡️ Starting Content Protection Test...');

    // This test would typically be done in the browser console
    // Here's the client-side code to test content protection:

    const clientSideTest = `
// Run this in your browser console on a page with ProtectedContent

// Test 1: Right-click simulation
console.log('Testing right-click protection...');
const protectedElement = document.querySelector('[data-protection-level]');
if (protectedElement) {
  const rightClickEvent = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  protectedElement.dispatchEvent(rightClickEvent);
}

// Test 2: Copy attempt simulation
console.log('Testing copy protection...');
document.execCommand('selectAll');
const copyEvent = new ClipboardEvent('copy', {
  bubbles: true,
  cancelable: true
});
document.dispatchEvent(copyEvent);

// Test 3: Keyboard shortcut simulation
console.log('Testing keyboard shortcut protection...');
const ctrlCEvent = new KeyboardEvent('keydown', {
  key: 'c',
  ctrlKey: true,
  bubbles: true,
  cancelable: true
});
document.dispatchEvent(ctrlCEvent);

// Test 4: Drag attempt simulation
console.log('Testing drag protection...');
if (protectedElement) {
  const dragEvent = new DragEvent('dragstart', {
    bubbles: true,
    cancelable: true
  });
  protectedElement.dispatchEvent(dragEvent);
}

console.log('Content protection tests completed. Check console for violation logs.');
  `;

    console.log('\n🌐 Client-side content protection test:');
    console.log('Copy and paste this code into your browser console on a page with ProtectedContent:');
    console.log('\n' + clientSideTest);

    return { clientSideTest };
}

/**
 * Run all security tests
 */
export async function runAllSecurityTests() {
    console.log('🔒 Starting Comprehensive Security Test Suite...\n');

    const results = {
        ddos: null as any,
        botDetection: null as any,
        behavioralAnalysis: null as any,
        contentProtection: null as any,
        startTime: Date.now(),
        endTime: 0,
    };

    try {
        // Run DDoS simulation
        results.ddos = await simulateDDoS();

        // Wait a bit between tests
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Run bot detection tests
        results.botDetection = await testBotDetection();

        // Wait a bit between tests
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Run behavioral analysis test
        results.behavioralAnalysis = await testBehavioralAnalysis();

        // Content protection test (instructions only)
        results.contentProtection = await testContentProtection();

        results.endTime = Date.now();

        // Summary
        console.log('\n🎯 SECURITY TEST SUMMARY');
        console.log('='.repeat(50));
        console.log(`Total Test Duration: ${(results.endTime - results.startTime) / 1000}s`);
        console.log('\nTest Results:');

        if (results.ddos) {
            const ddosEffectiveness = results.ddos.rateLimitedRequests / results.ddos.totalRequests;
            console.log(`📊 DDoS Protection: ${(ddosEffectiveness * 100).toFixed(1)}% effectiveness`);
        }

        if (results.botDetection) {
            const botDetectionRate = results.botDetection.detectedAsBots / results.botDetection.totalTests;
            console.log(`🤖 Bot Detection: ${(botDetectionRate * 100).toFixed(1)}% detection rate`);
        }

        if (results.behavioralAnalysis) {
            console.log(`🧠 Behavioral Analysis: ${results.behavioralAnalysis.riskLevel} risk level detected`);
        }

        console.log('🛡️ Content Protection: Manual browser testing required');

        console.log('\n✅ All security tests completed!');

    } catch (error) {
        console.error('❌ Error running security tests:', error);
    }

    return results;
}

// Export test functions for individual use
export {
    TEST_CONFIG,
};
