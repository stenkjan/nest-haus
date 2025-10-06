import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/GoogleCalendarService';
import { EmailService } from '@/lib/EmailService';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for booking request
const bookingSchema = z.object({
    inquiryId: z.string().min(1, 'Anfrage-ID ist erforderlich'),
    appointmentDateTime: z.string().datetime('Ungültiges Datum/Zeit Format'),
    timeZone: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        console.log('📅 Processing calendar booking...');

        const body = await request.json();

        // Validate request data
        const validationResult = bookingSchema.safeParse(body);

        if (!validationResult.success) {
            console.error('❌ Validation failed:', validationResult.error.issues);
            return NextResponse.json(
                {
                    error: 'Ungültige Daten',
                    details: validationResult.error.issues
                },
                { status: 400 }
            );
        }

        const { inquiryId, appointmentDateTime, timeZone } = validationResult.data;

        // Get the customer inquiry
        const inquiry = await prisma.customerInquiry.findUnique({
            where: { id: inquiryId },
        });

        if (!inquiry) {
            return NextResponse.json(
                { error: 'Anfrage nicht gefunden' },
                { status: 404 }
            );
        }

        // Check if appointment is in the future
        const appointmentDate = new Date(appointmentDateTime);
        const now = new Date();

        if (appointmentDate <= now) {
            return NextResponse.json(
                { error: 'Termin muss in der Zukunft liegen' },
                { status: 400 }
            );
        }

        // Generate calendar event data
        const eventData = GoogleCalendarService.generateEventFromInquiry({
            ...inquiry,
            appointmentDateTime,
        });

        // Create calendar event
        const calendarEventId = await GoogleCalendarService.createAppointment(eventData);

        if (!calendarEventId) {
            return NextResponse.json(
                { error: 'Fehler beim Erstellen des Kalendereintrags' },
                { status: 500 }
            );
        }

        // Update inquiry with appointment details
        const updatedInquiry = await prisma.customerInquiry.update({
            where: { id: inquiryId },
            data: {
                followUpDate: appointmentDate,
                status: 'IN_PROGRESS',
                adminNotes: `Termin gebucht: ${appointmentDate.toLocaleString('de-DE')} (Kalender-ID: ${calendarEventId})`,
            },
        });

        // Send confirmation emails with calendar invite
        try {
            const emailData = {
                inquiryId: inquiry.id,
                name: inquiry.name || 'Kunde',
                email: inquiry.email,
                phone: inquiry.phone,
                message: inquiry.message,
                requestType: 'appointment' as const,
                preferredContact: inquiry.preferredContact,
                appointmentDateTime,
                configurationData: inquiry.configurationData,
                totalPrice: inquiry.totalPrice,
            };

            const adminEmailData = {
                ...emailData,
                sessionId: inquiry.sessionId,
                clientIP: 'calendar-booking',
                userAgent: 'calendar-api',
            };

            // Send emails with calendar information
            await Promise.all([
                EmailService.sendCustomerConfirmation(emailData),
                EmailService.sendAdminNotification(adminEmailData),
            ]);

            console.log('✅ Confirmation emails sent');
        } catch (emailError) {
            console.warn('⚠️ Email sending failed:', emailError);
            // Don't fail the booking if email fails
        }

        // Track the booking event
        if (inquiry.sessionId) {
            try {
                await prisma.interactionEvent.create({
                    data: {
                        sessionId: inquiry.sessionId,
                        eventType: 'appointment_booked',
                        category: 'conversion',
                        elementId: 'calendar_booking',
                        selectionValue: appointmentDateTime,
                        additionalData: {
                            inquiryId: inquiry.id,
                            calendarEventId,
                            appointmentDateTime,
                            timeZone: timeZone || 'Europe/Vienna',
                        },
                    },
                });
                console.log('📊 Booking event tracked');
            } catch (analyticsError) {
                console.warn('⚠️ Analytics tracking failed:', analyticsError);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Termin erfolgreich gebucht!',
            data: {
                inquiryId: inquiry.id,
                calendarEventId,
                appointmentDateTime,
                customerName: inquiry.name,
                customerEmail: inquiry.email,
                status: updatedInquiry.status,
            },
        });

    } catch (error) {
        console.error('❌ Error processing calendar booking:', error);

        return NextResponse.json(
            {
                error: 'Fehler beim Buchen des Termins',
                message: 'Der Termin konnte nicht gebucht werden. Bitte versuchen Sie es später erneut.',
            },
            { status: 500 }
        );
    }
}
