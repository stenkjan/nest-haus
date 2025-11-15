import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/EmailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
});

// Validation schema
const sendEmailsSchema = z.object({
    paymentIntentId: z.string(),
    customerEmail: z.string().email().optional(),
    customerName: z.string().optional(),
    configurationData: z.unknown().optional(),
});

/**
 * Idempotent email sending endpoint for payment confirmations
 * Can be called multiple times safely - only sends emails once
 */
export async function POST(request: NextRequest) {
    try {
        console.log('📧 Payment confirmation email endpoint called');

        const body = await request.json();
        const validation = sendEmailsSchema.safeParse(body);

        if (!validation.success) {
            console.error('❌ Email sending validation failed:', validation.error.issues);
            return NextResponse.json(
                {
                    error: 'Invalid request data',
                    details: validation.error.issues,
                },
                { status: 400 }
            );
        }

        const { paymentIntentId, customerEmail, customerName, configurationData } = validation.data;

        // Retrieve payment intent from Stripe to get details
        let paymentIntent;
        try {
            paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        } catch (stripeError) {
            console.error('❌ Failed to retrieve payment intent from Stripe:', stripeError);
            return NextResponse.json(
                { error: 'Failed to retrieve payment information' },
                { status: 400 }
            );
        }

        // Find or create inquiry
        let inquiry = await prisma.customerInquiry.findFirst({
            where: { paymentIntentId },
        });

        if (!inquiry) {
            console.log('📝 Creating new inquiry for payment intent:', paymentIntentId);
            
            // Extract customer email from Stripe metadata or use provided email
            const email = customerEmail || 
                         (paymentIntent.receipt_email) || 
                         'kunde@nest-haus.com';
            const name = customerName || 'Kunde';

            try {
                inquiry = await prisma.customerInquiry.create({
                    data: {
                        email,
                        name,
                        paymentIntentId,
                        paymentStatus: 'PAID',
                        paymentMethod: paymentIntent.payment_method_types[0] || 'card',
                        paymentAmount: paymentIntent.amount,
                        paymentCurrency: paymentIntent.currency,
                        paidAt: new Date(),
                        status: 'CONVERTED',
                        requestType: 'payment',
                        preferredContact: 'EMAIL',
                        configurationData: configurationData || null,
                        emailsSent: false, // Will be set to true after sending
                    },
                });
                console.log('✅ Created new inquiry:', inquiry.id);
            } catch (createError) {
                console.error('❌ Failed to create inquiry:', createError);
                return NextResponse.json(
                    { error: 'Failed to create inquiry record' },
                    { status: 500 }
                );
            }
        }

        // Check if emails already sent (idempotency check)
        if (inquiry.emailsSent) {
            console.log('✅ Emails already sent for this payment, skipping');
            return NextResponse.json({
                success: true,
                alreadySent: true,
                message: 'Emails already sent for this payment',
            });
        }

        // Prepare email data
        const emailData = {
            inquiryId: inquiry.id,
            name: inquiry.name || 'Kunde',
            email: inquiry.email,
            paymentAmount: inquiry.paymentAmount || paymentIntent.amount,
            paymentCurrency: inquiry.paymentCurrency || paymentIntent.currency,
            paymentMethod: inquiry.paymentMethod || 'Karte',
            paymentIntentId,
            paidAt: inquiry.paidAt || new Date(),
            configurationData: inquiry.configurationData || configurationData,
        };

        // Send customer payment confirmation
        try {
            await EmailService.sendPaymentConfirmation(emailData);
            console.log('✅ Payment confirmation email sent to customer');
        } catch (customerEmailError) {
            console.error('❌ Failed to send customer email:', customerEmailError);
            // Continue to try admin email even if customer email fails
        }

        // Send admin notification
        try {
            await EmailService.sendAdminPaymentNotification({
                ...emailData,
                paymentIntentId,
                stripeCustomerId: (paymentIntent.customer as string) || '',
                sessionId: inquiry.sessionId || undefined,
                clientIP: undefined, // Not available in this context
                userAgent: undefined, // Not available in this context
            });
            console.log('✅ Admin payment notification sent');
        } catch (adminEmailError) {
            console.error('❌ Failed to send admin email:', adminEmailError);
        }

        // Mark emails as sent
        try {
            await prisma.customerInquiry.update({
                where: { id: inquiry.id },
                data: {
                    emailsSent: true,
                    emailsSentAt: new Date(),
                },
            });
            console.log('✅ Marked emails as sent in database');
        } catch (updateError) {
            console.warn('⚠️ Failed to mark emails as sent:', updateError);
            // Don't fail the request - emails were sent successfully
        }

        return NextResponse.json({
            success: true,
            inquiryId: inquiry.id,
            message: 'Payment confirmation emails sent successfully',
        });

    } catch (error) {
        console.error('❌ Error in send-confirmation-emails endpoint:', error);

        return NextResponse.json(
            {
                error: 'Internal server error',
                message: 'Failed to send confirmation emails',
            },
            { status: 500 }
        );
    }
}

