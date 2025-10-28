# Fix Session Tracking Issues

## Overview

Fix tracking system to properly capture interaction events and remove redundant data.

## Problem 1: ConfigurationSnapshot is Redundant

**Issue**: `ConfigurationSnapshot` table duplicates data already in `UserSession.configurationData`

**Why It's Redundant**:

- `UserSession` already has `configurationData` field (JSON)
- `UserSession` already has `totalPrice`
- `UserSession` has `lastActivity` timestamp
- Snapshots were meant for tracking configuration changes over time, but we only need final state

**Solution**:

1. Remove `ConfigurationSnapshot` model from Prisma schema
2. Remove `configurationSnapshots` relation from `UserSession`
3. Remove snapshot processing from `BackgroundJobProcessor`
4. Remove snapshot count from user-tracking display

**Files**:

- `prisma/schema.prisma` - Remove ConfigurationSnapshot model
- `src/lib/BackgroundJobProcessor.ts` - Remove processConfigurationQueue()
- `src/app/api/admin/user-tracking/all-configurations/route.ts` - Remove snapshotsCount from query
- `src/app/admin/user-tracking/components/AllConfigurations.tsx` - Remove snapshots display

## Problem 2: InteractionEvent Always Shows 0

**Issue**: `InteractionEvent` count is always 0 because `/api/sessions/track-interaction` is never called from the frontend

**Root Cause**: No client-side tracking is implemented. The API exists but nothing uses it.

**Current State**:

- API endpoint exists at `/api/sessions/track-interaction` ✅
- No frontend hooks/components call it ❌
- Alpha test dashboard expects `page_visit` and `button_click` events ❌

**Solution**:

1. Create client-side tracking hook that captures:
   - **Page visits**: Track every page navigation
   - **Mouse clicks**: Track button/link clicks
   - **Configurator selections**: Already tracked via SelectionEvent
   - **Form interactions**: Track contact form interactions

2. Implement tracking in key components:
   - Global layout for page visits
   - Button/Link wrapper for clicks
   - Configurator for selections (already exists)

**Implementation**:

### Create Tracking Hook

```typescript
// src/hooks/useInteractionTracking.ts
-trackPageVisit(path, title) -
  trackClick(elementId, category) -
  trackFormInteraction(formId, field);
```

### Add to Layout

```typescript
// src/app/layout.tsx
- Use useInteractionTracking to track page changes
- Track on mount and route changes
```

### Track Clicks

```typescript
// Wrap key buttons/links with tracking
- "In den Warenkorb" button
- "Direkt zum Vorentwurf" button
- Navigation links
- CTA buttons
```

**Files**:

- `src/hooks/useInteractionTracking.ts` - NEW: Client tracking hook
- `src/app/layout.tsx` - Add page visit tracking
- `src/components/ui/Button.tsx` - Add click tracking wrapper
- `src/app/konfigurator/components/*` - Track key buttons

## Problem 3: SelectionEvent Count Inflated

**Issue**: `SelectionEvent` shows unrealistically high numbers

**Root Cause**: Events are being created multiple times:

1. During price calculations (every render)
2. During session sync (every change)
3. During cart add (duplicate)
4. During order placement (duplicate)

**Solution**:

1. Only create `SelectionEvent` when user **actively makes a choice**
2. De-duplicate events (same session + category + value + similar timestamp)
3. Track in configurator when user clicks an option, not on every state change

**Current Tracking Points** (Too Many):

- ❌ `/api/sessions/sync` - Creates events on every sync
- ❌ `/api/sessions/track-cart-add` - Creates events when adding to cart
- ✅ Configurator component - Should be ONLY place

**New Logic**:

- ✅ Track in configurator `updateSelection()` only
- ❌ Remove tracking from sync API
- ❌ Remove tracking from cart-add API (or make it optional/summary only)

**Files**:

- `src/store/configuratorStore.ts` - Verify tracking logic
- `src/app/api/sessions/sync/route.ts` - Remove SelectionEvent creation
- `src/app/api/sessions/track-cart-add/route.ts` - Simplify tracking

## Problem 4: Track What Alpha Tests Need

**Required Metrics** (from AlphaTestDashboard.tsx):

### Session Tracking Stats:

- `totalInteractions` - All events
- `pageVisits` - Count of page_visit events
- `buttonClicks` - Count of button_click events
- `configuratorSelections` - Count of configurator_selection events (from SelectionEvent)
- `formInteractions` - Count of form_interaction events
- `avgPagesPerSession` - Average unique pages per session

### Configuration Analytics:

- `configSelections` - What options were selected (from SelectionEvent)
- `pageTimeData` - Time spent on each page (from InteractionEvent with timeSpent)
- `clickedPages` - Pages that were clicked/visited (from InteractionEvent)
- `sectionTimeData` - Time in each configurator section

**Event Types to Track**:

1. `page_visit` - Every page load/navigation
2. `button_click` - CTA buttons, navigation buttons
3. `configurator_selection` - Options selected (map from SelectionEvent)
4. `form_interaction` - Form field interactions
5. `navigation` - Section/tab navigation

## Implementation Plan

### Phase 1: Remove Redundant Data (30 min)

1. Update Prisma schema to remove ConfigurationSnapshot
2. Run migration
3. Update queries to remove snapshot references
4. Update UI to remove snapshot display

### Phase 2: Implement Client Tracking (2 hours)

1. Create `useInteractionTracking` hook
2. Add page visit tracking to layout
3. Create trackable Button component
4. Add tracking to key interactions

### Phase 3: Fix SelectionEvent Duplication (1 hour)

1. Review all places creating SelectionEvent
2. Remove redundant creation points
3. Keep only user-initiated selections

### Phase 4: Testing (30 min)

1. Test page visit tracking
2. Test button click tracking
3. Verify configurator selections
4. Check alpha test dashboard displays correctly

## Migration Steps

### Step 1: Database Schema

```bash
# Edit prisma/schema.prisma to remove ConfigurationSnapshot
npx prisma generate
npx prisma db push
```

### Step 2: Update Backend

- Remove snapshot processing from BackgroundJobProcessor
- Remove snapshot queries from APIs
- Simplify SelectionEvent creation

### Step 3: Add Client Tracking

- Implement tracking hook
- Add to components
- Test in dev environment

### Step 4: Verify

- Check alpha test dashboard
- Verify metrics are accurate
- Ensure no performance issues

## Expected Results

**Before**:

- ConfigurationSnapshot: Redundant data ❌
- InteractionEvents: Always 0 ❌
- SelectionEvents: Inflated (50+ per session) ❌
- Page visits: Not tracked ❌
- Button clicks: Not tracked ❌

**After**:

- ConfigurationSnapshot: Removed ✅
- InteractionEvents: Accurate count (5-20 per session) ✅
- SelectionEvents: Realistic (5-15 per session) ✅
- Page visits: Tracked correctly ✅
- Button clicks: Tracked correctly ✅

## Files to Modify

### Backend

1. `prisma/schema.prisma` - Remove ConfigurationSnapshot
2. `src/lib/BackgroundJobProcessor.ts` - Remove snapshot processing
3. `src/app/api/sessions/sync/route.ts` - Remove SelectionEvent creation
4. `src/app/api/sessions/track-cart-add/route.ts` - Simplify tracking
5. `src/app/api/admin/user-tracking/all-configurations/route.ts` - Remove snapshot query

### Frontend

6. `src/hooks/useInteractionTracking.ts` - NEW: Tracking hook
7. `src/app/layout.tsx` - Add page tracking
8. `src/components/ui/Button.tsx` - Add click tracking
9. `src/app/konfigurator/components/*` - Track key interactions
10. `src/app/admin/user-tracking/components/AllConfigurations.tsx` - Remove snapshot display

## Testing Checklist

- [ ] ConfigurationSnapshot removed from database
- [ ] No errors in queries after removal
- [ ] Page visits tracked correctly
- [ ] Button clicks tracked correctly
- [ ] Configurator selections tracked (realistic numbers)
- [ ] Alpha test dashboard shows correct metrics
- [ ] No performance degradation
- [ ] Session details modal shows accurate data
