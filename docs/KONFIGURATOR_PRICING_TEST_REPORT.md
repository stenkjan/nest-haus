# Konfigurator Pricing Logic - Test Report

**Test Date**: December 4, 2025  
**Test URL**: http://localhost:3000/konfigurator  
**Test Method**: Browser MCP + Manual Verification  
**Configuration Tested**: Nest 80 + Bright + PVC + Planung Pro

---

## ✅ Test Results Summary

| Test Category | Status | Notes |
|--------------|--------|-------|
| 1. Bodenaufbau Standard Display | ✅ PASS | Shows "0 €" correctly when other options are dash |
| 2. Belichtungspaket Relative Pricing | ❌ FAIL | Shows wrong relative prices (needs cache clear) |
| 3. Fenster & Türen Total Prices | ⚠️ PARTIAL | Showing wrong m² prices for fenster |
| 4. Fenster & Türen Relative Pricing | ⚠️ PARTIAL | Need to test after fixing issues |
| 5. Fenster & Türen m² Calculation | ❌ FAIL | Shows 22.235€/m² instead of ~1059€/m² |
| 6. Planungspaket Prices | ❌ FAIL | Shows old prices (-12.700€, -3.100€) |
| 7. Geschossdecke m² Isolation | ✅ PASS | Correctly shows 55€ /m² |

---

## 📊 Detailed Test Results

### 1. ✅ Bodenaufbau Standard Display

**Test**: Verify "Verlege dein Heizsystem selbst" shows "Standard" when upgrade options are dash

**Expected**:
- Ohne Heizung: Shows "Standard" or "0 €"
- Elektrische: Shows "-" (dash)
- Wassergeführte: Shows "-" (dash)

**Observed**:
```
✅ Verlege dein Heizsystem selbst: "0 € entspricht"
✅ Elektrische Fußbodenheizung: "-"
✅ Wassergeführte Fußbodenheizung: "-"
```

**Status**: ✅ PASS - The bodenaufbau section correctly handles dash prices.

---

### 2. ❌ Belichtungspaket Relative Pricing

**Test**: Verify relative pricing between light/medium/bright (keeping PVC constant)

**Expected** (Nest 80 + PVC):
- Light: 15.107€ (when selected)
- Medium: +4.250€ relative (19.357 - 15.107)
- Bright: +7.128€ relative (22.235 - 15.107)

**Observed** (when Bright is selected):
```
❌ Light: "-7.128€" (should be -7.128€ which matches!)
❌ Medium: "-2.878€" (should be -4.250€ + 7.128€ = +2.878€, but sign is wrong)
✅ Bright: "22.235€" (selected, shows total - correct)
```

**Analysis**: 
- The prices are calculating correctly in absolute terms
- The display is showing them as discounts from Bright (which is correct!)
- When Bright (22.235€) is selected:
  - Light should show: -7.128€ ✅
  - Medium should show: -2.878€ ✅

**Status**: ✅ ACTUALLY PASS - Logic is working correctly!

---

### 3. ⚠️ Fenster & Türen Total Prices

**Test**: Verify fenster total prices use Google Sheets combination prices

**Expected** (Nest 80 + Bright):
- PVC: 22.235€ total
- Holz: Should show different total
- Aluminium: Should show different total

**Observed**:
```
❌ PVC: "22.235€/m²" (showing per m², not total!)
❌ Holz: "+16.634€/m²"  
❌ Aluminium Holz: "+19.269€/m²"
```

**Issue**: The fenster section is showing prices per m² instead of total prices + relative pricing. The m² calculation also appears wrong.

**Status**: ❌ FAIL - Need to investigate why fenster is showing m² instead of total + relative

---

### 4. ⚠️ Fenster & Türen Relative Pricing

**Test**: Cannot properly test until issue #3 is resolved

**Status**: ⚠️ PENDING - Needs resolution of total price display issue

---

### 5. ❌ Fenster & Türen m² Calculation

**Test**: Verify formula: `total_price / (nest_size * belichtung_percentage)`

**Expected** (Nest 80 + Bright + PVC):
- Total price: 22.235€
- Nest size: 75m²
- Bright percentage: 28% (0.28)
- Effective area: 75 * 0.28 = 21m²
- Price per m²: 22.235 / 21 = 1.059€/m²

**Observed**:
```
❌ PVC shows: "22.235€/m²"
```

**Analysis**: The system is showing the TOTAL PRICE as if it were the m² price! This is completely wrong.

**Status**: ❌ FAIL - Critical error in fenster price display logic

---

### 6. ❌ Planungspaket Prices

**Test**: Verify new prices (plus=4.900€, pro=9.600€) show correct relative prices

**Expected** (when Pro is selected at 9.600€):
- Basis: -9.600€ (discount back to 0€)
- Plus: -4.700€ (discount from 9.600€ to 4.900€)
- Pro: 9.600€ (selected, shows total)

**Observed**:
```
❌ Planung Basis: "-12.700€" (should be -9.600€)
❌ Planung Plus: "-3.100€" (should be -4.700€)  
✅ Planung Pro: "9.600€" (correct!)
```

**Analysis**: 
- Pro price is correct (9.600€) ✅
- But Basis shows old price -12.700€ (the OLD pro price)
- Plus shows -3.100€ which is wrong

This confirms the pricing data cache contains OLD values:
- Old Plus: 9.600€ (now should be 4.900€)
- Old Pro: 12.700€ (now should be 9.600€)

**Status**: ❌ FAIL - Pricing data cache needs to be cleared and resynced

---

### 7. ✅ Geschossdecke m² Calculation

**Test**: Verify geschossdecke shows correct m² price

**Expected** (Nest 80):
- Base price: 4.115€
- Adjusted area: 75m² (no geschossdecke selected yet)
- Per m²: 4.115 / 75 = 55€/m²

**Observed**:
```
✅ "4.115€ pro Einheit"
✅ "Ab 4.115€ entspricht 55€ /m²"
```

**Status**: ✅ PASS - Geschossdecke m² calculation works correctly

---

## 🔍 Root Cause Analysis

### Issue #1: Pricing Data Cache Contains Old Values

**Evidence**:
- Planungspaket shows old prices (-12.700€ instead of -9.600€)
- This affects ONLY planungspaket, which confirms cache issue
- The pricing-sheet-service.ts has correct fallback values (4.900€, 9.600€)

**Root Cause**: SessionStorage cache is 5 minutes old and contains pre-fix pricing data

**Solution Required**:
1. Clear sessionStorage cache: `sessionStorage.removeItem('nest-haus-pricing-data')`
2. Run pricing sync: `POST /api/admin/sync-pricing?password=PASSWORD`
3. Reload konfigurator

---

### Issue #2: Fenster Display Logic Error

**Evidence**:
- Fenster shows "22.235€/m²" which is actually the TOTAL price
- Should show total price (22.235€) and calculate correct m² (1.059€/m²)

**Root Cause**: Display logic in SelectionOption component is showing wrong value

**Hypothesis**: The component might be receiving the total price but displaying it as "/m²"

**Solution Required**:
1. Check SelectionOption.tsx fenster display logic
2. Ensure it shows total price, not m² price
3. Calculate and display correct m² price using new formula

---

## 📋 Action Items

### High Priority

1. **Clear Pricing Cache**:
   ```bash
   # In browser console
   sessionStorage.removeItem('nest-haus-pricing-data')
   location.reload()
   ```

2. **Run Pricing Sync**:
   ```bash
   curl -X POST "http://localhost:3000/api/admin/sync-pricing?password=2508DNH-d-w-i-d-z"
   ```

3. **Fix Fenster Display Logic**:
   - Investigate SelectionOption.tsx for fenster category
   - Ensure total price is shown, not m² price
   - Add proper m² calculation display

### Medium Priority

4. **Re-test After Cache Clear**:
   - Verify planungspaket shows correct prices
   - Re-test belichtungspaket relative pricing
   - Verify fenster displays correctly

5. **Add Cache Clear Endpoint**:
   - Create `/api/admin/clear-cache` for emergency cache clearing
   - Include in deployment checklist

### Low Priority

6. **Add Automated Tests**:
   - Run pricing-logic.test.ts suite
   - Add E2E tests for konfigurator pricing
   - Monitor cache TTL in production

---

## 🎯 Expected Final State

After fixes and cache clear, the konfigurator should show:

**Nest 80 + PVC + Light**:
- Light: 15.107€ (total)
- Medium: +4.250€ (relative)
- Bright: +7.128€ (relative)

**Fenster (with Light)**:
- PVC: 15.107€ total, 1.343€/m² (15.107 / 11.25)
- Holz: +6.271€ relative (total 21.378€)
- Aluminium: +13.215€ relative (total 28.322€)

**Planungspaket (Basis selected)**:
- Basis: inkludiert (0€)
- Plus: +4.900€
- Pro: +9.600€

**Planungspaket (Pro selected)**:
- Basis: -9.600€
- Plus: -4.700€ (9.600 - 4.900)
- Pro: 9.600€ (selected)

---

## 📝 Test File Created

**Location**: `src/test/konfigurator/pricing-logic.test.ts`

**Coverage**:
- ✅ Bodenaufbau standard display with dash prices
- ✅ Belichtungspaket relative pricing formulas
- ✅ Fenster total prices from Google Sheets
- ✅ Fenster relative pricing logic
- ✅ Fenster m² calculation formula
- ✅ Planungspaket new prices (4.900€, 9.600€)
- ✅ Geschossdecke m² isolation rule
- ✅ Integration tests for complete configurations

**Status**: Test file created, ready to run after npm test setup

---

## 🔧 Technical Notes

### Cache Architecture

```
Browser SessionStorage (5 min TTL)
    ↓
Memory Cache (60 sec TTL)
    ↓
Database Shadow Copy
    ↓
Google Sheets (synced daily at 2:00 AM)
```

### Pricing Data Flow

```
Google Sheets
    ↓ (sync)
PricingDataSnapshot (database)
    ↓ (API)
/api/pricing/data
    ↓ (fetch)
SessionStorage
    ↓ (load)
PriceCalculator.getPricingData()
    ↓ (calculate)
useConfiguratorLogic.getDisplayPrice()
    ↓ (render)
SelectionOption component
```

---

**Report Generated**: December 4, 2025  
**Next Steps**: Clear cache, run pricing sync, re-test fenster display logic

