# 🚀 Stripe Production Migration - Quick Start

## TL;DR: **30 Minutes to Go Live** ⚡

Your Stripe integration is **100% production-ready**. No code changes needed - just swap API keys!

---

## ⚡ 6-Step Quick Migration

### 1️⃣ Get Live Keys (5 min)
```
Stripe Dashboard → Toggle "Live Mode" → Developers → API Keys
Copy: pk_live_... and sk_live_...
```

### 2️⃣ Setup Webhook (10 min)
```
Stripe Dashboard (Live) → Developers → Webhooks → Add endpoint
URL: https://www.nest-haus.at/api/webhooks/stripe ⚠️ Must use www
Events: payment_intent.succeeded, payment_intent.payment_failed, 
        payment_intent.canceled, payment_intent.processing, charge.refunded
Copy: whsec_... (signing secret)
```

### 3️⃣ Enable Payment Methods (5 min)
```
Stripe Dashboard (Live) → Settings → Payment methods
Check: ✅ Cards, ✅ EPS, ✅ Sofort, ✅ SEPA, ✅ Apple Pay, ✅ Google Pay
```

### 4️⃣ Update Vercel (2 min)
```
Vercel → Settings → Environment Variables → Production
Update:
  STRIPE_SECRET_KEY=sk_live_...
  STRIPE_PUBLISHABLE_KEY=pk_live_...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_...
Redeploy!
```

### 5️⃣ Test Small Payment (5 min)
```
Use real card with €0.50 → Complete payment → Verify emails → Refund
```

### 6️⃣ Monitor (Ongoing)
```
Check: Stripe Dashboard → Payments & Webhooks
```

---

## ✅ What's Already Perfect

✅ Code is environment-agnostic (no hardcoded test values)  
✅ Server-side validation (amount can't be manipulated)  
✅ Webhook signature verification (security)  
✅ Comprehensive error handling  
✅ Email notifications configured  
✅ Database schema ready  
✅ TypeScript compliance  

**Result**: Zero code changes needed! 🎉

---

## 💶 Current Configuration

- **Payment Mode**: Deposit
- **Amount**: €500.00 (50000 cents)
- **Currency**: EUR
- **Methods**: Cards, EPS, Sofort, SEPA, Apple Pay, Google Pay

---

## 🔑 What to Update

| Variable | Replace This | With This |
|----------|-------------|-----------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | `pk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Test webhook secret | Live webhook secret |

Everything else stays the same!

---

## 💰 Stripe Fees (Production)

| Method | Fee | Best For |
|--------|-----|----------|
| **SEPA** | **€0.35** | Large amounts (€500 = €0.35 fee) |
| Cards | 2.9% + €0.25 | Quick payments (€500 = €14.75 fee) |
| EPS | 1.8% + €0.25 | Austrian customers |
| Sofort | 1.4% + €0.25 | German customers |

💡 **Tip**: Promote SEPA for deposit payments to save 97% on fees!

---

## 🚨 Security Reminders

⚠️ **NEVER commit `.env.local` with live keys**  
⚠️ **Use Vercel environment variables for production**  
⚠️ **Keep live keys secret - they charge real money!**  

✅ Your code already has proper security:
- Server-side validation
- Webhook signature verification
- No client-side amount manipulation

---

## 🐛 Quick Troubleshooting

**Webhook not working?**
```bash
Check: Stripe Dashboard → Webhooks → Your endpoint → Events
Verify: Response codes are 200 (green checkmarks)
Fix: Update STRIPE_WEBHOOK_SECRET and redeploy
```

**Emails not sending?**
```bash
Check: Email service API key in Vercel environment variables
Check: Customer spam folder
Check: Server logs for email sending errors
```

**Payment not updating database?**
```bash
Check: Webhook is receiving events (Stripe Dashboard)
Check: Server logs for webhook processing errors
Verify: paymentIntentId matches between Stripe and database
```

---

## 📊 Recommended Payment Methods for Austria 🇦🇹

**Priority 1 (Enable Now):**
1. 💳 Cards - Already enabled
2. 🇦🇹 **EPS** - Standard in Austria (enable this!)
3. ⚡ **Sofort** - Popular in DACH region
4. 🏦 **SEPA** - Lowest fees (€0.35)

**Priority 2 (Nice to Have):**
5. 🍎 Apple Pay - iPhone users
6. 📱 Google Pay - Android users

**Result**: Cover 95%+ of Austrian customers!

---

## 📈 Expected Results After Migration

### Before (Test Mode):
- Fake test cards
- No real money
- Test customers only

### After (Production):
- Real credit cards ✅
- Real transactions ✅
- Real customers ✅
- Real Stripe fees ✅
- **Everything else stays the same!**

---

## 🎯 Final Checklist

- [ ] Live API keys copied from Stripe Dashboard
- [ ] Live webhook created and secret copied
- [ ] Payment methods enabled (Cards, EPS, Sofort, SEPA)
- [ ] Vercel environment variables updated
- [ ] Application redeployed
- [ ] Small test payment completed successfully
- [ ] Webhook received (check Stripe Dashboard)
- [ ] Emails sent (customer + admin)
- [ ] Database updated correctly
- [ ] Test payment refunded

---

## 📞 Need Help?

**Detailed Guide**: See `STRIPE_PRODUCTION_MIGRATION_GUIDE.md`  
**Stripe Support**: https://support.stripe.com  
**Stripe Dashboard**: https://dashboard.stripe.com  

---

## ✨ Bottom Line

**Difficulty**: ⭐ VERY EASY  
**Time**: 30 minutes  
**Code Changes**: ZERO  
**Risk**: Very Low (everything tested)

Just swap the keys and you're live! 🚀

---

**Last Updated**: 2025-11-15  
**Status**: ✅ Ready to Deploy
