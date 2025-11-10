# Konfigurator & Warenkorb Refactoring Plan

**Date**: 2025-01-04
**Branch**: `refactor-konfigurator-warenkorb-ejR7D`

## Overview

This document outlines the refactoring tasks to improve the konfigurator and warenkorb functionality, focusing on UI improvements, pricing adjustments, and overlay behavior fixes.

---

## 1. Remove Fenster & Türen Overlay

**Priority**: Medium
**Affected Files**:

- `src/app/konfigurator/components/ConfiguratorShell.tsx` (likely contains overlay logic)
- Search for: `FensterOverlay`, `TürenOverlay`, or similar components

**Implementation**:

1. Locate the overlay component that displays when clicking through fenster & türen options
2. Remove or disable the overlay rendering
3. Ensure fenster selection still works without the overlay

**Testing**:

- Click through fenster options - no overlay should appear
- Verify fenster selection still updates correctly in preview

---

## 2. Add Descriptive Text Under Fundament

**Priority**: Low
**Affected Files**:

- `src/app/konfigurator/data/configuratorData.ts` (add description text)
- Or component rendering fundament section

**Implementation**:

1. Add descriptive text to fundament category definition
2. Ensure text displays below fundament selection options

**Testing**:

- Navigate to fundament section
- Verify descriptive text appears below options

---

## 3. Planungspaket Basis = "inkludiert" (Revert from 10.900€)

**Priority**: HIGH - Affects pricing calculations
**Affected Files**:

- `src/constants/configurator.ts` (PLANNING_PACKAGES)
- `src/app/konfigurator/data/configuratorData.ts` (planungspaket options)
- `src/app/konfigurator/core/PriceCalculator.ts` (calculateTotalPrice, getPriceBreakdown)
- `src/store/configuratorStore.ts` (initial configuration, setDefaultSelections)
- `src/app/warenkorb/components/CheckoutStepper.tsx` (all planungspaket price displays)
- `src/app/konfigurator/components/SummaryPanel.tsx` (price display)

**Current State**:

- Planungspaket Basis price: 10.900€
- Total minimum config: 169.200€ (155.500 + 2.800 + 10.900)

**Target State**:

- Planungspaket Basis price: 0€ (inkludiert)
- Total minimum config: 158.300€ (155.500 + 2.800 + 0)

**Implementation Steps**:

### 3.1 Update PLANNING_PACKAGES constant

```typescript
// src/constants/configurator.ts
export const PLANNING_PACKAGES = [
  {
    value: "basis",
    name: "Basis",
    description:
      "Grundplanung und Einreichung\nStandard-Grundriss\nBaubegleitung Basis",
    price: 0, // Changed from 10900
    monthly: 0, // Changed from 63
  },
  // ... rest unchanged
];
```

### 3.2 Update configuratorData

```typescript
// src/app/konfigurator/data/configuratorData.ts
{
  id: 'basis',
  name: 'Planung Basis',
  description: 'Einreichplanung (Raumteilung)\nFachberatung und Baubegleitung',
  price: { type: 'included', amount: 0, monthly: 0 } // Changed from upgrade/10900
}
```

### 3.3 Update PriceCalculator

```typescript
// src/app/konfigurator/core/PriceCalculator.ts - line 261-263
// Add planungspaket price (fixed price independent of nest module)
if (selections.planungspaket) {
  additionalPrice += selections.planungspaket.price || 0; // Will be 0 for basis
}

// In getPriceBreakdown - line 607-612
// Only add to breakdown if price > 0
if (selections.planungspaket && selections.planungspaket.price > 0) {
  breakdown.options.planungspaket = {
    name: selections.planungspaket.name,
    price: selections.planungspaket.price,
  };
}
```

### 3.4 Update configuratorStore defaults

```typescript
// src/store/configuratorStore.ts - line 124-129, 667-674
planungspaket: {
  category: 'planungspaket',
  value: 'basis',
  name: 'Planung Basis',
  price: 0 // Changed from 10900
}
// Update initial totalPrice and currentPrice to exclude planungspaket
```

### 3.5 Update warenkorb displays

```typescript
// src/app/warenkorb/components/CheckoutStepper.tsx
// Line 1206-1208 - Change back to "inkludiert"
{
  selectedPlanValue === "basis"
    ? "inkludiert"
    : PriceUtils.formatPrice(selectedPlanPrice);
}

// Line 2911-2912 - Change back to "inkludiert"
if (planValue === "basis") {
  return "inkludiert";
}
```

### 3.6 Remove migration code

```typescript
// src/store/configuratorStore.ts - line 810-825
// Remove or update the planungspaket price migration since we're reverting to 0
```

**Testing**:

- Fresh konfigurator load should show total: 158.300€
- Planungspaket Basis should show "inkludiert" everywhere
- Switching to Plus/Pro should add their respective prices
- Warenkorb should show planungspaket basis as "inkludiert"

---

## 4. Fix Geschossdecke Overlay Behavior

**Priority**: Medium
**Affected Files**:

- `src/app/konfigurator/components/ConfiguratorShell.tsx` (overlay state management)
- `src/app/konfigurator/components/GeschossdeckeOverlay.tsx` (if exists)

**Current Behavior**:

- Geschossdecke overlay stays visible when innenverkleidung/fussboden changes
- User can't see the interior changes

**Target Behavior**:

- Hide geschossdecke overlay when innenverkleidung or fussboden is changed
- Show geschossdecke overlay again when geschossdecke is activated/changed

**Implementation**:

```typescript
// In ConfiguratorShell.tsx or relevant component
useEffect(() => {
  // When innenverkleidung or fussboden changes, hide geschossdecke overlay
  if (
    lastSelectionCategory === "innenverkleidung" ||
    lastSelectionCategory === "fussboden"
  ) {
    setShowGeschossdeckeOverlay(false);
  }
  // When geschossdecke changes, show overlay again
  if (lastSelectionCategory === "geschossdecke") {
    setShowGeschossdeckeOverlay(true);
  }
}, [
  configuration.innenverkleidung,
  configuration.fussboden,
  configuration.geschossdecke,
  lastSelectionCategory,
]);
```

**Testing**:

- Activate geschossdecke overlay
- Change innenverkleidung → overlay should hide
- Change fussboden → overlay should hide
- Change geschossdecke → overlay should show again

---

## 5. Remove Planungspaket Step in Ohne Nest Mode

**Priority**: Medium
**Affected Files**:

- `src/app/warenkorb/components/CheckoutStepper.tsx` (step rendering logic)

**Implementation**:

```typescript
// In CheckoutStepper.tsx
// Wrap planungspaket step section with condition:
{!isOhneNestMode && (
  <div className="planungspaket-step-section">
    {/* Existing planungspaket selection UI */}
  </div>
)}
```

**Testing**:

- Normal mode: planungspaket step should appear
- Ohne nest mode: planungspaket step should be hidden

---

## 6. Add "kurz" to Dein Nest Überblick Box

**Priority**: Low
**Affected Files**:

- `src/app/warenkorb/components/CheckoutStepper.tsx` (Dein Nest Überblick section)

**Implementation**:

1. Find "Dein Nest Überblick" heading
2. Add "kurz" text with same divider styling as "Dein Nest-Haus"

**Example**:

```tsx
<h2 className="h2-secondary text-gray-900 mb-4">
  Dein Nest Überblick <span className="text-gray-400">|</span> kurz
</h2>
```

**Testing**:

- Check warenkorb overview - "kurz" should appear after divider

---

## 7. Update Check & Vorentwurf Price (3.000€ → 1.500€)

**Priority**: HIGH - Affects pricing
**Affected Files**:

- `src/app/warenkorb/components/CheckoutStepper.tsx` (all Check & Vorentwurf price displays)

**Current**: Shows "1.000 €"
**Target**: Show "3.000 €" crossed out (left), "1.500 €" action price (right)

**Implementation Pattern**:

```tsx
<div className="flex items-center gap-3">
  <span className="text-gray-400 line-through">3.000 €</span>
  <span className="text-gray-900 font-medium">1.500 €</span>
</div>
```

**Locations to Update**:

1. Warenkorb Übersicht - "Vorentwurf & Check" row
2. Ohne nest mode pricing display
3. Any other Check & Vorentwurf references

**Testing**:

- All Check & Vorentwurf prices show crossed out 3.000€ with 1.500€ action price
- Colors are black (not green/blue)

---

## 8. Update Heute zu bezahlen Price (1.000€ → 1.500€)

**Priority**: HIGH - Affects payment flow
**Affected Files**:

- `src/app/warenkorb/components/CheckoutStepper.tsx` (all "heute zu bezahlen" instances)

**Current**: Shows "1.000 €"
**Target**: Show "3.000 €" crossed out (left indent), "1.500 €" action price (right)

**Implementation Pattern**:

```tsx
<div className="flex items-center gap-3 justify-end">
  <span className="text-gray-400 line-through">3.000 €</span>
  <span className="text-3xl font-bold text-gray-900">1.500 €</span>
</div>
```

**Locations to Update** (from previous grep results):

1. Line ~1298: Overview section "Heute zu bezahlen"
2. Line ~2575: Payment box (non-ohne-nest mode)
3. Line ~2624: Centered payment box (ohne-nest mode)
4. Line ~2580: Completed payment display (italic green)
5. Line ~3013-3017: Final payment section

**Testing**:

- All "heute zu bezahlen" instances show 3.000€ crossed out + 1.500€
- Both active and completed payment states updated
- Colors are black (not green except for "Bezahlt" state)

---

## 9. Verify Total Price Calculations

**Priority**: CRITICAL - Must be accurate
**Affected Files**:

- All files modified in tasks 3, 7, 8

**Expected Prices After Changes**:

### Minimum Configuration (Default):

- Nest 80: 155.500€
- Belichtungspaket Light (PVC): 2.800€
- Planungspaket Basis: 0€ (inkludiert)
- **TOTAL: 158.300€**

### Ohne Nest Mode:

- Check & Vorentwurf: 1.500€ (shown as 3.000€ crossed out)
- Heute zu bezahlen: 1.500€ (shown as 3.000€ crossed out)

**Testing Checklist**:

- [ ] Konfigurator right panel shows 158.300€ for default config
- [ ] Konfigurator cart footer shows 158.300€
- [ ] Warenkorb "Dein Preis Überblick" sums to 158.300€
- [ ] Individual items in warenkorb match expected prices
- [ ] Price per m² correctly calculated (158.300€ / 75m² = 2.110,67€/m²)
- [ ] Ohne nest mode shows 1.500€ (3.000€ crossed out)
- [ ] Changing planungspaket to Plus/Pro adds correct amount
- [ ] All price breakdowns match total sum

---

## 10. Test Mit/Ohne Nest Distinction

**Priority**: HIGH - Core functionality
**Testing Scenarios**:

### Mit Nest (Normal Flow):

1. Configure nest in konfigurator
2. Click "Zum Warenkorb"
3. Verify full configuration shown
4. Verify planungspaket basis shows "inkludiert"
5. Verify total matches konfigurator price

### Ohne Nest (Vorentwurf Flow):

1. Go to `/konfigurator2` or click "Direkt zum Vorentwurf"
2. Navigate to warenkorb with `?mode=vorentwurf`
3. Verify "Dein Nest Deine Auswahl" boxes hidden
4. Verify planungspaket step hidden
5. Verify Check & Vorentwurf shows 1.500€ (3.000€ crossed out)
6. Verify "heute zu bezahlen" shows 1.500€ (3.000€ crossed out)
7. Verify "Jetzt bezahlen" button hidden

---

## Implementation Order

### Phase 1: Pricing Foundation (Do First)

1. ✅ Task 3: Revert planungspaket basis to inkludiert (0€)
2. ✅ Task 9: Verify total price calculations

### Phase 2: Warenkorb Price Updates

3. ✅ Task 7: Update Check & Vorentwurf to 1.500€ (3.000€ crossed)
4. ✅ Task 8: Update Heute zu bezahlen to 1.500€ (3.000€ crossed)

### Phase 3: UI/UX Improvements

5. ✅ Task 4: Fix Geschossdecke overlay behavior
6. ✅ Task 1: Remove Fenster & Türen overlay
7. ✅ Task 5: Remove planungspaket step in ohne nest mode
8. ✅ Task 6: Add "kurz" to Dein Nest Überblick
9. ✅ Task 2: Add fundament description text

### Phase 4: Final Testing

10. ✅ Task 10: Test mit/ohne nest distinction thoroughly

---

## Files to Review Before Starting

### Critical Price Calculation Files:

- `src/app/konfigurator/core/PriceCalculator.ts`
- `src/constants/configurator.ts`
- `src/store/configuratorStore.ts`

### Display/UI Files:

- `src/app/konfigurator/components/SummaryPanel.tsx`
- `src/app/konfigurator/components/CartFooter.tsx`
- `src/app/warenkorb/components/CheckoutStepper.tsx`

### State Management:

- `src/store/configuratorStore.ts`
- `src/store/cartStore.ts`

---

## Rollback Strategy

If issues arise:

1. Revert pricing changes first (tasks 3, 7, 8)
2. Keep UI improvements (tasks 1, 2, 4, 5, 6) - they're independent
3. Branch structure allows easy rollback to previous commit

---

## Post-Implementation Checklist

- [ ] Run `npm run lint` - no errors
- [ ] Test default configuration loads correctly
- [ ] Test all price calculations match expected totals
- [ ] Test mit nest flow (full configurator → warenkorb)
- [ ] Test ohne nest flow (konfigurator2 → warenkorb)
- [ ] Verify session tracking still works
- [ ] Verify Stripe payment integration unaffected
- [ ] Test on mobile/tablet breakpoints
- [ ] Verify SEO metadata unchanged
- [ ] Clear browser cache and test fresh session
- [ ] Deploy to staging for full testing

---

## Notes

- Keep all existing session tracking logic intact
- Maintain distinction between mit/ohne nest modes
- Preserve Stripe payment flow
- Don't modify SSR/performance optimizations
- Keep all accessibility features (WCAG compliance)

---

**End of Refactoring Plan**
