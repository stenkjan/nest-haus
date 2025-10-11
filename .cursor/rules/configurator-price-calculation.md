# Configurator Price Calculation Rules

## 🚨 CRITICAL: Dual Price Calculation Paths

The configurator has **TWO SEPARATE** price calculation paths that must be kept in sync:

### 1. Inline Price Calculation (Store updateSelection)

**Location**: `src/store/configuratorStore.ts` lines ~271-286
**Trigger**: When `priceAffectingCategories.includes(item.category)`
**Purpose**: Immediate price calculation during selection updates

```typescript
const selections = {
  nest: newState.configuration.nest || undefined,
  gebaeudehuelle: newState.configuration.gebaeudehuelle || undefined,
  // ... ALL OPTIONS MUST BE INCLUDED HERE
  bodenaufbau: newState.configuration.bodenaufbau || undefined,
  geschossdecke: newState.configuration.geschossdecke || undefined,
  fundament: newState.configuration.fundament || undefined,
};
```

### 2. Main Price Calculation (Store calculatePrice)

**Location**: `src/store/configuratorStore.ts` lines ~452+
**Trigger**: Called by various functions
**Purpose**: Full price recalculation

```typescript
const selections = {
  // ... ALL OPTIONS MUST BE INCLUDED HERE TOO
};
```

## ⚠️ MANDATORY STEPS When Adding New Configurator Sections

### Step 1: Add to priceAffectingCategories Array

```typescript
const priceAffectingCategories = [
  "nest",
  "gebaeudehuelle",
  "innenverkleidung",
  "fussboden",
  "belichtungspaket",
  "pvanlage",
  "fenster",
  "stirnseite",
  "planungspaket",
  "bodenaufbau",
  "geschossdecke",
  // ADD NEW SECTIONS HERE
];
```

### Step 2: Add to BOTH selections Objects

1. **Inline selections** (~line 271)
2. **Main calculatePrice selections** (~line 452)

### Step 3: Add to PriceCalculator.calculateTotalPrice

**Location**: `src/app/konfigurator/core/PriceCalculator.ts`

- Add calculation logic in `calculateTotalPrice` method
- Create dedicated calculation method if needed
- Update `getPriceBreakdown` method

### Step 4: Update Configuration Interface

**Location**: `src/store/configuratorStore.ts`

- Add new option to `Configuration` interface
- Update `updateSelection` or `updateCheckboxOption` as needed

### Step 5: Update Warenkorb Integration

**Location**: Multiple warenkorb files

- Add new sections to display filters in `CheckoutStepper.tsx` and `WarenkorbClient.tsx`
- Update `PriceUtils.sortConfigurationEntries` middleOrder array
- Add new sections to `getCategoryDisplayName` functions (both files)
- Update comparison logic in `WarenkorbClient.tsx` for cart item matching
- **CRITICAL**: Add quantity-based price calculation for sections with quantities (e.g., `geschossdecke`)
- **CRITICAL**: Add new sections to `configChanged` detection logic in `WarenkorbClient.tsx`
- **CRITICAL**: Add dynamic price calculation for size-dependent options (`bodenaufbau`, `fundament`) in `CheckoutStepper.tsx`

## 🔍 Debugging Price Issues

### Common Symptoms:

- Selection updates correctly but price doesn't change
- Console shows `undefined` in PriceCalculator logs
- Price calculation is skipped

### Debug Steps:

1. Check if new section is in `priceAffectingCategories`
2. Verify both `selections` objects include the new option
3. Add debug logs to trace the calculation flow
4. Check PriceCalculator has the calculation logic

### Debug Logs to Add:

```typescript
console.log('🔧 DEBUG: Selections for price calc:', selections);
console.log('🔧 DEBUG: [SECTION] in store:', state.configuration.[SECTION]);
```

## 📋 Price Calculation Flow

1. User selects option → `updateSelection` called
2. Configuration updated in store
3. If section in `priceAffectingCategories` → **Inline calculation**
4. Otherwise → **Main calculatePrice** function
5. `PriceCalculator.calculateTotalPrice` processes selections
6. Price updated in store and UI

## 🎯 Key Files for Price Logic

- `src/store/configuratorStore.ts` - Store logic and selections building
- `src/app/konfigurator/core/PriceCalculator.ts` - Price calculation logic
- `src/constants/configurator.ts` - Price constants and dynamic calculations
- `src/app/konfigurator/data/configuratorData.ts` - Section definitions

## 💡 Pro Tips

- Always test both selection paths when adding new sections
- Use consistent naming between store, calculator, and data files
- Dynamic pricing should use `calculateSizeDependentPrice` function
- Checkbox options use `updateCheckboxOption`, regular selections use `updateSelection`
