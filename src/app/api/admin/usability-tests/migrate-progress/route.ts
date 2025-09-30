import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Migrate all IN_PROGRESS tests to COMPLETED status
 * This is a one-time migration for existing tests that were created before the new auto-completion rules
 */
export async function POST(_request: NextRequest) {
    try {
        console.log('🔄 Starting migration of IN_PROGRESS tests to COMPLETED...');

        // Find all tests that are still IN_PROGRESS
        const inProgressTests = await prisma.usabilityTest.findMany({
            where: {
                status: 'IN_PROGRESS'
            },
            include: {
                responses: true,
                interactions: true
            }
        });

        console.log(`📊 Found ${inProgressTests.length} tests in IN_PROGRESS status`);

        if (inProgressTests.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No IN_PROGRESS tests found to migrate',
                migratedCount: 0
            });
        }

        let migratedCount = 0;

        for (const test of inProgressTests) {
            try {
                // Calculate overall rating from responses if available
                const ratingResponses = test.responses.filter(r =>
                    r.questionType === 'RATING' &&
                    typeof r.response === 'object' &&
                    r.response &&
                    'value' in r.response
                );

                const overallRating = ratingResponses.length > 0
                    ? ratingResponses.reduce((sum, r) => {
                        const responseObj = r.response as { value: number };
                        return sum + responseObj.value;
                    }, 0) / ratingResponses.length
                    : null;

                // Calculate total duration if possible
                const totalDuration = test.startedAt
                    ? Date.now() - test.startedAt.getTime()
                    : null;

                // Update test to COMPLETED status
                await prisma.usabilityTest.update({
                    where: { id: test.id },
                    data: {
                        status: 'COMPLETED',
                        completedAt: new Date(),
                        overallRating,
                        totalDuration,
                        completionRate: 100, // Assume 100% for migrated tests
                        updatedAt: new Date()
                    }
                });

                // Record migration interaction
                await prisma.testInteraction.create({
                    data: {
                        testId: test.testId,
                        stepId: 'migration',
                        eventType: 'status_migrated',
                        success: true,
                        additionalData: {
                            fromStatus: 'IN_PROGRESS',
                            toStatus: 'COMPLETED',
                            migrationReason: 'Bulk migration of existing tests to prevent abandonment',
                            responseCount: test.responses.length,
                            interactionCount: test.interactions.length,
                            overallRating,
                            totalDuration
                        }
                    }
                });

                migratedCount++;
                console.log(`✅ Migrated test ${test.testId} (${test.participantName || 'Anonymous'}) to COMPLETED`);

            } catch (error) {
                console.error(`❌ Failed to migrate test ${test.testId}:`, error);
                // Continue with other tests even if one fails
            }
        }

        console.log(`🎉 Migration completed! Migrated ${migratedCount} out of ${inProgressTests.length} tests`);

        return NextResponse.json({
            success: true,
            message: `Successfully migrated ${migratedCount} tests from IN_PROGRESS to COMPLETED`,
            migratedCount,
            totalFound: inProgressTests.length,
            details: {
                migratedTests: inProgressTests.slice(0, 10).map(t => ({
                    testId: t.testId.substring(0, 8) + '...',
                    participantName: t.participantName || 'Anonymous',
                    startedAt: t.startedAt,
                    responseCount: t.responses.length,
                    interactionCount: t.interactions.length
                }))
            }
        });

    } catch (error) {
        console.error('❌ Migration failed:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to migrate IN_PROGRESS tests',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
