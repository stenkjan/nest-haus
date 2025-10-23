"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui";
import { UnifiedContentCard } from "@/components/cards";
import {
  TALL_CARD_PROPS,
  TALL_CARD_PROPS_WITH_PADDING,
  getContentByCategory,
} from "@/constants/cardContent";
import {
  ENTWURF_VIDEO_CARDS_PRESET,
  VIDEO_BACKGROUND_CARDS_PRESET,
  ABLAUF_STEPS_PRESET,
} from "@/constants/contentCardPresets";
import { SectionHeader } from "@/components/sections";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";
import CheckoutProgress from "@/app/warenkorb/components/CheckoutProgress";

export default function EntwurfClient() {
  // Get materialien content for testing the new overlay-text layout
  const materialienContent = getContentByCategory("materialien");

  // Get video background cards using PRESET (recommended approach)
  const videoBackgroundCards = VIDEO_BACKGROUND_CARDS_PRESET.cards;

  // Get entwurf video cards using PRESET (recommended approach)
  const entwurfVideoCards = ENTWURF_VIDEO_CARDS_PRESET.cards;

  // State for ablauf steps progress
  const [currentAblaufStep, setCurrentAblaufStep] = useState(0);

  // Extract step titles from ABLAUF_STEPS_PRESET
  const ablaufStepTitles = ABLAUF_STEPS_PRESET.cards.map((card) => card.title);

  return (
    <div
      className="w-full bg-white"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      {/* Hero Section - Simple image with SectionHeader on top */}
      <section className="w-full">
        <div className="relative w-full h-[50vh] md:h-[60vh]">
          {/* Background Image */}
          <HybridBlobImage
            path={IMAGES.function.nestHausLinienplanDreier}
            mobilePath={IMAGES.function.nestHausLinienplanDreier}
            alt="Dein Entwurf"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-start justify-center pt-12">
            <SectionHeader
              title="Dein Entwurf"
              subtitle="Architektur fühlen, statt nur sehen."
              titleClassName="text-white"
              subtitleClassName="text-white"
            />
          </div>

          {/* Mobile Buttons - Positioned at bottom */}
          <div className="absolute bottom-16 left-0 right-0 flex gap-4 justify-center px-4 sm:px-6 md:hidden">
            <Link href="/nest-system">
              <Button variant="primary" size="xs">
                Nest System
              </Button>
            </Link>
            <Link href="/konfigurator">
              <Button variant="landing-secondary" size="xs">
                Jetzt bauen
              </Button>
            </Link>
          </div>

          {/* Desktop Buttons - Positioned at bottom */}
          <div className="absolute bottom-16 lg:bottom-16 xl:bottom-16 2xl:bottom-16 left-0 right-0 gap-4 justify-center px-4 sm:px-6 lg:px-8 hidden md:flex">
            <Link href="/nest-system">
              <Button variant="primary" size="xs">
                Nest System
              </Button>
            </Link>
            <Link href="/konfigurator">
              <Button variant="landing-secondary" size="xs">
                Jetzt bauen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Grundrissplan Card - No Padding (TALL CARD) */}
      <section className="w-full py-8 md:py-16 bg-white">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
          <SectionHeader
            title="Dein ®Nest System"
            subtitle="Individualisiert, wo es Freiheit braucht. Standardisiert, wo es Effizienz schafft."
            titleClassName="text-black"
            subtitleClassName="text-black"
            wrapperMargin="mb-12"
          />
        </div>

        <UnifiedContentCard
          {...TALL_CARD_PROPS}
          noPadding={true}
          customData={[
            {
              id: 1,
              title: "Der Auftakt",
              subtitle: "",
              description:
                "Dein Nest entsteht schnell, doch Individualität steht immer an erster Stelle. Mit deiner ersten Anzahlung erhältst du rechtliche Sicherheit und Klarheit darüber, ob dein Grundstück geeignet ist. Anschließend erstellen wir einen Vorentwurf, der deine Idee greifbar macht.\n\nDu entscheidest, ob du dein Zuhause bereits konfigurieren möchtest, um ein Gefühl für die Kosten zu bekommen, oder ob du ohne Konfiguration fortfährst. In beiden Fällen zahlst du nur für die rechtliche Prüfung und den Vorentwurf.",
              image: IMAGES.function.nestHausEntwurfVorentwurf,
              backgroundColor: "#F4F4F4",
              buttons: [
                {
                  text: "Vorentwurf kaufen",
                  variant: "primary",
                  size: "xs",
                  link: "/kontakt",
                },
                {
                  text: "Unsere Technik",
                  variant: "landing-secondary-blue",
                  size: "xs",
                  link: "/nest-system",
                },
              ],
            },
          ]}
        />
      </section>

      {/* NEW: Entwurf Video Cards - Mixed Media Section */}
      <section className="w-full py-8 md:py-16 bg-white">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
          <SectionHeader
            title="Dein ®Nest System"
            subtitle="Individualisiert, wo es Freiheit braucht. Standardisiert, wo es Effizienz schafft."
            titleClassName="text-black"
            subtitleClassName="text-black"
            wrapperMargin="mb-12"
          />
        </div>
        <UnifiedContentCard
          layout="overlay-text"
          style="standard"
          variant="responsive"
          maxWidth={true}
          showInstructions={true}
          noPadding={true}
          customData={entwurfVideoCards}
        />
      </section>

      {/* Grundstück Card - With Padding (TALL CARD) */}
      <section className="w-full py-8 md:py-16 bg-white">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
          <SectionHeader
            title="Dein ®Nest System"
            subtitle="Individualisiert, wo es Freiheit braucht. Standardisiert, wo es Effizienz schafft."
            titleClassName="text-black"
            subtitleClassName="text-black"
            wrapperMargin="mb-12"
          />
        </div>
        <UnifiedContentCard
          {...TALL_CARD_PROPS_WITH_PADDING}
          noPadding={true}
          customData={[
            {
              id: 2,
              title: "Die Basis",
              subtitle: "",
              description:
                "Mit dem Grundstückscheck, der Teil deiner ersten Anzahlung ist, erhältst du sofort rechtliche Sicherheit. Wir prüfen alle relevanten Grundlagen, damit dein Bauvorhaben auf festen Boden gestellt ist. \n\n Dabei analysieren wir, ob dein Grundstück den Vorgaben des Landesbaugesetzes, des Raumordnungsgesetzes und den örtlichen Bestimmungen entspricht.Zusätzlich prüfen wir, ob alle Voraussetzungen für den Aufbau deines Nest Hauses erfüllt sind.So kannst du von Anfang an mit Sicherheit planen.",
              image: IMAGES.function.nestHausEntwurfVorentwurf,
              backgroundColor: "#F4F4F4",
              buttons: [
                {
                  text: "Unsere Philosophie",
                  variant: "primary",
                  size: "xs",
                  link: "/kontakt",
                },
                {
                  text: "Wie funktionierts?",
                  variant: "landing-secondary-blue",
                  size: "xs",
                  link: "/nest-system",
                },
              ],
            },
          ]}
        />
      </section>

      <section id="ablauf" className="w-full py-8 md:py-16 bg-white">
        <SectionHeader
          title="So läuft's ab"
          subtitle="Dein Weg zum Nest-Haus"
          wrapperMargin="mb-8"
        />

        {/* Progress Bar */}
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 mb-12">
          <CheckoutProgress
            steps={ablaufStepTitles}
            stepIndex={currentAblaufStep}
          />
        </div>

        {/* UnifiedContentCard with text-icon layout, preset data and buttons */}
        <UnifiedContentCard
          layout="text-icon"
          style="standard"
          variant="responsive"
          maxWidth={false}
          showInstructions={false}
          customData={ABLAUF_STEPS_PRESET.cards}
          buttons={ABLAUF_STEPS_PRESET.buttons}
          enableLightbox={false}
          onCardClick={(index) => setCurrentAblaufStep(index)}
        />
      </section>

      <Footer />
    </div>
  );
}
