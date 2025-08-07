"use client";

import React, { useState, useEffect } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { Button, CallToAction } from "@/components/ui";
import {
  ThreeByOneGrid,
  FullWidthImageGrid,
  FullWidthTextGrid,
  ImageGallery,
} from "@/components/grids";
import { HybridBlobImage } from "@/components/images";
import { ContentCardsGlass } from "@/components/cards";
import { IMAGES } from "@/constants/images";
import Footer from "@/components/Footer";

// Define sections with proper structure for entdecken page
const sections = [
  {
    id: "innovation",
    title: "Innovation im modularen Bauen",
    slug: "innovation",
  },
  {
    id: "nachhaltigkeit",
    title: "Nachhaltigkeit & Zukunft",
    slug: "nachhaltigkeit",
  },
  {
    id: "technologie",
    title: "Modernste Technologie",
    slug: "technologie",
  },
  {
    id: "design",
    title: "Design & Architektur",
    slug: "design",
  },
  {
    id: "lebensqualitaet",
    title: "Lebensqualität neu definiert",
    slug: "lebensqualitaet",
  },
  {
    id: "zukunft",
    title: "Die Zukunft des Wohnens",
    slug: "zukunft",
  },
  {
    id: "gallery",
    title: "Unsere Referenzen",
    slug: "referenzen",
  },
  {
    id: "call-to-action",
    title: "Entdecke dein NEST Haus",
    slug: "entdecke",
  },
];

export default function EntdeckenClient() {
  const [currentSectionId, setCurrentSectionId] =
    useState<string>("innovation");

  // Performance: Preload critical images based on current section
  useEffect(() => {
    const preloadImages = () => {
      // Preload next section's images when user is in current section
      const currentIndex = sections.findIndex((s) => s.id === currentSectionId);
      const nextSection = sections[currentIndex + 1];

      if (nextSection && typeof window !== "undefined") {
        // Preload key images for smooth transitions
        if (nextSection.id === "technologie") {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.as = "image";
          link.href = `/api/images?path=${IMAGES.function.nestHausModulElektrikSanitaer}`;
          document.head.appendChild(link);
        }
        if (nextSection.id === "lebensqualitaet") {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.as = "image";
          link.href = `/api/images?path=${IMAGES.function.nestHausModulAnsicht}`;
          document.head.appendChild(link);
        }
      }
    };

    const timeoutId = setTimeout(preloadImages, 1000); // Preload after initial render
    return () => clearTimeout(timeoutId);
  }, [currentSectionId]);

  return (
    <div className="min-h-screen pt-16">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Section 1 - Innovation */}
        <section id="innovation" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Innovation im modularen Bauen
            </h2>
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center">
              Entdecken Sie die revolutionäre Technologie hinter NEST-Haus
            </h3>

            <div className="text-center mb-12">
              <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8">
                Bei NEST-Haus verschmelzen Innovation und Tradition zu einem
                einzigartigen Baukonzept. Unsere modularen Systeme
                revolutionieren die Art, wie wir über Hausbau denken - flexibel,
                nachhaltig und zukunftsorientiert.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Zum Konfigurator
                </Button>
                <Button variant="secondary" size="lg">
                  Mehr erfahren
                </Button>
              </div>
            </div>

            <ThreeByOneGrid
              title="Präzision trifft auf Flexibilität"
              subtitle="Modernste Fertigungstechnologie für höchste Qualität"
              text="Jedes NEST-Haus Modul wird mit millimetergenauer Präzision gefertigt. Unsere computergesteuerten Produktionsanlagen garantieren gleichbleibend hohe Qualität und ermöglichen dabei maximale Flexibilität in der Gestaltung."
              image1={IMAGES.function.nestHausModulKonzept}
              image2={IMAGES.function.nestHausModulSeiteKonzept}
              image1Description="Präzisionsfertigung im NEST-Haus Werk"
              image2Description="Modulare Bauweise ermöglicht individuelle Gestaltung"
              backgroundColor="white"
              maxWidth={false}
            />
          </div>
        </section>

        {/* Section 2 - Nachhaltigkeit */}
        <section id="nachhaltigkeit" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Nachhaltigkeit & Zukunft
            </h2>
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center">
              Bauen im Einklang mit der Natur
            </h3>

            <FullWidthTextGrid
              title="Für eine bessere Zukunft"
              subtitle="Nachhaltigkeit als Grundprinzip"
              backgroundColor="white"
              textBox1="Nachhaltiges Bauen bedeutet für uns mehr als nur Energieeffizienz. Es geht um eine ganzheitliche Betrachtung des Lebenszyklus - von der Materialauswahl über die Produktion bis hin zur späteren Wiederverwertung."
              textBox2="Unsere Module bestehen aus nachhaltigen, regional verfügbaren Materialien. Der modulare Aufbau ermöglicht es, Gebäude bei Bedarf zu erweitern, zu verkleinern oder sogar komplett zu versetzen - für maximale Flexibilität im Lebensverlauf."
              maxWidth={false}
            />
          </div>
        </section>

        {/* Section 3 - Technologie */}
        <section id="technologie" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Modernste Technologie
            </h2>
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center">
              Digitale Innovation im traditionellen Handwerk
            </h3>

            <FullWidthImageGrid
              title="Smart Building für die Zukunft"
              subtitle="Technologie, die Ihr Leben vereinfacht"
              backgroundColor="white"
              textBox1="Intelligente Haustechnik ist bei NEST-Haus bereits ab Werk integriert. Von der automatischen Klimasteuerung bis hin zur integrierten Photovoltaikanlage - Ihr Zuhause denkt mit."
              textBox2="Dank unserer digitalen Planungstools können Sie Ihr Haus vorab virtuell erkunden und anpassen. Was Sie im Konfigurator sehen, ist exakt das, was Sie später erhalten - ohne böse Überraschungen."
              image={IMAGES.function.nestHausModulElektrikSanitaer}
              maxWidth={false}
            />
          </div>
        </section>

        {/* Section 4 - Design */}
        <section id="design" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Design & Architektur
            </h2>
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center">
              Ästhetik trifft auf Funktionalität
            </h3>

            <div className="text-center mb-12">
              <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8">
                Modulares Bauen bedeutet nicht Verzicht auf individuelles
                Design. Im Gegenteil: Die standardisierten Module bieten
                unendliche Kombinationsmöglichkeiten für einzigartige
                Architekturen.
              </p>
            </div>

            <ContentCardsGlass
              title="Grenzenlose Gestaltungsmöglichkeiten"
              subtitle="Ihr individueller Stil, unsere Expertise"
              maxWidth={false}
            />
          </div>
        </section>

        {/* Section 5 - Lebensqualität */}
        <section id="lebensqualitaet" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Lebensqualität neu definiert
            </h2>
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center">
              Wohnen, wie es sein sollte
            </h3>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h4 className="text-2xl font-semibold mb-6">
                  Gesundes Raumklima
                </h4>
                <p className="text-lg leading-relaxed mb-6">
                  Natürliche Materialien und durchdachte Belüftungskonzepte
                  sorgen für ein optimales Raumklima. Ihre Gesundheit und Ihr
                  Wohlbefinden stehen im Mittelpunkt.
                </p>

                <h4 className="text-2xl font-semibold mb-6">
                  Energieeffizienz
                </h4>
                <p className="text-lg leading-relaxed mb-8">
                  Niedrigste Energiekosten durch optimale Dämmung und
                  intelligente Haustechnik. Ein NEST-Haus ist eine Investition
                  in die Zukunft.
                </p>

                <Button variant="primary" size="lg">
                  Energiekonzept erkunden
                </Button>
              </div>

              <div className="relative" style={{ aspectRatio: "4/3" }}>
                <HybridBlobImage
                  path={IMAGES.function.nestHausModulAnsicht}
                  alt="NEST-Haus Innenansicht - Lebensqualität und Komfort"
                  strategy="auto"
                  isAboveFold={false}
                  isCritical={currentSectionId === "lebensqualitaet"}
                  enableCache={true}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                  priority={currentSectionId === "lebensqualitaet"}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 - Zukunft */}
        <section id="zukunft" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Die Zukunft des Wohnens
            </h2>
            <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center">
              Heute planen, morgen wohnen
            </h3>

            <div className="text-center mb-12">
              <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8">
                NEST-Haus steht für eine neue Ära des Bauens. Schneller,
                nachhaltiger und individueller als je zuvor. Entdecken Sie
                selbst, was modulares Bauen für Ihr Traumhaus bedeuten kann.
              </p>

              <div className="flex gap-4 justify-center flex-wrap">
                <Button variant="primary" size="lg">
                  Jetzt konfigurieren
                </Button>
                <Button variant="secondary" size="lg">
                  Beratung vereinbaren
                </Button>
                <Button variant="outline" size="lg">
                  Referenzen ansehen
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    &lt; 12 Wochen
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Bauzeit</h4>
                  <p className="text-gray-600">
                    Von der Planung bis zum Einzug
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    A+
                  </div>
                  <h4 className="text-lg font-semibold mb-2">
                    Energieeffizienz
                  </h4>
                  <p className="text-gray-600">
                    Höchste Standards für niedrigste Kosten
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    100%
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Individuell</h4>
                  <p className="text-gray-600">
                    Maßgeschneidert für Ihre Bedürfnisse
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery Section */}
        <section id="gallery" className="w-full py-16">
          <ImageGallery
            useHeroImages={true}
            backgroundColor="white"
            maxWidth={false}
          />
        </section>

        {/* Call to Action Section */}
        <section id="call-to-action" className="w-full py-16">
          <CallToAction
            title="Entdecke dein NEST Haus"
            subtitle="Beginne jetzt deine Reise zum nachhaltigen und individuellen Traumhaus"
            buttonText="Konfigurator starten"
            buttonLink="/konfigurator"
            backgroundColor="gray"
            maxWidth={false}
          />
        </section>
      </SectionRouter>
      <Footer />
    </div>
  );
}
