"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { Button, CallToAction } from "@/components/ui";
import {
  FullWidthVideoGrid,
  FullWidthTextGrid,
  ImageWithFourTextGrid,
  ThreeByOneGrid,
} from "@/components/grids";
import { HybridBlobImage } from "@/components/images";
import { ImageGlassCard } from "@/components/cards";
import { IMAGES } from "@/constants/images";

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
    id: "video-gallery",
    title: "Deine Gestaltungsmöglichkeiten",
    slug: "gestaltungsmoeglichkeiten",
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
    id: "call-to-action",
    title: "Bereit für dein NEST Haus?",
    slug: "bereit",
  },
];

export default function DeinPartClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("freiraum");

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Section 1 - Dein kreativer Freiraum */}
        <section id="freiraum" className="w-full py-16 bg-white">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-gray-900">
                Dein kreativer Freiraum
              </h2>
              <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 text-black max-w-3xl mx-auto">
                Gestalte dein NEST Haus nach deinen Vorstellungen.
              </h3>

              <div className="flex gap-4 justify-center">
                <Button variant="primary" size="xs">
                  Dein Part
                </Button>
                <Button variant="secondary" size="xs">
                  Unser Part
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 - Wir liefern Möglichkeiten */}
        <section id="moeglichkeiten" className="w-full py-16 bg-black">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <FullWidthVideoGrid
              title="Wir liefern Möglichkeiten"
              subtitle="Wo Effizienz auf Architektur trifft - Nest®"
              backgroundColor="black"
              textBox1="Nach der Lieferung deines NEST Hauses ist die Grundlage für dein neues Zuhause geschaffen, im wahrsten Sinne des Wortes. Damit du es ganz an deine persönlichen Vorstellungen anpassen kannst, übernimmst du den letzten Feinschliff selbst. Dazu gehören der Aufbau der Innenwände sowie die Verlegung von Elektrik und Sanitärtechnik. Das System ist exakt dafür vorbereitet und macht jeden Schritt klar."
              textBox2="Dank vorkonzipierter Wandpaneele wird das Einziehen von Leitungen besonders einfach. So behältst du maximale Freiheit in der Gestaltung, kannst regionale Fachbetriebe einbinden oder selbst aktiv werden. Alles richtet sich nach deinem Tempo und deinem Budget. Dieses flexible Ausbaukonzept spart Kosten, stärkt die Eigenverantwortung und macht dein NEST Haus zu einem Ort, der wirklich dir gehört."
              maxWidth={false}
              video={IMAGES.function.nestHausModulSchemaIntro}
              autoPlay={true}
              muted={true}
              controls={false}
            />
          </div>
        </section>

        {/* Section 3 - Du individualisierst dein NEST Haus */}
        <section id="individualisierung" className="w-full py-16 bg-black">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-white">
                Du individualisierst dein NEST Haus.
              </h2>
              <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 text-white max-w-3xl mx-auto">
                Weil nur du weißt, wie du richtig wohnst.
              </h3>
            </div>

            <div className="flex justify-center">
              <div className="w-full relative" style={{ aspectRatio: "1.9/1" }}>
                <HybridBlobImage
                  path={IMAGES.function.nestHausGrundrissSchema}
                  alt="NEST-Haus Grundriss Schema - Individualisierung und Planung"
                  strategy="client"
                  isInteractive={true}
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

        {/* Section 4 - Hier beginnt Freiheit */}
        <section id="freiheit" className="w-full py-16 bg-black">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <FullWidthTextGrid
              title="Hier beginnt Freiheit"
              subtitle="Weil nur Du weißt, wie du richtig wohnst."
              backgroundColor="black"
              textBox1="Mit Nest hast du die Freiheit, deinen Grundriss so zu gestalten, wie es zu deinem Leben passt. Kein Schema, kein Standard. Nur Räume, die sich anfühlen wie du selbst. Denn richtig wohnen bedeutet mehr als Fläche und Funktion. Es ist Persönlichkeit, Ausdruck und Alltag der von dir in Einklang gebracht wird."
              textBox2="Wenn du auf dem Weg dorthin Unterstützung möchtest, begleiten wir dich Schritt für Schritt. Unsere Planungspakete führen dich von der Einreichplanung bis zur Gestaltung des Innenraums. Individuell, durchdacht und auf deine Vorstellungen abgestimmt. So entsteht aus einer Idee ein Zuhause, das wirklich zu dir passt."
              maxWidth={false}
            />

            {/* ImageGlassCard */}
            <div className="mt-16">
              <ImageGlassCard
                backgroundColor="black"
                maxWidth={false}
              />

              {/* Additional Button Combination */}
              <div className="flex gap-4 justify-center w-full mt-8">
                <Button variant="primary" size="xs">
                  Die Pakete
                </Button>
                <Button variant="secondary" size="xs">
                  Mehr Information
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 - Die Installationsebene */}
        <section id="installationsebene" className="w-full py-16 bg-black">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <ImageWithFourTextGrid
              title="Die Installationsebene"
              subtitle="Die wichtigsten Schritte deiner aktiven Rolle beim NEST-Haus Bau"
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
          </div>
        </section>

        {/* Wohnfläche erweitern Section */}
        <section id="wohnflaeche-erweitern" className="w-full py-16 bg-black">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <ThreeByOneGrid
              title="Wohnfläche erweitern?"
              subtitle="Kein Problem."
              text="Mehr Raum, wenn du ihn brauchst. Dein Nest Haus wächst mit. Dank durch-dachter Konstruktion kannst du jederzeit eine Zwischendecke einziehen und dein Zuhause ganz einfach in ein zwei-geschoßiges Raumwunder verwandeln."
              image1={IMAGES.function.nestHausPlattenFundament}
              image2={IMAGES.function.nestHausFundamentStreifenfundament}
              image1Description="NEST-Haus Planung Innenausbau mit Zwischendecke - Leichtbau Modul"
              image2Description="NEST-Haus Fundament Streifenfundament für Zwischendecke - Leichtbau Modul"
              textPosition="left"
              backgroundColor="black"
              maxWidth={false}
            />
          </div>
        </section>

        {/* Flexibilität Section */}
        <section id="flexibilitaet" className="w-full py-16 bg-black">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <ThreeByOneGrid
              title="Ob Decke einziehen, oder Haus erweitern."
              subtitle="Dein Nest bleibt flexibel und lässt sich an deine Lebensumstände anpassen"
              text="Durch intelligente Standardisierung garantieren wir höchste Qualität, Langlebigkeit und Nachhaltigkeit zum bestmöglichen Preis. Präzisionsgefertigte Module sorgen für Stabilität, Energieeffizienz und ein unvergleichliches Wohngefühl. Dein Zuhause. Dein Stil. Deine Freiheit. Mit Nest. musst du dich nicht entscheiden, denn du bekommst alles."
              image1={IMAGES.function.nestHausModulSeiteKonzept}
              image2={IMAGES.function.nestHausModulSeiteKonzept}
              image1Description="NEST-Haus Modul Ansicht Seite - Holz Schema Konzept"
              image2Description="NEST-Haus Modul Ansicht Seite - Holz Schema Konzept"
              textPosition="right"
              backgroundColor="black"
              maxWidth={false}
            />
          </div>
        </section>

        {/* Video Gallery Section */}
        <section id="video-gallery" className="w-full py-16 bg-white">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <FullWidthVideoGrid
              title="Deine Gestaltungsmöglichkeiten"
              subtitle="Entdecke die vielfältigen Konfigurationsmöglichkeiten für dein NEST Haus"
              backgroundColor="white"
              textBox1="Diese Animation zeigt dir die verschiedenen Modulkombinationen und Gestaltungsvarianten deines NEST Hauses. Jede Konfiguration ist individuell anpassbar."
              textBox2="Von kompakten 2-Modul-Häusern bis hin zu großzügigen 6-Modul-Komplexen - entdecke die Flexibilität unseres modularen Bausystems."
              maxWidth={false}
              video={IMAGES.variantvideo.nine}
              autoPlay={true}
              muted={true}
              controls={false}
            />
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="call-to-action" className="w-full py-16">
          <CallToAction
            title="Bereit für dein NEST Haus?"
            subtitle="Starte jetzt die Konfiguration deines individuellen Traumhauses"
            buttonText="Zum Konfigurator"
            buttonLink="/konfigurator"
            backgroundColor="gray"
            maxWidth={false}
          />
        </section>
      </SectionRouter>
    </div>
  );
}
