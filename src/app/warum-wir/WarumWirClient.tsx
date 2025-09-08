"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { CallToAction } from "@/components/ui";
import { LandingImagesCarousel } from "@/components/sections";
import Footer from "@/components/Footer";

// Define sections with only vision section
const sections = [
  {
    id: "vision",
    title: "Unsere Vision",
    slug: "vision",
  },
];

export default function WarumWirClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("vision");

  return (
    <div className="min-h-screen pt-16 bg-black">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Section 1 - Vision */}
        <section id="vision" className="w-full py-16 bg-black text-white">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center text-white">
              Unsere Vision
            </h1>
            <h2 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center text-white">
              Eine Welt, in der nachhaltiges Wohnen für jeden zugänglich ist
            </h2>

            <div className="text-center mb-12">
              <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8 text-white">
                NEST Haus ist mehr als ein Gebäude – es ist ein neues
                Verständnis von Immobilien. Ein Zuhause, das nicht an Ort und
                Boden gebunden ist. Das mitzieht, wenn das Leben ruft. Das
                weitergegeben wird, wenn sich Wege trennen.
              </p>

              <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8 text-white">
                Wir machen Wohnraum so flexibel wie dein Leben – und eröffnen
                damit einen völlig neuen Markt: einen Markt für mobile,
                handelbare Häuser.
              </p>

              <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8 text-white">
                Durch Hochpräzise serielle Fertigung – inspiriert von der
                Effizienz der Automobilindustrie – verbinden wir höchste
                Qualität mit leistbaren Preisen.
              </p>

              <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8 text-white">
                So entsteht ein neues Wohnsystem – erschwinglich, ästhetisch,
                ökologisch und beweglich. Ein System, das die starren Regeln des
                Immobilienmarkts aufbricht und eine neue Freiheit bringt:
              </p>

              <p className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 text-center text-white">
                Wohnen im Freistil.
              </p>
            </div>
          </div>
        </section>
      </SectionRouter>

      {/* Call to Action */}
      <CallToAction
        title="Bereit für dein Nest Haus?"
        subtitle="Entdecke die Zukunft des Wohnens – flexibel, nachhaltig und erschwinglich."
        buttonText="Jetzt konfigurieren"
        buttonLink="/konfigurator"
        backgroundColor="white"
      />

      {/* Landing Images Carousel */}
      <LandingImagesCarousel backgroundColor="gray" maxWidth={false} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
