import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Cron job to expire PENDING appointments after 24 hours
 * This should be called by Vercel Cron Jobs or external cron service
 * 
 * Example vercel.json configuration:
 * {
 *   "crons": [{
 *     "path": "/api/cron/expire-appointments",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret (optional but recommended)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.log('🕐 Running appointment expiration cron job...');

        const now = new Date();

        // Find all PENDING appointments that have expired
        const expiredAppointments = await prisma.customerInquiry.findMany({
            where: {
                appointmentStatus: 'PENDING',
                appointmentExpiresAt: {
                    lt: now, // Less than now = expired
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                appointmentDateTime: true,
                appointmentExpiresAt: true,
            },
        });

        console.log(`📋 Found ${expiredAppointments.length} expired appointments`);

        if (expiredAppointments.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No expired appointments found',
                expired: 0,
            });
        }

        // Update all expired appointments
        const updateResult = await prisma.customerInquiry.updateMany({
            where: {
                appointmentStatus: 'PENDING',
                appointmentExpiresAt: {
                    lt: now,
                },
            },
            data: {
                appointmentStatus: 'EXPIRED',
                adminNotes: `Automatisch abgelaufen am ${now.toLocaleString('de-DE')} - 24h Bestätigungsfrist überschritten. Zeitfenster wieder verfügbar.`,
            },
        });

        console.log(`✅ Expired ${updateResult.count} appointments - time slots now available again`);

        // Log expired appointments for monitoring
        expiredAppointments.forEach(apt => {
            console.log(`  - ${apt.name} (${apt.email}) - ${apt.appointmentDateTime?.toLocaleString('de-DE')}`);
        });

        return NextResponse.json({
            success: true,
            message: `${updateResult.count} appointments expired and time slots released`,
            expired: updateResult.count,
            appointments: expiredAppointments.map(apt => ({
                id: apt.id,
                name: apt.name,
                email: apt.email,
                appointmentDateTime: apt.appointmentDateTime,
            })),
        });

    } catch (error) {
        console.error('❌ Cron job failed:', error);
        return NextResponse.json(
            { 
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

