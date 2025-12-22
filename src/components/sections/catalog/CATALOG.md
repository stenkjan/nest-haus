# 📚 Section Catalog

**Your reference library of all unique sections across the Nest-Haus website.**

Browse, copy, and paste sections wherever you need them.

---

## 1. Transportabilitaet

**What it is:** "Dein Zuhause zieht um" section with transportability video  
**Content:** Header + VideoCard with transport animation  
**Currently used on:** `/entdecken` (Section 3)

**Required imports:**

```tsx
import { SectionHeader } from "@/components/sections";
import { VideoCard16by9 } from "@/components/cards";
import { IMAGES } from "@/constants/images";
```

**Code to copy:**

```tsx
<section id="transportabilitaet" className="w-full py-8 md:py-16 bg-white">
  <SectionHeader
    title="Dein Zuhause zieht um"
    subtitle="Architektur für ein bewegtes Leben."
    wrapperMargin="md:mb-12 mb-12"
  />

  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
    <VideoCard16by9
      maxWidth={false}
      showInstructions={false}
      cardTitle="Unsere Technik"
      cardDescription="Aufbauen. Mitnehmen. Weitergeben.\nGanz wie du willst. Dank hochpräziser Konstruktion entsteht dein Zuhause in kürzester Zeit, an nahezu jedem Ort. Und wenn du weiterziehst? Dann ziehst du nicht nur um, sondern nimmst dein Zuhause einfach mit. Oder du bleibst flexibel und verkaufst es weiter, so wie ein gut gepflegtes Auto."
      videoPath={IMAGES.videos.nestHausTransport}
      backgroundColor="#F4F4F4"
      buttons={[
        {
          text: "Unser Part",
          variant: "primary",
          size: "xs",
          link: "/entwurf",
        },
        {
          text: "Jetzt bauen",
          variant: "landing-secondary-blue",
          size: "xs",
          link: "/konfigurator",
        },
      ]}
    />
  </div>
</section>
```

**To edit:**

- **Section header:** Change `title` and `subtitle` props in SectionHeader
- **Card title:** Change `cardTitle` prop
- **Card description:** Change `cardDescription` prop (use `\n` for line breaks)
- **Video:** Change `videoPath` to use different video from IMAGES
- **Background color:** Change `backgroundColor` (hex color)
- **Button variants:** Change `variant` for each button (options: `primary`, `secondary`, `landing-secondary-blue`, etc.)
- **Button links:** Change `link` to point to different pages

---

## 2. Konfigurationen

**What it is:** "Konfiguriere ®Hoam House" section with configurator video  
**Content:** Header + VideoCard showing configurator options  
**Currently used on:** `/entdecken` (Section 5)

**Required imports:**

```tsx
import { SectionHeader } from "@/components/sections";
import { VideoCard16by9 } from "@/components/cards";
import { IMAGES } from "@/constants/images";
```

**Code to copy:**

```tsx
<section id="konfigurieren" className="w-full py-8 md:py-16 bg-white">
  <SectionHeader
    title="Konfiguriere ®Hoam House"
    subtitle="Individualisiert, wo es Freiheit braucht. Standardisiert, wo es Effizienz schafft."
    wrapperMargin="mb-12"
  />

  <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
    <VideoCard16by9
      maxWidth={false}
      showInstructions={false}
      cardTitle="Du hast die Wahl"
      cardDescription="Gestalte dein Zuhause so individuell wie dein Leben. In unserem Online-Konfigurator wählst du Größe, Materialien, Ausstattung und Optionen Schritt für Schritt aus. Jede Entscheidung zeigt dir sofort, wie dein Haus aussieht und was es kostet.\nSo erhältst du volle Transparenz und ein realistisches Bild, wie dein Nest-Haus zu deinen Wünschen, deinem Grundstück und deinem Budget passt."
      videoPath={IMAGES.variantvideo.twelve}
      backgroundColor="#F4F4F4"
      playbackRate={0.5}
      buttons={[
        {
          text: "Unser Part",
          variant: "primary",
          size: "xs",
          link: "/unser-part",
        },
        {
          text: "Jetzt bauen",
          variant: "secondary",
          size: "xs",
          link: "/konfigurator",
        },
      ]}
    />
  </div>
</section>
```

**To edit:**

- **Section header:** Change `title` and `subtitle` props in SectionHeader
- **Card title:** Change `cardTitle` prop
- **Card description:** Change `cardDescription` prop (use `\n` for line breaks)
- **Video:** Change `videoPath` to use different video from IMAGES
- **Background color:** Change `backgroundColor` (hex color)
- **Playback speed:** Change `playbackRate` (1.0 = normal, 0.5 = half speed, 2.0 = double speed)
- **Button variants:** Change `variant` for each button (options: `primary`, `secondary`, `landing-secondary-blue`, etc.)
- **Button links:** Change `link` to point to different pages

---

## 3. Moeglichkeiten-Entdecken

**What it is:** "Was macht dein Nest aus?" section with 2x2 grid of feature cards  
**Content:** Header + TwoByTwoImageGrid with customizable text colors and button variants per card  
**Currently used on:** `/entdecken` (Section 4)

**Required imports:**

```tsx
import { SectionHeader } from "@/components/sections";
import { TwoByTwoImageGrid } from "@/components/grids";
import { IMAGES } from "@/constants/images";
```

**Code to copy:**

```tsx
<section id="moeglichkeiten" className="w-full py-8 md:py-16 bg-white">
  <SectionHeader
    title="Was macht dein Nest aus?"
    subtitle="Entdecke die Möglichkeiten deines zukünftigen Zuhauses."
    wrapperMargin="mb-12"
  />

  <div className="w-full">
    <TwoByTwoImageGrid
      maxWidth={false}
      customData={[
        {
          id: 1,
          title: "Das ®Hoam System",
          subtitle: "Effizient. Präzise. Leistbar.",
          description: "Dein Raum. Deine Ideen.",
          image: IMAGES.function.nestHausSystemModulbau,
          backgroundColor: "#F8F9FA",
          textColor: "white",
          primaryAction: "Das Nest System",
          secondaryAction: "Jetzt bauen",
          primaryButtonVariant: "landing-primary",
          secondaryButtonVariant: "landing-secondary",
          primaryLink: "/hoam-system",
          secondaryLink: "/konfigurator",
        },
        {
          id: 2,
          title: "Dein Zuhause aus Holz",
          subtitle: "Gut für Dich. Besser für die Zukunft.",
          description: "Qualität aus Österreich.",
          image: IMAGES.function.nestHausMaterialienSchema,
          backgroundColor: "#F4F4F4",
          textColor: "black",
          primaryAction: "Die Materialien",
          secondaryAction: "Jetzt bauen",
          primaryButtonVariant: "landing-primary",
          secondaryButtonVariant: "landing-secondary-blue",
          primaryLink: "/dein-part#materialien",
          secondaryLink: "/konfigurator",
        },
        {
          id: 3,
          title: "Fenster und Türenausbau",
          subtitle: "Wir hören zu. Du entscheidest.",
          description: "Deine Fenster für deine Räume.",
          image: IMAGES.function.nestHausInnenausbauFenster,
          backgroundColor: "#F8F9FA",
          textColor: "white",
          primaryAction: "Fenster & Türen",
          secondaryAction: "Jetzt bauen",
          primaryButtonVariant: "landing-primary",
          secondaryButtonVariant: "landing-secondary",
          primaryLink: "/dein-part#fenster-tueren",
          secondaryLink: "/konfigurator",
        },
        {
          id: 4,
          title: "Individuell wie du",
          subtitle: "Deine Ideen. Dein Zuhause.",
          description: "Dein Raum. Deine Ideen.",
          image: IMAGES.function.nestHausSystemDeinPart,
          backgroundColor: "#F4F4F4",
          textColor: "white",
          primaryAction: "Dein Part",
          secondaryAction: "Jetzt bauen",
          primaryButtonVariant: "landing-primary",
          secondaryButtonVariant: "landing-secondary",
          primaryLink: "/dein-part",
          secondaryLink: "/konfigurator",
        },
      ]}
    />
  </div>
</section>
```

**To edit:**

- **Header text:** Change `title` and `subtitle` props in SectionHeader
- **Text color per card:** Set `textColor: "white"` or `textColor: "black"` for each item
- **Button variants per card:** Set `primaryButtonVariant` and `secondaryButtonVariant` (options: `landing-primary`, `landing-secondary`, `landing-secondary-blue`, etc.)
- **Card content:** Modify title, subtitle, description, image, backgroundColor for each item
- **Links:** Change `primaryLink` and `secondaryLink` to point to different pages

**Available button variants:**

- `landing-primary`, `landing-secondary`, `landing-secondary-blue`, `landing-secondary-blue-white`
- `primary`, `secondary`, `primary-narrow`, `secondary-narrow`
- `secondary-narrow-white`, `secondary-narrow-blue`
- `tertiary`, `outline`, `ghost`, `danger`, `success`, `info`, `configurator`

---

## How to Use This Catalog

### 1️⃣ Browse

Scroll through this catalog to see all your unique sections

### 2️⃣ Copy

Find the section you need and copy the code

### 3️⃣ Paste

Add it to any page (e.g., `EntdeckenClient.tsx`, `UnserPartClient.tsx`)

### 4️⃣ Customize

- Change section ID
- Adjust spacing/colors
- Modify header text
- Use different presets

### 5️⃣ Add to Catalog

When you create a new unique section, document it here so you can reuse it later!

---

## Customization Tips

**Change section ID:**

```tsx
id = "your-custom-id";
```

**Adjust spacing:**

```tsx
className = "w-full py-12 md:py-24 bg-white"; // More padding
className = "w-full py-4 md:py-8 bg-white"; // Less padding
```

**Change background:**

```tsx
className = "w-full py-8 md:py-16 bg-gray-50";
```

**Different header margin:**

```tsx
wrapperMargin = "mb-8"; // Less space
wrapperMargin = "mb-16"; // More space
```

**Use different video:**

```tsx
videoPath={IMAGES.videos.yourVideo}
```

---

## Adding New Sections

When you build a new unique section:

1. **Add it to this catalog** with:
   - Name and description
   - Where it's currently used
   - Required imports
   - Complete code to copy
   - Edit instructions

2. **Add a catalog comment** in your page:

```tsx
{
  /* 📚 Catalog: @sections/catalog/CATALOG.md → "Your Section Name" */
}
```

This way you always know where sections came from and can easily find them again!
