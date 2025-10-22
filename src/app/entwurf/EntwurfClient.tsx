"use client";

import React from "react";
import Footer from "@/components/Footer";
import { UnifiedContentCard } from "@/components/cards";
import {
  getTallCard,
  TALL_CARD_PROPS,
  TALL_CARD_PROPS_WITH_PADDING,
} from "@/constants/cardContent";

export default function EntwurfClient() {
  // Get tall cards
  const derAuftaktCard = getTallCard(1); // No padding (edge-to-edge)
  const paddingExampleCard = getTallCard(2); // With padding

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

      {/* Content Section - Card 1: No Padding */}
      <section className="w-full py-8 md:py-16 bg-white">
        {derAuftaktCard && (
          <UnifiedContentCard
            {...TALL_CARD_PROPS}
            customData={[derAuftaktCard]}
          />
        )}
      </section>

      {/* Content Section - Card 2: With Padding */}
      <section className="w-full py-8 md:py-16 bg-white">
        {paddingExampleCard && (
          <UnifiedContentCard
            {...TALL_CARD_PROPS_WITH_PADDING}
            customData={[paddingExampleCard]}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
