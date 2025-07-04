import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
  appointmentDateTime: z.string().datetime().optional().nullable(),
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

    // Extract client information (for future use in analytics/security)
    const _clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const _userAgent = request.headers.get('user-agent') || 'unknown';
    const sessionId = request.headers.get('x-session-id') || null;

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
      adminNotes: data.requestType === 'appointment' 
        ? `Terminwunsch: ${data.appointmentDateTime ? new Date(data.appointmentDateTime).toLocaleString('de-DE') : 'Nicht angegeben'}`
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

    // TODO: Send email notifications (to be implemented in next step)
    console.log('📬 Email notifications will be sent (TODO: implement email service)');

    // Prepare response data
    const responseData = {
      success: true,
      inquiryId: inquiry.id,
      message: data.requestType === 'appointment' 
        ? 'Terminanfrage erfolgreich gesendet!' 
        : 'Nachricht erfolgreich gesendet!',
      estimatedResponse: data.requestType === 'appointment'
        ? 'Wir melden uns innerhalb von 24 Stunden bei Ihnen.'
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