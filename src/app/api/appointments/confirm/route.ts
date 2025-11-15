import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleCalendarService } from '@/lib/GoogleCalendarService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const inquiryId = searchParams.get('id');
    const token = searchParams.get('token');

    console.log('✅ Appointment confirmation request:', { inquiryId, hasToken: !!token });

    // Validate parameters
    if (!inquiryId || !token) {
      return NextResponse.redirect(
        new URL('/admin/customer-inquiries?error=missing_parameters', request.url)
      );
    }

    // Find and verify inquiry
    const inquiry = await prisma.customerInquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!inquiry) {
      console.error('❌ Inquiry not found:', inquiryId);
      return NextResponse.redirect(
        new URL('/admin/customer-inquiries?error=inquiry_not_found', request.url)
      );
    }

    // Verify token
    if (inquiry.confirmationToken !== token) {
      console.error('❌ Invalid confirmation token');
      return NextResponse.redirect(
        new URL('/admin/customer-inquiries?error=invalid_token', request.url)
      );
    }

    // Check if already confirmed
    if (inquiry.appointmentStatus === 'CONFIRMED') {
      console.log('⚠️ Appointment already confirmed');
      return NextResponse.redirect(
        new URL('/admin/customer-inquiries?message=already_confirmed', request.url)
      );
    }

    // Check if expired
    if (inquiry.appointmentStatus === 'EXPIRED') {
      console.log('⚠️ Appointment has expired');
      return NextResponse.redirect(
        new URL('/admin/customer-inquiries?error=appointment_expired', request.url)
      );
    }

    if (!inquiry.appointmentDateTime) {
      console.error('❌ No appointment date/time');
      return NextResponse.redirect(
        new URL('/admin/customer-inquiries?error=no_appointment_datetime', request.url)
      );
    }

    // Update inquiry status to CONFIRMED
    const updatedInquiry = await prisma.customerInquiry.update({
      where: { id: inquiryId },
      data: {
        appointmentStatus: 'CONFIRMED',
        status: 'IN_PROGRESS', // Update overall status as well
        confirmationToken: null, // Clear token after use
        adminNotes: inquiry.adminNotes
          ? `${inquiry.adminNotes}\n\nTermin bestätigt: ${new Date().toLocaleString('de-DE')}`
          : `Termin bestätigt: ${new Date().toLocaleString('de-DE')}`,
      },
    });

    console.log('✅ Appointment status updated to CONFIRMED');

    // Create Google Calendar event
    try {
      const eventResult = await GoogleCalendarService.createEvent({
        summary: `NEST-Haus Beratung - ${updatedInquiry.name}`,
        description: `Beratungstermin für NEST-Haus Konfiguration\n\nKunde: ${updatedInquiry.name}\nE-Mail: ${updatedInquiry.email}\nTelefon: ${updatedInquiry.phone || 'N/A'}\nAnfrage-ID: ${updatedInquiry.id}`,
        start: updatedInquiry.appointmentDateTime.toISOString(),
        end: new Date(
          updatedInquiry.appointmentDateTime.getTime() + 60 * 60 * 1000
        ).toISOString(), // 60 minutes duration
        attendees: [
          {
            email: updatedInquiry.email,
            displayName: updatedInquiry.name,
          },
        ],
        location: 'NEST-Haus Office, Karmeliterplatz 8, 8010 Graz',
      });

      if (eventResult.success) {
        console.log('✅ Google Calendar event created:', eventResult.eventId);

        // Store calendar event ID in inquiry
        await prisma.customerInquiry.update({
          where: { id: inquiryId },
          data: {
            adminNotes: updatedInquiry.adminNotes
              ? `${updatedInquiry.adminNotes}\nCalendar Event ID: ${eventResult.eventId}`
              : `Calendar Event ID: ${eventResult.eventId}`,
          },
        });
      } else {
        console.warn('⚠️ Failed to create calendar event');
      }
    } catch (calendarError) {
      console.error('❌ Calendar creation error:', calendarError);
      // Don't fail the confirmation if calendar fails
    }

    // Redirect to admin panel with success message
    return NextResponse.redirect(
      new URL(
        `/admin/customer-inquiries?message=appointment_confirmed&id=${inquiryId}`,
        request.url
      )
    );
  } catch (error) {
    console.error('❌ Error confirming appointment:', error);
    return NextResponse.redirect(
      new URL('/admin/customer-inquiries?error=server_error', request.url)
    );
  }
}

