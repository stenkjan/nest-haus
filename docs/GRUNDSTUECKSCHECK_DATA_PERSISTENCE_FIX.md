# Grundstückscheck Data Persistence Fix

**Date**: November 14, 2024  
**Status**: ✅ Complete

## Overview

Fixed the Grundstückscheck form submission to properly save user data to the database and display it in the checkout summary at `warenkorb#abschluss`.

## Problem

The Grundstückscheck form was only saving data to:
1. CustomerInquiry table (via contact API)
2. sessionStorage (for client-side access)

But NOT to the UserSession tracking table, meaning:
- Data was not persisted in the user tracking system
- Admin couldn't see property data in session analytics
- Data would be lost if sessionStorage was cleared

## Solution

### 1. Created New API Endpoint: `/api/sessions/update-user-data`

**File**: `src/app/api/sessions/update-user-data/route.ts`

**Purpose**: Update user session with property/contact data

**Key Features**:
- Validates input with Zod schema
- Merges userData into existing `configurationData.userData`
- Uses `upsert` pattern to handle missing sessions gracefully
- Non-blocking operation (doesn't interrupt user flow)

**Request Format**:
```typescript
{
  sessionId: string;
  userData: {
    name?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: string;
    addressLine2?: string;
    propertyNumber?: string;
    cadastralCommunity?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    notes?: string;
    service?: string; // 'grundstueck-check' or 'appointment'
  }
}
```

**Response Format**:
```typescript
{
  success: boolean;
  sessionId: string;
  timestamp: number;
}
```

### 2. Created Session Retrieval Endpoint: `/api/sessions/get-session`

**File**: `src/app/api/sessions/get-session/route.ts`

**Purpose**: Retrieve session data including userData from database

**Key Features**:
- GET endpoint with query parameter `?sessionId=...`
- Returns configurationData including userData
- Used as fallback when sessionStorage is empty

**Response Format**:
```typescript
{
  success: boolean;
  session: {
    sessionId: string;
    configurationData: {
      userData?: {
        name: string;
        lastName: string;
        // ... other fields
      };
      // ... other configuration data
    };
    totalPrice: number;
    status: string;
    lastActivity: Date;
  };
  timestamp: number;
}
```

### 3. Updated GrundstueckCheckForm

**File**: `src/components/sections/GrundstueckCheckForm.tsx`

**Changes**:
- Added call to `/api/sessions/update-user-data` after successful submission
- Saves data to BOTH sessionStorage AND database
- Non-blocking error handling (warns but doesn't fail)

**Flow**:
```
User submits form
  ↓
1. Save to CustomerInquiry (contact API) ✅
  ↓
2. Store in sessionStorage ✅
  ↓
3. Save to UserSession database (NEW) ✅
  ↓
Alert user of success
```

### 4. Enhanced CheckoutStepper Data Loading

**File**: `src/app/warenkorb/components/CheckoutStepper.tsx`

**Changes**:
- Added `userDataFromDb` state
- Added useEffect to load userData from database as fallback
- Enhanced `getUserData` memo to use database data if sessionStorage is empty
- Stores database data back to sessionStorage for performance

**Data Priority**:
```
1. appointmentDetails (from cart store) - highest priority
2. grundstueckData (from sessionStorage)
3. userDataFromDb (from database) - fallback
```

**Benefits**:
- Data persists across browser refreshes
- Works even if sessionStorage is cleared
- Seamless user experience

## Database Schema

The data is stored in the `UserSession` table's `configurationData` JSON field:

```typescript
// UserSession.configurationData structure
{
  // Existing configuration fields
  nest?: { ... },
  gebaeudehuelle?: { ... },
  // ... other selections
  
  // NEW: User data section
  userData?: {
    name: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    addressLine2: string;
    propertyNumber: string;
    cadastralCommunity: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    notes: string;
    service: string;
    updatedAt: string; // ISO timestamp
  }
}
```

## Display in Checkout

The data is displayed in the "Abschluss" step of the checkout at `warenkorb#abschluss` in Box 3:

**Fields Shown**:
- ✅ Straße und Nummer (address)
- ✅ Stadt (city)
- ✅ Zusatz (addressLine2)
- ✅ Postleitzahl (postalCode)
- ✅ Grundstücknummer (propertyNumber)
- ✅ Bundesland (state)
- ✅ Katastralgemeinde (cadastralCommunity)
- ✅ Land (country)

**Fallback Display**: Shows "—" for empty fields

## Testing

### Test Scenario 1: Fresh Submission
1. Fill out Grundstückscheck form
2. Submit form
3. Navigate to warenkorb#abschluss
4. **Expected**: All property data displays correctly

### Test Scenario 2: Database Persistence
1. Submit Grundstückscheck form
2. Clear browser sessionStorage
3. Refresh page and navigate to warenkorb#abschluss
4. **Expected**: Data loads from database and displays correctly

### Test Scenario 3: Console Verification
Check browser console for these log messages:
- `✅ Grundstückscheck data saved to customer inquiries`
- `✅ Grundstückscheck data saved to user tracking session`
- `✅ Loaded userData from database:` (if loading from DB)

## Admin Benefits

Admins can now see property data in:
- Session analytics dashboard
- User tracking reports
- Individual session details
- Export/download functionality

## Error Handling

All operations are **non-blocking**:
- If database save fails → User sees success, data in sessionStorage
- If database load fails → Falls back to sessionStorage
- If both fail → Shows "—" placeholders gracefully

## Performance

- **Initial Load**: +1 API call if sessionStorage is empty (~100ms)
- **Form Submission**: +1 API call to update session (~50ms)
- **Caching**: Database data cached to sessionStorage after first load

## Security

- All endpoints validate sessionId
- Zod schema validation for userData
- No sensitive data exposed in URLs
- Proper error messages without leaking internals

## Files Modified

1. ✅ `src/app/api/sessions/update-user-data/route.ts` (NEW)
2. ✅ `src/app/api/sessions/get-session/route.ts` (NEW)
3. ✅ `src/components/sections/GrundstueckCheckForm.tsx` (UPDATED)
4. ✅ `src/app/warenkorb/components/CheckoutStepper.tsx` (UPDATED)

## TypeScript Build Fixes

### Issue: Type Incompatibility in PriceCalculator
**Error**: `Type 'ConfigurationCartItem' is not assignable to parameter of type 'Selections'`

**Root Cause**: 
- `ConfigurationCartItem` has nullable fields (`ConfigurationItem | null | undefined`)
- `PriceCalculator.calculateTotalPrice()` expects `Selections` with non-nullable fields (`SelectionOption | undefined`)

**Solution**:
Created type-safe conversion in `CheckoutStepper.tsx` (line 1202-1213):
```typescript
const selections = {
  nest: configItem.nest || undefined,
  gebaeudehuelle: configItem.gebaeudehuelle || undefined,
  // ... filter all null values to undefined
};
nestHausTotal = PriceCalculator.calculateTotalPrice(selections);
```

This converts `null` values to `undefined` to match the expected `Selections` interface.

## Linting Status

✅ All files pass TypeScript/ESLint checks with zero errors  
✅ Build compiles successfully on Vercel

## Related Documentation

- Session Management: `docs/USER_TRACKING_FIXES_COMPLETE.md`
- Checkout Flow: `docs/FINAL_EMAIL_FUNCTIONALITY_SUMMARY.md`
- Database Schema: `prisma/schema.prisma`

---

**Implementation Complete** ✅

