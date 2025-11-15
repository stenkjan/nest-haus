# Email Testing & Troubleshooting Guide

## Quick Test Endpoints

### 1. Basic Email Test
Tests if Resend integration works with a simple customer confirmation email.

```bash
curl "http://localhost:3000/api/test/email?to=your-email@example.com"
```

**Expected Result**: ✅ Success response + email arrives in inbox

**What It Tests**:
- Resend API key configuration
- Email service initialization  
- Customer confirmation email template
- FROM: `NEST-Haus Team <mail@send.nest-haus.com>`
- REPLY-TO: `mail@nest-haus.com`

---

### 2. Appointment Booking Test
Tests the full appointment booking flow through the contact API.

```bash
curl "http://localhost:3000/api/test/appointment?to=your-email@example.com"
```

**Expected Result**: ✅ Success response + 2 emails sent (customer + admin)

**What It Tests**:
- `/api/contact` API endpoint
- Appointment booking email flow
- Customer confirmation email (with appointment details)
- Admin notification email
- Database inquiry creation
- Calendar availability integration

**Check Server Console For**:
```
📬 Sending email notifications...
✅ Customer confirmation email sent
✅ Admin notification email sent
```

---

### 3. Payment Confirmation Test
Tests payment confirmation emails (customer + admin).

```bash
curl "http://localhost:3000/api/test/payment-email?to=your-email@example.com"
```

**Expected Result**: ✅ Success response + 2 emails sent (customer + admin)

**What It Tests**:
- Payment confirmation email template (customer)
- Admin payment notification email template
- Configuration data parsing in emails
- Price display formatting
- Grundstückscheck & Terminvereinbarung status display

**Note**: This bypasses Stripe webhook (for direct testing)

---

## Issue Diagnosis

### Issue 1: Payment Emails Not Sending (SOLVED)

**Problem**: Stripe webhook doesn't reach localhost by default.

**Why**: Stripe webhooks are HTTP callbacks from Stripe's servers to your server. They can't reach `localhost:3000` from the internet.

**Solution Options**:

#### Option A: Stripe CLI (Recommended for Testing)

1. Install Stripe CLI:
   - Windows: Download from https://github.com/stripe/stripe-cli/releases
   - Or use: `scoop install stripe`

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to localhost:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Make a test payment:
   - Stripe CLI will forward the webhook to your local server
   - Watch for `[Stripe Webhook]` logs in your Next.js console

5. Check for email logs:
   ```
   [Stripe Webhook] ✅ Sent payment confirmation to customer@example.com
   [Stripe Webhook] ✅ Sent admin payment notification
   ```

#### Option B: Use Test Endpoint (Current Method)

Use the test endpoint we created:
```bash
curl "http://localhost:3000/api/test/payment-email?to=m.janstenk@gmail.com"
```

This directly triggers the payment email logic without needing Stripe webhook.

#### Option C: Deploy to Production

In production (Vercel):
- Stripe webhooks work automatically
- No Stripe CLI needed
- Webhooks are configured in Stripe Dashboard → Webhooks
- Endpoint: `https://your-domain.com/api/webhooks/stripe`

---

### Issue 2: Appointment Emails Not Sending (TESTING REQUIRED)

**Status**: ✅ Test endpoint confirms `/api/contact` API works

**Next Steps**:

1. **Book Appointment Through UI**:
   - Navigate to: `/warenkorb#terminvereinbarung`
   - Fill out form completely
   - Select date and time
   - Submit

2. **Check Server Console For**:
   ```
   🗓️ Sending appointment request: {...}
   📬 Appointment API response: { ok: true, result: {...} }
   ✅ Appointment request sent successfully
   📬 Sending email notifications...
   ✅ Customer confirmation email sent
   ✅ Admin notification email sent
   ```

3. **If No Email Logs Appear**:
   - Check if `/api/contact` is being called (console should show `📬 Sending email notifications...`)
   - Check Resend dashboard for delivery status
   - Check server terminal for any error messages

---

## Environment Variables Check

Verify these are set correctly in `.env` and `.env.local`:

```bash
RESEND_API_KEY=re_WTuw2cJE_9P9KLKkoLnY25ri8Xi5TGh9U
RESEND_FROM_EMAIL=mail@send.nest-haus.com
REPLY_TO_EMAIL=mail@nest-haus.com
ADMIN_EMAIL=mail@nest-haus.com
SALES_EMAIL=mail@nest-haus.com
```

**Restart Server After Changes**:
```bash
# Kill all node processes
taskkill //F //IM node.exe

# Delete cache
rm -rf .next

# Restart
npm run dev
```

---

## Resend Dashboard Check

1. Login to: https://resend.com/emails
2. Check recent emails:
   - ✅ Green = Delivered
   - ⏳ Yellow = Processing
   - ❌ Red = Failed

3. Click on any email to see:
   - Delivery status
   - Error messages (if failed)
   - Email preview
   - Headers (FROM, REPLY-TO, etc.)

4. Check domain status: https://resend.com/domains
   - `send.nest-haus.com` should show:
     - ✅ DKIM verified
     - ✅ SPF verified
     - ✅ MX record verified

---

## Testing Checklist

- [x] Basic email test endpoint works (`/api/test/email`)
- [x] Appointment booking API works (`/api/test/appointment`)
- [ ] Payment email templates work (`/api/test/payment-email`) - **NEEDS SERVER CONSOLE CHECK**
- [ ] Appointment booking through UI sends emails - **USER TO TEST**
- [ ] Payment through UI triggers webhook - **REQUIRES STRIPE CLI OR PRODUCTION**

---

## Server Console Logs to Watch For

### Successful Email Sending:
```
📬 Sending email notifications...
📧 Sending customer confirmation email to customer@example.com
✅ Customer email sent successfully: msg_abc123xyz
📧 Sending admin notification for inquiry cmi04yxqf008vgskw2y5qqt4k
✅ Admin email sent successfully: msg_def456uvw
```

### Payment Email Logs (via Stripe Webhook):
```
[Stripe Webhook] Received event: payment_intent.succeeded (evt_abc123)
[Stripe Webhook] Payment successful: pi_3STgN3JKOS0b7etB04f28MqI
[Stripe Webhook] ✅ Sent payment confirmation to customer@example.com
[Stripe Webhook] ✅ Sent admin payment notification
```

### Error Logs:
```
❌ Failed to send customer email: [error message]
❌ Email sending failed: [error details]
```

---

## Quick Fixes

### If Emails Not Arriving:

1. **Check spam folder** (most common issue)

2. **Verify Resend API key**:
   ```bash
   echo $RESEND_API_KEY
   # Should show: re_WTuw2cJE_9P9KLKkoLnY25ri8Xi5TGh9U
   ```

3. **Check Resend dashboard** for delivery status

4. **Restart server** after env variable changes

5. **Check domain verification** in Resend dashboard

### If Payment Emails Not Working:

1. **Use test endpoint** for immediate testing:
   ```bash
   curl "http://localhost:3000/api/test/payment-email?to=your-email@example.com"
   ```

2. **For production testing**: Deploy to Vercel and configure Stripe webhook

3. **For localhost testing**: Use Stripe CLI to forward webhooks

---

## Email Template Files

1. **Customer Confirmation**: `src/lib/emailTemplates/CustomerConfirmationTemplate.ts`
2. **Admin Notification**: `src/lib/emailTemplates/AdminNotificationTemplate.ts`
3. **Payment Confirmation**: `src/lib/emailTemplates/PaymentConfirmationTemplate.ts`
4. **Admin Payment Notification**: `src/lib/emailTemplates/AdminPaymentNotificationTemplate.ts`

All templates include:
- Google Geist font
- Glass morphism design
- Responsive mobile layout
- Configuration details display
- Price formatting

---

## API Endpoints

### Production Endpoints:
- `/api/contact` - Contact form & appointment bookings
- `/api/webhooks/stripe` - Stripe payment webhooks

### Test Endpoints (Development Only):
- `/api/test/email` - Basic email test
- `/api/test/appointment` - Appointment booking test
- `/api/test/payment-email` - Payment confirmation test

---

## Next Steps

1. ✅ Basic email sending works (confirmed via `/api/test/email`)
2. ✅ Appointment API works (confirmed via `/api/test/appointment`)
3. 🔄 Check server console for payment email test results
4. 🔄 User to test appointment booking through UI
5. 🔄 Setup Stripe CLI OR deploy to production for payment email testing

---

**Date**: November 15, 2025  
**Status**: Email system configured and partially tested  
**Configuration**: `nest-haus.com` sending via Resend, Google Workspace receiving

