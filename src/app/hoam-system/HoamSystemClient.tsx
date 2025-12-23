"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
import PlanungspaketeCardsLightbox from "@/components/cards/PlanungspaketeCardsLightbox";
import { usePlanungspaketePopup } from "@/hooks/usePlanungspaketePopup";
import {
  FullWidthTextGrid,
  ImageWithFourTextGrid,
  ThreeByOneGrid,
  ThreeByOneAdaptiveHeight,
} from "@/components/grids";
import {
  MaterialShowcase,
  SectionHeader,
  FAQSection,
} from "@/components/sections";
import { HybridBlobImage, ClientBlobVideo } from "@/components/images";
import { useContentAnalytics } from "@/hooks";
import type { SectionDefinition } from "@/types";

import { IMAGES } from "@/constants/images";
import Footer from "@/components/Footer";

// Define sections for hoam-system page
const sections: SectionDefinition[] = [
  {
    id: "unsere-technik",
    title: "®Hoam System",
    slug: "unsere-technik",
  },
  {
    id: "dimensionen-module",
    title: "Manchmal kommt es auf die Größe an",
    slug: "dimensionen-module",
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
    title: "Dein Raum zum Träumen",
    slug: "individualisierung",
  },
  {
    id: "haustechnik",
    title: "Konzipiert für deine Ideen",
    slug: "haustechnik",
  },
  {
    id: "modulerweiterung",
    title: "Wohnfläche erweitern?",
    slug: "modulerweiterung",
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

export default function HoamSystemClient() {
  const [currentSectionId, setCurrentSectionId] =
    useState<string>("unsere-technik");
  const [isMobile, setIsMobile] = useState(false);
  const {
    isOpen,
    openPlanungspakete: _openPlanungspakete,
    closePlanungspakete,
  } = usePlanungspaketePopup();

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
          {/* Section 1 - ®Hoam System */}
          <section id="unsere-technik" className="bg-black pt-12 pb-8 md:pb-16">
            <SectionHeader
              title="®Hoam System"
              subtitle="Individualisiert, wo es Freiheit braucht. Standardisiert, wo es Effizienz schafft."
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-12"
            />

            <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-12">
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
                    Video-Demonstration des ®Hoam modularen Bausystems zeigt
                    architektonische Komponenten und Montageprozess
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 - Manchmal kommt es auf die Größe an */}
          <section id="dimensionen-module" className="py-8 md:py-16">
            <SectionHeader
              title="Manchmal kommt es auf die Größe an."
              subtitle="6 Meter Hoch, 8 Meter Breit, individuell lang."
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-12 2xl:mb-24"
            />
            <ThreeByOneGrid
              backgroundColor="black"
              text="<p class='p-secondary text-white'><span class='text-white font-medium'>Standardisierung</span> <span class='text-nest-gray'>für</span> <span class='text-white font-medium'>Effizienz, Freiheit</span> <span class='text-nest-gray'>für</span> <span class='text-white font-medium'>Gestaltung.</span> <span class='text-nest-gray'>Alles, was sinnvoll standardisiert werden kann, wird vereinheitlicht.</span> <span class='text-white font-medium'>Präzisionsgefertigte Module,</span> <span class='text-nest-gray'>effiziente Prozesse und bewährte Konstruktionen sichern</span> <span class='text-white font-medium'>höchste Qualität</span> <span class='text-nest-gray'>zu einem</span> <span class='text-white font-medium'>leistbaren Preis.</span></p>"
              textPosition="left"
              maxWidth={false}
              image1={IMAGES.function.nestHausModulKonzept}
              image2={IMAGES.function.nestHausModulLiniengrafik}
              image1Description="®Hoam Modul Stirnseite Ansicht Schema Konzept"
              image2Description="®Hoam Modul Holz Schema Konzept"
              textWrapperClassName="mt-8 md:mt-0"
            />

            {/* ThreeByOneGrid - Right Position (No Title/Subtitle) */}
            <div className="pt-16 md:pt-16">
              <ThreeByOneGrid
                backgroundColor="black"
                text="<p class='p-secondary text-white'><span class='text-nest-gray'>Gleichzeitig bleibt volle <span class='text-white font-medium'>Gestaltungsfreiheit </span><span class='text-nest-gray'>dort, wo sie wirklich zählt.<span class='text-nest-gray'> Individualisierung für persönliche Gestaltung. Jedes Zuhause ist einzigartig und genau da, wo es wichtig ist, bieten wir</span> <span class='text-white font-medium'>maximale Freiheit:</span> <span class='text-nest-gray'>Grundrissgestaltung, Technische Ausstattung, Materialien und Oberflächen, Flexible Raumaufteilung.</span></p>"
                textPosition="right"
                maxWidth={false}
                image1={IMAGES.function.nestHausModulSeiteKonzept}
                image2={IMAGES.function.nestHausModulSeiteLiniengrafik}
                image1Description="Seitliche Ansicht zeigt die durchdachte Konstruktion"
                image2Description="Liniengrafik verdeutlicht die optimierte Statik"
              />
            </div>
          </section>

          {/* Section 3 - Gut für Dich, besser für die Zukunft */}
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

            {/* Button Pair - CTA Section */}
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
              <div className="flex flex-row gap-4 justify-center items-center">
                <Link href="/warum-wir">
                  <Button variant="primary" size="lg">
                    Unsere Philosophie
                  </Button>
                </Link>
                <Link href="/konfigurator">
                  <Button variant="landing-secondary-blue" size="lg">
                    Konfigurieren
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Section 4 - Fenster & Türen */}
          <section id="fenster-tueren" className="pt-8 md:pt-16 md:pb-16">
            <SectionHeader
              title="Fenster & Türen"
              subtitle="Deine Fenster- und Türöffnungen werden dort platziert, wo du es möchtest."
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-12"
            />
            <ThreeByOneAdaptiveHeight
              backgroundColor="black"
              imageDescription="®Hoam Expertise und professionelle Beratung"
              maxWidth={false}
            />

            {/* ThreeByOneGrid - Left Position (Bottom Section) */}
            <ThreeByOneGrid
              backgroundColor="black"
              text="<p class='p-secondary text-white'><span class='text-nest-gray'>Unser</span> <span class='text-white font-medium'>Hoam System</span> <span class='text-nest-gray'>bietet dir an den</span> <span class='text-white font-medium'>Seitenwänden</span> <span class='text-nest-gray'>und an der</span> <span class='text-white font-medium'>Giebelseite</span> <span class='text-nest-gray'>volle Gestaltungsfreiheit.</span> <span class='text-nest-gray'> Hier kannst du deine</span> <span class='text-white font-medium'>Fenster und Türen</span> <span class='text-nest-gray'>so platzieren, wie es zu dir und deinem Zuhause passt. Gemeinsam mit uns definierst du</span> <span class='text-white font-medium'>Größe und Position</span> <span class='text-nest-gray'>individuell nach</span> <span class='text-white font-medium'>deinen Wünschen</span> <span class='text-nest-gray'>und Anforderungen.</span></p>"
              textPosition="left"
              maxWidth={false}
              image1={IMAGES.function.nestHausFensterTuerenStirnseite}
              image2={IMAGES.function.nestHausFensterTuerenAbschlussmodul}
              image1Description="Fenster und Türen Einbau Positionierung"
              image2Description="Mittelmodul Liniengrafik Fenster und Türen"
            />

            {/* ThreeByOneGrid - Right Position (Bottom Section) */}
            <div className="md:pt-16">
              <ThreeByOneGrid
                backgroundColor="black"
                text="<p class='p-secondary text-white'><span class='text-nest-gray'>Mit unseren</span> <span class='text-white font-medium'>Beleuchtungspaketen</span> <span class='text-nest-gray'>bekommst du ein</span> <span class='text-white font-medium'>Preisgefühl</span> <span class='text-nest-gray'>für deine</span> <span class='text-white font-medium'>Fenster und Türen</span><span class='text-nest-gray'>. Danach legen wir im</span> <span class='text-white font-medium'>Konzeptcheck</span> <span class='text-nest-gray'>die exakte</span> <span class='text-white font-medium'>Anzahl und Größe</span> <span class='text-nest-gray'>deiner Fenster fest.</span></p>"
                textPosition="right"
                maxWidth={false}
                image1={IMAGES.function.nestHausModulSeiteKonzept}
                image2={IMAGES.function.nestHausFensterTuerenMittelmodul}
                image1Description="Modul Seitenansicht Holz Schema Konzept"
                image2Description="Planung Innenausbau Fenster Türen Mittelmodul Liniengrafik"
                showButtons={true}
                primaryButtonText="Konzept-Check"
                secondaryButtonText="Konfigurieren"
                primaryButtonHref="/konzept-check"
                secondaryButtonHref="/konfigurator"
              />
            </div>
          </section>

          {/* Section 5 - Dein Raum zum Träumen (includes merged Hier beginnt Freiheit content) */}
          <section
            id="individualisierung"
            className="w-full pt-8 md:pt-16 bg-black"
          >
            <SectionHeader
              title="Hier beginnt Freiheit"
              subtitle="Weil nur du weißt, wie du richtig wohnst."
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-8 md:mb-16"
            />

            <div className="w-full max-w-[1536px] mx-auto px-4 md:px-12">
              {/* Image container with same sizing as unser-part page */}
              <div className="flex justify-center">
                <div className="w-full max-w-6xl overflow-hidden">
                  <HybridBlobImage
                    path={IMAGES.function.nestHausGrundrissSchema}
                    alt="®Hoam Grundriss Schema - Individualisierung und Planung"
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

            {/* Merged Section - Hier beginnt Freiheit */}
            <div className="py-8 md:py-16">
              <FullWidthTextGrid
                backgroundColor="black"
                textBox1="<p class='p-secondary text-white'><span class='text-nest-gray'>Mit ®Hoam hast du die</span> <span class='text-white font-medium'>Freiheit, deinen Grundriss so zu gestalten,</span> <span class='text-nest-gray'>wie es zu deinem Leben passt. Kein Schema, kein Standard. Nur Räume, die sich anfühlen wie du selbst.</span> <span class='text-white font-medium'>Denn richtig wohnen bedeutet mehr als Fläche und Funktion.</span> <span class='text-nest-gray'>Es ist Persönlichkeit, Ausdruck und Alltag der von dir in Einklang gebracht wird.</span></p>"
                textBox2="<p class='p-secondary text-white'><span class='text-nest-gray'>Wenn du auf dem Weg dorthin</span> Unterstützung <span class='text-nest-gray'>möchtest, begleiten wir dich Schritt für Schritt. Unsere</span> Planungspakete <span class='text-nest-gray'>führen dich</span> von der Einreichplanung bis zur Gestaltung des Innenraums. <span class='text-nest-gray'>Individuell, durchdacht und auf deine Vorstellungen abgestimmt. So entsteht aus einer Idee</span> <span class='text-white font-medium'>ein Zuhause, das wirklich zu dir passt.</span></p>"
                maxWidth={false}
              />

              {/* Glass Card with Hand Drawing Image */}
              {!isMobile && (
                <div className="w-full max-w-[1536px] mx-auto px-4 md:px-12">
                  <div
                    className="relative w-full overflow-hidden rounded-3xl"
                    style={{
                      backgroundColor: "#121212",
                      boxShadow:
                        "inset 0 0 20px rgba(255, 255, 255, 0.6), 0 8px 32px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <HybridBlobImage
                      path={IMAGES.function.nestHausHandDrawing}
                      alt="Hand Drawing - Planning Sketch"
                      width={1536}
                      height={1024}
                      className="w-full h-auto object-cover"
                      strategy="client"
                      isInteractive={true}
                      enableCache={true}
                      sizes="(max-width: 1536px) 100vw, 1536px"
                    />
                  </div>
                </div>
              )}

              {/* Single Button - Konzept-Check bestellen */}
              <div className="flex gap-4 justify-center w-full pt-12">
                <Link href="/warenkorb?mode=konzept-check">
                  <Button variant="primary" size="xs">
                    Konzept-Check bestellen
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Section 6 - Kosten-Sparen-Wert erhöhen */}
          <section id="haustechnik" className="w-full py-8 md:py-16 bg-black">
            <SectionHeader
              title="Kosten-Sparen-Wert erhöhen"
              subtitle="Einfache Do-It-Yourself-Pakete für alle Bereiche"
              titleClassName="text-white"
              subtitleClassName="text-white"
            />
            <ImageWithFourTextGrid
              backgroundColor="black"
              image={IMAGES.function.nestHausModulElektrikSanitaer}
              mobileImage={IMAGES.function.mobile.nestHausModulElektrikSanitaer}
              imageDescription="®Hoam Modulansicht für deinen Part"
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

          {/* Section 7 - Wohnfläche erweitern (includes merged Flexibilität content) */}
          <section
            id="modulerweiterung"
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
              text="<p class='p-secondary text-white'>Mehr Raum, wenn du ihn brauchst. <span class='text-nest-gray'>Dein ®Hoam wächst mit. Dank durchdachter Konstruktion kannst du</span> jederzeit eine Zwischendecke einziehen <span class='text-nest-gray'>und dein Zuhause ganz einfach in ein zweigeschoßiges Raumwunder verwandeln.</span></p>"
              image1={IMAGES.function.nestHausPlattenFundament}
              image2={IMAGES.function.nestHausFundamentStreifenfundament}
              image1Description="®Hoam Planung Innenausbau mit Zwischendecke - Leichtbau Modul"
              image2Description="®Hoam Fundament Streifenfundament für Zwischendecke - Leichtbau Modul"
              textPosition="left"
              backgroundColor="black"
              maxWidth={false}
            />

            {/* Merged Section - Flexibilität */}
            <div className="w-full pt-16 md:pt-32">
              <SectionHeader
                title="Haus erweitern?"
                subtitle="Dein ®Hoam bleibt flexibel und lässt sich an deine Lebensumstände anpassen"
                titleClassName="text-white"
                subtitleClassName="text-nest-gray"
                wrapperMargin="mb-12 2xl:mb-24"
              />
              <ThreeByOneGrid
                text="<p class='p-secondary text-white'><span class='text-nest-gray'>Durch intelligente</span> Standardisierung <span class='text-nest-gray'> und innovative </span> Modulschnittstellen <span class='text-nest-gray'>garantieren wir</span> höchste Flexibilität, Langlebigkeit und Nachhaltigkeit zum besten Preis. <span class='text-nest-gray'>Mit </span> ®Hoam <span class='text-nest-gray'> wohnst du </span> immer so</span> <span class='text-nest-gray'> wie</span> du es willst.</p>"
                image1={IMAGES.function.nestHausFundamentPunktfundament}
                image2={IMAGES.function.nestHausFlexibilitaetErweiterung}
                image1Description="®Hoam Erweiterung Modulbau vergrößern Leichtbau Modul flexibel"
                image2Description="®Hoam Flexibilität Erweiterung Modulbau"
                textPosition="right"
                backgroundColor="black"
                maxWidth={false}
                textWrapperClassName="mt-12"
              />
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="w-full pb-8 md:pb-16 bg-white">
            <FAQSection />
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
    </div>
  );
}

