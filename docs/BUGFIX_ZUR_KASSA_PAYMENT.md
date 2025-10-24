# Bug Fix: "Zur Kassa" Payment Button

## Issue

The "Zur Kassa" (payment) button was redirecting users back to "Vorentwurfsplan" step instead of opening the Stripe payment dialog.

## Root Cause

Incorrect step index used when contact form validation failed. The code was using `setStepIndex(1)` which corresponds to "Vorentwurfsplan" instead of `setStepIndex(3)` which corresponds to "Terminvereinbarung" (appointment booking).

## Checkout Steps Mapping

```
Index 0: Übersicht
Index 1: Vorentwurfsplan
Index 2: Planungspakete
Index 3: Terminvereinbarung ← Should navigate here when contact not filled
Index 4: Finale Übersicht
Index 5: Bezahlen
```

## Fix Applied

**File**: `src/app/warenkorb/components/CheckoutStepper.tsx`

**Changed**:

```typescript
// BEFORE (incorrect)
setStepIndex(1); // Navigate to Terminvereinbarung section

// AFTER (correct)
setStepIndex(3); // Navigate to Terminvereinbarung section (index 3)
```

## Expected Behavior After Fix

### Scenario 1: Contact Form NOT Submitted

1. User clicks "Zur Kassa"
2. Warning appears: "Bitte fülle zuerst das Terminvereinbarungsformular aus..."
3. User is redirected to step 3 (Terminvereinbarung) ✅
4. Warning clears after 8 seconds

### Scenario 2: Contact Form Submitted

1. User clicks "Zur Kassa"
2. Stripe payment modal opens ✅
3. User can complete payment

### Scenario 3: Alpha Test Mode

1. User clicks "Zur Kassa"
2. Alpha test feedback phase triggers ✅
3. No payment modal (test mode)

## Testing Instructions

1. **Test Normal Flow (Contact Not Filled)**:
   - Go to `/warenkorb`
   - Navigate to "Finale Übersicht" (last step before payment)
   - Clear localStorage: `localStorage.removeItem('nest-haus-contact-submitted')`
   - Click "Zur Kassa"
   - **Expected**: Should go to Terminvereinbarung (step 3), NOT Vorentwurfsplan (step 1)

2. **Test Normal Flow (Contact Filled)**:
   - Go to `/warenkorb`
   - Fill Terminvereinbarung form
   - Navigate to "Finale Übersicht"
   - Click "Zur Kassa"
   - **Expected**: Stripe payment modal should open

3. **Test Alpha Test Flow**:
   - Go to `/warenkorb?alpha-test=true`
   - Navigate to final step
   - Click "Zur Kassa"
   - **Expected**: Alpha test completion event triggers

## Related Files

- `src/app/warenkorb/components/CheckoutStepper.tsx` - Fixed step index
- `src/app/warenkorb/steps.ts` - Step definitions

## Status

✅ **FIXED** - Linter clean, ready for testing

---

**Date**: October 24, 2025  
**Impact**: Critical - Payment flow was broken  
**Severity**: High  
**Resolution Time**: Immediate
