import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/EmailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
});

// Validation schema for payment confirmation
const confirmPaymentSchema = z.object({
    paymentIntentId: z.string(),
    inquiryId: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        console.log('💳 Confirming payment...');

        const body = await request.json();
        const validation = confirmPaymentSchema.safeParse(body);

        if (!validation.success) {
            console.error('❌ Payment confirmation validation failed:', validation.error.issues);
            return NextResponse.json(
                {
                    error: 'Invalid confirmation data',
                    details: validation.error.issues,
                },
                { status: 400 }
            );
        }

        const { paymentIntentId, inquiryId } = validation.data;

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            console.warn('⚠️ Payment intent not succeeded:', paymentIntent.status);
            return NextResponse.json(
                {
                    error: 'Payment not completed',
                    status: paymentIntent.status,
                },
                { status: 400 }
            );
        }

        console.log('✅ Payment confirmed in Stripe:', paymentIntentId);

        // Update inquiry in database
        let inquiry = null;
        if (inquiryId) {
            try {
                inquiry = await prisma.customerInquiry.update({
                    where: { id: inquiryId },
                    data: {
                        paymentStatus: 'PAID',
                        paymentMethod: paymentIntent.payment_method_types[0] || 'card',
                        paidAt: new Date(),
                        status: 'CONVERTED', // Update inquiry status to converted
                    },
                });
                console.log('✅ Updated inquiry payment status to PAID');
            } catch (dbError) {
                console.error('❌ Failed to update inquiry:', dbError);
                return NextResponse.json(
                    {
                        error: 'Database update failed',
                        message: 'Payment succeeded but failed to update records',
                    },
                    { status: 500 }
                );
            }
        } else {
            // Try to find inquiry by payment intent ID
            try {
                inquiry = await prisma.customerInquiry.findFirst({
                    where: { paymentIntentId },
                });

                if (inquiry) {
                    inquiry = await prisma.customerInquiry.update({
                        where: { id: inquiry.id },
                        data: {
                            paymentStatus: 'PAID',
                            paymentMethod: paymentIntent.payment_method_types[0] || 'card',
                            paidAt: new Date(),
                            status: 'CONVERTED',
                        },
                    });
                    console.log('✅ Found and updated inquiry by payment intent ID');
                }
            } catch (dbError) {
                console.warn('⚠️ Could not find/update inquiry by payment intent ID:', dbError);
            }
        }

        // Send payment confirmation emails
        if (inquiry) {
            try {
                const customerData = {
                    inquiryId: inquiry.id,
                    name: inquiry.name || 'Kunde',
                    email: inquiry.email,
                    paymentAmount: inquiry.paymentAmount || paymentIntent.amount,
                    paymentCurrency: inquiry.paymentCurrency || paymentIntent.currency,
                    paymentMethod: inquiry.paymentMethod || 'Karte',
                    paymentIntentId,
                    paidAt: inquiry.paidAt || new Date(),
                    configurationData: inquiry.configurationData,
                };

                // Send customer payment confirmation
                await EmailService.sendPaymentConfirmation(customerData);
                console.log('✅ Payment confirmation email sent to customer');

                // Send admin notification
                await EmailService.sendAdminPaymentNotification({
                    ...customerData,
                    paymentIntentId,
                    stripeCustomerId: paymentIntent.customer as string,
                    sessionId: inquiry.sessionId || undefined,
                    clientIP: undefined, // Not available in this context
                    userAgent: undefined, // Not available in this context
                });
                console.log('✅ Payment notification email sent to admin');

            } catch (emailError) {
                console.warn('⚠️ Failed to send payment confirmation emails:', emailError);
                // Don't fail the confirmation if email fails
            }
        }

        // Track analytics event
        if (inquiry?.sessionId) {
            try {
                await prisma.interactionEvent.create({
                    data: {
                        sessionId: inquiry.sessionId,
                        eventType: 'payment_completed',
                        category: 'conversion',
                        elementId: 'stripe_payment',
                        selectionValue: paymentIntent.payment_method_types[0] || 'card',
                        additionalData: {
                            paymentIntentId,
                            amount: paymentIntent.amount,
                            currency: paymentIntent.currency,
                            inquiryId: inquiry.id,
                        },
                    },
                });
                console.log('📊 Payment completion analytics event tracked');
            } catch (analyticsError) {
                console.warn('⚠️ Analytics tracking failed:', analyticsError);
            }
        }

        return NextResponse.json({
            success: true,
            paymentIntentId,
            inquiryId: inquiry?.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            message: 'Payment confirmed successfully',
        });

    } catch (error) {
        console.error('❌ Error confirming payment:', error);

        if (error instanceof Stripe.errors.StripeError) {
            return NextResponse.json(
                {
                    error: 'Payment service error',
                    message: error.message,
                    type: error.type,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: 'Internal server error',
                message: 'Failed to confirm payment',
            },
            { status: 500 }
        );
    }
}
