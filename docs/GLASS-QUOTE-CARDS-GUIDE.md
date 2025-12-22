# Glass Quote Cards Guide

## Overview

The **Glass Quote Cards** variant is a new layout for the `UnifiedContentCard` component, designed for displaying testimonials, quotes, or impactful statements with a beautiful glass morphism effect.

Inspired by the TU Graz design reference, this variant features:
- Large quote mark (")
- Mixed text formatting (white bold + gray normal)
- Attribution section with name and title
- Glass background with backdrop blur
- Responsive typography and layout

---

## Quick Start

### Basic Usage

```tsx
import { UnifiedContentCard } from "@/components/cards";

<UnifiedContentCard
  layout="glass-quote"
  style="glass"
  variant="responsive"
  category="glassQuoteCards"
  backgroundColor="black"
  maxWidth={true}
  showInstructions={true}
/>
```

### Using the Preset

```tsx
import { GLASS_QUOTE_CARDS_PRESET } from "@/constants/contentCardPresets";
import { GLASS_QUOTE_CARDS_CONTENT } from "@/constants/cardContent";

<UnifiedContentCard
  {...GLASS_QUOTE_CARDS_PRESET}
  customData={GLASS_QUOTE_CARDS_CONTENT}
/>
```

---

## Text Formatting

### Description Format

The `description` field uses a special format with three parts separated by `|||`:

```
"quote text|||Attribution Name|||Attribution Title"
```

### Bold Text Syntax

Wrap text in `**double asterisks**` to make it white and bold:

```typescript
{
  id: 1,
  description: "Ein **zukunftsweisendes** Projekt, welches in den Bereichen **Nachhaltigkeit**, **Ökologie** und auch vom technischen Ansatz **herausragend** ist!|||Assoc. Prof. Dipl-Ing. Dr. Techn. Milena Stravic|||Technische Universität Graz, Projektentwicklung",
  backgroundColor: "#121212",
}
```

**Result:**
- Regular text appears in gray-400
- Text wrapped in `**...**` appears in white with font-semibold
- Attribution name appears in white
- Attribution title appears in gray-400

---

## Card Structure

### Visual Layout

```
┌─────────────────────────────────────┐
│  "                                  │  ← Large quote mark
│                                     │
│  Ein zukunftsweisendes Projekt,     │  ← Quote text
│  welches in den Bereichen           │    (white bold + gray normal)
│  Nachhaltigkeit, Ökologie und       │
│  auch vom technischen Ansatz        │
│  herausragend ist!                  │
│                                     │
│  Assoc. Prof. Dr. Milena Stravic   │  ← Attribution name (white)
│  Technische Universität Graz        │  ← Attribution title (gray)
└─────────────────────────────────────┘
```

### Typography Scale

| Element | Mobile | Tablet | Desktop | XL | 2XL |
|---------|--------|--------|---------|-----|-----|
| Quote Mark | 3rem | 3.75rem | 4.5rem | 6rem | 6rem |
| Quote Text | 1.125rem | 1.25rem | 1.5rem | 1.875rem | 2.25rem |
| Attribution Name | 1rem | 1.125rem | 1.25rem | 1.5rem | 1.5rem |
| Attribution Title | 0.875rem | 1rem | 1.125rem | 1.25rem | 1.25rem |

---

## Styling Details

### Glass Effect

```typescript
// Glass background
<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20" />
```

**Features:**
- Gradient from `white/10` to `white/5`
- `backdrop-blur-md` for glass effect
- Subtle `white/20` border
- Works best on dark backgrounds

### Colors

- **Bold text:** `text-white font-semibold`
- **Normal text:** `text-gray-400 font-normal`
- **Attribution name:** `text-white font-semibold`
- **Attribution title:** `text-gray-400`
- **Quote mark:** `text-white/90`

### Spacing

- **Card padding:** `p-8 md:p-10 lg:p-12 xl:p-14`
- **Quote mark margin:** `mb-4 md:mb-6`
- **Quote text margin:** `mb-8 md:mb-10 lg:mb-12`
- **Attribution title margin:** `mt-1`

---

## Responsive Behavior

### Cards Per View

| Breakpoint | Screen Width | Cards Visible | Card Aspect Ratio |
|------------|-------------|---------------|-------------------|
| Mobile | <768px | 1.3 | 0.9x (narrower) |
| Tablet | 768px-1023px | 1.5 | 1.2x (wider) |
| Desktop | 1024px-1279px | 1.5 | 1.2x |
| Large | 1280px-1599px | 1.7 | 1.2x |
| XL | ≥1600px | 1.9 | 1.2x |

### Height Calculations

```typescript
// Consistent with overlay-text layout
const heights = {
  mobile: Math.min(600 * heightMultiplier, viewport * 0.75),
  tablet: Math.min(720 * heightMultiplier, viewport * 0.75),
  desktop: Math.min(577 * heightMultiplier, viewport * 0.7),
  large: Math.min(692 * heightMultiplier, viewport * 0.7),
  xl: Math.min(830 * heightMultiplier, viewport * 0.75),
};
```

---

## Creating Custom Content

### Example Card Data

```typescript
import { ContentCardData } from "@/constants/cardContent";

const myQuoteCard: ContentCardData = {
  id: 1,
  title: "", // Not used for glass-quote layout
  subtitle: "", // Not used for glass-quote layout
  description: "Das Hoam verbindet **Innovation** mit **Tradition**. Ein Konzept, das die Zukunft des Bauens **neu definiert**.|||Dr. Anna Müller|||Architektin und Nachhaltigkeitsexpertin",
  backgroundColor: "#121212",
};
```

### Multiple Cards

```typescript
export const MY_QUOTE_CARDS: ContentCardData[] = [
  {
    id: 1,
    description: "First quote with **bold text**|||Name 1|||Title 1",
    backgroundColor: "#121212",
  },
  {
    id: 2,
    description: "Second quote with **bold text**|||Name 2|||Title 2",
    backgroundColor: "#121212",
  },
  {
    id: 3,
    description: "Third quote with **bold text**|||Name 3|||Title 3",
    backgroundColor: "#121212",
  },
];

// Usage
<UnifiedContentCard
  layout="glass-quote"
  style="glass"
  variant="responsive"
  backgroundColor="black"
  customData={MY_QUOTE_CARDS}
/>
```

---

## Background Recommendations

### Best Practices

✅ **Recommended:**
- Black background: `backgroundColor="black"`
- Very dark backgrounds (#121212, #1a1a1a)
- Dark gradient backgrounds

❌ **Not Recommended:**
- White or light backgrounds (glass effect not visible)
- Busy background images (text readability issues)

### Example Sections

```tsx
// Option 1: Black section
<section className="bg-black py-16">
  <UnifiedContentCard
    layout="glass-quote"
    backgroundColor="black"
    {...otherProps}
  />
</section>

// Option 2: Custom dark background
<section style={{ backgroundColor: "#0a0a0a" }} className="py-16">
  <UnifiedContentCard
    layout="glass-quote"
    backgroundColor="black"
    {...otherProps}
  />
</section>
```

---

## Live Demo

Visit the showcase page to see the glass-quote cards in action:

```
http://localhost:3000/showcase/cards
```

Scroll to the **"Glass Quote Cards"** section to see:
- Responsive behavior
- Text formatting
- Glass effect
- Touch/swipe interactions
- Keyboard navigation (arrow keys)

---

## Props Reference

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `layout` | `"glass-quote"` | Activates the glass-quote layout |
| `style` | `"glass"` | Enables glass styling |

### Recommended Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"responsive"` \| `"static"` | `"responsive"` | Card carousel behavior |
| `backgroundColor` | `"black"` \| `"white"` \| `"gray"` | `"black"` | Section background color |
| `maxWidth` | `boolean` | `true` | Apply max-width container |
| `showInstructions` | `boolean` | `true` | Show navigation instructions |

### Content Props

| Prop | Type | Description |
|------|------|-------------|
| `category` | `"glassQuoteCards"` | Use built-in quote cards |
| `customData` | `ContentCardData[]` | Use custom card data |

---

## Advanced Customization

### Custom Typography Scale

If you need different text sizes, modify the rendering function in `UnifiedContentCard.tsx`:

```typescript
// In renderGlassQuoteLayout function
<div className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
  {/* Quote text */}
</div>
```

### Custom Colors

Override colors by modifying the segment rendering:

```typescript
segment.bold
  ? "text-white font-semibold"  // Change to custom color
  : "text-gray-400 font-normal"  // Change to custom color
```

### Animation Timing

Adjust entrance animations in the rendering function:

```typescript
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: index * 0.1, duration: 0.6 }}  // Adjust here
>
```

---

## Troubleshooting

### Common Issues

**Issue:** Text not parsing correctly
- **Solution:** Ensure you use `**text**` (double asterisks) for bold segments
- Check for proper `|||` (triple pipe) separators

**Issue:** Glass effect not visible
- **Solution:** Use a dark background (`backgroundColor="black"`)
- Ensure parent section has appropriate dark background

**Issue:** Cards too wide/narrow
- **Solution:** Adjust aspect ratio multiplier in width calculations
- Modify `setCardWidth(cardHeight * 1.2)` to different ratio

**Issue:** Text too small/large
- **Solution:** Adjust typography scale classes in the rendering function

---

## Examples in Production

### Testimonials Section

```tsx
import { UnifiedContentCard } from "@/components/cards";
import { GLASS_QUOTE_CARDS_CONTENT } from "@/constants/cardContent";

export function TestimonialsSection() {
  return (
    <section className="bg-black py-24">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Was unsere Partner sagen
        </h2>
        <p className="text-gray-400 text-lg">
          Erfahrungen aus der Zusammenarbeit
        </p>
      </div>
      
      <UnifiedContentCard
        layout="glass-quote"
        style="glass"
        variant="responsive"
        backgroundColor="black"
        maxWidth={true}
        showInstructions={false}
        customData={GLASS_QUOTE_CARDS_CONTENT}
      />
    </section>
  );
}
```

---

## Technical Implementation

### File Locations

```
src/
├── components/cards/
│   └── UnifiedContentCard.tsx         # Main component with glass-quote layout
├── constants/
│   ├── cardContent.ts                 # GLASS_QUOTE_CARDS_CONTENT data
│   └── contentCardPresets.ts          # GLASS_QUOTE_CARDS_PRESET config
├── app/showcase/cards/
│   └── page.tsx                       # Live demo/showcase
└── docs/
    └── GLASS-QUOTE-CARDS-GUIDE.md    # This file
```

### Key Functions

1. **`renderGlassQuoteLayout()`** - Main rendering function
2. **`parseQuoteText()`** - Parses `**bold**` syntax
3. Card width/height calculations in `useEffect` hooks

---

## Version History

- **v1.0.0** (2025-10-30) - Initial implementation
  - Glass-quote layout variant
  - Text parsing with bold syntax
  - Attribution display
  - Responsive behavior
  - Full documentation

---

## Support

For issues or questions:
1. Check this documentation
2. Review live demo at `/showcase/cards`
3. Inspect component implementation in `UnifiedContentCard.tsx`
4. Check existing content examples in `cardContent.ts`

