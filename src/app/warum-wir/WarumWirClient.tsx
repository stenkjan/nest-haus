"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
import {
  LandingImagesCarousel,
  GetInContactBanner,
} from "@/components/sections";
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
    <div className="min-h-screen pt-12" bg-white>
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Section 1 - Vision */}
        <section id="vision" className="w-full py-16 bg-black text-white">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center text-white">
              Die ®Nest Vision
            </h1>
            <h2 className="h2-subtitle tracking-[-0.015em] leading-8 max-w-6xl mx-auto text-center text-white pb-16">
              Eine Welt, in der Effizienz auf Architektur trifft. <br />
              Eine Welt, in welcher Athmosphäre, Qualität und Nachhaltigkeit im
              Mittelpunkt steht.
            </h2>

            <div className="text-center mb-12">
              <p className="p-secondary text-white max-w-4xl mx-auto text-center">
                Dein Nest Haus ist mehr als ein Gebäude. Es ist ein neues
                Verständnis von Immobilien. <br />
                Ein Zuhause, das nicht an Ort und Boden gebunden ist. Das
                mitzieht, wenn das Leben ruft. Das weitergegeben wird, wenn sich
                Wege trennen. <br />
                <br />
                Wir machen Wohnraum so flexibel wie dein Leben und eröffnen
                damit einen völlig neuen Markt – einen Markt für mobile,
                handelbare Häuser. <br />
                <br />
                Durch hochpräzise serielle Fertigung, inspiriert von der
                Effizienz der Automobilindustrie, verbinden wir höchste Qualität
                mit leistbaren Preisen. <br />
                <br />
                So entsteht ein neues Wohnsystem: erschwinglich, ästhetisch,
                ökologisch und beweglich. <br />
                Ein System, das die starren Regeln des Immobilienmarkts
                aufbricht und eine neue Freiheit bringt. <br />
                <br />
                Wohnen im Freistil.
              </p>
              <p className="text-xs md:text-xs lg:text-xs xl:text-sm max-w-2xl mx-auto 2xl:text-base text-white leading-snug whitespace-pre-line mt-24">
                Es gibt natürlich noch jede Menge Gründe, warum ein Nest Haus
                dein perfektes Zuhause ist. Aber unsere Website macht gerade
                noch ihre ersten Schritte. Bald findest du hier mehr Vorteile,
                spannende Einblicke und die ganze Geschichte hinter Nest. Bleib
                neugierig, es lohnt sich.
              </p>

              {/* Button Combination */}
              <div className="flex gap-4 justify-center w-full mt-8">
                <Link href="/konzept">
                  <Button variant="primary" size="xs">
                    Konzept
                  </Button>
                </Link>
                <Link href="/dein-part">
                  <Button variant="landing-secondary" size="xs">
                    Dein Part
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </SectionRouter>

      {/* Contact Banner - Kein Plan? Kein Problem! */}
      <GetInContactBanner />

      {/* Landing Images Carousel */}
      <LandingImagesCarousel backgroundColor="gray" maxWidth={false} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
