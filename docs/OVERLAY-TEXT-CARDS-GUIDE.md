# Overlay-Text Cards Guide

## Overview

The new `overlay-text` layout provides full-image background cards with text overlay and optional buttons. Perfect for creating visually striking content galleries with text information.

## Features

- ✅ Full-image backgrounds (no borders, edge-to-edge)
- ✅ Left-aligned text overlay with dark background for readability
- ✅ Two aspect ratios: `2x1` (wide) and `1x1` (square)
- ✅ Responsive carousel with multiple cards visible
- ✅ Optional buttons at the bottom of each card
- ✅ Configurable button styles
- ✅ Works with any content from `cardContent.ts`

## Usage

### Basic Example (2x1 Aspect Ratio)

```tsx
import { UnifiedContentCard } from "@/components/cards";
import { getContentByCategory } from "@/constants/cardContent";

const materialienContent = getContentByCategory("materialien");

<UnifiedContentCard
  layout="overlay-text"
  style="standard"
  variant="responsive"
  aspectRatio="2x1"
  maxWidth={true}
  showInstructions={true}
  customData={materialienContent}
/>;
```

### Square Cards (1x1 Aspect Ratio)

```tsx
<UnifiedContentCard
  layout="overlay-text"
  style="standard"
  variant="responsive"
  aspectRatio="1x1" // Change to square
  maxWidth={true}
  showInstructions={true}
  customData={materialienContent}
/>
```

### With Custom Content and Buttons

```tsx
const customCards = [
  {
    id: 1,
    title: "Explore Our Collection",
    description: "Premium Materials",
    image: "/path/to/image.jpg",
    backgroundColor: "#121212",
    buttons: [
      {
        text: "View Details",
        variant: "primary",
        size: "sm",
        link: "/details",
      },
    ],
  },
];

<UnifiedContentCard
  layout="overlay-text"
  aspectRatio="2x1"
  customData={customCards}
/>;
```

## Props Configuration

### Required Props

- `layout`: Must be set to `"overlay-text"`
- `customData` or `category`: Content source

### Optional Props

- `aspectRatio`: `"2x1"` (default, wide) or `"1x1"` (square)
- `style`: `"standard"` (default) or `"glass"`
- `variant`: `"responsive"` (default, carousel) or `"static"` (single card)
- `maxWidth`: `true` (default) constrains width to `max-w-screen-2xl`
- `showInstructions`: `true` (default) shows navigation instructions

## Card Data Structure

The overlay-text layout uses these fields from `ContentCardData`:

```typescript
{
  id: number;
  title: string;          // Displayed as H3 (second line, bold)
  description: string;    // Displayed as P (first line)
  image?: string;         // Background image
  video?: string;         // Background video (alternative to image)
  backgroundColor: string;
  buttons?: ButtonConfig[]; // Optional button(s) at bottom
}
```

## Text Hierarchy

1. **First line**: `p-primary` (paragraph) - shows `description`
2. **Second line**: `h3-secondary` (heading 3) - shows `title` in bold

Both lines are:

- Left-aligned
- White text color (for contrast against images)
- Overlay has semi-transparent black background (30% opacity)

## Button Configuration

```typescript
buttons: [{
  text: "Button Text",
  variant: "primary" | "secondary" | "landing-primary" | ...,
  size: "xs" | "sm" | "md" | "lg",
  link?: "/path",        // Use for navigation
  onClick?: () => {}     // Use for actions
}]
```

## Responsive Behavior

### Desktop (1600px+)

- Card width: 690px
- Shows ~2.2 cards
- Horizontal scrolling carousel

### Desktop (1280px+)

- Card width: 576px
- Shows ~2 cards
- Horizontal scrolling carousel

### Tablet (768px+)

- Card width: 480px
- Shows ~1.5 cards
- Horizontal scrolling carousel

### Mobile (<768px)

- Card width: 312px
- Shows ~1.1 cards (peek effect)
- Touch-optimized scrolling

## Height Standardization (IMPORTANT!)

**All overlay-text cards use the SAME standard heights as other cards at ALL breakpoints.**

The aspect ratio controls the **WIDTH**, not the height:

### Standard Heights (at all breakpoints)

- **1600px+ viewport**: 830px (or 75% of viewport height, whichever is smaller)
- **1280px+ viewport**: 692px (or 70% of viewport height, whichever is smaller)
- **1024px+ viewport**: 577px (or 70% of viewport height, whichever is smaller)
- **768px+ viewport**: 720px (or 75% of viewport height, whichever is smaller)
- **<768px (mobile)**: 600px (or 75% of viewport height, whichever is smaller)

### Tall Cards Exception

When using `heightMode="tall"`, cards are 25% taller (multiply by 1.25):

- 1600px+: 1037.5px
- 1280px+: 865px
- 1024px+: 721.25px
- 768px+: 900px
- Mobile: 750px

## Aspect Ratios

### 2x1 (Portrait/Narrow Format)

- **Width** = Height ÷ 2
- Height stays at standard heights listed above
- Best for: Portrait images, vertical compositions, narrow subjects
- Examples: People portraits, tall buildings, vertical nature shots
- Shows more cards per view (3-4 cards visible)

### 1x1 (Square Format)

- **Width** = Height (square)
- Height stays at standard heights listed above
- Best for: Balanced compositions, product photos
- Examples: Product photos, square compositions, architectural details
- Shows fewer cards per view (1-2 cards visible)

## Easy Content Switching

To switch between different content categories:

```tsx
// Option 1: Use category
<UnifiedContentCard
  layout="overlay-text"
  category="materialien" // or "photovoltaik", "fensterTueren", etc.
  aspectRatio="2x1"
/>;

// Option 2: Use customData
const myContent = getContentByCategory("photovoltaik");
<UnifiedContentCard
  layout="overlay-text"
  customData={myContent}
  aspectRatio="1x1"
/>;
```

## Live Demo

Visit `/entwurf` to see both aspect ratios in action with materialien content.

## Notes

- Cards automatically apply a dark overlay (30% black) for text readability
- Navigation arrows appear on hover (desktop) or are always visible (mobile)
- Keyboard navigation supported (← → arrow keys)
- Smooth animations on card entry and hover
- Full touch gesture support on mobile devices
