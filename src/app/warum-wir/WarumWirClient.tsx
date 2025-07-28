"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { Button, CallToAction } from "@/components/ui";
import {
  ThreeByOneGrid,
  FullWidthImageGrid,
  FullWidthTextGrid,
  VideoGallery,
  ImageGallery,
} from "@/components/grids";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

// Define sections with proper structure for warum-wir page
const sections = [
  {
    id: "vision",
    title: "Unsere Vision",
    slug: "vision",
  },
  {
    id: "motivation",
    title: "Was uns antreibt",
    slug: "motivation",
  },
  {
    id: "werte",
    title: "Unsere Werte",
    slug: "werte",
  },
  {
    id: "zukunft",
    title: "Gemeinsam für die Zukunft",
    slug: "zukunft",
  },
  {
    id: "unterschied",
    title: "Was uns unterscheidet",
    slug: "unterschied",
  },
  {
    id: "mission",
    title: "Unsere Mission",
    slug: "mission",
  },
  {
    id: "video-showcase",
    title: "Unsere Vision in Bewegung",
    slug: "vision-bewegung",
  },
  {
    id: "call-to-action",
    title: "Werde Teil der Bewegung",
    slug: "teil-bewegung",
  },
  {
    id: "kein-plan-kein-problem",
    title: "Kein Plan? Kein Problem!",
    slug: "beratung",
  },
  {
    id: "gallery",
    title: "Bildergalerie",
    slug: "galerie",
  },
];

export default function WarumWirClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("vision");

  return (
    <div className="min-h-screen pt-16">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Section 1 - Vision */}
        <section id="vision" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Unsere Vision
            </h2>
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center">
              Eine Welt, in der nachhaltiges Wohnen für jeden zugänglich ist
            </h3>

            <div className="text-center mb-12">
              <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8">
                Wir glauben an eine Zukunft, in der jeder Mensch in einem
                Zuhause leben kann, das nicht nur schön und funktional ist,
                sondern auch im Einklang mit der Natur steht. NEST-Haus macht
                diese Vision zur Realität - durch modulares Bauen, das
                individuelle Träume mit globaler Verantwortung verbindet.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Unser Ansatz
                </Button>
                <Button variant="secondary" size="lg">
                  Kontakt aufnehmen
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h4 className="text-2xl font-semibold mb-6">
                  Wohnen neu denken
                </h4>
                <p className="text-lg leading-relaxed mb-6">
                  Traditioneller Hausbau ist oft langsam, teuer und
                  umweltbelastend. Wir haben uns gefragt: Warum muss das so
                  sein? Warum können Häuser nicht schneller, nachhaltiger und
                  individueller entstehen?
                </p>

                <h4 className="text-2xl font-semibold mb-6">
                  Die Antwort: Modulares Bauen
                </h4>
                <p className="text-lg leading-relaxed">
                  Durch intelligente Standardisierung erreichen wir höchste
                  Qualität bei maximaler Flexibilität. Jedes NEST-Haus ist ein
                  Unikat - aber basiert auf bewährten, nachhaltigen Modulen.
                </p>
              </div>

              <div className="relative" style={{ aspectRatio: "4/3" }}>
                <HybridBlobImage
                  path={IMAGES.function.nestHausModulKonzept}
                  alt="NEST-Haus Vision - Modulares Bauen für die Zukunft"
                  strategy="auto"
                  isAboveFold={false}
                  isCritical={false}
                  enableCache={true}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 - Motivation */}
        <section id="motivation" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Was uns antreibt
            </h2>
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center">
              Die Leidenschaft für nachhaltiges und individuelles Bauen
            </h3>

            <FullWidthTextGrid
              title="Mehr als nur Häuser bauen"
              subtitle="Unsere Motivation geht weit über das Bauen hinaus"
              backgroundColor="white"
              textBox1="Jeden Tag sehen wir die Auswirkungen des Klimawandels. Gleichzeitig wird Wohnraum immer teurer und die Bauzeiten immer länger. Diese Probleme motivieren uns, Lösungen zu entwickeln, die sowohl für Menschen als auch für die Umwelt gut sind."
              textBox2="Wir möchten beweisen, dass nachhaltiges Bauen nicht bedeutet, auf Komfort oder Design zu verzichten. Im Gegenteil: Durch innovative Technologien und durchdachte Planung entstehen Häuser, die in jeder Hinsicht überzeugen - ökologisch, ökonomisch und ästhetisch."
              maxWidth={false}
            />

            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-4xl mb-4">🌱</div>
                <h4 className="text-xl font-semibold mb-4">Umweltschutz</h4>
                <p className="text-gray-600">
                  Reduktion des CO2-Fußabdrucks durch nachhaltige Materialien
                  und effiziente Produktionsprozesse.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-semibold mb-4">Effizienz</h4>
                <p className="text-gray-600">
                  Schnellere Bauzeiten und optimierte Prozesse für bessere
                  Kosteneffizienz ohne Qualitätsverlust.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-4xl mb-4">🎨</div>
                <h4 className="text-xl font-semibold mb-4">Individualität</h4>
                <p className="text-gray-600">
                  Jedes Haus spiegelt die Persönlichkeit seiner Bewohner wider -
                  durch flexible Module und grenzenlose
                  Gestaltungsmöglichkeiten.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 - Werte */}
        <section id="werte" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Unsere Werte
            </h2>
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center">
              Die Prinzipien, die unser Handeln bestimmen
            </h3>

            <ThreeByOneGrid
              title="Transparenz und Vertrauen"
              subtitle="Ehrlichkeit in allem, was wir tun"
              text="Vertrauen ist die Basis jeder guten Beziehung. Deshalb sind wir in allen Bereichen transparent: Von den Kosten über die Bauzeiten bis hin zu den verwendeten Materialien. Sie wissen jederzeit, woran Sie sind."
              image1={IMAGES.function.nestHausModulAnsicht}
              image2={IMAGES.function.nestHausModulSeiteKonzept}
              image1Description="Transparenz in Planung und Ausführung"
              image2Description="Offene Kommunikation in allen Projektphasen"
              backgroundColor="white"
              maxWidth={false}
            />

            <div className="mt-16 bg-gray-50 rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-2xl font-semibold mb-6">
                    Qualität ohne Kompromisse
                  </h4>
                  <p className="text-lg leading-relaxed mb-6">
                    Qualität ist nicht verhandelbar. Jedes Detail wird
                    durchdacht, jedes Material sorgfältig ausgewählt. Unsere
                    Module durchlaufen strenge Qualitätskontrollen, bevor sie
                    Ihr Zuhause werden.
                  </p>

                  <h4 className="text-2xl font-semibold mb-6">
                    Kontinuierliche Innovation
                  </h4>
                  <p className="text-lg leading-relaxed">
                    Stillstand bedeutet Rückschritt. Wir investieren
                    kontinuierlich in Forschung und Entwicklung, um unsere
                    Systeme zu verbessern und neue Lösungen zu finden.
                  </p>
                </div>

                <div>
                  <h4 className="text-2xl font-semibold mb-6">
                    Kundenorientierung
                  </h4>
                  <p className="text-lg leading-relaxed mb-6">
                    Ihre Zufriedenheit ist unser Erfolg. Wir hören zu, verstehen
                    Ihre Bedürfnisse und entwickeln Lösungen, die exakt zu Ihrem
                    Leben passen.
                  </p>

                  <h4 className="text-2xl font-semibold mb-6">Verantwortung</h4>
                  <p className="text-lg leading-relaxed">
                    Wir übernehmen Verantwortung - für unsere Kunden, für die
                    Umwelt und für zukünftige Generationen. Jede Entscheidung
                    wird unter diesen Gesichtspunkten getroffen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 - Zukunft */}
        <section id="zukunft" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Gemeinsam für die Zukunft
            </h2>
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center">
              Nachhaltigkeit als gemeinsame Verantwortung
            </h3>

            <FullWidthImageGrid
              title="Eine bessere Welt bauen"
              subtitle="Jedes NEST-Haus ist ein Schritt in die richtige Richtung"
              backgroundColor="white"
              textBox1="Nachhaltigkeit ist keine Option, sondern eine Notwendigkeit. Mit jedem Haus, das wir bauen, reduzieren wir den ökologischen Fußabdruck der Bauindustrie. Unsere Kunden werden zu Partnern im Kampf gegen den Klimawandel."
              textBox2="Die Zukunft gehört intelligenten, nachhaltigen Lösungen. NEST-Haus verbindet modernste Technologie mit ökologischer Verantwortung. Gemeinsam schaffen wir Wohnraum, der nicht nur heute überzeugt, sondern auch kommenden Generationen ein lebenswertes Umfeld bietet."
              image={IMAGES.function.nestHausModulElektrikSanitaer}
              maxWidth={false}
            />
          </div>
        </section>

        {/* Section 5 - Unterschied */}
        <section id="unterschied" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Was uns unterscheidet
            </h2>
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center">
              Mehr als nur ein Hausbau-Unternehmen
            </h3>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-xl font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">
                        Ganzheitlicher Ansatz
                      </h4>
                      <p className="text-gray-600">
                        Wir denken nicht nur an das Haus, sondern an Ihr
                        gesamtes Leben. Flexibilität, Nachhaltigkeit und
                        Zukunftsfähigkeit stehen im Mittelpunkt.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-xl font-bold">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">
                        Echte Partnership
                      </h4>
                      <p className="text-gray-600">
                        Sie sind nicht nur Kunde, sondern Partner. Wir begleiten
                        Sie von der ersten Idee bis zum Einzug und darüber
                        hinaus.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-xl font-bold">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">
                        Technologieführerschaft
                      </h4>
                      <p className="text-gray-600">
                        Wir nutzen neueste Technologien nicht um ihrer selbst
                        willen, sondern um echte Vorteile für Sie zu schaffen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative" style={{ aspectRatio: "4/3" }}>
                <HybridBlobImage
                  path={IMAGES.function.nestHausModulSchemaIntro}
                  alt="NEST-Haus Unterschiede - Einzigartiger Ansatz im modularen Bauen"
                  strategy="auto"
                  isAboveFold={false}
                  isCritical={false}
                  enableCache={true}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 - Mission */}
        <section id="mission" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Unsere Mission
            </h2>
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center">
              Den Hausbau revolutionieren - für Sie und die Umwelt
            </h3>

            <div className="text-center mb-12">
              <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8">
                Unsere Mission ist es, modulares Bauen zum neuen Standard zu
                machen. Wir wollen beweisen, dass nachhaltiges, schnelles und
                individuelles Bauen nicht nur möglich ist, sondern auch
                wirtschaftlich sinnvoll.
              </p>

              <div className="flex gap-4 justify-center flex-wrap mb-12">
                <Button variant="primary" size="lg">
                  Ihr Projekt starten
                </Button>
                <Button variant="secondary" size="lg">
                  Beratungstermin
                </Button>
                <Button variant="outline" size="lg">
                  Unser Team kennenlernen
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-semibold mb-4">
                  Werden Sie Teil der Bewegung
                </h4>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Jedes NEST-Haus ist ein Statement für nachhaltiges Bauen.
                  Gemeinsam schaffen wir eine Zukunft, in der Wohnen und
                  Umweltschutz Hand in Hand gehen.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    50%
                  </div>
                  <p className="text-sm text-gray-600">
                    weniger CO2-Emissionen
                  </p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    70%
                  </div>
                  <p className="text-sm text-gray-600">schnellere Bauzeit</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    90%
                  </div>
                  <p className="text-sm text-gray-600">Kundenzufriedenheit</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    100%
                  </div>
                  <p className="text-sm text-gray-600">Nachhaltigkeit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Showcase Section */}
        <section id="video-showcase" className="w-full py-16">
          <VideoGallery
            title="Unsere Vision in Bewegung"
            subtitle="Erlebe die Zukunft des modularen Bauens - wie aus einzelnen Modulen individuelle Traumhäuser entstehen"
            videoPath={IMAGES.variantvideo.ten}
            backgroundColor="white"
            maxWidth={false}
            autoPlay={true}
            loop={true}
            muted={true}
            controls={false}
          />
        </section>

        {/* Call to Action Section */}
        <section id="call-to-action" className="w-full py-16">
          <CallToAction
            title="Werde Teil der Bewegung"
            subtitle="Gemeinsam gestalten wir die Zukunft des nachhaltigen Bauens - starte jetzt dein NEST Haus Projekt"
            buttonText="Jetzt loslegen"
            buttonLink="/konfigurator"
            backgroundColor="gray"
            maxWidth={false}
          />
        </section>

        {/* Kein Plan? Kein Problem! CTA Section */}
        <section id="kein-plan-kein-problem">
          <CallToAction
            title="Kein Plan? Kein Problem!"
            subtitle="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch"
            buttonText="Jetzt vereinbaren"
            buttonLink="/kontakt"
            backgroundColor="gray"
            maxWidth={false}
          />
        </section>

        {/* Image Gallery Section */}
        <section id="gallery">
          <ImageGallery
            useHeroImages={true}
            backgroundColor="white"
            maxWidth={false}
          />
        </section>
      </SectionRouter>
    </div>
  );
}
