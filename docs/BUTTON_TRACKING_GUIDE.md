# Button Tracking Implementation Guide

## Overview

This guide documents how to add proper tracking IDs to all interactive elements in the Nest-Haus codebase to eliminate "undefined/unknown" button tracking issues.

## Tracking Audit Process

### Step 1: Run the Audit Script

```bash
npx tsx src/scripts/audit-tracking.ts
```

This will generate a report at `docs/tracking-audit-report.html` showing all elements without tracking.

### Step 2: Add Tracking Attributes

For each button, link, or interactive element, add the following attributes:

```tsx
<button
  data-tracking-id="unique-descriptive-id"
  data-track-category="category-name"
  data-track-value="optional-value"
  onClick={handleClick}
>
  Button Text
</button>
```

## Tracking ID Naming Convention

### Format
`{section}-{component}-{action}`

### Examples

#### Configurator
```tsx
// Nest selection
data-tracking-id="konfigurator-nest-80-select"
data-track-category="nest-selection"
data-track-value="nest80"

// Gebäudehülle selection
data-tracking-id="konfigurator-gebaeudehuelle-sicherheit-select"
data-track-category="gebaeudehuelle-selection"
data-track-value="sicherheit"

// Cart button
data-tracking-id="konfigurator-warenkorb-weiter"
data-track-category="navigation"
data-track-value="to-cart"
```

#### Content Pages
```tsx
// Hero CTA
data-tracking-id="home-hero-konfigurator-starten"
data-track-category="cta"
data-track-value="configurator"

// Navigation
data-tracking-id="nav-konzept-link"
data-track-category="navigation"
data-track-value="/konzept"

// Footer
data-tracking-id="footer-impressum-link"
data-track-category="footer-navigation"
data-track-value="/impressum"
```

#### Forms
```tsx
// Contact form
data-tracking-id="kontakt-form-submit"
data-track-category="form-submit"
data-track-value="contact"

// Konzeptcheck form
data-tracking-id="konzeptcheck-form-submit"
data-track-category="form-submit"
data-track-value="konzeptcheck-payment"
```

## Priority Areas

### 🔴 Critical (High Priority)

1. **Configurator Selection Buttons**
   - Location: `src/app/konfigurator/**/*.tsx`
   - Impact: Core user journey tracking
   - Example: Nest type, Gebäudehülle, all configuration options

2. **Cart & Checkout CTAs**
   - Location: `src/app/warenkorb/**/*.tsx`
   - Impact: Conversion tracking
   - Example: "Weiter" buttons, payment buttons

3. **Main CTAs on Landing Pages**
   - Location: `src/app/(content)/**/*.tsx`
   - Impact: Entry point tracking
   - Example: "Konfigurator starten", "Konzept Check"

### 🟡 Medium Priority

4. **Navigation Links**
   - Location: Header, Footer components
   - Impact: User flow understanding

5. **Content Page CTAs**
   - Location: All content pages
   - Impact: Engagement tracking

### 🟢 Low Priority

6. **Utility Links**
   - Impressum, Datenschutz, etc.
   - Impact: Minimal tracking value

## Implementation Examples

### Before (Undefined Tracking)
```tsx
<button onClick={() => selectNest('nest80')}>
  Nest 80
</button>
```

### After (Proper Tracking)
```tsx
<button 
  data-tracking-id="konfigurator-nest-80-select"
  data-track-category="nest-selection"
  data-track-value="nest80"
  onClick={() => selectNest('nest80')}
>
  Nest 80
</button>
```

### For Link Components
```tsx
<Link 
  href="/konzept"
  data-tracking-id="nav-konzept-link"
  data-track-category="navigation"
  data-track-value="/konzept"
>
  Konzept
</Link>
```

### For Dynamic Buttons
```tsx
{options.map((option) => (
  <button
    key={option.value}
    data-tracking-id={`konfigurator-${category}-${option.value}-select`}
    data-track-category={`${category}-selection`}
    data-track-value={option.value}
    onClick={() => handleSelect(option)}
  >
    {option.name}
  </button>
))}
```

## Hook Updates

### Update useInteractionTracking Hook

Ensure the hook prioritizes data attributes:

```typescript
// src/hooks/useInteractionTracking.ts

function getElementInfo(element: HTMLElement) {
  return {
    id: element.dataset.trackingId || element.id || 'unknown',
    category: element.dataset.trackCategory || 'uncategorized',
    value: element.dataset.trackValue || element.textContent?.trim() || undefined
  };
}
```

### Update useContentAnalytics Hook

```typescript
// src/hooks/useContentAnalytics.ts

function getButtonInfo(target: HTMLElement) {
  const trackingId = target.dataset.trackingId;
  const category = target.dataset.trackCategory;
  
  if (!trackingId) {
    console.warn('Button clicked without tracking ID:', target);
  }
  
  return {
    id: trackingId || target.id || 'unknown-button',
    category: category || 'uncategorized',
    // ...
  };
}
```

## Verification Process

### 1. Run Audit (Before)
```bash
npx tsx src/scripts/audit-tracking.ts
```
Note the number of issues.

### 2. Add Tracking IDs
Follow the guide above to add tracking to flagged elements.

### 3. Run Audit (After)
```bash
npx tsx src/scripts/audit-tracking.ts
```
Verify reduction in issues.

### 4. Test in Browser
1. Open browser DevTools
2. Navigate to application
3. Click various elements
4. Check console for tracking logs
5. Verify no "unknown" or "undefined" IDs

### 5. Check Admin Dashboard
1. Generate some test interactions
2. Open Admin → User Tracking
3. Check Click Analytics section
4. Verify proper IDs appear (no "undefined/unknown")

## Common Patterns by Component Type

### Configurator Selection Cards
```tsx
<div 
  className="option-card"
  data-tracking-id={`konfigurator-${category}-${option.value}-select`}
  data-track-category={category}
  data-track-value={option.value}
  onClick={() => handleSelect(option)}
>
  {option.name}
</div>
```

### CTA Buttons
```tsx
<button
  data-tracking-id={`${page}-${section}-${action}`}
  data-track-category="cta"
  data-track-value={targetUrl}
  onClick={handleClick}
>
  {buttonText}
</button>
```

### Navigation Links
```tsx
<Link
  href={path}
  data-tracking-id={`nav-${path.replace('/', '')}`}
  data-track-category="navigation"
  data-track-value={path}
>
  {label}
</Link>
```

### Form Submits
```tsx
<button
  type="submit"
  data-tracking-id={`${formName}-submit`}
  data-track-category="form-submit"
  data-track-value={formName}
>
  Submit
</button>
```

## Automated Fix Script (Optional)

For bulk updates, you can create a script:

```typescript
// scripts/add-tracking-ids.ts
import fs from 'fs';
import { glob } from 'glob';

// Find all TSX files
const files = glob.sync('src/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Add tracking to buttons without it
  content = content.replace(
    /<button([^>]*?)onClick/g,
    (match, attrs) => {
      if (attrs.includes('data-tracking-id')) {
        return match; // Already has tracking
      }
      return `<button${attrs}data-tracking-id="TODO-ADD-ID" onClick`;
    }
  );
  
  fs.writeFileSync(file, content);
});
```

## Checklist

- [ ] Run initial audit script
- [ ] Add tracking to configurator buttons (HIGH)
- [ ] Add tracking to cart/checkout CTAs (HIGH)
- [ ] Add tracking to landing page CTAs (HIGH)
- [ ] Add tracking to navigation links (MEDIUM)
- [ ] Add tracking to content CTAs (MEDIUM)
- [ ] Update interaction tracking hooks
- [ ] Run final audit script
- [ ] Test in browser
- [ ] Verify in admin dashboard
- [ ] Document custom tracking patterns (if any)

## Expected Impact

### Before
- Admin dashboard shows "undefined" or "unknown" for many buttons
- Difficult to understand which CTAs perform best
- Missing conversion funnel details

### After
- All buttons have meaningful IDs
- Clear visibility into user behavior
- Accurate conversion tracking
- Data-driven optimization possible

## Maintenance

### For New Components
1. Always add tracking attributes when creating buttons
2. Follow naming convention
3. Add to audit script patterns if needed

### Regular Audits
- Run audit script monthly
- Fix any new issues promptly
- Update this guide with new patterns

---

**Status**: Implementation guide complete  
**Action Required**: Run audit script and systematically add tracking IDs to flagged elements  
**Estimated Time**: 2-3 hours for complete implementation

