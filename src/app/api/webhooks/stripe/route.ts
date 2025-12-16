import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/EmailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        console.error('[Stripe Webhook] No signature provided');
        return NextResponse.json(
            { error: 'No signature provided' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`[Stripe Webhook] Signature verification failed: ${errorMessage}`);
        return NextResponse.json(
            { error: `Webhook signature verification failed: ${errorMessage}` },
            { status: 400 }
        );
    }

    console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

    try {
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`[Stripe Webhook] Payment succeeded: ${paymentIntent.id}`);

                // Update customer inquiry with successful payment
                const updated = await prisma.customerInquiry.updateMany({
                    where: { paymentIntentId: paymentIntent.id },
                    data: {
                        paymentStatus: 'PAID',
                        paidAt: new Date(),
                        status: 'CONVERTED',
                        paymentAmount: paymentIntent.amount,
                        paymentCurrency: paymentIntent.currency,
                        paymentMethod: paymentIntent.payment_method_types[0] || null,
                    },
                });

                console.log(`[Stripe Webhook] Updated ${updated.count} inquiries for payment ${paymentIntent.id}`);

                // If we updated any inquiries, also update associated sessions and send emails
                if (updated.count > 0) {
                    const inquiry = await prisma.customerInquiry.findFirst({
                        where: { paymentIntentId: paymentIntent.id },
                        select: {
                            id: true,
                            sessionId: true,
                            name: true,
                            email: true,
                            paymentIntentId: true, // CRITICAL: Required for idempotency check
                            configurationData: true,
                            paymentAmount: true,
                            paymentCurrency: true,
                            paymentMethod: true,
                            emailsSent: true, // Bug fix: Include for idempotency check
                            emailsSentAt: true,
                        },
                    });

                    if (!inquiry) {
                        console.warn('[Stripe Webhook] ⚠️ No inquiry found after update');
                        break;
                    }

                    // Idempotency check: Only skip if emails were sent for THIS specific payment intent
                    // Stripe retries webhooks, so we must prevent duplicate sends for the same payment
                    // But allow emails for NEW payments from the same customer
                    if (inquiry.emailsSent && inquiry.paymentIntentId === paymentIntent.id) {
                        console.log('[Stripe Webhook] ✅ Emails already sent for this payment intent, skipping');
                        break;
                    }

                    if (inquiry.sessionId) {
                        // Update session status
                        await prisma.userSession.updateMany({
                            where: { sessionId: inquiry.sessionId },
                            data: { status: 'COMPLETED' },
                        });
                        console.log(`[Stripe Webhook] Marked session ${inquiry.sessionId} as COMPLETED`);
                    }

                    // Send payment confirmation emails
                    if (inquiry.email) {
                        let customerEmailSent = false;
                        let adminEmailSent = false;

                        // Send customer confirmation email
                        try {
                            await EmailService.sendPaymentConfirmation({
                                inquiryId: inquiry.id,
                                name: inquiry.name || 'Kunde',
                                email: inquiry.email,
                                paymentAmount: paymentIntent.amount || inquiry.paymentAmount || 150000,
                                paymentCurrency: inquiry.paymentCurrency || paymentIntent.currency,
                                paymentMethod: inquiry.paymentMethod || paymentIntent.payment_method_types[0] || 'card',
                                paymentIntentId: paymentIntent.id,
                                paidAt: new Date(),
                                configurationData: inquiry.configurationData,
                            });
                            customerEmailSent = true;
                            console.log(`[Stripe Webhook] ✅ Sent payment confirmation to ${inquiry.email}`);
                        } catch (customerEmailError) {
                            console.error(`[Stripe Webhook] ❌ Failed to send customer email:`, customerEmailError);
                        }

                        // Send admin notification email
                        try {
                            await EmailService.sendAdminPaymentNotification({
                                inquiryId: inquiry.id,
                                name: inquiry.name || 'Kunde',
                                email: inquiry.email,
                                paymentAmount: paymentIntent.amount || inquiry.paymentAmount || 150000,
                                paymentCurrency: inquiry.paymentCurrency || paymentIntent.currency,
                                paymentMethod: inquiry.paymentMethod || paymentIntent.payment_method_types[0] || 'card',
                                paymentIntentId: paymentIntent.id,
                                stripeCustomerId: paymentIntent.customer as string || '',
                                paidAt: new Date(),
                                configurationData: inquiry.configurationData,
                                sessionId: inquiry.sessionId || undefined,
                            });
                            adminEmailSent = true;
                            console.log(`[Stripe Webhook] ✅ Sent admin payment notification`);
                        } catch (adminEmailError) {
                            console.error(`[Stripe Webhook] ❌ Failed to send admin email:`, adminEmailError);
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
                                console.log(`[Stripe Webhook] ✅ Marked emails as sent`);
                            } catch (updateError) {
                                console.error(`[Stripe Webhook] ❌ Failed to mark emails as sent:`, updateError);
                            }
                        } else {
                            console.error('[Stripe Webhook] ❌ Both customer and admin emails failed - NOT marking as sent to allow retry');
                        }
                    }
                }

                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`[Stripe Webhook] Payment failed: ${paymentIntent.id}`);

                const updated = await prisma.customerInquiry.updateMany({
                    where: { paymentIntentId: paymentIntent.id },
                    data: {
                        paymentStatus: 'FAILED',
                    },
                });

                console.log(`[Stripe Webhook] Marked ${updated.count} inquiries as FAILED for payment ${paymentIntent.id}`);
                break;
            }

            case 'payment_intent.canceled': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`[Stripe Webhook] Payment canceled: ${paymentIntent.id}`);

                const updated = await prisma.customerInquiry.updateMany({
                    where: { paymentIntentId: paymentIntent.id },
                    data: {
                        paymentStatus: 'CANCELLED',
                    },
                });

                console.log(`[Stripe Webhook] Marked ${updated.count} inquiries as CANCELLED for payment ${paymentIntent.id}`);
                break;
            }

            case 'payment_intent.processing': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`[Stripe Webhook] Payment processing: ${paymentIntent.id}`);

                await prisma.customerInquiry.updateMany({
                    where: { paymentIntentId: paymentIntent.id },
                    data: {
                        paymentStatus: 'PROCESSING',
                    },
                });

                break;
            }

            case 'charge.refunded': {
                const charge = event.data.object as Stripe.Charge;
                console.log(`[Stripe Webhook] Charge refunded: ${charge.id}`);

                // Find inquiry by payment intent from the charge
                if (charge.payment_intent && typeof charge.payment_intent === 'string') {
                    await prisma.customerInquiry.updateMany({
                        where: { paymentIntentId: charge.payment_intent },
                        data: {
                            paymentStatus: 'REFUNDED',
                        },
                    });
                }

                break;
            }

            case 'refund.created': {
                const refund = event.data.object as Stripe.Refund;
                console.log(`[Stripe Webhook] Refund created: ${refund.id}`);

                // Find inquiry by payment intent from the refund
                if (refund.payment_intent && typeof refund.payment_intent === 'string') {
                    await prisma.customerInquiry.updateMany({
                        where: { paymentIntentId: refund.payment_intent },
                        data: {
                            paymentStatus: 'REFUNDED',
                        },
                    });
                }

                break;
            }

            default:
                console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('[Stripe Webhook] Error processing event:', error);
        return NextResponse.json(
            {
                error: 'Webhook processing failed',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// Disable body parsing for webhooks - we need raw body for signature verification
export const runtime = 'nodejs';

