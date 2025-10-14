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
  addIconsToPreset,
  PLANUNGSPAKETE_PRESET,
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
import { ABLAUF_STEPS_PRESET } from "@/constants/contentCardPresets";
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
                <Link href="/konzept">
                  <Button variant="landing-secondary-blue" size="xs">
                    Konzept
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
                <Link href="/konzept">
                  <Button variant="landing-secondary-blue" size="xs">
                    Konzept
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 - Transportabilitaet Video */}
        {/* 📚 Catalog: @sections/catalog/CATALOG.md → "Transportabilitaet" */}
        <section
          id="transportabilitaet"
          className="w-full py-8 md:py-16 bg-white"
        >
          <SectionHeader
            title="Dein Zuhause zieht um"
            subtitle="Architektur für ein bewegtes Leben."
            wrapperMargin="md:mb-12 mb-12"
          />

          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <VideoCard16by9
              maxWidth={false}
              showInstructions={false}
              cardTitle="Unsere Technik"
              cardDescription="Aufbauen. Mitnehmen. Weitergeben.\nGanz wie du willst. Dank hochpräziser Konstruktion entsteht dein Zuhause in kürzester Zeit, an nahezu jedem Ort. Und wenn du weiterziehst? Dann ziehst du nicht nur um, sondern nimmst dein Zuhause einfach mit. Oder du bleibst flexibel und verkaufst es weiter, so wie ein gut gepflegtes Auto."
              videoPath={IMAGES.videos.nestHausTransport}
              backgroundColor="#F4F4F4"
              buttons={[
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
              ]}
            />
          </div>
        </section>

        {/* Section 4 - Möglichkeiten Entdecken */}
        {/* 📚 Catalog: @sections/catalog/CATALOG.md → "Moeglichkeiten-Entdecken" */}
        <section id="moeglichkeiten" className="w-full py-8 md:py-16 bg-white">
          <SectionHeader
            title="Was macht dein Nest aus?"
            subtitle="Entdecke die Möglichkeiten deines zukünftigen Zuhauses."
            wrapperMargin="mb-12"
          />

          <div className="w-full">
            <TwoByTwoImageGrid
              maxWidth={false}
              customData={[
                {
                  id: 1,
                  title: "Das ®Nest System",
                  subtitle: "Effizient. Präzise. Leistbar.",
                  description: "Dein Raum. Deine Ideen.",
                  image: IMAGES.function.nestHausSystemModulbau,
                  backgroundColor: "#F8F9FA",
                  textColor: "white",
                  primaryAction: "Das Nest System",
                  secondaryAction: "Jetzt bauen",
                  primaryButtonVariant: "landing-primary",
                  secondaryButtonVariant: "landing-secondary",
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
                  textColor: "black",
                  primaryAction: "Die Materialien",
                  secondaryAction: "Jetzt bauen",
                  primaryButtonVariant: "landing-primary",
                  secondaryButtonVariant: "landing-secondary-blue",
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
                  textColor: "white",
                  primaryAction: "Fenster & Türen",
                  secondaryAction: "Jetzt bauen",
                  primaryButtonVariant: "landing-primary",
                  secondaryButtonVariant: "landing-secondary",
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
                  textColor: "white",
                  primaryAction: "Dein Part",
                  secondaryAction: "Jetzt bauen",
                  primaryButtonVariant: "landing-primary",
                  secondaryButtonVariant: "landing-secondary",
                  primaryLink: "/dein-part",
                  secondaryLink: "/konfigurator",
                },
              ]}
            />
          </div>
        </section>

        {/* Section 5 - Konfigurationen */}
        {/* 📚 Catalog: @sections/catalog/CATALOG.md → "Konfigurationen" */}
        <section id="konfigurieren" className="w-full py-8 md:py-16 bg-white">
          <SectionHeader
            title="Konfiguriere dein ®Nest Haus"
            subtitle="Individualisiert, wo es Freiheit braucht. Standardisiert, wo es Effizienz schafft."
            wrapperMargin="mb-12"
          />

          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <VideoCard16by9
              maxWidth={false}
              showInstructions={false}
              cardTitle="Du hast die Wahl"
              cardDescription="Gestalte dein Zuhause so individuell wie dein Leben. In unserem Online-Konfigurator wählst du Größe, Materialien, Ausstattung und Optionen Schritt für Schritt aus. Jede Entscheidung zeigt dir sofort, wie dein Haus aussieht und was es kostet.\nSo erhältst du volle Transparenz und ein realistisches Bild, wie dein Nest-Haus zu deinen Wünschen, deinem Grundstück und deinem Budget passt."
              videoPath={IMAGES.variantvideo.twelve}
              backgroundColor="#F4F4F4"
              playbackRate={0.5}
              buttons={[
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
              ]}
            />
          </div>
        </section>

        {/* Section 6 - So läuft es ab */}
        <section id="ablauf" className="w-full py-8 md:py-16 bg-white">
          <SectionHeader
            title="So läuft's ab"
            subtitle="Dein Weg zum Nest-Haus"
            wrapperMargin="mb-12"
          />

          {/* SquareTextCard with preset data and buttons */}
          <SquareTextCard
            maxWidth={false}
            showInstructions={false}
            customData={addIconsToPreset(ABLAUF_STEPS_PRESET.cards)}
            buttons={ABLAUF_STEPS_PRESET.buttons}
          />
        </section>

        {/* Section 7 - Planungspakete */}
        <section id="planungspakete" className="w-full py-8 md:py-16 bg-white">
          <div className="w-full max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Unterstützung gefällig?"
              subtitle="Entdecke unsere Planungs-Pakete, um das Beste für dich und dein Nest rauszuholen."
              wrapperMargin="mb-12"
            />

            <PlanungspaketeCards
              maxWidth={false}
              showInstructions={false}
              customData={PLANUNGSPAKETE_PRESET.cards}
              buttons={PLANUNGSPAKETE_PRESET.buttons}
              onOpenLightbox={openPlanungspakete}
            />
          </div>
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
