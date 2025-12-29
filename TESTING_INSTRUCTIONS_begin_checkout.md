# Testing Instructions: begin_checkout GA4 Event

## Implementation Summary

✅ **Completed Implementation:**
1. Added `trackBeginCheckout` function to `src/lib/ga4-tracking.ts`
2. Added tracking useEffect to `src/app/warenkorb/WarenkorbClient.tsx`
3. Updated documentation in `docs/final_GOOGLE-ANALYTICS-SEO-COMPLETE-IMPLEMENTATION.md`

## Manual Testing Guide

### Prerequisites
- Development server running: `npm run dev`
- Browser DevTools open (F12)
- Console tab visible
- Network tab open and filtered for "google-analytics.com"

---

### Test 1: With Configuration Flow (€150k Intent → €3k Payment)

**Steps:**
1. Navigate to `http://localhost:3000/konfigurator`
2. Configure a house (select any options)
3. Click "Zum Warenkorb" button at the bottom
4. Warenkorb page loads

**Expected Console Logs:**
```
🛒 Tracking begin_checkout event
📊 DataLayer Event: {
  event: 'begin_checkout',
  ecommerce: {
    currency: 'EUR',
    value: 3000,
    items: [
      {
        item_id: 'KONZEPT-CHECK-001',
        item_name: 'Konzeptcheck',
        item_category: 'service',
        price: 3000,
        quantity: 1
      },
      {
        item_id: 'HOUSE-CONF-xxxxxxxx',
        item_name: '2-Module',  // or whatever was configured
        item_category: 'house_configuration',
        price: 0,
        quantity: 1
      }
    ]
  },
  has_house_configuration: true,
  house_intent_value: 150000  // or actual config value
}
📈 GA4 Event (gtag): begin_checkout {...}
```

**Expected Network Request:**
- POST to `google-analytics.com/g/collect`
- Payload contains: `en=begin_checkout`, `ep.value=3000`, `ep.has_house_configuration=true`

**Verify:**
- ✅ Event value is €3,000 (NOT the house price)
- ✅ `has_house_configuration` = true
- ✅ `house_intent_value` contains the actual house configuration price
- ✅ Two items in the items array

---

### Test 2: Without Configuration (Konzept-Check Only)

**Steps:**
1. Navigate to `http://localhost:3000/konfigurator`
2. Click "Konzept-Check bestellen" button (skip configuration)
3. Warenkorb page loads

**Expected Console Logs:**
```
🛒 Tracking begin_checkout event
📊 DataLayer Event: {
  event: 'begin_checkout',
  ecommerce: {
    currency: 'EUR',
    value: 3000,
    items: [
      {
        item_id: 'KONZEPT-CHECK-001',
        item_name: 'Konzeptcheck',
        item_category: 'service',
        price: 3000,
        quantity: 1
      }
    ]
  },
  has_house_configuration: false,
  house_intent_value: 0
}
📈 GA4 Event (gtag): begin_checkout {...}
```

**Verify:**
- ✅ Event value is €3,000
- ✅ `has_house_configuration` = false
- ✅ `house_intent_value` = 0
- ✅ Only one item in the items array (Konzept-Check)

---

### Test 3: No Duplicate Tracking on Refresh

**Steps:**
1. Complete Test 1 or Test 2
2. Press F5 to refresh the page
3. Check console

**Expected Behavior:**
- ✅ `begin_checkout` event does NOT fire again
- ✅ No "📊 DataLayer Event" or "📈 GA4 Event" logs for begin_checkout
- ✅ SessionStorage contains `checkout_tracked: "true"`

**How to verify sessionStorage:**
```javascript
// In browser console:
sessionStorage.getItem('checkout_tracked')
// Should return: "true"
```

---

### Test 4: Tracking Resets After Navigation Away

**Steps:**
1. Complete Test 1 or Test 2
2. Navigate to another page (e.g., `/konfigurator`)
3. Return to `/warenkorb`

**Expected Behavior:**
- ✅ `begin_checkout` event fires again (new checkout session)
- ✅ SessionStorage was cleared on navigation away

---

## GA4 Real-Time Verification

### Access GA4 Real-Time Reports

1. Go to `https://analytics.google.com`
2. Navigate to: **Reports → Realtime → Overview**
3. Perform Test 1 or Test 2
4. Within 30 seconds, verify:

**Expected in Real-Time Report:**
- ✅ Event name: `begin_checkout` appears
- ✅ Event count increments
- ✅ Value: €3,000 (or 3000)

**Check Event Parameters:**
1. Click on the `begin_checkout` event
2. View event parameters
3. Verify:
   - ✅ `currency`: EUR
   - ✅ `value`: 3000
   - ✅ `has_house_configuration`: true/false
   - ✅ `house_intent_value`: [actual value]
   - ✅ `item_id`: KONZEPT-CHECK-001
   - ✅ `item_name`: Konzeptcheck

---

## Debugging Checklist

### If Event Doesn't Fire:

1. **Check Console for Errors:**
   - Look for TypeScript errors
   - Check for "⚠️ gtag not available" warning

2. **Verify Cart Has Items:**
   - Open console: `useCartStore.getState().items`
   - Should return array with at least 1 item

3. **Check Analytics Cookies:**
   - DevTools → Application → Cookies
   - Look for `_ga`, `_ga_*`, `_gid`
   - If missing, accept analytics cookies in cookie banner

4. **Verify gtag is Loaded:**
   ```javascript
   // In console:
   typeof window.gtag
   // Should return: "function"
   
   typeof window.dataLayer
   // Should return: "object"
   ```

5. **Check SessionStorage:**
   ```javascript
   // If this returns "true" but event didn't fire:
   sessionStorage.getItem('checkout_tracked')
   
   // Clear it manually to test again:
   sessionStorage.removeItem('checkout_tracked')
   // Then refresh page
   ```

### If Wrong Value Appears:

1. **Expected:** €3,000 (Konzept-Check price)
2. **NOT Expected:** €150,000+ (house configuration price)

If you see the house price instead of €3,000:
- Check `src/app/warenkorb/WarenkorbClient.tsx` line ~126
- Verify: `value: 3000.00` (hardcoded, not from cart)

---

## Success Criteria

All tests passed if:
- ✅ Event fires on warenkorb page load (both modes)
- ✅ Value is always €3,000 (payment value)
- ✅ `has_house_configuration` correctly reflects cart state
- ✅ `house_intent_value` captures configuration price
- ✅ No duplicate events on refresh
- ✅ Event appears in GA4 Real-Time within 30 seconds
- ✅ Console logs show proper structure

---

## Next Steps After Testing

Once all tests pass:

1. **Mark Events as Conversions in GA4:**
   - GA4 → Configure → Events
   - Find `begin_checkout` → Toggle "Mark as conversion" ✓

2. **Create Custom Dimensions:**
   - GA4 → Configure → Custom Definitions
   - Add `has_house_configuration` (Event-scoped, Boolean)
   - Add `house_intent_value` (Event-scoped, Number)

3. **Create Funnels in GA4 Explore:**
   - **Revenue Funnel:** add_to_cart → begin_checkout → purchase
   - **Engagement Funnel:** config_complete → add_to_cart → generate_lead

4. **Create Audiences:**
   - "Started Checkout But Not Purchased"
   - "High Intent Without Payment"

---

## Implementation Files Modified

1. `src/lib/ga4-tracking.ts` - Added `trackBeginCheckout()` function
2. `src/app/warenkorb/WarenkorbClient.tsx` - Added tracking useEffect hooks
3. `docs/final_GOOGLE-ANALYTICS-SEO-COMPLETE-IMPLEMENTATION.md` - Updated documentation

---

**Date Implemented:** 2025-12-02
**Status:** ✅ Ready for Testing
**Strategy:** Hybrid Funnel (Intent Value vs Payment Value)























