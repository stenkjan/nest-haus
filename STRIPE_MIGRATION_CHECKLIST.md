# ✅ Stripe Production Migration - Action Checklist

**Print this and check off each item as you complete it!**

---

## 📋 Pre-Migration Preparation (5 minutes)

- [ ] Open Stripe Dashboard: https://dashboard.stripe.com
- [ ] Open Vercel Dashboard: https://vercel.com
- [ ] Have a notepad ready for copying keys
- [ ] Read the security warnings below

⚠️ **SECURITY WARNING**: Live keys charge real money! Handle with care.

---

## 🔑 Step 1: Get Live API Keys (5 minutes)

### In Stripe Dashboard:

- [ ] Click the **"Test Mode"** toggle in top-right corner
- [ ] Confirm you're now in **"Live Mode"** (toggle should say "Live")
- [ ] In left sidebar, click **"Developers"**
- [ ] Click **"API keys"**
- [ ] Copy **Publishable key** (starts with `pk_live_`)
  - [ ] Paste somewhere safe: `pk_live_________________________`
- [ ] Click **"Reveal test key"** next to Secret key
- [ ] Copy **Secret key** (starts with `sk_live_`)
  - [ ] Paste somewhere safe: `sk_live_________________________`

✅ **Checkpoint**: You should have TWO keys copied: `pk_live_...` and `sk_live_...`

---

## 🔔 Step 2: Configure Production Webhook (10 minutes)

### Create Webhook Endpoint:

- [ ] In Stripe Dashboard (Live Mode), go to **Developers → Webhooks**
- [ ] Click **"Add endpoint"** button
- [ ] Enter endpoint URL: `https://www.nest-haus.at/api/webhooks/stripe` ⚠️ **Must use www subdomain**
- [ ] Enter description: "Production payment webhooks for NEST-Haus configurator"

### Select Events:

- [ ] Click **"Select events"**
- [ ] Scroll to find **"payment_intent"** section
- [ ] Check these 4 events:
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
  - [ ] `payment_intent.canceled`
  - [ ] `payment_intent.processing`
- [ ] Scroll to find **"charge"** section
- [ ] Check this 1 event:
  - [ ] `charge.refunded`
- [ ] Click **"Add events"** at bottom

### Get Webhook Secret:

- [ ] Click **"Add endpoint"** to save
- [ ] On the webhook details page, find **"Signing secret"**
- [ ] Click **"Reveal"** next to the signing secret
- [ ] Copy the secret (starts with `whsec_`)
  - [ ] Paste somewhere safe: `whsec_________________________`

✅ **Checkpoint**: You should have webhook secret copied: `whsec_...`

---

## 💳 Step 3: Enable Payment Methods (5 minutes)

### In Stripe Dashboard (Live Mode):

- [ ] In left sidebar, click **"Settings"** (gear icon)
- [ ] Click **"Payment methods"**
- [ ] Verify **"Cards"** is checked ✅ (should be by default)

### Enable Austrian/German Payment Methods:

- [ ] Find and check **"EPS"** ✅ (Austrian banks)
- [ ] Find and check **"Sofort"** ✅ (instant transfer)
- [ ] Find and check **"SEPA Direct Debit"** ✅ (bank transfer, lowest fees)

### Enable Digital Wallets (Recommended):

- [ ] Find and check **"Apple Pay"** ✅ (iPhone/iPad users)
- [ ] Find and check **"Google Pay"** ✅ (Android users)

### Optional (Buy Now Pay Later):

- [ ] Find and check **"Klarna"** ✅ (optional)

### Save Changes:

- [ ] Scroll to bottom and click **"Save"**
- [ ] Wait for confirmation message

✅ **Checkpoint**: At minimum, Cards + EPS + Sofort + SEPA should be enabled

---

## 🌐 Step 4: Update Vercel Environment Variables (5 minutes)

### In Vercel Dashboard:

- [ ] Go to your project: **nest-haus.at**
- [ ] Click **"Settings"** tab
- [ ] Click **"Environment Variables"** in left sidebar

### Update These Variables for Production:

#### Update `STRIPE_SECRET_KEY`:
- [ ] Find `STRIPE_SECRET_KEY` in the list
- [ ] Click **"Edit"** (or delete and recreate)
- [ ] Select **"Production"** environment only
- [ ] Paste your live secret key: `sk_live_...`
- [ ] Click **"Save"**

#### Update `STRIPE_PUBLISHABLE_KEY`:
- [ ] Find `STRIPE_PUBLISHABLE_KEY` in the list
- [ ] Click **"Edit"** (or delete and recreate)
- [ ] Select **"Production"** environment only
- [ ] Paste your live publishable key: `pk_live_...`
- [ ] Click **"Save"**

#### Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`:
- [ ] Find `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in the list
- [ ] Click **"Edit"** (or delete and recreate)
- [ ] Select **"Production"** environment only
- [ ] Paste your live publishable key: `pk_live_...` (same as above)
- [ ] Click **"Save"**

#### Update `STRIPE_WEBHOOK_SECRET`:
- [ ] Find `STRIPE_WEBHOOK_SECRET` in the list
- [ ] Click **"Edit"** (or delete and recreate)
- [ ] Select **"Production"** environment only
- [ ] Paste your webhook secret: `whsec_...`
- [ ] Click **"Save"**

### Verify Other Settings (Should Already Be Correct):

- [ ] `PAYMENT_MODE` = `deposit` ✅
- [ ] `DEPOSIT_AMOUNT` = `50000` ✅
- [ ] `CURRENCY` = `eur` ✅

### Redeploy:

- [ ] Go to **"Deployments"** tab
- [ ] Click the **"..."** menu on the latest deployment
- [ ] Click **"Redeploy"**
- [ ] Wait for deployment to complete (green checkmark)

✅ **Checkpoint**: All 4 Stripe environment variables updated for Production

---

## 🧪 Step 5: Test with Small Real Payment (10 minutes)

### Make Test Purchase:

- [ ] Go to **https://nest-haus.at**
- [ ] Configure a simple test configuration
- [ ] Proceed to checkout (Warenkorb)
- [ ] Click **"Zur Kassa"** button

### Complete Payment:

- [ ] Payment modal should open
- [ ] You should see multiple payment methods (Cards, EPS, Sofort, etc.)
- [ ] Select **"Card"** (or another method you want to test)
- [ ] Enter **real credit card** details
  - [ ] Use a card with LOW limit or prepaid card
  - [ ] Or contact your bank to set temporary spending limit
- [ ] Enter amount: **€0.50** or **€1.00** (for testing)
  - ⚠️ **Note**: Server might override to €500 - check payment amount before confirming!
- [ ] Complete payment

### Verify Payment Success:

- [ ] Payment success message appears on website ✅
- [ ] Check email inbox for customer confirmation email ✅
- [ ] Check admin email inbox for admin notification ✅

### Verify in Stripe Dashboard:

- [ ] Go to Stripe Dashboard (Live Mode)
- [ ] Click **"Payments"** in left sidebar
- [ ] Your test payment should appear at the top ✅
- [ ] Status should be **"Succeeded"** ✅
- [ ] Click on the payment to see details

### Verify Webhook Delivery:

- [ ] In Stripe Dashboard, go to **Developers → Webhooks**
- [ ] Click on your webhook endpoint
- [ ] Click **"Events"** tab
- [ ] You should see events for your payment ✅
- [ ] All events should have green checkmarks (HTTP 200) ✅
- [ ] If any red X marks, click to see error details

### Verify Database Update:

- [ ] Go to your database admin panel (or check via API)
- [ ] Find the `CustomerInquiry` record for this test
- [ ] Verify fields:
  - [ ] `paymentStatus` = `'PAID'` ✅
  - [ ] `paymentIntentId` matches Stripe payment ID ✅
  - [ ] `paymentAmount` is correct ✅
  - [ ] `paidAt` timestamp is set ✅

### Refund Test Payment:

- [ ] In Stripe Dashboard, go to **Payments**
- [ ] Click on your test payment
- [ ] Click **"Refund payment"** button
- [ ] Select **"Full refund"**
- [ ] Click **"Refund"**
- [ ] Confirm refund completed ✅

✅ **Checkpoint**: Test payment succeeded, webhook delivered, emails sent, refund completed

---

## 🎉 Step 6: Final Verification (5 minutes)

### Security Check:

- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Search codebase for any hardcoded `sk_test_` or `pk_test_` strings
  - [ ] None found in committed code ✅
- [ ] Verify live keys are ONLY in Vercel, not in git repo ✅

### Monitoring Setup:

- [ ] Enable email notifications in Stripe Dashboard:
  - [ ] Go to **Settings → Notifications**
  - [ ] Enable **"Payment succeeded"** notifications
  - [ ] Enable **"Payment failed"** notifications
  - [ ] Enable **"Webhook delivery failures"**

### Dashboard Check:

- [ ] Bookmark: https://dashboard.stripe.com (Live Mode)
- [ ] Bookmark: https://dashboard.stripe.com/webhooks (check this daily)
- [ ] Set calendar reminder to check Stripe Dashboard daily for first week

✅ **Checkpoint**: Monitoring and alerts configured

---

## 🚀 Go-Live Decision

### Review This Checklist:

✅ I have completed ALL steps above  
✅ Test payment succeeded  
✅ Webhooks are being delivered (green checkmarks)  
✅ Emails are sending correctly  
✅ Database is updating correctly  
✅ Test payment was refunded successfully  
✅ Live keys are secure (not in git)  
✅ I understand Stripe will charge real fees now  
✅ I'm ready to accept real payments  

### If ALL boxes are checked:

🎉 **YOU'RE LIVE!** 🎉

Your website is now accepting real payments via Stripe!

---

## 📊 Post-Launch Monitoring (First Week)

### Daily Checks:

- [ ] **Day 1**: Check Stripe Dashboard → Payments (morning & evening)
- [ ] **Day 1**: Check Stripe Dashboard → Webhooks (verify all green checkmarks)
- [ ] **Day 1**: Test one real payment yourself
- [ ] **Day 2**: Check for any failed webhooks
- [ ] **Day 2**: Verify customers receiving confirmation emails
- [ ] **Day 3**: Review payment success rate (should be >95%)
- [ ] **Day 3**: Check for any unusual patterns
- [ ] **Day 4-7**: Daily payment check in Stripe Dashboard

### Weekly Checks (After First Week):

- [ ] **Weekly**: Review payment success/failure rates
- [ ] **Weekly**: Check webhook delivery success rate (should be 100%)
- [ ] **Weekly**: Review customer feedback about payment experience
- [ ] **Weekly**: Check for any new Stripe features to enable

---

## 🐛 Troubleshooting Reference

### Problem: Webhook Signature Verification Failed

**Symptoms**: Red X marks in Stripe webhook events dashboard

**Solution**:
1. [ ] Go to Stripe Dashboard → Webhooks → Your endpoint
2. [ ] Click "Reveal" on signing secret
3. [ ] Copy the FULL secret (starts with `whsec_`)
4. [ ] Update `STRIPE_WEBHOOK_SECRET` in Vercel
5. [ ] Redeploy application
6. [ ] Test new payment to verify

---

### Problem: Customer Not Receiving Confirmation Email

**Possible Causes**:
- [ ] Email went to spam folder
- [ ] Email service API key not configured in Vercel
- [ ] Email address misspelled in form

**Solution**:
1. [ ] Check customer's spam folder first
2. [ ] Verify email service API key in Vercel environment variables
3. [ ] Check server logs for email sending errors
4. [ ] Test email service separately

---

### Problem: Payment Succeeds but Database Not Updated

**Possible Causes**:
- [ ] Webhook not being delivered
- [ ] Database connection issue
- [ ] PaymentIntentId mismatch

**Solution**:
1. [ ] Check Stripe Dashboard → Webhooks → Events
2. [ ] Look for `payment_intent.succeeded` event
3. [ ] Click event to see response from your server
4. [ ] Check server logs for errors
5. [ ] Verify `paymentIntentId` matches in Stripe and database

---

## 📞 Support Contacts

**Stripe Support**:
- Email: support@stripe.com
- Dashboard: https://dashboard.stripe.com/support
- Phone: Check Stripe Dashboard for your region's phone number

**Emergency Rollback**:
If something goes seriously wrong, you can quickly rollback:
1. Go to Vercel → Deployments
2. Find the previous deployment (before migration)
3. Click "..." menu → "Promote to Production"
4. Update Stripe environment variables back to test keys

---

## 🎯 Success Metrics

### Week 1 Targets:

- [ ] **Payment success rate**: >95%
- [ ] **Webhook delivery rate**: 100%
- [ ] **Email delivery rate**: 100%
- [ ] **Customer complaints**: 0
- [ ] **Failed payments investigated**: 100%

### Month 1 Targets:

- [ ] **Average payment time**: <2 minutes
- [ ] **Payment method distribution**: Track which methods customers prefer
- [ ] **Refund rate**: <5%
- [ ] **Fraud attempts**: 0 (Stripe Radar handles this)

---

## 📝 Notes Section

**Date Migration Completed**: _______________

**First Payment Received**: _______________

**Issues Encountered**:
- 
- 
- 

**Customer Feedback**:
- 
- 
- 

**Optimization Ideas**:
- 
- 
- 

---

## ✅ Final Confirmation

**I confirm that**:

- [x] I understand this switches to REAL payments
- [x] I understand Stripe will charge REAL fees
- [x] I have tested the payment flow thoroughly
- [x] I have monitoring and alerts set up
- [x] I am ready to provide customer support for payment issues
- [x] I have read the security warnings
- [x] I have secured my live API keys

**Signed**: _____________________  
**Date**: _____________________

---

🎉 **CONGRATULATIONS ON GOING LIVE!** 🎉

You've successfully migrated to Stripe production!

Now monitor closely for the first few days and you'll be golden. 🚀

---

**Questions?** Refer to:
- Detailed guide: `STRIPE_PRODUCTION_MIGRATION_GUIDE.md`
- Quick start: `STRIPE_MIGRATION_QUICK_START.md`
- Stripe docs: https://stripe.com/docs
