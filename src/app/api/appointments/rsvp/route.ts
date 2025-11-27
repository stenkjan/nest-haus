import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleCalendarService } from '@/lib/GoogleCalendarService';
import { z } from 'zod';

// Validation schema for RSVP request
const rsvpSchema = z.object({
  inquiryId: z.string().min(1, 'Inquiry ID is required'),
  action: z.enum(['accept', 'decline']),
  token: z.string().optional(), // Security token for validation
});

type RSVPRequest = z.infer<typeof rsvpSchema>;

/**
 * Handle RSVP confirmation for appointment bookings
 * 
 * POST /api/appointments/rsvp
 * 
 * When a customer accepts the ICS calendar invitation, this endpoint:
 * - Validates the inquiry exists and is PENDING
 * - Updates status to CONFIRMED
 * - Creates Google Calendar event
 * - Clears expiration timer
 * - Sends confirmation emails
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📅 Processing RSVP confirmation...');

    const body = await request.json();

    // Validate request data
    const validationResult = rsvpSchema.safeParse(body);

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

    const data: RSVPRequest = validationResult.data;

    // Fetch the inquiry
    const inquiry = await prisma.customerInquiry.findUnique({
      where: { id: data.inquiryId },
    });

    if (!inquiry) {
      console.error(`❌ Inquiry not found: ${data.inquiryId}`);
      return NextResponse.json(
        { error: 'Anfrage nicht gefunden' },
        { status: 404 }
      );
    }

    // Validate inquiry is for an appointment
    if (inquiry.requestType !== 'appointment') {
      console.error(`❌ Inquiry is not an appointment: ${data.inquiryId}`);
      return NextResponse.json(
        { error: 'Diese Anfrage ist kein Termin' },
        { status: 400 }
      );
    }

    // Validate token if provided
    if (data.token && inquiry.confirmationToken !== data.token) {
      console.error(`❌ Invalid confirmation token for inquiry: ${data.inquiryId}`);
      return NextResponse.json(
        { error: 'Ungültiger Bestätigungstoken' },
        { status: 403 }
      );
    }

    // Check if inquiry is in PENDING status
    if (inquiry.appointmentStatus !== 'PENDING') {
      console.warn(`⚠️ Inquiry is not PENDING (status: ${inquiry.appointmentStatus})`);
      
      if (inquiry.appointmentStatus === 'CONFIRMED') {
        return NextResponse.json({
          success: true,
          message: 'Termin bereits bestätigt',
          alreadyConfirmed: true,
        });
      }

      return NextResponse.json(
        {
          error: 'Termin kann nicht mehr bestätigt werden',
          currentStatus: inquiry.appointmentStatus,
        },
        { status: 400 }
      );
    }

    // Check if appointment has expired
    if (inquiry.appointmentExpiresAt && inquiry.appointmentExpiresAt < new Date()) {
      console.warn(`⚠️ Appointment has expired: ${data.inquiryId}`);
      
      // Update status to EXPIRED
      await prisma.customerInquiry.update({
        where: { id: data.inquiryId },
        data: {
          appointmentStatus: 'EXPIRED',
          adminNotes: `${inquiry.adminNotes || ''}\nTermin am ${new Date().toISOString()} abgelaufen - RSVP zu spät`,
        },
      });

      return NextResponse.json(
        {
          error: 'Termin ist abgelaufen',
          message: 'Der Termin konnte nicht bestätigt werden, da die 24-Stunden-Frist abgelaufen ist.',
        },
        { status: 410 }
      );
    }

    // Handle ACCEPT action
    if (data.action === 'accept') {
      console.log(`✅ Accepting appointment: ${data.inquiryId}`);

      if (!inquiry.appointmentDateTime) {
        console.error(`❌ No appointment date/time set for inquiry: ${data.inquiryId}`);
        return NextResponse.json(
          { error: 'Kein Termin festgelegt' },
          { status: 400 }
        );
      }

      // Create Google Calendar event
      const endDateTime = new Date(inquiry.appointmentDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + 60); // 60 minutes duration

      const calendarResult = await GoogleCalendarService.createEvent({
        summary: `NEST-Haus Beratungstermin - ${inquiry.name || 'Kunde'}`,
        description: `Beratungstermin mit ${inquiry.name || 'Kunde'}\n\nE-Mail: ${inquiry.email}\n${inquiry.phone ? `Telefon: ${inquiry.phone}\n` : ''}${inquiry.message ? `\nNachricht:\n${inquiry.message}` : ''}\n\nAnfrage-ID: ${inquiry.id}`,
        location: 'NEST-Haus Office, Karmeliterplatz 8, 8010 Graz, Austria',
        startDateTime: inquiry.appointmentDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        attendeeEmail: inquiry.email,
        attendeeName: inquiry.name || undefined,  // Convert null to undefined for type compatibility
        inquiryId: inquiry.id,  // Pass inquiryId for UID consistency with ICS
      });

      if (!calendarResult.success) {
        console.error(`❌ Failed to create calendar event: ${calendarResult.error}`);
        return NextResponse.json(
          {
            error: 'Fehler beim Erstellen des Kalendereintrags',
            details: calendarResult.error,
          },
          { status: 500 }
        );
      }

      console.log(`✅ Calendar event created: ${calendarResult.eventId}`);

      // Update inquiry status
      await prisma.customerInquiry.update({
        where: { id: data.inquiryId },
        data: {
          appointmentStatus: 'CONFIRMED',
          appointmentExpiresAt: null, // Clear expiration
          adminNotes: `${inquiry.adminNotes || ''}\nTermin bestätigt am ${new Date().toISOString()}\nGoogle Calendar Event ID: ${calendarResult.eventId}`,
        },
      });

      console.log(`✅ Inquiry updated to CONFIRMED: ${data.inquiryId}`);

      // TODO: Send confirmation emails to customer and admin
      // This can be implemented later with EmailService.sendAppointmentConfirmation()

      return NextResponse.json({
        success: true,
        message: 'Termin erfolgreich bestätigt',
        calendarEventId: calendarResult.eventId,
      });
    }

    // Handle DECLINE action
    if (data.action === 'decline') {
      console.log(`❌ Declining appointment: ${data.inquiryId}`);

      // Update inquiry status
      await prisma.customerInquiry.update({
        where: { id: data.inquiryId },
        data: {
          appointmentStatus: 'CANCELLED',
          appointmentExpiresAt: null, // Clear expiration
          adminNotes: `${inquiry.adminNotes || ''}\nTermin abgelehnt am ${new Date().toISOString()} durch Kunden-RSVP`,
        },
      });

      console.log(`✅ Inquiry updated to CANCELLED: ${data.inquiryId}`);

      // TODO: Send notification to admin about cancellation
      // This can be implemented later with EmailService.sendAppointmentCancellation()

      return NextResponse.json({
        success: true,
        message: 'Termin erfolgreich abgelehnt',
      });
    }

    // Should never reach here due to validation
    return NextResponse.json(
      { error: 'Ungültige Aktion' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ Error processing RSVP:', error);

    return NextResponse.json(
      {
        error: 'Interner Serverfehler',
        message: 'Die RSVP-Bestätigung konnte nicht verarbeitet werden.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check RSVP status
 * 
 * GET /api/appointments/rsvp?inquiryId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const inquiryId = searchParams.get('inquiryId');

    if (!inquiryId) {
      return NextResponse.json(
        { error: 'Inquiry ID is required' },
        { status: 400 }
      );
    }

    const inquiry = await prisma.customerInquiry.findUnique({
      where: { id: inquiryId },
      select: {
        id: true,
        appointmentStatus: true,
        appointmentDateTime: true,
        appointmentExpiresAt: true,
        requestType: true,
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    if (inquiry.requestType !== 'appointment') {
      return NextResponse.json(
        { error: 'Not an appointment' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      inquiryId: inquiry.id,
      status: inquiry.appointmentStatus,
      appointmentDateTime: inquiry.appointmentDateTime,
      expiresAt: inquiry.appointmentExpiresAt,
      isExpired: inquiry.appointmentExpiresAt ? inquiry.appointmentExpiresAt < new Date() : false,
    });

  } catch (error) {
    console.error('❌ Error checking RSVP status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

