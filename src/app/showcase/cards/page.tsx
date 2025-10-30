"use client";

import { ButtonShowcase } from "@/components/ui";
import {
  UnifiedContentCard,
  PlanungspaketeCards,
  PlanungspaketeCardsLightbox,
} from "@/components/cards";
import { IMAGES } from "@/constants/images";

export default function CardsShowcasePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 overflow-x-hidden">
      <div className="space-y-16">
        {/* Page Header */}
        <section>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Card Components Showcase
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our collection of responsive card layouts: content cards,
              glass effects, square cards with structured layout (text top 50%,
              image bottom 50%), lightbox views, and interactive elements. Each
              component adapts beautifully to different screen sizes and
              interaction methods.
            </p>
          </div>
        </section>

        {/* Content Cards Section - Responsive */}
        <section className="overflow-visible">
          <UnifiedContentCard
            layout="horizontal"
            style="standard"
            variant="responsive"
            category="materialien"
            title="Content Cards Responsive"
            subtitle="Automatically adapts: Wide layout on desktop, mobile layout on tablets/phones • Navigate with arrow keys or swipe"
            maxWidth={false}
            enableLightbox={true}
          />
        </section>

        {/* Planungspakete Cards Section - Clickable Cards with Lightbox */}
        <section className="overflow-visible">
          <PlanungspaketeCards
            title="Planungspakete Cards"
            subtitle="Planning packages with pricing information • Grid layout for easy comparison"
            maxWidth={false}
            enableBuiltInLightbox={false}
          />

          {/* Lightbox Button for Planungspakete Cards */}
          <div className="flex justify-center mt-8">
            <PlanungspaketeCardsLightbox
              title="Planungspakete Cards - Lightbox View"
              subtitle="Detailed view with extended descriptions • Click outside or press ESC to close"
              triggerText="Open Planungspakete in Lightbox"
              triggerClassName="mx-2"
            />
          </div>
        </section>

        {/* Content Cards Static Section - Single Responsive Card */}
        <section className="overflow-visible">
          <UnifiedContentCard
            layout="horizontal"
            style="standard"
            variant="static"
            category="materialien"
            title="Content Cards Static"
            subtitle="Single responsive card: Wide layout on desktop, mobile layout on tablets/phones"
            maxWidth={false}
            enableLightbox={true}
          />
        </section>

        {/* Konfigurationen Card Section */}
        <section className="overflow-visible">
          <UnifiedContentCard
            layout="video"
            variant="static"
            title="Konfigurationen Video Card"
            subtitle="Video card with direct props • Wide layout on desktop, mobile layout on tablets/phones"
            maxWidth={false}
            customData={[
              {
                id: 1,
                title: "Du hast die Wahl",
                subtitle: "",
                description:
                  "Gestalte dein Zuhause so individuell wie dein Leben. In unserem Online-Konfigurator wählst du Größe, Materialien, Ausstattung und Optionen Schritt für Schritt aus. Jede Entscheidung zeigt dir sofort, wie dein Haus aussieht und was es kostet.\nSo erhältst du volle Transparenz und ein realistisches Bild, wie dein Nest-Haus zu deinen Wünschen, deinem Grundstück und deinem Budget passt.",
                video: IMAGES.variantvideo.twelve,
                backgroundColor: "#F4F4F4",
                playbackRate: 0.5,
                buttons: [
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
                ],
              },
            ]}
          />

          {/* Note: Video layout in UnifiedContentCard doesn't have a lightbox variant yet */}
        </section>

        {/* Video Card 16by9 Section */}
        <section className="overflow-visible">
          <UnifiedContentCard
            layout="video"
            variant="static"
            title="Transportabilitaet Video Card"
            subtitle="Video content with 16:9 aspect ratio on desktop, 16:10 on mobile • Same text space as content cards"
            maxWidth={false}
            customData={[
              {
                id: 1,
                title: "Unsere Technik",
                subtitle: "",
                description:
                  "Aufbauen. Mitnehmen. Weitergeben.\nGanz wie du willst. Dank hochpräziser Konstruktion entsteht dein Zuhause in kürzester Zeit, an nahezu jedem Ort. Und wenn du weiterziehst? Dann ziehst du nicht nur um, sondern nimmst dein Zuhause einfach mit. Oder du bleibst flexibel und verkaufst es weiter, so wie ein gut gepflegtes Auto.",
                video: IMAGES.videos.nestHausTransport,
                backgroundColor: "#F4F4F4",
                buttons: [
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
                ],
              },
            ]}
          />
        </section>

        {/* Square Text Card Section */}
        <section className="overflow-visible">
          <UnifiedContentCard
            layout="text-icon"
            style="standard"
            variant="responsive"
            title="Square Text Cards (Text-Icon Layout)"
            subtitle="Square cards with text and optional icons • Navigate with arrow keys or swipe"
            maxWidth={false}
            customData={[
              {
                id: 1,
                title: "1. Vorentwurf",
                subtitle: "Fenster, Türen, Innenwände",
                description:
                  "Bevor wir starten, prüfen wir gemeinsam die Machbarkeit deines Projekts auf deinem Grundstück. \n\n Im Vorentwurfsplan legen wir Fenster, Türen und Innenwände nach deinen Wünschen fest und stimmen diese Planung mit der zuständigen Gemeinde ab.",
                backgroundColor: "#F9FAFB",
                iconNumber: 1,
              },
              {
                id: 2,
                title: "2. Einreichplanung",
                subtitle: "Zwei Wege zum Ziel",
                description:
                  "Nach dem Vorentwurf erstellen wir die komplette Einreichplanung und reichen diese bei der zuständigen Gemeinde ein. Ab hier hast du die Wahl, wie du mit der Bestellung deines Nest Hauses fortfährst.",
                backgroundColor: "#F9FAFB",
                iconNumber: 2,
              },
              {
                id: 3,
                title: "3. Positiver Baubescheid",
                subtitle: "Grundstücksvorbereitung & Fundament",
                description:
                  "Sobald dein Baubescheid vorliegt, startet die Vorbereitung deines Grundstücks. Dazu gehören alle notwendigen Erschließungsarbeiten wie Strom- und Wasseranschluss, Kanal sowie die Zufahrt.",
                backgroundColor: "#F9FAFB",
                iconNumber: 3,
              },
            ]}
            enableLightbox={false}
          />
        </section>

        {/* Content Cards Glass Section - Responsive */}
        <section className="overflow-visible bg-black py-16 -mx-4 px-4">
          <UnifiedContentCard
            layout="horizontal"
            style="glass"
            variant="responsive"
            category="materialien"
            title="Content Cards Responsive Glass"
            subtitle="Automatically adapts: Wide layout on desktop, mobile layout on tablets/phones • Navigate with arrow keys or swipe"
            maxWidth={false}
            backgroundColor="black"
            enableLightbox={true}
          />
        </section>

        {/* Content Cards Glass Static Section - Single Responsive Card */}
        <section className="overflow-visible bg-black py-16 -mx-4 px-4">
          <UnifiedContentCard
            layout="horizontal"
            style="glass"
            variant="static"
            category="materialien"
            title="Content Cards Static Glass"
            subtitle="Single responsive glass card: Wide layout on desktop, mobile layout on tablets/phones"
            maxWidth={false}
            backgroundColor="black"
            enableLightbox={true}
          />
        </section>

        {/* Image Glass Card Section */}
        <section className="overflow-visible bg-black py-16 -mx-4 px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Image Glass Card (Image-Only Layout)
            </h2>
            <p className="text-gray-300">
              Single image card with glass morphism effect
            </p>
          </div>
          <UnifiedContentCard
            layout="image-only"
            style="glass"
            variant="static"
            backgroundColor="black"
            maxWidth={false}
            showInstructions={false}
            customData={[
              {
                id: 1,
                title: "NEST-Haus Hand Drawing",
                subtitle: "",
                description: "",
                image: IMAGES.function.nestHausHandDrawing,
                backgroundColor: "#121212",
              },
            ]}
            enableLightbox={false}
          />
        </section>

        {/* Square Glass Card Section */}
        <section className="overflow-visible bg-black py-16 -mx-4 px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Square Glass Card (Square Layout)
            </h2>
            <p className="text-gray-300">
              Square card with title/subtitle/description (top) and image with
              2:3 aspect ratio (bottom)
            </p>
          </div>
          <UnifiedContentCard
            layout="square"
            style="glass"
            variant="static"
            backgroundColor="black"
            maxWidth={false}
            showInstructions={false}
            customData={[
              {
                id: 1,
                title: "NEST-Haus Design",
                subtitle: "Modern Alpine Architecture",
                description:
                  "Innovative modular design combining traditional alpine aesthetics with contemporary sustainability.",
                image:
                  "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
                backgroundColor: "#121212",
              },
            ]}
            enableLightbox={false}
          />
        </section>

        {/* Square Glass Cards Scroll Section */}
        <section className="overflow-visible bg-black py-16 -mx-4 px-4">
          <UnifiedContentCard
            layout="square"
            style="glass"
            variant="responsive"
            category="materialien"
            backgroundColor="black"
            title="Square Glass Cards Scroll"
            subtitle="Each card: title/subtitle/description (top) + image with 2:3 ratio (bottom) • Navigate with arrow keys or swipe"
            maxWidth={false}
            enableLightbox={false}
            onCardClick={(cardId) => console.log(`Clicked card ${cardId}`)}
          />
        </section>

        {/* Glass Quote Cards Section */}
        <section className="overflow-visible bg-black py-16">
          <UnifiedContentCard
            layout="glass-quote"
            style="glass"
            variant="responsive"
            category="glassQuoteCards"
            title="Glass Quote Cards"
            subtitle="Quote-style cards with glass background and mixed bold/gray text • Perfect for testimonials and impactful statements"
            maxWidth={false}
            backgroundColor="black"
            showInstructions={true}
          />
        </section>

        {/* Button Showcase Section - Constrained Width */}
        <section>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Button Components
              </h2>
              <p className="text-gray-600">
                Various button styles and variants
              </p>
            </div>
            <ButtonShowcase />
          </div>
        </section>
      </div>
    </div>
  );
}
