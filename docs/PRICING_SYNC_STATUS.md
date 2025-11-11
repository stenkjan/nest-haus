# Pricing Sync Status & Troubleshooting

**Date:** November 10, 2025  
**Status:** ⚠️ Waiting for deployment and fresh sync

---

## Current Situation

### ✅ Code is Fixed and Deployed
All pricing calculation fixes have been committed and pushed to main:
- ✅ Math.round() removed from parseNumber
- ✅ Innenverkleidung relative pricing restored
- ✅ m² calculation uses 6.5m² per Geschossdecke
- ✅ Planungspakete reads from rows 88-90

**Latest commit on main:** `98dc3f12`

### ⚠️ Database Has Old Rounded Values

The pricing data in the database was synced with the OLD code (that had Math.round()):
- Nest 80: 189,000€ (should be 188,619€ based on sheet)
- Geschossdecke: 4,000€ (should be 4,115€ based on sheet)

**Last sync:** Version 41, synced at 14:20 UTC

---

## Root Cause Analysis

The pricing flow is:
```
Google Sheet → Parse with pricing-sheet-service.ts → Database → Konfigurator
```

**The Problem:**
1. Database was synced when code had Math.round()
2. Rounded values (189000, 4000) got stored in database
3. Code was fixed (Math.round removed)
4. But database still has old rounded values!

**Why Re-sync Isn't Working:**
- Vercel may still be deploying the latest code
- OR the sync is working but Google Sheet has rounded values
- OR there's a caching layer we're missing

---

## Solution Steps

### Step 1: Verify Latest Code is Deployed

Check Vercel deployment status:
1. Go to: https://vercel.com/
2. Navigate to: nest-haus project → Deployments
3. Verify latest deployment shows commit starting with `98dc3f12` or later
4. Wait for "Ready" status (usually 2-3 minutes)

### Step 2: Verify Google Sheet Has Exact Values

Open the sheet and check these cells:
```
https://docs.google.com/spreadsheets/d/10FYz4vTgdN-L4k87PYn-59-myGQel20svyJpYliRM38/edit
```

**Tab:** "Preistabelle_Verkauf"

**Verify these cells have exact decimal values:**
- D7: Should be `4.115` (Geschossdecke basePrice)
- F11: Should be `188.619` (Nest 80)
- H11: Should be `226.108` (Nest 100)
- J11: Should be `263.597` (Nest 120)
- L11: Should be `301.086` (Nest 140)
- N11: Should be `338.575` (Nest 160)

**If they show whole numbers like `4` or `189`:** You need to update them to the exact decimal values above.

### Step 3: Trigger Fresh Sync

Once Vercel deployment is complete AND sheet has exact values:

```bash
curl -X POST "https://nest-haus.vercel.app/api/admin/sync-pricing?password=2508DNH-d-w-i-d-z"
```

### Step 4: Verify Database Has New Values

```bash
curl -s "https://nest-haus.vercel.app/api/pricing/data" | python -m json.tool | grep -A8 '"nest80"'
```

Expected output:
```json
"nest80": {
    "price": 188619,  // NOT 189000
    "pricePerSqm": 2514.92,
    "squareMeters": 75
}
```

Also check Geschossdecke:
```bash
curl -s "https://nest-haus.vercel.app/api/pricing/data" | python -m json.tool | grep -A3 '"geschossdecke"'
```

Expected:
```json
"geschossdecke": {
    "basePrice": 4115,  // NOT 4000
    "maxAmounts": {
```

### Step 5: Clear All Caches

If database has correct values but Konfigurator still shows old prices:

**Clear browser caches:**
- Hard refresh: `Ctrl + Shift + R`
- Or clear all site data in DevTools

**Clear sessionStorage:**
```javascript
// In browser console
sessionStorage.removeItem('nest-haus-pricing-data');
location.reload();
```

---

## Debugging Checklist

### If Prices Still Wrong After Sync:

1. **Check deployed commit:**
   - Look at Vercel deployment logs
   - Verify it's using code without Math.round()

2. **Check Google Sheet values:**
   - Open cells D7, F11, H11, J11, L11, N11
   - Verify they have decimal values (188.619, not 189)

3. **Check sync logs:**
   - Go to Vercel → Functions → `/api/admin/sync-pricing`
   - Look for `[DEBUG] Multiplying price:` logs
   - Should show: `188.619 * 1000 = 188619`

4. **Check database directly:**
   - Query: `SELECT * FROM pricing_data_snapshots WHERE isActive = true;`
   - Verify pricingData JSON has exact values

---

## Current Code State

### ✅ pricing-sheet-service.ts
```typescript
// NO Math.round() - preserves exact decimals
private parseNumber(value: unknown, isPrice: boolean = false): number {
  if (typeof value === 'number') {
    const result = (isPrice && value < 1000 && value > 0) ? value * 1000 : value;
    return result; // NO rounding!
  }
  // ... same for strings
}
```

### ✅ PriceCalculator.ts
```typescript
// Correct relative pricing for Innenverkleidung
const innenverkleidungRelative = innenverkleidungPrice - fichtePrice;
return nestPrice + gebaeudehuelleRelative + innenverkleidungRelative + bodenbelagRelative;
```

### ✅ PriceUtils.ts
```typescript
// Correct m² formula
const geschossdeckeArea = (geschossdeckeQuantity || 0) * 6.5;
return baseArea + geschossdeckeArea;
```

---

## Expected Results After Fix

### Nest Prices (from F11-N11):
- Nest 80: **188,619€** (not 189,000€ or 155,500€)
- Nest 100: **226,108€**
- Nest 120: **263,597€**
- Nest 140: **301,086€**
- Nest 160: **338,575€**

### Other Prices (from sheet):
- Geschossdecke: **4,115€** (from D7, not 4,000€)
- Fichte: **23,020€** (from F24)
- Planungspaket Plus: **9,600€** (from F89)
- Planungspaket Pro: **12,700€** (from F90)

### Konfigurator Display:
- Nest 80 base: **~189k€**
- With Fichte: **~189k€** (base includes Fichte)
- With Lärche: **~198k€** (base + 8,901€)
- Geschossdecke: **4,115€** per unit

---

## Next Steps

1. ⏳ Wait for Vercel deployment (check: https://vercel.com/deployments)
2. 🔄 Run sync: `curl -X POST "https://nest-haus.vercel.app/api/admin/sync-pricing?password=2508DNH-d-w-i-d-z"`
3. ✅ Verify prices: Check API and Konfigurator
4. 🧹 Clear browser cache if needed

**If prices still wrong after these steps, we need to investigate further!**


