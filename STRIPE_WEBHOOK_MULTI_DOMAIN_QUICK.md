# 🚀 Multi-Domain Webhook Setup - Quick Guide

**Question:** "We have `www.nest-haus.at` AND `www.da-hoam.at` - what do we change?"

**Answer:** Nothing! Use ONE webhook for both domains.

---

## ✅ Configuration

### Single Webhook (Handles Both Domains):

```
URL: https://www.nest-haus.at/api/webhooks/stripe
```

**This automatically works for:**
- ✅ Payments from www.nest-haus.at
- ✅ Payments from www.da-hoam.at
- ✅ Any other domain aliases

---

## 🎯 Why This Works

**Payments are identified by Payment Intent ID, NOT by domain:**

```
Customer pays on → www.da-hoam.at
Stripe creates → payment_intent_abc123
Webhook sent to → www.nest-haus.at/api/webhooks/stripe
Database lookup → WHERE paymentIntentId = 'abc123'
Result → Works! ✅
```

**The domain where the customer paid doesn't matter!**

---

## 🔧 Setup Steps

### 1. Stripe Dashboard

```
https://dashboard.stripe.com/webhooks

Click "Add endpoint" (or edit existing)
URL: https://www.nest-haus.at/api/webhooks/stripe
Events: payment_intent.succeeded, payment_intent.payment_failed, etc.
Save → Copy webhook secret
```

### 2. Vercel Environment Variables

```
Vercel → Settings → Environment Variables
STRIPE_WEBHOOK_SECRET = whsec_... (from step 1)
Scope: Production
Redeploy
```

### 3. Test Both Domains

```
Test 1: Complete payment on www.nest-haus.at → ✅ Works
Test 2: Complete payment on www.da-hoam.at → ✅ Works
Check: Stripe Dashboard → Webhooks → All show 200 OK
```

---

## ❌ What NOT to Do

**Don't create separate webhooks:**
```
❌ Webhook 1: www.nest-haus.at/api/webhooks/stripe
❌ Webhook 2: www.da-hoam.at/api/webhooks/stripe
```

**Why not:**
- Unnecessary complexity
- Multiple secrets to manage
- Risk of duplicate processing
- Same endpoint, same code → no benefit

---

## 📊 Summary

| Question | Answer |
|----------|--------|
| How many webhooks needed? | **ONE** |
| Which domain to use? | **www.nest-haus.at** (primary) |
| Code changes needed? | **None** |
| Will da-hoam.at payments work? | **Yes** ✅ |
| Setup time | **5 minutes** |

---

## 🎉 Done!

Your webhook is already multi-domain ready. No code changes needed!

**See full details:** `STRIPE_WEBHOOK_MULTI_DOMAIN_SETUP.md`
