# 🔧 Stripe Webhook Fix - Action Required

**Date:** December 21, 2025  
**Status:** ⚠️ **ACTION REQUIRED IN STRIPE DASHBOARD**

---

## ✅ What We've Done

1. ✅ Updated `vercel.json` with webhook rewrite rules
2. ✅ Configured system to work with all domain variants:
   - `nest-haus.at`
   - `www.nest-haus.at`
   - `da-hoam.at`
   - `www.da-hoam.at`
3. ✅ Updated documentation

---

## 🎯 What You Need To Do Now

### Step 1: Update Stripe Webhook URL

The error shows Stripe is trying to deliver to `https://nest-haus.at/api/webhooks/stripe`, but your webhook might be configured for a different URL.

**Action Required:**

1. Go to [Stripe Dashboard - Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Find your webhook endpoint (should be named "nest-payment")
3. Click on it to view details
4. Check the current endpoint URL
5. **If it's NOT `https://nest-haus.at/api/webhooks/stripe`:**
   - Click "..." (three dots) → "Update details"
   - Change the endpoint URL to: `https://nest-haus.at/api/webhooks/stripe`
   - Click "Update endpoint"

**Why this matters:** Stripe needs to use the exact domain that matches your Vercel configuration. The error shows it's trying `nest-haus.at` (without www), so we should configure Stripe to use that URL consistently.

### Step 2: Verify Events Are Selected

While you're in the webhook settings, confirm these 6 events are selected:

- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`
- ✅ `payment_intent.canceled`
- ✅ `payment_intent.processing`
- ✅ `charge.refunded`
- ✅ `refund.created`

If any are missing:
1. Click "Add events"
2. Select the missing events
3. Click "Add events" to save

### Step 3: Test Webhook Delivery

After updating the URL, test that it works:

**Option A: Send Test Webhook (Easiest)**

1. In Stripe Dashboard, on your webhook page
2. Click "Send test webhook"
3. Select event: `payment_intent.succeeded`
4. Click "Send test webhook"
5. Check the response - should show "200 OK" ✅

**Option B: Use Stripe CLI (More Thorough)**

```bash
# In PowerShell or Git Bash
stripe login
stripe trigger payment_intent.succeeded
```

**Option C: Real Test Payment**

1. Go to your checkout page: `https://nest-haus.at/warenkorb`
2. Complete a test order
3. Use test card: `4242 4242 4242 4242`
4. Complete payment
5. Check admin dashboard - payment status should update to "PAID"

### Step 4: Verify Success

Check these locations to confirm it's working:

**✅ Stripe Dashboard:**
- Go to Developers > Webhooks > [Your Endpoint]
- Look at "Recent events" section
- Should show successful deliveries (green checkmarks)
- No "Failed" messages

**✅ Your Application:**
- If you made a test payment, check Admin Dashboard
- Payment status should show "PAID"
- Customer should receive confirmation email

---

## 🔍 Troubleshooting

### If webhook still fails after updating URL:

**1. Check Domain in Vercel**

Go to your Vercel project settings:
1. Navigate to Settings > Domains
2. Verify all 4 domains are listed:
   - `nest-haus.at` ✅
   - `www.nest-haus.at` ✅
   - `da-hoam.at` ✅
   - `www.da-hoam.at` ✅
3. Check that all have SSL certificates (should show "Valid" in green)

**2. Test Endpoint Directly**

Try accessing the webhook endpoint in your browser:
- Go to: `https://nest-haus.at/api/webhooks/stripe`
- You should get a response (might be error, but NOT a 404)
- If you get 404, the route isn't working

**3. Check Vercel Deployment**

Ensure the latest code (with updated `vercel.json`) is deployed:
1. Go to Vercel Dashboard > Your Project
2. Check latest deployment includes the `vercel.json` changes
3. If not, push changes to GitHub to trigger new deployment

**4. Verify Environment Variable**

Ensure `STRIPE_WEBHOOK_SECRET` is set correctly in Vercel:
1. Go to Vercel Project > Settings > Environment Variables
2. Find `STRIPE_WEBHOOK_SECRET`
3. Should be: `whsec_7q82UaLdklfg8i4Y7ymEU5HQNQHzbvvX` (from your docs)
4. If missing or wrong, update it and redeploy

---

## 📋 Quick Reference: Domain Selection Guide

| Domain | When to Use | Notes |
|--------|-------------|-------|
| `https://nest-haus.at/api/webhooks/stripe` | **Recommended** - Current primary | Matches Stripe error message, clean URL |
| `https://www.nest-haus.at/api/webhooks/stripe` | If you prefer www | Works equally well |
| `https://da-hoam.at/api/webhooks/stripe` | Future migration | Prepare for rebranding |
| `https://www.da-hoam.at/api/webhooks/stripe` | Future www variant | Alternative for rebranding |

**Our recommendation:** Use `https://nest-haus.at/api/webhooks/stripe` (matches what Stripe is currently trying)

---

## 🚀 Migration to da-hoam.at (Future)

When you're ready to rebrand to da-hoam.at:

**Zero-Downtime Approach:**
1. Keep current webhook: `https://nest-haus.at/api/webhooks/stripe`
2. Add new webhook: `https://da-hoam.at/api/webhooks/stripe`
3. Use same webhook secret for both (or different if preferred)
4. Test da-hoam.at webhook works
5. Delete nest-haus.at webhook after migration complete

**Quick Switch Approach:**
1. Edit existing webhook in Stripe Dashboard
2. Change URL to: `https://da-hoam.at/api/webhooks/stripe`
3. Save (that's it - no code changes needed!)

---

## ✅ Success Checklist

- [ ] Updated webhook URL in Stripe Dashboard
- [ ] Verified 6 events are selected
- [ ] Sent test webhook from Stripe Dashboard
- [ ] Confirmed "200 OK" response in Stripe
- [ ] (Optional) Tested with real payment
- [ ] Verified payment status updates in Admin Dashboard

Once all checked, your webhook is working correctly! 🎉

---

**Questions?** Check the troubleshooting section or refer to:
- `docs/WEBHOOK_VERIFICATION_GUIDE.md` - Complete webhook testing guide
- `docs/STRIPE_PRODUCTION_SETUP.md` - Production deployment guide

