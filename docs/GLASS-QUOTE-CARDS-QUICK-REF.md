# Glass Quote Cards - Quick Reference

## 🚀 Quick Start

```tsx
<UnifiedContentCard
  layout="glass-quote"
  style="glass"
  variant="responsive"
  category="glassQuoteCards"
  backgroundColor="black"
/>
```

## 📝 Text Format

```
"Quote with **bold text**|||Author Name|||Author Title"
```

**Example:**
```typescript
{
  id: 1,
  description: "Ein **zukunftsweisendes** Projekt|||Prof. Dr. Name|||University Title",
  backgroundColor: "#121212",
}
```

## 🎨 Visual Elements

- **Quote Mark:** Large serif `"` in white/90
- **Bold Text:** White, semibold (wrap in `**...**`)
- **Normal Text:** Gray-400
- **Attribution Name:** White, semibold
- **Attribution Title:** Gray-400

## 📐 Responsive Sizes

| Screen | Cards Visible | Width Ratio |
|--------|--------------|-------------|
| Mobile | 1.3 | 0.9x |
| Tablet | 1.5 | 1.2x |
| Desktop+ | 1.5-1.9 | 1.2x |

## 🎯 Best On

✅ Black backgrounds
✅ Testimonials sections
✅ About pages
✅ 2-4 sentence quotes

❌ Light backgrounds
❌ Long paragraphs
❌ Busy image backgrounds

## 📦 Import

```tsx
// Component
import { UnifiedContentCard } from "@/components/cards";

// Content
import { GLASS_QUOTE_CARDS_CONTENT } from "@/constants/cardContent";

// Preset
import { GLASS_QUOTE_CARDS_PRESET } from "@/constants/contentCardPresets";
```

## 🔗 Links

- **Full Guide:** `docs/GLASS-QUOTE-CARDS-GUIDE.md`
- **Summary:** `docs/GLASS-QUOTE-CARDS-SUMMARY.md`
- **Demo:** `http://localhost:3000/showcase/cards`

## 💡 Pro Tips

1. Keep quotes under 100 words
2. Bold 2-4 key phrases max
3. Always use dark backgrounds
4. Include full attribution
5. Test text wrapping on mobile

