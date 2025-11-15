# Grundstückscheck Form - Error Handling & User Feedback Fix

**Date**: November 15, 2025  
**Status**: ✅ Complete

## Problem Statement

The Grundstückscheck form in the checkout "Entwurf" step had poor error handling and user feedback:

### Issues Fixed:

1. **❌ Generic error message**: "Ungültige Daten" with no explanation of what was wrong
2. **❌ No specific field validation feedback**: User didn't know which fields were missing
3. **❌ No success feedback**: Unclear if data was actually saved
4. **❌ Broken "Speichern" button**: Used synthetic event dispatch that didn't work properly
5. **❌ No visual state change**: Button didn't show "Gespeichert" after successful save

---

## Solution Implemented

### 1. Added `isSaved` State

**File**: `src/components/sections/GrundstueckCheckForm.tsx`

```typescript
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSaved, setIsSaved] = useState(false); // NEW
```

This tracks whether the form was successfully saved, allowing the button to show the correct state.

---

### 2. Enhanced Validation with Specific Error Messages

#### A. Property Field Validation (Always Required)

```typescript
if (
  !formData.address.trim() ||
  !formData.city.trim() ||
  !formData.postalCode.trim()
) {
  alert(
    "❌ Bitte fülle die Pflichtfelder aus:\n\n• Straße und Hausnummer\n• Stadt\n• Postleitzahl"
  );
  return;
}
```

**User sees exactly which fields are required.**

#### B. Address Format Validation

```typescript
const addressRegex = /^[a-zA-ZäöüÄÖÜß0-9\s,.\-/]+$/;
if (!addressRegex.test(formData.address)) {
  alert("❌ Ungültige Adresse. Bitte verwende nur Buchstaben, Zahlen und gängige Satzzeichen (,.-/)");
  return;
}
```

**User sees what characters are allowed in the address.**

#### C. Personal Data Validation (When Not Excluded)

```typescript
if (!excludePersonalData) {
  if (!formData.name.trim() || !formData.email.trim()) {
    alert("❌ Bitte fülle die Pflichtfelder aus:\n\n• Name\n• Email");
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    alert("❌ Bitte gib eine gültige E-Mail-Adresse ein.");
    return;
  }
}
```

**User gets specific feedback for name/email fields when they're shown.**

---

### 3. Detailed Error Messages for API Failures

#### Before:
```typescript
} catch (error) {
  console.error("❌ Error submitting Grundstückscheck form:", error);
  alert("Es gab einen Fehler beim Senden des Formulars. Bitte versuche es später erneut.");
}
```

**Generic message with no details.**

#### After:
```typescript
} catch (error) {
  console.error("❌ Error submitting Grundstückscheck form:", error);
  const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
  alert(
    `❌ Fehler beim Speichern:\n\n${errorMessage}\n\nBitte versuche es erneut oder kontaktiere uns unter mail@nest-haus.com`
  );
  setIsSaved(false);
}
```

**Shows actual error message from API + contact information for support.**

---

### 4. Proper Success Handling

#### Before:
```typescript
if (response.ok && result.success) {
  // ... save data ...
  alert("Formular wurde erfolgreich übermittelt! Wir melden uns bald bei Ihnen.");
}
```

**Generic success message.**

#### After:
```typescript
if (response.ok && result.success) {
  // ... save data to sessionStorage and database ...
  
  // Mark as saved
  setIsSaved(true);
  
  // Show success alert
  alert("✅ Deine Daten wurden erfolgreich gespeichert!");
}
```

**Clear confirmation with checkmark emoji.**

---

### 5. Fixed "Speichern" Button Logic

#### Before (Broken):
```typescript
const handleZahlenUndPruefen = async () => {
  const submitEvent = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });
  const formElement = document.querySelector("form");
  
  if (formElement) {
    formElement.dispatchEvent(submitEvent); // ❌ Doesn't work properly
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const storedData = sessionStorage.getItem("grundstueckCheckData");
    if (storedData) {
      router.push("/warenkorb#terminvereinbarung");
    }
  }
};
```

**Issues:**
- Synthetic event dispatch doesn't trigger proper validation
- Race condition with 500ms timeout
- No error handling
- Navigation logic removed (should only save, not navigate)

#### After (Fixed):
```typescript
const handleZahlenUndPruefen = async () => {
  // Validate minimum required fields
  if (!formData.address.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
    alert("❌ Bitte fülle die Pflichtfelder aus:\n\n• Straße und Hausnummer\n• Stadt\n• Postleitzahl");
    return;
  }

  // Validate address format
  const addressRegex = /^[a-zA-ZäöüÄÖÜß0-9\s,.\-/]+$/;
  if (!addressRegex.test(formData.address)) {
    alert("❌ Ungültige Adresse. Bitte verwende nur Buchstaben, Zahlen und gängige Satzzeichen (,.-/)");
    return;
  }

  // Validate personal data if shown
  if (!excludePersonalData) {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("❌ Bitte fülle die Pflichtfelder aus:\n\n• Name\n• Email");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("❌ Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
  }

  setIsSubmitting(true);
  setIsSaved(false);

  try {
    // Prepare data for API
    const contactData = { /* ... */ };

    // Send to contact API
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Save to sessionStorage
      sessionStorage.setItem("grundstueckCheckData", JSON.stringify(grundstueckData));
      
      // Save to user tracking session
      await fetch("/api/sessions/update-user-data", { /* ... */ });
      
      // Mark as saved - button will show "Gespeichert"
      setIsSaved(true);
      
      // No alert popup as per user request - button state change is enough feedback
    } else {
      throw new Error(result.error || result.message || "Unbekannter Fehler");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
    alert(`❌ Fehler beim Speichern:\n\n${errorMessage}\n\nBitte versuche es erneut oder kontaktiere uns unter mail@nest-haus.com`);
    setIsSaved(false);
  } finally {
    setIsSubmitting(false);
  }
};
```

**Improvements:**
- ✅ Proper validation before API call
- ✅ Direct API calls (no synthetic events)
- ✅ Comprehensive error handling
- ✅ Saves to both sessionStorage and database
- ✅ Sets `isSaved` state for button feedback
- ✅ No navigation (just saves data in place)
- ✅ No success alert popup (button state change is feedback)

---

### 6. Updated Button to Show Save State

All three instances of the "Speichern" button now show proper state:

```typescript
<button
  onClick={handleZahlenUndPruefen}
  disabled={isSubmitting || isSaved}
  className="..."
>
  {isSubmitting ? "Wird gespeichert..." : isSaved ? "✓ Gespeichert" : "Speichern"}
</button>
```

**Button States:**
1. **Normal**: "Speichern" (enabled, blue)
2. **Saving**: "Wird gespeichert..." (disabled, grayed out)
3. **Saved**: "✓ Gespeichert" (disabled, grayed out with checkmark)

**Updated in 3 locations:**
- Line 547: Compact form (warenkorb checkout)
- Line 799: Desktop full form
- Line 985: Mobile full form

---

## Error Message Examples

### Validation Errors

#### Missing Required Fields
```
❌ Bitte fülle die Pflichtfelder aus:

• Straße und Hausnummer
• Stadt
• Postleitzahl
```

#### Invalid Address Format
```
❌ Ungültige Adresse. Bitte verwende nur Buchstaben, Zahlen und gängige Satzzeichen (,.-/)
```

#### Invalid Email
```
❌ Bitte gib eine gültige E-Mail-Adresse ein.
```

### API Errors

#### Network Error
```
❌ Fehler beim Speichern:

Failed to fetch

Bitte versuche es erneut oder kontaktiere uns unter mail@nest-haus.com
```

#### Server Error
```
❌ Fehler beim Speichern:

Internal Server Error

Bitte versuche es erneut oder kontaktiere uns unter mail@nest-haus.com
```

#### Validation Error from API
```
❌ Fehler beim Speichern:

Email is required

Bitte versuche es erneut oder kontaktiere uns unter mail@nest-haus.com
```

---

## Success Feedback

### Submit Form (Regular Form Submission)

**Alert shown:**
```
✅ Deine Daten wurden erfolgreich gespeichert!
```

### Save Button (Speichern in Checkout)

**No alert** - Button changes to show state:
- "Speichern" → "Wird gespeichert..." → "✓ Gespeichert"
- Button becomes grayed out and disabled after save
- User can see the checkmark confirming save success

---

## User Experience Improvements

### Before:
1. ❌ Click "Speichern"
2. ❌ See error: "Ungültige Daten"
3. ❌ No idea what's wrong
4. ❌ Button stays the same (no feedback)
5. ❌ Have to guess which field is the problem

### After:
1. ✅ Click "Speichern"
2. ✅ If error: See specific message listing missing/invalid fields
3. ✅ Fix the specific fields mentioned
4. ✅ Click "Speichern" again
5. ✅ Button changes to "Wird gespeichert..."
6. ✅ Button changes to "✓ Gespeichert" (grayed out)
7. ✅ Clear visual confirmation of success

---

## Testing Checklist

### Validation Tests

- [ ] **Test 1**: Leave address empty → Should show error listing required fields
- [ ] **Test 2**: Leave city empty → Should show error listing required fields  
- [ ] **Test 3**: Leave postalCode empty → Should show error listing required fields
- [ ] **Test 4**: Enter invalid address (with @, #, %) → Should show format error
- [ ] **Test 5**: Enter valid address → Should pass validation
- [ ] **Test 6**: Leave name empty (when personal data shown) → Should show error
- [ ] **Test 7**: Leave email empty (when personal data shown) → Should show error
- [ ] **Test 8**: Enter invalid email format → Should show email format error

### Save Button Tests

- [ ] **Test 9**: Click "Speichern" with valid data → Button shows "Wird gespeichert..."
- [ ] **Test 10**: After successful save → Button shows "✓ Gespeichert" and is disabled
- [ ] **Test 11**: Successful save → Data appears in warenkorb#abschluss
- [ ] **Test 12**: Successful save → Data in sessionStorage
- [ ] **Test 13**: Successful save → Data in database (UserSession table)
- [ ] **Test 14**: API failure → Alert shows specific error message
- [ ] **Test 15**: API failure → Button returns to "Speichern" (not stuck)

### Error Message Tests

- [ ] **Test 16**: Network offline → Shows "Failed to fetch" error with contact info
- [ ] **Test 17**: Server 500 error → Shows server error with contact info
- [ ] **Test 18**: API validation error → Shows API error message with contact info

---

## Files Modified

1. ✅ `src/components/sections/GrundstueckCheckForm.tsx`
   - Added `isSaved` state (line 46)
   - Enhanced validation in `handleSubmit` (lines 70-236)
   - Rewrote `handleZahlenUndPruefen` (lines 238-399)
   - Updated button state in compact form (line 547)
   - Updated button state in desktop form (line 799)
   - Updated button state in mobile form (line 985)

---

## Linting Status

✅ **Zero TypeScript/ESLint errors**

```bash
npm run lint
# ✔ No ESLint warnings or errors
```

---

## Related Documentation

- Form validation rules: `docs/development-rules.mdc`
- Grundstück data flow: `docs/GRUNDSTUECKSCHECK_DATA_PERSISTENCE_FIX.md`
- Email integration: `docs/FINAL_EMAIL_FUNCTIONALITY_SUMMARY.md`

---

**Implementation Status**: ✅ Complete and Ready for Testing

All error handling improvements implemented:
- ✅ Specific validation error messages
- ✅ Detailed API error feedback with contact info
- ✅ Visual button state changes (Speichern → Wird gespeichert → ✓ Gespeichert)
- ✅ No success popup (button state is feedback)
- ✅ Proper error recovery (button doesn't get stuck)
- ✅ Zero linting errors

