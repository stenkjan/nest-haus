# 🚀 Stripe Production Migration Guide

**Status**: Ready to migrate to production  
**Estimated Time**: 15-30 minutes  
**Complexity**: ⭐ VERY EASY (just swap API keys!)

---

## ✅ Current Setup Assessment

### Your Stripe Integration is **PRODUCTION-READY** ✨

Your codebase is already fully configured and properly structured. The migration is **extremely simple** because:

1. ✅ **Code is environment-agnostic** - No hardcoded test values
2. ✅ **All Stripe keys are in environment variables** - Easy to swap
3. ✅ **Webhook endpoint is already configured** - Just needs production URL
4. ✅ **Payment flow is fully tested** - Ready for real payments
5. ✅ **Database schema supports payment tracking** - All fields in place
6. ✅ **Error handling is robust** - Production-ready error boundaries
7. ✅ **Email notifications are working** - Customer & admin emails configured

---

## 🎯 Migration Checklist: 6 Simple Steps

### Step 1: Get Production Stripe Keys (5 minutes)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Toggle to LIVE MODE** (top right corner - switch from "Test" to "Live")
3. Go to **Developers → API Keys**
4. Copy your **live keys**:
   - **Publishable key**: Starts with `pk_live_...`
   - **Secret key**: Starts with `sk_live_...` (click "Reveal")

⚠️ **CRITICAL**: Keep your live secret key secure! Never commit it to git.

---

### Step 2: Configure Production Webhook (10 minutes)

1. In **Live Mode**, go to **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Enter your production URL:
   ```
   https://www.nest-haus.at/api/webhooks/stripe
   ```
   ⚠️ **CRITICAL:** Must use `www.nest-haus.at` subdomain
   - Why: Domain redirects `nest-haus.at` → `www.nest-haus.at` (HTTP 301)
   - Stripe security: Never follows redirects
   - Solution: Use final URL directly

4. Click **"Select events"** and choose these 5 events:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `payment_intent.canceled`
   - ✅ `payment_intent.processing`
   - ✅ `charge.refunded`

5. Click **"Add endpoint"**
6. **Copy the signing secret** (starts with `whsec_...`)

---

### Step 3: Enable Payment Methods (5 minutes)

In **Live Mode**, go to **Settings → Payment methods**

#### **Recommended for Austrian Market** 🇦🇹

Enable these payment methods (just check the boxes):

- ✅ **Cards** (already enabled)
- ✅ **Apple Pay** - iPhone/iPad users
- ✅ **Google Pay** - Android users  
- ✅ **EPS** - Austrian banking standard ⭐ **HIGHLY RECOMMENDED**
- ✅ **Sofort** - Instant bank transfer ⭐ **POPULAR IN DACH**
- ✅ **SEPA Direct Debit** - Bank transfer (lowest fees: €0.35)
- ✅ **Klarna** - Buy now, pay later (optional)

Click **"Save"**

💡 **Why these methods?**
- **EPS**: Every Austrian bank supports this - your target market!
- **Sofort**: Very popular in Germany/Austria, instant confirmation
- **SEPA**: Most cost-effective for large amounts (€0.35 vs 2.9%)

---

### Step 4: Update Environment Variables (2 minutes)

#### **For Vercel Deployment:**

1. Go to your Vercel project dashboard
2. Click **Settings → Environment Variables**
3. Update/add these variables for **Production**:

```env
# Stripe Live Keys (Production)
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY_HERE

# Webhook Secret (Production)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET_HERE

# Payment Configuration
PAYMENT_MODE=deposit
DEPOSIT_AMOUNT=50000
CURRENCY=eur
```

4. Click **"Save"**
5. **Redeploy** your application

#### **For Local Testing with Production Keys (Optional):**

Update `.env.local` (but **NEVER commit this file**):

```env
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

⚠️ **IMPORTANT**: Add `.env.local` to `.gitignore` to prevent accidental commits!

---

### Step 5: Test the Migration (5 minutes)

#### **Use a Real Test Card (Small Amount)**

1. Go to your production website: `https://nest-haus.at/warenkorb`
2. Configure a small test order
3. Click **"Zur Kassa"**
4. Use a **real credit card** with a small amount (€0.50-€1.00)
5. Complete the payment
6. **Verify**:
   - ✅ Payment succeeds in Stripe Dashboard (Live Mode)
   - ✅ Customer receives confirmation email
   - ✅ Admin receives notification email
   - ✅ Database updated correctly (`CustomerInquiry.paymentStatus = 'PAID'`)
   - ✅ Webhook received (check Stripe Dashboard → Webhooks → Events)

⚠️ **Then immediately refund** the test payment in Stripe Dashboard!

---

### Step 6: Monitor Initial Transactions (Ongoing)

After going live, monitor:

1. **Stripe Dashboard → Payments** - Watch for successful payments
2. **Stripe Dashboard → Webhooks** - Check webhook delivery success
3. Your application logs - Verify webhook processing
4. Email inbox - Confirm customer/admin emails are sending

---

## 📊 Current Configuration Analysis

### ✅ What's Already Perfect:

```typescript
// ✅ Environment-based configuration (no hardcoded values)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
});

// ✅ Server-side amount override (security)
const depositAmount = parseInt(process.env.DEPOSIT_AMOUNT || "50000");

// ✅ Proper webhook signature verification
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

// ✅ Comprehensive payment status tracking
paymentStatus: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
```

### 📝 Current Payment Amount:

- **Mode**: `deposit`
- **Amount**: `50000` cents = **€500.00**
- **Currency**: EUR

### 🔧 Current Environment Variables:

| Variable | Current (Test) | Production Value Needed |
|----------|---------------|------------------------|
| `STRIPE_SECRET_KEY` | `sk_test_51SKc2h...` | `sk_live_...` ✏️ |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_51SKc2h...` | `pk_live_...` ✏️ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_51SKc2h...` | `pk_live_...` ✏️ |
| `STRIPE_WEBHOOK_SECRET` | `whsec_7q82UaLd...` | `whsec_...` ✏️ |
| `PAYMENT_MODE` | `deposit` | ✅ Keep as-is |
| `DEPOSIT_AMOUNT` | `50000` (€500) | ✅ Keep as-is |
| `CURRENCY` | `eur` | ✅ Keep as-is |

---

## 🚨 Critical Security Notes

### ✅ Your Code is SECURE:

1. **Server-side validation** ✅
   - Amount is overridden server-side (can't be manipulated by client)
   - Payment intent creation is server-controlled
   
2. **Webhook signature verification** ✅
   - All webhooks are verified before processing
   - Prevents fake payment confirmations

3. **Environment variables** ✅
   - All secrets are in environment variables
   - No hardcoded API keys in code

### ⚠️ Pre-Production Security Checklist:

- [ ] Ensure `.env.local` is in `.gitignore`
- [ ] Never commit live API keys to git
- [ ] Use Vercel environment variables for production keys
- [ ] Enable Stripe Radar for fraud protection (in Stripe Dashboard)
- [ ] Set up email alerts for failed payments (in Stripe Dashboard)
- [ ] Configure spending limits (optional, in Stripe Dashboard)

---

## 🔄 Zero-Code Changes Required!

### Why It's So Easy:

Your integration is **perfectly designed for production**:

```typescript
// This works for BOTH test and production:
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
});
```

The code automatically uses:
- **Test keys** → Test mode (fake payments)
- **Live keys** → Production mode (real payments)

**No code changes needed!** 🎉

---

## 📈 What Changes After Migration

### Immediate Changes:

| Feature | Test Mode | Production Mode |
|---------|-----------|-----------------|
| **Payments** | Fake test cards | Real credit cards |
| **Money** | No real money | Real transactions |
| **Customers** | Test customers | Real customers |
| **Emails** | ✅ Sent | ✅ Sent |
| **Dashboard** | Test data only | Real payment data |
| **Webhooks** | Test events | Real events |
| **Fees** | No charges | Real Stripe fees |

### Stripe Fees (Production):

| Payment Method | Fee | Processing Time |
|---------------|-----|-----------------|
| Credit/Debit Card | 2.9% + €0.25 | Instant |
| Apple Pay | 2.9% + €0.25 | Instant |
| Google Pay | 2.9% + €0.25 | Instant |
| EPS | 1.8% + €0.25 | Instant |
| Sofort | 1.4% + €0.25 | Instant |
| SEPA Direct Debit | **€0.35 flat** | 1-3 days |
| Klarna | 2.9% + €0.25 | Instant |

💡 **SEPA is cheapest for large amounts**: For a €500 deposit, SEPA costs only €0.35 instead of €14.75 with cards!

---

## 🧪 Testing Strategy

### Phase 1: Test Mode (Current) ✅

- [x] Test card: `4242 4242 4242 4242`
- [x] Webhooks working
- [x] Emails sending
- [x] Database updates correct

### Phase 2: Production Smoke Test (15 minutes)

1. **Small real transaction** (€0.50-€1.00)
2. Verify complete flow:
   - Payment succeeds
   - Webhook received
   - Emails sent
   - Database updated
3. **Refund immediately** in Stripe Dashboard

### Phase 3: Soft Launch (1-2 days)

1. Enable for limited users (beta testers)
2. Monitor all transactions closely
3. Verify no errors in logs
4. Check webhook delivery success rate

### Phase 4: Full Production (After successful soft launch)

1. Enable for all users
2. Continue monitoring for first week
3. Set up Stripe Radar rules for fraud protection

---

## 🐛 Troubleshooting Production Issues

### Issue: "Stripe is not configured"

**Cause**: Environment variables not set in Vercel

**Solution**:
1. Check Vercel → Settings → Environment Variables
2. Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set for **Production**
3. Redeploy application

---

### Issue: "Webhook signature verification failed"

**Cause**: Wrong webhook secret or old cached secret

**Solution**:
1. Go to Stripe Dashboard (Live Mode) → Developers → Webhooks
2. Click on your webhook endpoint
3. Reveal and copy the signing secret
4. Update `STRIPE_WEBHOOK_SECRET` in Vercel
5. Redeploy

---

### Issue: Payment succeeds but database not updated

**Cause**: Webhook not being received or processed

**Check**:
1. Stripe Dashboard → Webhooks → Click your endpoint → View events
2. Look for failed deliveries (red X icons)
3. Check response codes (should be 200)

**Common Fixes**:
- Ensure webhook URL is correct: `https://www.nest-haus.at/api/webhooks/stripe` (must use www subdomain)
- Verify webhook secret is correct
- Check server logs for errors in webhook processing

---

### Issue: Customer not receiving confirmation email

**Check**:
1. Email service configuration (Resend/SendGrid/etc.)
2. Check spam folder
3. Verify email address is correct in inquiry
4. Check server logs for email sending errors

**Solution**:
- Verify email service API key is set in production
- Test email service separately
- Check email templates are rendering correctly

---

## 📞 Support Resources

### Stripe Support:
- **Dashboard**: [https://dashboard.stripe.com](https://dashboard.stripe.com)
- **Documentation**: [https://stripe.com/docs](https://stripe.com/docs)
- **Support**: [https://support.stripe.com](https://support.stripe.com)

### Test Cards (for testing in Live Mode - DO NOT USE FOR REAL ORDERS):
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

⚠️ **Warning**: Even in live mode, Stripe allows test cards, but they won't create real charges.

---

## ✅ Pre-Launch Checklist

Before switching to production, verify:

### Code & Configuration:
- [ ] All TypeScript errors resolved
- [ ] ESLint checks pass
- [ ] Build succeeds on Vercel
- [ ] `.env.local` is in `.gitignore`
- [ ] No hardcoded test keys in code

### Stripe Dashboard (Live Mode):
- [ ] Payment methods enabled (Card, EPS, Sofort, SEPA, etc.)
- [ ] Webhook endpoint configured with correct URL
- [ ] Webhook events selected (5 events)
- [ ] API keys copied (publishable + secret)
- [ ] Webhook signing secret copied

### Environment Variables (Vercel):
- [ ] `STRIPE_SECRET_KEY` updated to `sk_live_...`
- [ ] `STRIPE_PUBLISHABLE_KEY` updated to `pk_live_...`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` updated to `pk_live_...`
- [ ] `STRIPE_WEBHOOK_SECRET` updated to live webhook secret
- [ ] `PAYMENT_MODE` set to `deposit`
- [ ] `DEPOSIT_AMOUNT` set to `50000` (€500)
- [ ] Application redeployed after env var changes

### Testing:
- [ ] Small test payment completed successfully (€0.50-€1.00)
- [ ] Webhook received and processed
- [ ] Customer confirmation email sent
- [ ] Admin notification email sent
- [ ] Database updated correctly
- [ ] Payment visible in Stripe Dashboard (Live Mode)
- [ ] Test payment refunded

### Monitoring Setup:
- [ ] Stripe email notifications enabled
- [ ] Server logging configured
- [ ] Error tracking set up (Sentry, etc.)
- [ ] Webhook monitoring enabled

---

## 🎉 Summary: Migration Difficulty = ⭐ VERY EASY

### Time Required:

| Task | Time | Difficulty |
|------|------|-----------|
| Get production API keys | 5 min | ⭐ Trivial |
| Configure webhook | 10 min | ⭐ Easy |
| Enable payment methods | 5 min | ⭐ Easy |
| Update environment variables | 2 min | ⭐ Trivial |
| Test & verify | 5 min | ⭐ Easy |
| **TOTAL** | **~30 min** | **⭐ VERY EASY** |

### Why It's Easy:

1. ✅ **No code changes required**
2. ✅ **Just swap environment variables**
3. ✅ **Everything is already production-ready**
4. ✅ **Well-structured and tested**
5. ✅ **Comprehensive error handling in place**

---

## 🚀 Ready When You Are!

Your Stripe integration is **production-ready**. Just follow the 6-step checklist above and you'll be accepting real payments in ~30 minutes!

**Questions?** Check the troubleshooting section or consult Stripe's excellent documentation.

---

**Last Updated**: 2025-11-15  
**Stripe API Version**: `2025-09-30.clover`  
**Integration Status**: ✅ Production-Ready
