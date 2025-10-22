# Per-Card Aspect Ratio Guide

## Overview

The overlay-text cards now support **individual aspect ratio specification** per card, allowing you to mix 2x1 (extra wide - **2.2:1 ratio**) and 1x1 (wide - **1.2:1 ratio**) cards seamlessly in the same carousel.

## Aspect Ratio Details

- **"2x1"**: Creates a **2.2:1 aspect ratio** (width is 2.2x the height) - Extra Wide format
- **"1x1"**: Creates a **1.2:1 aspect ratio** (width is 1.2x the height) - Wide format

**Note**: Both cards are now WIDER than before. The naming convention "2x1" and "1x1" is maintained for consistency, but the actual ratios are 2.2:1 and 1.2:1 respectively (width:height).

## How It Works

### 1. Individual Card Aspect Ratio

Each card can now have its own `aspectRatio` property in the `ContentCardData` interface:

```typescript
export interface ContentCardData {
  id: number;
  title: string;
  description: string;
  video?: string;
  image?: string;
  backgroundColor: string;
  aspectRatio?: "2x1" | "1x1"; // ✨ NEW: Card-specific aspect ratio
  // ... other properties
}
```

### 2. Fallback Behavior

The system uses a smart fallback pattern:

1. **First priority**: Check if the card has an `aspectRatio` property
2. **Fallback**: Use the component-level `aspectRatio` prop
3. **Default**: If neither is specified, uses standard dimensions

```typescript
// In UnifiedContentCard.tsx
const cardAspectRatio = card.aspectRatio || aspectRatio;
```

### 3. Dynamic Width Calculation

Each card's width is calculated independently based on its aspect ratio, while **all cards maintain the same height** at each breakpoint:

```typescript
// Width varies by aspect ratio
cardWidth = aspectRatio === "2x1" ? cardHeight / 2 : cardHeight;

// Height remains consistent across all cards
cardHeight = 830px (desktop), 692px (tablet), 577px (laptop), etc.
```

## Usage Examples

### Example 1: Mixed Aspect Ratios in Carousel

```typescript
export const VIDEO_BACKGROUND_CARDS_CONTENT: ContentCardData[] = [
  {
    id: 1,
    title: "Moderne Architektur trifft Natur",
    description: "Zeitloses Design fürs Leben",
    video: IMAGES.videos.videoCard01,
    backgroundColor: "#121212",
    aspectRatio: "2x1", // Tall portrait format
  },
  {
    id: 2,
    title: "Flexibel wohnen nach Maß",
    description: "Dein Zuhause wächst mit",
    video: IMAGES.videos.videoCard02,
    backgroundColor: "#121212",
    aspectRatio: "1x1", // Square format
  },
  {
    id: 3,
    title: "Nachhaltigkeit trifft Innovation",
    description: "Grünes Bauen für morgen",
    video: IMAGES.videos.videoCard03,
    backgroundColor: "#121212",
    aspectRatio: "2x1", // Tall portrait format
  },
  // Cards seamlessly flow together despite different aspect ratios!
];
```

### Example 2: Using the Mixed Carousel

```tsx
import { getContentByCategory } from "@/constants/cardContent";

export default function MyPage() {
  const videoBackgroundCards = getContentByCategory("videoBackgroundCards");

  return (
    <UnifiedContentCard
      layout="overlay-text"
      style="standard"
      variant="responsive"
      // No aspectRatio prop needed - each card defines its own!
      customData={videoBackgroundCards}
    />
  );
}
```

### Example 3: Override Individual Cards

You can still use the component-level `aspectRatio` as a default and override specific cards:

```tsx
<UnifiedContentCard
  layout="overlay-text"
  style="standard"
  variant="responsive"
  aspectRatio="1x1" // Default: all square
  customData={[
    {
      id: 1,
      title: "Square Card",
      description: "Uses default 1x1",
      video: "video1.mp4",
      backgroundColor: "#121212",
      // No aspectRatio specified - uses component default (1x1)
    },
    {
      id: 2,
      title: "Portrait Card",
      description: "Override to 2x1",
      video: "video2.mp4",
      backgroundColor: "#121212",
      aspectRatio: "2x1", // Overrides component default
    },
  ]}
/>
```

## Visual Example

The carousel seamlessly displays cards with different aspect ratios:

```
┌──────────────────┐  ┌──────────┐  ┌──────────────────┐
│                  │  │          │  │                  │
│      2.2:1       │  │   1.2:1  │  │      2.2:1       │
│   (Extra Wide)   │  │  (Wide)  │  │   (Extra Wide)   │
└──────────────────┘  └──────────┘  └──────────────────┘
```

All cards have the same height, but different widths based on their aspect ratio. Both ratios are now WIDER than the original cards, creating a more landscape-oriented presentation.

## Technical Details

### Card Width Calculation

The component calculates width for each card individually based on the aspect ratio:

```typescript
// For 2x1 (extra wide): width = height * 2.2 (creates 2.2:1 aspect ratio - WIDER)
cardWidth = cardHeight * 2.2;

// For 1x1 (wide): width = height * 1.2 (creates 1.2:1 aspect ratio - WIDER)
cardWidth = cardHeight * 1.2;
```

### Height Standardization

All cards use the same standard heights at each breakpoint:

- **≥1600px**: 830px (or 75% viewport height)
- **≥1280px**: 692px (or 70% viewport height)
- **≥1024px**: 577px (or 70% viewport height)
- **≥768px**: 720px (or 75% viewport height)
- **<768px**: 600px (or 75% viewport height)

### Cards Per View

The carousel automatically adjusts how many cards are visible based on the aspect ratio:

- **2x1 cards (2.2:1 ratio)**: Much WIDER, fewer cards visible (e.g., 1.5 cards at 1600px+)
- **1x1 cards (1.2:1 ratio)**: WIDER, fewer cards visible (e.g., 2 cards at 1600px+)
- **Mixed**: Dynamic calculation based on each card's individual ratio

Both ratios show fewer cards than before because the cards are now WIDER.

## Benefits

1. **Flexibility**: Mix different card styles in one carousel
2. **Consistency**: All cards maintain the same height
3. **Professional**: Seamless flow between different aspect ratios
4. **Easy to Use**: Just add `aspectRatio` to individual cards
5. **Fallback Safe**: Works with or without individual aspect ratios

## Migration Guide

### Before (Component-Level Only)

```tsx
// All cards forced to same aspect ratio
<UnifiedContentCard
  layout="overlay-text"
  aspectRatio="2x1" // Applied to ALL cards
  customData={myCards}
/>
```

### After (Per-Card Control)

```tsx
// Each card can define its own aspect ratio
const myCards: ContentCardData[] = [
  {
    id: 1,
    aspectRatio: "2x1", // This card is portrait
    // ... other props
  },
  {
    id: 2,
    aspectRatio: "1x1", // This card is square
    // ... other props
  },
];

<UnifiedContentCard layout="overlay-text" customData={myCards} />;
```

## Best Practices

1. **Mix Thoughtfully**: Alternate between 2x1 and 1x1 for visual variety
2. **Content Consideration**: Use 2x1 for vertical content, 1x1 for balanced content
3. **Consistent Heights**: The system automatically maintains height consistency
4. **Testing**: Preview on different screen sizes to ensure smooth carousel flow

## See It in Action

Visit `/entwurf` to see a live demonstration of mixed aspect ratios in action with the video background cards!
