import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20.acacia',
});

interface RouteContext {
    params: Promise<{
        paymentIntentId: string;
    }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { paymentIntentId } = await context.params;

        if (!paymentIntentId) {
            return NextResponse.json(
                { error: 'Payment Intent ID is required' },
                { status: 400 }
            );
        }

        console.log('💳 Checking payment status for:', paymentIntentId);

        // Get payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // Get inquiry from database if exists
        let inquiry = null;
        try {
            inquiry = await prisma.customerInquiry.findFirst({
                where: { paymentIntentId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    paymentStatus: true,
                    paymentAmount: true,
                    paymentCurrency: true,
                    paidAt: true,
                    createdAt: true,
                },
            });
        } catch (dbError) {
            console.warn('⚠️ Could not fetch inquiry from database:', dbError);
        }

        const response = {
            paymentIntentId,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            paymentMethod: paymentIntent.payment_method_types,
            created: paymentIntent.created,
            inquiry: inquiry ? {
                id: inquiry.id,
                email: inquiry.email,
                name: inquiry.name,
                paymentStatus: inquiry.paymentStatus,
                paidAt: inquiry.paidAt,
            } : null,
        };

        console.log('✅ Payment status retrieved:', paymentIntent.status);

        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Error retrieving payment status:', error);

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
                message: 'Failed to retrieve payment status',
            },
            { status: 500 }
        );
    }
}
