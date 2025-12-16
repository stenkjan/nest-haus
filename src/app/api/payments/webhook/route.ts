import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/EmailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
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

        // Find inquiry by payment intent ID - include emailsSent for idempotency check
        const inquiry = await prisma.customerInquiry.findFirst({
            where: { paymentIntentId: paymentIntent.id },
            select: {
                id: true,
                email: true,
                name: true,
                sessionId: true,
                paymentAmount: true,
                paymentCurrency: true,
                paymentMethod: true,
                paidAt: true,
                configurationData: true,
                emailsSent: true, // Bug fix: Include for idempotency check
                emailsSentAt: true,
            },
        });

        if (!inquiry) {
            console.warn('⚠️ No inquiry found for payment intent:', paymentIntent.id);
            return;
        }

        // Note: Removed emailsSent idempotency check
        // Stripe webhooks have built-in idempotency, so duplicate sends are prevented
        // Each payment_intent.succeeded event is unique, so we always send emails
        // This allows the same customer to receive emails for multiple payments

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

        // Send confirmation emails if email and name exist
        if (inquiry.email && inquiry.name) {
            let customerEmailSent = false;
            let adminEmailSent = false;

            const customerData = {
                inquiryId: inquiry.id,
                name: inquiry.name,
                email: inquiry.email,
                paymentAmount: paymentIntent.amount || inquiry.paymentAmount || 150000,
                paymentCurrency: inquiry.paymentCurrency || paymentIntent.currency,
                paymentMethod: inquiry.paymentMethod || paymentIntent.payment_method_types[0] || 'card',
                paymentIntentId: paymentIntent.id,
                paidAt: inquiry.paidAt || new Date(),
                configurationData: inquiry.configurationData,
            };

            // Send customer payment confirmation
            try {
                await EmailService.sendPaymentConfirmation(customerData);
                customerEmailSent = true;
                console.log('✅ Payment confirmation email sent to customer');
            } catch (customerEmailError) {
                console.error('❌ Failed to send customer email:', customerEmailError);
            }

            // Send admin notification
            try {
                await EmailService.sendAdminPaymentNotification({
                    ...customerData,
                    paymentIntentId: paymentIntent.id,
                    stripeCustomerId: paymentIntent.customer as string,
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
            if (customerEmailSent || adminEmailSent) {
                try {
                    await prisma.customerInquiry.update({
                        where: { id: inquiry.id },
                        data: {
                            emailsSent: true,
                            emailsSentAt: new Date(),
                        },
                    });
                    console.log('✅ Marked emails as sent');

                    // ✅ Track GA4 purchase event - trigger client-side tracking via database flag
                    // This will be picked up by the frontend on next page load/refresh
                    if (inquiry.sessionId) {
                        try {
                            const existingConfig = (inquiry.configurationData as Record<string, unknown>) || {};
                            const updatedConfig = {
                                ...existingConfig,
                                purchaseTracked: true,
                                purchaseData: {
                                    transactionId: `T-${new Date().getFullYear()}-${paymentIntent.id.substring(paymentIntent.id.length - 8)}`,
                                    amount: paymentIntent.amount,
                                    currency: paymentIntent.currency,
                                    paymentIntentId: paymentIntent.id,
                                    timestamp: new Date().toISOString(),
                                },
                            };

                            await prisma.userSession.update({
                                where: { sessionId: inquiry.sessionId },
                                data: {
                                    configurationData: updatedConfig as Prisma.InputJsonValue,
                                },
                            });
                            console.log('✅ Purchase tracking data saved to session for client-side GA4 event');
                        } catch (trackingError) {
                            console.warn('⚠️ Failed to save purchase tracking data:', trackingError);
                        }
                    }
                } catch (updateError) {
                    console.error('❌ Failed to mark emails as sent:', updateError);
                }
            } else {
                console.error('❌ Both customer and admin emails failed - NOT marking as sent to allow retry');
                throw new Error('Email delivery failed for both customer and admin');
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
