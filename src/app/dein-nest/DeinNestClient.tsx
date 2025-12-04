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
  SectionHeader,
  PartnersSection,
  ModulhausVergleichSection,
} from "@/components/sections";
import { IMAGES } from "@/constants/images";
import {
  ABLAUF_STEPS_PRESET as _ABLAUF_STEPS_PRESET,
  VIDEO_BACKGROUND_CARDS_PRESET,
} from "@/constants/contentCardPresets";
import Footer from "@/components/Footer";

interface PricingData {
  nest?: {
    nest80?: { price: number };
    nest120?: { price: number };
    nest160?: { price: number };
  };
}

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
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
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

  // Fetch pricing data from API
  useEffect(() => {
    fetch("/api/pricing/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPricingData(data.data);
        }
      })
      .catch((error) => console.error("Failed to load pricing:", error));
  }, []);

  // Helper function to format prices for display
  const formatPrice = (price: number | undefined): string => {
    if (!price) return "213.000";
    return Math.round(price / 1000).toString() + ".000";
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Section 1 - Hero with Image and Overlay Text */}
        <section id="dein-nest-preise" className="w-full">
          <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] 2xl:h-[900px]">
            {/* Background Image */}
            <HybridBlobImage
              path={IMAGES.hero.nestHaus3}
              mobilePath={IMAGES.hero.mobile.nestHaus3}
              alt="NEST-Haus Design - Dein Design im Freistil"
              className="absolute inset-0 w-full h-full object-cover"
              enableMobileDetection={true}
              isAboveFold={true}
              isCritical={true}
            />

            {/* Content Overlay - Using Flexbox */}
            <div className="relative h-full flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
              {/* Header at Top */}
              <div className="flex justify-center">
                <SectionHeader
                  title="Dein ®Nest"
                  subtitle="Hausbau muss nicht immer kompliziert sein"
                  titleClassName="text-white"
                  subtitleClassName="text-white"
                />
              </div>

              {/* Spacer for middle content */}
              <div className="flex-1 flex items-end justify-center pb-8">
                {/* Text Blocks (Desktop Only) */}
                <div className="hidden lg:flex justify-between items-center w-full max-w-[1536px] px-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-40">
                  <div className="flex justify-between items-center w-full px-12">
                    {/* Left Text Block */}
                    <div className="text-center">
                      <h2 className="h2-title font-bold text-white drop-shadow-lg">
                        Nest 80
                      </h2>
                      <h3 className="p-primary text-white drop-shadow-lg">
                        75m² ab €{" "}
                        {formatPrice(pricingData?.nest?.nest80?.price)}.-
                      </h3>
                    </div>

                    {/* Center Text Block */}
                    <div className="text-center">
                      <h2 className="h2-title font-bold text-white drop-shadow-lg">
                        Nest 120
                      </h2>
                      <h3 className="p-primary text-white drop-shadow-lg">
                        115m² ab €{" "}
                        {formatPrice(pricingData?.nest?.nest120?.price)}.-
                      </h3>
                    </div>

                    {/* Right Text Block */}
                    <div className="text-center">
                      <h2 className="h2-title font-bold text-white drop-shadow-lg">
                        Nest 160
                      </h2>
                      <h3 className="p-primary text-white drop-shadow-lg">
                        155m² ab €{" "}
                        {formatPrice(pricingData?.nest?.nest160?.price)}.-
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons at Bottom */}
              <div className="flex gap-4 justify-center">
                <Link href="/konzept-check">
                  <Button variant="primary" size="xs">
                    <span className="md:hidden">Konzept-Check</span>
                    <span className="hidden md:inline">Konzept-Check</span>
                  </Button>
                </Link>
                <Link href="/kontakt">
                  <Button variant="landing-secondary" size="xs">
                    <span className="md:hidden">Termin vereinbaren</span>
                    <span className="hidden md:inline">Termin vereinbaren</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Section 2 - Text Content Below Hero */}
        <section id="intro-nest" className="w-full relative bg-white">
          {/* Text Content Below Video */}
          <div className="max-w-[1440px] 2xl:max-w-[1440px] px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-32 mx-auto pt-8 md:pt-16">
            <h2
              className="h2-title text-center"
              dangerouslySetInnerHTML={{
                __html:
                  "<span class='text-nest-gray'>Das </span><span class='text-black font-medium'>erste Haus</span><span class='text-nest-gray'> der </span><span class='text-black font-medium'>Welt</span><span class='text-nest-gray'>, welches sich an </span><span class='text-black font-medium'>dein Leben anpasst</span><span class='text-nest-gray'>, nicht umgekehrt.</span><br/><br/><span class='text-nest-gray'>Deine </span><span class='text-black font-medium'>Atmosphäre</span><span class='text-nest-gray'>, deine Vorstellungen. </span><span class='text-black font-medium'>Weil nur du weißt, wie du richtig wohnst.</span>",
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
              <div className="w-full max-w-[1536px] mx-auto px-12 sm:px-12 lg:px-12">
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
                <Link href="/nest-system">
                  <Button variant="primary" size="xs">
                    Nest-System
                  </Button>
                </Link>
                <Link href="/warum-wir">
                  <Button variant="landing-secondary-blue" size="xs">
                    Warum mit Nest?
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
            subtitle="Gestalten heißt verstehen"
            mobileTitle="Konfiguriere dein<br/>®Nest Haus"
            wrapperMargin="mb-8 md:mb-12"
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
                title: "Dein Stil. Dein Zuhause.",
                subtitle: "",
                description:
                  "<span class='text-nest-gray'>Im Nest Konfigurator gestaltest du </span><span class='text-black font-medium'>dein Zuhause Schritt für Schritt</span><span class='text-nest-gray'> und behältst den Preis stets im Überblick.</span><br/><br/><span class='text-nest-gray'>Entdecke unsere </span><span class='text-black font-medium'>vielfältigen Möglichkeiten</span><span class='text-nest-gray'> und konfiguriere deine Basis für dein individuelles </span><span class='text-black font-medium'>Nest-Haus</span><span class='text-nest-gray'>.</span>",
                video: IMAGES.variantvideo.twelve,
                backgroundColor: "#F4F4F4",
                playbackRate: 0.5,
                buttons: [
                  {
                    text: "Konzept-Check",
                    variant: "primary",
                    size: "xs",
                    link: "/konzept-check",
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

          {/* Mobile-only button underneath the card */}
          {isMobile && (
            <div className="flex justify-center mt-6">
              <Link href="/konfigurator">
                <Button variant="primary" size="xs">
                  Jetzt konfigurieren
                </Button>
              </Link>
            </div>
          )}
        </section>
        {/* Section 6 - Video Background Cards */}
        <section id="vorteile-nest" className="w-full py-8 md:py-16 bg-white">
          <div className="w-full mb-12">
            <div className="md:pl-12 text-center">
              <h2 className="h2-title font-normal text-black mb-3 md:mb-4">
                Warum Nest Sinn macht?
              </h2>
              <h3 className="h3-secondary font-normal text-black">
                Weil bauen nicht immer kompliziert sein muss.
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
              (card) => card.id >= 1 && card.id <= 5
            )}
          />
        </section>
        {/* Section 7 - Transportabilitaet Video */}
        {/* 📚 Catalog: @sections/catalog/CATALOG.md → "Transportabilitaet" */}
        <section id="transport" className="w-full py-12 md:py-16 bg-white">
          <SectionHeader
            title="Dein Zuhause zieht um"
            subtitle="Take it easy."
            mobileTitle="Dein Zuhause zieht um"
            wrapperMargin="mb-8 md:mb-12"
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
                  "<span class='text-black font-medium'>Aufbauen. Mitnehmen. Weitergeben.</span><br/><br/><span class='text-nest-gray'>Das einzige Haus der Welt, dass sich an die Lebenszyklen seiner Bewohner anpasst.<br/><br/>Nicht umgekehrt.</span>",
                video: IMAGES.videos.nestHausTransport,
                backgroundColor: "#F4F4F4",
                buttons: [
                  {
                    text: "Unsere Philosophie",
                    variant: "primary",
                    size: "xs",
                    link: "/warum-wir",
                  },
                  {
                    text: "Unsere Technik",
                    variant: "landing-secondary-blue",
                    size: "xs",
                    link: "/nest-system",
                  },
                ],
              },
            ]}
          />

          {/* Mobile-only button underneath the card */}
          {isMobile && (
            <div className="flex justify-center mt-6">
              <Link href="/warum-wir">
                <Button variant="primary" size="xs">
                  Unsere Philosophie
                </Button>
              </Link>
            </div>
          )}
        </section>
        {/* Section 8 - Partners */}
        <section id="unsere-partner" className="w-full pb-8 md:py-16 bg-white">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <PartnersSection />
          </div>
        </section>
      </SectionRouter>

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
