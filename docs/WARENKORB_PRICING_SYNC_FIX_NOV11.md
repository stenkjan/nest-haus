# Warenkorb Pricing Sync Fix - November 11, 2025

## 🎯 Critical Issues Fixed

### **Problem Summary:**

The Warenkorb was not properly syncing with the new Google Sheets-based pricing system from the Konfigurator. This caused:

1. ❌ Fichte showing as "inkludiert" instead of 23,020€
2. ❌ Total price showing as 0€ in "Dein Hoam" box
3. ❌ Old/incorrect prices throughout the checkout
4. ❌ "Zum Warenkorb" button not explicitly setting configuration mode

---

## ✅ Solutions Implemented

### **1. Updated `getItemPrice()` Function (Lines 413-604)**

Completely refactored to use the new pricing system from Google Sheets:

#### **Nest Pricing:**
```typescript
// Get RAW nest base price from PriceCalculator.getPricingData()
if (key === "nest" && cartItemConfig?.nest) {
  const pricingData = PriceCalculator.getPricingData();
  const nestSize = cartItemConfig.nest.value as "nest80" | "nest100" | ...;
  const nestBasePrice = pricingData.nest[nestSize]?.price || 0;
  return nestBasePrice; // RAW construction only
}
```

**Result**: Nest 80 now shows 188,619€ (raw construction price)

#### **Innenverkleidung Pricing (ABSOLUTE):**
```typescript
// Get ABSOLUTE price from pricing data (NEVER 0 / "inkludiert")
if (key === "innenverkleidung" && cartItemConfig?.nest && selection.value) {
  const pricingData = PriceCalculator.getPricingData();
  const nestSize = cartItemConfig.nest.value as ...;
  const option = selection.value as "fichte" | "laerche" | "eiche";
  const absolutePrice = pricingData.innenverkleidung[option]?.[nestSize] || 0;
  return absolutePrice; // ABSOLUTE price
}
```

**Result**: 
- Fichte (Nest 80): 23,020€ (NOT "inkludiert")
- Lärche (Nest 80): 31,921€
- Eiche (Nest 80): 37,235€

#### **Gebäudehülle & Fussboden Pricing (RELATIVE):**
```typescript
// Calculate based on actual user selections
const testGebaeudehuelle = cartItemConfig.gebaeudehuelle?.value || "trapezblech";
const testInnenverkleidung = cartItemConfig.innenverkleidung?.value || "fichte";
const testFussboden = cartItemConfig.fussboden?.value || "ohne_belag";

// Calculate combination with current selections
const combinationPrice = PriceCalculator.calculateCombinationPrice(
  currentNestValue,
  testGebaeudehuelle,
  testInnenverkleidung,
  testFussboden
);

// Calculate base (trapezblech + fichte + ohne_belag)
const basePrice = PriceCalculator.calculateCombinationPrice(
  currentNestValue,
  "trapezblech",
  "fichte",
  "ohne_belag"
);

// Return relative price
return Math.max(0, combinationPrice - basePrice);
```

**Result**: 
- Trapezblech: inkludiert (base)
- Lärche exterior: +24,413€ (for Nest 80)
- Standard flooring: inkludiert (base)
- Parkett Eiche: +20,531€ (for Nest 80)

---

### **2. Updated `isItemIncluded()` Function (Lines 606-619)**

Added explicit check to NEVER show innenverkleidung as "inkludiert":

```typescript
const isItemIncluded = (...): boolean => {
  // NEVER show innenverkleidung as "inkludiert" - all options have prices
  if (key === "innenverkleidung") {
    return false;
  }

  // Use the calculated price to determine if item is included
  const calculatedPrice = getItemPrice(key, selection, cartItemConfig);
  return calculatedPrice === 0;
};
```

**Result**: Fichte now shows 23,020€ instead of "inkludiert"

---

### **3. Dynamic Total Calculation in `renderIntro()` (Lines 1044-1081)**

Replaced static `getCartTotal()` with dynamic calculation:

```typescript
// Calculate dynamic total from configuration using new pricing system
let dynamicTotal = 0;
if (configItem && configItem.nest) {
  // Add nest price
  dynamicTotal += getItemPrice("nest", configItem.nest, configItem);

  // Add all other items
  const itemsToSum = [
    "gebaeudehuelle", "innenverkleidung", "fussboden", "bodenaufbau",
    "geschossdecke", "fundament", "pvanlage", "belichtungspaket",
    "stirnseite", "planungspaket", "kamindurchzug"
  ];

  itemsToSum.forEach((key) => {
    if (configItem[key]) {
      dynamicTotal += getItemPrice(key, configItem[key], configItem);
    }
  });
} else {
  dynamicTotal = getCartTotal(); // Fallback
}

const total = dynamicTotal;
```

**Result**: "Dein Hoam" box now shows correct total (e.g., 226,746€ for Nest 80 with defaults)

---

### **4. Check & Vorentwurf Price Update (Line 1248)**

Changed from variable price to fixed 3,000€:

```typescript
// ❌ BEFORE:
{isOhneNestMode ? (
  <span>
    <span className="line-through">3.000 €</span>
    <span>1.500 €</span>
  </span>
) : (
  PriceUtils.formatPrice(GRUNDSTUECKSCHECK_PRICE) // Was 1,500€
)}

// ✅ AFTER:
{PriceUtils.formatPrice(3000)} // Always 3,000€ in overview box
```

**Result**: Check & Vorentwurf shows 3,000€ in "Dein Preis Überblick" box

**Note**: The "Heute zu bezahlen" section still shows the discount:
- 3,000€ (crossed out)
- 1,500€ (discounted price)

---

### **5. Explicit Configuration Mode for "Zum Warenkorb" Button**

#### **CartFooter.tsx:**
```typescript
// ❌ BEFORE:
window.location.href = "/warenkorb";

// ✅ AFTER:
window.location.href = "/warenkorb?mode=configuration";
```

#### **WarenkorbClient.tsx:**
```typescript
// Added new handler for mode=configuration
else if (mode === "configuration") {
  console.log("🏠 URL has configuration mode, setting ohne-nest to FALSE");
  setOhneNestMode(false);
  
  // Update session to mark as normal mode
  fetch("/api/sessions/update-ohne-nest-mode", {
    method: "POST",
    body: JSON.stringify({ sessionId, isOhneNestMode: false })
  });
}
```

**Result**: 
- "Ohne Nest fortfahren" → `/warenkorb?mode=vorentwurf` → ohne-nest = TRUE ✅
- "Zum Warenkorb" → `/warenkorb?mode=configuration` → ohne-nest = FALSE ✅

---

## 📊 Price Comparison: Before vs After

### **Nest 80 Configuration with Defaults:**

| Item | Before (Old System) | After (New System) | Source |
|------|--------------------|--------------------|--------|
| **Nest 80** | Varies | **188,619€** | Google Sheets F11 |
| **Trapezblech** | inkludiert | **inkludiert** (base) | Relative pricing |
| **Fichte** | ❌ inkludiert | ✅ **23,020€** | Google Sheets F24 |
| **Standard** | inkludiert | **inkludiert** (base) | Relative pricing |
| **Ohne Heizung** | inkludiert | **inkludiert** (base) | Relative pricing |
| **Planung Basis** | inkludiert | **inkludiert** | Always free |
| **Belichtungspaket Light** | Old price | **15,107€** | Calculated from fenster data |
| **Total ("Dein Hoam")** | ❌ **0€** | ✅ **226,746€** | Dynamic sum |

---

## 🔧 Technical Details

### **Pricing Architecture:**

```
Warenkorb Display Price = getItemPrice(key, selection, configItem)
                         ↓
                   Uses PriceCalculator methods
                         ↓
                   Fetches from Google Sheets pricing data
                         ↓
                   Returns dynamic, nest-size-dependent price
```

### **Key Changes:**

1. **Nest**: Direct lookup from `pricingData.nest[nestSize].price`
2. **Innenverkleidung**: Direct lookup from `pricingData.innenverkleidung[option][nestSize]`
3. **Gebäudehülle/Fussboden**: Relative calculation using `calculateCombinationPrice`
4. **Total**: Sum of all individual `getItemPrice()` results (not stored `totalPrice`)

### **Why This Matters:**

**Before**: Warenkorb used stored prices from old hardcoded system
**After**: Warenkorb calculates prices dynamically from Google Sheets

This ensures:
- ✅ Prices stay in sync between Konfigurator and Warenkorb
- ✅ Price updates in Google Sheets are reflected immediately
- ✅ Consistent pricing across entire checkout flow
- ✅ Nest-size-dependent pricing works correctly

---

## 🧪 Testing Checklist

### **Configuration Mode (ohne-nest = FALSE):**

1. ✅ Go to Konfigurator
2. ✅ Select Nest 80 (or use defaults)
3. ✅ Click "Zum Warenkorb"
4. ✅ Verify: "Dein Hoam" shows correct total (not 0€)
5. ✅ Verify: Fichte shows 23,020€ (not "inkludiert")
6. ✅ Verify: Check & Vorentwurf shows 3,000€
7. ✅ Verify: All prices match Konfigurator

### **Ohne-Nest Mode (ohne-nest = TRUE):**

1. ✅ Go to Konfigurator
2. ✅ Click "Ohne Nest fortfahren"
3. ✅ Verify: "Dein Hoam" shows "-" (no configuration)
4. ✅ Verify: Only shows Check & Vorentwurf and Planungspaket
5. ✅ Verify: Checkout flow works for vorentwurf only

### **Price Accuracy:**

1. ✅ Nest 80: 188,619€
2. ✅ Fichte: 23,020€ (NEVER "inkludiert")
3. ✅ Trapezblech: inkludiert (base)
4. ✅ Standard: inkludiert (base)
5. ✅ Belichtungspaket Light: 15,107€ (calculated)
6. ✅ Total: Sum of all items

---

## 📝 Files Changed

1. ✅ `src/app/warenkorb/components/CheckoutStepper.tsx`
   - Updated `getItemPrice()` for nest, innenverkleidung, gebaeudehuelle, fussboden
   - Updated `isItemIncluded()` to never show innenverkleidung as inkludiert
   - Updated `renderIntro()` to calculate dynamic total
   - Changed Check & Vorentwurf to show 3,000€

2. ✅ `src/app/konfigurator/components/CartFooter.tsx`
   - Changed "Zum Warenkorb" to use `?mode=configuration`

3. ✅ `src/app/warenkorb/WarenkorbClient.tsx`
   - Added handler for `mode=configuration` parameter
   - Explicitly sets `ohneNestMode = false` for configuration mode

---

## 🎯 Success Criteria

✅ **Prices match Konfigurator** - Same Google Sheets source  
✅ **Fichte shows 23,020€** - Never "inkludiert"  
✅ **Total price correct** - Dynamic calculation from items  
✅ **Check & Vorentwurf: 3,000€** - In Dein Preis Überblick box  
✅ **"Zum Warenkorb" works** - Explicit configuration mode  
✅ **"Ohne Nest fortfahren" works** - Explicit vorentwurf mode  
✅ **Both modes functional** - Configuration and ohne-nest  

---

## 🚀 Result

The Warenkorb now uses the **exact same pricing system as the Konfigurator**, pulling data from Google Sheets and calculating prices dynamically. All prices are in sync, and both checkout flows (with configuration and ohne-nest) work correctly.

**Pricing Priority Preserved**: Konfigurator prices have absolute priority - Warenkorb now uses the same calculation methods to ensure 100% consistency.

