import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/EmailService';

/**
 * Test API route for verifying email functionality
 * Usage: POST /api/test/email
 * 
 * This route is for testing purposes only - remove in production
 */
export async function POST(request: NextRequest) {
  try {
    // Only allow in development or staging
    if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_EMAIL_TESTING) {
      return NextResponse.json(
        { error: 'Email testing not allowed in production' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json(
        { error: 'testEmail is required' },
        { status: 400 }
      );
    }

    // Test customer email
    const customerTestData = {
      inquiryId: 'test-' + Date.now(),
      name: 'Test User',
      email: testEmail,
      phone: '+43 123 456 789',
      message: 'This is a test email to verify Resend integration.',
      requestType: 'contact' as const,
      preferredContact: 'EMAIL' as const,
      configurationData: {
        nest: { name: 'NEST 50' },
        totalPrice: 15000000, // €150,000 in cents
      },
      totalPrice: 15000000,
    };

    console.log('🧪 Testing email service...');
    
    // Send customer confirmation
    const customerResult = await EmailService.sendCustomerConfirmation(customerTestData);
    
    // Send admin notification
    const adminResult = await EmailService.sendAdminNotification({
      ...customerTestData,
      sessionId: 'test-session-123',
      clientIP: '127.0.0.1',
      userAgent: 'Test Browser',
    });

    return NextResponse.json({
      success: true,
      message: 'Test emails sent successfully',
      results: {
        customerEmail: customerResult,
        adminEmail: adminResult,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Email test failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint - use POST with { testEmail: "your@email.com" }',
    environment: process.env.NODE_ENV,
    resendConfigured: !!process.env.RESEND_API_KEY,
  });
}
