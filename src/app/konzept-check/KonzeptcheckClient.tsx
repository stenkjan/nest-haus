"use client";

import React, { useState, useEffect } from "react";
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
    id: "schritte",
    title: "Inhalt des Konzept-Checks",
    slug: "schritte",
  },
  {
    id: "grundstueckscheck",
    title: "Aller Anfang ist schwer?",
    slug: "grundstueckscheck",
  },
  {
    id: "entdecken",
    title: "Beispiele",
    slug: "entdecken",
  },
  {
    id: "entwurfsplan",
    title: "Deine Grundstücksanalyse",
    slug: "entwurfsplan",
  },
  {
    id: "kostenplanung",
    title: "Kostenplanung",
    slug: "kostenplanung",
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
  const [_currentSectionId, setCurrentSectionId] = useState<string>("schritte");
  const [isMobile, setIsMobile] = useState(false);
  // Get konzept-check video cards using PRESET (recommended approach)
  const konzeptcheckVideoCards = ENTWURF_VIDEO_CARDS_PRESET.cards;

  // Mobile detection for conditional button rendering
  // CRITICAL: Must use 1024px to match UnifiedContentCard video layout button hiding
  // Video layout hides buttons at < 1024px, so mobile button must show at < 1024px
  // Using 768px causes tablets (768-1023px) to have ZERO buttons
  useEffect(() => {
    const checkDevice = () => {
      const newIsMobile = window.innerWidth < 1024;
      setIsMobile(newIsMobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <div
      className="w-full bg-white"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Hero Section - Simple image with SectionHeader on top */}
        <section id="schritte" className="w-full">
          <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] 2xl:h-[900px]">
            {/* Background Image */}
            <HybridBlobImage
              path={IMAGES.function.nestHausLinienplanDreier}
              mobilePath={IMAGES.function.mobile.nestHausLinienplanDreier}
              enableMobileDetection={true}
              alt="Konzept-Check"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Content Overlay - Using Flexbox */}
            <div className="relative h-full flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
              {/* Header at Top */}
              <div className="flex justify-center">
                <SectionHeader
                  title="Der Konzept-Check"
                  mobileTitle="Der Konzept-Check"
                  titleClassName="text-white"
                  subtitleClassName="text-white"
                />
              </div>

              {/* Button at Bottom */}
              <div className="flex justify-center">
                <Link href="/warenkorb?mode=konzept-check">
                  <Button variant="primary" size="xs">
                    Konzept-Check bestellen
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Bullets and Price Box - Below image, side by side on desktop, stacked on mobile */}
          <div className="w-full py-8 md:py-12 bg-white">
            <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Centered title above both columns */}
              <p className="p-secondary text-center">
                Mit dem Konzept-Check erhältst du
              </p>

              {/* Two columns: Bullets left, Price box right */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start justify-center">
                {/* Left side: Bullets */}
                <div className="text-black">
                  <ul className="p-secondary list-disc list-inside space-y-1 text-left">
                    <li>Grundstücksanalyse</li>
                    <li>Entwurfsplan</li>
                    <li>Kostenplanung</li>
                  </ul>
                </div>

                {/* Right side: Price Box */}
                <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden min-w-[280px] md:min-w-[320px]">
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm md:text-base lg:text-lg font-normal text-gray-900 leading-relaxed">
                          Konzept-Check
                        </div>
                        <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                          Grundstücksanalyse und Entwurfsplan
                        </div>
                      </div>
                      <div className="text-sm md:text-base lg:text-lg font-normal text-gray-900 leading-relaxed">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-gray-400 line-through">
                            3.000 €
                          </span>
                          <span className="font-medium">1.500 €</span>
                        </div>
                        <div className="text-xs text-gray-500 text-right mt-1">
                          Preise inkl. MwSt.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grundrissplan Card - With Padding (TALL CARD) */}
        <section
          id="grundstueckscheck"
          className="w-full py-8 md:py-16 bg-white"
        >
          <SectionHeader
            title="Grundstücksanalyse"
            subtitle="Starte dein Bauvorhaben mit Rechtssicherheit"
            mobileTitle="Grundstücks-Analyse"
            wrapperMargin="mb-8 md:mb-12"
          />

          <UnifiedContentCard
            {...TALL_CARD_PROPS}
            imagePadding="standard"
            noPadding={true}
            customData={[
              {
                id: 1,
                title: "Teil 1/3",
                subtitle: "",
                description:
                  "<span class='text-nest-gray'>Mit dem </span><span class='text-black font-medium'>Konzept-Check</span><span class='text-nest-gray'> erhältst du eine </span><span class='text-black font-medium'>Analyse deines Grundstücks</span><span class='text-nest-gray'>, welche dir einen Überblick und eine </span><span class='text-black font-medium'>rechtssichere Auskunft</span><span class='text-nest-gray'> über alle vorherrschenden </span><span class='text-black font-medium'>Vorschriften, Gesetze und Bebauungsmöglichkeiten</span><span class='text-nest-gray'> gibt. Diese Analyse ist die Grundlage für jedes Bauvorhaben und gibt dir eine klar strukturierte Übersicht über dein Baugrundstück.</span>\n\n<span class='text-nest-gray'>Solltest du dich nach dem </span><span class='text-black font-medium'>Konzept-Check</span><span class='text-nest-gray'> gegen Hoam entscheiden, dient dir diese </span><span class='text-black font-medium'>Analyse</span><span class='text-nest-gray'> auch als </span><span class='text-black font-medium'>Grundlage</span><span class='text-nest-gray'> für </span><span class='text-black font-medium'>alle anderen Bauvorhaben</span><span class='text-nest-gray'>.</span>",
                image: IMAGES.function.nestHausGrundstueckCheck,
                backgroundColor: "#F4F4F4",
                buttons: [
                  {
                    text: "Konzept-Check bestellen",
                    variant: "primary",
                    size: "xs",
                    link: "/warenkorb?mode=konzept-check",
                  },
                  // {
                  //   text: "Beratungsgespräch",
                  //   variant: "landing-secondary-blue",
                  //   size: "xs",
                  //   link: "/kontakt",
                  // },
                ],
              },
            ]}
          />
        </section>

        {/* Grundstück Card - With Padding (TALL CARD) */}
        <section id="entwurfsplan" className="w-full py-8 md:py-16 bg-white">
          <SectionHeader
            title="Entwurfsplan"
            subtitle="Persönlich geplant, individuell gestaltet."
            mobileTitle="Entwurfsplan"
            wrapperMargin="mb-8 md:mb-12"
          />
          <UnifiedContentCard
            {...TALL_CARD_PROPS_WITH_PADDING}
            noPadding={true}
            customData={[
              {
                id: 2,
                title: "Teil 2/3",
                subtitle: "",
                description:
                  "<span class='text-nest-gray'>Nach der Analyse deines Grundstücks erstellen wir einen </span><span class='text-black font-medium'>individuell</span><span class='text-nest-gray'> für dich </span><span class='text-black font-medium'>maßgeschneiderten Entwurfsplan</span><span class='text-nest-gray'>, der dir eine </span><span class='text-black font-medium'>konkrete Vorstellung</span><span class='text-nest-gray'> davon gibt, wie </span><span class='text-black font-medium'>®Hoam</span><span class='text-nest-gray'> auf </span><span class='text-black font-medium'>deinem Grundstück</span><span class='text-nest-gray'> aussehen könnte.</span>\n\n<span class='text-nest-gray'>Unser </span><span class='text-black font-medium'>Konfigurator</span><span class='text-nest-gray'> dient dafür, dass du ein </span><span class='text-black font-medium'>Preisgefühl</span><span class='text-nest-gray'> für </span><span class='text-black font-medium'>dein Nest</span><span class='text-nest-gray'> bekommst und hilft uns dabei, eine </span><span class='text-black font-medium'>Ausgangsbasis</span><span class='text-nest-gray'> für deinen </span><span class='text-black font-medium'>individuellen Entwurf</span><span class='text-nest-gray'> festzulegen.</span>",
                image: IMAGES.function.nestHausEntwurfVorentwurf,
                backgroundColor: "#F4F4F4",
                imagePosition: "center" as const,
                buttons: [
                  {
                    text: "Ohne Konfigurator fortfahren",
                    variant: "primary",
                    size: "xs",
                    link: "/warenkorb?mode=konzept-check",
                  },
                ],
              },
            ]}
          />

          {/* Mobile-only button underneath the card */}
          {isMobile && (
            <div className="flex justify-center mt-6">
              <Link href="/warenkorb?mode=konzept-check">
                <Button variant="primary" size="xs">
                  Ohne Konfigurator fortfahren
                </Button>
              </Link>
            </div>
          )}

          <p className="p-primary-small2 text-nest-gray mt-4 text-center max-w-[300px] md:max-w-[500px] mx-auto">
            *Mit dem Konzept-Check erhältst du deine Grundstücksanalyse, deinen
            individuellen Entwurfsplan und eine konkrete Kostenplanung.
          </p>
        </section>

        {/* Kostenplanung Section - Teil 3/3 */}
        <section id="kostenplanung" className="w-full py-8 md:py-16 bg-white">
          <SectionHeader
            title="Kostenplanung"
            subtitle="Transparenz und Verlässlichkeit"
            mobileTitle="Kostenplanung"
            wrapperMargin="mb-8 md:mb-12"
          />
          <UnifiedContentCard
            {...TALL_CARD_PROPS_WITH_PADDING}
            noPadding={true}
            customData={[
              {
                id: 3,
                title: "Teil 3/3",
                subtitle: "",
                description:
                  "<span class='text-nest-gray'>Da eine verlässliche Kostenplanung besonders wichtig ist, behalten wir die Kosten für dein Bauvorhaben jederzeit </span><span class='text-black font-medium'>transparent und nachvollziehbar</span><span class='text-nest-gray'> im Überblick.</span>\n\n<span class='text-nest-gray'>Mit dem </span><span class='text-black font-medium'>Grundstückscheck</span><span class='text-nest-gray'> und deiner </span><span class='text-black font-medium'>individuellen Entwurfsplanung</span><span class='text-nest-gray'> können wir eine </span><span class='text-black font-medium'>exakte Kostenplanung</span><span class='text-nest-gray'> für dich erstellen. So hast du den </span><span class='text-black font-medium'>Gesamtpreis stets klar im Blick</span><span class='text-nest-gray'>.</span>",
                video: IMAGES.variantvideo.twelve,
                backgroundColor: "#F4F4F4",
                imagePosition: "center" as const,
                buttons: [
                  {
                    text: "Jetzt konfigurieren",
                    variant: "primary",
                    size: "xs",
                    link: "/konfigurator",
                  },
                ],
              },
            ]}
          />

          {/* Mobile-only button underneath the card */}
          {isMobile && (
            <div className="flex justify-center mt-6">
              <Link href="/konfigurator">
                <Button variant="primary" size="xs">
                  Jetzt konfigurieren
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Video Examples Section */}
        <section id="entdecken" className="w-full pb-8 md:pb-16">
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

        <section id="anleitung" className="w-full py-8 md:py-16 bg-white">
          <SectionHeader
            title="Step by Step nach Hause"
            subtitle="So gehts nach dem ersten schritt weiter"
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
