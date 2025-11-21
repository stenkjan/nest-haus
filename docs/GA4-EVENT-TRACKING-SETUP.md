# GA4 Event Tracking Setup Guide

## Overview
This guide explains how to ensure your custom GA4 events (like `generate_lead`) are properly captured in Google Analytics 4.

## Problem
Events are being pushed to the dataLayer but not appearing in GA4 reports because:
1. Custom events need to be sent directly to GA4 via `gtag('event', ...)`
2. OR they need to be configured in Google Tag Manager (if using GTM)

## Solution Implemented

### Code Changes
We updated `src/lib/ga4-tracking.ts` to send events **both ways**:
- **To dataLayer**: For GTM compatibility (if you add GTM later)
- **To gtag**: Direct GA4 tracking (works immediately)

### How It Works Now
When you call `trackAppointmentBooking()`, it:
1. Pushes event to `window.dataLayer` (for GTM)
2. Calls `window.gtag('event', 'generate_lead', {...})` (for GA4)
3. Logs both actions to console for debugging

## Verifying Events in GA4

### Step 1: Real-Time Reports
1. Go to **Google Analytics 4** → Your Property
2. Navigate to **Reports** → **Realtime**
3. Submit a test appointment booking
4. You should see the event appear within seconds

### Step 2: DebugView (Recommended)
1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/) Chrome extension
2. Enable the extension
3. Refresh your site and submit a form
4. Go to GA4 → **Configure** → **DebugView**
5. You'll see all events with their parameters in real-time

### Step 3: Check Console Logs
Open browser console and look for:
```
📊 DataLayer Event: {event: "generate_lead", ...}
📈 GA4 Event (gtag): generate_lead {...}
```

If you see `⚠️ gtag not available`, it means GA4 hasn't loaded yet (check consent settings).

## Event Details

### purchase Event (Ecommerce - Payment Success)
**Event Name**: `purchase`

**Triggered When**: User completes payment for Konzept-Check (Stripe redirect success)

**Parameters**:
- `ecommerce.transaction_id`: Unique transaction ID (format: `T-{year}-{payment_intent_suffix}`)
- `ecommerce.value`: Total purchase amount in EUR
- `ecommerce.currency`: "EUR"
- `ecommerce.items[]`: Array of purchased items
  - `item_id`: "KONZEPT-CHECK-001" (Konzept-Check product ID)
  - `item_name`: "Konzeptcheck (Kauf)"
  - `price`: Purchase amount in EUR
  - `quantity`: 1

**Example**:
```javascript
{
  event: 'purchase',
  ecommerce: {
    transaction_id: 'T-2025-a3b2c1d4',
    value: 3000.00,
    currency: 'EUR',
    items: [{
      item_id: 'KONZEPT-CHECK-001',
      item_name: 'Konzeptcheck (Kauf)',
      price: 3000.00,
      quantity: 1
    }]
  }
}
```

**How It Works**:
1. User completes Stripe payment
2. Stripe redirects back with `payment_intent` parameter
3. `PaymentSuccessTracker` component detects redirect
4. Fetches payment status from `/api/payments/verify-redirect`
5. If successful, tracks `purchase` event
6. Uses localStorage to prevent duplicate tracking

### add_to_cart Event (Ecommerce)
**Event Name**: `add_to_cart`

**Triggered When**: User clicks "Zum Warenkorb" (Add to Cart) button after configuring their Nest Haus

**Parameters**:
- `ecommerce.items[]`: Array of items added to cart
  - `item_id`: Configuration ID (format: `HOUSE-CONF-{sessionId}-{month}{year}`)
  - `item_name`: Descriptive name (e.g., "2-Module (Konfig. 11/2025)")
  - `currency`: "EUR"
  - `price`: Total estimated price in EUR
  - `quantity`: Always 1 (single house configuration)

**Example**:
```javascript
{
  event: 'add_to_cart',
  ecommerce: {
    items: [{
      item_id: 'HOUSE-CONF-a3b2c1d4-112025',
      item_name: '2-Module (Konfig. 11/2025)',
      currency: 'EUR',
      price: 150000.00,
      quantity: 1
    }]
  }
}
```

### config_complete Event (Configuration Complete)
**Event Name**: `config_complete`

**Triggered When**: User clicks "Zum Warenkorb" (Add to Cart) button after configuring their Nest Haus

**Parameters**:
- `house_model`: The selected Nest model (e.g., "1-Modul", "2-Module")
- `price_estimated`: Total estimated price in EUR (converted from cents)
- `customization_options`: Pipe-separated string of all selected options
  - Format: `"Nest_2-Module|Fassade_Holzlattung_Lärche|Innen_Eiche_geölt|Boden_Parkett_Eiche|..."`
  - Includes: Nest type, Façade, Interior, Flooring, Lighting, PV, Planning package, and checkboxes

**Example**:
```javascript
{
  event: 'config_complete',
  house_model: '2-Module',
  price_estimated: 150000.00,
  customization_options: 'Nest_2-Module|Fassade_Holzlattung_Lärche|Innen_Eiche_geölt|Boden_Parkett_Eiche|Belichtung_Standard|Planung_Basis|Kamindurchzug_Ja'
}
```

### generate_lead Event (Appointment Booking)
**Event Name**: `generate_lead`

**Parameters**:
- `form_id`: "terminbuchung_formular"
- `event_category`: "appointment"
- `event_label`: "personal" | "online" | "other"
- `appointment_date`: "YYYY-MM-DD"
- `appointment_time`: "HH:MM"
- `time_slot_available`: true | false

### How to See It in GA4

#### Create Custom Report
1. Go to **Explore** in GA4
2. Create a new **Free Form** exploration
3. Add dimensions:
   - Event name
   - `event_category`
   - `event_label`
   - `appointment_date`
4. Add metrics:
   - Event count
5. Filter by: `event_name = generate_lead`

#### Create Custom Event (Optional)
If you want `generate_lead` to appear as a conversion:
1. Go to **Configure** → **Events**
2. Find `generate_lead` in the list
3. Toggle **Mark as conversion**

## Troubleshooting

### Events Not Showing Up?

#### Check 1: Cookie Consent
- Make sure you've accepted analytics cookies on the site
- Check console for: `✅ Google Analytics gtag script loaded`

#### Check 2: GA4 Measurement ID
- Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local`
- Should be format: `G-XXXXXXXXXX`

#### Check 3: Data Filters
- Go to GA4 → **Admin** → **Data Settings** → **Data Filters**
- Make sure your IP isn't filtered (for testing)
- Temporarily disable "Developer Traffic" filter

#### Check 4: gtag Availability
Open console and run:
```javascript
typeof window.gtag
```
Should return `"function"`. If `"undefined"`, GA4 script didn't load.

### Events in Console But Not GA4?

This usually means:
1. **Wrong Property ID**: Double-check your GA4 Measurement ID
2. **Data Filters**: Your traffic is being filtered out
3. **Processing Delay**: Standard reports take 24-48 hours (use DebugView for immediate feedback)

## Testing Checklist

- [ ] Enable analytics cookies in cookie banner
- [ ] Open browser console
- [ ] Fill out appointment form
- [ ] Submit form
- [ ] Check console for both log messages:
  - `📊 DataLayer Event`
  - `📈 GA4 Event (gtag)`
- [ ] Open GA4 DebugView
- [ ] See `generate_lead` event appear
- [ ] Verify all parameters are present

## Custom Events Reference

All custom events in the codebase:

| Event Name | Purpose | Location | Parameters |
|------------|---------|----------|------------|
| `purchase` | Payment completed successfully | PaymentSuccessTracker (Warenkorb) | ecommerce.transaction_id, ecommerce.value, ecommerce.items |
| `add_to_cart` | User adds configuration to cart (ecommerce) | CartFooter (Konfigurator) | ecommerce.items (item_id, item_name, price, quantity) |
| `config_complete` | User adds configuration to cart | CartFooter (Konfigurator) | house_model, price_estimated, customization_options |
| `generate_lead` | Form submissions | AppointmentBooking, ContactForm | form_id, event_category, appointment_date, etc. |
| `begin_checkout` | Configuration complete (legacy) | - | value, currency, items |
| `page_view` | Manual page views | (if needed for SPA) | page_path, page_title |
| `click` | Button/link tracking | Various | event_category, element_id, etc. |

## GA4 vs GTM

### Current Setup: Direct GA4
- ✅ Simpler setup
- ✅ Works immediately
- ✅ No GTM configuration needed
- ✅ Events sent via `gtag()`

### If You Add GTM Later
- Events will work with both systems
- GTM can enhance with additional tags (Meta Pixel, etc.)
- Requires GTM container setup and tag configuration

## Need Help?

If events still aren't showing:
1. Share console logs (with both messages)
2. Confirm GA4 Measurement ID
3. Check DebugView screenshot
4. Verify cookie consent accepted

---

**Last Updated**: 2024-11-21
**Related Files**: 
- `src/lib/ga4-tracking.ts`
- `src/components/analytics/GoogleAnalyticsProvider.tsx`
- `src/components/sections/AppointmentBooking.tsx`

