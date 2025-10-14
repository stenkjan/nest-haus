# Unified Card System

This system provides a consistent way to use card components with different visual styles using a single component.

## Quick Usage

### Using Specific Preset Components

```tsx
import { VideoCard16by9 } from "@/components/cards";
import { IMAGES } from "@/constants/images";

// Use VideoCard16by9 with direct props
<VideoCard16by9
  cardTitle="Your Title"
  cardDescription="Your description here..."
  videoPath={IMAGES.videos.yourVideo}
  backgroundColor="#F4F4F4"
  buttons={[
    { text: "Button 1", variant: "primary", size: "xs", link: "/link" },
  ]}
/>;
```

### Using the Unified Preset Component

```tsx
import { UnifiedCardPreset } from "@/components/cards";

// Default style preset
<UnifiedCardPreset preset="sicherheit" />

// Glass style version
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

### Using ContentCards Directly

```tsx
import { ContentCards, createPresetCustomData } from "@/components/cards";

// ContentCards with default style
<ContentCards
  variant="static"
  title="Sicherheit Card Preset"
  customData={createPresetCustomData("sicherheit")}
/>

// ContentCards with glass style
<ContentCards
  variant="static"
  style="glass"
  backgroundColor="black"
  title="Sicherheit Card Preset - Glass"
  customData={createPresetCustomData("sicherheit")}
/>

// Materials showcase with glass styling
<ContentCards
  variant="responsive"
  style="glass"
  backgroundColor="black"
  customData={MATERIAL_CARDS}
  maxWidth={false}
/>
```

## Features

✅ **Unified Component**: Single ContentCards component handles both default and glass styles
✅ **Simple Style Switching**: Just use `style="glass"` prop to switch visual styles
✅ **Button Support**: Full button support for static cards
✅ **Aspect Ratio Fix**: Maintains proper proportions at all screen sizes
✅ **Unified Presets**: Easy way to apply presets with any style
✅ **Type Safety**: Full TypeScript support with proper type checking
✅ **Background Control**: Control background color for glass mode

## Available Presets

- `sicherheit` - Security/Grundstücks-Check card with buttons

## Style Variants

The ContentCards component supports two visual styles:

### Default Style (`style="default"`)

- Light background colors (white/gray based on card data)
- Dark text (gray-900, gray-700)
- White navigation arrows with gray icons
- Standard card appearance

### Glass Style (`style="glass"`)

- Dark glass background (`#121212`)
- White/light text colors
- Glass morphism effects with inset shadows
- Dark gray navigation arrows with white icons
- Perfect for dark backgrounds and material showcases

Both styles share:

- Identical responsive breakpoints and scaling logic
- Same button rendering and responsive width behavior
- Consistent aspect ratio maintenance across all screen sizes
- Same text sizing and typography behavior
- Unified preset system for easy reuse
