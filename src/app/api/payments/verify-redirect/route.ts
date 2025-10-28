import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
});

/**
 * Verify payment status after redirect return
 * Used when customers return from redirect-based payment methods (EPS, SOFORT, etc.)
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const paymentIntentId = searchParams.get('payment_intent');

        if (!paymentIntentId) {
            return NextResponse.json(
                { error: 'Missing payment_intent parameter' },
                { status: 400 }
            );
        }

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // Get inquiry from database (updated by webhook)
        const inquiry = await prisma.customerInquiry.findFirst({
            where: { paymentIntentId: paymentIntent.id },
            select: {
                id: true,
                paymentStatus: true,
                paymentMethod: true,
                paidAt: true,
                paymentAmount: true,
                paymentCurrency: true,
            },
        });

        // Determine final status
        let status = 'unknown';
        if (paymentIntent.status === 'succeeded') {
            status = 'succeeded';
        } else if (paymentIntent.status === 'processing') {
            status = 'processing';
        } else if (paymentIntent.status === 'requires_action') {
            status = 'requires_action';
        } else if (paymentIntent.status === 'canceled') {
            status = 'canceled';
        } else {
            status = 'failed';
        }

        return NextResponse.json({
            success: true,
            paymentIntentId: paymentIntent.id,
            status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            paymentMethod: paymentIntent.payment_method_types[0] || 'unknown',
            inquiry: inquiry ? {
                id: inquiry.id,
                paymentStatus: inquiry.paymentStatus,
                paidAt: inquiry.paidAt,
            } : null,
        });

    } catch (error) {
        console.error('❌ Error verifying payment redirect:', error);

        if (error instanceof Stripe.errors.StripeError) {
            return NextResponse.json(
                {
                    error: 'Payment verification failed',
                    message: error.message,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: 'Internal server error',
                message: 'Failed to verify payment status',
            },
            { status: 500 }
        );
    }
}

