"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
import { ClientBlobVideo } from "@/components/images";
import {
  VideoCard16by9,
  PlanungspaketeCards,
  SquareTextCard,
} from "@/components/cards";
import { TwoByTwoImageGrid } from "@/components/grids";
import {
  GetInContactBanner,
  PartnersSection,
  LandingImagesCarousel,
} from "@/components/sections";
import ContentCards from "@/components/cards/ContentCards";
import { IMAGES } from "@/constants/images";
import {
  VIDEO_CARD_PRESETS,
  CONTENT_CARD_PRESETS,
} from "@/constants/contentCardPresets";
import Footer from "@/components/Footer";

// Define sections with proper structure for entdecken page
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
    id: "zuhause-zieht-um",
    title: "Dein Zuhause zieht um",
    slug: "zuhause-zieht-um",
  },
  {
    id: "image-grid",
    title: "Image Grid",
    slug: "image-grid",
  },
  {
    id: "square-text-cards",
    title: "Square Text Cards",
    slug: "square-text-cards",
  },
  {
    id: "grundstueck-check",
    title: "Dein Grundstück - Unser Check",
    slug: "grundstueck-check",
  },
  {
    id: "planungspakete",
    title: "Unterstützung gefällig?",
    slug: "planungspakete",
  },
  {
    id: "partners",
    title: "Gemeinsam mit starken Partnern",
    slug: "partners",
  },
];

export default function EntdeckenClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("hero");
  const [isMobile, setIsMobile] = useState(false);

  // Simple width-based mobile detection (same as ResponsiveHybridImage)
  useEffect(() => {
    const checkDevice = () => {
      const newIsMobile = window.innerWidth < 768; // Same breakpoint as landing page
      setIsMobile(newIsMobile);
    };

    // Initial check
    checkDevice();

    // Listen for resize events
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <div className="min-h-screen md:pt-16 bg-white">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Section 1 - Hero with Title and Subtitle (Desktop only) */}
        <section id="hero" className="w-full py-12 bg-white hidden md:block">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-2 md:mb-3">
                Design für dich gemacht
              </h1>
              <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto text-center">
                Dein Design im Freistil
              </h3>
            </div>
          </div>
        </section>

        {/* Section 2 - Video with Overlay Text and Buttons */}
        <section id="video" className="w-full relative bg-white">
          <div className="relative w-full">
            {/* Video Background with cropping - no white space */}
            <div
              className="w-full overflow-hidden"
              style={{
                height: "70vh", // Container takes only 70% of viewport height
              }}
            >
              <div
                style={{
                  clipPath: "inset(30% 0 0 0)", // Shows bottom 70% of video
                  height: "142.857%", // Compensate for cropping (100% / 0.7)
                  transform: "translateY(-30%)", // Move video up to show bottom portion
                }}
              >
                <ClientBlobVideo
                  path={
                    isMobile
                      ? IMAGES.variantvideo.mobile.ten
                      : IMAGES.variantvideo.ten
                  }
                  autoPlay={true}
                  muted={true}
                  controls={false}
                  loop={true}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-end">
              {/* Mobile Title/Subtitle Overlay - More gap from navbar */}
              <div className="absolute top-24 left-0 right-0 text-center px-4 sm:px-6 md:hidden">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Design für dich gemacht
                </h1>
                <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto text-center">
                  Dein Design im Freistil
                </h3>
              </div>

              {/* Text Blocks positioned closer to buttons - Hidden on tablet and mobile */}
              <div className="absolute bottom-20 lg:bottom-20 xl:bottom-28 2xl:bottom-32 left-0 right-0 justify-between items-center px-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-32 max-w-[1536px] mx-auto w-full hidden lg:flex">
                {/* Left Text Block */}
                <div className="text-center">
                  <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-1">
                    Nest 80
                  </h2>
                  <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-black">
                    75m² ab € 177.000
                  </h3>
                </div>

                {/* Center Text Block */}
                <div className="text-center">
                  <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-1">
                    Nest 120
                  </h2>
                  <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-black">
                    115m² ab € 245.000
                  </h3>
                </div>

                {/* Right Text Block */}
                <div className="text-center">
                  <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-1">
                    Nest 160
                  </h2>
                  <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-black">
                    155m² ab € 313.000
                  </h3>
                </div>
              </div>

              {/* Mobile Buttons - Positioned in the middle */}
              <div className="absolute bottom-16 left-0 right-0 flex gap-4 justify-center px-4 sm:px-6 md:hidden">
                <Link href="/dein-part">
                  <Button variant="primary" size="xs">
                    Dein Part
                  </Button>
                </Link>
                <Link href="/unser-part">
                  <Button variant="secondary" size="xs">
                    Unser Part
                  </Button>
                </Link>
              </div>

              {/* Desktop Buttons - Positioned at bottom */}
              <div className="absolute bottom-8 lg:bottom-8 xl:bottom-6 2xl:bottom-8 left-0 right-0 gap-4 justify-center px-4 sm:px-6 lg:px-8 hidden md:flex">
                <Link href="/dein-part">
                  <Button variant="primary" size="xs">
                    Dein Part
                  </Button>
                </Link>
                <Link href="/unser-part">
                  <Button variant="secondary" size="xs">
                    Unser Part
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 - Dein Zuhause zieht um */}
        <section id="zuhause-zieht-um" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-2 md:mb-3">
                Dein Zuhause zieht um
              </h1>
              <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto text-center">
                Architektur für ein bewegtes Leben.
              </h3>
            </div>

            {/* VideoCard16by9 Component */}
            <VideoCard16by9
              title=""
              subtitle=""
              maxWidth={false}
              showInstructions={false}
              customData={[VIDEO_CARD_PRESETS.unsereTechnik]}
            />
          </div>
        </section>

        {/* Section 4 - Interactive 2x2 Image Grid */}
        <section id="image-grid" className="w-full py-16 bg-white">
          <div className="w-full">
            <TwoByTwoImageGrid
              title=""
              subtitle=""
              maxWidth={false}
              customData={[
                {
                  id: 1,
                  title: "Das Nest System",
                  subtitle: "Das übernehmen wir",
                  description: "Dein Raum. Deine Ideen",
                  image: IMAGES.function.nestHausSystemModulbau,
                  backgroundColor: "#F8F9FA",
                  primaryAction: "Das Nest System",
                  secondaryAction: "Jetzt bauen",
                },
                {
                  id: 2,
                  title: "Dein Zuhause aus Holz",
                  subtitle: "Gut für Dich. Besser für die Zukunft.",
                  description: "Qualität aus Österreich.",
                  image: IMAGES.function.nestHausMaterialienSchema,
                  backgroundColor: "#F4F4F4",
                  primaryAction: "Die Materialien",
                  secondaryAction: "Jetzt bauen",
                  textColor: "text-black",
                },
                {
                  id: 3,
                  title: "Fenster und Türenausbau",
                  subtitle: "Wir hören zu. Du entscheidest.",
                  description: "Dein Fenster für deine Räume.",
                  image: IMAGES.function.nestHausInnenausbauFenster,
                  backgroundColor: "#F8F9FA",
                  primaryAction: "Fenster & Türen",
                  secondaryAction: "Jetzt bauen",
                },
                {
                  id: 4,
                  title: "Individuell wie du",
                  subtitle: "Deine Ideen in deinem Zuhause",
                  description: "Dein Raum. Deine Ideen.",
                  image: IMAGES.function.nestHausSystemDeinPart,
                  backgroundColor: "#F4F4F4",
                  primaryAction: "Gestalten",
                  secondaryAction: "Jetzt bauen",
                },
              ]}
            />
          </div>
        </section>

        {/* Section 5 - Square Text Cards */}
        <section id="square-text-cards" className="w-full py-16 bg-white">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-2 md:mb-3">
                So läuft es ab
              </h1>
              <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8">
                Der Weg zu deinem Nest Haus
              </h3>
            </div>
          </div>

          {/* SquareTextCard outside container to use full width */}
          <SquareTextCard
            title=""
            subtitle=""
            maxWidth={false}
            showInstructions={false}
          />
        </section>

        {/* Section 6 - Grundstück Check */}
        <section id="grundstueck-check" className="w-full py-16 bg-white">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-2 md:mb-3">
                Konfiguriere dein Zuhause
              </h1>
              <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8">
                Wir überprüfen für dich, wie dein Nest Haus auf ein Grundstück
                deiner Wahl passt.
              </h3>
            </div>

            <ContentCards
              variant="static"
              title=""
              subtitle=""
              maxWidth={false}
              showInstructions={false}
              customData={[CONTENT_CARD_PRESETS.sicherheit]}
            />
          </div>
        </section>

        {/* Section 7 - Planungspakete */}
        <section id="planungspakete" className="w-full py-16 bg-white">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-2 md:mb-3">
                Unterstützung gefällig?
              </h1>
              <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8">
                Entdecke unsere Planungs-Pakete, um das Beste für dich und dein
                Nest rauszuholen.
              </h3>
            </div>

            <PlanungspaketeCards
              title=""
              subtitle=""
              maxWidth={false}
              showInstructions={false}
            />

            {/* Button Combo After Component */}
            <div className="flex gap-4 justify-center w-full mt-16">
              <Button variant="primary" size="xs">
                Die Pakete
              </Button>
              <Button variant="landing-secondary-blue" size="xs">
                Jetzt bauen
              </Button>
            </div>
          </div>
        </section>

        {/* Section 8 - Partners */}
        <section id="partners" className="w-full py-16 bg-white">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <PartnersSection backgroundColor="white" showButtons={true} />
          </div>
        </section>
      </SectionRouter>

      {/* Contact Banner - Testing Typography Standards */}
      <GetInContactBanner />

      {/* Image Carousel Section - Outside SectionRouter to avoid width issues */}
      <div className="hidden md:block">
        <LandingImagesCarousel backgroundColor="white" maxWidth={false} />
      </div>

      <Footer />
    </div>
  );
}
