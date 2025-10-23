/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe payment events to automatically update customer inquiry payment status.
 * This ensures payment status is always in sync with Stripe's actual payment state.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

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

                // If we updated any inquiries, also update associated sessions
                if (updated.count > 0) {
                    const inquiry = await prisma.customerInquiry.findFirst({
                        where: { paymentIntentId: paymentIntent.id },
                        select: { sessionId: true },
                    });

                    if (inquiry?.sessionId) {
                        await prisma.userSession.updateMany({
                            where: { sessionId: inquiry.sessionId },
                            data: { status: 'COMPLETED' },
                        });
                        console.log(`[Stripe Webhook] Marked session ${inquiry.sessionId} as COMPLETED`);
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

