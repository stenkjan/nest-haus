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

// Define sections for konzept-check page
const sections = [
  {
    id: "hero",
    title: "Konzept-Check & Grundstücks-Check",
    slug: "hero",
  },
  {
    id: "konzept-check",
    title: "Aller Anfang ist schwer?",
    slug: "konzept-check",
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

export default function KonzeptcheckClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("hero");
  // Get konzept-check video cards using PRESET (recommended approach)
  const konzeptcheckVideoCards = ENTWURF_VIDEO_CARDS_PRESET.cards;

  return (
    <div
      className="w-full bg-white"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Hero Section - Simple image with SectionHeader on top */}
        <section id="hero" className="w-full">
          <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] 2xl:h-[900px]">
            {/* Background Image */}
            <HybridBlobImage
              path={IMAGES.function.nestHausLinienplanDreier}
              mobilePath={IMAGES.function.nestHausLinienplanDreier}
              alt="Der Konzept-Check"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Content Overlay - Using Flexbox */}
            <div className="relative h-full flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
              {/* Header at Top */}
              <div className="flex justify-center">
                <SectionHeader
                  title="Der Konzept-Check"
                  subtitle="Deine optimale Entscheidungsgrundlage."
                  titleClassName="text-white"
                  subtitleClassName="text-white"
                />
              </div>

              {/* Buttons at Bottom */}
              <div className="flex gap-4 justify-center">
                <Link href="/konfigurator">
                  <Button variant="primary" size="xs">
                    Konfigurator
                  </Button>
                </Link>
                <Link href="/kontakt">
                  <Button variant="landing-secondary" size="xs">
                    Termin vereinbaren
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Grundrissplan Card - No Padding (TALL CARD) */}
        <section id="konzept-check" className="w-full py-8 md:py-16 bg-white">
          <SectionHeader
            title="Der Grundstücks-Check"
            subtitle="Starte dein Bauvorhaben mit Rechtssicherheit"
            mobileTitle="Der Konzept-Check"
            wrapperMargin="mb-8 md:mb-12"
          />

          <UnifiedContentCard
            {...TALL_CARD_PROPS}
            noPadding={true}
            customData={[
              {
                id: 1,
                title: "Teil 1/2",
                subtitle: "",
                description:
                  "<span class='text-nest-gray'>Mit dem </span><span class='text-black font-medium'>Konzept-Check</span><span class='text-nest-gray'> erhältst du eine </span><span class='text-black font-medium'>Analyse deines Grundstücks</span><span class='text-nest-gray'>, welche dir einen Überblick und eine </span><span class='text-black font-medium'>rechtssichere Auskunft</span><span class='text-nest-gray'> über alle vorherrschenden </span><span class='text-black font-medium'>Vorschriften, Gesetze und Bebauungsmöglichkeiten</span><span class='text-nest-gray'> gibt. Diese Analyse ist die Grundlage für jedes Bauvorhaben und gibt dir eine klar strukturierte Übersicht über dein Baugrundstück.</span>\n\n<span class='text-nest-gray'>Solltest du dich nach dem </span><span class='text-black font-medium'>Konzept-Check</span><span class='text-nest-gray'> gegen unser Nest Haus entscheiden, dient dir diese </span><span class='text-black font-medium'>Analyse</span><span class='text-nest-gray'> auch als </span><span class='text-black font-medium'>Grundlage</span><span class='text-nest-gray'> für </span><span class='text-black font-medium'>alle anderen Bauvorhaben</span><span class='text-nest-gray'>.</span>",
                image: IMAGES.function.nestHausGrundstueckCheck,
                backgroundColor: "#F4F4F4",
                buttons: [
                  {
                    text: "Konzept-Check bestellen",
                    variant: "primary",
                    size: "xs",
                    link: "/warenkorb?mode=entwurf",
                  },
                  {
                    text: "Beratungsgespräch",
                    variant: "landing-secondary-blue",
                    size: "xs",
                    link: "/kontakt",
                  },
                ],
              },
            ]}
          />
        </section>

        {/* Video Examples Section */}
        <section id="beispiele" className="w-full pb-8 md:pb-16">
          <UnifiedContentCard
            layout="overlay-text"
            style="standard"
            variant="responsive"
            maxWidth={false}
            showInstructions={false}
            noPadding={true}
            alignment="left"
            customData={konzeptcheckVideoCards}
          />
        </section>

        {/* Grundstück Card - With Padding (TALL CARD) */}
        <section
          id="grundstueckscheck"
          className="w-full py-8 md:py-16 bg-white"
        >
          <SectionHeader
            title="Der Entwurfsplan"
            subtitle="Persönlich geplant, individuell gestaltet."
            mobileTitle="Der Grundstücks-Check"
            wrapperMargin="mb-8 md:mb-12"
          />
          <UnifiedContentCard
            {...TALL_CARD_PROPS_WITH_PADDING}
            noPadding={true}
            customData={[
              {
                id: 2,
                title: "Teil 2/2",
                subtitle: "",
                description:
                  "<span class='text-nest-gray'>Nach der Analyse deines Grundstücks erstellen wir einen </span><span class='text-black font-medium'>individuell</span><span class='text-nest-gray'> für dich </span><span class='text-black font-medium'>maßgeschneiderten Entwurfsplan</span><span class='text-nest-gray'>, der dir eine </span><span class='text-black font-medium'>konkrete Vorstellung</span><span class='text-nest-gray'> davon gibt, wie </span><span class='text-black font-medium'>dein Nest Haus</span><span class='text-nest-gray'> auf </span><span class='text-black font-medium'>deinem Grundstück</span><span class='text-nest-gray'> aussehen könnte.</span>\n\n<span class='text-nest-gray'>Unser </span><span class='text-black font-medium'>Konfigurator</span><span class='text-nest-gray'> dient dafür, dass du ein </span><span class='text-black font-medium'>Preisgefühl</span><span class='text-nest-gray'> für </span><span class='text-black font-medium'>dein Nest</span><span class='text-nest-gray'> bekommst und hilft uns dabei, Eine </span><span class='text-black font-medium'>Ausgangsbasis</span><span class='text-nest-gray'> für deinen </span><span class='text-black font-medium'>individuellen Entwurf</span><span class='text-nest-gray'> festzulegen.</span>",
                image: IMAGES.function.nestHausEntwurfVorentwurf,
                backgroundColor: "#F4F4F4",
                imagePosition: "center" as const,
                buttons: [
                  {
                    text: "Konfigurator",
                    variant: "primary",
                    size: "xs",
                    link: "/konfigurator",
                  },
                  {
                    text: "Konzept-Check bestellen",
                    variant: "landing-secondary-blue-white",
                    size: "xs",
                    link: "/warenkorb?mode=entwurf",
                  },
                ],
              },
            ]}
          />
          <p className="p-primary-small2 text-nest-gray mt-4 text-center max-w-[300px] md:max-w-[500px] mx-auto">
            *Mit dem Konzept-Check erhältst du deine Grundstücks-Analyse, deinen
            individuellen Entwurfsplan und eine konkrete Kostenplanung.
          </p>
        </section>

        <section id="anleitung" className="w-full py-8 md:py-16 bg-white">
          <SectionHeader
            title="Step by Step nach Hause"
            subtitle="So gehts nach dem ersten schritt weiter"
            mobileTitle="Step by Step <br/>nach Hause"
            wrapperMargin="mb-8 md:mb-12"
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
        <div className="h-8 md:h-16"></div>
      </SectionRouter>

      <Footer />
    </div>
  );
}
