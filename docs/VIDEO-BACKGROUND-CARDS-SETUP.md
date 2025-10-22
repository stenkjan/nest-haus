# Video Background Cards Setup Complete

## ✨ UPDATE: Enhanced Navigation for Variable-Width Cards

The navigation system has been improved to handle cards with different widths seamlessly!

**What's Fixed:**

- ✅ Arrows now positioned at fixed page edges (16px mobile, 24px desktop)
- ✅ Navigation correctly calculates cumulative positions for mixed aspect ratios
- ✅ Smooth centering when navigating between narrow (2x1) and wide (1x1) cards
- ✅ Responsive resize handling maintains proper card positioning

**Arrow Positioning:**

- Left arrow: `left: 16px` (mobile) or `24px` (desktop)
- Right arrow: `right: 16px` (mobile) or `24px` (desktop)
- No more complex calculations based on card width
- Consistent positioning across all card types and sizes

---

## ✨ NEW: Per-Card Aspect Ratio Support

Each video background card can now specify its **own aspect ratio** (2x1 or 1x1), allowing you to **mix different aspect ratios seamlessly in the same carousel**!

**Aspect Ratio Details:**

- **"2x1"**: Creates a **2.2:1 aspect ratio** (width is 2.2x the height) - Extra Wide format
- **"1x1"**: Creates a **1.2:1 aspect ratio** (width is 1.2x the height) - Wide format

**Both cards are now WIDER than before!**

**Example:**

```typescript
{
  id: 1,
  title: "My Card",
  description: "Card description",
  video: IMAGES.videos.videoCard01,
  backgroundColor: "#121212",
  aspectRatio: "2x1", // This card is extra wide (2.2:1)!
}
```

**📖 See `docs/PER-CARD-ASPECT-RATIO-GUIDE.md` for detailed documentation.**

---

## ✅ What Was Added

### 1. Videos in `images.ts`

Added 16 new video files to the `videos` section:

- `videoCard01` → `350-nest-haus-video-cards-01`
- `videoCard02` → `351-nest-haus-video-cards-02`
- ... continuing through ...
- `videoCard16` → `365-nest-haus-video-cards-16`

All videos are `.mp4` format and accessible via `IMAGES.videos.videoCard01` through `videoCard16`.

### 2. New Content Category: `videoBackgroundCards`

Created 16 cards with minimal text (5 words for description, title for H3):

**Sample Cards:**

1. **Title**: "Moderne Architektur trifft Natur" | **Description**: "Zeitloses Design fürs Leben"
2. **Title**: "Flexibel wohnen nach Maß" | **Description**: "Dein Zuhause wächst mit"
3. **Title**: "Nachhaltigkeit trifft Innovation" | **Description**: "Grünes Bauen für morgen"
   ... and 13 more

### 3. Integration with Overlay-Text Cards

The new video background cards work perfectly with the overlay-text layout:

**Usage Example:**

```tsx
import { getContentByCategory } from "@/constants/cardContent";

const videoBackgroundCards = getContentByCategory("videoBackgroundCards");

<UnifiedContentCard
  layout="overlay-text"
  style="standard"
  variant="responsive"
  aspectRatio="2x1" // or "1x1"
  customData={videoBackgroundCards}
/>;
```

## 📍 Live Demo

Visit `http://localhost:3000/entwurf` to see:

1. **Original Tall Cards** (restored)
   - Der Auftakt (no padding)
   - Die Basis (with padding)

2. **Material Cards** (image backgrounds)
   - 2x1 Portrait
   - 1x1 Square

3. **NEW: Video Background Cards** (16 videos)
   - Section 1: 2x1 Portrait format
   - Section 2: 1x1 Square format

## 🎨 Card Text Structure

Each video background card has:

- **Description** (p-primary): ~5 words, top line
- **Title** (h3-secondary): Longer descriptive title, bold, second line
- **Video**: Full background (edge-to-edge)
- **Dark Overlay**: 30% black for text readability

## 📦 Content Structure

```typescript
{
  id: number,
  title: string,              // H3 - bold, second line
  subtitle: "",               // Not used for these cards
  description: string,        // P - first line (5 words)
  video: string,              // Path to video file
  backgroundColor: "#121212"
}
```

## 🔗 How to Use Anywhere

```tsx
// Option 1: Use category name
<UnifiedContentCard
  layout="overlay-text"
  category="videoBackgroundCards"
  aspectRatio="2x1"
/>;

// Option 2: Use getContentByCategory
const cards = getContentByCategory("videoBackgroundCards");
<UnifiedContentCard
  layout="overlay-text"
  customData={cards}
  aspectRatio="1x1"
/>;

// Option 3: Use specific cards
const cards = getContentByCategory("videoBackgroundCards").slice(0, 5); // First 5 only
<UnifiedContentCard
  layout="overlay-text"
  customData={cards}
  aspectRatio="2x1"
/>;
```

## 📋 All Video Cards Content

Cards **1, 3, 5** are **2x1 (portrait)** • Cards **2, 4, 6** are **1x1 (square)** - creating a mixed aspect ratio demo!

| ID  | Title                                   | Description                          | Video       | Aspect Ratio |
| --- | --------------------------------------- | ------------------------------------ | ----------- | ------------ |
| 1   | Moderne Architektur trifft Natur        | Zeitloses Design fürs Leben          | videoCard01 | **2x1**      |
| 2   | Flexibel wohnen nach Maß                | Dein Zuhause wächst mit              | videoCard02 | **1x1**      |
| 3   | Nachhaltigkeit trifft Innovation        | Grünes Bauen für morgen              | videoCard03 | **2x1**      |
| 4   | Transparenz durch großzügige Verglasung | Licht durchflutet jeden Raum         | videoCard04 | **1x1**      |
| 5   | Natürliche Materialien erleben          | Holz schafft warme Atmosphäre        | videoCard05 | **2x1**      |
| 6   | Intelligente Raumkonzepte entdecken     | Jeder Quadratmeter zählt hier        | videoCard06 | **1x1**      |
| 7   | Effizienz im modernen Wohnbau           | Schnell gebaut trotz Qualität        | videoCard07 | -            |
| 8   | Energieautark in die Zukunft            | Photovoltaik macht dich unabhängig   | videoCard08 | -            |
| 9   | Minimalistisch und funktional leben     | Weniger ist oft deutlich mehr        | videoCard09 | -            |
| 10  | Natur als ständiger Begleiter           | Draußen und drinnen verschmelzen     | videoCard10 | -            |
| 11  | Modulares Bauen neu gedacht             | Flexibel wie dein Lebensstil         | videoCard11 | -            |
| 12  | Präzision durch seriellen Bau           | Qualität kommt aus Perfektion        | videoCard12 | -            |
| 13  | Wohnraum für jede Lebenslage            | Anpassbar wie du es brauchst         | videoCard13 | -            |
| 14  | Hochwertige Details im Fokus            | Verarbeitung auf höchstem Niveau     | videoCard14 | -            |
| 15  | Zeitlose Eleganz vereint Komfort        | Stil bleibt über Jahrzehnte          | videoCard15 | -            |
| 16  | Zukunftssicher und wertbeständig        | Investition in kommende Generationen | videoCard16 | -            |

_Cards 7-16 use default/fallback aspect ratio (can be set via component prop)_

## ✨ Features

- ✅ 16 unique video backgrounds
- ✅ Minimal text (5 words + title)
- ✅ Works with both aspect ratios (2x1, 1x1)
- ✅ **NEW: Per-card aspect ratio control** - mix 2x1 and 1x1 in same carousel!
- ✅ Auto-playing, looping videos
- ✅ Dark overlay for text readability
- ✅ Responsive carousel
- ✅ Standard heights across all breakpoints
- ✅ Smooth animations
- ✅ Touch-optimized for mobile

## 🎯 Perfect For

- Hero sections
- Feature showcases
- Dynamic galleries
- Video-driven content pages
- Marketing sections
- Portfolio displays
