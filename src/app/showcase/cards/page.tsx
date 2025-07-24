"use client";

import { ButtonShowcase } from "@/components/ui";
import {
  ContentCards,
  ContentCardsLightbox,
  ContentCardsGlass,
  ContentCardsGlassLightbox,
  PricingCardsLightbox,
  ImageGlassCard,
  SquareGlassCard,
  SquareGlassCardsScroll,
} from "@/components/cards";

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
              glass effects, square cards with 1:1 aspect ratio, lightbox views,
              and interactive elements. Each component adapts beautifully to
              different screen sizes and interaction methods.
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

        {/* Content Cards Pricing Section - Clickable Cards with Lightbox */}
        <section className="overflow-visible">
          <PricingCardsLightbox
            title="Content Cards Pricing"
            subtitle="Click on any card to see detailed information in lightbox"
          />
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
          <ImageGlassCard
            backgroundColor="black"
            primaryButtonText="Primary Action"
            secondaryButtonText="Secondary Action"
            maxWidth={false}
          />
        </section>

        {/* Square Glass Card Section */}
        <section className="overflow-visible bg-black py-16 -mx-4 px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Square Glass Card
            </h2>
            <p className="text-gray-300">
              Single square card with 1:1 aspect ratio and glass morphism effect
            </p>
          </div>
          <SquareGlassCard
            backgroundColor="black"
            size="medium"
            maxWidth={false}
          />
        </section>

        {/* Square Glass Cards Scroll Section */}
        <section className="overflow-visible bg-black py-16 -mx-4 px-4">
          <SquareGlassCardsScroll
            backgroundColor="black"
            title="Square Glass Cards Scroll"
            subtitle="Navigate with arrow keys or swipe • Click on cards for interactions"
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
