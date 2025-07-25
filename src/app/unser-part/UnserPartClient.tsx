"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
import {
  ThreeByOneAdaptiveHeight,
  FullWidthImageGrid,
  ThreeByOneGrid,
} from "@/components/grids";
import { ClientBlobVideo, ClientBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";
import { ContentCardsGlass } from "@/components/cards";

// Define sections with proper structure
const sections = [
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
  { id: "freiheit", title: "Freiheit in der Gestaltung", slug: "freiheit" },
  { id: "ideen", title: "Innovative Ideen", slug: "ideen" },
  {
    id: "wohnflaeche-erweitern",
    title: "Wohnfläche erweitern",
    slug: "wohnflaeche-erweitern",
  },
  { id: "decke-erweitern", title: "Decke erweitern", slug: "decke-erweitern" },
  { id: "step-by-step", title: "Schritt für Schritt", slug: "step-by-step" },
  {
    id: "unterstuetzung",
    title: "Unterstützung gefällig",
    slug: "unterstuetzung",
  },
];

export default function UnserPartClient() {
  const [, setCurrentSectionId] =
    useState<string>("moeglichkeiten");

  return (
    <div className="min-h-screen pt-16">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Section 1 - Wir liefern Möglichkeiten */}
        <section id="moeglichkeiten" className="w-full py-16 bg-black">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-white">
                Wir liefern Möglichkeiten
              </h2>
              <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-white">
                Wo Effizienz auf Architektur trifft - Nest
              </h3>
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
                <span className="sr-only">
                  Video demonstration of NEST-Haus modular construction system
                  showing architectural components and assembly process in a
                  continuous forward and reverse loop animation
                </span>
              </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-lg md:text-xl text-white max-w-4xl mx-auto">
                Hochpräzise Produktionsmethoden schaffen beste Qualität zu
                fairen Preisen. Unsere systematische Herangehensweise und
                bewährte Prozesse stellen sicher, dass jedes NEST-Haus den
                höchsten Qualitätsstandards entspricht.
              </p>
              <div className="flex gap-4 justify-center mt-8">
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

        {/* Section 2 - Du individualisierst dein NEST Haus */}
        <section id="individualisierung" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-gray-900">
                Du individualisierst dein NEST Haus
              </h2>
              <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-gray-700">
                Weil nur du weißt, wie du richtig wohnst
              </h3>
            </div>

            <div className="flex justify-center">
              <div className="w-full relative" style={{ aspectRatio: "1.9/1" }}>
                <ClientBlobImage
                  path={IMAGES.function.nestHausGrundrissSchema}
                  alt="NEST-Haus Grundriss Schema - Individualisierung und Planung"
                  enableCache={true}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 1536px"
                  quality={85}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 - Freiheit in der Gestaltung */}
        <section id="freiheit" className="w-full py-16 bg-black">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-white">
                Freiheit in der Gestaltung
              </h2>
              <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-white">
                Individualisiert, wo es Freiheit braucht. Standardisiert, wo es
                Effizienz schafft
              </h3>
            </div>

            <FullWidthImageGrid
              title=""
              subtitle=""
              backgroundColor="black"
              textBox1="Durch unsere systematische Herangehensweise und bewährte Prozesse stellen wir sicher, dass jedes NEST-Haus den höchsten Qualitätsstandards entspricht. Von der Planung über die Fertigung bis zur Montage - wir überwachen jeden Schritt."
              textBox2="Unser Part ist es, komplexe Bauprojekte zu vereinfachen und für dich transparent zu gestalten. Mit modernen Planungstools und durchdachten Abläufen machen wir den Hausbau zu einem entspannten Erlebnis."
              maxWidth={false}
            />
          </div>
        </section>

        {/* Section 4 - Innovative Ideen */}
        <section id="ideen" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-gray-900">
                Innovative Ideen
              </h2>
              <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-gray-700">
                Entdecke unsere sorgfältig ausgewählten Materialien
              </h3>
            </div>

            <ContentCardsGlass
              variant="responsive"
              title=""
              subtitle=""
              maxWidth={false}
              showInstructions={true}
            />
          </div>
        </section>

        {/* Section 5 - Wohnfläche erweitern */}
        <section id="wohnflaeche-erweitern" className="w-full py-16 bg-black">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-white">
                Wohnfläche erweitern
              </h2>
              <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-white">
                6 Meter Hoch, 8 Meter Breit, unendlich lang
              </h3>
            </div>

            <ThreeByOneGrid
              title=""
              subtitle=""
              backgroundColor="black"
              text="Unsere Qualitätssicherung beginnt bereits in der Planungsphase und setzt sich durch den gesamten Fertigungsprozess fort. Jedes Modul wird nach strengsten Standards gefertigt und vor der Auslieferung umfassend geprüft."
              mobileText="Qualitätssicherung und Präzision in jedem Arbeitsschritt - das ist unser Versprechen für dein NEST-Haus."
              textPosition="left"
              maxWidth={false}
            />
          </div>
        </section>

        {/* Section 6 - Decke erweitern */}
        <section id="decke-erweitern" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-gray-900">
                Decke erweitern
              </h2>
              <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-gray-700">
                Raum zum Träumen - Eine Bauweise die das Beste aus allen Welten
                kombiniert
              </h3>
            </div>

            <ThreeByOneGrid
              title=""
              subtitle=""
              backgroundColor="white"
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

        {/* Section 7 - Schritt für Schritt */}
        <section id="step-by-step" className="w-full py-16 bg-black">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-white">
                Schritt für Schritt
              </h2>
              <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-white">
                Deine Fenster- und Türöffnungen werden dort platziert, wo du es
                möchtest
              </h3>
            </div>

            <ThreeByOneAdaptiveHeight
              title=""
              subtitle=""
              backgroundColor="black"
              text="Unser erfahrenes Team begleitet dich von der ersten Idee bis zum Einzug in dein neues Zuhause. Mit jahrelanger Expertise im modularen Hausbau sorgen wir dafür, dass dein Projekt reibungslos und termingerecht realisiert wird."
              imageDescription="NEST-Haus Expertise und professionelle Beratung"
              maxWidth={false}
            />

            <div className="mt-16">
              <ThreeByOneGrid
                title=""
                subtitle=""
                backgroundColor="black"
                text="Sobald die Module geliefert sind, beginnt dein Teil der Gestaltung. Fenster und Türen setzt du ganz einfach in die dafür vorgesehenen Öffnungen ein. Jeder Handgriff folgt deinem Plan, jeder Schritt bringt dich deinem Zuhause näher. Du bestimmst, wo Licht einfällt, wo Wege beginnen und wie dein Raum sich öffnet."
                textPosition="left"
                maxWidth={false}
                image1="34-NEST-Haus-Planung-Innenausbau-Fenster-Tueren-Stirnseite"
                image2="32-NEST-Haus-Planung-Innenausbau-Fenster-Tueren-Einbau-Positionierung-Abschlussmodul-Liniengrafik"
                image1Description="Fenster und Türen Einbau Positionierung"
                image2Description="Mittelmodul Liniengrafik Fenster und Türen"
              />
            </div>
          </div>
        </section>

        {/* Section 8 - Unterstützung gefällig */}
        <section id="unterstuetzung" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-gray-900">
                Unterstützung gefällig?
              </h2>
              <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-gray-700">
                Wähle eines unserer Planungspakete für genau die Hilfe, die du
                brauchst
              </h3>
            </div>

            <ThreeByOneGrid
              title=""
              subtitle=""
              backgroundColor="white"
              text="Solltest du Unterstützung bei der Planung benötigen, kannst du eines unserer Planungspakete wählen. So erhältst du genau die Hilfe, die du brauchst, um deine Vision Wirklichkeit werden zu lassen. Unser Expertenteam steht dir mit Rat und Tat zur Seite."
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
      </SectionRouter>
    </div>
  );
}
