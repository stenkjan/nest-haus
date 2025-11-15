# Email Configuration & Payment Email Status - November 15, 2025

## ✅ Completed Tasks

### 1. Payment Email Template Updated

**File**: `src/lib/emailTemplates/PaymentConfirmationTemplate.ts`

**Changes Made**:
- ✅ Added contact boxes (matching customer confirmation template)
- ✅ Includes payment details section
- ✅ Shows full configuration breakdown
- ✅ Displays "Dein Nest - Deine Auswahl" (all selected options)
- ✅ Shows "Dein Nest - Überblick" (price summary with total)
- ✅ Includes Planungspaket, Konzept-Check, and Terminvereinbarung
- ✅ Beautiful branded design with glass cards
- ✅ Responsive mobile design
- ✅ Matching plain text version

**Email Content Structure**:
```
┌─────────────────────────────────────┐
│  Contact Boxes                      │
│  - Kontakt (phone, email)          │
│  - Adresse (street, city)          │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Payment Confirmation               │
│  ✅ Zahlung bestätigt              │
│  - Amount                           │
│  - Payment Method                   │
│  - Date                             │
│  - Transaction ID                   │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Configuration Breakdown            │
│  🏠 Dein Nest - Deine Auswahl     │
│  - Nest-Modell                      │
│  - Gebäudehülle                    │
│  - Innenverkleidung                 │
│  - Fußboden                        │
│  - PV-Anlage                        │
│  - Fenster                          │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Price Overview                     │
│  📊 Dein Nest - Überblick         │
│  - Dein Nest Haus price             │
│  - Planungspaket                    │
│  - Konzept-Check                    │
│  - Terminvereinbarung status        │
│  ────────────────────────────       │
│  - GESAMTSUMME (Total)              │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Next Steps                         │
│  ⏭️ Die nächsten Schritte         │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Footer (Impressum, etc.)           │
└─────────────────────────────────────┘
```

---

### 2. Google Workspace Outbound Email Guide Created

**File**: `docs/GOOGLE_WORKSPACE_OUTBOUND_EMAILS_GUIDE.md`

**Contents**:
- ✅ How to view outbound emails (4 different methods)
- ✅ Understanding what you will/won't see
- ✅ Setting up Google Group access
- ✅ Adding BCC to see copies in Gmail
- ✅ Email flow diagrams
- ✅ Testing procedures
- ✅ Troubleshooting guide

**Key Answer to Your Question**:

> **"How can we see the outbound mails ourselves in Google Workspace?"**

**Answer**: By default, you **WON'T** see outbound emails in Google Workspace Sent folder because they're sent via Resend API, not through Google's servers.

**Solutions**:
1. **Use Resend Dashboard** (https://resend.com/emails) - See all sent emails with delivery status
2. **Add BCC to all emails** - Copy yourself on every outbound email
3. **Set up email forwarding/archiving** - Save copies to database or archive

**For the Google Group `mail@nest-haus.com`**:
- You WILL see **incoming** emails (customer replies)
- You WON'T see **outgoing** emails (sent via Resend)
- To add it to Gmail: Go to https://groups.google.com → Add yourself as member → Enable email delivery

---

## 🐛 Current Issue: Payment Emails Not Sending

### Problem

**User Report**: "Paying in warenkorb#abschluss doesn't trigger sending the payment confirmation mail. The terminanfrage mail now successfully works, but paying doesn't send a mail."

### Investigation Needed

The code looks correct:
- ✅ `/api/payments/webhook/route.ts` calls `EmailService.sendPaymentConfirmation()`
- ✅ `/api/payments/confirm-payment/route.ts` calls `EmailService.sendPaymentConfirmation()`
- ✅ Payment email template is properly formatted
- ✅ Email service configuration is correct

### Possible Causes

1. **Payment flow not reaching the email sending code**
   - Payment might be failing before email logic is reached
   - Check if Stripe webhook is configured correctly

2. **Inquiry not found in database**
   - If `inquiry.email` or `inquiry.name` is null, emails won't send
   - Need to check database records after payment

3. **Silent email sending failure**
   - EmailService catches errors and logs them
   - Need to check server logs for email errors

4. **Stripe webhook not configured**
   - Webhook might not be hitting `/api/payments/webhook`
   - Need to verify webhook endpoint in Stripe Dashboard

### Next Steps to Debug

#### Step 1: Check Server Logs

Look for these console messages after making a payment:
```bash
# Expected logs:
✅ Payment succeeded webhook: pi_xxx
✅ Updated inquiry payment status: [inquiry-id]
📧 Sending customer confirmation email to [email]
✅ Customer email sent successfully: [resend-id]
💳 Sending admin payment notification for inquiry [inquiry-id]
✅ Admin email sent successfully: [resend-id]
✅ Payment confirmation emails sent via webhook

# If you see these instead, there's an error:
❌ Failed to send customer email: [error]
⚠️ Failed to send emails via webhook: [error]
⚠️ No inquiry found for payment intent: [payment-intent-id]
```

#### Step 2: Check Stripe Webhook Configuration

1. Go to https://dashboard.stripe.com/webhooks
2. Find webhook for your local/production environment
3. Verify endpoint URL:
   - Local: `https://your-ngrok-url/api/payments/webhook`
   - Production: `https://nest-haus.at/api/payments/webhook`
4. Check "Events sent" - should show `payment_intent.succeeded`
5. Click on recent events to see delivery status

#### Step 3: Check Database Records

After making a test payment:
```sql
-- Check if inquiry was created and updated
SELECT id, email, name, paymentStatus, paymentIntentId, paidAt 
FROM "CustomerInquiry" 
WHERE paymentStatus = 'PAID' 
ORDER BY paidAt DESC 
LIMIT 5;

-- Check if there are any PENDING payments
SELECT id, email, name, paymentStatus, paymentIntentId, createdAt 
FROM "CustomerInquiry" 
WHERE paymentStatus = 'PENDING' 
ORDER BY createdAt DESC 
LIMIT 10;
```

#### Step 4: Test Payment Confirmation Endpoint Directly

```bash
# Test the confirm-payment endpoint
curl -X POST http://localhost:3000/api/payments/confirm-payment \
  -H "Content-Type: application/json" \
  -d '{
    "paymentIntentId": "pi_test_xxx",
    "inquiryId": "your-inquiry-id"
  }'
```

#### Step 5: Check Resend Dashboard

1. Go to https://resend.com/emails
2. Look for payment confirmation emails
3. Check status: "Delivered" or "Failed"
4. If failed, check error message

---

## 🔧 Temporary Workaround

While debugging, you can manually trigger email sending:

### Option A: Update Webhook to Log More Info

Add this to `/api/payments/webhook/route.ts`:

```typescript
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('✅ Payment succeeded webhook:', paymentIntent.id);
    console.log('💾 Looking for inquiry with payment intent:', paymentIntent.id);

    const inquiry = await prisma.customerInquiry.findFirst({
      where: { paymentIntentId: paymentIntent.id },
    });

    if (!inquiry) {
      console.warn('⚠️ No inquiry found for payment intent:', paymentIntent.id);
      // ADD THIS: Log all recent inquiries
      const recentInquiries = await prisma.customerInquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, paymentIntentId: true, paymentStatus: true }
      });
      console.log('📋 Recent inquiries:', JSON.stringify(recentInquiries, null, 2));
      return;
    }

    console.log('📧 Inquiry found, sending emails to:', inquiry.email);
    // ... rest of email sending code
  } catch (error) {
    console.error('❌ Error handling payment succeeded webhook:', error);
  }
}
```

### Option B: Check Payment Intent Matching

The issue might be that the `paymentIntentId` in the database doesn't match the webhook `paymentIntent.id`.

Check how `paymentIntentId` is saved when creating the customer inquiry:

```typescript
// In /api/contact or wherever inquiry is created
const inquiry = await prisma.customerInquiry.create({
  data: {
    // ...
    paymentIntentId: paymentIntent.id, // ← Make sure this is set
    // ...
  },
});
```

---

## 📋 Action Items

### Immediate Actions:

1. **Check server logs during payment**
   - Start: `npm run dev` (if not running)
   - Make test payment
   - Watch console for email-related logs

2. **Verify Stripe webhook**
   - Go to Stripe Dashboard
   - Check webhook delivery logs
   - Verify events are being received

3. **Check Resend dashboard**
   - See if emails are being sent
   - Check for failures

### If Emails Still Not Sending:

1. **Add detailed logging**:
   ```typescript
   console.log('🔍 DEBUG: Inquiry data:', {
     id: inquiry.id,
     email: inquiry.email,
     name: inquiry.name,
     paymentStatus: inquiry.paymentStatus,
     hasConfigData: !!inquiry.configurationData,
   });
   ```

2. **Test email service directly**:
   ```typescript
   // In a test route or console
   await EmailService.sendPaymentConfirmation({
     inquiryId: 'test-id',
     name: 'Test User',
     email: 'your-email@gmail.com',
     paymentAmount: 50000,
     paymentCurrency: 'eur',
     paymentMethod: 'card',
     configurationData: { /* test data */ },
   });
   ```

3. **Check environment variables**:
   ```bash
   # In Node.js console or via debug endpoint
   console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
   console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
   ```

---

## 🎯 Summary

### ✅ What's Working
- Appointment/contact confirmation emails
- Email template design (updated)
- Google Workspace domain alias
- Resend domain verification

### ❓ What Needs Investigation
- Payment confirmation emails not sending
- Need to check:
  - Server logs
  - Stripe webhook delivery
  - Database inquiry records
  - Resend dashboard

### 📚 Documentation Created
- `GOOGLE_WORKSPACE_OUTBOUND_EMAILS_GUIDE.md` - How to view sent emails
- `EMAIL_RESEND_TROUBLESHOOTING.md` - General email troubleshooting
- `EMAIL_ISSUE_RESOLUTION_NOV15.md` - Domain configuration fix

---

**Next Steps**: Follow the debugging steps above to identify why payment emails aren't sending. The code looks correct, so it's likely a configuration or data flow issue.

**Status**: Payment email template is ready and beautiful. Need to debug why the webhook/confirmation isn't triggering email sending.

**Last Updated**: November 15, 2025

