"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
import {
  FullWidthVideoGrid,
  FullWidthTextGrid,
  ImageWithFourTextGrid,
  ThreeByOneAdaptiveHeight,
  FullWidthImageGrid,
  ThreeByOneGrid,
} from "@/components/grids";
import { ClientBlobImage, ClientBlobVideo } from "@/components/images";
import { ContentCardsGlass } from "@/components/cards";
import { IMAGES } from "@/constants/images";

// Define sections with proper structure for unser-part
const sections = [
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
];

export default function UnserPartClient() {
  const [currentSectionId, setCurrentSectionId] = useState<string>("hero");

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
              <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-1 lg:mb-1.5">
                Hochpräzise Produktionsmethoden
              </h1>
              <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-black mb-4 lg:mb-5">
                Schaffen beste Qualität zu fairen Preisen.
              </p>

              <div className="flex gap-4 justify-center">
                <Button variant="primary" size="xs">
                  Unser Part
                </Button>
                <Button variant="secondary" size="xs">
                  Dein Part
                </Button>
              </div>
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
              <div className="w-full max-w-6xl aspect-video rounded-lg overflow-hidden bg-gray-900">
                <ClientBlobVideo
                  path={IMAGES.function.nestHausModulSchema}
                  className="w-full h-full object-cover"
                  autoPlay={true}
                  loop={false}
                  muted={true}
                  playsInline={true}
                  controls={false}
                  enableCache={true}
                  reversePlayback={true}
                  fallbackSrc={IMAGES.function.nestHausModulSchema}
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
            text="Unsere Qualitätssicherung beginnt bereits in der Planungsphase und setzt sich durch den gesamten Fertigungsprozess fort. Jedes Modul wird nach strengsten Standards gefertigt und vor der Auslieferung umfassend geprüft."
            mobileText="Qualitätssicherung und Präzision in jedem Arbeitsschritt - das ist unser Versprechen für dein NEST-Haus."
            textPosition="left"
            maxWidth={false}
          />

          {/* ThreeByOneGrid - Right Position (No Title/Subtitle) */}
          <div className="pt-4 pb-8">
            <ThreeByOneGrid
              title=""
              subtitle=""
              backgroundColor="black"
              text="Seitliche Ansicht des Moduls zeigt die durchdachte Konstruktion und die optimierte Statik. Jedes Modul ist selbsttragend und kann flexibel mit anderen Modulen kombiniert werden. Die präzise Fertigung garantiert perfekte Passgenauigkeit und höchste Qualität."
              textPosition="right"
              maxWidth={false}
              image1="23-NEST-Haus-Modul-Ansicht-Seite-Holz-Schema-Konzept"
              image2="24-NEST-Haus-Modul-Ansicht-Seite-Holz-Schema-Konzept-Liniengrafik"
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
            textBox1="Durch unsere systematische Herangehensweise und bewährte Prozesse stellen wir sicher, dass jedes NEST-Haus den höchsten Qualitätsstandards entspricht. Von der Planung über die Fertigung bis zur Montage - wir überwachen jeden Schritt."
            textBox2="Unser Part ist es, komplexe Bauprojekte zu vereinfachen und für dich transparent zu gestalten. Mit modernen Planungstools und durchdachten Abläufen machen wir den Hausbau zu einem entspannten Erlebnis."
            maxWidth={false}
          />
        </section>

        {/* ContentCardsGlass Section - Materialien */}
        <section id="materialien" className="bg-black pt-20 pb-8">
          {/* Title and subtitle with max-width constraint */}
          <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
            <div className="text-center mb-24">
              <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-white mb-3">
                Gut für Dich, besser für die Zukunft
              </h2>
              <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-white">
                Entdecke unsere sorgfältig ausgewählten Materialien
              </p>
            </div>
          </div>

          {/* ContentCardsGlass with full width */}
          <ContentCardsGlass
            variant="responsive"
            title=""
            subtitle=""
            maxWidth={false}
            showInstructions={true}
          />
        </section>

        {/* ThreeByOneAdaptiveHeight Grid - Fenster & Türen */}
        <section id="fenster-tueren" className="pt-20 pb-8">
          <ThreeByOneAdaptiveHeight
            title="Fenster & Türen"
            subtitle="Deine Fenster- und Türöffnungen werden dort platziert, wo du es möchtest."
            backgroundColor="black"
            text="Unser erfahrenes Team begleitet dich von der ersten Idee bis zum Einzug in dein neues Zuhause. Mit jahrelanger Expertise im modularen Hausbau sorgen wir dafür, dass dein Projekt reibungslos und termingerecht realisiert wird."
            imageDescription="NEST-Haus Expertise und professionelle Beratung"
            maxWidth={false}
          />

          {/* ThreeByOneGrid - Left Position (Bottom Section) */}
          <div className="pt-4 pb-8">
            <ThreeByOneGrid
              title=""
              subtitle=""
              backgroundColor="black"
              text="Sobald die Module geliefert sind, beginnt dein Teil der Gestaltung. Fenster und Türen setzt du ganz einfach in die dafür vorgesehenen Öffnungen ein. Jeder Handgriff folgt deinem Plan, jeder Schritt bringt dich deinem Zuhause näher. Du bestimmst, wo Licht einfällt, wo Wege beginnen und wie dein Raum sich öffnet. So entsteht nicht nur ein Haus, sondern ein Ort, der ganz dir gehört."
              textPosition="left"
              maxWidth={false}
              image1="34-NEST-Haus-Planung-Innenausbau-Fenster-Tueren-Stirnseite"
              image2="32-NEST-Haus-Planung-Innenausbau-Fenster-Tueren-Einbau-Positionierung-Abschlussmodul-Liniengrafik"
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
              text="Solltest du Unterstützung bei der Planung benötigen, kannst du eines unserer Planungspakete wählen. So erhältst du genau die Hilfe, die du brauchst, um deine Vision Wirklichkeit werden zu lassen."
              textPosition="right"
              maxWidth={false}
              image1="23-NEST-Haus-Modul-Ansicht-Seite-Holz-Schema-Konzept"
              image2="31-NEST-Haus-Planung-Innenausbau-Fenster-Tueren-Einbau-Positionierung-Mittelmodul-Liniengrafik"
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
              <div className="w-full max-w-6xl aspect-video rounded-lg overflow-hidden bg-gray-900">
                <ClientBlobVideo
                  path={IMAGES.function.nestHausModulSchema}
                  className="w-full h-full object-cover"
                  autoPlay={true}
                  loop={false}
                  muted={true}
                  playsInline={true}
                  controls={false}
                  enableCache={true}
                  reversePlayback={true}
                  fallbackSrc={IMAGES.function.nestHausModulSchema}
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

            <div className="flex justify-center">
              <div className="w-full relative" style={{ aspectRatio: "1.9/1" }}>
                <ClientBlobImage
                  path={IMAGES.function.nestHausGrundrissSchema}
                  alt="NEST-Haus Grundriss Schema - Individualisierung und Planung"
                  enableCache={true}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 1550px"
                  quality={85}
                />
              </div>
            </div>
          </div>
        </section>
      </SectionRouter>
    </div>
  );
}
