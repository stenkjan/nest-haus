"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
import PlanungspaketeCardsLightbox from "@/components/cards/PlanungspaketeCardsLightbox";
import { usePlanungspaketePopup } from "@/hooks/usePlanungspaketePopup";
import {
  FullWidthTextGrid,
  ImageWithFourTextGrid,
  ThreeByOneGrid,
  ThreeByOneAdaptiveHeight,
  FullWidthImageGrid,
} from "@/components/grids";
import {
  GetInContactBanner,
  LandingImagesCarousel,
  MaterialShowcase,
  SectionHeader,
} from "@/components/sections";
import { HybridBlobImage, ClientBlobVideo } from "@/components/images";
import { UnifiedContentCard } from "@/components/cards";
import { PlanungspaketeCards } from "@/components/cards";
import { useContentAnalytics } from "@/hooks";
import type { SectionDefinition } from "@/types";

import { IMAGES } from "@/constants/images";
import { getContentById } from "@/constants/cardContent";
import Footer from "@/components/Footer";

// Define sections with proper structure for dein-part page (now includes unser-part content)
const sections: SectionDefinition[] = [
  // Moved from unser-part
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
    id: "unser-part-individualisierung",
    title: "Raum zum Träumen",
    slug: "unser-part-individualisierung",
  },
  // Original dein-part content
  {
    id: "freiraum",
    title: "Dein kreativer Freiraum",
    slug: "freiraum",
  },
  {
    id: "moeglichkeiten",
    title: "Wir liefern Möglichkeiten",
    slug: "moeglichkeiten",
  },
  {
    id: "individualisierung",
    title: "Du individualisierst dein NEST Haus",
    slug: "individualisierung",
  },
  {
    id: "freiheit",
    title: "Hier beginnt Freiheit",
    slug: "freiheit",
  },
  {
    id: "installationsebene",
    title: "Die Installationsebene",
    slug: "installationsebene",
  },
  {
    id: "wohnflaeche-erweitern",
    title: "Wohnfläche erweitern?",
    slug: "wohnflaeche-erweitern",
  },
  {
    id: "flexibilitaet",
    title: "Ob Decke einziehen, oder Haus erweitern.",
    slug: "flexibilitaet",
  },
  {
    id: "step-by-step",
    title: "Step by Step nach Hause",
    slug: "step-by-step",
  },
  {
    id: "video-gallery",
    title: "Deine Gestaltungsmöglichkeiten",
    slug: "gestaltungsmoeglichkeiten",
  },
  {
    id: "planungspakete",
    title: "Unterstützung gefällig?",
    slug: "planungspakete",
  },
  {
    id: "video-section",
    title: "Die Vielfalt unserer Module",
    slug: "modul-vielfalt",
  },
  {
    id: "call-to-action",
    title: "Bereit für dein NEST Haus?",
    slug: "bereit",
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

export default function NestSystemClient() {
  const [currentSectionId, setCurrentSectionId] =
    useState<string>("dein-nest-system");
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen, openPlanungspakete, closePlanungspakete } =
    usePlanungspaketePopup();
  const router = useRouter();

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

  // Button click handlers
  const handleDiePaketeClick = () => {
    openPlanungspakete();
  };

  const handleJetztBauenClick = () => {
    router.push("/konfigurator");
  };

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      {/* White background for navbar area */}
      <div
        className="fixed top-0 left-0 right-0 bg-white z-[90]"
        style={{ height: "var(--navbar-height, 3.5rem)" }}
      ></div>
      <div>
        <SectionRouter
          sections={sections}
          onSectionChange={setCurrentSectionId}
        >
          {/* Moved from unser-part: Video Section - Dein Nest System */}
          <section
            id="dein-nest-system"
            className="bg-black pt-12 pb-8 md:pb-16"
          >
            <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
              <SectionHeader
                title="Dein ®Nest System"
                subtitle="Individualisiert, wo es Freiheit braucht. Standardisiert, wo es Effizienz schafft."
                titleClassName="text-white"
                subtitleClassName="text-white"
                wrapperMargin="mb-12"
              />

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
                    fallbackSrc={
                      IMAGES.function.mobile.nestHausModulSchemaIntro
                    } // Fallback to mobile version
                    className="w-full h-auto object-contain"
                    autoPlay={true}
                    loop={false}
                    muted={true}
                    playsInline={true}
                    controls={false}
                    playbackRate={2.5}
                    enableCache={true}
                    onError={(error) => {
                      console.error("🎥 Video component error:", error);
                      // Could add additional error handling here if needed
                    }}
                  />
                  {/* Barrierefreiheit - Beschreibung für Screenreader */}
                  <span className="sr-only">
                    Video-Demonstration des NEST-Haus modularen Bausystems zeigt
                    architektonische Komponenten und Montageprozess
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Moved from unser-part: Combined ThreeByOneGrid Section - Größe */}
          <section id="groesse" className="py-8 md:py-16">
            <SectionHeader
              title="Manchmal kommt es auf die Größe an."
              subtitle="6 Meter Hoch, 8 Meter Breit, unendlich lang."
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-12 2xl:mb-24"
            />
            <ThreeByOneGrid
              backgroundColor="black"
              text="<p class='p-secondary text-white'><span class='text-white font-medium'>Standardisierung</span> <span class='text-nest-gray'>für</span> <span class='text-white font-medium'>Effizienz, Freiheit</span> <span class='text-nest-gray'>für</span> <span class='text-white font-medium'>Gestaltung.</span> <span class='text-nest-gray'>Alles, was sinnvoll standardisiert werden kann, wird perfektioniert.</span> <span class='text-white font-medium'>Präzisionsgefertigte Module,</span> <span class='text-nest-gray'>effiziente Prozesse und bewährte Konstruktionen sichern</span> <span class='text-white font-medium'>höchste Qualität</span> <span class='text-nest-gray'>zu einem</span> <span class='text-white font-medium'>leistbaren Preis.</span><br/><br/><span class='text-nest-gray'>Gleichzeitig bleibt volle</span> <span class='text-white font-medium'>Gestaltungsfreiheit</span> <span class='text-nest-gray'>dort, wo sie wirklich zählt.</span></p>"
              textPosition="left"
              maxWidth={false}
              image1={IMAGES.function.nestHausModulKonzept}
              image2={IMAGES.function.nestHausModulLiniengrafik}
              image1Description="NEST-Haus Modul Stirnseite Ansicht Schema Konzept"
              image2Description="NEST-Haus Modul Holz Schema Konzept"
              textWrapperClassName="mt-8 md:mt-0"
            />

            {/* ThreeByOneGrid - Right Position (No Title/Subtitle) */}
            <div className="pt-16 md:pt-16">
              <ThreeByOneGrid
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

          {/* Moved from unser-part: Materialien Section */}
          <section id="materialien" className="pt-8 md:pt-16 pb-8 md:pb-16">
            <SectionHeader
              title="Gut für Dich, besser für die Zukunft"
              subtitle="Entdecke unsere sorgfältig ausgewählten Materialien"
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-12"
            />

            {/* MaterialShowcase Section - Optimized */}
            <MaterialShowcase
              title=""
              subtitle=""
              backgroundColor="black"
              maxWidth={false}
              showInstructions={true}
            />
          </section>

          {/* Moved from unser-part: ThreeByOneAdaptiveHeight Grid - Fenster & Türen */}
          <section id="fenster-tueren" className="pt-8 md:pt-16 pb-8 md:pb-16">
            <SectionHeader
              title="Fenster & Türen"
              subtitle="Deine Fenster- und Türöffnungen werden dort platziert, wo du es möchtest."
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-12"
            />
            <ThreeByOneAdaptiveHeight
              backgroundColor="black"
              imageDescription="NEST-Haus Expertise und professionelle Beratung"
              maxWidth={false}
            />

            {/* ThreeByOneGrid - Left Position (Bottom Section) */}
            <ThreeByOneGrid
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
            <div className="pt-16 md:pt-16">
              <ThreeByOneGrid
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
                primaryButtonOnClick={handleDiePaketeClick}
                secondaryButtonOnClick={handleJetztBauenClick}
              />
            </div>
          </section>

          {/* Moved from unser-part: FullWidthImageGrid - Raum zum Träumen */}
          <section id="unser-part-individualisierung" className="py-8 md:py-16">
            <SectionHeader
              title="Raum zum Träumen"
              subtitle="Eine Bauweise die, das Beste aus allen Welten, kombiniert."
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-12"
            />
            <FullWidthImageGrid
              backgroundColor="black"
              textBox1="<p class='p-secondary text-white'><span class='text-nest-gray'>Warum solltest du dich zwischen Flexibilität, Qualität und Nachhaltigkeit entscheiden, wenn du</span> <span class='text-white font-medium'>mit dem Nest System alles haben</span> <span class='text-nest-gray'>kannst? Unsere Architekten und Ingenieure haben ein Haus entwickelt, das</span> <span class='text-white font-medium'>maximale Freiheit ohne Kompromisse</span> <span class='text-nest-gray'>bietet. Durch</span> <span class='text-white font-medium'>intelligente Standardisierung</span> <span class='text-nest-gray'>garantieren wir</span> <span class='text-white font-medium'>höchste</span></p>"
              textBox2="<p class='p-secondary text-white'>Qualität, Langlebigkeit <span class='text-nest-gray'>und</span> Nachhaltigkeit zum bestmöglichen Preis. <span class='text-nest-gray'>Präzisionsgefertigte Module sorgen für Stabilität, Energieeffizienz und ein unvergleichliches Wohngefühl.</span> Dein Zuhause, dein Stil, deine Freiheit. <span class='text-nest-gray'>Mit Nest. musst du dich nicht entscheiden, denn du bekommst alles.</span> <span class='text-white font-medium'>Heute bauen, morgen wohnen - Nest.</span></p>"
              maxWidth={false}
              showButtons={true}
              primaryButton={{
                text: "Dein Part",
                href: "/dein-part",
                variant: "primary",
                size: "xs",
              }}
              secondaryButton={{
                text: "Jetzt bauen",
                href: "/konfigurator",
                variant: "landing-secondary",
                size: "xs",
              }}
            />
          </section>

          {/* Original dein-part content starts here */}
          {/* Section 3 - Du individualisierst dein NEST Haus */}
          <section
            id="individualisierung"
            className="w-full pt-16 pb-8 md:pb-16 bg-black"
          >
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                title="Dein Raum zum Träumen"
                subtitle="Weil nur du weißt, wie du richtig wohnst."
                titleClassName="text-white"
                subtitleClassName="text-white"
                wrapperMargin="mb-12"
              />

              {/* Image container with same sizing as unser-part page */}
              <div className="w-full max-w-screen-2xl mx-auto md:px-8">
                <div className="flex justify-center">
                  <div className="w-full max-w-6xl overflow-hidden">
                    <HybridBlobImage
                      path={IMAGES.function.nestHausGrundrissSchema}
                      alt="NEST-Haus Grundriss Schema - Individualisierung und Planung"
                      width={1536}
                      height={809}
                      className="w-full md:w-4/5 h-auto object-contain md:mx-auto"
                      sizes="(max-width: 768px) calc(80vw - 32px), (max-width: 1024px) calc(80vw - 64px), 922px"
                      quality={85}
                      strategy="client"
                      enableCache={true}
                      isInteractive={true}
                      isAboveFold={false}
                      isCritical={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 - Hier beginnt Freiheit */}
          <section id="freiheit" className="w-full bg-black py-8 md:py-16">
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                title="Hier beginnt Freiheit"
                subtitle="Individuell dort, wo es zählt."
                titleClassName="text-white"
                subtitleClassName="text-white"
                wrapperMargin="mb-12"
              />
              <FullWidthTextGrid
                backgroundColor="black"
                textBox1="<p class='p-secondary text-white'><span class='text-nest-gray'>Mit Nest hast du die</span> <span class='text-white font-medium'>Freiheit, deinen Grundriss so zu gestalten,</span> <span class='text-nest-gray'>wie es zu deinem Leben passt. Kein Schema, kein Standard. Nur Räume, die sich anfühlen wie du selbst.</span> <span class='text-white font-medium'>Denn richtig wohnen bedeutet mehr als Fläche und Funktion.</span> <span class='text-nest-gray'>Es ist Persönlichkeit, Ausdruck und Alltag der von dir in Einklang gebracht wird.</span></p>"
                textBox2="<p class='p-secondary text-white'><span class='text-nest-gray'>Wenn du auf dem Weg dorthin</span> Unterstützung <span class='text-nest-gray'>möchtest, begleiten wir dich Schritt für Schritt. Unsere</span> Planungspakete <span class='text-nest-gray'>führen dich</span> von der Einreichplanung bis zur Gestaltung des Innenraums. <span class='text-nest-gray'>Individuell, durchdacht und auf deine Vorstellungen abgestimmt. So entsteht aus einer Idee</span> <span class='text-white font-medium'>ein Zuhause, das wirklich zu dir passt.</span></p>"
                maxWidth={false}
              />

              {/* UnifiedContentCard with image-only layout */}
              <UnifiedContentCard
                layout="image-only"
                style="glass"
                variant="static"
                backgroundColor="black"
                maxWidth={false}
                showInstructions={false}
                category="fullImageCards"
                customData={
                  getContentById("fullImageCards", 1)
                    ? [getContentById("fullImageCards", 1)!]
                    : []
                }
                enableLightbox={false}
              />

              {/* Additional Button Combination */}
              <div className="flex gap-4 justify-center w-full">
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

          {/* Section 5 - Die Installationsebene */}
          <section
            id="installationsebene"
            className="w-full py-8 md:py-16 bg-black"
          >
            <SectionHeader
              title="Konzipiert für deine Ideen"
              subtitle="Leitungen verlegen muss nicht immer kompliziert sein."
              titleClassName="text-white"
              subtitleClassName="text-white"
            />
            <ImageWithFourTextGrid
              backgroundColor="black"
              image={IMAGES.function.nestHausModulElektrikSanitaer}
              mobileImage={IMAGES.function.mobile.nestHausModulElektrikSanitaer}
              imageDescription="NEST-Haus Modulansicht für deinen Part"
              textCellTitle1="Die Installationsebene"
              textCell1="Alle unsere Gebäude werden mit einer Installationsebene ausgeführt und sind so konzipiert, dass ein unkompliziertes Demontieren der Interior-Platten möglich ist. Im Anschluss können sämltiche Elektro-, & Installationsarbeiten durchgeführt werden. 
Nach Abschluss dieser Arbeiten können die Interior-Platten wieder montiert werden. Dies ermöglicht eine stetigen Zugang zu sämtlichen im Gebäude verlegten Leitungen und ermöglicht auch eine unkomplizierte Erweiterung, Montage & Wartung."
              textCellTitle2="Wie transportierbar?"
              textCell2="Für den Transport des Gebäudes müssen die HKLS-Leitungen an den Schnittstellen zwischen den Modulen so ausgeführt werden, dass sie mit Muffen bzw. Verbindungsdosen von einander getrennt werden können. In unserem Planungspaket für HKLS-Technik erhältst du, die von uns vorgeschlagenen individuellen Lösungen der einzelnen Verbindungstechniken."
              textCellTitle3="Der Technikbereich"
              textCell3="Der Technikbereich im Gebäude sollte sich möglichst nahe beim Durchbruch zu den Gebäudeanschluss befinden. Hier werden die Schnittstellen vom öffentlichen Anschluss an Strom, Wasser und Kanal weiter in das Gebäude verteilt."
              textCellTitle4="Der Gebäudeanschluss"
              textCell4="Im Gebäude müssen sich zumindest zwei voneinander getrennte Durchbrüche zu den Versorgungsleitungen befinden. Der Stromanschluss ist immer separat mit einem eigenen Anschlussschacht auszuführen."
              maxWidth={false}
            />
          </section>

          {/* Wohnfläche erweitern Section */}
          <section
            id="wohnflaeche-erweitern"
            className="w-full py-8 md:py-16 bg-black"
          >
            <SectionHeader
              title="Wohnfläche erweitern?"
              subtitle="Kein Problem."
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-12 2xl:mb-24"
            />
            <ThreeByOneGrid
              text="<p class='p-secondary text-white'>Mehr Raum, wenn du ihn brauchst. <span class='text-nest-gray'>Dein Nest Haus wächst mit. Dank durchdachter Konstruktion kannst du</span> jederzeit eine Zwischendecke einziehen <span class='text-nest-gray'>und dein Zuhause ganz einfach in ein zweigeschoßiges Raumwunder verwandeln.</span></p>"
              image1={IMAGES.function.nestHausPlattenFundament}
              image2={IMAGES.function.nestHausFundamentStreifenfundament}
              image1Description="NEST-Haus Planung Innenausbau mit Zwischendecke - Leichtbau Modul"
              image2Description="NEST-Haus Fundament Streifenfundament für Zwischendecke - Leichtbau Modul"
              textPosition="left"
              backgroundColor="black"
              maxWidth={false}
            />
          </section>

          {/* Flexibilität Section */}
          <section id="flexibilitaet" className="w-full py-8 md:py-16 bg-black">
            <SectionHeader
              title="Ob Decke einziehen, oder Haus erweitern."
              subtitle="Dein Nest bleibt flexibel und lässt sich an deine Lebensumstände anpassen"
              titleClassName="text-white"
              subtitleClassName="text-nest-gray"
              wrapperMargin="mb-12 2xl:mb-24"
            />
            <ThreeByOneGrid
              text="<p class='p-secondary text-white'><span class='text-nest-gray'>Durch intelligente</span> Standardisierung <span class='text-nest-gray'>garantieren wir</span> höchste Qualität, Langlebigkeit und Nachhaltigkeit zum bestmöglichen Preis. <span class='text-nest-gray'>Präzisionsgefertigte Module sorgen für</span> <span class='text-nest-gray'>Stabilität, Energieeffizienz</span> <span class='text-nest-gray'>und ein unvergleichliches Wohngefühl.</span> Dein Zuhause. Dein Stil. Deine Freiheit. <span class='text-nest-gray'>Mit Nest. musst du dich nicht entscheiden,</span> <span class='text-nest-gray'>denn</span> du bekommst alles.</p>"
              image1={IMAGES.function.nestHausFundamentPunktfundament}
              image2={IMAGES.function.nestHausFlexibilitaetErweiterung}
              image1Description="NEST-Haus Erweiterung Modulbau vergrößern Leichtbau Modul flexibel"
              image2Description="NEST-Haus Flexibilität Erweiterung Modulbau"
              textPosition="right"
              backgroundColor="black"
              maxWidth={false}
              textWrapperClassName="mt-12"
            />
          </section>

          {/* Planungspakete Section - Unterstützung gefällig? */}
          <section
            id="planungspakete"
            className="w-full py-8 md:py-16 bg-white"
          >
            <div className="w-full max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 md:mb-6">
                <h1 className="h1-secondary text-gray-900 mb-2 md:mb-3">
                  Unterstützung gefällig?
                </h1>
                <h3 className="h3-secondary text-gray-600 mb-8">
                  Entdecke unsere Planungs-Pakete, um das Beste für dich und
                  dein Nest rauszuholen.
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
    </div>
  );
}
