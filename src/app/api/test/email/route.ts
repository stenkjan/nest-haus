import { NextResponse } from 'next/server';
import { EmailService } from '@/lib/EmailService';

/**
 * Test endpoint to verify email sending functionality
 * 
 * Usage: GET http://localhost:3000/api/test/email?to=your-email@example.com
 * 
 * This endpoint tests:
 * - Resend API key configuration
 * - Email service initialization
 * - Customer confirmation email template
 */
export async function GET(request: Request) {
  try {
    // Get email from query params or use default
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('to') || 'm.janstenk@gmail.com';

    console.log(`📧 Testing email sending to: ${testEmail}`);
    console.log(`📧 Using FROM: ${process.env.RESEND_FROM_EMAIL}`);
    console.log(`📧 Using REPLY-TO: ${process.env.REPLY_TO_EMAIL}`);

    // Test customer confirmation email
    const result = await EmailService.sendCustomerConfirmation({
      inquiryId: 'test-' + Date.now(),
      name: 'Test User',
      email: testEmail,
      requestType: 'contact',
      preferredContact: 'EMAIL',
      message: 'This is a test email from the NEST-Haus email system.',
    });

    if (result) {
      console.log('✅ Test email sent successfully');
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        config: {
          from: process.env.RESEND_FROM_EMAIL,
          replyTo: process.env.REPLY_TO_EMAIL,
          to: testEmail,
        },
      });
    } else {
      console.error('❌ Test email failed to send');
      return NextResponse.json(
        {
          success: false,
          error: 'Email sending failed (check console for details)',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Test email error:', error);
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

