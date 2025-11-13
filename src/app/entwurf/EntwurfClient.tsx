"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui";
import { UnifiedContentCard } from "@/components/cards";
import {
  TALL_CARD_PROPS,
  TALL_CARD_PROPS_WITH_PADDING,
} from "@/constants/cardContent";
import {
  ENTWURF_VIDEO_CARDS_PRESET,
  ABLAUF_STEPS_PRESET,
} from "@/constants/contentCardPresets";
import { SectionHeader } from "@/components/sections";
import FAQSection from "@/components/sections/FAQSection";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";
import { SectionRouter } from "@/components/SectionRouter";

// Define sections for entwurf page
const sections = [
  {
    id: "hero",
    title: "Entwurf & Grundstücks-Check",
    slug: "hero",
  },
  {
    id: "vorentwurf",
    title: "Aller Anfang ist schwer?",
    slug: "vorentwurf",
  },
  {
    id: "beispiele",
    title: "Beispiele",
    slug: "beispiele",
  },
  {
    id: "grundstueckscheck",
    title: "Dein Grundstücks-Check",
    slug: "grundstueckscheck",
  },
  {
    id: "anleitung",
    title: "Step by Step nach Hause",
    slug: "anleitung",
  },
  {
    id: "faq",
    title: "FAQ",
    slug: "faq",
  },
];

export default function EntwurfClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("hero");
  // Get entwurf video cards using PRESET (recommended approach)
  const entwurfVideoCards = ENTWURF_VIDEO_CARDS_PRESET.cards;

  return (
    <div
      className="w-full bg-white"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Hero Section - Simple image with SectionHeader on top */}
        <section id="hero" className="w-full">
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
                title="Entwurf & Grundstücks-Check"
                subtitle="Starte dein Bauvorhaben mit Rechtssicherheit."
                titleClassName="text-white"
                subtitleClassName="text-white"
              />
            </div>

            {/* Mobile Buttons - Positioned at bottom */}
            <div className="absolute bottom-16 left-0 right-0 flex gap-4 justify-center px-4 sm:px-6 md:hidden">
              <Link href="/nest-system">
                <Button variant="primary" size="xs">
                  Vorentwurf sichern
                </Button>
              </Link>
              <Link href="/konfigurator">
                <Button variant="landing-secondary" size="xs">
                  Termin vereinbaren
                </Button>
              </Link>
            </div>

            {/* Desktop Buttons - Positioned at bottom */}
            <div className="absolute bottom-16 lg:bottom-16 xl:bottom-16 2xl:bottom-16 left-0 right-0 gap-4 justify-center px-4 sm:px-6 lg:px-8 hidden md:flex">
              <Link href="/nest-system">
                <Button variant="primary" size="xs">
                  Vorentwurf sichern
                </Button>
              </Link>
              <Link href="/konfigurator">
                <Button variant="landing-secondary" size="xs">
                  Termin vereinbaren
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Grundrissplan Card - No Padding (TALL CARD) */}
        <section id="vorentwurf" className="w-full py-8 md:py-16 bg-white">
          <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
            <SectionHeader
              title="Aller Anfang ist schwer?"
              subtitle="Nicht mit Nest! Entdecke wie du noch heute in dein Bauvorhaben startest"
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
                title: "Der Entwurf",
                subtitle: "",
                description:
                  "<span class='text-nest-gray'>Dein Nest entsteht schnell, doch </span><span class='text-black font-medium'>Individualität</span><span class='text-nest-gray'> steht immer </span><span class='text-black font-medium'>an erster Stelle.</span><span class='text-nest-gray'> Mit deiner </span><span class='text-black font-medium'>ersten Anzahlung</span><span class='text-nest-gray'> erhältst du </span><span class='text-black font-medium'>rechtliche Sicherheit</span><span class='text-nest-gray'> und Klarheit darüber, ob dein Grundstück geeignet ist. Anschließend erstellen wir einen </span><span class='text-black font-medium'>Vorentwurf,</span><span class='text-nest-gray'> der deine Idee greifbar macht.</span>\n\n<span class='text-nest-gray'>Du entscheidest, ob du dein Zuhause bereits konfigurieren möchtest, um ein Gefühl für die Kosten zu bekommen, oder ob du ohne Konfiguration fortfährst. In beiden Fällen zahlst du nur für die </span><span class='text-black font-medium'>rechtliche Prüfung und Vorentwurf.</span>",
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

        {/* Video Examples Section */}
        <section id="beispiele" className="w-full bg-white">
          <UnifiedContentCard
            layout="overlay-text"
            style="standard"
            variant="responsive"
            maxWidth={false}
            showInstructions={false}
            noPadding={true}
            alignment="left"
            customData={entwurfVideoCards}
          />
        </section>

        {/* Grundstück Card - With Padding (TALL CARD) */}
        <section
          id="grundstueckscheck"
          className="w-full py-8 md:py-16 bg-white"
        >
          <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
            <SectionHeader
              title="Dein Grundstücks-Check"
              subtitle="Der erste Schritt für jedes Bauvorhaben."
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
                title: "Rahmenbedingungen",
                subtitle: "",
                description:
                  "<span class='text-nest-gray'>Mit dem Grundstückscheck, der </span><span class='text-black font-medium'>Teil deiner ersten Anzahlung</span><span class='text-nest-gray'> ist, erhältst du sofort </span><span class='text-black font-medium'>rechtliche Sicherheit.</span><span class='text-nest-gray'> Wir prüfen, ob dein Grundstück die </span><span class='text-black font-medium'>gesetzlichen Anforderungen</span><span class='text-nest-gray'> erfüllt. Dazu gehören das jeweilige </span><span class='text-black font-medium'>Landesbaugesetz,</span><span class='text-nest-gray'> das </span><span class='text-black font-medium'>Raumordnungsgesetz</span><span class='text-nest-gray'> und die </span><span class='text-black font-medium'>örtlichen Vorschriften</span><span class='text-nest-gray'>, damit dein Bauvorhaben von Beginn an </span><span class='text-black font-medium'>auf sicheren Grundlagen</span><span class='text-nest-gray'> steht.</span>\n\n<span class='text-nest-gray'>Diese </span><span class='text-black font-medium'>Leistungen bleiben dir erhalten,</span><span class='text-nest-gray'> auch wenn du dich gegen den Bau deines Hauses mit Nest entscheiden solltest.*</span>",
                image: IMAGES.function.nestHausGrundstueckCheck,
                backgroundColor: "#F4F4F4",
                buttons: [
                  {
                    text: "Entwurf und Check erwerben",
                    variant: "primary",
                    size: "xs",
                    link: "/kontakt",
                  },
                ],
              },
            ]}
          />
        </section>

        <section id="anleitung" className="w-full py-8 md:py-16 bg-white">
          <SectionHeader
            title="Step by Step nach Hause"
            subtitle="So gehts nach dem ersten schritt weiter"
            wrapperMargin="mb-12"
          />

          {/* UnifiedContentCard with text-icon layout and integrated progress bar */}
          <UnifiedContentCard
            layout="text-icon"
            style="standard"
            variant="responsive"
            maxWidth={false}
            showInstructions={false}
            showProgress={true}
            customData={ABLAUF_STEPS_PRESET.cards}
            buttons={ABLAUF_STEPS_PRESET.buttons}
            enableLightbox={false}
          />
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full">
          <FAQSection />
        </section>
        <div className="h-16"></div>
      </SectionRouter>

      <Footer />
    </div>
  );
}
