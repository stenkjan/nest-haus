# Testing Instructions - Device Detection Fix v2

## 🎯 What to Test

This fix ensures that DevTools laptop presets (1440px, 1024px) show DESKTOP images, not mobile images.

## 📋 Quick Test Checklist

### Test 1: DevTools Laptop Preset (1440px) ⭐ MAIN TEST
1. Open your site in Chrome on desktop
2. Press **F12** → Click device toolbar (Ctrl+Shift+M)
3. Select: **"Laptop"** (1440x900)
4. **Expected:** Desktop images load
5. **Console should show:** "Device: Desktop"

### Test 2: DevTools Laptop L Preset (1024px) ⭐ MAIN TEST
1. With DevTools open and device toolbar active
2. Select: **"Laptop L"** (1024x768)
3. **Expected:** Desktop images load
4. **Console should show:** "Device: Desktop"

### Test 3: DevTools iPad Preset (768px)
1. Select: **"iPad Mini"** (768x1024)
2. **Expected:** Desktop/Tablet images (not mobile)
3. Width is 768px but should still be desktop

### Test 4: DevTools iPhone Preset (375px)
1. Select: **"iPhone 12 Pro"** (390x844)
2. **Expected:** Desktop images (desktop user agent)
3. Note: Real mobile detection only for actual devices

### Test 5: Real Mobile Device
1. Open site on actual iPhone or Android phone
2. **Expected:** Mobile-optimized images
3. Should have mobile user agent + touch

### Test 6: Normal Desktop Browsing
1. Close DevTools or disable device toolbar
2. Open site normally on desktop
3. **Expected:** Desktop images at full width

## 🔍 What to Look For

### ✅ Success Indicators
- Desktop images load for viewport >= 1024px
- No flickering or image swapping
- Console logs show correct device type
- Images are appropriately sized

### ❌ Failure Indicators
- Mobile images load at 1440px or 1024px viewport
- Console shows "Mobile" for laptop presets
- Images are vertically oriented at laptop sizes
- Aspect ratio looks wrong (vertical instead of horizontal)

## 🖼️ Visual Confirmation

### Desktop Images (Should see at >= 1024px):
- Landscape orientation (16:9 ratio)
- Full width across screen
- High resolution for large displays
- Horizontal/landscape photos

### Mobile Images (Should NOT see at >= 1024px):
- Portrait orientation (9:16 ratio)
- Vertical photos
- Lower resolution
- Optimized for small screens

## 🧪 Test Page

Use the test page for detailed diagnostics:

```bash
# Open test page
open test-device-detection.html
# or navigate to: http://localhost:3000/test-device-detection.html
```

The test page shows:
- Current viewport width
- Device detection result
- All detection signals
- Whether "Critical Fix" is active for viewports >= 1024px

## 📊 Expected Console Logs

### DevTools Laptop (1440px):
```
🖼️ ResponsiveHybridImage: [Image Name]
🖥️ Device: Desktop (width: 1440)
✅ Selected path: /api/blob/desktop-image
```

### DevTools Laptop L (1024px):
```
🖼️ ResponsiveHybridImage: [Image Name]
🖥️ Device: Desktop (width: 1024)
✅ Selected path: /api/blob/desktop-image
```

### Real iPhone:
```
🖼️ ResponsiveHybridImage: [Image Name]
📱 Device: Mobile (width: 390)
✅ Selected path: /api/blob/mobile-image
```

## 🔧 Debugging

If laptop presets still show mobile images:

1. **Check viewport width in console:**
   ```javascript
   console.log(window.innerWidth)
   // Should be >= 1024 for laptop presets
   ```

2. **Check device detection:**
   ```javascript
   // Add to console
   const width = window.innerWidth;
   console.log('Width:', width, 'Should be Desktop:', width >= 1024);
   ```

3. **Verify critical fix is active:**
   - Open test page
   - Look for "CRITICAL FIX ACTIVE" banner
   - Should appear when width >= 1024px

4. **Check browser console for errors:**
   - Look for any JavaScript errors
   - Check network tab for image requests
   - Verify correct image URL is being requested

## ✨ Success Criteria

All of these must pass:

- [x] DevTools Laptop (1440px) shows desktop images
- [x] DevTools Laptop L (1024px) shows desktop images
- [x] Real mobile device shows mobile images
- [x] Normal desktop browsing shows desktop images
- [x] No console errors
- [x] No image flickering or swapping

## 📞 Reporting Issues

If tests fail, please provide:

1. Browser and version (Chrome 120, Firefox 121, etc.)
2. Operating system (Windows 11, macOS 14, etc.)
3. Specific DevTools preset used
4. Screenshot of console logs
5. Screenshot of incorrect image
6. Viewport width when issue occurs

---

**Last Updated:** 2025-11-11  
**Fix Version:** 2.0  
**Critical Test:** DevTools laptop presets at 1024px+ show desktop images
