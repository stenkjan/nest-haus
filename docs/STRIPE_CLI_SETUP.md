# Stripe CLI Setup for Localhost Webhook Testing

## Overview

Stripe webhooks are HTTP callbacks from Stripe's servers to your application server. When testing locally (`localhost:3000`), Stripe's servers cannot reach your machine directly. The Stripe CLI solves this by creating a secure tunnel to forward webhook events to your local development server.

## Why You Need This

**Payment Confirmation Emails** are triggered by Stripe webhooks when:
1. Customer completes payment
2. Stripe sends `payment_intent.succeeded` event to your webhook endpoint
3. Your `/api/webhooks/stripe` endpoint receives the event
4. Email service sends payment confirmation to customer and admin

**Without Stripe CLI**: Webhooks don't reach localhost → No payment emails during local testing

**With Stripe CLI**: Webhooks are forwarded to localhost → Payment emails work as in production

---

## Installation

### Windows

#### Option 1: Scoop (Recommended)
```bash
scoop install stripe
```

#### Option 2: Direct Download
1. Download from: https://github.com/stripe/stripe-cli/releases/latest
2. Look for: `stripe_X.X.X_windows_x86_64.zip`
3. Extract to a folder (e.g., `C:\Program Files\Stripe\`)
4. Add to PATH:
   - Open System Properties → Environment Variables
   - Edit `Path` variable
   - Add: `C:\Program Files\Stripe\`
   - Click OK

#### Option 3: MSI Installer
1. Download MSI installer from releases page
2. Run installer
3. Follow installation wizard

### macOS

#### Using Homebrew:
```bash
brew install stripe/stripe-cli/stripe
```

#### Using Direct Download:
```bash
# Download and install
curl -L https://github.com/stripe/stripe-cli/releases/latest/download/stripe_latest_darwin_x86_64.tar.gz -o stripe.tar.gz
tar -xvf stripe.tar.gz
sudo mv stripe /usr/local/bin/
```

### Linux

```bash
# Debian/Ubuntu
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_latest_linux_x86_64.tar.gz
tar -xvf stripe_latest_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/

# Or use package manager
# See: https://stripe.com/docs/stripe-cli#install
```

---

## Setup & Configuration

### 1. Verify Installation

```bash
stripe --version
```

Expected output: `stripe version X.X.X`

---

### 2. Login to Stripe

```bash
stripe login
```

**What Happens**:
1. CLI opens browser to Stripe dashboard
2. You confirm access
3. CLI receives API keys automatically

**Output**:
```
Your pairing code is: word-word-word
Press Enter to open the browser (^C to quit)
> Done! The Stripe CLI is configured for [Your Account]
```

**Alternative - Manual API Key**:
If browser login fails:
```bash
stripe login --api-key sk_test_...
```

---

### 3. Forward Webhooks to Localhost

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**What This Does**:
- Creates secure tunnel from Stripe to your localhost
- Forwards ALL webhook events to `http://localhost:3000/api/webhooks/stripe`
- Shows webhook signing secret (needed for verification)

**Output**:
```
> Ready! Your webhook signing secret is whsec_abc123xyz... (^C to quit)
> Listening for events on all accounts...
```

**Important**: Keep this terminal open while testing!

---

### 4. Update Webhook Secret (Optional for Testing)

The CLI provides a temporary webhook secret. You can either:

#### Option A: Use Temporary Secret (Easiest)
1. Copy the secret from CLI output: `whsec_abc123xyz...`
2. Temporarily update `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_abc123xyz...
   ```
3. Restart Next.js server
4. After testing, revert to original secret

#### Option B: Skip Signature Verification (Not Recommended)
Temporarily disable signature verification in `/api/webhooks/stripe/route.ts`

---

## Testing Payment Emails

### Step 1: Start Stripe CLI Listener

```bash
# Terminal 1: Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Keep this running!**

---

### Step 2: Start Next.js Dev Server

```bash
# Terminal 2: Next.js
npm run dev
```

**Watch for**:
- Server starts on `http://localhost:3000`
- No startup errors

---

### Step 3: Make a Test Payment

#### Option A: Through Your UI
1. Navigate to: `http://localhost:3000/warenkorb`
2. Configure a product
3. Click "Jetzt bezahlen"
4. Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any 5-digit ZIP code

#### Option B: Trigger Test Webhook Manually
```bash
# Terminal 3: Trigger test event
stripe trigger payment_intent.succeeded
```

---

### Step 4: Verify Email Sending

**In Terminal 1 (Stripe CLI)**:
```
[200] POST /api/webhooks/stripe [evt_abc123]
```

**In Terminal 2 (Next.js Console)**:
```
[Stripe Webhook] Received event: payment_intent.succeeded (evt_abc123)
[Stripe Webhook] Payment successful: pi_3STgN3JKOS0b7etB04f28MqI
💳 Sending payment confirmation email to customer@example.com
✅ Payment confirmation email sent successfully: msg_xyz789
💳 Sending admin payment notification for inquiry cmi04yxqf
✅ Admin email sent successfully: msg_abc456
[Stripe Webhook] ✅ Sent payment confirmation to customer@example.com
[Stripe Webhook] ✅ Sent admin payment notification
```

**Check Email Inbox**:
- Customer receives payment confirmation
- Admin receives payment notification

---

## Common Commands

### Listen for Webhooks
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Trigger Specific Events
```bash
# Payment succeeded
stripe trigger payment_intent.succeeded

# Payment failed
stripe trigger payment_intent.payment_failed

# Charge refunded
stripe trigger charge.refunded

# List all available events
stripe trigger --help
```

### View Event Logs
```bash
stripe events list
```

### Get Event Details
```bash
stripe events retrieve evt_abc123
```

### Test Webhook Endpoint
```bash
stripe samples create checkout-session-completed
```

---

## Troubleshooting

### Issue: "Command not found: stripe"

**Solution**: Add Stripe CLI to PATH
- Windows: Add installation folder to System Environment Variables → Path
- Mac/Linux: Move binary to `/usr/local/bin/`

---

### Issue: "Failed to verify webhook signature"

**Cause**: Webhook secret mismatch

**Solution**:
1. Get secret from Stripe CLI output: `whsec_...`
2. Update `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_from_cli_output
   ```
3. Restart Next.js server: `rm -rf .next && npm run dev`

---

### Issue: "[404] POST /api/webhooks/stripe"

**Cause**: Next.js route not found

**Solution**:
- Verify file exists: `src/app/api/webhooks/stripe/route.ts`
- Check for typos in path
- Restart Next.js server

---

### Issue: "Webhook received but no email logs"

**Diagnosis**:
```bash
# Check if webhook endpoint logs anything
stripe trigger payment_intent.succeeded
# Watch Next.js console for [Stripe Webhook] logs
```

**Solution**:
- Check if `CustomerInquiry` record exists with matching `paymentIntentId`
- Verify `inquiry.email` is set
- Check Resend API key is configured
- Look for error logs in Next.js console

---

### Issue: CLI shows event but Next.js doesn't receive it

**Solution**:
1. Verify Next.js server is running on port 3000
2. Check for port conflicts: `netstat -an | findstr :3000`
3. Restart both Stripe CLI and Next.js server

---

## Production Deployment

### No Stripe CLI Needed in Production!

In production (Vercel deployment):

1. **Configure Webhook in Stripe Dashboard**:
   - Go to: https://dashboard.stripe.com/webhooks
   - Click: "Add endpoint"
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: Select `payment_intent.succeeded`, `charge.refunded`, etc.
   - Copy webhook signing secret

2. **Add Secret to Vercel**:
   ```bash
   vercel env add STRIPE_WEBHOOK_SECRET production
   # Paste the secret from Stripe Dashboard
   ```

3. **Redeploy**:
   ```bash
   vercel --prod
   ```

4. **Test**:
   - Make real test payment (test mode)
   - Webhook fires automatically
   - Emails sent via Resend

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `stripe login` | Authenticate CLI with Stripe account |
| `stripe listen --forward-to localhost:3000/api/webhooks/stripe` | Forward webhooks to local server |
| `stripe trigger payment_intent.succeeded` | Simulate payment success |
| `stripe events list` | View recent webhook events |
| `stripe logs tail` | Live view of API requests |

---

## Alternative: Skip Webhook Testing Locally

If Stripe CLI setup is too complex, you can:

1. **Use Test Endpoint**:
   ```bash
   curl "http://localhost:3000/api/test/payment-email?to=your-email@example.com"
   ```
   This directly triggers payment emails without Stripe webhook.

2. **Test in Production**:
   - Deploy to Vercel
   - Configure webhook in Stripe Dashboard
   - Make test payment in production
   - Real webhook fires → Emails sent

---

**Date**: November 15, 2025  
**Purpose**: Enable payment confirmation email testing on localhost  
**Required For**: Testing Stripe webhook → Email flow locally

