# Warenkorb Refactoring Progress

## Date: 2025-10-30

## Summary
Major refactoring of the Warenkorb (shopping cart) page to reorganize steps, update layouts, and improve the user flow.

## ✅ Completed Tasks

### 1. Step Routing Updates
- **Status**: ✅ Complete
- Changed route `#vorentwurfsplan` → `#check-und-vorentwurf`
- Updated step mappings in:
  - `/workspace/src/app/warenkorb/steps.ts`
  - `/workspace/src/app/warenkorb/WarenkorbClient.tsx`
  - `/workspace/src/app/warenkorb/components/CheckoutStepper.tsx`

**New step structure:**
```
Step 0: Übersicht (#übersicht)
Step 1: Check & Vorentwurf (#check-und-vorentwurf)
Step 2: Terminvereinbarung (#terminvereinbarung)
Step 3: Planungspakete (#planungspakete)
Step 4: Abschluss (#abschluss)
```

### 2. Button Text Updates
- **Status**: ✅ Complete
- Changed all "Zurück" buttons to "Vorheriger Schritt"
- Applied across all step sections

### 3. Step 0 (Übersicht) - Ohne Nest Enhancement
- **Status**: ✅ Complete
- Added "Planen heißt Preise kennen" section for `ohne nest` mode
- Includes image (holzlattung_eiche_parkett) and "Jetzt konfigurieren" button
- Section only shows when `isOhneNestMode === true`

### 4. Step 1 (Check & Vorentwurf)
- **Status**: ✅ Complete
- Moved "Dein Grundstück - Unser Check" content from old Terminvereinbarung step
- Updated title to "Dein Grundstück - Unser Check"
- Updated subtitle to "Wir prüfen deinen Baugrund"
- Maintained left-text/right-form layout with `GrundstueckCheckForm`

### 5. Step 2 (Terminvereinbarung)
- **Status**: ✅ Complete
- Redesigned with left-text/right-interaction layout
- Left side: Description text explaining appointment booking
- Right side: `AppointmentBooking` component and form
- Removed "Dein Nest-Haus Vorentwurf" section (moved to Step 1)
- Added "Immer flexibel bleiben" information box

### 6. Step 3 (Planungspakete)
- **Status**: ✅ Complete
- Moved from old step 2 to new step 3
- Updated title: "Unterstützung gefällig?"
- Added expandable "Welches Planungspaket passt zu dir?" section
- Section expands to show detailed planungspaket cards
- Added state `showPlanungspaketeDetails` for toggle functionality

## ⚠️ Remaining Tasks (Requires Additional Work)

### 7. Step 4 (Abschluss) - Major Restructuring Needed
- **Status**: 🚧 Partial
- **What's needed:**
  - Remove old step 5 ("Bezahlen") content
  - Merge old step 4 and step 5 into new step 4
  - Rename to "Abschluss"
  
**For "mit nest fortfahren" flow:**
  - Show: Dein Nest + Deine Konfiguration (as in current step 4)
  - Add 4 new data boxes:
    - Bewerber data (2 boxes from applicant information)
    - Termine data (2 boxes showing appointment dates)
  - Move payment section underneath

**For "ohne nest fortfahren" flow:**
  - Show simplified configuration summary
  - Show: Vorentwurf & Grundstückscheck, Planungspaket, Gesamtpreis
  - Update design to match new layout (image 6)

### 8. Payment Amount Display Logic
- **Status**: ❌ Not Started
- **Requirements:**
  - Move € sign AFTER the number (e.g., "1.000€" instead of "€ 1.000")
  - Show "Heute zu bezahlen 1.000€" everywhere except final page
  - Only show "~~1.000~~ 500€" crossed out at the very end (Abschluss page)
  - Most places should just show "500€"

### 9. Payment Success Display
- **Status**: ❌ Not Started
- **Requirements:**
  - Remove green checkmark logic for payment success
  - Instead, change "Heute zu bezahlen 500€" text to show:
    - "Bezahlt" (in regular text)
    - Amount "500€" shown in italic below

### 10. Planungspaket Box Design (Step 3)
- **Status**: 🚧 Partial - needs verification
- **Requirements:**
  - Simplify box content per image 4 provided by user
  - Selected box should look like "Planungspaket 03 Pro" design
  - Content should show:
    - Inkl. label
    - Package description bullets (simplified)
    - Price display
    - "Kosten nur bei Inanspruchnahme"

## Technical Notes

### Files Modified
1. `/workspace/src/app/warenkorb/steps.ts` - Step names array
2. `/workspace/src/app/warenkorb/WarenkorbClient.tsx` - Hash mappings
3. `/workspace/src/app/warenkorb/components/CheckoutStepper.tsx` - Main step content (2750+ lines)

### New State Variables Added
- `showPlanungspaketeDetails` - Controls expandable planungspaket details section

### Dependencies
- No new dependencies added
- Uses existing components:
  - `GrundstueckCheckForm`
  - `AppointmentBooking`
  - `CheckoutPlanungspaketeCards`
  - `UnifiedContentCard`
  - `HybridBlobImage`
  - `ContactMap`
  - `Button`

## Testing Recommendations

1. **Test both flows:**
   - Mit Nest fortfahren (with configuration)
   - Ohne Nest fortfahren (without configuration)

2. **Test step navigation:**
   - Forward/backward navigation works correctly
   - Hash URLs update properly
   - Browser back button functions correctly

3. **Test ohne nest mode:**
   - "Planen heißt Preise kennen" section appears in step 0
   - Section only shows when `isOhneNestMode === true`

4. **Test terminvereinbarung:**
   - Left/right layout displays correctly on desktop
   - Stacks properly on mobile
   - Appointment booking functions correctly

5. **Test planungspakete:**
   - Selection works properly
   - Expandable section toggles correctly
   - Cards display when expanded

## Next Steps

To complete the refactoring:

1. **Tackle Step 4 (Abschluss)**:
   - This is the most complex remaining task
   - Requires merging content from old steps 4 and 5
   - Need to implement Bewerber/Termine data boxes
   - Need to reorganize payment section

2. **Update payment display logic**:
   - Implement € sign positioning
   - Implement crossed-out price logic
   - Update all price displays throughout

3. **Replace checkmark with text**:
   - Find payment success checkmark component
   - Replace with "Bezahlt" text + italic amount

4. **Final testing**:
   - Test complete flow end-to-end
   - Verify Stripe integration still works
   - Check responsive design on all breakpoints

## Lint Status
✅ No linting errors after current changes
