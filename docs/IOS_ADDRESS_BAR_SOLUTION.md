# iOS Safari Address Bar Solution

## Problem

iOS Safari's dynamic address bar (shows/hides on scroll) causes viewport height changes that break dialog positioning. When dialogs open with one viewport height and the address bar appears during interaction, content gets cropped or misaligned.

## Solution Overview

We created a **stable viewport system** that:

- ✅ Uses Visual Viewport API for accurate measurements
- ✅ Applies only to dialogs (no impact on main configurator)
- ✅ Provides fallbacks for all browsers
- ✅ Prevents background scroll issues

## Implementation

### 1. Hook: `useIOSViewport`

Located: `src/hooks/useIOSViewport.ts`

Provides stable viewport dimensions and iOS detection:

```tsx
const viewport = useIOSViewport();
// Returns: { height, width, isIOS, isIOSSafari }
```

### 2. CSS Utilities

Added to `src/app/globals.css`:

```css
.h-ios-90     /* height: var(--ios-90vh, 90vh) */
.h-ios-85     /* height: var(--ios-85vh, 85vh) */
.top-ios-5    /* top: var(--ios-5vh, 5vh) */
.mt-ios-10    /* margin-top: var(--ios-10vh, 10vh) */
.mt-ios-5     /* margin-top: var(--ios-5vh, 5vh) */
.ios-dialog-container  /* Prevents overscroll bounce */
```

### 3. Updated Components

#### Dialog Component (`src/components/ui/Dialog.tsx`)

- Automatically applies stable viewport to all dialogs
- Enhanced scroll locking for iOS Safari
- Uses Visual Viewport API when available

#### Example Dialog (`src/components/dialogs/PlanungspaketeDialog.tsx`)

```tsx
// BEFORE: Regular vh units (affected by address bar)
<div className="h-[90vh] top-[5vh] mt-[10vh]">

// AFTER: iOS-stable utilities
<div className="h-ios-90 top-ios-5 mt-ios-10 ios-dialog-container">
```

## How to Apply to Other Dialogs

### Step 1: Replace viewport units

```tsx
// Replace these classes:
h-[90vh]  →  h-ios-90
h-[85vh]  →  h-ios-85
top-[5vh] →  top-ios-5
mt-[10vh] →  mt-ios-10
mt-[5vh]  →  mt-ios-5

// Add container class:
+ ios-dialog-container
```

### Step 2: Test on iOS Safari

1. Open dialog on iPhone/iPad Safari
2. Scroll content within dialog
3. Verify content doesn't crop when address bar appears

## Browser Support

- **iOS Safari**: Uses Visual Viewport API for stable dimensions
- **Other iOS browsers**: Falls back to window.innerHeight
- **Desktop/Android**: Uses regular CSS (no changes needed)

## Benefits

✅ **No Address Bar Issues**: Content stays properly sized  
✅ **No Logic Changes**: Configurator functionality unaffected  
✅ **Backward Compatible**: Works on all devices/browsers  
✅ **Performance**: Minimal overhead, only applies when needed  
✅ **Future-Proof**: Uses modern web APIs with fallbacks

## Technical Details

The solution works by:

1. Detecting iOS Safari specifically
2. Using `window.visualViewport` for accurate viewport measurements
3. Setting CSS custom properties (`--ios-vh`, etc.)
4. CSS utilities fall back to regular `vh` on non-iOS devices
5. Enhanced scroll locking prevents unwanted address bar triggers

This ensures dialogs maintain consistent sizing regardless of iOS Safari's dynamic UI changes.
