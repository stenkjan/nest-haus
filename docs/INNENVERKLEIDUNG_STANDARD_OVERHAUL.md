# Innenverkleidung Standard (ohne_innenverkleidung) Overhaul
**Date:** November 14, 2025  
**Status:** ⚠️ READY FOR GOOGLE SHEET UPDATE

---

## 🎯 Overview

Added new "Standard" option to Innenverkleidung category with `ohne_innenverkleidung` as the new baseline (0€). This changes Fichte from being the baseline to being an upgrade option.

---

## 🔄 What Changed

### **Before**:
- Baseline: **Fichte** (23,020€) - Always showed absolute price, never "inkludiert"
- Default preselection: **Fichte**
- Display: Fichte showed price, Lärche showed relative +/-, Eiche showed relative +/-
- Total price included Fichte by default

### **After**:
- Baseline: **Standard (ohne_innenverkleidung)** (0€) - Shows "inkludiert"
- Default preselection: **Standard**  
- Display: Standard shows "inkludiert", Fichte/Lärche/Eiche show absolute upgrade prices
- Total price does NOT include interior cladding by default (lower base price)

---

## 📊 Pricing Impact

### **Example: Nest 80 Configuration**

**Old System** (Fichte baseline):
```
Nest 80 base:     188,619€
+ Trapezblech:          0€  (inkludiert)
+ Fichte:          23,683€  (absolute price, always shown)
+ ohne_belag:           0€  (inkludiert)
---
Base total:       212,302€
```

**New System** (Standard baseline):
```
Nest 80 base:     188,619€
+ Trapezblech:          0€  (inkludiert)
+ Standard:             0€  (inkludiert - NEW!)
+ ohne_belag:           0€  (inkludiert)
---
Base total:       188,619€  (23,683€ lower!)

If user selects Fichte:
+ Fichte:          23,683€  (upgrade from Standard)
---
Total:            212,302€  (same as before)
```

---

## 📝 Required Google Sheet Update

### **CRITICAL - Must Add Row 23**:

**Spreadsheet**: `10FYz4vTgdN-L4k87PYn-59-myGQel20svyJpYliRM38`  
**Sheet**: "Preistabelle_Verkauf"

**Add New Row 23** (insert BEFORE current row 23/Fichte):

| Column | Content | Value |
|--------|---------|-------|
| E23 | Ohne Innenverkleidung | text |
| F23 | 0 | 0 |
| H23 | 0 | 0 |
| J23 | 0 | 0 |
| L23 | 0 | 0 |
| N23 | 0 | 0 |

**Result**: Rows 23-26 will now be:
- Row 23: Ohne Innenverkleidung (0€ all sizes)
- Row 24: Fichte (existing prices)
- Row 25: Lärche (existing prices)
- Row 26: Eiche (existing prices)

---

## 🔧 Code Changes Made

### **1. pricing-sheet-service.ts**

**Added mapping** (line 275):
```typescript
const optionMapping: Record<string, string> = {
  'ohne innenverkleidung': 'ohne_innenverkleidung', // NEW
  'eiche': 'steirische_eiche',
  'fichte': 'fichte',
  'laerche': 'laerche',
  'lärche': 'laerche',
};
```

**Updated row range** (line 282):
```typescript
for (let rowIndex = 22; rowIndex <= 25; rowIndex++) {
  // Now parses rows 23-26 (0-indexed: 22-25)
}
```

---

### **2. configuratorData.ts**

**Added Standard option** (lines 148-153):
```typescript
{
  id: 'ohne_innenverkleidung',
  name: 'Standard',
  description: 'Keine Innenverkleidung\nRohbau',
  price: { type: 'included', amount: 0 } // New baseline
}
```

**Updated existing options** (now show as upgrades):
```typescript
{
  id: 'fichte',
  name: 'Fichte',
  price: { type: 'upgrade', amount: 23020, monthly: 96 } // Was 'standard'
},
{
  id: 'laerche', 
  name: 'Lärche',
  price: { type: 'upgrade', amount: 31921, monthly: 133 } // Updated amount
},
{
  id: 'steirische_eiche',
  name: 'Steirische Eiche', 
  price: { type: 'upgrade', amount: 38148, monthly: 159 } // Updated amount
}
```

---

### **3. PriceCalculator.ts**

**Updated combination price calculation** (lines 340-343):
```typescript
// Get innenverkleidung RELATIVE price (baseline: ohne_innenverkleidung = 0€)
const innenverkleidungPrice = pricingData.innenverkleidung[innenverkleidung]?.[nestSize] || 0;
const ohneInnenverkleidungPrice = pricingData.innenverkleidung.ohne_innenverkleidung?.[nestSize] || 0;
const innenverkleidungRelative = innenverkleidungPrice - ohneInnenverkleidungPrice;
```

**Updated total calculation** (line 351):
```typescript
// Changed from innenverkleidungPrice (absolute) to innenverkleidungRelative
return nestPrice + gebaeudehuelleRelative + innenverkleidungRelative + bodenbelagRelative;
```

**Updated defaults** (lines 377-379, 460, 807, 719):
```typescript
// Changed all references from 'fichte' to 'ohne_innenverkleidung'
const defaultSelections = {
  gebaeudehuelle: 'trapezblech',
  innenverkleidung: 'ohne_innenverkleidung', // NEW DEFAULT
  fussboden: 'ohne_belag'
};
```

---

### **4. SummaryPanel.tsx**

**Updated to use relative pricing** (lines 65-94):
```typescript
// Changed from ABSOLUTE to RELATIVE pricing
const absolutePrice = pricingData.innenverkleidung[innenverkleidungOption]?.[nestSize] || 0;
const baselinePrice = pricingData.innenverkleidung.ohne_innenverkleidung?.[nestSize] || 0;

// Return relative price (ohne_innenverkleidung = 0 baseline)
return absolutePrice - baselinePrice;
```

**Removed special case** (line 398):
```typescript
// Removed: key === "innenverkleidung" special case
// Now follows standard inkludiert/price logic like other categories
```

**Updated baseline reference** (line 163):
```typescript
const baseInnenverkleidung = "ohne_innenverkleidung"; // Was "fichte"
```

---

### **5. ConfiguratorShell.tsx**

**Updated contribution price** (lines 537-542):
```typescript
// Changed from ABSOLUTE to RELATIVE pricing
if (categoryId === "innenverkleidung" && pricingData) {
  const optionPrice = pricingData.innenverkleidung[optionId]?.[nestSize] || 0;
  const baselinePrice = pricingData.innenverkleidung.ohne_innenverkleidung?.[nestSize] || 0;
  return optionPrice - baselinePrice; // Relative to ohne_innenverkleidung
}
```

**Updated baseline reference** (line 1326):
```typescript
const baseInnenverkleidung = "ohne_innenverkleidung"; // Was "fichte"
```

---

### **6. SelectionOption.tsx**

**Removed special handling** (line 92):
```typescript
// Changed: contributionPrice === 0 && categoryId !== "innenverkleidung"
// To: contributionPrice === 0
// Now innenverkleidung Standard can show "inklusive" like other baselines
```

**Removed from belichtungspaket grouping** (line 105):
```typescript
// Changed: categoryId === "belichtungspaket" || categoryId === "innenverkleidung"
// To: categoryId === "belichtungspaket"
// Now innenverkleidung follows standard price display logic
```

---

## ✅ Next Steps

### **Step 1: Update Google Sheet** ⚠️ REQUIRED

1. Open spreadsheet `10FYz4vTgdN-L4k87PYn-59-myGQel20svyJpYliRM38`
2. Go to sheet "Preistabelle_Verkauf"
3. **Insert new row 23** BEFORE current Fichte row
4. Enter values:
   - E23: `Ohne Innenverkleidung`
   - F23-N23: `0` (all nest sizes)

### **Step 2: Run Pricing Sync**

```bash
# Production
curl -X POST "https://nest-haus.vercel.app/api/admin/sync-pricing?password=YOUR_PASSWORD"

# Local (for testing)
curl -X POST "http://localhost:3000/api/admin/sync-pricing?password=YOUR_PASSWORD"
```

### **Step 3: Clear Cache**

```typescript
// In browser console
PriceCalculator.clearAllCaches();
sessionStorage.removeItem('nest-haus-pricing-data');
location.reload();
```

### **Step 4: Verify in UI**

**Test Checklist**:
- [ ] "Standard" option appears FIRST in Innenverkleidung
- [ ] "Standard" is pre-selected by default
- [ ] "Standard" shows "inkludiert" when selected
- [ ] Fichte shows "+23.683€" when not selected
- [ ] Fichte shows "23.683€" when selected (no more special case)
- [ ] Lärche shows correct upgrade price from Standard
- [ ] Eiche shows correct upgrade price from Standard
- [ ] Summary panel shows Standard as "inkludiert"
- [ ] Summary panel shows Fichte/Lärche/Eiche with correct prices
- [ ] Total price is 23,683€ LOWER with Standard vs Fichte selected
- [ ] Cart/Warenkorb correctly transfers configuration
- [ ] Saved sessions load correctly with new option

---

## 🧪 Test Scenarios

### **Test 1: Default Configuration**

**Steps**:
1. Enter konfigurator
2. Select Nest 80
3. Observe default selections

**Expected**:
- Standard (ohne_innenverkleidung) pre-selected
- Shows "inkludiert" in selection box
- Shows "inkludiert" in summary panel
- Base total: 188,619€ (nest) + 15,107€ (light) = 203,726€

### **Test 2: Switch to Fichte**

**Steps**:
1. From Test 1, click Fichte option
2. Observe price changes

**Expected**:
- Fichte now selected
- Shows "23.683€" in selection box (grey, as selected)
- Shows "23.683€" in summary panel
- Total increases by 23,683€ → 227,409€

### **Test 3: Relative Pricing Display**

**With Standard selected**:
- Standard: "inklusive" (grey, selected)
- Fichte: "+23.683€" (black, not selected)
- Lärche: "+31.921€" (upgrade from Standard)
- Eiche: "+38.148€" (upgrade from Standard)

**With Fichte selected**:
- Standard: "-23.683€" (downgrade)
- Fichte: "23.683€" (grey, selected)
- Lärche: "+8.238€" (upgrade from Fichte: 31,921 - 23,683)
- Eiche: "+14.465€" (upgrade from Fichte: 38,148 - 23,683)

### **Test 4: Cart/Warenkorb Transfer**

**Steps**:
1. Configure with Standard (ohne_innenverkleidung)
2. Add to cart
3. Navigate to /warenkorb
4. Verify configuration displays correctly

**Expected**:
- Configuration shows "Standard" or "Ohne Innenverkleidung"
- Price shows as "inkludiert" or 0€
- Total price matches konfigurator
- Can continue checkout flow

---

## 🚨 Potential Issues & Solutions

### **Issue 1: Google Sheet Row Not Added**

**Symptom**: Pricing data fetch fails or returns unexpected values

**Solution**:
1. Verify row 23 exists in sheet
2. Check E23 contains "Ohne Innenverkleidung"
3. Verify F23-N23 all contain 0
4. Re-run pricing sync

### **Issue 2: Old Pricing Data in Cache**

**Symptom**: Standard option not appearing or showing wrong price

**Solution**:
```typescript
// Clear all caches
PriceCalculator.clearAllCaches();
sessionStorage.removeItem('nest-haus-pricing-data');
location.reload();
```

### **Issue 3: Key Mismatch**

**Symptom**: Prices don't match between selection and summary

**Check**:
```bash
# Verify database has correct key
curl "http://localhost:3000/api/pricing/data" | jq '.data.innenverkleidung | keys'

# Should show:
# ["ohne_innenverkleidung", "fichte", "laerche", "steirische_eiche"]
```

### **Issue 4: Old Sessions with Fichte**

**Symptom**: Existing saved configurations break

**Solution**:
- Old sessions with `fichte` as default will still work
- PriceCalculator uses fallbacks for missing selections
- Fichte will now add 23,683€ to price (was included before)
- Consider migration script if needed:

```typescript
// Migration for old sessions
const migrateOldSession = (session) => {
  if (!session.configurationData.innenverkleidung) {
    // Old session had implicit Fichte
    session.configurationData.innenverkleidung = {
      value: 'fichte',
      name: 'Fichte',
      price: 23683,
      category: 'innenverkleidung'
    };
    // Recalculate total
    session.currentPrice = PriceCalculator.calculateTotalPrice(session.configurationData);
  }
};
```

---

## 📁 Files Modified

1. ✅ `src/services/pricing-sheet-service.ts` - Added mapping, updated row range
2. ✅ `src/app/konfigurator/data/configuratorData.ts` - Added Standard option, updated prices
3. ✅ `src/app/konfigurator/core/PriceCalculator.ts` - Changed to relative pricing, updated defaults
4. ✅ `src/app/konfigurator/components/SummaryPanel.tsx` - Removed special case, updated baseline
5. ✅ `src/app/konfigurator/components/ConfiguratorShell.tsx` - Updated contribution logic, baseline
6. ✅ `src/app/konfigurator/components/SelectionOption.tsx` - Removed special handling

---

## 🎨 UI Changes

### **Innenverkleidung Section Display**:

**Option Order** (top to bottom):
1. Standard (ohne_innenverkleidung) - Pre-selected, shows "inklusive"
2. Fichte - Shows "+23.683€" when not selected
3. Lärche - Shows "+31.921€" when not selected
4. Steirische Eiche - Shows "+38.148€" when not selected

### **Summary Panel Display**:

**When Standard Selected**:
```
Nest 80
Startpreis: 188.619€

Trapezblech
RAL 9005 - 3000 x 1142 mm
inkludiert

Standard                          <- NEW
Keine Innenverkleidung Rohbau     <- NEW
inkludiert                        <- NEW

Bodenbelag - Standard
Verlege deinen Boden selbst
inkludiert

... other selections ...

Gesamtpreis: 203.726€
```

**When Fichte Selected**:
```
Nest 80
Startpreis: 188.619€

Trapezblech
RAL 9005 - 3000 x 1142 mm
inkludiert

Fichte                            <- Shows price now
PEFC-Zertifiziert Sicht 1,9 cm
23.683€                           <- No longer special case

... other selections ...

Gesamtpreis: 227.409€
```

---

## 🔄 Migration Strategy

### **For Existing User Sessions**:

**Option A: No Migration** (Recommended)
- Old sessions retain their Fichte selection
- Prices remain accurate (Fichte now adds 23,683€)
- Users who saved with Fichte will see same total price
- New users start with Standard (lower base price)

**Option B: Soft Migration**
- Add migration notice in UI: "Konfiguration wurde aktualisiert"
- Offer to review configuration before proceeding
- Recalculate prices on load

**Option C: Hard Migration**
- Run database migration to add `ohne_innenverkleidung` to old sessions
- Update prices for sessions without innenverkleidung
- Risk: Changes saved configurations

**Recommendation**: Use Option A (no migration) - old sessions are valid, new behavior only affects new configurations.

---

## ✅ Deployment Checklist

### **Pre-Deployment**:
- [x] Code changes committed
- [ ] Google Sheet row 23 added
- [ ] Pricing sync completed
- [ ] UI tested locally
- [ ] Cart transfer tested
- [ ] Existing sessions tested

### **Post-Deployment**:
- [ ] Verify default selection is Standard
- [ ] Test all innenverkleidung options
- [ ] Check summary panel displays correctly
- [ ] Verify cart/warenkorb integration
- [ ] Monitor for errors in production logs
- [ ] Update documentation if needed

---

## 📊 Expected Analytics Impact

### **Base Price Reduction**:
- **Old base** (with Fichte): 212,302€
- **New base** (with Standard): 188,619€
- **Difference**: -23,683€ (11% lower!)

### **Potential Outcomes**:

**Positive**:
- Lower entry price may increase engagement
- Users see clear value in upgrading to Fichte/Lärche/Eiche
- More transparent pricing (optional interior cladding)

**Neutral**:
- Most users will likely still choose Fichte (same final price)
- Total conversion rate may remain similar
- Average order value may stay constant

**Monitor**:
- Selection rates for each innenverkleidung option
- Cart abandonment at this step
- Final conversion rates with/without interior cladding

---

**Status**: Code ready, awaiting Google Sheet update  
**Next Action**: Add row 23 to Google Sheet, then run pricing sync  
**ETA**: 5 minutes after sheet update + sync

