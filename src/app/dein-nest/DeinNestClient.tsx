"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
import { HybridBlobImage, ClientBlobVideo } from "@/components/images";
import {
  PlanungspaketeCards as _PlanungspaketeCards,
  UnifiedContentCard,
  PLANUNGSPAKETE_PRESET as _PLANUNGSPAKETE_PRESET,
} from "@/components/cards";
import PlanungspaketeCardsLightbox from "@/components/cards/PlanungspaketeCardsLightbox";
import { usePlanungspaketePopup } from "@/hooks/usePlanungspaketePopup";
import { TwoByTwoImageGrid as _TwoByTwoImageGrid } from "@/components/grids";
import {
  GetInContactBanner,
  PartnersSection,
  SectionHeader,
  ModulhausVergleichSection,
} from "@/components/sections";
import { IMAGES } from "@/constants/images";
import {
  ABLAUF_STEPS_PRESET as _ABLAUF_STEPS_PRESET,
  VIDEO_BACKGROUND_CARDS_PRESET,
} from "@/constants/contentCardPresets";
import Footer from "@/components/Footer";

// Define sections with proper structure for entdecken page
const sections = [
  {
    id: "dein-nest-preise",
    title: "Design für dich gemacht",
    slug: "dein-nest-preise",
  },
  {
    id: "intro-nest",
    title: "Video Segment",
    slug: "intro-nest",
  },
  {
    id: "transport",
    title: "Transportabilitaet",
    slug: "transport",
  },
  {
    id: "position-am-markt",
    title: "Möglichkeiten Entdecken",
    slug: "position-am-markt",
  },
  {
    id: "ablauf",
    title: "So läuft's ab",
    slug: "ablauf",
  },
  {
    id: "haus-konfiguration",
    title: "Dein Grundstück - Unser Check",
    slug: "haus-konfiguration",
  },
  {
    id: "vorteile-nest",
    title: "Warum Nest Sinn macht?",
    slug: "vorteile-nest",
  },
  {
    id: "planungspakete",
    title: "Unterstützung gefällig?",
    slug: "planungspakete",
  },
  {
    id: "unsere-partner",
    title: "Gemeinsam mit starken Partnern",
    slug: "unsere-partner",
  },
];

export default function DeinNestClient() {
  const [_currentSectionId, setCurrentSectionId] =
    useState<string>("dein-nest-preise");
  const [isMobile, setIsMobile] = useState(false);
  const {
    isOpen,
    openPlanungspakete: _openPlanungspakete,
    closePlanungspakete,
  } = usePlanungspaketePopup();

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
        {/* Section 1 - Hero with Image and Overlay Text */}
        <section id="dein-nest-preise" className="w-full">
          <div className="relative w-full">
            {/* Background Image */}
            <HybridBlobImage
              path={IMAGES.hero.nestHaus3}
              mobilePath={IMAGES.hero.mobile.nestHaus3}
              alt="NEST-Haus Design - Dein Design im Freistil"
              className="w-full h-auto"
              strategy="ssr"
              isAboveFold={true}
              isCritical={true}
              priority={true}
            />

            {/* Dark Tint Overlay */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* ALL OVERLAY CONTENT - Easy to position */}
            <div className="absolute inset-0">
              {/* Container for all content with padding from edges */}
              <div className="relative w-full h-full max-w-[1536px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-40">
                {/* SECTION 1: Header at Top */}
                <div className="absolute top-12 left-0 right-0 flex justify-center">
                  <SectionHeader
                    title="Design oder Bestpreis?"
                    subtitle="Nest verbiniert beides in einem System"
                    titleClassName="text-white"
                    subtitleClassName="text-white"
                  />
                </div>

                {/* SECTION 2: Text Blocks (Desktop Only) - Distance from BOTTOM */}
                <div
                  className="hidden lg:block absolute left-0 right-0"
                  style={{ bottom: "15%" }}
                >
                  <div className="flex justify-between items-center w-full px-16 xl:px-24 2xl:px-32">
                    {/* Left Text Block */}
                    <div className="text-center">
                      <h2 className="h2-title font-bold text-white drop-shadow-lg">
                        Nest 80
                      </h2>
                      <h3 className="p-primary text-white drop-shadow-lg">
                        75m² ab € 177.000.-
                      </h3>
                    </div>

                    {/* Center Text Block */}
                    <div className="text-center">
                      <h2 className="h2-title font-bold text-white drop-shadow-lg">
                        Nest 120
                      </h2>
                      <h3 className="p-primary text-white drop-shadow-lg">
                        115m² ab € 245.000.-
                      </h3>
                    </div>

                    {/* Right Text Block */}
                    <div className="text-center">
                      <h2 className="h2-title font-bold text-white drop-shadow-lg">
                        Nest 160
                      </h2>
                      <h3 className="p-primary text-white drop-shadow-lg">
                        155m² ab € 313.000.-
                      </h3>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Buttons (Desktop) - Distance from BOTTOM */}
                <div
                  className="hidden lg:flex absolute left-0 right-0 gap-4 justify-center"
                  style={{ bottom: "4%" }}
                >
                  <Link href="/nest-system">
                    <Button variant="primary" size="xs">
                      Erster Schritte
                    </Button>
                  </Link>
                  <Link href="/konfigurator">
                    <Button variant="landing-secondary" size="xs">
                      Termin vereinbaren
                    </Button>
                  </Link>
                </div>

                {/* SECTION 4: Buttons (Mobile Only) - Distance from BOTTOM */}
                <div
                  className="flex lg:hidden absolute left-0 right-0 gap-4 justify-center px-4"
                  style={{ bottom: "8%" }}
                >
                  <Link href="/nest-system">
                    <Button variant="primary" size="xs">
                      Nest System
                    </Button>
                  </Link>
                  <Link href="/konfigurator">
                    <Button variant="landing-secondary" size="xs">
                      Jetzt bauen
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Section 2 - Text Content Below Hero */}
        <section id="intro-nest" className="w-full relative bg-white">
          {/* Text Content Below Video */}
          <div className="max-w-[1440px] 2xl:max-w-[1440px] mx-auto px-8 sm:px-16 lg:px-24 xl:px-32 2xl:px-32 mt-8 md:mt-12 pt-8">
            <h2
              className="h2-title text-center"
              dangerouslySetInnerHTML={{
                __html:
                  "<span class='text-nest-gray'>Wir vereinen </span><span class='text-black font-medium'>industrielle Präzision</span><span class='text-nest-gray'> mit </span><span class='text-black font-medium'>architektonischem Design.</span><span class='text-nest-gray'> Dein Zuhause entsteht dabei aus seriell gefertigten </span><span class='text-black font-medium'>Modulen</span><span class='text-nest-gray'>, die du mit </span><span class='text-black font-medium'>deinen Ideen</span><span class='text-nest-gray'> füllst.</span><br/><br/><span class='text-nest-gray'>Atmosphäre, individuell und ganz nach deinen Vorstellungen.</span><br/><span class='text-black font-medium'>Weil nur du weißt, wie du richtig wohnst.</span>",
              }}
            />
          </div>

          {/* Video-only Card Section */}
          <div className="w-full py-8 md:py-16">
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
          </div>
        </section>
        {/* Three Boxes Section - Modulhaus Vergleich */}
        <section
          id="position-am-markt"
          className="w-full py-8 md:py-16 bg-[#f4f4f4]"
        >
          <ModulhausVergleichSection />
        </section>
        {/* Section 5 - Konfigurationen */}
        {/* 📚 Catalog: @sections/catalog/CATALOG.md → "Konfigurationen" */}
        <section
          id="haus-konfiguration"
          className="w-full py-8 md:py-16 bg-white"
        >
          <SectionHeader
            title="Konfiguriere dein ®Nest Haus"
            subtitle="Durch serielle Fertigung zu transparenten Bestpreisen"
            mobileTitle="Konfiguriere dein<br/>®Nest Haus"
            wrapperMargin="mb-8 mt-8 lg:mb-12"
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
                  "<span class='text-nest-gray'>Planen, vergleichen, verstehen. Im Nest Konfigurator gestaltest du </span><span class='text-black font-medium'>dein Zuhause Schritt für Schritt</span><span class='text-nest-gray'> und siehst den Preis dabei stets in Echtzeit. Ganz </span><span class='text-black font-medium'>ohne versteckte Kosten.</span>\n\n<span class='text-nest-gray'> Entdecke unsere </span><span class='text-black font-medium'>vielfältigen Möglichkeiten.</span><span class='text-nest-gray'> Gleichzeitig liefert deine Konfiguration eine Grundlage für deinen persönlichen Vorentwurf.</span>",
                video: IMAGES.variantvideo.twelve,
                backgroundColor: "#F4F4F4",
                playbackRate: 0.5,
                buttons: [
                  {
                    text: "Erster Schritt",
                    variant: "primary",
                    size: "xs",
                    link: "/entwurf",
                  },
                  {
                    text: "Jetzt konfigurieren",
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
        <section id="vorteile-nest" className="w-full py-8 md:py-16 bg-white">
          <div className="w-full mb-12">
            <div className="pl-4 md:pl-12 text-left">
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
            customData={VIDEO_BACKGROUND_CARDS_PRESET.cards.filter(
              (card) => card.id >= 1 && card.id <= 4
            )}
          />
        </section>
        {/* Section 7 - Transportabilitaet Video */}
        {/* 📚 Catalog: @sections/catalog/CATALOG.md → "Transportabilitaet" */}
        <section id="transport" className="w-full py-8 md:py-16 bg-white">
          <SectionHeader
            title="Dein Zuhause zieht um"
            subtitle="Früher war Wohnen Stillstand. heute ist es Nest."
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
                title: "Architektur für ein bewegtes Leben",
                subtitle: "",
                description:
                  "<span class='text-black font-medium'>Aufbauen. Mitnehmen. Weitergeben.</span>\n<span class='text-nest-gray'>Ganz wie du willst. Früher war ein Haus eine Entscheidung fürs Leben. Heute darf </span><span class='text-black font-medium'>Wohnen beweglich</span><span class='text-nest-gray'> sein. Dank unserer mit </span><span class='text-black font-medium'>Präzision</span><span class='text-nest-gray'> gefertigten Module bleibt </span><span class='text-black font-medium'>Nest stets transportierbar.</span><span class='text-nest-gray'> Dein Haus ist nicht mehr an einen Ort gebunden, sondern kann </span><span class='text-black font-medium'>bewegt, weiterverkauft</span><span class='text-nest-gray'> und an einem neuen Platz </span><span class='text-black font-medium'>wieder aufgestellt</span><span class='text-nest-gray'> werden. Ein Zuhause, das mitdenkt und mitgeht.</span>",
                video: IMAGES.videos.nestHausTransport,
                backgroundColor: "#F4F4F4",
                buttons: [
                  {
                    text: "Unser Philosophie",
                    variant: "primary",
                    size: "xs",
                    link: "/entwurf",
                  },
                  {
                    text: "Unsere Technik",
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
        <section id="unsere-partner" className="w-full pb-8 md:py-16 bg-white">
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
