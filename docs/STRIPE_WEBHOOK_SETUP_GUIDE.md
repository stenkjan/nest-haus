# 🔧 Stripe Webhook Setup Guide

**Date:** October 23, 2025  
**Status:** Ready to configure

---

## ✅ **Test Results: All Passing!**

Before configuring the webhook, we ran all admin tests:

- ✅ **13 tests** for Popular Configurations - PASSED
- ✅ **17 tests** for Customer Inquiries - PASSED
- ✅ **Total: 30/30 tests passing** 🎉

---

## 📋 **Stripe Webhook Configuration Steps**

### **Step 1: Select Events in Stripe Dashboard**

You're currently on the event selection screen. Here's exactly what to do:

#### **Click "Ausgewählte Ereignisse" (Selected Events)**

Do NOT select "Alle Ereignisse" - we only need 5 specific events.

#### **Find and Select These 5 Events:**

1. **Payment Intent** (scroll to find it)
   - Expand "Payment Intent (8 Ereignisse)"
   - Select these 4 events:
     - ✅ `payment_intent.succeeded`
     - ✅ `payment_intent.payment_failed`
     - ✅ `payment_intent.canceled`
     - ✅ `payment_intent.processing`

2. **Charge** (scroll up to find it)
   - Expand "Charge (13 Ereignisse)"
   - Select this 1 event:
     - ✅ `charge.refunded`

**Total: 5 events selected**

---

### **Step 2: Configure Endpoint URL**

After selecting events, you'll need to provide the endpoint URL:

#### **For Production:**

```
https://nest-haus.at/api/webhooks/stripe
```

#### **For Local Testing (optional):**

If you want to test locally, you'll need ngrok:

```bash
# Install ngrok (if not installed)
# Then run:
ngrok http 3000

# Use the https URL it provides:
https://your-ngrok-url.ngrok.io/api/webhooks/stripe
```

---

### **Step 3: Copy the Signing Secret**

After creating the webhook, Stripe will show you a **"Signing secret"** that looks like:

```
whsec_xxxxxxxxxxxxxxxxxxxxx
```

**IMPORTANT:** Copy this secret!

---

### **Step 4: Update Environment Variables**

Replace the placeholder in your `.env.local` file:

**Current (line 38):**

```bash
STRIPE_WEBHOOK_SECRET=whsec_test_placeholder
```

**Update to:**

```bash
STRIPE_WEBHOOK_SECRET=whsec_[paste_your_actual_secret_here]
```

---

### **Step 5: Restart Development Server**

After updating `.env.local`:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🧪 **Testing the Webhook**

### **Option 1: Use Stripe CLI (Recommended for Local Testing)**

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Listen to webhooks and forward to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# In another terminal, trigger test events:
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
stripe trigger charge.refunded
```

### **Option 2: Test with Real Payment**

1. Go to your checkout page
2. Use Stripe test card: `4242 4242 4242 4242`
3. Complete payment
4. Check your admin dashboard - payment status should auto-update!

### **Option 3: Manual Test in Stripe Dashboard**

1. Go to Stripe Dashboard → Webhooks
2. Click on your webhook
3. Click "Send test webhook"
4. Select `payment_intent.succeeded`
5. Click "Send test webhook"
6. Check your server logs for confirmation

---

## 🔍 **Verify It's Working**

### **Check Server Logs:**

You should see:

```bash
[Stripe Webhook] Received event: payment_intent.succeeded (evt_xxx)
[Stripe Webhook] Payment succeeded: pi_xxx
[Stripe Webhook] Updated 1 inquiries for payment pi_xxx
[Stripe Webhook] Marked session session_xxx as COMPLETED
```

### **Check Database:**

```sql
-- Should see payment status updated
SELECT email, paymentStatus, paymentIntentId, paidAt
FROM "CustomerInquiry"
WHERE paymentStatus = 'PAID'
ORDER BY paidAt DESC
LIMIT 5;
```

### **Check Admin Dashboard:**

1. Go to `/admin/customer-inquiries`
2. Look for your test payment
3. Status should show "CONVERTED"
4. Payment status should show "PAID"

---

## ⚠️ **Troubleshooting**

### **Issue: Webhook not receiving events**

**Check:**

1. Is the webhook URL correct?
2. Is the server running?
3. Is the webhook secret correct in `.env.local`?
4. Did you restart the server after updating env vars?

**Solution:**

```bash
# Check if server is running
netstat -an | findstr :3000

# Restart server
# Ctrl+C then npm run dev
```

### **Issue: "Webhook signature verification failed"**

**This means:** The webhook secret is incorrect

**Solution:**

1. Go to Stripe Dashboard → Webhooks
2. Click on your webhook
3. Click "Reveal" next to Signing secret
4. Copy the FULL secret (starts with `whsec_`)
5. Update `.env.local` with the correct secret
6. Restart server

### **Issue: Events not updating database**

**Check logs for:**

```bash
[Stripe Webhook] Updated 0 inquiries for payment pi_xxx
```

**This means:** No inquiry found with that paymentIntentId

**Solution:**

1. Make sure inquiry was created with paymentIntentId
2. Check `/api/orders/route.ts` is being called
3. Check deduplication logic isn't preventing creation

---

## 📊 **What Each Event Does**

| Stripe Event                    | Database Update                                                    | Effect                |
| ------------------------------- | ------------------------------------------------------------------ | --------------------- |
| `payment_intent.succeeded`      | `paymentStatus = PAID`<br>`status = CONVERTED`<br>`paidAt = now()` | ✅ Payment successful |
| `payment_intent.payment_failed` | `paymentStatus = FAILED`                                           | ❌ Payment failed     |
| `payment_intent.canceled`       | `paymentStatus = CANCELLED`                                        | 🚫 User canceled      |
| `payment_intent.processing`     | `paymentStatus = PROCESSING`                                       | ⏳ Processing         |
| `charge.refunded`               | `paymentStatus = REFUNDED`                                         | 💰 Refund issued      |

---

## 🎯 **Success Checklist**

- [ ] Selected 5 events in Stripe Dashboard
- [ ] Configured endpoint URL
- [ ] Copied signing secret
- [ ] Updated `.env.local` with secret
- [ ] Restarted development server
- [ ] Tested webhook (CLI or real payment)
- [ ] Verified logs show webhook received
- [ ] Verified database updated correctly
- [ ] Checked admin dashboard shows correct status

---

## 🚀 **After Setup**

Once the webhook is working:

1. **Monitor webhook delivery** in Stripe Dashboard
2. **Check webhook logs** regularly for errors
3. **Test with all card scenarios:**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Authentication: `4000 0025 0000 3155`

---

## 📝 **Environment Variables Reference**

Your current Stripe configuration:

```bash
# Public key (for frontend)
STRIPE_PUBLISHABLE_KEY=pk_test_51SKc2hJKOS0b7etBYG3880UfR0w3yppjq5Y8Qq2kpQCV4320z3xewLAlO6Vx0h81aak4xCxHg1eJf1ABwWVdy8Rn00r853qAEv

# Secret key (for backend)
STRIPE_SECRET_KEY=sk_test_51SKc2hJKOS0b7etBkv9Q1Te2XMiRC6vV2f2o3bvVRLg1oszJuZYUMIIqgBkiZIeYQQOTSOwcyuVkPFhOmr66vjND00EQqwzYNW

# Webhook secret (NEEDS UPDATE)
STRIPE_WEBHOOK_SECRET=whsec_test_placeholder  ← Replace with actual secret
```

---

## 🎉 **You're Almost Done!**

Just follow the steps above, and your webhook will be fully integrated!

**Questions?** Check the troubleshooting section or test with Stripe CLI first.
