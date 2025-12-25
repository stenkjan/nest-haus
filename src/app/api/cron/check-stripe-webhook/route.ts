import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/EmailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
});

/**
 * Cron Job: Check Stripe Webhook Health
 * 
 * Purpose: Monitors webhook delivery health and detects sync issues between
 * Stripe payments and database records.
 * 
 * Schedule: Runs every 6 hours (configured in vercel.json)
 * 
 * What it does:
 * 1. Fetches recent successful payments from Stripe (last 24 hours)
 * 2. Checks if corresponding database records exist and are updated
 * 3. Alerts admin if discrepancies are found
 * 4. Logs health status for monitoring
 */
export async function GET(request: NextRequest) {
    try {
        // Verify this is a legitimate cron request from Vercel
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            console.error('[Webhook Health Check] Unauthorized cron request');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.log('[Webhook Health Check] Starting health check...');

        // Fetch payments from the last 24 hours
        const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
        const recentPayments = await stripe.paymentIntents.list({
            created: { gte: oneDayAgo },
            limit: 100,
        });

        console.log(`[Webhook Health Check] Found ${recentPayments.data.length} recent payments in Stripe`);

        const issues: Array<{
            paymentIntentId: string;
            stripeStatus: string;
            dbStatus: string | null;
            issue: string;
        }> = [];

        // Check each successful payment
        for (const payment of recentPayments.data) {
            if (payment.status === 'succeeded') {
                // Look up in database
                const inquiry = await prisma.customerInquiry.findFirst({
                    where: { paymentIntentId: payment.id },
                    select: {
                        id: true,
                        paymentIntentId: true,
                        paymentStatus: true,
                        email: true,
                        emailsSent: true,
                        paidAt: true,
                    },
                });

                // Check for issues
                if (!inquiry) {
                    issues.push({
                        paymentIntentId: payment.id,
                        stripeStatus: 'succeeded',
                        dbStatus: null,
                        issue: 'Payment exists in Stripe but no inquiry found in database',
                    });
                } else if (inquiry.paymentStatus !== 'PAID') {
                    issues.push({
                        paymentIntentId: payment.id,
                        stripeStatus: 'succeeded',
                        dbStatus: inquiry.paymentStatus || 'UNKNOWN',
                        issue: `Payment succeeded in Stripe but DB status is ${inquiry.paymentStatus}`,
                    });
                } else if (!inquiry.emailsSent) {
                    issues.push({
                        paymentIntentId: payment.id,
                        stripeStatus: 'succeeded',
                        dbStatus: inquiry.paymentStatus || 'PAID',
                        issue: 'Payment processed but confirmation emails not sent',
                    });
                }
            }
        }

        // If issues found, send alert
        if (issues.length > 0) {
            console.error(`[Webhook Health Check] ⚠️ Found ${issues.length} issues`);
            
            // Send admin alert
            try {
                await EmailService.sendEmail({
                    to: process.env.ADMIN_EMAIL || 'admin@nest-haus.at',
                    subject: `⚠️ Stripe Webhook Sync Issues Detected (${issues.length} issues)`,
                    html: `
                        <h2>Stripe Webhook Health Check - Issues Detected</h2>
                        <p><strong>${issues.length} discrepancies</strong> found between Stripe and database:</p>
                        
                        <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">
                            <thead>
                                <tr style="background-color: #f0f0f0;">
                                    <th>Payment Intent ID</th>
                                    <th>Stripe Status</th>
                                    <th>DB Status</th>
                                    <th>Issue</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${issues.map(issue => `
                                    <tr>
                                        <td><code>${issue.paymentIntentId}</code></td>
                                        <td>${issue.stripeStatus}</td>
                                        <td>${issue.dbStatus || 'N/A'}</td>
                                        <td>${issue.issue}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        
                        <h3>Recommended Actions:</h3>
                        <ol>
                            <li>Check webhook endpoint: <a href="https://dashboard.stripe.com/webhooks">Stripe Dashboard</a></li>
                            <li>Verify webhook is enabled and receiving events</li>
                            <li>Check recent webhook delivery logs in Stripe</li>
                            <li>Review Vercel logs for error messages</li>
                            <li>Manually resend failed webhook events if needed</li>
                        </ol>
                        
                        <p><strong>Stripe Dashboard:</strong> <a href="https://dashboard.stripe.com/payments">View Payments</a></p>
                        <p><strong>Webhook Logs:</strong> <a href="https://dashboard.stripe.com/webhooks">View Webhooks</a></p>
                        
                        <hr>
                        <p style="color: #666; font-size: 12px;">
                            This is an automated alert from the Stripe webhook health check cron job.
                            Check time: ${new Date().toISOString()}
                        </p>
                    `,
                });
                
                console.log('[Webhook Health Check] ✅ Alert email sent to admin');
            } catch (emailError) {
                console.error('[Webhook Health Check] ❌ Failed to send alert email:', emailError);
            }

            return NextResponse.json({
                status: 'warning',
                message: `Found ${issues.length} sync issues`,
                issues,
                checkedPayments: recentPayments.data.length,
                timestamp: new Date().toISOString(),
            });
        }

        // All good!
        console.log('[Webhook Health Check] ✅ All payments synced correctly');
        
        return NextResponse.json({
            status: 'healthy',
            message: 'All webhooks synced correctly',
            checkedPayments: recentPayments.data.length,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('[Webhook Health Check] ❌ Health check failed:', error);
        
        // Send critical error alert
        try {
            await EmailService.sendEmail({
                to: process.env.ADMIN_EMAIL || 'admin@nest-haus.at',
                subject: '🚨 Critical: Stripe Webhook Health Check Failed',
                html: `
                    <h2>Critical Error: Webhook Health Check Failed</h2>
                    <p>The automated health check for Stripe webhooks encountered an error and could not complete.</p>
                    
                    <p><strong>Error:</strong></p>
                    <pre>${error instanceof Error ? error.message : 'Unknown error'}</pre>
                    
                    <p><strong>Stack Trace:</strong></p>
                    <pre>${error instanceof Error ? error.stack : 'N/A'}</pre>
                    
                    <h3>Immediate Actions Required:</h3>
                    <ol>
                        <li>Check Vercel logs for detailed error information</li>
                        <li>Verify STRIPE_SECRET_KEY environment variable is set</li>
                        <li>Verify database connection is working</li>
                        <li>Check Stripe API status: <a href="https://status.stripe.com">Stripe Status</a></li>
                    </ol>
                    
                    <hr>
                    <p style="color: #666; font-size: 12px;">
                        Error time: ${new Date().toISOString()}
                    </p>
                `,
            });
        } catch (alertError) {
            console.error('[Webhook Health Check] ❌ Failed to send critical error alert:', alertError);
        }

        return NextResponse.json(
            {
                status: 'error',
                message: 'Health check failed',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}
