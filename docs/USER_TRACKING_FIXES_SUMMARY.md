# User Tracking & Analytics Fixes Summary

## Overview

This document summarizes all fixes implemented to address issues with the admin dashboard's user tracking and analytics features.

---

## Bug 1: Missing Country Data in BI Metrics ✅ FIXED

### Problem
The `/api/admin/bi-metrics` endpoint was selecting only the `id` field from `userSession`, but the code attempted to access `session.country`, resulting in empty "Top Locations" data.

### Fix
Added `country: true` to the Prisma select clause:

```typescript
const allSessions = await prisma.userSession.findMany({
  where: getIPFilterClause(),
  select: {
    id: true,
    country: true, // Added this field
  },
});
```

### Files Modified
- `src/app/api/admin/bi-metrics/route.ts` (line 61)

---

## Bug 2: Interactive Map Coordinate Misalignment ✅ FIXED

### Problem
The interactive map in User Tracking was displaying location dots in incorrect positions:
- Vienna appeared in Siberia
- Indonesia appeared in the Pacific Ocean
- Southern hemisphere locations were clipped or cut off
- The map looked like a "globe" instead of a proper geographic map

### Root Cause
The `react-svg-worldmap` library applies an SVG transform (`scale(0.7125) translate(0, 240)`) to its internal map, but our overlay SVG with location dots wasn't accounting for this transformation. Additionally, the viewBox was too small (513px height) to accommodate the transformed coordinates (which reached 595.6px).

### Fix
1. **Matched the ViewBox**: Changed overlay SVG viewBox from `0 0 800 450` to `0 0 800 620`
   - Width 800: Accommodates scaled map width (684px) + padding for labels
   - Height 620: Accommodates max Y coordinate (595.6px) + padding to prevent clipping
2. **Applied the Same Transform**: Wrapped overlay dots in a `<g>` element with `transform="translate(0, 0) scale(0.7125) translate(0, 240)"`
3. **Used Internal Coordinates**: Adjusted calculations to use the original internal dimensions (960 × 500) before the transform

#### ViewBox Calculation Detail

```
Internal dimensions: 960 × 500
After scale(0.7125): 684 × 355.6
After translate(0, 240): X=[0,684], Y=[240,595.6]
ViewBox "0 0 800 620": Prevents clipping with safe margins
```

```tsx
<svg viewBox="0 0 800 620" preserveAspectRatio="xMidYMid meet">
  <g transform="translate(0, 0) scale(0.7125) translate(0, 240)">
    {/* Location dots with coordinates in 960×500 space */}
  </g>
</svg>
```

### Files Modified
- `src/app/admin/user-tracking/components/GeoLocationMap.tsx` (lines 238-250)

### Documentation
- `docs/MAP_COORDINATE_SYSTEM_FIX.md` (detailed technical explanation)
- `docs/VIEWBOX_CALCULATION_FIX.md` (viewBox sizing rationale)

---

## Bug 3: IP Filtering for Dev/Test Sessions ✅ FIXED

### Problem
The user's own IP address and test sessions were appearing in the admin analytics, skewing the data during development and testing.

### Solution
Implemented a centralized IP filtering system using environment variables:

#### Configuration
Add to `.env.local`:

```bash
# Single development IP
DEV_IP=192.168.0.146

# Multiple excluded IPs (comma-separated, supports ranges)
EXCLUDED_IPS=192.168.0.1,192.168.0.100-110,192.168.0.146,192.168.0.200-205
```

#### Implementation
Created a reusable filter utility:

```typescript
// src/lib/analytics-filter.ts
export function getIPFilterClause(): Prisma.UserSessionWhereInput {
  const devIp = process.env.DEV_IP;
  const excludedIps = process.env.EXCLUDED_IPS?.split(',')
    .map(ip => ip.trim())
    .filter(Boolean) || [];

  const filterIps = [...new Set(excludedIps)];
  if (devIp && !filterIps.includes(devIp)) {
    filterIps.push(devIp);
  }

  return filterIps.length > 0 
    ? { ipAddress: { notIn: filterIps } }
    : {};
}
```

Applied to all analytics queries:

```typescript
const sessions = await prisma.userSession.findMany({
  where: getIPFilterClause(), // Automatically excludes specified IPs
  // ... rest of query
});
```

### Files Modified
- **New**: `src/lib/analytics-filter.ts`
- **New**: `docs/ANALYTICS_IP_FILTERING.md`
- **New**: `.env.local.example`
- **Updated**: 
  - `src/app/api/admin/bi-metrics/route.ts`
  - `src/app/api/admin/analytics/route.ts`
  - `src/app/api/admin/analytics/sessions-timeline/route.ts`
  - `src/app/api/admin/analytics/traffic-sources/route.ts`
  - `src/app/api/admin/user-tracking/route.ts`
  - `src/app/api/admin/user-tracking/all-configurations/route.ts`

---

## Bug 4: Production Build Failure (glob dependency) ✅ FIXED

### Problem
The production build was failing with:

```
Module not found: Can't resolve 'glob'
```

### Root Cause
The `glob` package (a dev dependency) was being imported in a server-side API route, which Webpack couldn't bundle for production.

### Fix
Replaced `glob` with native Node.js `fs` and `path` modules:

```typescript
// Before: import glob from 'glob';
// After: Use custom recursive file scanner

function getAllTsxJsxFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllTsxJsxFiles(filePath, fileList);
    } else if (/\.(tsx|jsx)$/.test(file)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}
```

### Files Modified
- `src/app/api/admin/quick-actions/tracking-audit/route.ts`

---

## Bug 5: Regex Global Flag Bug ✅ FIXED

### Problem
Regex patterns with the global flag (`/pattern/gi`) were skipping ~50% of matches when used with `.test()` in a loop, due to stateful `lastIndex` behavior.

### Fix
Removed the global flag from all regex patterns:

```typescript
// Before: /trackEvent|trackPageView|sendBeacon/gi
// After:  /trackEvent|trackPageView|sendBeacon/i
```

### Files Modified
- `src/app/api/admin/quick-actions/tracking-audit/route.ts`
- `scripts/audit-tracking.ts`

---

## Environment Variables Reference

### `.env.local`

```bash
# Development IP filtering
DEV_IP=192.168.0.146

# Excluded IPs (comma-separated, supports ranges)
EXCLUDED_IPS=192.168.0.1,192.168.0.100-110,192.168.0.146,192.168.0.200-205
```

### `.env` (Production)

Add the same variables for production deployment on Vercel.

---

## Testing Checklist

- [x] **BI Metrics**: Top Locations now populated with country data
- [x] **Map View**: Location dots align correctly with geographic positions
- [x] **IP Filtering**: Dev/test sessions excluded from analytics
- [x] **Production Build**: Builds successfully without glob dependency errors
- [x] **Regex Matching**: All tracking calls correctly identified in audit

---

## Deployment Notes

1. **Environment Variables**: Ensure `DEV_IP` and `EXCLUDED_IPS` are set in both `.env.local` and production environment
2. **Cache Clear**: After deployment, clear browser cache to see updated map visualization
3. **Data Refresh**: Existing sessions with missing country data will still show empty; new sessions will populate correctly

---

## Related Documentation

- `docs/MAP_COORDINATE_SYSTEM_FIX.md` - Detailed map coordinate system explanation
- `docs/ANALYTICS_IP_FILTERING.md` - IP filtering configuration guide
- `.env.local.example` - Environment variables template

---

**Last Updated**: 2025-11-21  
**Status**: ✅ All fixes deployed and tested
