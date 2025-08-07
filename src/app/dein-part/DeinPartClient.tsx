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
import { HybridBlobImage, ClientBlobVideo } from "@/components/images";
import { ImageGlassCard } from "@/components/cards";
import { SquareGlassCardsScroll } from "@/components/cards";
import { PricingCardsLightbox } from "@/components/cards/ContentCardsLightbox";

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* White background for navbar area */}
      <div
        className="fixed top-0 left-0 right-0 bg-white z-[90]"
        style={{ height: "var(--navbar-height, 4rem)" }}
      ></div>
      <div style={{ paddingTop: "var(--navbar-height, 4rem)" }}>
        <SectionRouter
          sections={sections}
          onSectionChange={setCurrentSectionId}
        >
          {/* Section 1 - Dein kreativer Freiraum */}
          <section id="freiraum" className="w-full py-20 bg-white">
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-3">
                  Dein kreativer Freiraum
                </h2>
                <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-black mb-8">
                  Gestalte dein NEST Haus nach deinen Vorstellungen.
                </p>

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
          <section id="moeglichkeiten" className="w-full pt-20 pb-8 bg-black">
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
              <FullWidthVideoGrid
                title="Wir liefern Möglichkeiten"
                subtitle="Wo Effizienz auf Architektur trifft - Nest®"
                backgroundColor="black"
                textBox1="<span class='text-gray-400'>Nach der Lieferung deines NEST Hauses ist die</span> Grundlage für dein neues Zuhause geschaffen, <span class='text-gray-400'>im wahrsten Sinne des Wortes. Damit du es</span> ganz an deine persönlichen Vorstellungen anpassen kannst, übernimmst du den letzten Feinschliff selbst. <span class='text-gray-400'>Dazu gehören der Aufbau der Innenwände sowie die Verlegung von Elektrik und Sanitärtechnik. Das System ist exakt dafür vorbereitet und</span> macht jeden Schritt klar."
                textBox2="Dank <span class='text-gray-400'>vorbereiteter Wandpaneele wird das</span> Einziehen von Leitungen <span class='text-gray-400'>besonders einfach. So</span> behältst du <span class='text-gray-400'>maximale Freiheit in der Gestaltung,</span> kannst <span class='text-gray-400'>regionale Fachbetriebe einbinden oder selbst aktiv werden. Alles richtet sich nach deinem Tempo und deinem Budget. Dieses</span> flexible Ausbaukonzept spart Kosten, <span class='text-gray-400'>stärkt die Eigenverantwortung und</span> macht dein NEST Haus zu einem Ort, der wirklich dir gehört."
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

              {/* Image container with same sizing as unser-part page */}
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
            </div>
          </section>

          {/* Section 4 - Hier beginnt Freiheit */}
          <section id="freiheit" className="w-full py-16 bg-black">
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
              <FullWidthTextGrid
                title="Hier beginnt Freiheit"
                subtitle="Weil nur Du weißt, wie du richtig wohnst."
                backgroundColor="black"
                textBox1="<span class='text-gray-400'>Mit Nest hast du die</span> Freiheit, deinen Grundriss so zu gestalten, <span class='text-gray-400'>wie es zu deinem Leben passt. Kein Schema, kein Standard. Nur Räume, die sich anfühlen wie du selbst.</span> Denn richtig wohnen bedeutet mehr als Fläche und Funktion. <span class='text-gray-400'>Es ist Persönlichkeit, Ausdruck und Alltag der von dir in Einklang gebracht wird.</span>"
                textBox2="<span class='text-gray-400'>Wenn du auf dem Weg dorthin</span> Unterstützung <span class='text-gray-400'>möchtest, begleiten wir dich Schritt für Schritt. Unsere</span> Planungspakete <span class='text-gray-400'>führen dich</span> von der Einreichplanung bis zur Gestaltung des Innenraums. <span class='text-gray-400'>Individuell, durchdacht und auf deine Vorstellungen abgestimmt. So entsteht aus einer Idee ein</span> Zuhause, das wirklich zu dir passt."
                maxWidth={false}
              />

              {/* ImageGlassCard */}
              <div className="mt-16">
                <ImageGlassCard backgroundColor="black" maxWidth={false} />

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
          </section>

          {/* Wohnfläche erweitern Section */}
          <section id="wohnflaeche-erweitern" className="w-full py-16 bg-black">
            <ThreeByOneGrid
              title="Wohnfläche erweitern?"
              subtitle="Kein Problem."
              text="Mehr Raum, wenn du ihn brauchst. <span class='text-gray-400'>Dein Nest Haus wächst mit. Dank durch-dachter Konstruktion kannst du</span> jederzeit eine Zwischendecke einziehen <span class='text-gray-400'>und dein Zuhause ganz einfach in ein zwei-geschoßiges Raumwunder verwandeln.</span>"
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
              text="<span class='text-gray-400'>Durch intelligente</span> Standardisierung <span class='text-gray-400'>garantieren wir</span> höchste Qualität, Langlebigkeit und Nachhaltigkeit zum bestmöglichen Preis. <span class='text-gray-400'>Präzisionsgefertigte Module sorgen für</span> Stabilität, Energieeffizienz <span class='text-gray-400'>und ein unvergleichliches Wohngefühl.</span> Dein Zuhause. Dein Stil. Deine Freiheit. <span class='text-gray-400'>Mit Nest. musst du dich nicht entscheiden,</span> denn du bekommst alles."
              image1={IMAGES.function.nestHausFundamentPunktfundament}
              image2={IMAGES.function.nestHausFlexibilitaetErweiterung}
              image1Description="NEST-Haus Erweiterung Modulbau vergrößern Leichtbau Modul flexibel"
              image2Description="NEST-Haus Flexibilität Erweiterung Modulbau"
              textPosition="right"
              backgroundColor="black"
              maxWidth={false}
            />
          </section>

          {/* Step by Step Section */}
          <section id="step-by-step" className="w-full py-16 bg-black">
            <SquareGlassCardsScroll
              title="Step by Step nach Hause"
              subtitle="Ablauf von Planung und-Bauphase in einfachen Schritten"
              backgroundColor="black"
              maxWidth={false}
              customData={[
                {
                  id: 1,
                  title: "Planung & Design",
                  subtitle: "Individuelle Konzeption",
                  description:
                    "Dein Traumhaus wird individuell geplant. Wir berücksichtigen deine Wünsche, Bedürfnisse und Lebensumstände für die perfekte Lösung.",
                  image: IMAGES.function.nestHausHandDrawing,
                  backgroundColor: "#121212",
                },
                {
                  id: 2,
                  title: "Konfiguration",
                  subtitle: "Anpassung nach Wunsch",
                  description:
                    "Du wählst und konfigurierst dein NEST Haus nach deinen Vorstellungen. Jede Anpassung und Individualisierung ist möglich.",
                  image: IMAGES.function.nestHausGrundrissSchema,
                  backgroundColor: "#121212",
                },
                {
                  id: 3,
                  title: "Produktion",
                  subtitle: "Präzise Fertigung",
                  description:
                    "Dein NEST Haus wird mit höchster Präzision gefertigt. Alle Module werden vorkonzipiert und professionell montiert.",
                  image: IMAGES.function.nestHausModulSchemaIntro,
                  backgroundColor: "#121212",
                },
                {
                  id: 4,
                  title: "Lieferung",
                  subtitle: "Transport zum Grundstück",
                  description:
                    "Die fertigen Module werden sicher und termingerecht zu deinem Grundstück transportiert und vor Ort aufgestellt.",
                  image: IMAGES.function.nestHausModulSeiteKonzept,
                  backgroundColor: "#121212",
                },
                {
                  id: 5,
                  title: "Dein Part",
                  subtitle: "Innenausbau nach Wunsch",
                  description:
                    "Du übernimmst den finalen Innenausbau - Elektrik, Sanitär und Gestaltung nach deinen persönlichen Vorstellungen.",
                  image: IMAGES.function.nestHausModulElektrikSanitaer,
                  backgroundColor: "#121212",
                },
                {
                  id: 6,
                  title: "Einzug",
                  subtitle: "Willkommen Zuhause",
                  description:
                    "Dein individuelles NEST Haus ist fertig. Du ziehst in dein maßgeschneidertes Zuhause ein, das perfekt zu dir passt.",
                  image: IMAGES.function.nestHausPlattenFundament,
                  backgroundColor: "#121212",
                },
              ]}
            />
          </section>

          {/* Planungspakete Section - Unterstützung gefällig? */}
          <section id="planungspakete" className="w-full py-16 bg-white">
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="font-bold text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-gray-900">
                  Unterstützung gefällig?
                </h2>
                <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 text-gray-600 max-w-6xl mx-auto">
                  Entdecke unsere Planungs-Pakete, um das Beste für dich und
                  dein Nest rauszuholen.
                </h3>
              </div>

              <PricingCardsLightbox title="" subtitle="" />

              {/* Button Combo After Component */}
              <div className="flex gap-4 justify-center w-full mt-16">
                <Button variant="primary" size="xs">
                  Die Pakete
                </Button>
                <Button variant="secondary" size="xs">
                  Mehr Information
                </Button>
              </div>
            </div>
          </section>

          {/* Beratung Section - Kein Plan? Kein Problem! */}
          <section
            id="beratung"
            className="w-full py-16"
            style={{ backgroundColor: "#F4F4F4" }}
          >
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-gray-900">
                  Kein Plan? Kein Problem!
                </h2>
                <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 text-gray-600 max-w-6xl mx-auto">
                  Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz
                  bequem telefonisch
                </h3>
              </div>

              {/* Single Button */}
              <div className="flex justify-center w-full">
                <Button variant="primary" size="xs">
                  Termin vereinbaren
                </Button>
              </div>
            </div>
          </section>

          {/* Video Section - exactly as unser-part */}
          <section id="video-section" className="w-full pt-8 bg-white">
            <ClientBlobVideo
              path={IMAGES.variantvideo.nine}
              autoPlay={true}
              muted={true}
              controls={false}
              loop={true}
              className="w-full h-auto"
            />
          </section>
        </SectionRouter>
      </div>
    </div>
  );
}
