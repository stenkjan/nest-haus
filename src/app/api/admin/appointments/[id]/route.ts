import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleCalendarService } from '@/lib/GoogleCalendarService';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { action } = body; // 'confirm' or 'reject'

        console.log(`📅 Processing appointment ${action} for inquiry ${id}`);

        // Fetch the inquiry
        const inquiry = await prisma.customerInquiry.findUnique({
            where: { id },
        });

        if (!inquiry) {
            return NextResponse.json(
                { error: 'Anfrage nicht gefunden' },
                { status: 404 }
            );
        }

        if (inquiry.appointmentStatus !== 'PENDING') {
            return NextResponse.json(
                { error: 'Termin ist nicht im PENDING Status' },
                { status: 400 }
            );
        }

        if (!inquiry.appointmentDateTime) {
            return NextResponse.json(
                { error: 'Kein Terminwunsch vorhanden' },
                { status: 400 }
            );
        }

        // Check if appointment has expired
        if (inquiry.appointmentExpiresAt && inquiry.appointmentExpiresAt < new Date()) {
            await prisma.customerInquiry.update({
                where: { id },
                data: {
                    appointmentStatus: 'EXPIRED',
                    adminNotes: `${inquiry.adminNotes || ''}\n\n24h Timeout abgelaufen - Termin automatisch abgelaufen`,
                },
            });

            return NextResponse.json(
                { error: 'Termin ist abgelaufen (24h Timeout)' },
                { status: 410 }
            );
        }

        if (action === 'confirm') {
            console.log('✅ Confirming appointment...');

            // Create Google Calendar event
            const appointmentEnd = new Date(inquiry.appointmentDateTime);
            appointmentEnd.setHours(appointmentEnd.getHours() + 1); // 1 hour duration

            const calendarResult = await GoogleCalendarService.createEvent({
                summary: `Beratungsgespräch: ${inquiry.name || 'Kunde'}`,
                description: `Terminanfrage von ${inquiry.name}\nE-Mail: ${inquiry.email}\nTelefon: ${inquiry.phone || 'Nicht angegeben'}\n\nAnfrage-ID: ${inquiry.id}`,
                location: 'NEST-Haus Office oder Online',
                startDateTime: inquiry.appointmentDateTime.toISOString(),
                endDateTime: appointmentEnd.toISOString(),
                attendeeEmail: inquiry.email,
                attendeeName: inquiry.name || undefined,
            });

            // Update inquiry status
            await prisma.customerInquiry.update({
                where: { id },
                data: {
                    appointmentStatus: 'CONFIRMED',
                    appointmentConfirmedAt: new Date(),
                    calendarEventId: calendarResult.eventId || null,
                    status: 'CONTACTED', // Update main status too
                    adminNotes: `${inquiry.adminNotes || ''}\n\n✅ Termin bestätigt am ${new Date().toLocaleString('de-DE')}\nGoogle Calendar Event ID: ${calendarResult.eventId || 'N/A'}`,
                },
            });

            // TODO: Send confirmation email to customer
            // This would use EmailService to send calendar invite

            console.log('✅ Appointment confirmed and calendar event created');

            return NextResponse.json({
                success: true,
                message: 'Termin bestätigt und Kalendereinladung gesendet',
                calendarEventId: calendarResult.eventId,
            });

        } else if (action === 'reject') {
            console.log('❌ Rejecting appointment...');

            // Update inquiry status
            await prisma.customerInquiry.update({
                where: { id },
                data: {
                    appointmentStatus: 'CANCELLED',
                    status: 'CONTACTED', // Admin should follow up with alternative dates
                    adminNotes: `${inquiry.adminNotes || ''}\n\n❌ Termin abgelehnt am ${new Date().toLocaleString('de-DE')} - Alternative Termine vorschlagen`,
                },
            });

            // TODO: Send rejection email to customer with alternative time suggestions
            // This would use EmailService

            console.log('✅ Appointment rejected');

            return NextResponse.json({
                success: true,
                message: 'Termin abgelehnt - Kunde sollte alternative Zeiten erhalten',
            });

        } else {
            return NextResponse.json(
                { error: 'Ungültige Aktion (nur "confirm" oder "reject")' },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('❌ Error processing appointment action:', error);
        return NextResponse.json(
            { error: 'Interner Serverfehler' },
            { status: 500 }
        );
    }
}

