"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { Button, CallToAction } from "@/components/ui";
import {
  ThreeByOneAdaptiveHeight,
  FullWidthImageGrid,
  FullWidthVideoGrid,
  ThreeByOneGrid,
} from "@/components/grids";
import { HybridBlobImage, ClientBlobVideo } from "@/components/images";
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
  {
    id: "call-to-action",
    title: "Kein Plan? Kein Problem!",
    slug: "kein-plan",
  },
  {
    id: "video-gallery",
    title: "Die Vielfalt unserer Module",
    slug: "modul-vielfalt",
  },
];

// Custom material card data for ContentCardsGlass using IMAGES constants
const materialCardData = [
  {
    id: 1,
    title: "Naturstein - Kalkstein",
    subtitle: "Kanfanar Kalkstein",
    description:
      "Der massive Kalkstein überzeugt durch seine natürliche Eleganz, zeitlose Ästhetik und hohe Widerstandsfähigkeit. Mit seiner charakteristischen Farbgebung, die von warmen Beigetönen bis hin zu sanften Graunuancen reicht, verleiht er Innen- und Außenbereichen eine edle, harmonische Ausstrahlung.",
    mobileTitle: "Kanfanar Naturstein",
    mobileSubtitle: "Kalkstein Premium",
    mobileDescription:
      "Massive Kalkstein-Eleganz mit warmen Beigetönen bis sanften Graunuancen. Zeitlose Ästhetik und hohe Widerstandsfähigkeit für edle Ausstrahlung.",
    image: IMAGES.materials.kalkstein,
    backgroundColor: "#121212",
  },
  {
    id: 2,
    title: "Naturstein - Schiefer",
    subtitle: "Dunkler Schiefer",
    description:
      "Hochwertiger Schiefer verleiht jedem Raum eine edle und natürliche Atmosphäre. Seine charakteristische dunkelgraue Färbung und die natürliche Schieferung schaffen einzigartige Lichtreflexe und eine lebendige Oberflächenstruktur.",
    mobileTitle: "Schiefer Naturstein",
    mobileSubtitle: "Dunkle Eleganz",
    mobileDescription:
      "Hochwertiger Schiefer mit charakteristischer dunkelgrauer Färbung. Natürliche Schieferung für einzigartige Lichtreflexe.",
    image: IMAGES.materials.schiefer,
    backgroundColor: "#121212",
  },
  {
    id: 3,
    title: "Eichen-Parkett",
    subtitle: "Fischgrätparkett Eiche",
    description:
      "Edles Eichen-Fischgrätparkett verbindet traditionelle Handwerkskunst mit zeitgemäßer Eleganz. Die charakteristische Maserung der Eiche und das klassische Verlegemuster schaffen eine warme, wohnliche Atmosphäre mit hoher Langlebigkeit.",
    mobileTitle: "Eichen-Parkett",
    mobileSubtitle: "Fischgrät-Verlegung",
    mobileDescription:
      "Edles Eichen-Fischgrätparkett mit traditioneller Handwerkskunst. Warme, wohnliche Atmosphäre mit hoher Langlebigkeit.",
    image: IMAGES.materials.eicheParkett,
    backgroundColor: "#121212",
  },
  {
    id: 4,
    title: "Lärchen-Holzlattung",
    subtitle: "Fassade Bauholz",
    description:
      "Natürliche Lärchen-Holzlattung für die Fassadengestaltung. Das robuste Bauholz besticht durch seine warme Farbe und natürliche Widerstandsfähigkeit gegen Witterungseinflüsse. Eine nachhaltige und ästhetische Lösung für moderne Architektur.",
    mobileTitle: "Lärchen-Fassade",
    mobileSubtitle: "Natürliche Lattung",
    mobileDescription:
      "Robuste Lärchen-Holzlattung mit warmer Farbe. Natürliche Widerstandsfähigkeit und nachhaltige Ästhetik.",
    image: IMAGES.materials.laercheFassade,
    backgroundColor: "#121212",
  },
  {
    id: 5,
    title: "Fundermax Platten",
    subtitle: "Schwarze Fassadenplatten",
    description:
      "Hochwertige Fundermax Fassadenplatten in elegantem Schwarz. Die wetterbeständigen Platten bieten eine moderne, puristische Optik und sind langlebig sowie pflegeleicht. Ideal für zeitgemäße Architektur mit hohen Ansprüchen.",
    mobileTitle: "Fundermax Platten",
    mobileSubtitle: "Schwarze Fassade",
    mobileDescription:
      "Hochwertige schwarze Fundermax Platten. Wetterbeständig, modern und pflegeleicht für zeitgemäße Architektur.",
    image: IMAGES.materials.fundermax,
    backgroundColor: "#121212",
  },
  {
    id: 6,
    title: "Trapezblech",
    subtitle: "Schwarze Metallfassade",
    description:
      "Robustes Trapezblech in mattem Schwarz für eine kraftvolle, industrielle Ästhetik. Das langlebige Material ist wartungsarm, witterungsbeständig und verleiht Gebäuden einen markanten, modernen Charakter.",
    mobileTitle: "Trapezblech",
    mobileSubtitle: "Schwarze Metall-Fassade",
    mobileDescription:
      "Robustes schwarzes Trapezblech für kraftvolle Ästhetik. Wartungsarm, witterungsbeständig und markant modern.",
    image: IMAGES.materials.trapezblech,
    backgroundColor: "#121212",
  },
];

export default function UnserPartClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("hero");

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
            text="Unsere Qualitätssicherung beginnt bereits in der Planungsphase und setzt sich durch den gesamten Fertigungsprozess fort. Jedes Modul wird nach strengsten Standards gefertigt und vor der Auslieferung umfassend geprüft."
            mobileText="Qualitätssicherung und Präzision in jedem Arbeitsschritt - das ist unser Versprechen für dein NEST-Haus."
            textPosition="left"
            maxWidth={false}
            image1={IMAGES.function.nestHausModulAnsicht}
            image2={IMAGES.function.nestHausModulKonzept}
            image1Description="NEST-Haus Modul Stirnseite Ansicht Schema Konzept"
            image2Description="NEST-Haus Modul Holz Schema Konzept"
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

          {/* ContentCardsGlass with full width and custom material data */}
          <ContentCardsGlass
            variant="responsive"
            title=""
            subtitle=""
            maxWidth={false}
            showInstructions={true}
            customData={materialCardData}
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
              text="Solltest du Unterstützung bei der Planung benötigen, kannst du eines unserer Planungspakete wählen. So erhältst du genau die Hilfe, die du brauchst, um deine Vision Wirklichkeit werden zu lassen."
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
    </div>
  );
}
