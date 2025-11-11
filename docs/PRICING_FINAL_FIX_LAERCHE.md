# FINAL FIX: Lärche Showing 0€ - RESOLVED

**Date**: November 11, 2025  
**Issue**: Lärche innenverkleidung was showing 0€ instead of +8,901€

---

## 🔍 Root Cause

**KEY MISMATCH PROBLEM**: The Google Sheets contains `"Lärche"` (with German umlaut `ä`), but the configurator uses `"laerche"` (ASCII, without umlaut) as the option ID.

### The Data Flow:

1. **Google Sheets**: Cell contains `"Lärche"` (UTF-8 with umlaut ä)
2. **Pricing Sheet Service**: Reads `"lärche"` from sheet
3. **Database**: Stored as `"lärche"` (with umlaut)
4. **ConfiguratorData**: Uses `id: 'laerche'` (without umlaut)
5. **Price Lookup**: `pricingData.innenverkleidung['laerche']` → **undefined** → 0€

### Why This Happened:

```typescript
// ConfiguratorData.ts
{
  id: 'laerche',  // ASCII, no umlaut
  name: 'Lärche', // Display name with umlaut
  ...
}

// Pricing lookup in ConfiguratorShell.tsx
const absolutePrice = pricingData.innenverkleidung['laerche']?.[nestSize];
// Looking for 'laerche' but database has 'lärche' → undefined → 0€
```

---

## ✅ The Fix

**File**: `src/services/pricing-sheet-service.ts` (lines 282-287)

Added mapping to convert the UTF-8 umlaut version to ASCII version:

```typescript
const optionMapping: Record<string, string> = {
  'eiche': 'steirische_eiche',
  'fichte': 'fichte',
  'laerche': 'laerche',  // ASCII version
  'lärche': 'laerche',   // UTF-8 version from Google Sheets → map to ASCII
};
```

**What This Does**:
- When reading from Google Sheets: `"Lärche"` (with ä)
- Converts to lowercase: `"lärche"`
- Maps through optionMapping: `"lärche"` → `"laerche"` (without umlaut)
- Stores in database as: `"laerche"`
- Matches configurator ID: ✅

---

## 🧪 Verification

### Before Fix:
```json
{
  "innenverkleidung": {
    "fichte": { "nest80": 23020 },
    "lärche": { "nest80": 31921 },  // ❌ Wrong key (with ä)
    "steirische_eiche": { "nest80": 37235 }
  }
}
```

**Result**: Lärche showed 0€ because lookup failed

### After Fix:
```json
{
  "innenverkleidung": {
    "fichte": { "nest80": 23020 },
    "laerche": { "nest80": 31921 },  // ✅ Correct key (without ä)
    "steirische_eiche": { "nest80": 37235 }
  }
}
```

**Result**: Lärche shows +8,901€ (31,921€ - 23,020€)

---

## 📊 Expected Behavior Now

### Initial State (No selection / Fichte preselected):
- **Fichte**: 23,020€
- **Lärche**: **+8,901€** ✅ (not 0€!)
- **Steirische Eiche**: +14,215€

### After Selecting Lärche:
- **Fichte**: -8,901€
- **Lärche**: **31,921€** ✅ (not "Inkludiert"!)
- **Steirische Eiche**: +5,314€

### After Selecting Steirische Eiche:
- **Fichte**: -14,215€
- **Lärche**: -5,314€
- **Steirische Eiche**: **37,235€** ✅

---

## 🔧 Additional Fixes Applied

### 1. Innenverkleidung Never Shows "Inkludiert"

**File**: `src/app/konfigurator/components/SelectionOption.tsx` (line 92)

```typescript
// BEFORE:
{contributionPrice === 0 ? (
  // Shows "inklusive" for ANY category with 0 price

// AFTER:
{contributionPrice === 0 && categoryId !== "innenverkleidung" ? (
  // Excludes innenverkleidung from "inklusive" display
```

**Reason**: ALL innenverkleidung options have prices - none should ever show "Inkludiert"!

### 2. Innenverkleidung Shows Actual Prices When Selected

**File**: `src/app/konfigurator/components/SelectionOption.tsx` (lines 105-117)

```typescript
categoryId === "belichtungspaket" || categoryId === "innenverkleidung" ? (
  // Center the price without entspricht
  <>
    <p>&nbsp;</p>
    <p>{PriceUtils.formatPrice(contributionPrice)}</p>  // Shows 31,921€
    <p>&nbsp;</p>
  </>
```

**Reason**: Selected innenverkleidung should show the absolute price, not "inklusive"

---

## 🎯 Complete Pricing Fix Summary

### Issues Fixed:
1. ✅ Nest base price shows 188,619€ (not 211,639€)
2. ✅ Innenverkleidung Fichte shows 23,020€ (not "Inkludiert")
3. ✅ Innenverkleidung Lärche shows +8,901€ when unselected (not 0€)
4. ✅ Innenverkleidung Lärche shows 31,921€ when selected (not "Inkludiert")
5. ✅ All prices match spreadsheet exactly
6. ✅ UTF-8 character mapping handled correctly

### Files Changed:
1. `src/services/pricing-sheet-service.ts` - Added lärche → laerche mapping
2. `src/app/konfigurator/core/PriceCalculator.ts` - Clarified pricing model
3. `src/app/konfigurator/components/ConfiguratorShell.tsx` - Fixed nest and material pricing
4. `src/app/konfigurator/components/SelectionOption.tsx` - Excluded innenverkleidung from "inklusive"

### Actions Taken:
1. Fixed spreadsheet ID column mapping for Geschossdecke
2. Fixed UTF-8 character encoding for Lärche
3. Re-synced pricing data from Google Sheets
4. Verified all prices in database match spreadsheet

---

## ✅ Status

**ALL PRICING ISSUES RESOLVED** ✅

The Konfigurator now:
- Shows correct nest base prices (raw construction only)
- Shows correct innenverkleidung prices (ALL have prices, never "Inkludiert")
- Handles UTF-8 characters correctly (Lärche → laerche)
- Displays relative pricing correctly (+/- from selected option)
- Matches spreadsheet prices exactly

**Ready for testing!** 🚀

