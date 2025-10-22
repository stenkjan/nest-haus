import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover', // Keep current API version for compatibility
});

// Validation schema for payment intent creation
const createPaymentIntentSchema = z.object({
    amount: z.number().min(50), // Minimum 50 cents
    currency: z.string().default('eur'),
    customerEmail: z.string().email(),
    customerName: z.string().optional(),
    inquiryId: z.string().optional(),
    metadata: z.record(z.string()).optional(),
});

export async function POST(request: NextRequest) {
    try {
        console.log('💳 Creating Stripe payment intent...');

        const body = await request.json();
        const validation = createPaymentIntentSchema.safeParse(body);

        if (!validation.success) {
            console.error('❌ Payment intent validation failed:', validation.error.issues);
            return NextResponse.json(
                {
                    error: 'Invalid payment data',
                    details: validation.error.issues,
                },
                { status: 400 }
            );
        }

        let { amount } = validation.data;
        const { currency, customerEmail, customerName, inquiryId, metadata } = validation.data;

        // Override amount with server-side configuration for testing
        const paymentMode = process.env.PAYMENT_MODE || "deposit";
        const depositAmount = parseInt(process.env.DEPOSIT_AMOUNT || "100"); // 1 EUR in cents

        console.log('💰 Server payment config:', { paymentMode, depositAmount, originalAmount: amount });

        if (paymentMode === "deposit") {
            amount = depositAmount;
        }

        // Create or retrieve customer in Stripe
        let customer: Stripe.Customer;
        const existingCustomers = await stripe.customers.list({
            email: customerEmail,
            limit: 1,
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
            console.log('✅ Found existing Stripe customer:', customer.id);
        } else {
            customer = await stripe.customers.create({
                email: customerEmail,
                name: customerName,
                metadata: {
                    source: 'nest-haus-configurator',
                    inquiryId: inquiryId || '',
                },
            });
            console.log('✅ Created new Stripe customer:', customer.id);
        }

        // Create payment intent with automatic payment methods (recommended approach)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount), // Stripe expects amount in cents
            currency: currency.toLowerCase(),
            customer: customer.id,
            // Use automatic payment methods - Stripe will show relevant methods based on country/currency
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'always', // Allow bank redirects like EPS, Sofort
            },
            metadata: {
                customerEmail,
                inquiryId: inquiryId || '',
                source: 'nest-haus-configurator',
                country: 'AT', // Explicit country for payment method selection
                ...metadata,
            },
            description: `NEST-Haus Konfiguration${inquiryId ? ` (Anfrage: ${inquiryId})` : ''}`,
        });

        console.log('✅ Payment intent created:', paymentIntent.id);
        console.log('💳 Payment methods requested:', paymentIntent.payment_method_types);
        console.log('🌍 Country configured:', 'AT');
        console.log('💰 Amount:', paymentIntent.amount, 'cents (€' + (paymentIntent.amount / 100) + ')');

        // Update inquiry with payment intent ID if provided
        if (inquiryId) {
            try {
                await prisma.customerInquiry.update({
                    where: { id: inquiryId },
                    data: {
                        paymentIntentId: paymentIntent.id,
                        paymentStatus: 'PROCESSING',
                        paymentAmount: amount,
                        paymentCurrency: currency.toLowerCase(),
                    },
                });
                console.log('✅ Updated inquiry with payment intent ID');
            } catch (dbError) {
                console.warn('⚠️ Failed to update inquiry with payment intent:', dbError);
                // Don't fail the payment intent creation if DB update fails
            }
        }

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            customerId: customer.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
        });

    } catch (error) {
        console.error('❌ Error creating payment intent:', error);

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
                message: 'Failed to create payment intent',
            },
            { status: 500 }
        );
    }
}
