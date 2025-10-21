# Tall Card Padding Comparison

## Visual Differences: No Padding vs With Padding

### No Padding (`imagePadding="none"`)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  TEXT SECTION (1/3)          │  IMAGE SECTION (2/3)        │
│                              │                             │
│  Title                       │█████████████████████████████│
│  Description                 │█████████████████████████████│
│  [Button 1] [Button 2]       │█████████████████████████████│
│                              │█████████████████████████████│
│                              │█████████████████████████████│
│                              │  Image fills to card edges  │
│                              │█████████████████████████████│
│                              │█████████████████████████████│
│                              │█████████████████████████████│
│                              │█████████████████████████████│
│                              │█████████████████████████████│
└──────────────────────────────┴─────────────────────────────┘
```

**Characteristics:**

- ✅ Image touches RIGHT, TOP, and BOTTOM edges of card
- ✅ No visible gap between image and card border
- ✅ More "modern" edge-to-edge look
- ✅ Maximizes image display area
- ✅ Used for "Der Auftakt" card

**Code:**

```tsx
<UnifiedContentCard {...TALL_CARD_PROPS} customData={[myCard]} />
// or
<UnifiedContentCard imagePadding="none" ... />
```

---

### With Padding (`imagePadding="standard"`)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  TEXT SECTION (1/3)          │  IMAGE SECTION (2/3)        │
│                              │                             │
│  Title                       │    ╔═══════════════════╗    │
│  Description                 │    ║███████████████████║    │
│  [Button 1] [Button 2]       │    ║███████████████████║    │
│                              │    ║███████████████████║    │
│                              │    ║███████████████████║    │
│                              │    ║  15px gap all     ║    │
│                              │    ║  around image     ║    │
│                              │    ║███████████████████║    │
│                              │    ║███████████████████║    │
│                              │    ║███████████████████║    │
│                              │    ╚═══════════════════╝    │
└──────────────────────────────┴─────────────────────────────┘
```

**Characteristics:**

- ✅ 15px gap on TOP, RIGHT, and BOTTOM of image
- ✅ Consistent with other card components
- ✅ Rounded corners visible with padding
- ✅ "Framed" appearance
- ✅ Use when consistency with other cards is important

**Code:**

```tsx
<UnifiedContentCard {...TALL_CARD_PROPS_WITH_PADDING} customData={[myCard]} />
// or
<UnifiedContentCard imagePadding="standard" ... />
```

---

## When to Use Each

### Use **No Padding** When:

- ✅ You want maximum visual impact
- ✅ Image is the hero element
- ✅ Modern, edge-to-edge aesthetic desired
- ✅ Image content works well when cropped at edges
- ✅ Following "Der Auftakt" design pattern

### Use **With Padding** When:

- ✅ You want consistency with other card components
- ✅ Image needs "breathing room"
- ✅ Traditional card aesthetic preferred
- ✅ Image has important content at edges that shouldn't be cut off
- ✅ Multiple cards on same page need visual consistency

---

## Technical Implementation

Both variants use the SAME component and SAME content structure. Only difference is the `imagePadding` prop:

```tsx
// Option 1: Use predefined presets
import { TALL_CARD_PROPS, TALL_CARD_PROPS_WITH_PADDING } from "@/constants/cardContent";

// No padding
<UnifiedContentCard {...TALL_CARD_PROPS} customData={[card]} />

// With padding
<UnifiedContentCard {...TALL_CARD_PROPS_WITH_PADDING} customData={[card]} />

// Option 2: Manual override
<UnifiedContentCard
  layout="video"
  style="standard"
  variant="static"
  heightMode="tall"
  imagePadding="none"      // or "standard"
  maxWidth={true}
  showInstructions={false}
  customData={[card]}
/>
```

---

## Padding Breakdown

### Desktop (≥1024px)

**No Padding (`imagePadding="none"`):**

- Top: 0px
- Right: 0px
- Bottom: 0px
- Left: (text section)

**With Padding (`imagePadding="standard"`):**

- Top: 15px (`py-[15px]`)
- Right: 15px (`pr-[15px]`)
- Bottom: 15px (`py-[15px]`)
- Left: (text section)

### Mobile (<1024px)

**Both variants:**

- Image always has 4px padding on all sides for mobile (`px-4 py-4`)
- This ensures the image doesn't touch screen edges on small devices

---

## Examples in Project

### No Padding (Current)

- **Page**: `/entwurf`
- **Card**: "Der Auftakt"
- **Import**: `TALL_CARD_PROPS`

### With Padding (New Option)

- **Import**: `TALL_CARD_PROPS_WITH_PADDING`
- Use for any new tall cards that need consistency with standard video cards

---

## Quick Switch Guide

Want to change from one to the other? Just update the import:

```tsx
// Change this:
import { getTallCard, TALL_CARD_PROPS } from "@/constants/cardContent";

// To this:
import {
  getTallCard,
  TALL_CARD_PROPS_WITH_PADDING,
} from "@/constants/cardContent";

// Component usage stays the same:
const myCard = getTallCard(1);
<UnifiedContentCard {...TALL_CARD_PROPS_WITH_PADDING} customData={[myCard]} />;
```

No other changes needed! ✨
