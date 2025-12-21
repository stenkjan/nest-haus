# 🎯 Stripe Webhooks - Quick Visual Explanation

## The Confusion: Payment Domain vs Webhook URL

### What You're Seeing (Works ✅):

```
Customer Journey:

www.da-hoam.at/warenkorb
        ↓
   Customer pays
        ↓
   Payment succeeds ✅
        
www.nest-haus.at/warenkorb
        ↓
   Customer pays
        ↓
   Payment succeeds ✅
```

**Both domains work for payments!**

---

### What Stripe Is Seeing (Fails ❌):

```
Stripe Webhook Delivery:

Payment succeeds
        ↓
Stripe looks up webhook URL from Dashboard:
   "nest-haus.at/api/webhooks/stripe"
        ↓
Stripe sends POST request:
   POST https://nest-haus.at/api/webhooks/stripe
        ↓
Your server responds:
   "301 Redirect → www.nest-haus.at"
        ↓
Stripe security policy:
   "Never follow redirects"
        ↓
Webhook delivery FAILS ❌
        ↓
Stripe sends you email:
   "Webhook deliveries failing"
```

---

## The Key Insight

```
┌───────────────────────────────────────────────────┐
│  PAYMENTS (Customer-Facing)                       │
├───────────────────────────────────────────────────┤
│  ✅ www.nest-haus.at  → Works                     │
│  ✅ www.da-hoam.at    → Works                     │
│                                                    │
│  These are where CUSTOMERS visit                  │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│  WEBHOOKS (Server-to-Server)                      │
├───────────────────────────────────────────────────┤
│  ❌ nest-haus.at/api/webhooks  → REDIRECTS        │
│  ✅ www.nest-haus.at/api/webhooks → WORKS         │
│  ✅ www.da-hoam.at/api/webhooks   → WORKS         │
│                                                    │
│  This is where STRIPE sends notifications         │
└───────────────────────────────────────────────────┘
```

**These are SEPARATE things!**

---

## The Solution

### Current Configuration (Wrong):

```
Stripe Dashboard → Webhooks → Endpoint URL:
┌──────────────────────────────────────────┐
│ https://nest-haus.at/api/webhooks/stripe │ ❌
└──────────────────────────────────────────┘
          ↓
   Returns 301 Redirect
          ↓
   Webhook FAILS
```

### Correct Configuration:

```
Stripe Dashboard → Webhooks → Endpoint URL:
┌──────────────────────────────────────────────┐
│ https://www.nest-haus.at/api/webhooks/stripe │ ✅
└──────────────────────────────────────────────┘
          ↓
   Returns 200 OK
          ↓
   Webhook SUCCEEDS
```

---

## Why One Webhook Handles Both Domains

```
Payment from da-hoam.at:
   payment_intent_abc123
          ↓
Saved to database:
   paymentIntentId: "abc123"
          ↓
Stripe webhook triggered:
   POST www.nest-haus.at/api/webhooks
   Body: { id: "abc123" }
          ↓
Webhook handler:
   WHERE paymentIntentId = "abc123"
          ↓
   Found! Update status ✅
   
---

Payment from nest-haus.at:
   payment_intent_xyz789
          ↓
Saved to database:
   paymentIntentId: "xyz789"
          ↓
Stripe webhook triggered:
   POST www.nest-haus.at/api/webhooks
   Body: { id: "xyz789" }
          ↓
Webhook handler:
   WHERE paymentIntentId = "xyz789"
          ↓
   Found! Update status ✅
```

**Both use the SAME webhook URL!**

---

## The Fix (5 Minutes)

```
1. Login: https://dashboard.stripe.com/webhooks

2. Find webhook endpoint

3. Update URL:
   FROM: nest-haus.at/api/webhooks/stripe
   TO:   www.nest-haus.at/api/webhooks/stripe
         ^^^^
         Add "www"

4. Save

5. Test: "Send test webhook" → Should show ✅ 200 OK

Done! ✅
```

---

## Result After Fix

```
┌─────────────────────────────────────────────┐
│ Customer pays on www.da-hoam.at             │
│          ↓                                   │
│ Payment succeeds                             │
│          ↓                                   │
│ Webhook sent to: www.nest-haus.at ✅        │
│          ↓                                   │
│ Confirmation email sent ✅                  │
│ Database updated ✅                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Customer pays on www.nest-haus.at           │
│          ↓                                   │
│ Payment succeeds                             │
│          ↓                                   │
│ Webhook sent to: www.nest-haus.at ✅        │
│          ↓                                   │
│ Confirmation email sent ✅                  │
│ Database updated ✅                          │
└─────────────────────────────────────────────┘
```

**Both domains work perfectly with ONE webhook! ✅**

---

## Key Points

1. **Payment domains** (where customers visit):
   - ✅ www.da-hoam.at works
   - ✅ www.nest-haus.at works

2. **Webhook URL** (where Stripe sends notifications):
   - ❌ nest-haus.at redirects (fails)
   - ✅ www.nest-haus.at works

3. **The problem**: Webhook URL missing "www"

4. **The fix**: Add "www" to webhook URL in Stripe Dashboard

5. **Result**: Everything works! ✅

---

**Bottom Line:** Payments work, but Stripe can't deliver webhooks because of URL redirect. Fix: Add "www" to webhook URL.
