# Mobile Scroll Improvements for Card Components

This document outlines the comprehensive improvements made to enhance mobile scrolling behavior, particularly for iOS devices, across all card components in the `@cards/` directory.

## Issues Addressed

### 1. **Poor iOS Scrolling Performance**

- Cards didn't snap properly to positions
- Scrolling felt jerky and unresponsive
- No momentum scrolling on iOS devices
- Touch gestures were not optimized

### 2. **Inconsistent Behavior Across Devices**

- Different scrolling behavior between iOS and Android
- Lack of native scroll-snap support
- Missing touch-specific optimizations

### 3. **Hover Effect Clipping Issues**

- Cards getting cut off during hover scale animations
- Overflow containers preventing proper expansion
- Z-index stacking issues with progress indicators

### 4. **iOS Safari Lightbox Height Snapping**

- Lightboxes opening with correct height but snapping smaller when scrolling
- iOS Safari address bar show/hide causing viewport height changes
- `window.innerHeight` changing dynamically during scroll interactions
- Lightbox content getting cropped or misaligned

## Solutions Implemented

### 1. **CSS Scroll Snap Integration**

```css
scroll-snap-type: x mandatory;
scroll-snap-align: start;
scroll-snap-stop: always;
```

- Native browser snapping behavior
- Ensures cards align perfectly after scrolling
- Prevents skipping cards during fast scrolling

### 2. **iOS Momentum Scrolling**

```css
-webkit-overflow-scrolling: touch;
overscroll-behavior-x: contain;
```

- Enables smooth momentum scrolling on iOS
- Prevents bounce effect at scroll boundaries
- Maintains native iOS scroll feel

### 3. **Enhanced Touch Gestures & Smart Snapping**

- **Device-Specific Behavior**:
  - **Mobile (<1024px)**: Smart snapping with visual feedback
  - **Desktop (≥1024px)**: Free scrolling, no forced snapping
- **Mobile-optimized thresholds**: 30px offset, 300px/s velocity
- **Desktop natural scrolling**: Momentum continuation with smooth deceleration
- **Improved drag constraints**: `dragElastic: 0.05` (reduced from 0.1)
- **Disabled drag momentum**: `dragMomentum: false` for precise control

### 4. **Optimized Spring Animations**

```javascript
transition: {
  type: "spring",
  stiffness: 400,    // Increased from 300
  damping: 35,       // Increased from 30
  mass: 0.8,         // Added for smoother feel
}
```

### 5. **Touch-Specific CSS Classes**

- `cards-touch-optimized`: `touch-action: pan-x` for horizontal-only panning
- `cards-no-bounce`: Prevents overscroll bounce on iOS
- `cards-mobile-smooth`: Enhanced transitions for mobile devices

### 6. **Overflow Structure Fix**

```html
<!-- Correct structure for hover effects -->
<div className="overflow-x-clip">
  <div className="overflow-x-hidden" style={{ overflow: "visible" }}>
    <!-- Cards with hover scale animations -->
  </div>
</div>
```

- Maintains proper clipping for horizontal scroll
- Allows vertical expansion for hover effects
- Prevents progress indicator overlap issues

### 7. **iOS Safari Stable Viewport**

```javascript
import { useIOSViewport, getIOSViewportStyles } from "@/hooks/useIOSViewport";

const viewport = useIOSViewport();

// Use stable viewport height instead of window.innerHeight
height: viewport.height * 0.75

// Apply iOS viewport styles to dialog containers
<div style={getIOSViewportStyles(viewport)} className="ios-dialog-container">
```

- **Visual Viewport API**: Uses stable viewport measurements on iOS Safari
- **Prevents address bar issues**: Height remains consistent during scroll
- **Fallback support**: Works on all browsers with appropriate fallbacks
- **Dialog-specific**: Only affects lightbox/dialog components, not main content

## Components Updated

### 1. **SquareTextCard.tsx**

- ✅ CSS scroll-snap implementation
- ✅ iOS momentum scrolling
- ✅ Mobile-optimized drag thresholds
- ✅ Enhanced spring animations
- ✅ Touch gesture improvements

### 2. **ContentCards.tsx**

- ✅ CSS scroll-snap implementation (disabled for static variant)
- ✅ iOS momentum scrolling
- ✅ Mobile-optimized drag thresholds
- ✅ Enhanced spring animations
- ✅ Touch gesture improvements

### 3. **SquareGlassCardsScroll.tsx**

- ✅ CSS scroll-snap implementation
- ✅ iOS momentum scrolling
- ✅ Mobile-optimized drag thresholds
- ✅ Enhanced spring animations
- ✅ Touch gesture improvements

### 4. **ContentCardsGlass.tsx**

- ✅ CSS scroll-snap implementation (disabled for static variant)
- ✅ iOS momentum scrolling
- ✅ Mobile-optimized drag thresholds
- ✅ Enhanced spring animations
- ✅ Touch gesture improvements
- ✅ Maintained working overflow structure

### 5. **PlanungspaketeCards.tsx**

- ✅ CSS scroll-snap implementation
- ✅ iOS momentum scrolling
- ✅ Mobile-optimized drag thresholds (30px offset, 300px/s velocity)
- ✅ Enhanced spring animations with two-stage mobile feedback
- ✅ Touch gesture improvements
- ✅ 70% card threshold for gentle scrolling
- ✅ Desktop vs mobile behavior differentiation (1024px breakpoint)
- ✅ **iOS Safari stable viewport**: Fixed lightbox height snapping issue
- ✅ **Visual Viewport API**: Prevents address bar resize problems

## New CSS File: `mobile-scroll-optimizations.css`

### Key Features:

- **Scrollbar hiding**: Cross-browser compatible
- **iOS touch optimizations**: Native momentum scrolling
- **Scroll snap behavior**: Native snapping support
- **Touch gesture improvements**: Horizontal-only panning
- **Reduced motion support**: Respects user preferences
- **Mobile-specific transitions**: Optimized for touch devices

## Performance Improvements

### Before:

- ❌ Jerky scrolling on iOS
- ❌ Confusing snapping without visual feedback
- ❌ Desktop snapping interfered with browser scrolling
- ❌ Inconsistent touch responsiveness
- ❌ Poor user experience on mobile

### After:

- ✅ Smooth momentum scrolling on iOS
- ✅ **Mobile-only smart snapping** with visual feedback
- ✅ **Desktop free scrolling** (no forced snapping)
- ✅ Clear directional feedback when cards change
- ✅ Responsive touch gestures
- ✅ Native-like mobile experience
- ✅ Consistent behavior across devices
- ✅ Proper hover effects without clipping
- ✅ Clean progress indicator positioning

## Testing Recommendations

### iOS Devices:

1. **iPhone Safari**: Test touch scrolling and momentum
2. **iPad Safari**: Test with both touch and Apple Pencil
3. **iOS Chrome**: Verify cross-browser compatibility

### Android Devices:

1. **Chrome Mobile**: Test touch responsiveness
2. **Samsung Internet**: Verify scroll-snap support
3. **Firefox Mobile**: Test momentum scrolling

### Desktop:

1. **Chrome/Safari/Firefox**: Verify drag behavior still works
2. **Touch-enabled laptops**: Test hybrid touch/mouse interaction

## Browser Support

### Scroll Snap:

- ✅ iOS Safari 11+
- ✅ Chrome 69+
- ✅ Firefox 68+
- ✅ Safari 11+
- ✅ Edge 79+

### Touch Optimizations:

- ✅ iOS Safari (all versions)
- ✅ Android Chrome/WebView
- ✅ Modern mobile browsers

## Future Enhancements

### Potential Additions:

1. **Haptic feedback** for iOS devices on card snap
2. **Intersection Observer** for lazy loading optimization
3. **Gesture recognition** for advanced swipe patterns
4. **Performance monitoring** for scroll metrics

### Accessibility:

- ✅ Respects `prefers-reduced-motion`
- ✅ Keyboard navigation preserved
- ✅ Screen reader compatibility maintained

## Usage Notes

### Automatic Application:

- All optimizations are automatically applied when importing card components
- No additional configuration required
- CSS classes are applied conditionally based on component type

### Customization:

- Modify `mobile-scroll-optimizations.css` for project-specific adjustments
- Adjust threshold values in component files for different sensitivity
- Spring animation parameters can be tuned per component

## Troubleshooting

### If scrolling still feels choppy:

1. Check if `will-change: transform` is needed for complex layouts
2. Verify no conflicting CSS is overriding scroll behavior
3. Test with different `stiffness` and `damping` values

### If cards don't snap properly:

1. Ensure `scroll-snap-align: start` is applied to card elements
2. Check that container has `scroll-snap-type: x mandatory`
3. Verify card widths are consistent

### If touch gestures are unresponsive:

1. Check `touch-action: pan-x` is applied
2. Verify no parent elements are preventing touch events
3. Adjust velocity and offset thresholds in `handleDragEnd`

---

_Last updated: December 2024_
_Components affected: SquareTextCard, ContentCards, SquareGlassCardsScroll, ContentCardsGlass_
