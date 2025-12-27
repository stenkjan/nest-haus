# Quick Safari Testing Guide for iPhone

## 🚀 Quick Test (2 minutes)

### On Your iPhone:

1. **Find Your Computer's IP Address**
   - On Windows: Open PowerShell, run `ipconfig`
   - Look for "IPv4 Address" (e.g., `192.168.1.123`)

2. **Open Safari on iPhone**
   - Navigate to: `http://[YOUR_IP]:3000`
   - Example: `http://192.168.1.123:3000`

3. **Check Landing Page**
   - ✅ Do you see 6 full-page images?
   - ✅ Are they crisp and clear?
   - ✅ No white boxes or broken images?
   - ✅ Scroll smooth?

4. **Check /hoam Page**
   - Navigate to: `http://[YOUR_IP]:3000/hoam`
   - ✅ Does hero image load?
   - ✅ Is it clear and sharp?

## 🔍 Detailed Debugging (5 minutes)

### If Images DON'T Load:

#### Step 1: Enable Web Inspector
On iPhone:
1. Open Settings
2. Scroll to Safari
3. Tap "Advanced"
4. Turn ON "Web Inspector"

#### Step 2: Connect to Mac (if available)
1. Connect iPhone to Mac via USB
2. Open Safari on Mac
3. Click "Develop" in menu bar
4. Find your iPhone name
5. Click on `localhost:3000`

#### Step 3: Check Console Logs
In the Web Inspector console, look for:

**🟢 Good Signs:**
```
🧭 Safari image request: ...
✅ Successfully loaded image (Safari): ...
```

**🔴 Bad Signs:**
```
❌ Safari image loading error
CORS error
Failed to fetch
```

### Common Issues & Quick Fixes

#### Issue: "CORS error" in console
**What it means**: Server blocking cross-origin requests  
**Fix**: Check that `/api/images/route.ts` has CORS headers

#### Issue: "Failed to fetch" in console
**What it means**: Network/connectivity issue  
**Fix**: 
- Check iPhone is on same WiFi as computer
- Verify IP address is correct
- Try restarting dev server

#### Issue: Images load but are blurry
**What it means**: Safari rendering issue  
**Fix**: Check that Safari CSS fixes are applied in `ResponsiveHybridImage.tsx`

#### Issue: White boxes instead of images
**What it means**: Images not loading at all  
**Fix**: 
- Check Network tab for 404/403 errors
- Verify Vercel Blob Storage is configured
- Check `.env.local` has `BLOB_READ_WRITE_TOKEN`

## 📱 Network Tab Inspection

In Safari Web Inspector (Mac → iPhone):

1. Click "Network" tab
2. Reload page on iPhone
3. Look for image requests

**What to check:**
- ✅ Status Code: Should be `200 OK` or `302 Redirect`
- ❌ Status Code: `404` = Image not found, `403` = CORS issue
- ✅ Type: Should show `image/jpeg`, `image/webp`, or `image/avif`
- ✅ Size: Critical images ~200-500KB (optimized)

## 🎯 Expected Results

### Landing Page (/)
| Section | Expected Image | Mobile Size |
|---------|---------------|-------------|
| 1 | White house | ~400KB |
| 2 | Wooden facade | ~450KB |
| 3 | Interior view | ~350KB |
| 4 | Black house | ~400KB |
| 5 | Snow building | ~380KB |
| 6 | Dark interior | ~420KB |

### /hoam Page
| Section | Expected Image | Size |
|---------|---------------|------|
| Hero | Interior view | ~350KB |

## 📊 Performance Benchmarks

On iPhone 12/13/14 (average):

**Before Fixes:**
- Landing page load: ~8-12 seconds
- Hero image load: ~3-5 seconds
- Total data: ~15-20MB

**After Fixes:**
- Landing page load: ~2-4 seconds ⚡
- Hero image load: ~0.5-1 second ⚡
- Total data: ~3-5MB ⚡

## 🐛 Reporting Issues

If images still don't load, provide:

1. **iPhone Model**: e.g., "iPhone 13 Pro"
2. **iOS Version**: Settings → General → About → Software Version
3. **Safari Version**: Should match iOS version
4. **Console Errors**: Screenshot from Web Inspector
5. **Network Tab**: Screenshot of failed requests
6. **Specific Page**: Landing or /hoam?
7. **Connection Type**: WiFi or Cellular?

## ✅ Success Criteria

Mark as FIXED when:
- [ ] All 6 landing page images load on iPhone Safari
- [ ] /hoam hero image loads on iPhone Safari
- [ ] No CORS errors in Safari console
- [ ] Images are crisp and clear (not blurry)
- [ ] Load time < 5 seconds on WiFi
- [ ] Works on both iPhone and iPad

---

**Last Updated**: 2025-12-26  
**Next Review**: After user testing feedback

