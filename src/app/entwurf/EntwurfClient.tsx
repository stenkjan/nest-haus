"use client";

import React from "react";
import Footer from "@/components/Footer";
import { UnifiedContentCard } from "@/components/cards";
import { getContentById } from "@/constants/cardContent";

export default function EntwurfClient() {
  // Get the "Der Auftakt" card from processCards category
  const derAuftaktCard = getContentById("processCards", 1);

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

      {/* Content Section */}
      <section className="w-full py-8 md:py-16 bg-white">
        {derAuftaktCard && (
          <UnifiedContentCard
            layout="video"
            style="standard"
            variant="static"
            heightMode="tall"
            maxWidth={true}
            showInstructions={false}
            customData={[derAuftaktCard]}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
