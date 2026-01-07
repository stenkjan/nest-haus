# 💳 Stripe Production Setup Guide

## 🚀 Switching to Live Mode

To activate real payments for Hoam-House, you must update the environment variables in Vercel (Production) and `.env.local` (if testing locally).

## 🌐 Multi-Domain Support

Your application supports multiple domains:
- `nest-haus.at` (current primary)
- `www.nest-haus.at`
- `da-hoam.at` (future primary for rebranding)
- `www.da-hoam.at`

The webhook endpoint works across **all domain variants** without any code changes required. Simply choose one domain for your Stripe webhook configuration.

### 1. Get Production Keys from Stripe Dashboard
1.  Log in to [Stripe Dashboard](https://dashboard.stripe.com/login).
2.  Toggle "Test Mode" **OFF** (top right).
3.  Go to **Developers > API keys**.
4.  Copy **Publishable key** (`pk_live_...`).
5.  Copy **Secret key** (`sk_live_...`).
6.  Go to **Developers > Webhooks**.
7.  Add a new endpoint (choose one):
    - **Recommended:** `https://nest-haus.at/api/webhooks/stripe`
    - **Alternative:** `https://www.nest-haus.at/api/webhooks/stripe`
    - **For migration:** `https://da-hoam.at/api/webhooks/stripe`
8.  Select events: 
    - `payment_intent.succeeded`
    - `payment_intent.payment_failed`
    - `payment_intent.canceled`
    - `payment_intent.processing`
    - `charge.refunded`
    - `refund.created`
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
The webhook handler at `src/app/api/webhooks/stripe/route.ts` uses `STRIPE_WEBHOOK_SECRET` to verify that events actually come from Stripe.

**Verification Step:**
1.  Make a €1 live payment (using a real credit card).
2.  Check Stripe Dashboard > Developers > Webhooks > [Your Endpoint].
3.  Ensure the event shows "200 OK" response from your server.
4.  Check your Admin Dashboard > Inquiries to see if the payment status updated to "PAID".

### 5. Domain Migration Path (nest-haus.at → da-hoam.at)

When ready to migrate to the new da-hoam.at domain:

**Option A - Update existing webhook:**
1. Go to Stripe Dashboard > Developers > Webhooks
2. Edit your existing webhook endpoint
3. Change URL from `https://nest-haus.at/api/webhooks/stripe` to `https://da-hoam.at/api/webhooks/stripe`
4. Save (webhook secret remains the same, no code changes needed)

**Option B - Add second webhook (zero-downtime migration):**
1. Keep existing nest-haus.at webhook active
2. Add new webhook for da-hoam.at with same events
3. Use the SAME webhook secret (or different if preferred)
4. Test on da-hoam.at domain
5. Remove nest-haus.at webhook after verification

**Note:** Both domains work with the same webhook handler code - no backend changes required!

### ⚠️ Important Checks
*   **Tax Rates**: Ensure you have configured tax rates in Stripe Dashboard if needed, or handle VAT in the application logic.
*   **Receipts**: Stripe automatically sends receipts if enabled in Dashboard settings.
*   **Payouts**: Verify your bank account is connected in Stripe for payouts.


































