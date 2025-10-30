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
            error: 'Invalid action. Use ?action=remove, ?action=reset, or ?action=remove-old'
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

