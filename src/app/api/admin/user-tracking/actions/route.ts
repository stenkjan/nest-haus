/**
 * User Tracking Actions API
 * 
 * Provides endpoints for managing user tracking data:
 * - Remove all configurations (delete sessions)
 * - Reset all configurations (keep sessions but clear configurationData)
 * - Restore configurations (if we implement backup/restore)
 */

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * DELETE - Remove all configurations (delete all sessions with status IN_CART, COMPLETED, CONVERTED)
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        if (action === 'remove') {
            // Remove all sessions with configurations
            const result = await prisma.userSession.deleteMany({
                where: {
                    status: { in: ['IN_CART', 'COMPLETED', 'CONVERTED'] },
                    configurationData: { not: Prisma.JsonNull }
                }
            });

            console.log(`🗑️ Removed ${result.count} configurations (deleted sessions)`);

            return NextResponse.json({
                success: true,
                message: `Removed ${result.count} configurations`,
                deletedCount: result.count
            });
        }

        if (action === 'remove-old') {
            // Remove configurations prior to October 27, 2024
            const cutoffDate = new Date('2024-10-27T00:00:00.000Z');
            
            const result = await prisma.userSession.deleteMany({
                where: {
                    status: { in: ['IN_CART', 'COMPLETED', 'CONVERTED'] },
                    configurationData: { not: Prisma.JsonNull },
                    startTime: { lt: cutoffDate }
                }
            });

            console.log(`🗑️ Removed ${result.count} configurations before October 27, 2024`);

            return NextResponse.json({
                success: true,
                message: `Removed ${result.count} configurations prior to October 27, 2024`,
                deletedCount: result.count,
                cutoffDate: cutoffDate.toISOString()
            });
        }

        if (action === 'remove-by-age') {
            // Remove records older than specified days (default 7)
            const daysParam = new URL(request.url).searchParams.get('days');
            const days = daysParam ? parseInt(daysParam) : 7;
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            console.log(`🗑️ Removing records older than ${days} days (before ${cutoffDate.toISOString()})...`);

            // Delete UserSessions older than cutoff (cascades to InteractionEvent, SelectionEvent)
            const sessionsDeleted = await prisma.userSession.deleteMany({
                where: {
                    createdAt: { lt: cutoffDate }
                }
            });

            // Delete orphaned PerformanceMetrics (not tied to sessions)
            const metricsDeleted = await prisma.performanceMetric.deleteMany({
                where: {
                    timestamp: { lt: cutoffDate }
                }
            });

            // Delete old CustomerInquiries (but preserve PAID and appointments)
            const inquiriesDeleted = await prisma.customerInquiry.deleteMany({
                where: {
                    createdAt: { lt: cutoffDate },
                    AND: [
                        { paymentStatus: { not: 'PAID' } },
                        { 
                            OR: [
                                { requestType: { not: 'appointment' } },
                                { requestType: null }
                            ]
                        }
                    ]
                }
            });

            console.log(`✅ Cleanup complete: ${sessionsDeleted.count} sessions, ${metricsDeleted.count} metrics, ${inquiriesDeleted.count} inquiries`);

            return NextResponse.json({
                success: true,
                message: `Removed records older than ${days} days`,
                deletedCounts: {
                    sessions: sessionsDeleted.count,
                    metrics: metricsDeleted.count,
                    inquiries: inquiriesDeleted.count
                },
                cutoffDate: cutoffDate.toISOString()
            });
        }

        if (action === 'remove-until-nov15') {
            // One-time cleanup: Remove all records up to November 15, 2024
            const cutoffDate = new Date('2024-11-15T23:59:59.999Z');

            console.log(`🗑️ ONE-TIME CLEANUP: Removing records up to November 15, 2024...`);

            // Delete UserSessions before Nov 15 (cascades to InteractionEvent, SelectionEvent)
            const sessionsDeleted = await prisma.userSession.deleteMany({
                where: {
                    createdAt: { lte: cutoffDate }
                }
            });

            // Delete PerformanceMetrics before Nov 15
            const metricsDeleted = await prisma.performanceMetric.deleteMany({
                where: {
                    timestamp: { lte: cutoffDate }
                }
            });

            // Delete CustomerInquiries before Nov 15 (preserve PAID and appointments)
            const inquiriesDeleted = await prisma.customerInquiry.deleteMany({
                where: {
                    createdAt: { lte: cutoffDate },
                    AND: [
                        { paymentStatus: { not: 'PAID' } },
                        { 
                            OR: [
                                { requestType: { not: 'appointment' } },
                                { requestType: null }
                            ]
                        }
                    ]
                }
            });

            console.log(`✅ ONE-TIME CLEANUP COMPLETE:`);
            console.log(`   - Sessions deleted: ${sessionsDeleted.count}`);
            console.log(`   - Metrics deleted: ${metricsDeleted.count}`);
            console.log(`   - Inquiries deleted: ${inquiriesDeleted.count}`);

            return NextResponse.json({
                success: true,
                message: `One-time cleanup complete: Removed all records up to November 15, 2024`,
                deletedCounts: {
                    sessions: sessionsDeleted.count,
                    metrics: metricsDeleted.count,
                    inquiries: inquiriesDeleted.count
                },
                cutoffDate: cutoffDate.toISOString()
            });
        }

        if (action === 'reset') {
            // Reset all configurations (clear configurationData but keep sessions)
            const result = await prisma.userSession.updateMany({
                where: {
                    status: { in: ['IN_CART', 'COMPLETED', 'CONVERTED'] },
                    configurationData: { not: Prisma.JsonNull }
                },
                data: {
                    configurationData: Prisma.JsonNull,
                    totalPrice: null,
                    status: 'ABANDONED' // Reset status since config is cleared
                }
            });

            console.log(`🔄 Reset ${result.count} configurations`);

            return NextResponse.json({
                success: true,
                message: `Reset ${result.count} configurations`,
                resetCount: result.count
            });
        }

        return NextResponse.json({
            success: false,
            error: 'Invalid action. Use ?action=remove, ?action=reset, ?action=remove-old, ?action=remove-by-age, or ?action=remove-until-nov15'
        }, { status: 400 });

    } catch (error) {
        console.error('❌ User tracking action error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to perform action',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

