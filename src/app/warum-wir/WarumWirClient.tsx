"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
import { ModernVideoPlayer } from "@/components/video";
import { UnifiedContentCard } from "@/components/cards";
import {
  LandingImagesCarousel,
  GetInContactBanner,
  SectionHeader,
} from "@/components/sections";
import { IMAGES } from "@/constants/images";
import Footer from "@/components/Footer";

// Define sections
const sections = [
  {
    id: "hero",
    title: "Design für dich gemacht",
    slug: "hero",
  },
  {
    id: "video",
    title: "Video Segment",
    slug: "video",
  },
  {
    id: "testimonials",
    title: "Expertenstimmen",
    slug: "testimonials",
  },
];

export default function WarumWirClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("hero");

  return (
    <div className="min-h-screen pt-12 bg-white">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Section 1 - Hero */}
        <section id="hero" className="w-full bg-black pt-12 flex items-center">
          <div className="w-full">
            <SectionHeader
              title="Die ®Nest Vision"
              subtitle="Eine Welt, in der Effizienz auf Architektur trifft."
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-8"
            />
          </div>
        </section>

        {/* Section 2 - Video with Modern Player */}
        <section id="video" className="w-full bg-black pb-8 md:pb-16">
          <div className="w-full">
            <ModernVideoPlayer
              videoPath={`/api/images?path=${IMAGES.videos.videoCard16}`}
              aspectRatio="16/9"
              autoPlay={false}
            />

            {/* Text Content Below Video */}
            <div className="max-w-[1024px] 2xl:max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 xl:px-32 2xl:px-8 mt-8 md:mt-12">
              <h2
                className="h2-title text-white text-center"
                dangerouslySetInnerHTML={{
                  __html:
                    "<span class='text-nest-gray'>Dein Nest ist</span> <span class='text-white font-medium'>mehr als ein Gebäude.</span> <span class='text-nest-gray'>Es ist </span> <span class='text-white font-medium'>eine neue Art zu leben.</span> <span class='text-nest-gray'>Ein</span> <span class='text-white font-medium'>Zuhause,</span> <span class='text-nest-gray'>das mit dir wächst, sich bewegt und</span> <span class='text-white font-medium'>Freiraum</span> <span class='text-nest-gray'>schafft.</span>",
                }}
              />

              {/* Buttons Below Text */}
              <div className="flex gap-4 justify-center w-full mt-8">
                <Link href="/nest-system">
                  <Button variant="primary" size="xs">
                    Termin vereinbaren
                  </Button>
                </Link>
                <Link href="/entwurf">
                  <Button variant="secondary-narrow-blue" size="xs">
                    Projekt starten
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 - Testimonials / Glass Quote Cards */}
        <section id="testimonials" className="w-full bg-black py-16 md:py-24">
          <div className="w-full">
            <SectionHeader
              title="Verlässlichkeit, auf die du bauen kannst"
              subtitle="Innovationen entstehen dort, wo junge Ideen auf Erfahrung treffen."
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-12"
            />

            <UnifiedContentCard
              layout="glass-quote"
              style="glass"
              variant="responsive"
              category="glassQuoteCards"
              backgroundColor="black"
              maxWidth={false}
              showInstructions={false}
              alignment="left"
            />
          </div>
        </section>

        {/* Section 4 - Team Values Cards */}
        <section className="w-full bg-white py-16 md:py-24">
          <div className="w-full">

            <UnifiedContentCard
              layout="team-card"
              style="glass"
              variant="responsive"
              category="warumWirTeamCards"
              backgroundColor="black"
              maxWidth={false}
              showInstructions={false}
              alignment="left"
            />
          </div>
        </section>
      </SectionRouter>

      {/* Contact Banner - Kein Plan? Kein Problem! */}
      <GetInContactBanner />

      {/* Landing Images Carousel */}
      <LandingImagesCarousel backgroundColor="gray" maxWidth={false} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
