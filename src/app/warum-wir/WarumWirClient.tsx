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
        <section id="hero" className="w-full bg-white pt-12 flex items-center">
          <div className="w-full">
            <SectionHeader
              title="Design für dich gemacht"
              subtitle="Dein Design im Freistil."
              titleClassName="text-gray-900"
              wrapperMargin="mb-8"
            />
          </div>
        </section>

        {/* Section 2 - Video with Modern Player */}
        <section id="video" className="w-full bg-white py-8 md:py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <ModernVideoPlayer
              videoPath={`/api/images?path=${IMAGES.videos.videoCard16}&redirect=true`}
              aspectRatio="16/9"
              autoPlay={false}
              enableFullscreen={true}
            />

            {/* Buttons Below Video */}
            <div className="flex gap-4 justify-center w-full mt-8">
              <Link href="/nest-system">
                <Button variant="primary" size="xs">
                  Nest System
                </Button>
              </Link>
              <Link href="/entwurf">
                <Button variant="landing-secondary-blue" size="xs">
                  Entwurf
                </Button>
              </Link>
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
