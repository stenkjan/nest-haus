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
import PlanungspaketeCardsLightbox from "@/components/cards/PlanungspaketeCardsLightbox";
import { usePlanungspaketePopup } from "@/hooks/usePlanungspaketePopup";
import { TwoByTwoImageGrid } from "@/components/grids";
import {
  GetInContactBanner,
  PartnersSection,
  LandingImagesCarousel,
  SectionHeader,
} from "@/components/sections";
import { IMAGES } from "@/constants/images";
import { VIDEO_CARD_PRESETS } from "@/constants/contentCardPresets";
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
    id: "cards",
    title: "Cards",
    slug: "cards",
  },
  {
    id: "ablauf",
    title: "So läuft's ab",
    slug: "ablauf",
  },
  {
    id: "konfigurieren",
    title: "Dein Grundstück - Unser Check",
    slug: "konfigurieren",
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
  const { isOpen, openPlanungspakete, closePlanungspakete } =
    usePlanungspaketePopup();

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
    <div
      className="min-h-screen bg-white"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Section 1 - Hero with Title and Subtitle */}
        <section
          id="hero"
          className="w-full bg-white md:pt-12 flex items-center"
        >
          {/* Desktop Hero Content */}
          <div className="hidden md:block w-full">
            <SectionHeader
              title="Design für dich gemacht"
              subtitle="Dein Design im Freistil."
              titleClassName="text-gray-900"
              wrapperMargin="mb-8"
            />
          </div>
          {/* Mobile Hero - Invisible spacer to ensure section exists for SectionRouter */}
          <div className="md:hidden h-1 w-full"></div>
        </section>

        {/* Section 2 - Video with Overlay Text and Buttons */}
        <section id="video" className="w-full relative bg-white">
          <div className="relative w-full">
            {/* Video Background - Mobile: normal display, Desktop: cropped */}
            {isMobile ? (
              // Mobile: Display video normally without cropping
              <div className="w-full">
                <ClientBlobVideo
                  path={IMAGES.variantvideo.mobile.ten}
                  autoPlay={true}
                  muted={true}
                  controls={false}
                  loop={true}
                  playbackRate={1}
                  className="w-full h-auto object-cover"
                />
              </div>
            ) : (
              // Desktop: Apply cropping to show bottom 70% of video
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
                    path={IMAGES.variantvideo.ten}
                    autoPlay={true}
                    muted={true}
                    controls={false}
                    loop={true}
                    playbackRate={1}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-end">
              {/* Mobile Title/Subtitle Overlay - Aligned with standard spacing */}
              <div className="absolute top-12 left-0 right-0 text-center px-4 sm:px-6 md:hidden">
                <h1 className="h1-secondary">Design für dich gemacht</h1>
                <h3 className="h3-secondary text-black mb-12 max-w-3xl mx-auto text-center">
                  Dein Design im Freistil.
                </h3>
              </div>

              {/* Text Blocks positioned closer to buttons - Hidden on tablet and mobile */}
              <div className="absolute bottom-20 lg:bottom-32 xl:bottom-24 2xl:bottom-32 left-0 right-0 justify-between items-center px-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-40 max-w-[1536px] mx-auto w-full hidden lg:flex">
                {/* Left Text Block */}
                <div className="text-center">
                  <h2 className="h2-title font-bold text-black">Nest 80</h2>
                  <h3 className="h3-secondary-light text-black">
                    75m² ab € 177.000.-
                  </h3>
                </div>

                {/* Center Text Block */}
                <div className="text-center">
                  <h2 className="h2-title font-bold text-black">Nest 120</h2>
                  <h3 className="h3-secondary-light text-black">
                    115m² ab € 245.000.-
                  </h3>
                </div>

                {/* Right Text Block */}
                <div className="text-center">
                  <h2 className="h2-title font-bold text-black">Nest 160</h2>
                  <h3 className="h3-secondary-light text-black">
                    155m² ab € 313.000.-
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
                <Link href="/entwurf">
                  <Button variant="landing-secondary-blue" size="xs">
                    Entwurf
                  </Button>
                </Link>
              </div>

              {/* Desktop Buttons - Positioned at bottom */}
              <div className="absolute bottom-16 lg:bottom-16 xl:bottom-16 2xl:bottom-16 left-0 right-0 gap-4 justify-center px-4 sm:px-6 lg:px-8 hidden md:flex">
                <Link href="/dein-part">
                  <Button variant="primary" size="xs">
                    Dein Part
                  </Button>
                </Link>
                <Link href="/entwurf">
                  <Button variant="landing-secondary-blue" size="xs">
                    Entwurf
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 - Dein Zuhause zieht um */}
        <section
          id="zuhause-zieht-um"
          className="w-full py-8 md:py-16 bg-white"
        >
          <SectionHeader
            title="Dein Zuhause zieht um"
            subtitle="Architektur für ein bewegtes Leben."
            wrapperMargin="md:mb-12 mb-12"
          />

          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Section 4 - Cards */}
        <section id="cards" className="w-full py-8 md:py-16 bg-white">
          <div className="w-full">
            <TwoByTwoImageGrid
              title=""
              subtitle=""
              maxWidth={false}
              customData={[
                {
                  id: 1,
                  title: "Das ®Nest System",
                  subtitle: "Effizient. Präzise. Leistbar.",
                  description: "Dein Raum. Deine Ideen.",
                  image: IMAGES.function.nestHausSystemModulbau,
                  backgroundColor: "#F8F9FA",
                  primaryAction: "Das Nest System",
                  secondaryAction: "Jetzt bauen",
                  primaryLink: "/dein-part#nest-system",
                  secondaryLink: "/konfigurator",
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
                  primaryLink: "/dein-part#materialien",
                  secondaryLink: "/konfigurator",
                },
                {
                  id: 3,
                  title: "Fenster und Türenausbau",
                  subtitle: "Wir hören zu. Du entscheidest.",
                  description: "Deine Fenster für deine Räume.",
                  image: IMAGES.function.nestHausInnenausbauFenster,
                  backgroundColor: "#F8F9FA",
                  primaryAction: "Fenster & Türen",
                  secondaryAction: "Jetzt bauen",
                  primaryLink: "/dein-part#fenster-tueren",
                  secondaryLink: "/konfigurator",
                },
                {
                  id: 4,
                  title: "Individuell wie du",
                  subtitle: "Deine Ideen. Dein Zuhause.",
                  description: "Dein Raum. Deine Ideen.",
                  image: IMAGES.function.nestHausSystemDeinPart,
                  backgroundColor: "#F4F4F4",
                  primaryAction: "Dein Part",
                  secondaryAction: "Jetzt bauen",
                  primaryLink: "/dein-part",
                  secondaryLink: "/konfigurator",
                },
              ]}
            />
          </div>
        </section>

        {/* Section 5 - Grundstück Check */}
        <section id="konfigurieren" className="w-full py-8 md:py-16 bg-white">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="h1-secondary mb-2 md:mb-3">
                <span className="block md:inline">Konfiguriere dein</span>
                <span className="block md:inline"> ®Nest Haus</span>
              </h1>
              <h3 className="h3-secondary text-black mb-8">
                Individualisiert, wo es Freiheit braucht. Standardisiert, wo es
                Effizienz schafft.
              </h3>
            </div>

            <VideoCard16by9
              title=""
              subtitle=""
              maxWidth={false}
              showInstructions={false}
              customData={[VIDEO_CARD_PRESETS.sicherheit]}
            />
          </div>
        </section>

        {/* Section 6 - So läuft es ab */}
        <section id="ablauf" className="w-full py-8 md:py-4 bg-white">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="h1-secondary mb-2 md:mb-3">So läuft&apos;s ab</h1>
              <h3 className="h3-secondary text-black mb-2 md:mb-4">
                Dein Weg zum Nest-Haus
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

        {/* Section 7 - Planungspakete */}
        <section id="planungspakete" className="w-full py-8 md:py-16 bg-white">
          <div className="w-full max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-6">
              <h1 className="h1-secondary mb-2 md:mb-3">
                Unterstützung gefällig?
              </h1>
              <h3 className="h3-secondary text-black mb-8">
                Entdecke unsere Planungs-Pakete, um das Beste für dich und dein
                Nest rauszuholen.
              </h3>
            </div>

            <div className="mt-4 md:mt-0">
              <PlanungspaketeCards
                title=""
                subtitle=""
                maxWidth={false}
                showInstructions={false}
              />
            </div>

            {/* Button Combo After Component */}
            <div className="flex gap-4 justify-center w-full mt-6 md:mt-8">
              {!isMobile && (
                <Button
                  variant="primary"
                  size="xs"
                  onClick={openPlanungspakete}
                >
                  Die Pakete
                </Button>
              )}
              <Link href="/konfigurator">
                <Button variant="landing-secondary-blue" size="xs">
                  Jetzt bauen
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 8 - Partners */}
        <section id="partners" className="w-full pb-8 md:pb-16 bg-white">
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

      {/* Planungspakete Lightbox */}
      <PlanungspaketeCardsLightbox
        title="Planungspakete"
        subtitle=""
        isOpen={isOpen}
        onClose={closePlanungspakete}
        showTrigger={false}
      />
    </div>
  );
}
