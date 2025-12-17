# Typography Standards for NEST-Haus (Updated 2025)

## Overview

This document defines the SEO-conform, modular typography system used across all pages and components in the NEST-Haus application. Updated based on comprehensive codebase cleanup and beta roadmap findings.

## Core Typography Rules (SEO-Optimized)

### **CRITICAL: Typography Color System**

Based on comprehensive analysis and heading optimization, follow this approach:

#### **1. Semantic HTML with Separate Color Classes**

```tsx
// ✅ CORRECT: SEO-friendly semantic structure
<h1 className="h1-primary text-gray-900 mb-3">Main Page Title</h1>
<h2 className="h2-title text-gray-900 mb-2">Section Title</h2>
<h3 className="h3-secondary text-gray-600 mb-8">Subtitle</h3>

// ❌ WRONG: Color variants or hardcoded colors
<h1 className="h1-primary-dark">Title</h1> // Don't create color variants
<h1 className="text-4xl text-gray-900">Title</h1> // Missing responsive scaling
```

#### **2. Background-Based Color Selection**

```tsx
// ✅ Utility function for consistent color application
const getHeadingColors = (backgroundColor: 'white' | 'black' | 'gray') => ({
  title: backgroundColor === 'black' ? 'text-white' : 'text-gray-900',
  subtitle: backgroundColor === 'black' ? 'text-gray-300' : 'text-gray-600',
});

// Usage in components
const colors = getHeadingColors(backgroundColor);
<h1 className={`h1-primary ${colors.title} mb-3`}>Title</h1>
<h3 className={`h3-secondary ${colors.subtitle} mb-8`}>Subtitle</h3>
```

### **3. Complete Responsive Breakpoint System**

**CRITICAL**: Always use complete responsive breakpoint coverage:

```tsx
// ✅ CORRECT - Full responsive scale with all breakpoints
"text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl";

// ❌ WRONG - Incomplete breakpoints
"text-4xl md:text-[60px]"; // Missing lg, xl, 2xl
"text-3xl md:text-5xl"; // Missing lg, xl, 2xl
```

### **4. Standard Responsive Typography Patterns**

**CRITICAL**: Use these exact patterns for consistent scaling across all components:

#### **H1 (Main Title/Page Title)**

```tsx
"text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold mb-2 md:mb-3";
// Font size progression: 30px → 36px → 48px → 60px → 72px
```

#### **H2 (Section Heading)**

```tsx
"text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl";
// Font size progression: 18px → 20px → 24px → 30px → 36px
```

#### **H3 (Subtitle/Subheading)**

```tsx
"text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl";
// Font size progression: 16px → 18px → 18px (stays same) → 20px → 24px
```

#### **P (Body Text)**

```tsx
"text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl";
// Font size progression: 14px → 16px → 16px (stays same) → 18px → 20px
```

### **5. Semantic HTML Structure for SEO**

**Use proper heading hierarchy:**

```tsx
// ✅ CORRECT - SEO-friendly semantic structure
<h1>Page Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
<p>Body content</p>

// ❌ WRONG - Poor SEO semantics
<h2>Page Title</h2> // Should be h1
<p>Section Title</p> // Should be h2/h3
```

### **6. Typography Base Classes (No Colors)**

**CRITICAL**: Base classes define sizing, spacing, font-weight - NO COLORS

```css
/* Base classes from globals.css - NO COLORS DEFINED */
.h1-primary {
  @apply font-bold text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-1 lg:mb-1.5;
}

.h1-secondary {
  @apply font-bold text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl mb-2 md:mb-3;
}

.h2-title {
  @apply font-medium text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl;
}

.h3-secondary {
  @apply text-base font-medium sm:text-sm md:text-lg lg:text-xl xl:text-2xl mb-4;
}

.p-primary {
  @apply text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl leading-snug whitespace-pre-line;
}
```

### **7. Color Application Strategy**

**Background-based color selection using utility function:**

```tsx
// ✅ CORRECT: Utility function approach
const getHeadingColors = (backgroundColor: 'white' | 'black' | 'gray') => ({
  title: backgroundColor === 'black' ? 'text-white' : 'text-gray-900',
  subtitle: backgroundColor === 'black' ? 'text-gray-300' : 'text-gray-600',
});

// Usage in components
const colors = getHeadingColors(backgroundColor);
<h1 className={`h1-primary ${colors.title} mb-3`}>Title</h1>
<h3 className={`h3-secondary ${colors.subtitle} mb-8`}>Subtitle</h3>

// ❌ WRONG: Hardcoded color variants
<h1 className="h1-primary-dark">Title</h1>
<h1 className="h1-primary-light">Title</h1>
```

### 5. Spacing Standards

- **Title margin**: `mb-3`
- **Subtitle margin**: `mb-8`
- **Section padding**: `py-16`

## Modular Component Standards (Updated 2025)

### **CRITICAL: Modular Widget Development**

All new components and widgets must follow the modular, interchangeable approach:

#### **Component Structure Requirements**

```tsx
// ✅ CORRECT: Modular component with clear interfaces
interface ComponentProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: "white" | "black" | "gray";
  showCards?: boolean;
  id?: string;
}

export function ModularComponent({
  title = "Default Title",
  subtitle = "Default Subtitle",
  backgroundColor = "white",
  showCards = true,
  id = "component-id",
}: ComponentProps) {
  const colors = getHeadingColors(backgroundColor);

  return (
    <section id={id} className={`w-full py-16 bg-${backgroundColor}`}>
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`h1-primary ${colors.title} mb-3 text-center`}>
          {title}
        </h2>
        <h3 className={`h3-secondary ${colors.subtitle} mb-8 text-center`}>
          {subtitle}
        </h3>
        {showCards && <ComponentContent />}
      </div>
    </section>
  );
}
```

### ⚠️ CRITICAL: Always Use Components, Never Inline Sections

**NEVER create inline sections with hardcoded typography. ALWAYS use reusable components.**

```tsx
// ❌ WRONG - Inline section (causes inconsistencies)
<section className="w-full py-16 bg-white">
  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-3">
      Section Title
    </h2>
    <h3 className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-gray-600 mb-8">
      Section Subtitle
    </h3>
  </div>
</section>

// ✅ CORRECT - Use reusable components
<GrundstueckCheckSection />
<PlanungspaketeSection />
<GetInContactBanner />
```

### Standard Section Pattern

```tsx
<section className="w-full py-16 bg-[background]">
  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-[color] mb-3">
        Section Title
      </h2>
      <h3 className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-[color] mb-8">
        Section Subtitle
      </h3>
    </div>
    {/* Section content */}
  </div>
</section>
```

### Grid Components

All grid components (FullWidthTextGrid, ImageWithFourTextGrid, ThreeByOneGrid, etc.) automatically handle:

- Responsive breakpoints
- Background-based color selection
- Proper semantic HTML structure

```tsx
// Grid components automatically apply correct styling
<FullWidthTextGrid
  title="Section Title"
  subtitle="Section Subtitle"
  backgroundColor="black" // or "white"
/>
```

### SectionHeader Component

**RECOMMENDED**: Use the `SectionHeader` component for all section title/subtitle combinations.

```tsx
import { SectionHeader } from "@/components/sections";

// Basic usage - Standard 1 Pattern (Centered)
<SectionHeader
  title="Dein Zuhause zieht um"
  subtitle="Architektur für ein bewegtes Leben."
/>

// With custom colors (light background)
<SectionHeader
  title="Design für dich gemacht"
  subtitle="Dein Design im Freistil."
  titleClassName="text-gray-900"
  subtitleClassName="text-gray-600"
/>

// With custom colors (dark background)
<SectionHeader
  title="Section Title"
  subtitle="Section Subtitle"
  titleClassName="text-white"
  subtitleClassName="text-gray-300"
/>

// Left-aligned variant
<SectionHeader
  title="Section Title"
  subtitle="Section Subtitle"
  centered={false}
/>

// With custom spacing
<SectionHeader
  title="Section Title"
  subtitle="Section Subtitle"
  wrapperMargin="md:mb-12 mb-12"
  maxWidth="max-w-4xl"
/>
```

**Props:**

- `title` (required): Main title text
- `subtitle` (optional): Subtitle text
- `titleTag` (default: 'h1'): HTML tag for title ('h1' | 'h2')
- `titleClassName` (default: ''): Additional classes for title
- `subtitleClassName` (default: 'text-black'): Additional classes for subtitle
- `maxWidth` (default: 'max-w-3xl'): Max width constraint for subtitle
- `containerMaxWidth` (default: 'max-w-[1536px]'): Container max width
- `wrapperMargin` (default: 'mb-12'): Margin bottom for wrapper
- `centered` (default: true): Center-align text
- `className` (optional): Additional wrapper classes

**When to Use:**

- ✅ **USE** for standalone section headers (title + subtitle)
- ✅ **USE** when you need consistent spacing and responsive behavior
- ✅ **USE** for new sections to maintain standards
- ❌ **DON'T USE** if the title/subtitle are part of a card or complex layout
- ❌ **DON'T USE** if you need highly custom layouts beyond the standard pattern

**Standard Pattern Structure:**

The SectionHeader component encapsulates this pattern:

```tsx
// BEFORE (inline pattern - avoid)
<div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
  <div className="text-center mb-12">
    <h1 className="h1-secondary text-gray-900 mb-2 md:mb-3">
      Dein Zuhause zieht um
    </h1>
    <h3 className="h3-secondary text-black max-w-3xl mx-auto text-center">
      Architektur für ein bewegtes Leben.
    </h3>
  </div>
</div>

// AFTER (SectionHeader component - preferred)
<SectionHeader
  title="Dein Zuhause zieht um"
  subtitle="Architektur für ein bewegtes Leben."
  titleClassName="text-gray-900"
/>
```

**Responsive Behavior:**

The component automatically handles all breakpoints:

- **Container padding**: `px-4 sm:px-6 lg:px-8` (responsive horizontal padding)
- **Title margins**: `mb-2 md:mb-3` (responsive bottom margin)
- **Title sizing**: Via `h1-secondary` class (text-3xl → 2xl:text-7xl)
- **Subtitle sizing**: Via `h3-secondary` class (text-base → 2xl:text-2xl)
- **Max width**: Constrains subtitle width for readability (default: max-w-3xl)

### GetInContactBanner Component

```tsx
<GetInContactBanner
  id="section-id"
  title="Custom Title" // Optional
  subtitle="Custom Subtitle" // Optional
  backgroundColor="white" // Optional
/>
```

### GrundstueckCheckSection Component

```tsx
<GrundstueckCheckSection
  id="grundstueck-check" // Optional
  title="Custom Title" // Optional
  subtitle="Custom Subtitle" // Optional
  backgroundColor="white" // Optional: "white" | "black"
  showCards={true} // Optional
/>
```

### PlanungspaketeSection Component

```tsx
<PlanungspaketeSection
  id="planungspakete" // Optional
  title="Custom Title" // Optional
  subtitle="Custom Subtitle" // Optional
  backgroundColor="white" // Optional: "white" | "black"
  showCards={true} // Optional
/>
```

## Implementation Checklist

### For New Pages

- [ ] Use SectionRouter for multi-section pages
- [ ] Apply consistent typography patterns
- [ ] Use proper semantic HTML structure
- [ ] Implement background-based color selection
- [ ] Test responsive scaling on all breakpoints

### For New Components

- [ ] Use full responsive breakpoint system
- [ ] Support background-based color selection
- [ ] Use semantic HTML elements
- [ ] Apply consistent spacing standards
- [ ] Document component props and usage

### For Component Updates

- [ ] Verify responsive breakpoints are complete
- [ ] Check semantic HTML structure
- [ ] Ensure color contrast follows standards
- [ ] Test on multiple screen sizes
- [ ] Update component documentation

## Typography Classes Reference

### Standard Responsive Breakpoint Patterns

**CRITICAL: Use these exact patterns for consistent typography scaling across all components.**

#### H1 (Main Title/Page Title)

```tsx
// Standard main title/page title pattern
"text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold mb-2 md:mb-3";

// Font size progression: 30px → 36px → 48px → 60px → 72px
```

#### P (Description Text)

```tsx
// Standard description/body text pattern
"text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl";

// Font size progression: 14px → 16px → 16px (stays same) → 18px → 20px
```

#### H2 (Title/Heading)

```tsx
// Standard title/heading pattern
"text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl";

// Font size progression: 18px → 20px → 24px → 30px → 36px
```

#### H3 (Subtitle/Subheading)

```tsx
// Standard subtitle/subheading pattern
"text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl";

// Font size progression: 16px → 18px → 18px (stays same) → 20px → 24px
```

**Key Pattern Notes:**

- P and H3 both use "stay same at lg" pattern for better readability
- H2 scales at every breakpoint for maximum impact
- All patterns have complete breakpoint coverage (no gaps)
- Use these by default unless specifically told otherwise

### Legacy Title Classes (Main Sections)

```tsx
// Main section titles - UPDATED to new H1 standard
"text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold mb-3";

// Special cases (like GetInContactBanner)
"text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-medium mb-3";
```

### Legacy Subtitle Classes (Main Sections)

```tsx
// Standard subtitles - UPDATED with xl breakpoint
"text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl mb-8";

// With color variants
"text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-300 mb-8"; // Black bg
"text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8"; // Light bg
```

### Container Classes

```tsx
// Standard section container
"w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8";

// Section wrapper
"w-full py-16";

// Content wrapper
"text-center mb-16";
```

## DO/DON'T Examples

### ✅ DO

```tsx
// Complete responsive breakpoints
<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold text-gray-900 mb-3">
  Main Title
</h1>
<h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8">
  Section Subtitle
</h3>
```

### ❌ DON'T

```tsx
// Incomplete breakpoints and wrong semantics
<h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-gray-900">
  Section Title
</h2>
<p className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 text-gray-600 max-w-6xl mx-auto">
  Section Subtitle
</p>
```

## Migration Guide

### From Old Pattern to New Pattern

```tsx
// OLD (❌)
<h1 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4">
<h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-6xl mx-auto">

// NEW (✅)
<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold mb-3">
<h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl mb-8">
```

## Testing Requirements

### Responsive Testing

Test typography on these breakpoints:

- Mobile: 375px (text-3xl, text-base)
- Tablet: 768px (md:text-4xl, md:text-lg)
- Desktop: 1024px (lg:text-5xl, lg:text-lg)
- Large: 1280px (xl:text-6xl, xl:text-xl)
- Extra Large: 1536px+ (2xl:text-6xl, 2xl:text-2xl)

### Accessibility Testing

- Ensure proper heading hierarchy (h1 → h2 → h3)
- Verify color contrast ratios meet WCAG standards
- Test with screen readers for semantic structure

## Component Maintenance

### Regular Audits

- Review new components for typography compliance
- Check existing components after major updates
- Verify consistency across all pages
- Update documentation when patterns evolve

### Performance Considerations

- Use consistent classes to maximize CSS reuse
- Avoid inline styles for typography
- Leverage Tailwind's responsive utilities
- Monitor bundle size impact of typography classes

## SectionHeader Refactoring Examples

### Example 1: EntdeckenClient Section 3 (Dein Zuhause zieht um)

**BEFORE** (inline pattern):

```tsx
<section id="zuhause-zieht-um" className="w-full pt-8 md:py-16">
  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center md:mb-12 mb-12">
      <h1 className="h1-secondary mb-2">Dein Zuhause zieht um</h1>
      <h3 className="h3-secondary text-black max-w-3xl mx-auto text-center">
        Architektur für ein bewegtes Leben.
      </h3>
    </div>

    <VideoCard16by9
      title=""
      subtitle=""
      maxWidth={false}
      showInstructions={false}
      customData={[VIDEO_CARD_PRESETS.transportabilitaet]}
    />
  </div>
</section>
```

**AFTER** (using SectionHeader):

```tsx
import { SectionHeader } from "@/components/sections";

<section id="zuhause-zieht-um" className="w-full pt-8 md:py-16">
  <SectionHeader
    title="Dein Zuhause zieht um"
    subtitle="Architektur für ein bewegtes Leben."
    wrapperMargin="md:mb-12 mb-12"
  />

  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
    <VideoCard16by9
      title=""
      subtitle=""
      maxWidth={false}
      showInstructions={false}
      customData={[VIDEO_CARD_PRESETS.transportabilitaet]}
    />
  </div>
</section>;
```

**Benefits:**

- Reduced code duplication (17 lines → 6 lines)
- Consistent spacing across all sections
- Easier to maintain and update
- Clear props make customization explicit

### Example 2: EntdeckenClient Section 5 (Konfigurieren)

**BEFORE** (inline pattern):

```tsx
<section id="konfigurieren" className="w-full py-8 md:py-16 bg-white">
  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h1 className="h1-secondary mb-2 md:mb-3">
        <span className="block md:inline">Konfiguriere dein</span>
        <span className="block md:inline"> ®Hoam Haus</span>
      </h1>
      <h3 className="h3-secondary text-black mb-8">
        Individualisiert, wo es Freiheit braucht. Standardisiert, wo es
        Effizienz schafft.
      </h3>
    </div>

    <VideoCard16by9 {...props} />
  </div>
</section>
```

**AFTER** (using SectionHeader):

```tsx
import { SectionHeader } from "@/components/sections";

<section id="konfigurieren" className="w-full py-8 md:py-16 bg-white">
  <SectionHeader
    title={
      <>
        <span className="block md:inline">Konfiguriere dein</span>
        <span className="block md:inline"> ®Hoam Haus</span>
      </>
    }
    subtitle="Individualisiert, wo es Freiheit braucht. Standardisiert, wo es Effizienz schafft."
    subtitleClassName="text-black mb-8"
  />

  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
    <VideoCard16by9 {...props} />
  </div>
</section>;
```

**Note:** The `title` prop accepts React nodes, so you can still use complex structures like multi-line titles with responsive display.

### Example 3: Section with Custom Colors (Dark Background)

**BEFORE:**

```tsx
<section className="w-full py-16 bg-black">
  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h1 className="h1-secondary text-white mb-2 md:mb-3">Section Title</h1>
      <h3 className="h3-secondary text-gray-300 max-w-3xl mx-auto text-center">
        Section subtitle on dark background.
      </h3>
    </div>
    {/* Content */}
  </div>
</section>
```

**AFTER:**

```tsx
import { SectionHeader } from "@/components/sections";

<section className="w-full py-16 bg-black">
  <SectionHeader
    title="Section Title"
    subtitle="Section subtitle on dark background."
    titleClassName="text-white"
    subtitleClassName="text-gray-300"
  />
  {/* Content - wrap in container if needed */}
</section>;
```

## Section Standard

**CRITICAL**: All `<section>` elements should follow the standardized padding and structure patterns defined here.

### **Standard Section Pattern**

This is the **default pattern** for most content sections across the application.

**Padding Standard:**

- **Mobile**: `py-8` (32px top/bottom)
- **Desktop (md+)**: `py-16` (64px top/bottom)
- **Class**: `py-8 md:py-16`

**Full Structure:**

```tsx
<section id="section-id" className="w-full py-8 md:py-16 bg-white">
  <SectionHeader title="Section Title" subtitle="Section subtitle" />

  {/* Section content */}
  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
    {/* Your content components */}
  </div>
</section>
```

**Key Components:**

1. **Full width**: `w-full` - Section spans full viewport width
2. **Responsive padding**: `py-8 md:py-16` - Consistent vertical spacing at all breakpoints
3. **Background**: `bg-white`, `bg-gray-50`, or `bg-black` - Semantic background colors
4. **Section ID**: Required for SectionRouter navigation and scroll targeting

**When to Use:**

- ✅ Standard content sections with title/subtitle
- ✅ Sections with cards, grids, or other content components
- ✅ Any section that needs consistent spacing
- ✅ Most sections on your page (90%+ of cases)

### **Special Section Patterns**

#### **Hero Sections**

Hero sections often require custom padding for visual impact and layout flexibility.

**Pattern:**

```tsx
<section
  id="hero"
  className="w-full bg-white md:pt-12 md:pb-4 flex items-center"
>
  {/* Hero content with custom layout */}
  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="h1-secondary">Hero Title</h1>
    <h3 className="h3-secondary">Hero subtitle</h3>
  </div>
</section>
```

**Characteristics:**

- Custom asymmetric padding (e.g., `md:pt-12 md:pb-4`)
- Often includes `flex items-center` for vertical centering
- First section on page
- May have different mobile/desktop layouts

**When to Use:**

- ✅ First section on landing pages
- ✅ Sections with video/image overlays
- ✅ Sections requiring custom vertical alignment

#### **Media Sections (Video/Image)**

Full-width media sections let content dictate spacing.

**Pattern:**

```tsx
<section id="video" className="w-full relative bg-white">
  {/* Full-width video or image content - no padding */}
  <div className="relative w-full">
    <ClientBlobVideo path={videoPath} />

    {/* Optional overlay content */}
    <div className="absolute inset-0 flex flex-col justify-end">
      {/* Overlay text/buttons */}
    </div>
  </div>
</section>
```

**Characteristics:**

- No padding: Let media be full-width
- Use `relative` for overlay positioning
- Content determines section height

**When to Use:**

- ✅ Full-width video sections
- ✅ Hero image sections
- ✅ Sections where media should touch edges

#### **Last Section (Before Footer)**

Optional reduced bottom padding for sections directly above footer.

**Pattern:**

```tsx
<section id="partners" className="w-full pt-8 md:pt-16 pb-4 md:pb-8 bg-white">
  <SectionHeader title="Our Partners" />
  {/* Section content */}
</section>
```

**Characteristics:**

- Reduced bottom padding: `pb-4 md:pb-8` (half of standard)
- Standard top padding: `pt-8 md:pt-16`
- Creates tighter spacing before footer

**When to Use:**

- ⚠️ Optional - Only if section is directly before Footer component
- ⚠️ Skip if Footer already has adequate top margin

### **Section Pattern Comparison**

| Pattern          | Mobile Padding | Desktop Padding             | Use Case                | Frequency |
| ---------------- | -------------- | --------------------------- | ----------------------- | --------- |
| **Standard**     | `py-8` (32px)  | `py-16` (64px)              | Most content sections   | 90%       |
| **Hero**         | Custom         | Custom (e.g., `pt-12 pb-4`) | First section, overlays | 5%        |
| **Media**        | None           | None                        | Full-width video/images | 3%        |
| **Last Section** | `pt-8 pb-4`    | `pt-16 pb-8`                | Before footer           | 2%        |

### **Complete Section Examples**

#### Example 1: Standard Content Section with SectionHeader

```tsx
import { SectionHeader } from "@/components/sections";
import { VideoCard16by9 } from "@/components/cards";

<section id="features" className="w-full py-8 md:py-16 bg-white">
  <SectionHeader
    title="Dein Zuhause zieht um"
    subtitle="Architektur für ein bewegtes Leben."
  />

  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
    <VideoCard16by9 customData={[VIDEO_CARD_PRESETS.transportabilitaet]} />
  </div>
</section>;
```

**Use Standard Pattern When:**

- Section has title/subtitle header
- Section contains cards, grids, or content components
- Section needs consistent spacing with other sections

#### Example 2: Hero Section (Custom Padding)

```tsx
<section
  id="hero"
  className="w-full bg-white md:pt-12 md:pb-4 flex items-center"
>
  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 hidden md:block">
    <div className="text-center">
      <h1 className="h1-secondary text-gray-900 mb-2 md:mb-3">
        Design für dich gemacht
      </h1>
      <h3 className="h3-secondary text-black mb-8 max-w-3xl mx-auto">
        Dein Design im Freistil.
      </h3>
    </div>
  </div>
</section>
```

**Use Hero Pattern When:**

- First section on page
- Need custom vertical alignment
- Different mobile/desktop layouts
- Video/image background with overlay

#### Example 3: Media Section (No Padding)

```tsx
<section id="video" className="w-full relative bg-white">
  <div className="relative w-full">
    <ClientBlobVideo
      path={IMAGES.variantvideo.ten}
      autoPlay={true}
      muted={true}
      loop={true}
    />

    <div className="absolute inset-0 flex flex-col justify-end">
      <div className="absolute bottom-16 left-0 right-0 flex gap-4 justify-center">
        <Button variant="primary">CTA Button</Button>
      </div>
    </div>
  </div>
</section>
```

**Use Media Pattern When:**

- Full-width video content
- Full-width image galleries
- Media should touch screen edges

#### Example 4: Dark Background Section

```tsx
<section id="materials" className="w-full py-8 md:py-16 bg-black">
  <SectionHeader
    title="Gut für Dich, besser für die Zukunft"
    subtitle="Dein Zuhause aus nachhaltigen Materialien"
    titleClassName="text-white"
    subtitleClassName="text-gray-300"
  />

  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content components */}
  </div>
</section>
```

**Use Dark Background When:**

- Content requires visual separation
- Creating visual rhythm (alternate white/black)
- Highlighting important content

### **Migration Guide: Fixing Inconsistent Patterns**

Current patterns found in EntdeckenClient.tsx and how to standardize them:

#### ✅ Already Standard (Keep As-Is)

```tsx
// Sections 4-7: Already using standard pattern
<section className="w-full py-8 md:py-16 bg-white">
```

#### ⚠️ Needs Update (Non-Standard)

```tsx
// Section 3: Top-only padding
// BEFORE
<section className="w-full pt-8 md:py-16">

// AFTER - Use standard pattern
<section className="w-full py-8 md:py-16 bg-white">
```

```tsx
// Section 8: Bottom-only padding
// BEFORE
<section className="w-full pb-8 md:pb-16 bg-white">

// AFTER - Standard pattern OR reduced bottom if before footer
<section className="w-full py-8 md:py-16 bg-white">
// OR
<section className="w-full pt-8 md:pt-16 pb-4 md:pb-8 bg-white">
```

#### ✅ Special Cases (Document but Keep)

```tsx
// Hero section: Custom padding is intentional
<section className="w-full bg-white md:pt-12 md:pb-4 flex items-center">

// Media section: No padding is intentional
<section className="w-full relative bg-white">
```

### **Background Color Guidelines**

**Standard Backgrounds:**

- `bg-white` - Default for most sections (light content)
- `bg-gray-50` - Subtle variation for alternating sections
- `bg-black` - Dark sections for contrast/emphasis

**Background Alternation Pattern:**

```tsx
// Good visual rhythm
<section className="w-full py-8 md:py-16 bg-white">
<section className="w-full py-8 md:py-16 bg-black">
<section className="w-full py-8 md:py-16 bg-white">
<section className="w-full py-8 md:py-16 bg-gray-50">
```

**Rules:**

- Use `bg-white` as default
- Alternate with `bg-black` for emphasis
- Use `bg-gray-50` sparingly for subtle separation
- Always specify background color explicitly

### **Section Standard Checklist**

When creating new sections, verify:

- [ ] Uses standard padding: `py-8 md:py-16` (unless special case)
- [ ] Has unique `id` for navigation
- [ ] Uses `w-full` for full width
- [ ] Specifies background color (`bg-white`, `bg-black`, etc.)
- [ ] Uses `SectionHeader` component for title/subtitle (when applicable)
- [ ] Content wrapped in proper container with responsive padding
- [ ] Special patterns (Hero, Media) are documented and intentional

### **Benefits of Section Standard**

1. **Visual Consistency**: Uniform spacing creates rhythm
2. **Responsive Design**: Works perfectly on all devices
3. **Maintainable**: Easy to update globally
4. **Predictable**: Developers know what to expect
5. **Accessible**: Proper spacing aids readability
6. **Performance**: Consistent classes = better CSS caching

## **2025 Typography System Summary**

### **Key Principles**

1. **SEO-First**: Proper semantic HTML hierarchy (h1 → h2 → h3 → p)
2. **Modular Design**: Separate color classes from base typography classes
3. **Complete Responsive**: Always include all breakpoints (sm, md, lg, xl, 2xl)
4. **Background Adaptation**: Dynamic color selection based on background
5. **Performance Optimized**: Consistent classes for better CSS reuse

### **Implementation Checklist**

#### For New Components:

- [ ] Use proper semantic HTML structure
- [ ] Apply complete responsive breakpoint patterns
- [ ] Implement background-based color selection
- [ ] Define clear TypeScript interfaces
- [ ] Provide sensible default props
- [ ] Support white/black/gray backgrounds
- [ ] Test on all breakpoints

#### For Typography Updates:

- [ ] Never hardcode colors in base classes
- [ ] Use utility function for color selection
- [ ] Maintain complete responsive scaling
- [ ] Preserve SEO-friendly semantic structure
- [ ] Test accessibility and screen reader compatibility

### **Quick Reference**

```tsx
// Standard modular component pattern
interface Props {
  title?: string;
  subtitle?: string;
  backgroundColor?: "white" | "black" | "gray";
}

export function Component({ backgroundColor = "white", ...props }: Props) {
  const colors = getHeadingColors(backgroundColor);

  return (
    <section className={`w-full py-16 bg-${backgroundColor}`}>
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={`h1-primary ${colors.title} mb-3`}>{props.title}</h1>
        <h3 className={`h3-secondary ${colors.subtitle} mb-8`}>
          {props.subtitle}
        </h3>
      </div>
    </section>
  );
}
```

---

**Last Updated**: January 2025
**Applies To**: All NEST-Haus pages and components
**Status**: Active Standard - SEO & Performance Optimized
