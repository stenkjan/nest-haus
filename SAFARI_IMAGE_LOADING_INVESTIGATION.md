# Safari/iPhone Image Loading Investigation

## Problem Report
Images not loading correctly on iPhone Safari, but working on Chrome (desktop and mobile).
Affected pages: Landing page and /hoam page.

## Identified Potential Issues

### 1. Missing CORS Headers ⚠️ HIGH PRIORITY
**Location**: `src/app/api/images/route.ts`, `src/app/api/files/route.ts`
**Issue**: Safari is stricter about CORS than Chrome. API routes don't include CORS headers.

**Current Code**:
```typescript
// No CORS headers set
const jsonResponse = NextResponse.json({
  url: imageUrl,
  path: path,
  type: 'blob'
});
```

**Fix Required**:
```typescript
const jsonResponse = NextResponse.json({
  url: imageUrl,
  path: path,
  type: 'blob'
});
// Add CORS headers for Safari compatibility
jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
```

### 2. Restrictive CSP for SVG Placeholders ⚠️ MEDIUM PRIORITY
**Location**: `next.config.ts` line 13
**Issue**: Content Security Policy might be blocking images on Safari

**Current Code**:
```typescript
contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
```

**Concern**: This CSP applies to SVG placeholders but Safari might interpret it more strictly, potentially blocking Vercel Blob Storage images.

**Test**: Try relaxing CSP to see if images load:
```typescript
contentSecurityPolicy: "default-src 'self' https:; script-src 'none'; sandbox;",
```

### 3. Unoptimized Images Flag ⚠️ MEDIUM PRIORITY
**Location**: `src/app/LandingPageClient.tsx` line 259
**Issue**: `unoptimized={true}` bypasses Next.js image optimization

**Current Code**:
```typescript
<ResponsiveHybridImage
  // ... props
  unoptimized={true}  // ← Disables Next.js optimization
  // ...
/>
```

**Concern**: Safari might have issues with unoptimized images, especially:
- Large file sizes
- Unsupported formats
- Missing progressive loading

**Test**: Remove `unoptimized={true}` for critical images and see if Safari loads them.

### 4. Mobile Detection Logic ⚠️ LOW PRIORITY
**Location**: `src/components/images/ResponsiveHybridImage.tsx`
**Issue**: Complex mobile detection might fail on iPhone Safari

**Code Review**:
```typescript
const isMobileUserAgent = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
```

This should work for iPhone, but the combined logic with viewport + touch detection might fail.

**Test**: Add debug logging for iPhone to verify correct path selection.

### 5. Safari Webkit Rendering Issues ⚠️ LOW PRIORITY
**Location**: Image components
**Issue**: Known Safari/WebKit SVG rendering bugs (we've fixed before)

**Known Fix** (from SAFARI_SVG_PIXELATION_FIX.md):
```typescript
style={{
  imageRendering: 'crisp-edges',
  WebkitTransform: 'translateZ(0)',
  transform: 'translateZ(0)',
  WebkitBackfaceVisibility: 'hidden',
  backfaceVisibility: 'hidden',
  WebkitPerspective: 1000,
  perspective: 1000,
}}
```

This is currently applied to SVG overlays but not to main hero images.

### 6. Vercel Blob Storage Access ⚠️ HIGH PRIORITY
**Location**: API routes
**Issue**: Safari might block cross-origin requests to Vercel Blob Storage

**Current Flow**:
1. Client requests `/api/images?path=xxx`
2. API fetches from Vercel Blob Storage
3. API returns JSON with URL
4. Client loads image from Vercel URL

**Potential Issue**: The Vercel Blob URL might not have proper CORS headers for Safari.

**Test**: Try direct redirect instead of JSON response:
```typescript
// Instead of returning JSON, redirect directly to blob
if (redirect || isSafari) {
  return NextResponse.redirect(imageUrl, 302);
}
```

## Recommended Fix Order

### Phase 1: Critical CORS and Headers (Do First)
1. ✅ Add CORS headers to `/api/images/route.ts`
2. ✅ Add CORS headers to `/api/files/route.ts`
3. ✅ Add OPTIONS handler for preflight requests
4. ✅ Test on iPhone Safari

### Phase 2: CSP and Configuration
1. ✅ Relax CSP policy to allow https: sources
2. ✅ Test if images load
3. ✅ If works, gradually tighten CSP to find minimum required

### Phase 3: Image Optimization
1. ✅ Remove `unoptimized={true}` from critical images
2. ✅ Test loading performance
3. ✅ Add Safari-specific image rendering CSS

### Phase 4: Debug Logging
1. ✅ Add iPhone Safari detection
2. ✅ Log image loading attempts
3. ✅ Log any errors in Safari DevTools

## Testing Checklist

### Desktop Testing (Baseline)
- [ ] Chrome Desktop - Landing page images
- [ ] Chrome Desktop - /hoam page images
- [ ] Firefox Desktop - Landing page images
- [ ] Firefox Desktop - /hoam page images

### Mobile Testing (Primary Target)
- [ ] iPhone Safari - Landing page images
- [ ] iPhone Safari - /hoam page images
- [ ] iPhone Safari - Check browser console for errors
- [ ] iPhone Safari - Check network tab for failed requests

### Debug Steps for iPhone Safari
1. Open Safari Developer Tools (Settings → Advanced → Web Inspector)
2. Connect iPhone to Mac
3. Open Safari → Develop → [iPhone Name] → [Page]
4. Check Console for JavaScript errors
5. Check Network tab for:
   - Failed image requests (404, 403, CORS errors)
   - Slow loading times
   - Blocked resources

## Common Safari Image Loading Issues

### Issue A: CORS Preflight Failure
**Symptoms**: Images don't load, Network tab shows "CORS error"
**Fix**: Add OPTIONS handler and CORS headers

### Issue B: Content-Type Mismatch
**Symptoms**: Images load but don't display
**Fix**: Ensure Vercel Blob returns correct Content-Type header

### Issue C: Cache Invalidation
**Symptoms**: Images load on first visit but not on reload
**Fix**: Check Cache-Control headers and Safari cache behavior

### Issue D: Lazy Loading Not Working
**Symptoms**: Below-fold images never load
**Fix**: Safari's Intersection Observer might behave differently

### Issue E: WebP Support
**Symptoms**: WebP images don't display (older Safari versions)
**Fix**: Ensure fallback to JPEG/PNG for Safari < 14

## Implementation Plan

### Step 1: Add CORS Headers
```typescript
// src/app/api/images/route.ts
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(request: NextRequest) {
  // ... existing code ...
  
  // Add CORS to all responses
  const response = NextResponse.json({ /* ... */ });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  return response;
}
```

### Step 2: Relax CSP
```typescript
// next.config.ts
images: {
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self' https:; script-src 'none'; sandbox;",
  // Allow HTTPS sources ^
}
```

### Step 3: Add Safari Detection
```typescript
// src/components/images/ClientBlobImage.tsx
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (process.env.NODE_ENV === 'development' && isSafari) {
  console.log('🧭 Safari detected - using Safari-compatible image loading');
}
```

### Step 4: Add Error Logging
```typescript
// src/components/images/ClientBlobImage.tsx
.catch((error) => {
  console.error('❌ Image loading error (Safari):', {
    path: effectivePath,
    error: error.message,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });
  throw error;
});
```

## Expected Results

### Before Fix
- ❌ Images not loading on iPhone Safari
- ❌ Possible CORS errors in console
- ❌ White boxes or placeholders shown

### After Fix
- ✅ Images load correctly on iPhone Safari
- ✅ No CORS errors in console
- ✅ Same experience as Chrome

## Related Documentation
- `SAFARI_SVG_PIXELATION_FIX.md` - Previous Safari rendering fixes
- `DEVICE_DETECTION_FIX.md` - Mobile detection improvements
- `docs/performance-rendering-rules.mdc` - Image loading rules

---

**Created**: 2025-12-26  
**Status**: 🔍 Investigation Phase  
**Priority**: 🔴 High - Affects real users

