import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Cleanup Long Test Durations API
 * 
 * This endpoint removes duration data from tests that exceed 200 minutes,
 * as these likely represent incomplete sessions that were manually marked as completed
 */

export async function POST(_request: NextRequest) {
    try {
        console.log('🧹 Starting cleanup of long test durations (>200 minutes)...');

        // 200 minutes = 200 * 60 * 1000 = 12,000,000 milliseconds
        const maxReasonableDuration = 200 * 60 * 1000;

        // First, find tests with duration > 200 minutes
        const longDurationTests = await prisma.usabilityTest.findMany({
            where: {
                totalDuration: {
                    gt: maxReasonableDuration
                }
            },
            select: {
                id: true,
                testId: true,
                participantName: true,
                totalDuration: true,
                status: true,
                startedAt: true,
                completedAt: true
            },
            orderBy: {
                totalDuration: 'desc'
            }
        });

        console.log(`🔍 Found ${longDurationTests.length} tests with duration > 200 minutes`);

        if (longDurationTests.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No tests found with duration > 200 minutes',
                affectedTests: 0,
                tests: []
            });
        }

        // Log details of tests to be cleaned up
        console.log('📊 Tests to be cleaned up:');
        longDurationTests.forEach(test => {
            const durationMinutes = test.totalDuration ? Math.round(test.totalDuration / 1000 / 60) : 0;
            console.log(`  - ${test.testId.substring(0, 12)}... (${test.participantName || 'Anonymous'}) - ${durationMinutes} minutes - Status: ${test.status}`);
        });

        // Update tests to remove duration (set to null)
        const updateResult = await prisma.usabilityTest.updateMany({
            where: {
                totalDuration: {
                    gt: maxReasonableDuration
                }
            },
            data: {
                totalDuration: null,
                updatedAt: new Date()
            }
        });

        console.log(`✅ Successfully removed duration from ${updateResult.count} tests`);

        // Prepare response data
        const cleanedTests = longDurationTests.map(test => ({
            testId: test.testId.substring(0, 12) + '...',
            participantName: test.participantName || 'Anonymous',
            originalDurationMinutes: test.totalDuration ? Math.round(test.totalDuration / 1000 / 60) : 0,
            status: test.status,
            startedAt: test.startedAt,
            completedAt: test.completedAt
        }));

        return NextResponse.json({
            success: true,
            message: `Successfully removed duration from ${updateResult.count} tests with duration > 200 minutes`,
            affectedTests: updateResult.count,
            maxDurationThreshold: '200 minutes',
            tests: cleanedTests,
            cleanupDate: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Failed to cleanup long test durations:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to cleanup long test durations',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

/**
 * GET - Preview tests that would be affected by cleanup
 * 
 * Returns a list of tests with duration > 200 minutes without making changes
 */
export async function GET(_request: NextRequest) {
    try {
        console.log('👀 Previewing tests with duration > 200 minutes...');

        // 200 minutes = 200 * 60 * 1000 = 12,000,000 milliseconds
        const maxReasonableDuration = 200 * 60 * 1000;

        const longDurationTests = await prisma.usabilityTest.findMany({
            where: {
                totalDuration: {
                    gt: maxReasonableDuration
                }
            },
            select: {
                id: true,
                testId: true,
                participantName: true,
                totalDuration: true,
                status: true,
                startedAt: true,
                completedAt: true
            },
            orderBy: {
                totalDuration: 'desc'
            }
        });

        console.log(`🔍 Found ${longDurationTests.length} tests with duration > 200 minutes`);

        const previewData = longDurationTests.map(test => ({
            testId: test.testId.substring(0, 12) + '...',
            participantName: test.participantName || 'Anonymous',
            durationMinutes: test.totalDuration ? Math.round(test.totalDuration / 1000 / 60) : 0,
            status: test.status,
            startedAt: test.startedAt,
            completedAt: test.completedAt
        }));

        return NextResponse.json({
            success: true,
            message: `Preview: ${longDurationTests.length} tests would be affected`,
            totalTests: longDurationTests.length,
            maxDurationThreshold: '200 minutes',
            tests: previewData,
            note: 'This is a preview only. Use POST to execute the cleanup.'
        });

    } catch (error) {
        console.error('❌ Failed to preview long test durations:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to preview long test durations',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

