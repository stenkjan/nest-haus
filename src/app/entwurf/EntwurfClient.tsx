"use client";

import React from "react";
import Footer from "@/components/Footer";
import { UnifiedContentCard } from "@/components/cards";
import {
  getTallCard,
  TALL_CARD_PROPS,
  TALL_CARD_PROPS_WITH_PADDING,
  getContentByCategory,
} from "@/constants/cardContent";

export default function EntwurfClient() {
  // Get tall cards (ORIGINAL CONTENT)
  const derAuftaktCard = getTallCard(1); // No padding (edge-to-edge)
  const paddingExampleCard = getTallCard(2); // With padding

  // Get materialien content for testing the new overlay-text layout
  const materialienContent = getContentByCategory("materialien");

  // Get video background cards
  const videoBackgroundCards = getContentByCategory("videoBackgroundCards");

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      {/* White background for navbar area */}
      <div
        className="fixed top-0 left-0 right-0 bg-white z-[90]"
        style={{ height: "var(--navbar-height, 3.5rem)" }}
      ></div>

      {/* ORIGINAL CONTENT - Card 1: No Padding (TALL CARD) */}
      <section className="w-full py-8 md:py-16 bg-white">
        {derAuftaktCard && (
          <UnifiedContentCard
            {...TALL_CARD_PROPS}
            customData={[derAuftaktCard]}
          />
        )}
      </section>

      {/* ORIGINAL CONTENT - Card 2: With Padding (TALL CARD) */}
      <section className="w-full py-8 md:py-16 bg-white">
        {paddingExampleCard && (
          <UnifiedContentCard
            {...TALL_CARD_PROPS_WITH_PADDING}
            customData={[paddingExampleCard]}
          />
        )}
      </section>

      {/* NEW: Overlay Text Cards with 2x1 Aspect Ratio */}
      <section className="w-full py-8 md:py-16 bg-gray-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-3xl font-bold text-black mb-4 text-center">
            New Overlay-Text Cards - 2x1 Aspect Ratio (Portrait)
          </h2>
          <p className="text-black text-center mb-2">
            Same standard height as other cards, narrower width (portrait)
          </p>
        </div>
        <UnifiedContentCard
          layout="overlay-text"
          style="standard"
          variant="responsive"
          aspectRatio="2x1"
          maxWidth={true}
          showInstructions={true}
          customData={materialienContent}
        />
      </section>

      {/* NEW: Overlay Text Cards with 1x1 Aspect Ratio */}
      <section className="w-full py-8 md:py-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-3xl font-bold text-black mb-4 text-center">
            New Overlay-Text Cards - 1x1 Aspect Ratio (Square)
          </h2>
          <p className="text-black text-center mb-2">
            Same standard height, square format (width = height)
          </p>
        </div>
        <UnifiedContentCard
          layout="overlay-text"
          style="standard"
          variant="responsive"
          aspectRatio="1x1"
          maxWidth={true}
          showInstructions={true}
          customData={materialienContent}
        />
      </section>

      {/* NEW: Video Background Cards with 2x1 Aspect Ratio */}
      <section className="w-full py-8 md:py-16 bg-gray-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-3xl font-bold text-black mb-4 text-center">
            Video Background Cards - 2x1 Portrait (16 Videos)
          </h2>
          <p className="text-black text-center mb-2">
            Dynamic video backgrounds with minimal text overlay
          </p>
        </div>
        <UnifiedContentCard
          layout="overlay-text"
          style="standard"
          variant="responsive"
          aspectRatio="2x1"
          maxWidth={true}
          showInstructions={true}
          customData={videoBackgroundCards}
        />
      </section>

      {/* NEW: Video Background Cards with 1x1 Aspect Ratio */}
      <section className="w-full py-8 md:py-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-3xl font-bold text-black mb-4 text-center">
            Video Background Cards - 1x1 Square (16 Videos)
          </h2>
          <p className="text-black text-center mb-2">
            Same videos, different aspect ratio - square format
          </p>
        </div>
        <UnifiedContentCard
          layout="overlay-text"
          style="standard"
          variant="responsive"
          aspectRatio="1x1"
          maxWidth={true}
          showInstructions={true}
          customData={videoBackgroundCards}
        />
      </section>

      <Footer />
    </div>
  );
}
