import { NextResponse } from 'next/server';
import { EmailService } from '@/lib/EmailService';

/**
 * Test endpoint to verify payment confirmation email sending
 * 
 * Usage: GET http://localhost:3000/api/test/payment-email?to=your-email@example.com
 * 
 * This endpoint tests:
 * - Payment confirmation email template (customer)
 * - Admin payment notification email template
 * - Configuration data parsing in email templates
 */
export async function GET(request: Request) {
  try {
    // Get email from query params or use default
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('to') || 'm.janstenk@gmail.com';

    console.log(`💳 Testing payment confirmation emails to: ${testEmail}`);
    console.log(`💳 Using FROM: ${process.env.RESEND_FROM_EMAIL}`);
    console.log(`💳 Using REPLY-TO: ${process.env.REPLY_TO_EMAIL}`);

    // Mock configuration data
    const mockConfigData = {
      nest: {
        name: 'Hoam Tiny House 25m²',
        price: 45000,
      },
      gebaeudehuelle: {
        name: 'Standard Isolierung',
        price: 12000,
      },
      innenverkleidung: {
        name: 'Eiche Natur',
        price: 8000,
      },
      fussboden: {
        name: 'Parkett Eiche',
        price: 5000,
      },
      pv: {
        name: 'PV-Anlage 5kWp',
        price: 15000,
      },
      fenster: {
        name: '3-fach Verglasung',
        price: 8000,
      },
      planungspaket: {
        name: 'Komplettplanung',
        price: 5000,
      },
      grundstueckscheck: true,
      terminvereinbarung: true,
    };

    // Send customer payment confirmation
    console.log('📧 Sending customer payment confirmation...');
    let customerResult = false;
    let customerError = null;
    try {
      customerResult = await EmailService.sendPaymentConfirmation({
        inquiryId: 'test-payment-' + Date.now(),
        name: 'Test User',
        email: testEmail,
        paymentAmount: 50000, // €500.00 in cents
        paymentCurrency: 'eur',
        paymentMethod: 'card',
        paymentIntentId: 'pi_test_' + Date.now(),
        paidAt: new Date(),
        configurationData: mockConfigData,
      });
      console.log('✅ Customer payment email result:', customerResult);
    } catch (err) {
      console.error('❌ Customer payment email error:', err);
      customerError = err instanceof Error ? err.message : String(err);
    }

    // Send admin payment notification
    console.log('📧 Sending admin payment notification...');
    let adminResult = false;
    let adminError = null;
    try {
      adminResult = await EmailService.sendAdminPaymentNotification({
        inquiryId: 'test-payment-' + Date.now(),
        name: 'Test User',
        email: testEmail,
        paymentAmount: 50000, // €500.00 in cents
        paymentCurrency: 'eur',
        paymentMethod: 'card',
        paymentIntentId: 'pi_test_' + Date.now(),
        stripeCustomerId: 'cus_test_' + Date.now(),
        paidAt: new Date(),
        configurationData: mockConfigData,
        sessionId: 'test-session-' + Date.now(),
      });
      console.log('✅ Admin payment email result:', adminResult);
    } catch (err) {
      console.error('❌ Admin payment email error:', err);
      adminError = err instanceof Error ? err.message : String(err);
    }

    if (customerResult && adminResult) {
      console.log('✅ Both payment emails sent successfully');
      return NextResponse.json({
        success: true,
        message: 'Payment confirmation emails sent successfully',
        sent: {
          customerEmail: testEmail,
          adminEmail: process.env.ADMIN_EMAIL,
        },
        config: {
          from: process.env.RESEND_FROM_EMAIL,
          replyTo: process.env.REPLY_TO_EMAIL,
        },
      });
    } else {
      console.error('❌ One or more payment emails failed');
      return NextResponse.json(
        {
          success: false,
          error: 'Payment email sending failed',
          results: {
            customer: customerResult,
            admin: adminResult,
          },
          errors: {
            customer: customerError,
            admin: adminError,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Payment email test error:', error);
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

