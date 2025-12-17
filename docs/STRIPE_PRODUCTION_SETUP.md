# 💳 Stripe Production Setup Guide

## 🚀 Switching to Live Mode

To activate real payments for Nest-Haus, you must update the environment variables in Vercel (Production) and `.env.local` (if testing locally).

### 1. Get Production Keys from Stripe Dashboard
1.  Log in to [Stripe Dashboard](https://dashboard.stripe.com/login).
2.  Toggle "Test Mode" **OFF** (top right).
3.  Go to **Developers > API keys**.
4.  Copy **Publishable key** (`pk_live_...`).
5.  Copy **Secret key** (`sk_live_...`).
6.  Go to **Developers > Webhooks**.
7.  Add a new endpoint: `https://nest-haus.at/api/payments/webhook`.
8.  Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`.
9.  Copy **Signing secret** (`whsec_...`).

### 2. Update Vercel Environment Variables
1.  Go to Vercel Project > Settings > Environment Variables.
2.  Update the following variables:

```bash
# STRIPE CONFIGURATION (PRODUCTION)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 3. Update Price Amount (Optional)
If you want to change the deposit amount for production:

```bash
# PAYMENT CONFIGURATION
DEPOSIT_AMOUNT=300000  # 3.000,00 EUR (in cents)
```

### 4. Verify Webhook Signature
The webhook handler at `src/app/api/payments/webhook/route.ts` uses `STRIPE_WEBHOOK_SECRET` to verify that events actually come from Stripe.

**Verification Step:**
1.  Make a €1 live payment (using a real credit card).
2.  Check Stripe Dashboard > Developers > Webhooks > [Your Endpoint].
3.  Ensure the event shows "200 OK" response from your server.
4.  Check your Admin Dashboard > Inquiries to see if the payment status updated to "PAID".

### ⚠️ Important Checks
*   **Tax Rates**: Ensure you have configured tax rates in Stripe Dashboard if needed, or handle VAT in the application logic.
*   **Receipts**: Stripe automatically sends receipts if enabled in Dashboard settings.
*   **Payouts**: Verify your bank account is connected in Stripe for payouts.


























