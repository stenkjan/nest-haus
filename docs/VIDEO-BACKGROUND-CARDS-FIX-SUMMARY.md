# Video Background Cards Sizing Fix Summary

## Issues Identified and Fixed

### Issue 1: Cards Don't Scale Proportionally on Screens >2000px
**Problem**: Cards had a fixed max height of 800px, preventing them from scaling proportionally on ultra-wide screens (>2000px). This caused the 4th card to not overlap the right border as intended.

**Root Cause**: Multiple `Math.min()` clauses capping card height at fixed pixel values (800px), plus using a static `70vh` height that didn't scale up for ultra-wide screens.

**Solution**: 
1. Removed the max height limits for desktop (≥1024px)
2. Implemented dynamic viewport height scaling based on screen width:
   - **Normal desktop (1024px-1999px)**: `70vh` (0.7 × viewport height)
   - **Ultra-wide (≥2000px)**: `85vh` (0.85 × viewport height) - 21% larger cards

```typescript
// BEFORE
const cardHeight = Math.min(viewportHeight * 0.7, 800) * heightMultiplier;

// AFTER
const baseHeightVh = width >= 2000 ? 0.85 : 0.7; // Scale up for ultra-wide
const cardHeight = viewportHeight * baseHeightVh * heightMultiplier;
```

**Why 85vh?**: On a 2000px wide screen with typical 16:9 aspect ratio (~1125px height):
- At 70vh: Cards are 787.5px tall
- At 85vh: Cards are 956.25px tall (21% increase)
- This ensures enough cards are visible with the 4th card properly overlapping the right edge

**Affected Locations**:
1. `useEffect` dimension calculations for overlay-text (line ~431)
2. Glass-quote layout sizing (line ~472)
3. Team-card layout sizing (line ~505)
4. Render loop card width calculations (line ~2224)
5. Render loop card height calculations (line ~2301)

### Issue 2: Cards Have Large Left Padding on Tablet (<1000px)
**Problem**: Cards between 768px-1023px (tablet) were getting pushed to the right with excessive left padding.

**Root Cause**: The alignment logic was using legacy variable padding based on breakpoints:
```typescript
centerOffset = containerWidth >= 1600 ? 80 : containerWidth >= 1280 ? 64 : 48;
```

**Solution**: Simplified alignment logic for left-aligned cards to use consistent 48px padding for tablet and desktop:
```typescript
} else if (alignment === "left" && containerWidth >= 768) {
  // Tablet with left alignment: Use consistent 48px padding (no extra offset)
  centerOffset = 48;
} else if (alignment === "left" && containerWidth < 768) {
  // Mobile with left alignment: Use smaller padding for mobile
  centerOffset = 16;
}
```

**Affected Locations**:
1. Initial positioning (line ~340-345)
2. Navigation logic (line ~694-699)
3. Resize handler (line ~589-594)

## Technical Details

### Card Sizing Logic
Video background cards (`overlay-text` layout) use aspect-ratio-based sizing:
- **Ultra-wide Desktop (≥2000px)**: Height = 85vh (0.85 × viewport height)
- **Normal Desktop (1024px-1999px)**: Height = 70vh (0.7 × viewport height)
- **Tablet (768px-1023px)**: Height = min(720px, 75vh) 
- **Mobile (<768px)**: Height = min(600px, 75vh)

Width is calculated from height using aspect ratio:
- **"2x1" cards**: `width = height × 0.6` (portrait)
- **"1x1" cards**: `width = height × 1.2` (wider)

### Alignment System
Three alignment modes:
1. **Static cards (desktop)**: Centered with max-width 1600px
2. **Carousel cards (desktop)**: Left-aligned with 48px padding
3. **Mobile/Tablet**: 
   - Left alignment: 16px (mobile) or 48px (tablet) padding
   - Center alignment: Calculated based on card width

## Screen Size Examples

### Ultra-Wide (2560px × 1440px)
- Viewport height: 1440px
- Card height: `1440 × 0.85 = 1224px`
- Card width (2x1): `1224 × 0.6 = 734.4px`
- Cards visible: `(2560 - 96) / (734.4 + 24) ≈ 3.25` cards
- Result: 4th card partially visible, overlapping right edge ✅

### Normal Desktop (1920px × 1080px)
- Viewport height: 1080px
- Card height: `1080 × 0.7 = 756px`
- Card width (2x1): `756 × 0.6 = 453.6px`
- Cards visible: `(1920 - 96) / (453.6 + 24) ≈ 3.8` cards
- Result: Standard carousel view with partial 4th card ✅

### Large Desktop (2133px × 1142px - from user's example)
- Viewport height: 1142px
- Card height: `1142 × 0.85 = 970.7px` (was 799.4px at 70vh)
- Card width (2x1): `970.7 × 0.6 = 582.42px` (was 479.64px)
- Cards visible: `(2133 - 96) / (582.42 + 24) ≈ 3.36` cards
- Result: Larger cards with better 4th card overlap ✅

## Testing Recommendations

### Test on Multiple Screen Sizes
1. **Ultra-wide (≥2000px)**: Verify cards scale to 85vh and 4th card overlaps right edge
2. **Desktop (1024px-1999px)**: Verify standard carousel behavior at 70vh with 48px left padding
3. **Tablet (768px-1023px)**: Verify cards maintain 48px left padding (not shifted right)
4. **Mobile (<768px)**: Verify cards use 16px left padding

### Test Cases
- [ ] Load `/dein-nest` page
- [ ] Scroll to "Video Background Cards" section  
- [ ] Resize browser from 320px to 2560px width
- [ ] Verify smooth transitions at breakpoints (768px, 1024px, 2000px)
- [ ] Check alignment consistency across all sizes
- [ ] Verify card height increases at 2000px breakpoint

### Expected Behavior
| Screen Width | Card Height | Left Padding | Visual Result |
|-------------|-------------|--------------|---------------|
| <768px | min(600px, 75vh) | 16px | Mobile single card |
| 768px-1023px | min(720px, 75vh) | 48px | Tablet ~2.6 cards |
| 1024px-1999px | 70vh | 48px | Desktop ~3.8 cards |
| ≥2000px | 85vh | 48px | Ultra-wide ~3.25 cards (larger) |

## Files Modified
- `src/components/cards/UnifiedContentCard.tsx`
  - Lines ~340-345: Initial positioning alignment logic
  - Lines ~431-432: Overlay-text desktop sizing (dynamic vh scaling)
  - Lines ~472-473: Glass-quote desktop sizing (dynamic vh scaling)
  - Lines ~505-506: Team-card desktop sizing (dynamic vh scaling)
  - Lines ~589-594: Resize handler alignment logic
  - Lines ~694-699: Navigation alignment logic
  - Lines ~2224-2225: Render loop card width calculations (dynamic vh)
  - Lines ~2301-2302: Render loop card height calculations (dynamic vh)

## Related Components
This fix applies to all layouts that use viewport-based sizing:
- `overlay-text` (video background cards)
- `glass-quote` (quote cards with glass background)
- `team-card` (team member cards)

Standard content cards (`horizontal`, `video`, `text-icon`) are not affected as they use different sizing logic.

## Performance Notes
The dynamic viewport height calculation is efficient:
- Calculated once per resize event
- Uses memoized `stableViewportHeight` to prevent iOS Safari jank
- No additional DOM queries or complex calculations
- Simple conditional (`width >= 2000`) with minimal overhead

