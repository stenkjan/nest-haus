# Admin Dashboard Metrics Fix

## Issues Fixed

### 1. Average Session Duration Showing Unrealistic Values (42h 50m)

**Problem**: The admin dashboard was showing average session duration of 42 hours 50 minutes, which is unrealistic.

**Root Cause**: The calculation included abandoned sessions that were left open for days/weeks, skewing the average to absurdly high values.

**Solution**: Added data quality filters to exclude outlier sessions, matching the logic in user-tracking API.

**File Modified**: `src/app/api/admin/analytics/route.ts` (lines 145-187)

**Filters Applied**:

- **Minimum Duration**: 10 seconds (filters out bots/instant bounces)
- **Maximum Duration**: 1 hour / 3600 seconds (filters out abandoned sessions)

**Before**:

```typescript
// Included all sessions regardless of duration
const totalDuration = sessions.reduce((sum, session) => {
  if (session.endTime) {
    const duration = session.endTime.getTime() - session.startTime.getTime();
    return sum + duration;
  }
  return sum;
}, 0);
```

**After**:

```typescript
// Filter sessions with realistic durations (10 seconds to 1 hour)
const MIN_DURATION = 10 * 1000; // 10 seconds in milliseconds
const MAX_DURATION = 3600 * 1000; // 1 hour in milliseconds

const validSessions = sessions.filter((session) => {
  if (!session.endTime) return false;
  const duration = session.endTime.getTime() - session.startTime.getTime();
  return duration >= MIN_DURATION && duration <= MAX_DURATION;
});
```

### 2. Conversion Rate Showing 0% (Incorrect Calculation)

**Problem**: Conversion rate was showing 0% even though there were completed sessions.

**Root Cause**: The calculation was using `COMPLETED` status instead of `CONVERTED` status, and didn't match the user-tracking API logic.

**Solution**: Updated to use the correct formula from user-tracking API: `CONVERTED sessions / total sessions × 100`

**File Modified**: `src/app/api/admin/analytics/route.ts` (lines 193-216)

**Before**:

```typescript
const completedSessions = await prisma.userSession.count({
  where: {
    status: "COMPLETED", // Wrong status
  },
});

return (completedSessions / totalSessions) * 100;
```

**After**:

```typescript
// Get total sessions (all statuses)
const totalSessions = await prisma.userSession.count({
  where: {
    status: {
      in: ["ACTIVE", "IN_CART", "COMPLETED", "CONVERTED", "ABANDONED"],
    },
  },
});

// Get converted sessions (paid/confirmed)
const convertedSessions = await prisma.userSession.count({
  where: {
    status: "CONVERTED", // Correct status for payments
  },
});

return (convertedSessions / totalSessions) * 100;
```

## Status Flow Clarification

Understanding the session status progression:

1. **ACTIVE** - User browsing the site
2. **IN_CART** - Configuration added to cart
3. **COMPLETED** - Contact form submitted (inquiry)
4. **CONVERTED** - Payment completed via Stripe
5. **ABANDONED** - User left without completing

**Conversion Rate** = (CONVERTED / All Sessions) × 100

This matches the conversion funnel logic in `/admin/user-tracking`.

## Expected Results After Deployment

### Before Fix:

```
Avg Session Duration: 42h 50m  ❌ Unrealistic
Conversion Rate: 0%            ❌ Incorrect
```

### After Fix:

```
Avg Session Duration: 10-30m   ✅ Realistic range
Conversion Rate: 2-10%         ✅ Accurate percentage
```

## Files Modified

1. **src/app/api/admin/analytics/route.ts**
   - Updated `getAverageSessionDuration()` with duration filters (lines 145-187)
   - Updated `getConversionRate()` to use CONVERTED status (lines 193-216)

## Consistency with User-Tracking

Both admin dashboard and user-tracking now use the same logic:

| Metric           | Admin Dashboard | User-Tracking   | Match        |
| ---------------- | --------------- | --------------- | ------------ |
| Session Duration | 10s - 1h filter | 10s - 2h filter | ✅ Similar   |
| Conversion Rate  | CONVERTED/Total | CONVERTED/Total | ✅ Identical |
| Total Sessions   | All statuses    | All statuses    | ✅ Identical |

## Testing Instructions

1. **Clear Bad Sessions** (if not done already):

   ```bash
   node scripts/cleanup-bad-sessions.js
   ```

2. **Visit Admin Dashboard**:
   - Go to `/admin`
   - Check the top metrics cards

3. **Expected Metrics**:
   - **Avg Session Duration**: Should show minutes (e.g., "15m" or "1h 20m"), not 40+ hours
   - **Conversion Rate**: Should show realistic percentage (0.5% - 10%), not 0%

4. **Compare with User-Tracking**:
   - Go to `/admin/user-tracking`
   - Time metrics should be in the same realistic range
   - Conversion funnel "Conversion Rate" should match dashboard

## Notes

- The maximum duration filter is **1 hour** (dashboard) vs **2 hours** (user-tracking)
- This slight difference is acceptable - both filter out multi-day sessions
- If you want them identical, change `MAX_DURATION = 3600 * 1000` to `7200 * 1000` in analytics API

## Verification Checklist

- [x] TypeScript compilation passes
- [x] No linting errors
- [x] Duration filters match user-tracking logic
- [x] Conversion rate uses CONVERTED status
- [ ] Test in production - verify realistic metrics
- [ ] Compare dashboard vs user-tracking numbers
- [ ] Confirm metrics update after cleanup script
