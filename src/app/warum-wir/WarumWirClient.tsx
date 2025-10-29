"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
import { ModernVideoPlayer } from "@/components/video";
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
            <div className="max-w-[1536px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-32 mt-8 md:mt-12">
              <h2
                className="h2-title text-white"
                dangerouslySetInnerHTML={{
                  __html:
                    "<span class='text-nest-gray'>Unsere Vision ist es,</span> <span class='text-white font-medium'>individuelles Wohnen zugänglich zu machen</span> <span class='text-nest-gray'>- ohne Kompromisse bei</span> <span class='text-white font-medium'>Qualität, Design oder Nachhaltigkeit.</span>",
                }}
              />
            </div>
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
