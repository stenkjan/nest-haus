# 🚨 Stripe Webhook Quick Fix

**Problem:** Webhooks failing to `https://nest-haus.at/api/webhooks/stripe`

**Root Cause:** URL redirects to `www.nest-haus.at` but Stripe doesn't follow redirects

**Solution Time:** 5 minutes

---

## ✅ Fix Steps

### 1. Go to Stripe Dashboard

**Live Mode:**
```
https://dashboard.stripe.com/webhooks
```

### 2. Find Your Webhook

Look for endpoint with URL:
```
https://nest-haus.at/api/webhooks/stripe
```

### 3. Update the URL

Click on the endpoint, then update URL to:
```
https://www.nest-haus.at/api/webhooks/stripe
```

### 4. Test It

In Stripe Dashboard:
1. Click "Send test webhook"
2. Select event: `payment_intent.succeeded`
3. Click "Send test webhook"
4. Should show: ✅ **200 OK** (Success)

---

## ✅ Verification

After updating, webhook attempts should show:

```
✅ Status: 200
✅ Response: {"received":true}
✅ No more failures
```

---

## 📝 If You Have Test Mode Webhook

Repeat the same steps in **Test Mode:**

```
https://dashboard.stripe.com/test/webhooks
```

Update URL from:
```
https://nest-haus.at/api/webhooks/stripe
```

To:
```
https://www.nest-haus.at/api/webhooks/stripe
```

---

## 🎯 What This Fixes

✅ Payment confirmation emails will be sent  
✅ Database updates automatically  
✅ Admin notifications work  
✅ No manual order processing needed  
✅ Professional customer experience  

---

## 📊 Technical Details

**Why it failed:**
- `nest-haus.at` redirects (301) to `www.nest-haus.at`
- Stripe security policy: **never follow redirects**
- Result: webhook delivery fails

**Why it works now:**
- `www.nest-haus.at/api/webhooks/stripe` returns 200 OK
- No redirect, direct response
- Stripe marks as successful delivery

---

## 🔍 How to Monitor

### Stripe Dashboard:
```
Webhooks → Your endpoint → Recent attempts
```

Should see:
- ✅ All green checkmarks
- ✅ HTTP 200 status
- ✅ No red X marks

### Your Server Logs:
```
[Stripe Webhook] Received event: payment_intent.succeeded
[Stripe Webhook] Payment succeeded: pi_xxxxx
[Stripe Webhook] Updated 1 inquiries
[Stripe Webhook] ✅ Sent payment confirmation
[Stripe Webhook] ✅ Sent admin notification
```

---

## 🎉 Done!

Your webhook should now work perfectly. No code changes needed!

**See full details:** `STRIPE_WEBHOOK_INVESTIGATION_REPORT.md`
