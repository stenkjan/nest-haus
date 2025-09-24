"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
import PlanungspaketeCardsLightbox from "@/components/cards/PlanungspaketeCardsLightbox";
import { usePlanungspaketePopup } from "@/hooks/usePlanungspaketePopup";
import {
  FullWidthTextGrid,
  ImageWithFourTextGrid,
  ThreeByOneGrid,
} from "@/components/grids";
import {
  GetInContactBanner,
  LandingImagesCarousel,
} from "@/components/sections";
import { HybridBlobImage } from "@/components/images";
import { ImageGlassCard } from "@/components/cards";
import { PlanungspaketeCards } from "@/components/cards";

import { IMAGES } from "@/constants/images";
import Footer from "@/components/Footer";

// Define sections with proper structure for dein-part page
const sections = [
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
    id: "beratung",
    title: "Kein Plan? Kein Problem!",
    slug: "beratung",
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

export default function DeinPartClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("freiraum");
  const { isOpen, openPlanungspakete, closePlanungspakete } =
    usePlanungspaketePopup();

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
          {/* Section 3 - Du individualisierst dein NEST Haus */}
          <section
            id="individualisierung"
            className="w-full pt-12 pb-16 bg-black"
          >
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 2xl:mb-24">
                <h1 className="h1-secondary text-white mb-2 md:mb-3">
                  Dein Raum zum Träumen
                </h1>
                <h3 className="h3-secondary text-gray-300 md:mb-8">
                  Weil nur du weißt, wie du richtig wohnst.
                </h3>
              </div>

              {/* Image container with same sizing as unser-part page */}
              <div className="w-full max-w-screen-2xl mx-auto md:px-8">
                <div className="flex justify-center">
                  <div className="w-full max-w-6xl overflow-hidden">
                    <HybridBlobImage
                      path={IMAGES.function.nestHausGrundrissSchema}
                      alt="NEST-Haus Grundriss Schema - Individualisierung und Planung"
                      width={1536}
                      height={809}
                      className="w-4/5 h-auto object-contain mx-auto"
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
          <section id="freiheit" className="w-full bg-black py-16">
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
              <FullWidthTextGrid
                title="Hier beginnt Freiheit"
                subtitle="Individuell dort, wo es zählt."
                backgroundColor="black"
                textBox1="<p class='p-secondary text-white'><span class='text-nest-gray'>Mit Nest hast du die</span> <span class='text-white font-medium'>Freiheit, deinen Grundriss so zu gestalten,</span> <span class='text-nest-gray'>wie es zu deinem Leben passt. Kein Schema, kein Standard. Nur Räume, die sich anfühlen wie du selbst.</span> <span class='text-white font-medium'>Denn richtig wohnen bedeutet mehr als Fläche und Funktion.</span> <span class='text-nest-gray'>Es ist Persönlichkeit, Ausdruck und Alltag der von dir in Einklang gebracht wird.</span></p>"
                textBox2="<p class='p-secondary text-white'><span class='text-nest-gray'>Wenn du auf dem Weg dorthin</span> Unterstützung <span class='text-nest-gray'>möchtest, begleiten wir dich Schritt für Schritt. Unsere</span> Planungspakete <span class='text-nest-gray'>führen dich</span> von der Einreichplanung bis zur Gestaltung des Innenraums. <span class='text-nest-gray'>Individuell, durchdacht und auf deine Vorstellungen abgestimmt. So entsteht aus einer Idee</span> <span class='text-white font-medium'>ein Zuhause, das wirklich zu dir passt.</span></p>"
                maxWidth={false}
              />

              {/* ImageGlassCard */}
              <ImageGlassCard backgroundColor="black" maxWidth={false} />

              {/* Additional Button Combination */}
              <div className="flex gap-4 justify-center w-full">
                <Button
                  variant="primary"
                  size="xs"
                  onClick={openPlanungspakete}
                >
                  Die Pakete
                </Button>
                <Link href="/konfigurator">
                  <Button variant="landing-secondary-blue" size="xs">
                    Jetzt bauen
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Section 5 - Die Installationsebene */}
          <section id="installationsebene" className="w-full py-16 bg-black">
            <ImageWithFourTextGrid
              title="Konzipiert für deine Ideen"
              subtitle="Leitungen verlegen muss nicht immer kompliziert sein."
              backgroundColor="black"
              image={IMAGES.function.nestHausModulElektrikSanitaer}
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
          <section id="wohnflaeche-erweitern" className="w-full py-16 bg-black">
            <ThreeByOneGrid
              title="Wohnfläche erweitern?"
              subtitle="Kein Problem."
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
          <section id="flexibilitaet" className="w-full py-16 bg-black">
            <ThreeByOneGrid
              title="Ob Decke einziehen, oder Haus erweitern."
              subtitle="Dein Nest bleibt flexibel und lässt sich an deine Lebensumstände anpassen"
              text="<p class='p-secondary text-white'><span class='text-nest-gray'>Durch intelligente</span> Standardisierung <span class='text-nest-gray'>garantieren wir</span> höchste Qualität, Langlebigkeit und Nachhaltigkeit zum bestmöglichen Preis. <span class='text-nest-gray'>Präzisionsgefertigte Module sorgen für</span> <span class='text-nest-gray'>Stabilität, Energieeffizienz</span> <span class='text-nest-gray'>und ein unvergleichliches Wohngefühl.</span> Dein Zuhause. Dein Stil. Deine Freiheit. <span class='text-nest-gray'>Mit Nest. musst du dich nicht entscheiden,</span> <span class='text-nest-gray'>denn</span> du bekommst alles.</p>"
              image1={IMAGES.function.nestHausFundamentPunktfundament}
              image2={IMAGES.function.nestHausFlexibilitaetErweiterung}
              image1Description="NEST-Haus Erweiterung Modulbau vergrößern Leichtbau Modul flexibel"
              image2Description="NEST-Haus Flexibilität Erweiterung Modulbau"
              textPosition="right"
              backgroundColor="black"
              maxWidth={false}
            />
          </section>

          {/* Planungspakete Section - Unterstützung gefällig? */}
          <section id="planungspakete" className="w-full pt-16 pb-8 bg-white">
            <div className="w-full max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h1 className="h1-secondary text-gray-900 mb-2 md:mb-3">
                  Unterstützung gefällig?
                </h1>
                <h3 className="h3-secondary text-gray-600">
                  Entdecke unsere Planungs-Pakete, um das Beste für dich und
                  dein Nest rauszuholen.
                </h3>
              </div>

              <PlanungspaketeCards
                title=""
                subtitle=""
                maxWidth={false}
                showInstructions={false}
              />

              {/* Button Combo After Component */}
              <div className="flex gap-4 justify-center w-full mt-4 mb-8">
                <Button
                  variant="primary"
                  size="xs"
                  onClick={openPlanungspakete}
                >
                  Die Pakete
                </Button>
                <Link href="/unser-part">
                  <Button variant="landing-secondary-blue" size="xs">
                    Mehr Information
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Beratung Section - Kein Plan? Kein Problem! */}
          <GetInContactBanner id="beratung" />
        </SectionRouter>

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
