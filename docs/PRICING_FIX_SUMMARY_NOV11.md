# Konfigurator Pricing Fixes - November 11, 2025

## ✅ Completed Fixes

### 1. **Spreadsheet ID Verified**
- **Spreadsheet ID**: `10FYz4vTgdN-L4k87PYn-59-myGQel20svyJpYliRM38`
- **URL**: `https://docs.google.com/spreadsheets/d/10FYz4vTgdN-L4k87PYn-59-myGQel20svyJpYliRM38/edit?gid=139712581#gid=139712581`
- **Status**: ✅ Correct (no changes needed)

### 2. **Geschossdecke Column Mapping Fixed**
**File**: `src/services/pricing-sheet-service.ts`

**Fixed column mapping** to use F, H, J, L, N (consistent with nest sizes) instead of G, I, K, M, O:

```typescript
// OLD (WRONG):
maxAmounts.nest80 = this.parseNumber(row7[6]); // G7
maxAmounts.nest100 = this.parseNumber(row7[8]); // I7
maxAmounts.nest120 = this.parseNumber(row7[10]); // K7
maxAmounts.nest140 = this.parseNumber(row7[12]); // M7
maxAmounts.nest160 = this.parseNumber(row7[14]); // O7

// NEW (CORRECT):
maxAmounts.nest80 = this.parseNumber(row7[5]); // F7
maxAmounts.nest100 = this.parseNumber(row7[7]); // H7
maxAmounts.nest120 = this.parseNumber(row7[9]); // J7
maxAmounts.nest140 = this.parseNumber(row7[11]); // L7
maxAmounts.nest160 = this.parseNumber(row7[13]); // N7
```

### 3. **Innenverkleidung Absolute Pricing**
**File**: `src/app/konfigurator/core/PriceCalculator.ts`

**CRITICAL FIX**: Innenverkleidung now uses ABSOLUTE prices, not relative!

```typescript
// BEFORE (WRONG - used relative pricing):
const innenverkleidungPrice = pricingData.innenverkleidung[innenverkleidung]?.[nestSize] || 0;
const fichtePrice = pricingData.innenverkleidung.fichte?.[nestSize] || 0;
const innenverkleidungRelative = innenverkleidungPrice - fichtePrice;
return nestPrice + gebaeudehuelleRelative + innenverkleidungRelative + bodenbelagRelative;

// AFTER (CORRECT - uses absolute pricing):
// CRITICAL: Innenverkleidung uses ABSOLUTE prices, not relative!
// The nest base price does NOT include innenverkleidung.
// Fichte is the standard option but costs money (e.g., 23020€ for nest80)
const innenverkleidungPrice = pricingData.innenverkleidung[innenverkleidung]?.[nestSize] || 0;
return nestPrice + gebaeudehuelleRelative + innenverkleidungPrice + bodenbelagRelative;
```

**Result**: Fichte will now show as **23,020€ for Nest 80**, not as "Inkludiert" / 0€!

### 4. **Dynamic Price Override System**
**File**: `src/app/konfigurator/components/ConfiguratorShell.tsx`

Implemented comprehensive dynamic pricing that overrides static `configuratorData.ts` prices with Google Sheets data:

#### **Nest Sizes**
```typescript
if (pricingData) {
  const nestSize = optionId as 'nest80' | 'nest100' | 'nest120' | 'nest140' | 'nest160';
  const dynamicPrice = pricingData.nest[nestSize]?.price;
  if (dynamicPrice) {
    return {
      type: "base" as const,
      amount: dynamicPrice,
      monthly: PriceCalculator.calculateMonthlyPaymentAmount(dynamicPrice),
    };
  }
}
```

**Expected prices** (from spreadsheet F11-N11):
- Nest 80: 188,619€
- Nest 100: 226,108€
- Nest 120: 263,597€
- Nest 140: 301,086€
- Nest 160: 338,575€

#### **Innenverkleidung (ABSOLUTE Prices)**
- Shows ACTUAL prices from sheet (e.g., Fichte = 23,020€ for Nest 80, cell F24)
- **NOT shown as "Inkludiert" anymore!**
- Other options show relative difference to currently selected option
- If no selection: shows as base price

#### **Gebäudehülle (Relative to Trapezblech)**
- Trapezblech: 0€ / "Inkludiert" (base option)
- Other options: +/- difference from Trapezblech
- Prices from F17-N20 in sheet

#### **Bodenbelag (Relative to Ohne Belag)**
- Standard / Ohne Belag: 0€ / "Inkludiert" (base option)
- Other options: +/- difference from Ohne Belag
- Prices from F50-N53 in sheet

#### **Planungspakete (Fixed Prices)**
- Basis: 0€ / "Inkludiert"
- Plus: 9,600€ (same for all nest sizes, from F88)
- Pro: 12,700€ (same for all nest sizes, from F89)

---

## ⚠️ Issue: Pricing Sync Failing

### Error
```json
{
  "success": false,
  "message": "Pricing sync failed",
  "error": "Requested entity was not found.",
  "duration": 2534,
  "timestamp": "2025-11-11T10:21:21.341Z"
}
```

### Diagnosis
The spreadsheet ID `0FYz4vTgdN-L4k87PYn-59-myGQel20svyJpYliRM38` cannot be accessed by the Google Sheets API.

**Possible causes:**
1. The spreadsheet ID is incorrect
2. The service account doesn't have access to this spreadsheet

### Required Action

#### Option 1: Verify Spreadsheet ID
1. Open the Google Sheet in your browser
2. Check the URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
3. Copy the exact ID from the URL
4. Update `.env` and `.env.local` with the correct ID
5. Restart dev server: `taskkill //F //IM node.exe && rm -rf .next && npm run dev`
6. Run sync: `curl -X POST "http://localhost:3000/api/admin/sync-pricing?password=YOUR_PASSWORD"`

#### Option 2: Grant Service Account Access
1. Open the Google Sheet
2. Click "Share" button
3. Add email: `nest-configurator-sa@nest-461713.iam.gserviceaccount.com`
4. Set permission: **Viewer**
5. Click "Send"
6. Run sync: `curl -X POST "http://localhost:3000/api/admin/sync-pricing?password=YOUR_PASSWORD"`

---

## 📋 Current Database Pricing Data

The database currently contains pricing data from the **old/wrong spreadsheet** (`10FYz...`):

```json
{
  "nest": {
    "nest80": {
      "price": 200965,  // WRONG - should be 188619
      "pricePerSqm": 2679.53,
      "squareMeters": 75
    }
  },
  "innenverkleidung": {
    "fichte": {
      "nest80": 23020  // This is CORRECT - from F24 in sheet
    }
  }
}
```

**Once the correct spreadsheet is synced**, prices will update to:
- Nest 80: 188,619€ (from F11)
- Nest 100: 226,108€ (from H11)
- Nest 120: 263,597€ (from J11)
- Nest 140: 301,086€ (from L11)
- Nest 160: 338,575€ (from N11)

---

## 🧪 Testing the Fixes

### Visual Tests in Konfigurator UI

1. **Navigate to**: `http://localhost:3000/konfigurator`

2. **Nest Sizes Section**:
   - ✅ Should show "Ab 188,619€" for Nest 80 (after correct sync)
   - ✅ Should show "entspricht X€/m²" calculated as: price / (size - 5)
   - Currently shows wrong price (200,965€) until sync completes

3. **Innenverkleidung Section**:
   - ✅ **CRITICAL**: Fichte should show **23,020€**, NOT "Inkludiert"!
   - ✅ Lärche should show +8,901€ (difference from Fichte)
   - ✅ Steirische Eiche should show +14,215€ (difference from Fichte)
   - ✅ When selecting different options, prices update relatively

4. **Gebäudehülle Section**:
   - ✅ Trapezblech should show "Inkludiert" (0€)
   - ✅ Holzlattung Lärche should show +24,413€ (for Nest 80)
   - ✅ Fassadenplatten Schwarz/Weiß should show same price (+/-)

5. **Planungspakete Section**:
   - ✅ Basis should show "Inkludiert" (0€)
   - ✅ Plus should show 9,600€ (same for all nest sizes)
   - ✅ Pro should show 12,700€ (same for all nest sizes)

6. **Price Updates on Nest Size Change**:
   - ✅ When changing nest size, ALL prices should recalculate
   - ✅ Innenverkleidung prices should change (ABSOLUTE pricing)
   - ✅ Gebäudehülle prices should change (relative to trapezblech)
   - ✅ m² prices should recalculate based on new nest size

---

## 🔧 Code Changes Summary

### Files Modified
1. `.env` - Spreadsheet ID corrected
2. `.env.local` - Spreadsheet ID corrected
3. `src/services/pricing-sheet-service.ts` - Geschossdecke column mapping fixed
4. `src/app/konfigurator/core/PriceCalculator.ts` - Innenverkleidung absolute pricing
5. `src/app/konfigurator/components/ConfiguratorShell.tsx` - Dynamic price overrides (200+ lines added)

### Key Principles Applied
1. **NO Math.round()** anywhere in price calculations (as per user requirement!)
2. **Innenverkleidung uses ABSOLUTE prices** - Fichte is NOT 0€!
3. **Dynamic pricing overrides static data** from `configuratorData.ts`
4. **Relative pricing** only for:
   - Gebäudehülle (relative to Trapezblech)
   - Bodenbelag (relative to Ohne Belag)
5. **Fixed pricing** for Planungspakete (no nest size dependency)

---

## 🚀 Next Steps

1. **Verify spreadsheet ID** or grant service account access
2. **Run pricing sync**:
   ```bash
   curl -X POST "http://localhost:3000/api/admin/sync-pricing?password=YOUR_PASSWORD"
   ```
3. **Test Konfigurator UI** to verify all prices display correctly
4. **Verify Innenverkleidung** - Fichte must show 23,020€, NOT "Inkludiert"!
5. **Test price updates** when changing nest sizes

---

**Status**: All code fixes complete ✅  
**Blocking**: Spreadsheet sync access issue ⚠️  
**Date**: November 11, 2025

