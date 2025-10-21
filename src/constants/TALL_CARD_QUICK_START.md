# Tall Card Quick Start Guide

## 🚀 Ultra-Fast Setup (2 Minutes)

### Two Variants Available

1. **No Padding** - Image fills to card edges (like "Der Auftakt")
2. **With Padding** - 15px gap around image (like other cards)

### Method 1: No Padding (Edge-to-Edge Image)

```tsx
// 1. Add to PROCESS_CARDS_CONTENT in src/constants/cardContent.ts
{
  id: 2, // Next available ID
  title: "Your Title",
  subtitle: "",
  description: "Your description...",
  image: IMAGES.function.yourImage, // Add to images.ts first
  backgroundColor: "#F4F4F4",
  buttons: [
    { text: "Button 1", variant: "primary", size: "xs", link: "/link" },
    { text: "Button 2", variant: "landing-secondary-blue", size: "xs", link: "/link2" },
  ],
}

// 2. Use in your component
import { getTallCard, TALL_CARD_PROPS } from "@/constants/cardContent";
import { UnifiedContentCard } from "@/components/cards";

const myCard = getTallCard(2);

<UnifiedContentCard {...TALL_CARD_PROPS} customData={[myCard]} />
```

### Method 2: With Padding (Standard Gap)

```tsx
// 1. Same content setup as above

// 2. Use TALL_CARD_PROPS_WITH_PADDING instead
import {
  getTallCard,
  TALL_CARD_PROPS_WITH_PADDING,
} from "@/constants/cardContent";
import { UnifiedContentCard } from "@/components/cards";

const myCard = getTallCard(2);

<UnifiedContentCard {...TALL_CARD_PROPS_WITH_PADDING} customData={[myCard]} />;
```

**Done!** Your tall card will automatically:

- ✅ Adapt to all breakpoints (mobile/tablet/desktop)
- ✅ Show/hide buttons appropriately
- ✅ Scale height correctly (25% taller than standard)
- ✅ Align images properly (left-aligned on desktop)

---

## 📋 Available Props (All Optional with Spread)

```tsx
// No padding (edge-to-edge image)
<UnifiedContentCard {...TALL_CARD_PROPS} customData={[myCard]} />

// With padding (15px gap around image)
<UnifiedContentCard {...TALL_CARD_PROPS_WITH_PADDING} customData={[myCard]} />

// Override specific props if needed
<UnifiedContentCard
  {...TALL_CARD_PROPS}
  style="glass" // Change to dark mode
  customData={[myCard]}
/>
```

**What's in `TALL_CARD_PROPS`?**

```tsx
{
  layout: "video",           // Horizontal split
  style: "standard",         // Black text, light bg
  variant: "static",         // Single card
  heightMode: "tall",        // 25% taller
  imagePadding: "none",      // No padding (edge-to-edge)
  maxWidth: true,            // Max-width container
  showInstructions: false,   // Hide nav instructions
}
```

**What's in `TALL_CARD_PROPS_WITH_PADDING`?**

```tsx
{
  layout: "video",
  style: "standard",
  variant: "static",
  heightMode: "tall",
  imagePadding: "standard",  // 15px padding around image
  maxWidth: true,
  showInstructions: false,
}
```

---

## 🎨 Button Variants

```tsx
// Primary button (orange/brand)
{
  variant: "primary";
}

// Blue secondary
{
  variant: "landing-secondary-blue";
}

// Standard secondary
{
  variant: "secondary";
}

// Narrow variants (less padding)
{
  variant: "primary-narrow";
}
{
  variant: "secondary-narrow-blue";
}
```

---

## 📱 Automatic Breakpoint Behavior

| Breakpoint            | Layout             | Image            | Buttons | Height    |
| --------------------- | ------------------ | ---------------- | ------- | --------- |
| **Mobile** (<1024px)  | Vertical           | 16:10 centered   | Hidden  | Auto      |
| **Tablet** (1024px)   | Horizontal 1/3-2/3 | 1:1 left-aligned | Visible | 657px     |
| **Desktop** (1280px+) | Horizontal 1/3-2/3 | Full height left | Visible | 638-788px |

---

## 🔧 Common Customizations

### Change Background Color

```tsx
// In cardContent.ts
backgroundColor: "#FFFFFF",  // White
backgroundColor: "#F4F4F4",  // Light gray (default)
backgroundColor: "#000000",  // Black
```

### Dark Mode Card

```tsx
<UnifiedContentCard
  {...TALL_CARD_PROPS}
  style="glass" // White text on dark background
  customData={[myCard]}
/>
```

### No Buttons

```tsx
// Simply omit buttons in card content
{
  id: 2,
  title: "Title",
  description: "Description",
  image: IMAGES.function.yourImage,
  backgroundColor: "#F4F4F4",
  // No buttons property
}
```

### Mobile-Specific Text

```tsx
{
  id: 2,
  title: "Long Desktop Title With All Details",
  mobileTitle: "Short Title",
  description: "Full desktop description...",
  mobileDescription: "Shorter mobile version.",
  // ... rest
}
```

---

## 📖 Full Documentation

- **Template Guide**: `src/constants/TALL_CARD_TEMPLATE.md`
- **Preset Details**: `src/constants/contentCardPresets.ts`
- **Working Example**: `src/app/entwurf/EntwurfClient.tsx`

---

## 💡 Tips

1. **Image recommendations**: 16:9 aspect ratio, 1920px+ width, LEFT-side content important
2. **Button text**: Keep short (max 2-3 words) for mobile
3. **Description length**: 2-4 sentences optimal, use `\n\n` for paragraphs
4. **Testing**: Always test on mobile, tablet (1024px), and desktop (1280px+)

---

## 🐛 Troubleshooting

**Image not loading?**
→ Add full hash suffix to image path in `images.ts`

**Buttons not showing?**
→ Check `buttons` array in card content, verify desktop viewport (>1024px)

**Wrong text color?**
→ Use `style="standard"` (black) or `style="glass"` (white)

**Card too short?**
→ Verify `heightMode="tall"` in props

---

**Questions?** Check `TALL_CARD_TEMPLATE.md` for detailed examples and troubleshooting.
