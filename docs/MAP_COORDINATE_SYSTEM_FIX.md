# Map Coordinate System Fix

## Problem Description

The interactive map in the User Tracking dashboard (`admin/user-tracking`) was displaying location dots in incorrect positions (e.g., Vienna appearing in Siberia, Indonesia in the Pacific Ocean).

## Root Cause

The `react-svg-worldmap` library applies a transformation to its internal SVG map:

```svg
<g transform="translate(0, 0) scale(0.7125) translate(0, 240)">
  <!-- Map paths here -->
</g>
```

Our overlay SVG (containing the red location dots) was not accounting for this transformation, causing a mismatch between the base map and the overlay coordinates.

## Solution

### 1. Match the ViewBox

Updated the overlay SVG viewBox to match the transformed dimensions:

```tsx
<svg 
  className="absolute inset-0 w-full h-full pointer-events-none"
  viewBox="0 0 1104 513"  // Changed from "0 0 800 450"
  preserveAspectRatio="xMidYMid meet"
>
```

**Calculation:**
- Original map internal size: 960 × ~500
- After `scale(0.7125)`: 684 × ~356
- After `translate(0, 240)`: shifted down 240 units
- Final canvas: 1104 × 513 (to accommodate the scaled + translated content)

### 2. Apply the Same Transform

Wrapped the overlay dots in a `<g>` element with the same transform:

```tsx
<g transform="translate(0, 0) scale(0.7125) translate(0, 240)">
  {/* Location dots here */}
</g>
```

This ensures the overlay coordinates are transformed identically to the base map.

### 3. Use Internal Map Coordinates

Adjusted the coordinate calculations to use the **original internal dimensions** (960 × 500) before the transform:

```tsx
// X: Longitude mapping (-180° to +180° → 0 to 960)
const x = ((city.lng + 180) / 360) * 960;

// Y: Mercator projection
const toRadians = (deg: number) => (deg * Math.PI) / 180;
const latRad = toRadians(Math.max(-85, Math.min(85, city.lat)));
const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));

// Map to 0-500 range (internal height before transform)
const y = (1 - (mercatorY / Math.PI + 1) / 2) * 500;
```

## Key Insights

1. **Mercator Projection**: The map uses the standard Mercator projection formula for latitude conversion
2. **Coordinate Space**: Work in the **pre-transformed** coordinate space (960 × 500), then let the `<g>` transform handle the scaling/translation
3. **Latitude Clamping**: Mercator projection breaks down near the poles, so latitude is clamped to ±85°

## Testing in Production

To verify the fix works in production:

1. Deploy the changes
2. Navigate to `/admin/user-tracking`
3. Switch to "Map View"
4. Check that location dots align with their respective countries/cities
5. Verify top cities (Vienna, etc.) appear in the correct geographic positions

## Files Modified

- `src/app/admin/user-tracking/components/GeoLocationMap.tsx` (lines 238-265)

## Related Issues

- Vienna was appearing in Siberia → Fixed by matching the transform
- Indonesia was in Pacific Ocean → Fixed by correct Mercator Y calculation
- Dots not scaling correctly → Fixed by using internal dimensions (960 × 500) before transform
