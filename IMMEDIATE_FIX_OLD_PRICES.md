# IMMEDIATE FIX for Old Prices Issue

## 🚨 Quick Fix Applied

I've made THREE critical changes to force cache invalidation:

### 1. **Increased Cache Version** (Forces invalidation for ALL users)
```typescript
CACHE_VERSION = 3  // Was 2, now 3
```

### 2. **Improved Cache Handling** (Handles old cache formats)
- Now detects old cache without version number
- Forces clear of any mismatched or undefined cache versions
- Better error handling

### 3. **Added URL Parameter Shortcut** (For immediate testing)
You can now force clear cache by visiting:
```
https://nest-haus.at/konfigurator?refresh-prices
```
or
```
https://nest-haus.at/konfigurator?clear-cache
```

## 🎯 IMMEDIATE ACTION REQUIRED

### Step 1: Deploy These Changes
Push this fix to production immediately. Once deployed, ALL users will automatically get fresh prices on next page load.

### Step 2: Verify Pricing Data in Database

**Check if pricing sync has been run:**
```bash
npm run ts-node scripts/check-pricing-data.ts
```

**Or check directly via API:**
```bash
curl https://nest-haus.at/api/pricing/data
```

**If no pricing data in database:**
1. Go to admin panel at `/admin` (or wherever pricing sync panel is)
2. Run manual pricing sync from Google Sheets
3. Verify sync completed successfully

### Step 3: Test the Fix

**Option A - URL Parameter (Fastest):**
1. Visit: `https://nest-haus.at/konfigurator?refresh-prices`
2. Cache clears automatically
3. Prices reload from database

**Option B - Browser DevTools:**
1. Open DevTools (F12)
2. Console tab
3. Run: `sessionStorage.removeItem('nest-haus-pricing-data')`
4. Refresh page

**Option C - Hard Refresh:**
1. Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. This clears browser cache

**Option D - Debug Panel:**
1. Visit: `https://nest-haus.at/konfigurator?debug=true`
2. See debug panel in bottom-right
3. Click "Refresh Data" button

## 🔍 What Changed

### Before:
```typescript
// Old cache format (no version):
{
  data: {...},
  timestamp: 1234567890,
  version: 1
  // ❌ No cacheVersion field
}
```

### After:
```typescript
// New cache format (with version):
{
  data: {...},
  timestamp: 1234567890,
  version: 1,
  cacheVersion: 3  // ✅ Now validates this
}
```

## 📊 Console Logs to Watch For

After deployment, check browser console:

**Good - Cache Invalidated:**
```
🔄 Cache version mismatch (cached: undefined, current: 3), invalidating old cache...
✅ Pricing data loaded from database (version X, synced ...)
```

**Good - Fresh Load:**
```
✅ Pricing data loaded from sessionStorage (version X, 45s old)
```

**Bad - No Pricing Data:**
```
❌ Error fetching pricing data
⚠️ Pricing data not yet loaded, returning 0
```
→ This means database has no pricing data - run sync!

## 🐛 If Prices Still Show Old Values

### Check 1: Is pricing data in database?
```bash
# Run this command to check:
curl https://nest-haus.at/api/pricing/data | grep "success"

# Should return: {"success":true,...}
# If false: Run pricing sync from admin panel
```

### Check 2: Clear ALL caches
```javascript
// In browser console:
PriceCalculator.clearAllCaches()
sessionStorage.clear()
localStorage.clear()
location.reload()
```

### Check 3: Check network requests
1. Open DevTools → Network tab
2. Refresh configurator page
3. Look for request to `/api/pricing/data`
4. Check response - should have current prices

### Check 4: Verify deployed code
```bash
# Check that CACHE_VERSION = 3 in production
curl https://nest-haus.at/konfigurator | grep -A5 "CACHE_VERSION"
```

## 📝 Files Changed in This Fix

- ✅ `src/app/konfigurator/core/PriceCalculator.ts` - CACHE_VERSION = 3, better handling
- ✅ `src/app/konfigurator/components/KonfiguratorClient.tsx` - URL parameter support
- ✅ `scripts/check-pricing-data.ts` - NEW diagnostic script

## 🚀 Expected Behavior After Deploy

1. **First user visit after deploy:**
   - Detects cache version mismatch (undefined vs 3)
   - Clears old cache
   - Fetches fresh pricing from database
   - Caches with version 3
   - Shows CURRENT prices

2. **Subsequent visits (same user):**
   - Loads from sessionStorage (fast)
   - Cache valid for 5 minutes
   - Shows CURRENT prices

3. **After 5 minutes:**
   - Cache expires
   - Fetches fresh from database
   - Updates cache
   - Shows CURRENT prices

## ✅ Success Criteria

You'll know it's working when:
- ✅ Browser console shows "Cache version mismatch" message
- ✅ Prices match what's in Google Sheets/database
- ✅ No "pricing data not yet loaded" warnings
- ✅ Debug panel (with ?debug=true) shows cacheVersion: 3

Deploy this ASAP and test with the URL parameter method!
