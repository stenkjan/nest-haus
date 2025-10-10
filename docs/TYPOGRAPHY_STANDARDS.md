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

```tsx
<SectionHeader
  title="Section Title"
  subtitle="Section Subtitle"
  titleClassName="text-gray-900 font-bold" // Specify font-weight explicitly
  subtitleClassName="text-gray-600"
/>
```

### GetInContactBanner Component

```tsx
<GetInContactBanner
  id="section-id"
  title="Custom Title" // Optional
  subtitle="Custom Subtitle" // Optional
  backgroundColor="#F4F4F4" // Optional
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
