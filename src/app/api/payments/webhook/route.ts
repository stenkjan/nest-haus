import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/EmailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            console.error('❌ Missing Stripe signature');
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 400 }
            );
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error('❌ Webhook signature verification failed:', err);
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        console.log('🔔 Stripe webhook received:', event.type);

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
                break;

            case 'payment_intent.canceled':
                await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
                break;

            case 'payment_intent.requires_action':
                await handlePaymentRequiresAction(event.data.object as Stripe.PaymentIntent);
                break;

            default:
                console.log(`🔔 Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    try {
        console.log('✅ Payment succeeded webhook:', paymentIntent.id);

        // Find inquiry by payment intent ID
        const inquiry = await prisma.customerInquiry.findFirst({
            where: { paymentIntentId: paymentIntent.id },
        });

        if (!inquiry) {
            console.warn('⚠️ No inquiry found for payment intent:', paymentIntent.id);
            return;
        }

        // Update inquiry status
        const updatedInquiry = await prisma.customerInquiry.update({
            where: { id: inquiry.id },
            data: {
                paymentStatus: 'PAID',
                paymentMethod: paymentIntent.payment_method_types[0] || 'card',
                paidAt: new Date(),
                status: 'CONVERTED',
            },
        });

        console.log('✅ Updated inquiry payment status:', updatedInquiry.id);

        // Send confirmation emails if not already sent
        if (updatedInquiry.email && updatedInquiry.name) {
            try {
                const customerData = {
                    inquiryId: updatedInquiry.id,
                    name: updatedInquiry.name,
                    email: updatedInquiry.email,
                    paymentAmount: updatedInquiry.paymentAmount || paymentIntent.amount,
                    paymentCurrency: updatedInquiry.paymentCurrency || paymentIntent.currency,
                    paymentMethod: updatedInquiry.paymentMethod || 'card',
                    configurationData: updatedInquiry.configurationData,
                };

                // Send customer payment confirmation
                await EmailService.sendPaymentConfirmation(customerData);

                // Send admin notification
                await EmailService.sendAdminPaymentNotification({
                    ...customerData,
                    paymentIntentId: paymentIntent.id,
                    stripeCustomerId: paymentIntent.customer as string,
                });

                console.log('✅ Payment confirmation emails sent via webhook');
            } catch (emailError) {
                console.warn('⚠️ Failed to send emails via webhook:', emailError);
            }
        }

        // Track analytics event
        if (updatedInquiry.sessionId) {
            try {
                await prisma.interactionEvent.create({
                    data: {
                        sessionId: updatedInquiry.sessionId,
                        eventType: 'payment_webhook_succeeded',
                        category: 'conversion',
                        elementId: 'stripe_webhook',
                        selectionValue: paymentIntent.payment_method_types[0] || 'card',
                        additionalData: {
                            paymentIntentId: paymentIntent.id,
                            amount: paymentIntent.amount,
                            currency: paymentIntent.currency,
                            inquiryId: updatedInquiry.id,
                        },
                    },
                });
                console.log('📊 Payment webhook analytics event tracked');
            } catch (analyticsError) {
                console.warn('⚠️ Analytics tracking failed in webhook:', analyticsError);
            }
        }

    } catch (error) {
        console.error('❌ Error handling payment succeeded webhook:', error);
    }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    try {
        console.log('❌ Payment failed webhook:', paymentIntent.id);

        // Find inquiry by payment intent ID
        const inquiry = await prisma.customerInquiry.findFirst({
            where: { paymentIntentId: paymentIntent.id },
        });

        if (!inquiry) {
            console.warn('⚠️ No inquiry found for failed payment:', paymentIntent.id);
            return;
        }

        // Update inquiry status
        await prisma.customerInquiry.update({
            where: { id: inquiry.id },
            data: {
                paymentStatus: 'FAILED',
                adminNotes: `${inquiry.adminNotes || ''}\nZahlung fehlgeschlagen: ${paymentIntent.last_payment_error?.message || 'Unbekannter Fehler'}`,
            },
        });

        console.log('✅ Updated inquiry for failed payment:', inquiry.id);

        // Track analytics event
        if (inquiry.sessionId) {
            try {
                await prisma.interactionEvent.create({
                    data: {
                        sessionId: inquiry.sessionId,
                        eventType: 'payment_webhook_failed',
                        category: 'conversion',
                        elementId: 'stripe_webhook',
                        selectionValue: 'failed',
                        additionalData: {
                            paymentIntentId: paymentIntent.id,
                            error: paymentIntent.last_payment_error?.message,
                            inquiryId: inquiry.id,
                        },
                    },
                });
                console.log('📊 Payment failure webhook analytics event tracked');
            } catch (analyticsError) {
                console.warn('⚠️ Analytics tracking failed in webhook:', analyticsError);
            }
        }

    } catch (error) {
        console.error('❌ Error handling payment failed webhook:', error);
    }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
    try {
        console.log('🚫 Payment canceled webhook:', paymentIntent.id);

        // Find inquiry by payment intent ID
        const inquiry = await prisma.customerInquiry.findFirst({
            where: { paymentIntentId: paymentIntent.id },
        });

        if (!inquiry) {
            console.warn('⚠️ No inquiry found for canceled payment:', paymentIntent.id);
            return;
        }

        // Update inquiry status
        await prisma.customerInquiry.update({
            where: { id: inquiry.id },
            data: {
                paymentStatus: 'CANCELLED',
                adminNotes: `${inquiry.adminNotes || ''}\nZahlung abgebrochen durch Kunde`,
            },
        });

        console.log('✅ Updated inquiry for canceled payment:', inquiry.id);

    } catch (error) {
        console.error('❌ Error handling payment canceled webhook:', error);
    }
}

async function handlePaymentRequiresAction(paymentIntent: Stripe.PaymentIntent) {
    try {
        console.log('⚠️ Payment requires action webhook:', paymentIntent.id);

        // Find inquiry by payment intent ID
        const inquiry = await prisma.customerInquiry.findFirst({
            where: { paymentIntentId: paymentIntent.id },
        });

        if (!inquiry) {
            console.warn('⚠️ No inquiry found for payment requiring action:', paymentIntent.id);
            return;
        }

        // Update inquiry status
        await prisma.customerInquiry.update({
            where: { id: inquiry.id },
            data: {
                paymentStatus: 'PROCESSING',
                adminNotes: `${inquiry.adminNotes || ''}\nZahlung erfordert zusätzliche Authentifizierung`,
            },
        });

        console.log('✅ Updated inquiry for payment requiring action:', inquiry.id);

    } catch (error) {
        console.error('❌ Error handling payment requires action webhook:', error);
    }
}
