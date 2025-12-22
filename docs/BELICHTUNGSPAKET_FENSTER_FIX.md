# Belichtungspaket & Fenster Price Display Fix

## Issue

In the admin user-tracking session details, the pricing for `belichtungspaket` and `fenster` was showing incorrectly:

**Before:**

- Belichtungspaket: "inkludiert" (0 EUR)
- Fenster: €700 (shown separately)

**Problem**: This made it appear as if windows were separate from the lighting package, when in reality:

- `belichtungspaket` price is calculated based on: nest size × brightness percentage × fenster material price per m²
- The fenster selection determines the material/quality but its cost is **included** in the belichtungspaket total
- Displaying them separately was confusing and incorrect

## Root Cause

The configuration stores both:

- `belichtungspaket` with the **total calculated price** (brightness level + windows)
- `fenster` with the window type details

The previous display logic treated them as separate line items, showing:

1. Belichtungspaket with its price (or "inkludiert" if 0)
2. Fenster with its price (if > 0)

This was misleading because the fenster cost is already included in the belichtungspaket calculation.

## Solution

**File Modified**: `src/app/admin/user-tracking/components/AllConfigurations.tsx` (lines 457-500)

Changed the display to show:

- **Belichtungspaket** as the main item with the total price
- **Fenster** details shown as a sub-item within the belichtungspaket card (not as a separate price)

### Visual Changes

**New Display Structure:**

```
┌─────────────────────────────────────────────┐
│ Belichtungspaket                      €700  │
│ Medium 16% der ®Hoam Fläche                   │
│ Ausgewogene Belichtung                      │
│ ─────────────────────────────────────────   │
│ Aluminium Hell                              │
│ RAL 9016 - Reinweiß                         │
│ Bis zu 6,0 x 3,2 m                          │
│ 4.7 m²                                      │
└─────────────────────────────────────────────┘
```

The fenster information now appears **inside** the belichtungspaket card with:

- Border separator to distinguish it as a sub-item
- Blue color scheme to match the parent card
- Clear indication it's part of the package (not a separate charge)

## Technical Implementation

```typescript
{/* Belichtungspaket (includes fenster cost) */}
{config.detailedConfiguration.belichtungspaket && (
  <div className="p-3 bg-blue-50 rounded border border-blue-200">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h5 className="font-semibold text-gray-900">
          {config.detailedConfiguration.belichtungspaket.name}
        </h5>
        {config.detailedConfiguration.belichtungspaket.description && (
          <p className="text-xs text-gray-600 mt-1">
            {config.detailedConfiguration.belichtungspaket.description}
          </p>
        )}
        {/* Show fenster details as sub-item */}
        {config.detailedConfiguration.fenster && (
          <div className="mt-2 pt-2 border-t border-blue-200">
            <p className="text-xs font-semibold text-blue-900">
              {config.detailedConfiguration.fenster.name}
            </p>
            {config.detailedConfiguration.fenster.description && (
              <p className="text-xs text-gray-600">
                {config.detailedConfiguration.fenster.description}
              </p>
            )}
            {config.detailedConfiguration.fenster.squareMeters && (
              <p className="text-xs text-blue-700 font-medium">
                {config.detailedConfiguration.fenster.squareMeters} m²
              </p>
            )}
          </div>
        )}
      </div>
      <span className="font-bold text-gray-900 ml-4 whitespace-nowrap">
        {config.detailedConfiguration.belichtungspaket.price === 0
          ? "inkludiert"
          : `€${config.detailedConfiguration.belichtungspaket.price.toLocaleString()}`}
      </span>
    </div>
  </div>
)}
```

## Key Changes

1. **Removed separate fenster card** - No longer displays as its own line item with price
2. **Integrated fenster into belichtungspaket** - Shows as nested content within the package
3. **Visual hierarchy** - Border separator makes it clear fenster is a sub-component
4. **Color coordination** - Uses blue shades to visually group related items
5. **Price clarity** - Only one price shown (the total belichtungspaket price that includes windows)

## Result

The display now accurately represents that:

- Belichtungspaket is a **package** that includes both the brightness level and windows
- The single price shown is the total for both components
- Window specifications are visible but not priced separately
- No confusion about double-counting window costs

## Testing

Verify in session details:

- [ ] Belichtungspaket shows correct total price
- [ ] Fenster details appear within belichtungspaket card (not separate)
- [ ] No separate fenster price displayed
- [ ] Total configuration price is correct (not inflated)
