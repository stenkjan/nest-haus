# Stripe Dashboard Setup Guide

## 🎯 **Quick Setup: Enable Payment Methods**

### **Step 1: Log into Stripe Dashboard**

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Make sure you're in **Test Mode** (toggle in top right)

### **Step 2: Enable Payment Methods**

1. In the left sidebar, click **"Settings"** (gear icon)
2. Click **"Payment methods"**
3. You'll see a list of payment methods with checkboxes

### **Step 3: Check These Boxes** ✅

Enable all 7 payment methods:

- ✅ **Cards** (already enabled)
- ✅ **Apple Pay** - iPhone/iPad users
- ✅ **Google Pay** - Android users
- ✅ **EPS** - Austrian banking standard
- ✅ **Sofort** - Instant bank transfer
- ✅ **Klarna** - Buy now, pay later
- ✅ **SEPA Direct Debit** - Bank transfer

### **Step 4: Save Changes**

Click **"Save"** at the bottom of the page.

## 🎉 **That's It!**

Your payment form will now automatically show all 7 methods:

- 💳 **Credit/Debit Cards**
- 🍎 **Apple Pay** (iPhone/iPad users)
- 📱 **Google Pay** (Android users)
- 🇦🇹 **EPS** (Austrian banks)
- ⚡ **Sofort** (instant confirmation)
- 🛍️ **Klarna** (buy now, pay later)
- 🏦 **SEPA Direct Debit** (bank transfer, €0.35 fee)

## 🧪 **Test the Changes**

1. Refresh your website
2. Click "Zur Kassa"
3. You should now see multiple payment options!

## 💡 **Why These Methods?**

### **For Austrian Customers** 🇦🇹

- **EPS**: Every Austrian bank supports this
- **SEPA**: Cheapest for large amounts (only €0.35)
- **Sofort**: Instant confirmation

### **For German Customers** 🇩🇪

- **Giropay**: Trusted German standard
- **Sofort**: Very popular in Germany
- **SEPA**: Cost-effective option

## 🔧 **Current Status**

- ✅ **Price**: Fixed to €1 for testing
- ✅ **Payment Methods**: Will show all enabled methods
- ✅ **Error Handling**: Robust error boundaries
- ✅ **UI**: Beautiful blurred overlay modal

## 📱 **Next Steps (Optional)**

If you want to add digital wallets later:

- **Google Pay**: Enable in Stripe + add button
- **Apple Pay**: Enable in Stripe + domain verification

The code is already prepared for these - just enable them in Stripe Dashboard when ready!

---

**🚀 After enabling these payment methods, your customers will have 7 different ways to pay!**

## 📱 **Special Notes**

### **Apple Pay** 🍎

- Only shows on Safari/iOS devices
- Requires domain verification for production
- Works automatically in test mode

### **Google Pay** 📱

- Shows on Chrome/Android devices
- Works automatically when enabled
- No additional setup needed

### **Klarna** 🛍️

- Buy now, pay later option
- Popular with younger customers
- Automatic approval for small amounts
