import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { EmailService } from '@/lib/EmailService';
import { GoogleCalendarService } from '@/lib/GoogleCalendarService';

// Validation schema for contact form data
const contactFormSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  name: z.string().min(1, 'Name ist erforderlich'),
  phone: z.string().optional(),
  message: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).default('email'),
  bestTimeToCall: z.string().optional(),
  configurationData: z.any().optional(),
  requestType: z.enum(['contact', 'appointment']).default('contact'),
  appointmentDateTime: z.string().optional().nullable(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Type for Prisma where clause
interface InquiryWhereClause {
  status?: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'QUOTED' | 'CONVERTED' | 'CLOSED';
  OR?: Array<{
    name?: { contains: string; mode: 'insensitive' };
    email?: { contains: string; mode: 'insensitive' };
    phone?: { contains: string; mode: 'insensitive' };
  }>;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Processing contact form submission...');

    const body = await request.json();

    // Validate the request data
    const validationResult = contactFormSchema.safeParse(body);

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

    const data: ContactFormData = validationResult.data;

    // Get or create sessionId from cookies
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('sessionId')?.value;

    // If no sessionId exists, check header (legacy support) or create new one
    if (!sessionId) {
      sessionId = request.headers.get('x-session-id') ||
        `contact_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

      // Store sessionId in cookie for future requests
      cookieStore.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      console.log(`[SessionId] Created new sessionId: ${sessionId}`);
    } else {
      console.log(`[SessionId] Using existing sessionId: ${sessionId}`);
    }

    // Extract client information (for future use in analytics/security)
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Calculate total price if configuration data exists
    let totalPrice: number | null = null;
    if (data.configurationData?.totalPrice) {
      totalPrice = parseInt(data.configurationData.totalPrice.toString());
    }

    // Prepare inquiry data for database
    const inquiryData = {
      sessionId,
      email: data.email,
      name: data.name,
      phone: data.phone || null,
      message: data.message || null,
      configurationData: data.configurationData || null,
      totalPrice,
      status: 'NEW' as const,
      preferredContact: data.preferredContact.toUpperCase() as 'EMAIL' | 'PHONE' | 'WHATSAPP',
      bestTimeToCall: data.bestTimeToCall || null,
      
      // Appointment-specific fields
      requestType: data.requestType,
      appointmentDateTime: data.appointmentDateTime ? new Date(data.appointmentDateTime) : null,
      appointmentStatus: data.requestType === 'appointment' ? ('PENDING' as const) : null,
      appointmentExpiresAt: data.requestType === 'appointment' && data.appointmentDateTime
        ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
        : null,
      
      adminNotes: data.requestType === 'appointment'
        ? `Terminwunsch: ${data.appointmentDateTime ? new Date(data.appointmentDateTime).toLocaleString('de-DE') : 'Nicht angegeben'} - Status: PENDING (24h Bestätigung erforderlich)`
        : null,
      followUpDate: data.requestType === 'appointment' && data.appointmentDateTime
        ? new Date(data.appointmentDateTime)
        : null,
    };

    console.log('💾 Saving customer inquiry to database...');

    // Save to database using upsert to handle potential duplicates
    const inquiry = await prisma.customerInquiry.create({
      data: inquiryData,
    });

    console.log('✅ Customer inquiry saved:', inquiry.id);

    // Track analytics event (if session exists)
    if (sessionId) {
      try {
        await prisma.interactionEvent.create({
          data: {
            sessionId,
            eventType: 'contact_form_submission',
            category: 'conversion',
            elementId: data.requestType,
            selectionValue: data.preferredContact,
            additionalData: {
              inquiryId: inquiry.id,
              requestType: data.requestType,
              hasConfiguration: !!data.configurationData,
              totalPrice,
            },
          },
        });
        console.log('📊 Analytics event tracked');
      } catch (analyticsError) {
        console.warn('⚠️ Analytics tracking failed:', analyticsError);
        // Don't fail the request if analytics fails
      }
    }

    // Send email notifications
    console.log('📬 Sending email notifications...');

    try {
      // Prepare email data
      const emailData = {
        inquiryId: inquiry.id,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        message: data.message || undefined,
        requestType: data.requestType,
        preferredContact: data.preferredContact.toUpperCase() as 'EMAIL' | 'PHONE' | 'WHATSAPP',
        appointmentDateTime: data.appointmentDateTime || undefined,
        configurationData: data.configurationData,
        totalPrice: totalPrice || undefined,
      };

      const adminEmailData = {
        ...emailData,
        sessionId: sessionId || undefined,
        clientIP,
        userAgent,
      };

      // Send emails in parallel
      const [customerEmailSent, adminEmailSent] = await Promise.all([
        EmailService.sendCustomerConfirmation(emailData),
        EmailService.sendAdminNotification(adminEmailData),
      ]);

      if (customerEmailSent) {
        console.log('✅ Customer confirmation email sent');
      } else {
        console.warn('⚠️ Customer confirmation email failed');
      }

      if (adminEmailSent) {
        console.log('✅ Admin notification email sent');
      } else {
        console.warn('⚠️ Admin notification email failed');
      }

    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Don't fail the request if email fails - inquiry is already saved
    }

    // Check calendar availability and send appointment request if this is an appointment request
    let isTimeSlotAvailable = false;
    if (data.requestType === 'appointment' && data.appointmentDateTime) {
      try {
        console.log('📅 Checking Google Calendar availability...');

        // Check if the requested time slot is available
        isTimeSlotAvailable = await GoogleCalendarService.isTimeSlotAvailable(
          data.appointmentDateTime,
          60 // 60 minutes duration
        );

        if (isTimeSlotAvailable) {
          console.log('✅ Time slot is available');

          // Update inquiry with availability confirmation
          await prisma.customerInquiry.update({
            where: { id: inquiry.id },
            data: {
              adminNotes: `${inquiry.adminNotes || ''}\nTermin verfügbar: ${new Date(data.appointmentDateTime).toLocaleString('de-DE')} - Bestätigung ausstehend`,
            },
          });
        } else {
          console.log('⚠️ Time slot is not available');

          // Update inquiry with conflict notice
          await prisma.customerInquiry.update({
            where: { id: inquiry.id },
            data: {
              adminNotes: `${inquiry.adminNotes || ''}\nTerminkonflikt: ${new Date(data.appointmentDateTime).toLocaleString('de-DE')} - Alternative Zeiten vorschlagen`,
            },
          });
        }
      } catch (calendarError) {
        console.error('❌ Calendar availability check failed:', calendarError);
        // Don't fail the request if calendar check fails
        isTimeSlotAvailable = true; // Assume available on error
      }
    }

    // Update UserSession status to COMPLETED if sessionId exists
    if (sessionId) {
      try {
        await prisma.userSession.updateMany({
          where: { sessionId },
          data: {
            status: 'COMPLETED',
            endTime: new Date(),
            configurationData: data.configurationData || undefined,
            totalPrice: totalPrice || undefined
          }
        });
        console.log(`✅ Updated UserSession ${sessionId} status to COMPLETED`);
      } catch (sessionUpdateError) {
        console.warn(`⚠️ Failed to update session status for ${sessionId}:`, sessionUpdateError);
        // Don't fail the request if session update fails
      }
    }

    // Prepare response data
    const responseData = {
      success: true,
      inquiryId: inquiry.id,
      timeSlotAvailable: isTimeSlotAvailable,
      message: data.requestType === 'appointment'
        ? (isTimeSlotAvailable
          ? 'Terminanfrage erfolgreich gesendet! Der gewünschte Zeitslot ist verfügbar.'
          : 'Terminanfrage erfolgreich gesendet! Wir prüfen alternative Zeiten.')
        : 'Nachricht erfolgreich gesendet!',
      estimatedResponse: data.requestType === 'appointment'
        ? (isTimeSlotAvailable
          ? 'Wir bestätigen Ihren Termin innerhalb der nächsten 24 Stunden per E-Mail.'
          : 'Wir schlagen Ihnen alternative Termine innerhalb von 24 Stunden vor.')
        : 'Wir melden uns innerhalb von 2 Werktagen bei Ihnen.',
    };

    console.log('✅ Contact form processed successfully');

    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    console.error('❌ Error processing contact form:', error);

    return NextResponse.json(
      {
        error: 'Interner Serverfehler',
        message: 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.',
      },
      { status: 500 }
    );
  }
}

// GET method for retrieving contact inquiries (admin use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where clause
    const where: InquiryWhereClause = {};

    if (status && status !== 'ALL') {
      // Validate that status is a valid enum value
      const validStatuses: Array<'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'QUOTED' | 'CONVERTED' | 'CLOSED'> =
        ['NEW', 'CONTACTED', 'IN_PROGRESS', 'QUOTED', 'CONVERTED', 'CLOSED'];

      if (validStatuses.includes(status as 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'QUOTED' | 'CONVERTED' | 'CLOSED')) {
        where.status = status as 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'QUOTED' | 'CONVERTED' | 'CLOSED';
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.customerInquiry.count({ where });

    // Get paginated results
    const inquiries = await prisma.customerInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        message: true,
        status: true,
        preferredContact: true,
        totalPrice: true,
        createdAt: true,
        updatedAt: true,
        followUpDate: true,
        adminNotes: true,
        assignedTo: true,
      },
    });

    return NextResponse.json({
      inquiries,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrevious: page > 1,
      },
    });

  } catch (error) {
    console.error('❌ Error fetching contact inquiries:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Anfragen' },
      { status: 500 }
    );
  }
} 