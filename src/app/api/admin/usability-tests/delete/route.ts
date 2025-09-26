import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * DELETE - Remove individual usability test by testId
 * 
 * Removes a specific test record, responses, and interactions from the database
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const testId = searchParams.get('testId');

        if (!testId) {
            return NextResponse.json({
                success: false,
                error: 'testId parameter is required'
            }, { status: 400 });
        }

        console.log(`🗑️ Deleting individual test: ${testId}`);

        // Check if test exists
        const existingTest = await prisma.usabilityTest.findUnique({
            where: { testId },
            include: {
                responses: true,
                interactions: true
            }
        });

        if (!existingTest) {
            return NextResponse.json({
                success: false,
                error: 'Test not found'
            }, { status: 404 });
        }

        // Delete in correct order due to foreign key constraints
        // 1. Delete test interactions first
        const deletedInteractions = await prisma.testInteraction.deleteMany({
            where: { testId }
        });
        console.log(`🗑️ Deleted ${deletedInteractions.count} test interactions for ${testId}`);

        // 2. Delete usability responses
        const deletedResponses = await prisma.usabilityResponse.deleteMany({
            where: { testId }
        });
        console.log(`🗑️ Deleted ${deletedResponses.count} usability responses for ${testId}`);

        // 3. Delete the usability test
        const deletedTest = await prisma.usabilityTest.delete({
            where: { testId }
        });
        console.log(`🗑️ Deleted usability test: ${testId}`);

        const totalDeleted = deletedInteractions.count + deletedResponses.count + 1;

        console.log(`✅ Test deletion complete! Removed ${totalDeleted} total records for test ${testId}`);

        return NextResponse.json({
            success: true,
            message: `Test ${testId} has been deleted successfully`,
            deletedCounts: {
                test: 1,
                responses: deletedResponses.count,
                interactions: deletedInteractions.count,
                total: totalDeleted
            },
            deletedTest: {
                testId: deletedTest.testId,
                participantName: deletedTest.participantName,
                status: deletedTest.status,
                startedAt: deletedTest.startedAt
            }
        });

    } catch (error) {
        console.error('❌ Failed to delete individual test:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to delete test',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

/**
 * POST - Bulk delete tests older than specified date
 * 
 * Removes all test records created before the specified date
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { beforeDate } = body;

        if (!beforeDate) {
            return NextResponse.json({
                success: false,
                error: 'beforeDate parameter is required (ISO string format)'
            }, { status: 400 });
        }

        const cutoffDate = new Date(beforeDate);
        if (isNaN(cutoffDate.getTime())) {
            return NextResponse.json({
                success: false,
                error: 'Invalid date format. Use ISO string format.'
            }, { status: 400 });
        }

        console.log(`🗑️ Bulk deleting tests created before: ${cutoffDate.toISOString()}`);

        // First, find all tests to be deleted to get their testIds
        const testsToDelete = await prisma.usabilityTest.findMany({
            where: {
                startedAt: { lt: cutoffDate }
            },
            select: {
                testId: true,
                participantName: true,
                status: true,
                startedAt: true
            }
        });

        if (testsToDelete.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No tests found matching the date criteria',
                deletedCounts: {
                    tests: 0,
                    responses: 0,
                    interactions: 0,
                    total: 0
                },
                deletedTests: []
            });
        }

        const testIds = testsToDelete.map(test => test.testId);
        console.log(`🗑️ Found ${testsToDelete.length} tests to delete:`, testIds.slice(0, 5));

        // Delete in correct order due to foreign key constraints
        // 1. Delete test interactions first
        const deletedInteractions = await prisma.testInteraction.deleteMany({
            where: { testId: { in: testIds } }
        });
        console.log(`🗑️ Deleted ${deletedInteractions.count} test interactions`);

        // 2. Delete usability responses
        const deletedResponses = await prisma.usabilityResponse.deleteMany({
            where: { testId: { in: testIds } }
        });
        console.log(`🗑️ Deleted ${deletedResponses.count} usability responses`);

        // 3. Delete usability tests
        const deletedTests = await prisma.usabilityTest.deleteMany({
            where: { testId: { in: testIds } }
        });
        console.log(`🗑️ Deleted ${deletedTests.count} usability tests`);

        const totalDeleted = deletedInteractions.count + deletedResponses.count + deletedTests.count;

        console.log(`✅ Bulk test deletion complete! Removed ${totalDeleted} total records`);

        return NextResponse.json({
            success: true,
            message: `Deleted ${deletedTests.count} tests created before ${cutoffDate.toLocaleDateString()}`,
            deletedCounts: {
                tests: deletedTests.count,
                responses: deletedResponses.count,
                interactions: deletedInteractions.count,
                total: totalDeleted
            },
            deletedTests: testsToDelete,
            cutoffDate: cutoffDate.toISOString()
        });

    } catch (error) {
        console.error('❌ Failed to bulk delete tests:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to bulk delete tests',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
