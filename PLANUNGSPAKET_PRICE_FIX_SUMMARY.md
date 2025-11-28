# Planungspaket Price Update Summary

## Issue
The Planungspaket prices in the Warenkorb (shopping cart) were showing **old prices**:
- **Plus**: Showing €9.600 (old) → Should be €4.900 (new)
- **Pro**: Showing €12.700 (old) → Should be €9.600 (new)

## Root Cause
The prices were **hardcoded in multiple constant files** instead of only relying on the Google Sheets pricing service. These hardcoded values were being used as fallbacks and display values in the UI.

## Files Updated

### 1. `/workspace/src/constants/configurator.ts`
**Lines 269-292**: Updated `PLANNING_PACKAGES` array

**Changes:**
- Plus: `price: 4900` (was 9600)
- Plus: `monthly: 26` (was 56) - recalculated for 240 months
- Pro: `price: 9600` (was 12700)
- Pro: `monthly: 50` (was 74) - recalculated for 240 months

**Purpose:** Fallback prices and configurator display values

### 2. `/workspace/src/constants/cardContent.ts`
**Line 608**: Updated Plus package price
```typescript
price: "€4.900,00", // Updated Nov 2025 - NEW: 4900€
```

**Line 627**: Updated Pro package price
```typescript
price: "€9.600,00", // Updated Nov 2025 - NEW: 9600€
```

**Purpose:** Display prices for Planungspakete cards shown throughout the site (Warenkorb, Dein-Part page, etc.)

### 3. `/workspace/src/app/konfigurator/__tests__/SummaryPanel.test.tsx`
**Line 58**: Updated test price
```typescript
price: 9600, // Updated to new pricing (Nov 2025)
```

**Purpose:** Keep tests in sync with new pricing

## Files Already Correct (No Changes Needed)

### 1. `/workspace/src/app/konfigurator/data/configuratorData.ts`
Already had correct prices (lines 309, 315):
- Plus: `amount: 4900`
- Pro: `amount: 9600`

### 2. `/workspace/src/services/pricing-sheet-service.ts`
Already had correct fallback prices (lines 586-587):
- Plus: `4900`
- Pro: `9600`

## Price Calculation Flow

The application has **two layers** of pricing:

### Layer 1: Google Sheets (Primary Source)
- `PricingSheetService` fetches prices from Google Sheets
- Prices are cached for 5 minutes
- Parsed from rows 88-89 in "Preistabelle_Verkauf" sheet

### Layer 2: Hardcoded Constants (Fallback)
- Used when Google Sheets is unavailable
- Used for display in UI components (PlanungspaketeCards)
- **These were outdated and have now been fixed**

## Dynamic Price Recalculation

The checkout component (`CheckoutStepper.tsx` lines 704-735) has **dynamic price recalculation** logic:
```typescript
// For planungspaket, calculate nest-size dependent price using new pricing system
if (key === "planungspaket" && cartItemConfig?.nest) {
  try {
    const pricingData = PriceCalculator.getPricingData();
    if (pricingData && selection.value) {
      // Plus and Pro are nest-size dependent
      if (selection.value === "plus") {
        return pricingData.planungspaket.plus[nestSize] || 0;
      }
      if (selection.value === "pro") {
        return pricingData.planungspaket.pro[nestSize] || 0;
      }
    }
  } catch (error) {
    // Fallback to stored price if calculation fails
    return selection.price || 0;
  }
}
```

**This means:**
- Even if old prices are stored in existing cart items, they will be **recalculated** with new prices when displayed
- Prices are **nest-size dependent** in structure, but currently all nest sizes have the same price
- If Google Sheets fails, it falls back to the hardcoded constants (which are now updated)

## Verification

To verify the fix is working:
1. Clear browser cache and localStorage
2. Navigate to `/warenkorb` or add a configuration to cart
3. In the Planungspakete section, verify:
   - **Plus** shows €4.900
   - **Pro** shows €9.600

## Related Files Not Changed

The following files contain references to `9600` and `12700` but are **NOT related to Planungspaket prices** (they are for Gebäudehülle/building exterior):
- `src/app/konfigurator/data/configuratorData.ts` (lines 102, 108, 114, 120, 315)
- These prices are correct and should remain unchanged

## Next Steps

If prices still show incorrectly after this fix:
1. Check if there are cached pricing snapshots in the database
2. Run the pricing sync cron job to update database: `npm run pricing-sync` (if available)
3. Check if the Google Sheets connection is working: Check logs for "Error fetching pricing sheet"
4. Verify `PriceCalculator.getPricingData()` returns non-null data

## Date of Fix
November 28, 2025
