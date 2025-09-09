# Unified Card System

This system provides a consistent way to use card presets across both ContentCards and ContentCardsGlass components.

## Quick Usage

### Using Specific Preset Components

```tsx
import { VideoCard16by9 } from "@/components/cards";
import { VIDEO_CARD_PRESETS } from "@/constants/contentCardPresets";

// Use VideoCard16by9 with sicherheit preset
<VideoCard16by9 customData={[VIDEO_CARD_PRESETS.sicherheit]} />
```

### Using the Unified Component

```tsx
import { UnifiedCardPreset } from "@/components/cards";

// Default Sicherheit preset
<UnifiedCardPreset preset="sicherheit" />

// Glass version
<UnifiedCardPreset preset="sicherheit" style="glass" />

// With custom configuration
<UnifiedCardPreset
  preset="sicherheit"
  style="glass"
  title="Custom Title"
  variant="static"
  maxWidth={true}
/>
```

### Using Individual Components with Presets

```tsx
import { ContentCards, ContentCardsGlass, createPresetCustomData } from "@/components/cards";

// ContentCards with Sicherheit preset
<ContentCards
  variant="static"
  title="Sicherheit Card Preset"
  customData={createPresetCustomData("sicherheit")}
/>

// ContentCardsGlass with same preset
<ContentCardsGlass
  variant="static"
  title="Sicherheit Card Preset - Glass"
  customData={createPresetCustomData("sicherheit")}
/>
```

## Features

✅ **Identical Scaling**: Both components now have the same responsive behavior
✅ **Button Support**: ContentCardsGlass now supports buttons like ContentCards
✅ **Aspect Ratio Fix**: Both components maintain proper proportions at all screen sizes
✅ **Unified Presets**: Easy way to apply the same preset to either component style
✅ **Type Safety**: Full TypeScript support with proper type checking

## Available Presets

- `sicherheit` - Security/Grundstücks-Check card with buttons

## Component Consistency

Both ContentCards and ContentCardsGlass now have:

- Identical responsive breakpoints and scaling logic
- Same button rendering and responsive width behavior
- Consistent aspect ratio maintenance across all screen sizes
- Same text sizing and typography behavior
- Unified preset system for easy reuse
