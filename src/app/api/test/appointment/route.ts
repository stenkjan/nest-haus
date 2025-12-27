import { NextResponse } from 'next/server';

/**
 * Test endpoint to trigger an appointment booking and capture email logs
 * 
 * Usage: GET http://localhost:3000/api/test/appointment?to=your-email@example.com
 * 
 * This simulates what happens when a user books an appointment through the AppointmentBooking component
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('to') || 'm.janstenk@gmail.com';

    console.log(`📅 Testing appointment booking for: ${testEmail}`);

    // Simulate appointment booking data (matches AppointmentBooking.tsx structure)
    const appointmentDateTime = new Date();
    appointmentDateTime.setDate(appointmentDateTime.getDate() + 7); // 7 days from now
    appointmentDateTime.setHours(14, 0, 0, 0); // 2 PM

    const contactData = {
      name: 'Test User',
      email: testEmail,
      phone: '+43664123456789',
      message: 'This is a test appointment booking from the test endpoint.',
      requestType: 'appointment' as const,
      preferredContact: 'email' as const,
      appointmentDateTime: appointmentDateTime.toISOString(),
      configurationData: {
        nest: {
          name: 'Hoam Tiny House 25m²',
          price: 45000,
        },
        planungspaket: {
          name: 'Komplettplanung',
          price: 5000,
        },
      },
      sessionId: 'test-session-' + Date.now(),
    };

    console.log('📤 Sending appointment request to /api/contact:', contactData);

    // Call the actual contact API (same as AppointmentBooking component does)
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    const result = await response.json();

    console.log('📬 Appointment API response:', {
      ok: response.ok,
      status: response.status,
      result,
    });

    if (response.ok && result.success) {
      return NextResponse.json({
        success: true,
        message: 'Appointment booking test successful',
        inquiryId: result.inquiryId,
        appointmentDateTime: appointmentDateTime.toISOString(),
        note: 'Check server console for email sending logs',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Appointment booking failed',
          details: result,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('❌ Appointment booking test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

