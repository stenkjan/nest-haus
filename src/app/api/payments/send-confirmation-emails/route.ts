import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
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

            // Extract customer email from multiple sources
            let email = customerEmail || paymentIntent.receipt_email;
            
            // If still no email, try to get it from Stripe customer
            if (!email && paymentIntent.customer) {
                try {
                    const customer = await stripe.customers.retrieve(paymentIntent.customer as string);
                    if ('email' in customer && customer.email) {
                        email = customer.email;
                        console.log('📧 Retrieved email from Stripe customer:', email);
                    }
                } catch (customerError) {
                    console.warn('⚠️ Failed to retrieve customer email:', customerError);
                }
            }
            
            // Final fallback
            if (!email) {
                email = 'kunde@nest-haus.com';
                console.warn('⚠️ No email found - using fallback email');
            }
            
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
                        configurationData: configurationData ? (configurationData as Prisma.InputJsonValue) : Prisma.JsonNull,
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

        // Note: Removed emailsSent idempotency check
        // Each payment intent is unique, so we always send emails when requested
        // This allows the same customer to receive emails for multiple payments

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

        let customerEmailSent = false;
        let adminEmailSent = false;

        // Send customer payment confirmation
        try {
            await EmailService.sendPaymentConfirmation(emailData);
            customerEmailSent = true;
            console.log('✅ Payment confirmation email sent to customer');
        } catch (customerEmailError) {
            console.error('❌ Failed to send customer email:', customerEmailError);
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
            adminEmailSent = true;
            console.log('✅ Admin payment notification sent');
        } catch (adminEmailError) {
            console.error('❌ Failed to send admin email:', adminEmailError);
        }

        // Bug fix: Only mark emails as sent if at least one email succeeded
        if (!customerEmailSent && !adminEmailSent) {
            console.error('❌ Both customer and admin emails failed');
            return NextResponse.json(
                {
                    error: 'Email delivery failed',
                    message: 'Failed to send both customer and admin emails',
                },
                { status: 500 }
            );
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
            customerEmailSent,
            adminEmailSent,
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
