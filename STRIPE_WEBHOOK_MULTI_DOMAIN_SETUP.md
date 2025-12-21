# 🌐 Multi-Domain Stripe Webhook Setup

**Domains:** `www.nest-haus.at` and `www.da-hoam.at`  
**Setup Date:** December 21, 2025  
**Status:** Configuration Guide

---

## 🎯 Your Situation

You have **TWO domains** pointing to the same application:
1. `www.nest-haus.at` (primary)
2. `www.da-hoam.at` (secondary/alias)

Both domains serve the **same Next.js application** and **same webhook endpoint**.

---

## ✅ Recommended Solution: Single Webhook with Primary Domain

### Why This Works Best:

**Stripe webhooks are triggered by YOUR actions, not by domain:**
- Webhooks are triggered by **Stripe events** (payments, refunds, etc.)
- They're **NOT** triggered by which domain the customer used
- Stripe sends webhooks to the URL **you configure in Stripe Dashboard**
- It doesn't matter if customer paid via `nest-haus.at` or `da-hoam.at`

### ✅ Best Practice Configuration:

**Use ONE webhook endpoint with your primary domain:**

```
https://www.nest-haus.at/api/webhooks/stripe
```

**This will handle ALL payments from:**
- ✅ `www.nest-haus.at`
- ✅ `www.da-hoam.at`
- ✅ Any other domain aliases you add later

---

## 🔧 Configuration Steps

### Option 1: Single Webhook (Recommended) ⭐

**Setup:**
1. Go to Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Create/Update ONE webhook endpoint
3. Use URL: `https://www.nest-haus.at/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `payment_intent.processing`
   - `charge.refunded`
   - `refund.created`
5. Save and copy webhook secret

**Why this works:**
- ✅ **Payment Intent ID is unique across all domains**
- ✅ Webhook identifies payment by `payment_intent_id`, not by domain
- ✅ Database lookup works regardless of which domain was used
- ✅ Simpler configuration (one webhook = one secret)
- ✅ Easier monitoring (all events in one place)
- ✅ No code changes needed

**Example Flow:**
```
1. Customer pays on: www.da-hoam.at
2. Stripe creates: payment_intent_abc123
3. Payment succeeds
4. Stripe sends webhook to: www.nest-haus.at/api/webhooks/stripe
5. Your code finds payment by: payment_intent_abc123
6. Database updated, emails sent ✅
```

**The domain where customer paid doesn't matter!**

---

## 🔄 Alternative: Multiple Webhooks (Not Recommended)

### Option 2: Separate Webhooks (Unnecessary Complexity)

**Only use if you need domain-specific behavior (you don't):**

```
Webhook 1: https://www.nest-haus.at/api/webhooks/stripe
Webhook 2: https://www.da-hoam.at/api/webhooks/stripe
```

**Why this is NOT recommended:**
- ❌ More complex configuration
- ❌ TWO webhook secrets to manage
- ❌ Duplicate processing risk
- ❌ Need to update environment variables for both secrets
- ❌ Harder to monitor (events split across two webhooks)
- ❌ **Same endpoint, same code, same database** - no benefit

**When you might need this:**
- Different Stripe accounts per domain
- Different payment processing logic per domain
- Completely separate applications per domain

**Your case:** Same app, same database, same Stripe account → **Use Option 1**

---

## 🛠️ Implementation Guide

### Step 1: Verify Both Domains Work

Both domains should be reachable:

```bash
# Test nest-haus.at
curl -i https://www.nest-haus.at/api/webhooks/stripe

# Test da-hoam.at
curl -i https://www.da-hoam.at/api/webhooks/stripe

# Both should return: HTTP 400 (expected - no signature)
```

### Step 2: Configure Single Webhook in Stripe

**Live Mode:**
1. Login: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint" (or edit existing)
3. **Endpoint URL:** `https://www.nest-haus.at/api/webhooks/stripe`
4. **Description:** "Production webhooks - handles all domains"
5. **Events:** Select all payment events
6. **Save** and copy webhook secret (`whsec_...`)

**Test Mode (Optional):**
1. Switch to Test mode
2. Repeat above steps
3. Use same URL: `https://www.nest-haus.at/api/webhooks/stripe`

### Step 3: Update Environment Variables

**Vercel Dashboard:**
1. Go to: Vercel → Your Project → Settings → Environment Variables
2. Update `STRIPE_WEBHOOK_SECRET` with new secret
3. **Scope:** Production
4. **Redeploy** (if secret changed)

**Local Development:**
```bash
# .env.local
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET
```

### Step 4: Test Both Domains

**Test Payment via nest-haus.at:**
1. Go to: https://www.nest-haus.at/warenkorb
2. Complete checkout
3. Use test card: `4242 4242 4242 4242`
4. Check webhook received in Stripe Dashboard

**Test Payment via da-hoam.at:**
1. Go to: https://www.da-hoam.at/warenkorb
2. Complete checkout
3. Use test card: `4242 4242 4242 4242`
4. Check webhook received in Stripe Dashboard

**Both should work identically!**

---

## 📊 How It Works Internally

### Payment Flow (Domain-Agnostic):

```
1. Customer visits: www.da-hoam.at/warenkorb
2. Clicks "Zur Kassa" (checkout button)
3. API call: POST /api/payments/create-payment-intent
   - Server creates: payment_intent_abc123
   - Returns to client: client_secret
4. Customer enters card details
5. Stripe processes payment
6. Stripe triggers webhook: www.nest-haus.at/api/webhooks/stripe
   - Payload contains: payment_intent_abc123
7. Your webhook handler:
   - Receives event
   - Verifies signature ✅
   - Extracts: payment_intent_abc123
   - Queries database: WHERE paymentIntentId = 'abc123'
   - Finds inquiry (doesn't matter which domain)
   - Updates status to PAID
   - Sends emails
8. Done! ✅
```

**Key Point:** The `paymentIntentId` is the unique identifier, not the domain.

---

## 🔐 Security Considerations

### Single Webhook = Simpler Security

**With ONE webhook:**
- ✅ One webhook secret to secure
- ✅ One signature to verify
- ✅ Easier to rotate secrets
- ✅ Simpler access control

**With MULTIPLE webhooks:**
- ❌ Multiple secrets to manage
- ❌ Need to check which secret to use
- ❌ More complex rotation process
- ❌ Higher risk of misconfiguration

### Your Current Setup is Secure:

```typescript
// src/app/api/webhooks/stripe/route.ts
// ✅ Already domain-agnostic and secure

export async function POST(request: NextRequest) {
    const signature = request.headers.get('stripe-signature');
    
    // ✅ Verifies signature with STRIPE_WEBHOOK_SECRET
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    // ✅ Processes payment by ID (not by domain)
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await prisma.customerInquiry.updateMany({
        where: { paymentIntentId: paymentIntent.id } // ← Domain doesn't matter
    });
}
```

**No code changes needed for multi-domain support!**

---

## 📝 Verification Checklist

### After Setup:

- [ ] One webhook configured in Stripe Dashboard
- [ ] Webhook URL: `https://www.nest-haus.at/api/webhooks/stripe`
- [ ] Webhook secret saved in Vercel environment variables
- [ ] Test payment via `www.nest-haus.at` → ✅ Works
- [ ] Test payment via `www.da-hoam.at` → ✅ Works
- [ ] Webhook delivery shows 200 OK in Stripe Dashboard
- [ ] Emails sent for both domains
- [ ] Database updated for both domains

---

## 🎯 Summary

### What You Need to Do:

1. ✅ **Use ONE webhook:** `https://www.nest-haus.at/api/webhooks/stripe`
2. ✅ **Configure in Stripe Dashboard** (Live mode)
3. ✅ **Test both domains** (nest-haus.at and da-hoam.at)
4. ✅ **Verify webhooks work** (check Stripe Dashboard)

### What You DON'T Need to Do:

- ❌ Create separate webhooks for each domain
- ❌ Change any code
- ❌ Add domain detection logic
- ❌ Manage multiple webhook secrets
- ❌ Update database schema

### Why This Works:

**Payments are identified by `payment_intent_id`, NOT by domain.**

Your webhook endpoint is **domain-agnostic** and will handle all payments regardless of which domain the customer used.

---

## 🔍 Troubleshooting

### Issue: Webhook fails for da-hoam.at payments

**Check:**
1. Payment Intent ID exists in database
2. Webhook signature is valid
3. `da-hoam.at` is properly configured in Vercel

**Most likely cause:**
- Payment Intent wasn't saved to database (check payment creation flow)
- Not webhook configuration issue

### Issue: Different email templates per domain

**Solution (if needed in future):**
You can detect which domain was used from the inquiry record:

```typescript
// In webhook handler
const inquiry = await prisma.customerInquiry.findFirst({
    where: { paymentIntentId: paymentIntent.id }
});

// Add domain field to inquiry (if not exists)
// Then customize emails based on inquiry.domain
```

**Current:** Same emails for all domains ✅

---

## 📚 Additional Resources

**Stripe Webhook Documentation:**
- https://stripe.com/docs/webhooks
- https://stripe.com/docs/webhooks/best-practices

**Multi-Domain Setup:**
- Your webhook code is already multi-domain ready ✅
- No additional configuration needed

---

## ✅ Final Recommendation

**Use ONE webhook endpoint:**
```
https://www.nest-haus.at/api/webhooks/stripe
```

**This handles ALL payments from:**
- ✅ www.nest-haus.at
- ✅ www.da-hoam.at
- ✅ Any future domain aliases

**No code changes required!** 🎉

---

**Document created:** December 21, 2025  
**Configuration complexity:** Very Low (5 minutes)  
**Code changes required:** None
