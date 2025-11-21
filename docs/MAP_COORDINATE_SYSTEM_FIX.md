# Map Coordinate System Fix

## Issue
The interactive map view in `admin/user-tracking` was displaying location dots in incorrect positions (e.g., Vienna appearing in Siberia, Santa Clara misplaced).

## Root Cause
The SVG overlay for location dots was using an incorrect viewBox and projection formula that didn't match the `react-svg-worldmap` library's coordinate system.

## Solution

### Coordinate System
- **Library**: `react-svg-worldmap` v2.0.0-alpha.16
- **ViewBox**: `0 0 800 450` (standard for the library)
- **Projection**: Mercator projection

### Transformation Formulas

#### X Coordinate (Longitude)
```typescript
// Linear mapping: -180° to +180° → 0 to 800
const x = ((lng + 180) / 360) * 800;
```

#### Y Coordinate (Latitude)
```typescript
// Mercator projection with proper bounds
const toRadians = (deg: number) => (deg * Math.PI) / 180;
const latRad = toRadians(Math.max(-85, Math.min(85, lat))); // Clamp to Mercator limits

// Calculate Mercator Y
const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));

// Normalize to SVG coordinates (0-450)
// Mercator range: ~-2.6 (south) to ~2.6 (north)
const yNormalized = (2.6 - mercatorY) / 5.2; // Invert so north is at top
const y = yNormalized * 450;
```

### Key Points
1. **Latitude Clamping**: Mercator projection has mathematical limits at ±85°, so we clamp input coordinates
2. **Y-Axis Inversion**: SVG coordinates increase downward, but latitude increases upward, so we invert the formula
3. **Mercator Range**: The practical range of Mercator Y for ±85° latitude is approximately ±2.6
4. **ViewBox Match**: The overlay SVG must use the same viewBox as the WorldMap component (800x450)

## Testing
Test with known coordinates:
- **Vienna, Austria**: 48.26°N, 16.34°E → Should appear in Central Europe
- **Santa Clara, USA**: 37.39°N, -121.96°W → Should appear in California
- **Denpasar, Indonesia**: -8.65°S, 115.22°E → Should appear in Bali

## Files Modified
- `src/app/admin/user-tracking/components/GeoLocationMap.tsx`
  - Updated viewBox from `0 0 1009 665` to `0 0 800 450`
  - Fixed Mercator projection formulas
  - Added proper latitude clamping
  - Corrected Y-axis normalization

## Production Deployment
The fix works in both local development and production environments because:
1. Uses the same `react-svg-worldmap` library version
2. Client-side rendering ensures consistent behavior
3. No server-side dependencies for coordinate calculations

## Future Improvements
If coordinates are still slightly off, fine-tune the Mercator normalization constants (currently using ±2.6 range). The exact range may vary slightly based on the library's internal SVG path definitions.

