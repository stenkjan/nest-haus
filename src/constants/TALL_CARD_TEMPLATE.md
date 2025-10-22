# Tall Card Template

## Quick Start: Add a New Tall Card in 3 Steps

### Step 1: Add Image to `src/constants/images.ts`

```typescript
// In IMAGES.function section:
export const IMAGES = {
  function: {
    // ... existing images
    yourNewImage: "123-your-image-name-description",
  },
};
```

**Note**: Get the image path from Vercel Blob Storage. If the image doesn't load, you may need the full hash suffix (check browser dev tools for the actual URL).

---

### Step 2: Add Content to `src/constants/cardContent.ts`

Add to `PROCESS_CARDS_CONTENT` array:

```typescript
{
  id: 2, // Increment from last ID
  title: "Your Card Title",
  subtitle: "", // Optional - leave empty if not needed
  description:
    "Your main description text. Can be multiple paragraphs separated by \\n\\n for line breaks.",
  image: IMAGES.function.yourNewImage,
  backgroundColor: "#F4F4F4", // Standard light gray background
  buttons: [
    {
      text: "Primary Button",
      variant: "primary",
      size: "xs",
      link: "/your-link",
    },
    {
      text: "Secondary Button",
      variant: "landing-secondary-blue",
      size: "xs",
      link: "/another-link",
    },
  ],
},
```

**Button Variants Available**:

- `"primary"` - Primary CTA (orange/brand color)
- `"landing-secondary-blue"` - Blue secondary button
- `"secondary"` - Standard secondary

**Button Sizes**: `"xxs"`, `"xs"`, `"sm"`, `"md"`, `"lg"`, `"xl"`

---

### Step 3: Use in Your Component

```tsx
import { UnifiedContentCard } from "@/components/cards";
import { getContentById } from "@/constants/cardContent";

export default function YourPage() {
  // Get your card by ID
  const yourCard = getContentById("processCards", 2); // Use the ID from Step 2

  return (
    <section className="w-full py-8 md:py-16 bg-white">
      {yourCard && (
        <UnifiedContentCard
          layout="video"
          style="standard"
          variant="static"
          heightMode="tall"
          maxWidth={true}
          showInstructions={false}
          customData={[yourCard]}
        />
      )}
    </section>
  );
}
```

---

## Full Configuration Options

### Component Props

```tsx
<UnifiedContentCard
  // REQUIRED FOR TALL CARDS
  layout="video" // Horizontal split (text left, image right)
  heightMode="tall" // 25% taller than standard
  // STYLING
  style="standard" // "standard" (black text) or "glass" (white text)
  variant="static" // "static" (single card) or "responsive" (carousel)
  // LAYOUT
  maxWidth={true} // Apply max-w-[1700px] container (recommended)
  showInstructions={false} // Hide navigation instructions (recommended for static)
  // DATA
  customData={[yourCard]} // Array of card data (single card for static)
/>
```

---

## Automatic Responsive Behavior

Your tall card will automatically adapt to all breakpoints:

### 📱 Mobile (<1024px)

- ✅ Vertical stack (text top, image bottom)
- ✅ Image aspect ratio: 16:10
- ✅ Buttons HIDDEN (design standard)
- ✅ Auto height

### 💻 Tablet (1024px)

- ✅ Horizontal split (text 1/3, image 2/3)
- ✅ Image aspect ratio: 1:1 (square)
- ✅ Image LEFT-aligned
- ✅ Card height: 657.5px
- ✅ Buttons visible

### 🖥️ Desktop (1280px+)

- ✅ Horizontal split (text 1/3, image 2/3)
- ✅ Image fills full height
- ✅ Image LEFT-aligned
- ✅ Card heights: 637.5px → 685px → 787.5px
- ✅ Buttons visible

**All padding, sizing, and animations are handled automatically!**

---

## Advanced: Mobile-Specific Content

Add mobile-specific content for better mobile UX:

```typescript
{
  id: 2,
  title: "Desktop Title (Long Version)",
  mobileTitle: "Mobile Title", // Shorter for small screens
  description: "Full desktop description with all details...",
  mobileDescription: "Shorter mobile description.", // More concise
  // ... rest of config
}
```

---

## Image Guidelines

### Recommended Image Specifications

**Aspect Ratio**: 16:9 or wider works best
**Minimum Width**: 1920px
**Format**: PNG or JPG
**Optimization**: Use compressed images (Next.js will optimize further)

### Image Alignment

- **Desktop**: Image LEFT edge aligns with container
  - Important content should be on the LEFT side of your image
  - Right side may get cropped if image is too wide
- **Mobile**: Image centered, full width visible

---

## Examples from Existing Cards

### Der Auftakt Card (ID: 1)

```tsx
// Used on /entwurf page
const derAuftaktCard = getContentById("processCards", 1);

// Content highlights:
// - Two buttons (Primary + Blue Secondary)
// - Multi-paragraph description with \n\n
// - Standard background color (#F4F4F4)
// - Image: 305-nest-haus-entwurf-vorentwurf-planung-erstentwurf-hausbau
```

---

## Troubleshooting

### Image Not Loading?

1. Check if image path is in `IMAGES.function`
2. Verify image exists in Vercel Blob Storage
3. May need full hash suffix (check browser dev tools for actual URL)
4. Example: `'305-nest-haus-entwurf-vorentwurf-planung-erstentwurf-hausbau-fsDTj18IUKotaAYdX9FhE0oAYGXecO'`

### Buttons Not Showing on Desktop?

- Check that `buttons` array is defined in card content
- Verify button `variant` is spelled correctly
- Buttons are intentionally HIDDEN on mobile (<1024px)

### Card Height Looks Wrong?

- Ensure `heightMode="tall"` is set
- Check that `layout="video"` is used (not "horizontal")
- Verify `variant="static"` for single cards

### Text Color Wrong?

- `style="standard"` → Black text, light background
- `style="glass"` → White text, dark background
- Text color is determined by `style` prop, NOT by `backgroundColor` in card content

---

## Need Help?

Check the full documentation in:

- `src/constants/contentCardPresets.ts` - Complete preset guide
- `src/components/cards/UnifiedContentCard.tsx` - Component implementation
- `src/app/entwurf/EntwurfClient.tsx` - Working example
