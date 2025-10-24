# Cart Tracking Debug Guide

## Issue

Cart tracking not working - configurations not showing up in `/admin/user-tracking`

## Possible Causes

### 1. Missing SessionId

The most likely cause is that `config.sessionId` is missing or empty when `addConfigurationToCart` is called.

### 2. Session Not Initialized

The configurator might not be initializing the session properly before the user goes to cart.

## Debug Steps

### Step 1: Check Console for Tracking Logs

Open browser console and go through the flow:

1. Open `/konfigurator`
2. Make selections
3. Click "In den Warenkorb"
4. Look for these console messages:

**Expected (Good)**:

```
🛒 Tracking cart add for session: sess_xxxxxxxxxxxxx
✅ Cart add tracked successfully
```

**Problem Indicators**:

```
⚠️ No sessionId found for cart tracking. Config: { hasNest: true, hasSessionId: false, sessionIdValue: undefined }
```

### Step 2: Check if Session is Being Created

In configurator, check console for:

```
📍 Session initialized: sess_xxxxxxxxxxxxx
```

If you don't see this, the session isn't being created properly.

### Step 3: Check Configuration State

In browser console on konfigurator page:

```javascript
// Check if configuratorStore has sessionId
JSON.parse(localStorage.getItem("nest-configurator"));
```

Look for:

```json
{
  "state": {
    "sessionId": "sess_xxxxx",  // <-- Should NOT be null or empty
    "configuration": {
      "sessionId": "sess_xxxxx",  // <-- Should match above
      "nest": { ... }
    }
  }
}
```

### Step 4: Manually Test Tracking API

```bash
curl -X POST http://localhost:3000/api/sessions/track-cart-add \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "configuration": {
      "nest": {"value": "nest-100", "name": "Nest 100"},
      "gebaeudehuelle": {"value": "standard", "name": "Standard"}
    },
    "totalPrice": 180000
  }'
```

Expected response:

```json
{
  "success": true,
  "sessionId": "test-session-123",
  "status": "IN_CART"
}
```

### Step 5: Check Database

After manual test, check if session was created:

```bash
curl http://localhost:3000/api/admin/debug/session/test-session-123
```

Should return session data with status `IN_CART`.

## Solutions

### Solution 1: Session Not Created

If sessionId is missing, check `src/store/configuratorStore.ts` `initializeSession` method.

The session should be created automatically when:

- Page loads
- User makes first selection
- Session doesn't already exist

### Solution 2: SessionId Not Passed to Cart

If session exists but isn't passed to cart, check:

**File**: `src/store/configuratorStore.ts`

```typescript
getConfigurationForCart: () => {
  const state = get();
  return state.configuration; // Should include sessionId
};
```

### Solution 3: Tracking Endpoint Error

Check server logs for errors from `/api/sessions/track-cart-add`.

Common issues:

- Database connection error
- Prisma schema not synced
- Session update failing

## Quick Fix: Force Session Creation

If session isn't being created, you can force it:

**File**: `src/app/konfigurator/page.tsx` or `ConfiguratorShell`

Add at component mount:

```typescript
useEffect(() => {
  const store = useConfiguratorStore.getState();
  if (!store.sessionId) {
    console.log("🔧 Forcing session initialization");
    store.initializeSession();
  }
}, []);
```

## Testing After Fix

1. Clear localStorage: `localStorage.clear()`
2. Refresh `/konfigurator`
3. Check console for: `📍 Session initialized: sess_xxxxx`
4. Make selections
5. Click "In den Warenkorb"
6. Check console for: `✅ Cart add tracked successfully`
7. Go to `/admin/user-tracking`
8. Should see your configuration with status indicators:
   - 🛒 Cart count: 1
   - Total sessions should increase

## Improved Logging

The cart store now includes better logging:

**When sessionId is missing:**

```
⚠️ No sessionId found for cart tracking. Config: {
  hasNest: true,
  hasSessionId: false,
  sessionIdValue: undefined
}
```

**When tracking succeeds:**

```
🛒 Tracking cart add for session: sess_xxxxx
✅ Cart add tracked successfully
```

**When tracking fails:**

```
❌ Cart add tracking failed with status: 500
OR
⚠️ Cart add tracking failed: Error: ...
```

---

## Next Steps

**User**: Please test the flow and report what you see in the console!

1. Open browser console (F12)
2. Go to `/konfigurator`
3. Make selections
4. Click "In den Warenkorb"
5. Copy/paste the console output here

This will tell us exactly where the issue is.
