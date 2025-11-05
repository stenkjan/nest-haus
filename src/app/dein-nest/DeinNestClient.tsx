"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
import { ResponsiveHybridImage, ClientBlobVideo } from "@/components/images";
import {
  PlanungspaketeCards,
  UnifiedContentCard,
  PLANUNGSPAKETE_PRESET,
} from "@/components/cards";
import PlanungspaketeCardsLightbox from "@/components/cards/PlanungspaketeCardsLightbox";
import { usePlanungspaketePopup } from "@/hooks/usePlanungspaketePopup";
import { TwoByTwoImageGrid, FullWidthTextGrid } from "@/components/grids";
import {
  GetInContactBanner,
  PartnersSection,
  SectionHeader,
  ModulhausVergleichSection,
} from "@/components/sections";
import { IMAGES } from "@/constants/images";
import {
  ABLAUF_STEPS_PRESET,
  VIDEO_BACKGROUND_CARDS_PRESET,
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
    id: "transportabilitaet",
    title: "Transportabilitaet",
    slug: "transportabilitaet",
  },
  {
    id: "moeglichkeiten",
    title: "Möglichkeiten Entdecken",
    slug: "moeglichkeiten",
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

export default function DeinNestClient() {
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
              title="Design oder Bestpreis?"
              subtitle="Nest verbindet beides in einem System"
              titleClassName="text-black"
              wrapperMargin="mb-8"
            />
          </div>
          {/* Mobile Hero - Invisible spacer to ensure section exists for SectionRouter */}
          <div className="md:hidden h-1 w-full"></div>
        </section>
        {/* Section 2 - Image with Overlay Text and Buttons */}
        <section id="video" className="w-full relative bg-white">
          <div className="relative w-full">
            {/* Image Background - Responsive for mobile and desktop */}
            <ResponsiveHybridImage
              desktopPath={IMAGES.hero.nestHaus3}
              mobilePath={IMAGES.hero.mobile.nestHaus3}
              alt="NEST-Haus Design - Dein Design im Freistil"
              style={{
                objectPosition: "center center",
                objectFit: "cover",
              }}
              strategy="ssr"
              isAboveFold={true}
              isCritical={true}
              priority={true}
              sizes="100vw"
              quality={90}
              unoptimized={true}
              breakpoint={768}
              desktopAspectRatio="16/9"
              useMobileNaturalRatio={true}
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-end pb-8">
              {/* Mobile Title/Subtitle Overlay - Aligned with standard spacing */}
              <div className="absolute top-12 left-0 right-0 text-center px-4 sm:px-6 md:hidden">
                <h1 className="h1-secondary">Design für dich gemacht</h1>
                <h3 className="h3-secondary text-black mb-12 max-w-3xl mx-auto text-center">
                  Dein Design im Freistil.
                </h3>
              </div>

              {/* Desktop: Text Blocks and Buttons grouped together - Hidden on mobile */}
              <div className="hidden lg:flex flex-col gap-8 max-w-[1536px] mx-auto w-full px-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-40">
                {/* Text Blocks */}
                <div className="flex justify-between items-center w-full">
                  {/* Left Text Block */}
                  <div className="text-center">
                    <h2 className="h2-title font-bold text-white drop-shadow-lg">
                      Nest 80
                    </h2>
                    <h3 className="h3-secondary-light text-white drop-shadow-lg">
                      75m² ab € 177.000.-
                    </h3>
                  </div>

                  {/* Center Text Block */}
                  <div className="text-center">
                    <h2 className="h2-title font-bold text-white drop-shadow-lg">
                      Nest 120
                    </h2>
                    <h3 className="h3-secondary-light text-white drop-shadow-lg">
                      115m² ab € 245.000.-
                    </h3>
                  </div>

                  {/* Right Text Block */}
                  <div className="text-center">
                    <h2 className="h2-title font-bold text-white drop-shadow-lg">
                      Nest 160
                    </h2>
                    <h3 className="h3-secondary-light text-white drop-shadow-lg">
                      155m² ab € 313.000.-
                    </h3>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-center">
                  <Link href="/nest-system">
                    <Button variant="primary" size="xs">
                      Erster Schritt
                    </Button>
                  </Link>
                  <Link href="/entwurf">
                    <Button variant="landing-secondary" size="xs">
                      Termin vereinbaren
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Mobile Buttons - Positioned at bottom */}
              <div className="flex gap-4 justify-center px-4 sm:px-6 lg:hidden">
                <Link href="/nest-system">
                  <Button variant="primary" size="xs">
                    Erster Schritt
                  </Button>
                </Link>
                <Link href="/entwurf">
                  <Button variant="landing-secondary" size="xs">
                    Termin vereinbaren
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Video-only Card Section */}
        <section className="w-full py-8 md:py-16 bg-white">
          <SectionHeader
            title="Ein System, das Freiheit baut"
            subtitle="Nest ist die klarer, standardisierter Raum, den du mit deinen Ideen füllst."
            wrapperMargin="md:mb-12 mb-12"
          />

          {/* Mobile: Full-width background video */}
          {isMobile ? (
            <div className="w-full">
              <ClientBlobVideo
                path={IMAGES.variantvideo.mobile.ten}
                className="w-full h-auto"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          ) : (
            /* Desktop: Video card with padding */
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#F4F4F4] rounded-3xl p-[15px]">
                <div className="relative w-full overflow-hidden rounded-2xl">
                  <ClientBlobVideo
                    path={IMAGES.variantvideo.ten}
                    className="w-full h-auto"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
              </div>
            </div>
          )}

          {/* Text Grid and Buttons Container */}
          <div className="pt-8">
            <FullWidthTextGrid
              maxWidth={true}
              textBox1="Wir liefern den Anfang deines Zuhauses. Unser Modul steht für Möglichkeiten, für Raum, den du mit deinen Ideen füllst. In einem gemeinsamen Vorentwurf begleiten wir dich von der ersten Idee bis zu einem konkreten Vorentwurf deines Hauses."
              textBox2="Schritt für Schritt entsteht so ein klares Bild davon, wie dein Nest aussehen kann. Du bestimmst, wie weit du diesen Weg mit uns gehst. Wir begleiten dich so lange, wie du möchtest, und schaffen dabei ein Zuhause, das zu deinem Leben passt."
              backgroundColor="white"
            />

            {/* Button combination */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/entwurf">
                <Button variant="primary" size="xs">
                  Vorentwurf verstehen
                </Button>
              </Link>
              <Link href="/konfigurator">
                <Button variant="landing-secondary-blue" size="xs">
                  Unsere Technik
                </Button>
              </Link>
            </div>
          </div>
        </section>
        {/* Three Boxes Section - Modulhaus Vergleich */}^
        <section
          id="ModulhausVergleich"
          className="w-full py-8 md:py-16 bg-[#f4f4f4]"
        >
          <ModulhausVergleichSection />
        </section>
        {/* Section 5 - Konfigurationen */}
        {/* 📚 Catalog: @sections/catalog/CATALOG.md → "Konfigurationen" */}
        <section id="konfigurieren" className="w-full py-8 md:py-16 bg-white">
          <SectionHeader
            title="Konfiguriere dein ®Nest Haus"
            subtitle="IDurch serielle Fertigung zu transparenten Bestpreisen"
            wrapperMargin="mb-12"
          />

          <UnifiedContentCard
            layout="video"
            style="standard"
            variant="static"
            maxWidth={true}
            showInstructions={false}
            noPadding={true}
            customData={[
              {
                id: 1,
                title: "Gestalten heißt Verstehen",
                subtitle: "",
                description:
                  "Planen, vergleichen, verstehen. Im Nest Konfigurator gestaltest du dein Zuhause Schritt für Schritt und siehst den Preis dabei stets in Echtzeit. Ganz ohne versteckte Kosten.  Entdecke unsere vielfältigen Möglichkeiten. Gleichzeitig liefert deine Konfiguration eine Grundlage für deinen persönlichen Vorentwurf.",
                video: IMAGES.variantvideo.twelve,
                backgroundColor: "#F4F4F4",
                playbackRate: 0.5,
                buttons: [
                  {
                    text: "Unser Part",
                    variant: "primary",
                    size: "xs",
                    link: "/unser-part",
                  },
                  {
                    text: "Jetzt bauen",
                    variant: "secondary",
                    size: "xs",
                    link: "/konfigurator",
                  },
                ],
              },
            ]}
          />
        </section>
        {/* Section 6 - Video Background Cards */}
        <section className="w-full py-8 md:py-16 bg-white">
          <div className="w-full mb-12 px-4 lg:pl-16 xl:pl-20 2xl:pl-24">
            <div className="text-left">
              <h2 className="h2-title font-normal text-black mb-3 md:mb-4">
                Warum Nest Sinn macht?
              </h2>
              <h3 className="h3-secondary font-normal text-black">
                Weil kluge Entscheidungen einfach sind.
              </h3>
            </div>
          </div>

          <UnifiedContentCard
            layout="overlay-text"
            style="standard"
            variant="responsive"
            maxWidth={false}
            showInstructions={false}
            alignment="left"
            customData={VIDEO_BACKGROUND_CARDS_PRESET.cards}
          />
        </section>
        {/* Section 7 - Transportabilitaet Video */}
        {/* 📚 Catalog: @sections/catalog/CATALOG.md → "Transportabilitaet" */}
        <section
          id="transportabilitaet"
          className="w-full py-8 md:py-16 bg-white"
        >
          <SectionHeader
            title="Architektur für ein bewegtes Leben."
            subtitle="Architektur für ein bewegtes Leben."
            wrapperMargin="md:mb-12 mb-12"
          />

          <UnifiedContentCard
            layout="video"
            style="standard"
            variant="static"
            maxWidth={true}
            showInstructions={false}
            noPadding={true}
            customData={[
              {
                id: 1,
                title: "Unsere Technik",
                subtitle: "",
                description:
                  "Aufbauen. Mitnehmen. Weitergeben.\nGanz wie du willst. Dank hochpräziser Konstruktion entsteht dein Zuhause in kürzester Zeit, an nahezu jedem Ort. Und wenn du weiterziehst? Dann ziehst du nicht nur um, sondern nimmst dein Zuhause einfach mit. Oder du bleibst flexibel und verkaufst es weiter, so wie ein gut gepflegtes Auto.",
                video: IMAGES.videos.nestHausTransport,
                backgroundColor: "#F4F4F4",
                buttons: [
                  {
                    text: "Unser Part",
                    variant: "primary",
                    size: "xs",
                    link: "/entwurf",
                  },
                  {
                    text: "Jetzt bauen",
                    variant: "landing-secondary-blue",
                    size: "xs",
                    link: "/konfigurator",
                  },
                ],
              },
            ]}
          />
        </section>
        {/* Section 8 - Partners */}
        <section id="partners" className="w-full pb-8 md:py-16 bg-white">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <PartnersSection />
          </div>
        </section>
      </SectionRouter>

      {/* Contact Banner - Testing Typography Standards */}
      <GetInContactBanner />

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
