import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * DELETE - Delete individual usability test
 * 
 * Removes a specific test record and all associated data from the database
 */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ testId: string }> }
) {
    try {
        const { testId } = await params;

        if (!testId) {
            return NextResponse.json({
                success: false,
                error: 'Test ID is required'
            }, { status: 400 });
        }

        console.log(`🗑️ Starting individual test deletion for testId: ${testId}`);

        // Check if test exists
        const existingTest = await prisma.usabilityTest.findUnique({
            where: { testId },
            include: {
                _count: {
                    select: {
                        responses: true,
                        interactions: true
                    }
                }
            }
        });

        if (!existingTest) {
            return NextResponse.json({
                success: false,
                error: 'Test not found'
            }, { status: 404 });
        }

        console.log(`🗑️ Found test with ${existingTest._count.responses} responses and ${existingTest._count.interactions} interactions`);

        // Delete in correct order due to foreign key constraints
        // 1. Delete test interactions first
        const deletedInteractions = await prisma.testInteraction.deleteMany({
            where: { testId: existingTest.id }
        });
        console.log(`🗑️ Deleted ${deletedInteractions.count} test interactions`);

        // 2. Delete usability responses
        const deletedResponses = await prisma.usabilityResponse.deleteMany({
            where: { testId: existingTest.id }
        });
        console.log(`🗑️ Deleted ${deletedResponses.count} usability responses`);

        // 3. Delete the usability test
        const deletedTest = await prisma.usabilityTest.delete({
            where: { testId }
        });
        console.log(`🗑️ Deleted usability test: ${deletedTest.testId}`);

        const totalDeleted = deletedInteractions.count + deletedResponses.count + 1; // +1 for the test itself

        console.log(`✅ Individual test deletion complete! Removed ${totalDeleted} total records for test ${testId}`);

        return NextResponse.json({
            success: true,
            message: `Test ${testId} has been deleted successfully`,
            deletedCounts: {
                tests: 1,
                responses: deletedResponses.count,
                interactions: deletedInteractions.count,
                total: totalDeleted
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

