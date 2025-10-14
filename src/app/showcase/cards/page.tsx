"use client";

import { ButtonShowcase } from "@/components/ui";
import {
  ContentCards,
  ContentCardsLightbox,
  ContentCardsGlass,
  ContentCardsGlassLightbox,
  PlanungspaketeCards,
  PlanungspaketeCardsLightbox,
  ImageGlassCard,
  SquareGlassCard,
  SquareGlassCardsScroll,
  SquareTextCard,
  VideoCard16by9,
} from "@/components/cards";
import { VIDEO_CARD_PRESETS } from "@/constants/contentCardPresets";

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
          <ContentCards
            variant="responsive"
            title="Content Cards Responsive"
            subtitle="Automatically adapts: Wide layout on desktop, mobile layout on tablets/phones • Navigate with arrow keys or swipe"
            maxWidth={false}
          />

          {/* Lightbox Button for Responsive Cards */}
          <div className="flex justify-center mt-8">
            <ContentCardsLightbox
              variant="responsive"
              title="Content Cards Responsive - Lightbox View"
              subtitle="Automatically adapts to screen size • Navigate with arrow keys or swipe • Click outside or press ESC to close"
              triggerText="Open Responsive Cards in Lightbox"
              triggerClassName="mx-2"
            />
          </div>
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
          <ContentCards
            variant="static"
            title="Content Cards Static"
            subtitle="Single responsive card: Wide layout on desktop, mobile layout on tablets/phones"
            maxWidth={false}
          />

          {/* Lightbox Button for Static Cards */}
          <div className="flex justify-center mt-8">
            <ContentCardsLightbox
              variant="static"
              title="Content Cards Static - Lightbox View"
              subtitle="Responsive single card • Adapts layout based on screen size • Click outside or press ESC to close"
              triggerText="Open Static Card in Lightbox"
              triggerClassName="mx-2"
            />
          </div>
        </section>

        {/* Sicherheit Card Preset Section */}
        <section className="overflow-visible">
          <VideoCard16by9
            title="Sicherheit Video Preset"
            subtitle="Reusable video preset used across the site • Wide layout on desktop, mobile layout on tablets/phones"
            maxWidth={false}
            customData={[VIDEO_CARD_PRESETS.sicherheit]}
          />

          {/* Note: VideoCard16by9 doesn't have a lightbox variant, so this section is removed */}
        </section>

        {/* Video Card 16by9 Section */}
        <section className="overflow-visible">
          <VideoCard16by9
            title="Video Card 16:9 Preset"
            subtitle="Video content with 16:9 aspect ratio on desktop, 1:1 on mobile • Same text space as content cards"
            maxWidth={false}
            customData={[VIDEO_CARD_PRESETS.transportabilitaet]}
          />
        </section>

        {/* Square Text Card Section */}
        <section className="overflow-visible">
          <SquareTextCard
            title="Square Text Cards"
            subtitle="Text-only square cards with responsive behavior • Navigate with arrow keys or swipe • Includes narrow buttons"
            maxWidth={false}
            customData={[
              {
                id: 1,
                title: "1. Vorentwurf",
                subtitle: "Fenster, Türen, Innenwände",
                description:
                  "Bevor wir starten, prüfen wir gemeinsam die Machbarkeit deines Projekts auf deinem Grundstück. \n\n Im Vorentwurfsplan legen wir Fenster, Türen und Innenwände nach deinen Wünschen fest und stimmen diese Planung mit der zuständigen Gemeinde ab.",
                backgroundColor: "#F9FAFB",
                icon: (
                  <svg
                    className="w-8 h-8 md:w-12 md:h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                ),
              },
              {
                id: 2,
                title: "2. Einreichplanung",
                subtitle: "Zwei Wege zum Ziel",
                description:
                  "Nach dem Vorentwurf erstellen wir die komplette Einreichplanung und reichen diese bei der zuständigen Gemeinde ein. Ab hier hast du die Wahl, wie du mit der Bestellung deines Nest Hauses fortfährst.",
                backgroundColor: "#F9FAFB",
                icon: (
                  <svg
                    className="w-8 h-8 md:w-12 md:h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                ),
              },
              {
                id: 3,
                title: "3. Positiver Baubescheid",
                subtitle: "Grundstücksvorbereitung & Fundament",
                description:
                  "Sobald dein Baubescheid vorliegt, startet die Vorbereitung deines Grundstücks. Dazu gehören alle notwendigen Erschließungsarbeiten wie Strom- und Wasseranschluss, Kanal sowie die Zufahrt.",
                backgroundColor: "#F9FAFB",
                icon: (
                  <svg
                    className="w-8 h-8 md:w-12 md:h-12 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                ),
              },
            ]}
          />
        </section>

        {/* Content Cards Glass Section - Responsive */}
        <section className="overflow-visible bg-black py-16 -mx-4 px-4">
          <ContentCardsGlass
            variant="responsive"
            title="Content Cards Responsive Glass"
            subtitle="Automatically adapts: Wide layout on desktop, mobile layout on tablets/phones • Navigate with arrow keys or swipe"
            maxWidth={false}
          />

          {/* Lightbox Button for Responsive Glass Cards */}
          <div className="flex justify-center mt-8">
            <ContentCardsGlassLightbox
              variant="responsive"
              title="Content Cards Responsive Glass - Lightbox View"
              subtitle="Automatically adapts to screen size • Navigate with arrow keys or swipe • Click outside or press ESC to close"
              triggerText="Open Responsive Glass Cards in Lightbox"
              triggerClassName="mx-2"
            />
          </div>
        </section>

        {/* Content Cards Glass Static Section - Single Responsive Card */}
        <section className="overflow-visible bg-black py-16 -mx-4 px-4">
          <ContentCardsGlass
            variant="static"
            title="Content Cards Static Glass"
            subtitle="Single responsive glass card: Wide layout on desktop, mobile layout on tablets/phones"
            maxWidth={false}
          />

          {/* Lightbox Button for Static Glass Cards */}
          <div className="flex justify-center mt-8">
            <ContentCardsGlassLightbox
              variant="static"
              title="Content Cards Static Glass - Lightbox View"
              subtitle="Responsive single glass card • Adapts layout based on screen size • Click outside or press ESC to close"
              triggerText="Open Static Glass Card in Lightbox"
              triggerClassName="mx-2"
            />
          </div>
        </section>

        {/* Image Glass Card Section */}
        <section className="overflow-visible bg-black py-16 -mx-4 px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Image Glass Card
            </h2>
            <p className="text-gray-300">
              Single image card with glass morphism effect and action buttons
            </p>
          </div>
          <ImageGlassCard backgroundColor="black" maxWidth={false} />
        </section>

        {/* Square Glass Card Section */}
        <section className="overflow-visible bg-black py-16 -mx-4 px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Square Glass Card
            </h2>
            <p className="text-gray-300">
              Square card with title/subtitle/description (top 50%) and image
              with 2:3 aspect ratio (bottom 50%)
            </p>
          </div>
          <SquareGlassCard
            backgroundColor="black"
            size="medium"
            maxWidth={false}
            cardData={{
              id: 1,
              title: "NEST-Haus Design",
              subtitle: "Modern Alpine Architecture",
              description:
                "Innovative modular design combining traditional alpine aesthetics with contemporary sustainability.",
              image:
                "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
            }}
          />
        </section>

        {/* Square Glass Cards Scroll Section */}
        <section className="overflow-visible bg-black py-16 -mx-4 px-4">
          <SquareGlassCardsScroll
            backgroundColor="black"
            title="Square Glass Cards Scroll"
            subtitle="Each card: title/subtitle/description (top 50%) + image with 2:3 ratio (bottom 50%) • Navigate with arrow keys or swipe"
            maxWidth={false}
            onCardClick={(cardId) => console.log(`Clicked card ${cardId}`)}
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
