import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/EmailService';
import { generateAppointmentReminderEmail } from '@/lib/emailTemplates/AppointmentReminderTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour ahead

        // Step 1: Send 1-hour reminders for appointments about to expire
        const upcomingExpirations = await prisma.customerInquiry.findMany({
            where: {
                appointmentStatus: 'PENDING',
                appointmentExpiresAt: {
                    gt: now, // Not yet expired
                    lt: oneHourFromNow, // But will expire within 1 hour
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                appointmentDateTime: true,
                appointmentExpiresAt: true,
                adminNotes: true,
            },
        });

        console.log(`📧 Found ${upcomingExpirations.length} appointments expiring within 1 hour`);

        // Send reminder emails
        let remindersSent = 0;
        for (const appointment of upcomingExpirations) {
            // Check if reminder already sent (look for marker in adminNotes)
            if (appointment.adminNotes?.includes('1-Stunden-Erinnerung gesendet')) {
                console.log(`⏭️ Skipping reminder for ${appointment.email} - already sent`);
                continue;
            }

            try {
                const { subject, html, text } = generateAppointmentReminderEmail({
                    name: appointment.name || 'Kunde',
                    email: appointment.email,
                    appointmentDateTime: appointment.appointmentDateTime?.toISOString() || '',
                    expiresAt: appointment.appointmentExpiresAt?.toISOString() || '',
                    inquiryId: appointment.id,
                });

                // Send reminder to customer
                const result = await resend.emails.send({
                    from: `NEST-Haus Team <${process.env.RESEND_FROM_EMAIL || 'mail@nest-haus.at'}>`,
                    to: appointment.email,
                    subject,
                    html,
                    text,
                });

                // Check for Resend API errors
                if (result.error) {
                    console.error(`❌ Failed to send reminder to ${appointment.email}:`, result.error);
                    continue; // Skip marking as sent if email failed
                }

                // Mark reminder as sent in admin notes only if email was successful
                await prisma.customerInquiry.update({
                    where: { id: appointment.id },
                    data: {
                        adminNotes: `${appointment.adminNotes || ''}\n1-Stunden-Erinnerung gesendet am ${now.toLocaleString('de-DE')} (Email ID: ${result.data?.id || 'unknown'})`,
                    },
                });

                console.log(`✅ Reminder sent to ${appointment.email} (ID: ${result.data?.id})`);
                remindersSent++;
            } catch (error) {
                console.error(`❌ Failed to send reminder to ${appointment.email}:`, error);
            }
        }

        console.log(`✅ Sent ${remindersSent} reminder emails`);

        // Step 2: Find all PENDING appointments that have expired
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
            message: `${updateResult.count} appointments expired and time slots released. ${remindersSent} reminders sent.`,
            expired: updateResult.count,
            remindersSent,
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

