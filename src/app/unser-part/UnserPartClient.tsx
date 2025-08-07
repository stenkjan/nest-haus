"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionRouter } from "@/components/SectionRouter";
import { Button, CallToAction } from "@/components/ui";
import {
  ThreeByOneAdaptiveHeight,
  FullWidthImageGrid,
  FullWidthVideoGrid,
  ThreeByOneGrid,
} from "@/components/grids";
import { HybridBlobImage, ClientBlobVideo } from "@/components/images";
import {
  SectionHeader,
  ButtonGroup,
  MaterialShowcase,
} from "@/components/sections";
import { IMAGES } from "@/constants/images";
import { useContentAnalytics } from "@/hooks";
import type { SectionDefinition } from "@/types";
import Footer from "@/components/Footer";

// Define sections with proper structure for unser-part
const sections: SectionDefinition[] = [
  {
    id: "hero",
    title: "Hochpräzise Produktionsmethoden",
    slug: "produktionsmethoden",
  },
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
    id: "raum-zum-traeumen",
    title: "Raum zum Träumen",
    slug: "raum-zum-traeumen",
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
    id: "call-to-action",
    title: "Kein Plan? Kein Problem!",
    slug: "kein-plan",
  },
  {
    id: "grundstueck-check",
    title: "Sicherheit",
    slug: "sicherheit",
  },
  {
    id: "video-gallery",
    title: "Die Vielfalt unserer Module",
    slug: "modul-vielfalt",
  },
];

// Material data moved to shared constants for reusability

export default function UnserPartClient() {
  const [currentSectionId, setCurrentSectionId] = useState<string>("hero");

  // Analytics tracking for content engagement
  const { trackButtonClick } = useContentAnalytics({
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
        {/* Hero Section - Hochpräzise Produktionsmethoden */}
        <section id="hero" className="relative bg-white py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <SectionHeader
                title="Hochpräzise Produktionsmethoden"
                subtitle="Schaffen beste Qualität zu fairen Preisen."
                titleSize="large"
                titleClassName="text-gray-900"
                subtitleClassName="text-black"
              />

              <ButtonGroup
                buttons={[
                  {
                    text: "Unser Part",
                    variant: "primary",
                    size: "xs",
                    onClick: () => trackButtonClick("Unser Part", "hero"),
                  },
                  {
                    text: "Dein Part",
                    variant: "secondary",
                    size: "xs",
                    link: "/dein-part",
                    onClick: () => trackButtonClick("Dein Part", "hero"),
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Video Section - Dein Nest System */}
        <section id="dein-nest-system" className="bg-black pt-20 pb-8">
          <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
            <div className="text-center mb-24">
              <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-white mb-3">
                Dein Nest System
              </h2>
              <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-white">
                Individualisiert, wo es Freiheit braucht. Standardisiert, wo es
                Effizienz schafft.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-6xl rounded-lg overflow-hidden bg-gray-900">
                <ClientBlobVideo
                  path={IMAGES.function.nestHausModulSchemaIntro}
                  className="w-full h-auto object-contain"
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  playsInline={true}
                  controls={false}
                  enableCache={true}
                />
                {/* Accessibility description for screen readers */}
                <span className="sr-only">
                  Video demonstration of NEST-Haus modular construction system
                  showing architectural components and assembly process in a
                  continuous forward and reverse loop animation
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Combined ThreeByOneGrid Section - Größe */}
        <section id="groesse" className="pt-20 pb-8">
          <ThreeByOneGrid
            title="Manchmal kommt es auf die Größe an."
            subtitle="6 Meter Hoch, 8 Meter Breit, unendlich lang."
            backgroundColor="black"
            text="<span class='text-gray-400'>Standardisierung für Effizienz und Kostenoptimierung. Höchste Qualität zu einem leistbaren Preis durch</span> intelligente Optimierung <span class='text-gray-400'>– und volle gestalterische Freiheit dort, wo sie wirklich zählt. Alles, was sinnvoll standardisierbar ist, wird perfektioniert:</span> Präzisionsgefertigte Module, effiziente Fertigung <span class='text-gray-400'>und</span> bewährte Konstruktion <span class='text-gray-400'>sichern</span> höchste Qualität."
            textPosition="left"
            maxWidth={false}
            image1={IMAGES.function.nestHausModulKonzept}
            image2={IMAGES.function.nestHausModulLiniengrafik}
            image1Description="NEST-Haus Modul Stirnseite Ansicht Schema Konzept"
            image2Description="NEST-Haus Modul Holz Schema Konzept"
          />

          {/* ThreeByOneGrid - Right Position (No Title/Subtitle) */}
          <div className="pt-4 pb-8">
            <ThreeByOneGrid
              title=""
              subtitle=""
              backgroundColor="black"
              text="<span class='text-gray-400'>Das bedeutet:</span> schnelle Bauzeiten, zuverlässige Strukturen <span class='text-gray-400'>und ein unschlagbares Preis-Leistungs-Verhältnis. Individualisierung für persönliche Gestaltung. Jedes Zuhause ist einzigartig und genau da, wo es wichtig ist, bieten wir</span> maximale Freiheit: <span class='text-gray-400'>Grundriss-gestaltung,Technische Ausstattung, Materialien und Oberflächen, Flexible Wohnflächen.</span>"
              textPosition="right"
              maxWidth={false}
              image1={IMAGES.function.nestHausModulSeiteKonzept}
              image2={IMAGES.function.nestHausModulSeiteLiniengrafik}
              image1Description="Seitliche Ansicht zeigt die durchdachte Konstruktion"
              image2Description="Liniengrafik verdeutlicht die optimierte Statik"
            />
          </div>
        </section>

        {/* FullWidthImageGrid - Raum zum Träumen */}
        <section id="raum-zum-traeumen" className="pt-20 pb-8">
          <FullWidthImageGrid
            title="Raum zum Träumen"
            subtitle="Eine Bauweise die, das Beste aus allen Welten, kombiniert."
            backgroundColor="black"
            textBox1="<span class='text-gray-400'>Warum solltest du dich zwischen Flexibilität, Qualität und Nachhaltigkeit entscheiden, wenn du</span> mit dem Nest System alles haben <span class='text-gray-400'>kannst? Unsere Architekten und Ingenieure haben ein Haus entwickelt, das</span> maximale Freiheit ohne Kompromisse <span class='text-gray-400'>bietet. Durch</span> intelligente Standardisierung <span class='text-gray-400'>garantieren wir</span> höchste"
            textBox2="Qualität, Langlebigkeit <span class='text-gray-400'>und</span> Nachhaltigkeit zum bestmöglichen Preis. <span class='text-gray-400'>Präzisionsgefertigte Module sorgen für Stabilität, Energieeffizienz und ein unvergleichliches Wohngefühl.</span> Dein Zuhause, dein Stil, deine Freiheit. <span class='text-gray-400'>Mit Nest. musst du dich nicht entscheiden, denn du bekommst alles. Heute bauen, morgen wohnen - Nest.</span>"
            maxWidth={false}
          />
        </section>

        {/* MaterialShowcase Section - Optimized */}
        <MaterialShowcase
          backgroundColor="black"
          maxWidth={false}
          showInstructions={true}
        />

        {/* ThreeByOneAdaptiveHeight Grid - Fenster & Türen */}
        <section id="fenster-tueren" className="pt-20 pb-8">
          <ThreeByOneAdaptiveHeight
            title="Fenster & Türen"
            subtitle="Deine Fenster- und Türöffnungen werden dort platziert, wo du es möchtest."
            backgroundColor="black"
            imageDescription="NEST-Haus Expertise und professionelle Beratung"
            maxWidth={false}
          />

          {/* ThreeByOneGrid - Left Position (Bottom Section) */}
          <div className="pt-4 pb-8">
            <ThreeByOneGrid
              title=""
              subtitle=""
              backgroundColor="black"
              text="<span class='text-gray-400'>Sobald die Module geliefert sind, beginnt</span> dein Teil der Gestaltung. <span class='text-gray-400'>Fenster und Türen setzt du ganz einfach in die dafür vorgesehenen Öffnungen ein. Jeder Handgriff folgt</span> deinem Plan, <span class='text-gray-400'>jeder Schritt bringt dich</span> deinem Zuhause näher. <span class='text-gray-400'>Du bestimmst, wo</span> Licht einfällt, <span class='text-gray-400'>wo</span> Wege beginnen <span class='text-gray-400'>und wie dein</span> Raum sich öffnet. <span class='text-gray-400'>So entsteht nicht nur ein Haus, sondern</span> ein Ort, der ganz dir gehört."
              textPosition="left"
              maxWidth={false}
              image1={IMAGES.function.nestHausFensterTuerenStirnseite}
              image2={IMAGES.function.nestHausFensterTuerenAbschlussmodul}
              image1Description="Fenster und Türen Einbau Positionierung"
              image2Description="Mittelmodul Liniengrafik Fenster und Türen"
            />
          </div>

          {/* ThreeByOneGrid - Right Position (Bottom Section) */}
          <div className="pt-4 pb-20">
            <ThreeByOneGrid
              title=""
              subtitle=""
              backgroundColor="black"
              text="<span class='text-gray-400'>Solltest du Unterstützung bei der Planung benötigen, kannst du</span> eines unserer Planungspakete wählen. <span class='text-gray-400'>So erhältst du genau die Hilfe, die du brauchst, um</span> deine Vision Wirklichkeit werden zu lassen."
              textPosition="right"
              maxWidth={false}
              image1={IMAGES.function.nestHausModulSeiteKonzept}
              image2={IMAGES.function.nestHausFensterTuerenMittelmodul}
              image1Description="Modul Seitenansicht Holz Schema Konzept"
              image2Description="Planung Innenausbau Fenster Türen Mittelmodul Liniengrafik"
              showButtons={true}
              primaryButtonText="Die Pakete"
              secondaryButtonText="Mehr erfahren"
            />
          </div>
        </section>

        {/* Video Section - Wir liefern Möglichkeiten */}
        <section id="moeglichkeiten" className="bg-black pt-20 pb-8">
          <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
            <div className="text-center mb-24">
              <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-white mb-3">
                Wir liefern Möglichkeiten
              </h2>
              <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-white">
                Wo Effizienz auf Architektur trifft - Nest
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-6xl rounded-lg overflow-hidden bg-gray-900">
                <ClientBlobVideo
                  path={IMAGES.function.nestHausModulSchemaIntro}
                  className="w-full h-auto object-contain"
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  playsInline={true}
                  controls={false}
                  enableCache={true}
                />
                {/* Accessibility description for screen readers */}
                <span className="sr-only">
                  Video demonstration of NEST-Haus modular construction system
                  showing architectural components and assembly process in a
                  continuous forward and reverse loop animation
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Single Image Section - Du individualisierst dein NEST Haus */}
        <section id="individualisierung" className="bg-black pt-20 pb-20">
          <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-white mb-3">
                Du individualisierst dein NEST Haus.
              </h2>
              <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-white">
                Weil nur du weißt, wie du richtig wohnst.
              </p>
            </div>
          </div>

          {/* Image container with same sizing as video above */}
          <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
            <div className="flex justify-center">
              <div className="w-full max-w-6xl overflow-hidden">
                <HybridBlobImage
                  path={IMAGES.function.nestHausGrundrissSchema}
                  alt="NEST-Haus Grundriss Schema - Individualisierung und Planung"
                  width={1920}
                  height={1011}
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 768px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 64px), 1152px"
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

          <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
            {/* Button Combination - Navigation Links */}
            <div className="flex gap-4 justify-center w-full mt-8">
              <Link href="/dein-part">
                <Button variant="primary" size="xs">
                  Dein Part
                </Button>
              </Link>
              <Link href="/konfigurator">
                <Button variant="secondary" size="xs">
                  Jetzt bauen
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="call-to-action">
          <CallToAction
            title="Kein Plan? Kein Problem!"
            subtitle="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch"
            buttonText="Jetzt vereinbaren"
            buttonLink="/kontakt"
            backgroundColor="gray"
            maxWidth={false}
          />
        </section>

        {/* Grundstück Check Section */}
        <section id="grundstueck-check" className="w-full py-16 bg-gray-50">
          <div className="w-full px-[8%]">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-1 lg:mb-1.5 text-center text-black">
              Dein Grundstück - Unser Check
            </h2>
            <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl mb-8 lg:mb-12 max-w-3xl mx-auto text-center text-black">
              Wir überprüfen für dich, wie dein Nest Haus auf ein Grundstück
              deiner Wahl passt
            </h3>
            <div
              className="relative h-[600px] w-full bg-white rounded-[60px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group"
              style={{ border: "15px solid #F4F4F4" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                {/* Left Panel - Text content */}
                <div className="flex flex-col justify-center p-8 lg:p-12 space-y-6">
                  <h2 className="font-medium text-3xl lg:text-4xl xl:text-5xl tracking-[-0.02em] text-gray-900">
                    Sicherheit
                  </h2>
                  <p className="text-base lg:text-lg leading-relaxed text-gray-700">
                    Häuser bauen bedeutet, sich an die Spielregeln zu halten und
                    diese können je nach Region unterschiedlich sein. Wir kennen
                    die gesetzlichen Vorgaben genau und unterstützen dich dabei,
                    die Anforderungen deines Baugrunds zu verstehen. Mit unserem
                    Grundstücks-Check prüfen wir, welche Gegebenheiten du bei
                    deinem Wunschgrundstück beachten musst.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <button
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 text-sm"
                      onClick={() => trackButtonClick("dein-part", "Dein Part")}
                    >
                      Dein Part
                    </button>
                    <button
                      className="px-6 py-2.5 border border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors duration-300 text-sm"
                      onClick={() =>
                        trackButtonClick("jetzt-bauen", "Jetzt bauen")
                      }
                    >
                      Jetzt bauen
                    </button>
                  </div>
                </div>

                {/* Right Panel - Image */}
                <div className="relative">
                  <HybridBlobImage
                    path={IMAGES.function.nestHausGrundstueckCheck}
                    strategy="auto"
                    isAboveFold={false}
                    alt="NEST Haus Grundstück Check - Sicherheit beim Hausbau"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={85}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Gallery Section */}
        <section id="video-gallery" className="w-full py-16 bg-white">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <FullWidthVideoGrid
              title="Die Vielfalt unserer Module"
              subtitle="Entdecke die verschiedenen Konfigurationsmöglichkeiten und Modulkombinationen"
              backgroundColor="white"
              textBox1="Diese Animation zeigt die vielfältigen Möglichkeiten unseres modularen Bausystems. Von kompakten Lösungen bis hin zu großzügigen Wohnkonzepten."
              textBox2="Jede Modulkombination ist individuell planbar und lässt sich perfekt an deine Bedürfnisse und dein Grundstück anpassen."
              maxWidth={false}
              video={IMAGES.variantvideo.nine}
              autoPlay={true}
              muted={true}
              controls={false}
            />
          </div>
        </section>
      </SectionRouter>
      <Footer />
    </div>
  );
}
