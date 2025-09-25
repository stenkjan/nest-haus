"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
import PlanungspaketeCardsLightbox from "@/components/cards/PlanungspaketeCardsLightbox";
import { usePlanungspaketePopup } from "@/hooks/usePlanungspaketePopup";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import {
  ThreeByOneAdaptiveHeight,
  FullWidthImageGrid,
  ThreeByOneGrid,
} from "@/components/grids";
import { ClientBlobVideo } from "@/components/images";
import {
  MaterialShowcase,
  LandingImagesCarousel,
  GetInContactBanner,
} from "@/components/sections";
import { PlanungspaketeCards } from "@/components/cards";
import { IMAGES } from "@/constants/images";
import { useContentAnalytics } from "@/hooks";
import type { SectionDefinition } from "@/types";
import Footer from "@/components/Footer";

// Define sections with proper structure for unser-part
const sections: SectionDefinition[] = [
  {
    id: "dein-nest-system",
    title: "Dein Nest System",
    slug: "nest-system",
  },
  {
    id: "groesse",
    title: "Manchmal kommt es auf die Größe an",
    slug: "groesse",
  },
  {
    id: "materialien",
    title: "Gut für Dich, besser für die Zukunft",
    slug: "materialien",
  },
  {
    id: "fenster-tueren",
    title: "Fenster & Türen",
    slug: "fenster-tueren",
  },
  {
    id: "individualisierung",
    title: "Raum zum Träumen",
    slug: "individualisierung",
  },
  {
    id: "call-to-action",
    title: "Kein Plan? Kein Problem!",
    slug: "kein-plan",
  },
  {
    id: "planungspakete",
    title: "Unterstützung gefällig?",
    slug: "planungspakete",
  },
  {
    id: "video-gallery",
    title: "Die Vielfalt unserer Module",
    slug: "modul-vielfalt",
  },
];

// Helper function to get mobile video path
const getMobileVideoPath = (desktopPath: string): string => {
  // Map desktop video path to mobile version using constants
  if (desktopPath === IMAGES.function.nestHausModulSchemaIntro) {
    return IMAGES.function.mobile.nestHausModulSchemaIntro;
  }
  return desktopPath;
};

export default function UnserPartClient() {
  const [currentSectionId, setCurrentSectionId] =
    useState<string>("dein-nest-system");
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen, openPlanungspakete, closePlanungspakete } =
    usePlanungspaketePopup();

  // Simple width-based mobile detection (same as entdecken page)
  useEffect(() => {
    const checkDevice = () => {
      const newIsMobile = window.innerWidth < 768; // Same breakpoint as entdecken page
      setIsMobile(newIsMobile);
    };

    // Initial check
    checkDevice();

    // Listen for resize events
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Analytics tracking for content engagement
  const { trackButtonClick: _trackButtonClick } = useContentAnalytics({
    pageType: "content",
    sections,
    currentSectionId,
    enabled: true,
  });

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Video Section - Dein Nest System */}
        <section id="dein-nest-system" className="bg-black pt-12 pb-8 md:pb-0">
          <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h1 className="h1-secondary text-white mb-2 md:mb-3">
                Dein Nest System
              </h1>
              <h3 className="h3-secondary text-nest-gray">
                Individualisiert, wo es Freiheit braucht. Standardisiert, wo es
                Effizienz schafft.
              </h3>
            </div>

            <div className="flex justify-center">
              <div className="w-full md:w-4/5 max-w-5xl rounded-none md:rounded-lg overflow-hidden bg-gray-900">
                <ClientBlobVideo
                  path={
                    isMobile
                      ? getMobileVideoPath(
                          IMAGES.function.mobile.nestHausModulSchemaIntro
                        )
                      : IMAGES.function.nestHausModulSchemaIntro
                  }
                  fallbackSrc={IMAGES.function.mobile.nestHausModulSchemaIntro} // Fallback to mobile version
                  className="w-full h-auto object-contain"
                  autoPlay={true}
                  loop={false}
                  muted={true}
                  playsInline={true}
                  controls={false}
                  enableCache={true}
                  onError={(error) => {
                    console.error("🎥 Video component error:", error);
                    // Could add additional error handling here if needed
                  }}
                />
                {/* Accessibility description for screen readers */}
                <span className="sr-only">
                  Video demonstration of NEST-Haus modular construction system
                  showing architectural components and assembly process
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Combined ThreeByOneGrid Section - Größe */}
        <section id="groesse" className="py-8 md:py-16">
          <ThreeByOneGrid
            title="Manchmal kommt es auf die Größe an."
            subtitle="6 Meter Hoch, 8 Meter Breit, unendlich lang."
            backgroundColor="black"
            text="<p class='p-secondary text-white'><span class='text-white font-medium'>Standardisierung</span> <span class='text-nest-gray'>für</span> <span class='text-white font-medium'>Effizienz</span> <span class='text-nest-gray'>und</span> <span class='text-white font-medium'>Kostenoptimierung.</span> <span class='text-nest-gray'>Höchste Qualität zu einem leistbaren Preis durch</span> <span class='text-white font-medium'>intelligente</span> <span class='text-white font-medium'>Optimierung</span> <span class='text-nest-gray'>– und volle gestalterische Freiheit dort, wo sie wirklich zählt. Alles, was sinnvoll standardisierbar ist, wird perfektioniert:</span> <span class='text-white font-medium'>Präzisionsgefertigte Module,</span> <span class='text-white font-medium'>effiziente Fertigung</span> <span class='text-nest-gray'>und bewährte</span> <span class='text-white font-medium'>Konstruktion</span> <span class='text-nest-gray'>sichern</span> <span class='text-white font-medium'>höchste Qualität.</span></p>"
            textPosition="left"
            maxWidth={false}
            image1={IMAGES.function.nestHausModulKonzept}
            image2={IMAGES.function.nestHausModulLiniengrafik}
            image1Description="NEST-Haus Modul Stirnseite Ansicht Schema Konzept"
            image2Description="NEST-Haus Modul Holz Schema Konzept"
          />

          {/* ThreeByOneGrid - Right Position (No Title/Subtitle) */}
          <div className="pt-16 md:pt-32">
            <ThreeByOneGrid
              title=""
              subtitle=""
              backgroundColor="black"
              text="<p class='p-secondary text-white'><span class='text-nest-gray'>Das bedeutet:</span> <span class='text-white font-medium'>schnelle Bauzeiten,</span> <span class='text-white font-medium'>zuverlässige Strukturen</span> <span class='text-nest-gray'>und ein</span> <span class='text-white font-medium'>unschlagbares Preis-Leistungs-Verhältnis.</span> <span class='text-nest-gray'>Individualisierung für persönliche Gestaltung. Jedes Zuhause ist einzigartig und genau da, wo es wichtig ist, bieten wir</span> <span class='text-white font-medium'>maximale Freiheit:</span> <span class='text-nest-gray'>Grundriss-gestaltung,Technische Ausstattung, Materialien und Oberflächen, Flexible Wohnflächen.</span></p>"
              textPosition="right"
              maxWidth={false}
              image1={IMAGES.function.nestHausModulSeiteKonzept}
              image2={IMAGES.function.nestHausModulSeiteLiniengrafik}
              image1Description="Seitliche Ansicht zeigt die durchdachte Konstruktion"
              image2Description="Liniengrafik verdeutlicht die optimierte Statik"
            />
          </div>
        </section>

        {/* Materialien Section */}
        <section id="materialien" className="pt-8 md:pt-16 pb-8 md:pb-16">
          <div className="text-center mb-12 px-4">
            <h1 className="h1-secondary text-white mb-2 md:mb-3">
              Gut für Dich, besser für die Zukunft
            </h1>
            <h3 className="h3-secondary text-nest-gray">
              Entdecke unsere sorgfältig ausgewählten Materialien
            </h3>
          </div>

          {/* MaterialShowcase Section - Optimized */}
          <MaterialShowcase
            title=""
            subtitle=""
            backgroundColor="black"
            maxWidth={false}
            showInstructions={true}
          />
        </section>

        {/* ThreeByOneAdaptiveHeight Grid - Fenster & Türen */}
        <section id="fenster-tueren" className="pt-8 md:pt-16 pb-8 md:pb-16">
          <ThreeByOneAdaptiveHeight
            title="Fenster & Türen"
            subtitle="Deine Fenster- und Türöffnungen werden dort platziert, wo du es möchtest."
            backgroundColor="black"
            imageDescription="NEST-Haus Expertise und professionelle Beratung"
            maxWidth={false}
          />

          {/* ThreeByOneGrid - Left Position (Bottom Section) */}
          <ThreeByOneGrid
            title=""
            subtitle=""
            backgroundColor="black"
            text="<p class='p-secondary text-white'><span class='text-nest-gray'>Unser</span> <span class='text-white font-medium'>Nest System</span> <span class='text-nest-gray'>bietet dir an den</span> <span class='text-white font-medium'>Seitenwänden</span> <span class='text-nest-gray'>und an der</span> <span class='text-white font-medium'>Giebelseite</span> <span class='text-nest-gray'>volle Gestaltungsfreiheit.</span> <span class='text-nest-gray'> Hier kannst du deine</span> <span class='text-white font-medium'>Fenster und Türen</span> <span class='text-nest-gray'>so platzieren, wie es zu dir und deinem Zuhause passt. Gemeinsam mit uns definierst du</span> <span class='text-white font-medium'>Größe und Position</span> <span class='text-nest-gray'>individuell nach</span> <span class='text-white font-medium'>deinen Wünschen</span> <span class='text-nest-gray'>und Anforderungen.</span></p>"
            textPosition="left"
            maxWidth={false}
            image1={IMAGES.function.nestHausFensterTuerenStirnseite}
            image2={IMAGES.function.nestHausFensterTuerenAbschlussmodul}
            image1Description="Fenster und Türen Einbau Positionierung"
            image2Description="Mittelmodul Liniengrafik Fenster und Türen"
          />

          {/* ThreeByOneGrid - Right Position (Bottom Section) */}
          <div className="pt-16 md:pt-32">
            <ThreeByOneGrid
              title=""
              subtitle=""
              backgroundColor="black"
              text="<p class='p-secondary text-white'><span class='text-nest-gray'>Mit unseren</span> <span class='text-white font-medium'>Beleuchtungspaketen</span> <span class='text-nest-gray'>legst du die</span> <span class='text-white font-medium'>Gesamtfläche</span> <span class='text-nest-gray'>deiner</span> <span class='text-white font-medium'>Fenster und Türen</span> <span class='text-nest-gray'>fest, angepasst an deine individuellen Bedürfnisse. Der</span> <span class='text-white font-medium'>Preis bleibt</span> <span class='text-nest-gray'>dabei jederzeit</span> <span class='text-white font-medium'>transparent.</span></p>"
              textPosition="right"
              maxWidth={false}
              image1={IMAGES.function.nestHausModulSeiteKonzept}
              image2={IMAGES.function.nestHausFensterTuerenMittelmodul}
              image1Description="Modul Seitenansicht Holz Schema Konzept"
              image2Description="Planung Innenausbau Fenster Türen Mittelmodul Liniengrafik"
              showButtons={true}
              primaryButtonText="Die Pakete"
              secondaryButtonText="Jetzt bauen"
            />
          </div>
        </section>

        {/* FullWidthImageGrid - Raum zum Träumen (moved to individualisierung) */}
        <section id="individualisierung" className="py-8 md:py-16">
          <FullWidthImageGrid
            title="Raum zum Träumen"
            subtitle="Eine Bauweise die, das Beste aus allen Welten, kombiniert."
            backgroundColor="black"
            textBox1="<p class='p-secondary text-white'><span class='text-nest-gray'>Warum solltest du dich zwischen Flexibilität, Qualität und Nachhaltigkeit entscheiden, wenn du</span> <span class='text-white font-medium'>mit dem Nest System alles haben</span> <span class='text-nest-gray'>kannst? Unsere Architekten und Ingenieure haben ein Haus entwickelt, das</span> <span class='text-white font-medium'>maximale Freiheit ohne Kompromisse</span> <span class='text-nest-gray'>bietet. Durch</span> <span class='text-white font-medium'>intelligente Standardisierung</span> <span class='text-nest-gray'>garantieren wir</span> <span class='text-white font-medium'>höchste</span></p>"
            textBox2="<p class='p-secondary text-white'>Qualität, Langlebigkeit <span class='text-nest-gray'>und</span> Nachhaltigkeit zum bestmöglichen Preis. <span class='text-nest-gray'>Präzisionsgefertigte Module sorgen für Stabilität, Energieeffizienz und ein unvergleichliches Wohngefühl.</span> Dein Zuhause, dein Stil, deine Freiheit. <span class='text-nest-gray'>Mit Nest. musst du dich nicht entscheiden, denn du bekommst alles.</span> <span class='text-white font-medium'>Heute bauen, morgen wohnen - Nest.</span></p>"
            maxWidth={false}
          />
          {/* Button Combo After Component */}
          <div className="flex gap-4 md:mt-8 md:mb-8 justify-center w-full">
            <Link href="/dein-part">
              <Button variant="primary" size="xs">
                Dein Part
              </Button>
            </Link>
            <Link href="/konfigurator">
              <Button variant="landing-secondary" size="xs">
                Jetzt bauen
              </Button>
            </Link>
          </div>
        </section>

        {/* Planungspakete Section */}
        <section id="planungspakete" className="w-full py-8 md:py-16 bg-white">
          <div className="w-full max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-6">
              <h1 className="h1-secondary text-gray-900 mb-2 md:mb-3">
                Unterstützung gefällig?
              </h1>
              <h3 className="h3-secondary text-gray-600 mb-8">
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
      </SectionRouter>

      {/* Contact Banner - Kein Plan? Kein Problem! */}
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
