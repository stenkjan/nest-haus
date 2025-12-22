# Card System Documentation

## Overview

The card system is built around **`UnifiedContentCard`** as the primary component, with specialized components for specific use cases. All card content is centralized in `@/constants/cardContent` for easy management.

---

## 🎯 Main Component: UnifiedContentCard

The `UnifiedContentCard` is a flexible, multi-layout card component that handles most card use cases.

### Supported Layouts

- **`horizontal`** - Text left, image/video right (default)
- **`vertical`** - Text top, image bottom (stacked)
- **`square`** - Square card with text top, image bottom
- **`video`** - Video card with responsive aspect ratios
- **`text-icon`** - Text-only card with optional icon (no image)
- **`image-only`** - Image only, no text overlay
- **`overlay-text`** - Full background with text overlay and buttons
- **`glass-quote`** - Glass background with quote-style text (testimonials)

### Supported Styles

- **`standard`** - Light background, dark text (default)
- **`glass`** - Dark glass background with light text

### Basic Usage

```tsx
import { UnifiedContentCard } from "@/components/cards";

// Using with a content category
<UnifiedContentCard
  category="materialien"
  layout="horizontal"
  style="glass"
/>

// Using with custom data
<UnifiedContentCard
  customData={myCardData}
  layout="square"
  style="standard"
/>
```

### Available Content Categories

Use these category strings with the `category` prop:

- `"materialien"` - Construction materials (13 cards)
- `"photovoltaik"` - Solar panel options (4 cards)
- `"belichtungspaket"` - Lighting packages (3 cards)
- `"fensterTueren"` - Windows and doors materials (4 cards)
- `"stirnseite"` - Front glazing options (4 cards)
- `"ablaufSteps"` - Process steps (7 cards)
- `"planungspakete"` - Planning packages (3 cards)
- `"fullImageCards"` - Full-width image cards
- `"videoBackgroundCards"` - Video background overlay cards
- `"glassQuoteCards"` - Glass quote cards for testimonials (3 cards)

### Advanced Example

```tsx
import { UnifiedContentCard } from "@/components/cards";

<UnifiedContentCard
  // Content source
  category="materialien"
  // Layout configuration
  layout="horizontal"
  style="glass"
  variant="responsive"
  // Display options
  title="Unsere Materialien"
  subtitle="Hochwertige Auswahl für dein Hoam-House"
  backgroundColor="black"
  maxWidth={true}
  showInstructions={true}
  // Lightbox
  enableLightbox={true}
  // External buttons (below carousel)
  buttons={[
    {
      text: "Mehr erfahren",
      variant: "primary",
      size: "xs",
      link: "/materialien",
    },
    {
      text: "Jetzt konfigurieren",
      variant: "secondary",
      size: "xs",
      link: "/konfigurator",
    },
  ]}
/>;
```

---

## 🎴 Specialized Components

### PlanungspaketeCards

Specialized component for displaying the 3 planning packages (Basis, Plus, Pro) with pricing and detailed descriptions.

```tsx
import { PlanungspaketeCards, PLANUNGSPAKETE_PRESET } from "@/components/cards";

<PlanungspaketeCards
  title="Deine Planungspakete"
  subtitle="Wähle das passende Paket"
  maxWidth={true}
  buttons={PLANUNGSPAKETE_PRESET.buttons}
/>;
```

### Process Steps (Checkout)

Use UnifiedContentCard with `layout="text-icon"` for process steps:

```tsx
import { UnifiedContentCard } from "@/components/cards";

<UnifiedContentCard
  category="ablaufSteps"
  layout="text-icon"
  style="standard"
  maxWidth={true}
  showInstructions={false}
/>;
```

---

## 📚 Content System

### Using Content Categories

The easiest way to use card content is through categories:

```tsx
import { UnifiedContentCard } from "@/components/cards";

// Materials showcase
<UnifiedContentCard category="materialien" style="glass" />

// Process steps
<UnifiedContentCard category="ablaufSteps" layout="text-icon" />

// Planning packages
<UnifiedContentCard category="planungspakete" />
```

### Using Preset Configurations

For common card setups, use the preset configurations:

```tsx
import {
  UnifiedContentCard,
  ABLAUF_STEPS_PRESET,
  PLANUNGSPAKETE_PRESET
} from "@/components/cards";

// Process steps with buttons
<UnifiedContentCard
  category="ablaufSteps"
  layout="text-icon"
  title="So läuft's ab"
  subtitle="In 7 Schritten zu deinem Hoam-House"
  buttons={ABLAUF_STEPS_PRESET.buttons}
/>

// Planning packages with buttons
<PlanungspaketeCards
  title="Deine Planungspakete"
  buttons={PLANUNGSPAKETE_PRESET.buttons}
/>
```

### Creating Custom Card Data

For one-off custom cards:

```tsx
import { UnifiedContentCard, ContentCardData } from "@/components/cards";
import { IMAGES } from "@/constants/images";

const customCards: ContentCardData[] = [
  {
    id: 1,
    title: "Custom Card",
    subtitle: "Subtitle here",
    description: "Description text...",
    image: IMAGES.hero.nestHaus1,
    backgroundColor: "#F4F4F4",
    buttons: [
      { text: "Learn More", variant: "primary", size: "xs", link: "/info" },
    ],
  },
];

<UnifiedContentCard customData={customCards} />;
```

---

## 🎨 Layout Examples

### Horizontal Layout (Text-Left, Image-Right)

```tsx
<UnifiedContentCard category="materialien" layout="horizontal" style="glass" />
```

- Desktop: Text on left (1/3), image on right (2/3)
- Mobile: Stacked (text top, image bottom)
- Best for: Material showcases, product cards

### Video Layout (16:9 Responsive)

```tsx
<UnifiedContentCard category="photovoltaik" layout="video" />
```

- Desktop: Text left (1/3), video right (2/3) in 16:9
- 1024px: Text left (1/2), video right (1/2) in 1:1
- Mobile: Stacked with 16:10 video ratio
- Best for: Video demonstrations

### Text-Icon Layout (Square Cards)

```tsx
<UnifiedContentCard category="ablaufSteps" layout="text-icon" />
```

- Square cards with icon, title, subtitle, and description
- No images - pure text content
- Best for: Process steps, feature lists

### Glass-Quote Layout (Testimonials)

```tsx
<UnifiedContentCard
  layout="glass-quote"
  style="glass"
  category="glassQuoteCards"
  backgroundColor="black"
/>
```

- Glass morphism effect with backdrop blur
- Quote mark with mixed bold/gray text formatting
- Attribution section (name + title)
- Text format: `"quote with **bold**|||Name|||Title"`
- Best for: Testimonials, impactful statements
- **See:** `docs/GLASS-QUOTE-CARDS-GUIDE.md` for complete documentation

---

## 📁 File Structure

```
src/components/cards/
├── UnifiedContentCard.tsx              # Main component ⭐
├── PlanungspaketeCards.tsx             # Planning packages component
├── CheckoutPlanungspaketeCards.tsx     # Checkout with selection
├── cardTypes.ts                        # Type definitions
├── index.ts                            # Exports
└── README.md                           # This file

src/constants/
├── cardContent.ts            # All card content data ⭐
└── contentCardPresets.ts     # Preset configurations
```

### Core Files

- **`UnifiedContentCard.tsx`** - The main card component with all layouts
- **`cardContent.ts`** - Centralized content data organized by category
- **`contentCardPresets.ts`** - Button configurations and presets
- **`cardTypes.ts`** - Type definitions for specialized components
- **`index.ts`** - Organized exports for easy imports

---

## 🔧 Type Definitions

### ContentCardData

Main data structure for card content:

```typescript
interface ContentCardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  mobileDescription?: string;
  image?: string;
  video?: string;
  overlayImage?: string;
  backgroundColor: string;
  textColor?: string;
  icon?: React.ReactNode;
  iconNumber?: number;
  playbackRate?: number;
  buttons?: ButtonConfig[];
}
```

### ButtonConfig

Button configuration for cards:

```typescript
interface ButtonConfig {
  text: string;
  variant: "primary" | "secondary" | "primary-narrow" | "secondary-narrow" | ...;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  link?: string;
  file?: string;
  fileMode?: "open" | "download";
  onClick?: () => void;
}
```

---

## 💡 Best Practices

1. **Use categories first** - Check if content exists in `cardContent.ts` before creating custom data
2. **Prefer UnifiedContentCard** - Use specialized components only when needed
3. **Use presets for buttons** - Import button configs from `ABLAUF_STEPS_PRESET` or `PLANUNGSPAKETE_PRESET`
4. **Consistent styling** - Use `style="glass"` for dark backgrounds, `style="standard"` for light
5. **Mobile-first responsive** - Provide mobile text variants for better readability
6. **Semantic layouts** - Choose layout based on content type (video for videos, text-icon for process steps, etc.)

---

## 🚀 Quick Reference

### Most Common Use Cases

```tsx
// Material showcase
<UnifiedContentCard category="materialien" style="glass" />

// Process steps with buttons
<UnifiedContentCard
  category="ablaufSteps"
  layout="text-icon"
  buttons={ABLAUF_STEPS_PRESET.buttons}
/>

// Planning packages
<PlanungspaketeCards
  buttons={PLANUNGSPAKETE_PRESET.buttons}
/>

// Video demonstration
<UnifiedContentCard
  category="photovoltaik"
  layout="video"
/>

// Testimonials / Quotes
<UnifiedContentCard
  layout="glass-quote"
  style="glass"
  category="glassQuoteCards"
  backgroundColor="black"
/>
```

### Import Cheat Sheet

```tsx
import {
  UnifiedContentCard, // Main component
  PlanungspaketeCards, // Planning packages
  CheckoutPlanungspaketeCards, // Checkout with selection
  ABLAUF_STEPS_PRESET, // Process steps preset
  PLANUNGSPAKETE_PRESET, // Planning packages preset
  getContentByCategory, // Get content by category
  ContentCardData, // Type definition
  ButtonConfig, // Button type
} from "@/components/cards";
```

---

## ❓ FAQ

**Q: Should I use UnifiedContentCard or create a specialized component?**  
A: Use UnifiedContentCard for 95% of cases. Only create specialized components if you need unique behavior not covered by layouts/styles.

**Q: Where do I add new card content?**  
A: Add it to `src/constants/cardContent.ts` in the appropriate category array.

**Q: How do I create a new content category?**  
A: 1) Add content array to `cardContent.ts`, 2) Add category to `ContentCategory` type, 3) Add to `CARD_CONTENT_BY_CATEGORY` lookup.

**Q: Can I mix layouts in a single carousel?**  
A: No, all cards in a carousel use the same layout. Use multiple UnifiedContentCard components for different layouts.

**Q: How do I customize button styles?**  
A: Use the `variant` and `size` props on button configs. See `ButtonConfig` type for available options.

---

For more details, check:

- Main component: `src/components/cards/UnifiedContentCard.tsx`
- Content data: `src/constants/cardContent.ts`
- Preset configs: `src/constants/contentCardPresets.ts`
