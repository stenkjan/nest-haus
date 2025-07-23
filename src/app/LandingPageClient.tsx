"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";
import { SectionRouter } from "@/components/SectionRouter";
import { useDeviceDetect } from "@/hooks";

// Define sections for landing page
const sections = [
  { id: "section1", title: "Dein Nest Haus", slug: "dein-nest-haus" },
  { id: "section2", title: "Wohnen ohne Grenzen", slug: "wohnen-ohne-grenzen" },
  { id: "section3", title: "Zuhause für Ideen", slug: "zuhause-fuer-ideen" },
  { id: "section4", title: "Wohnen neu gedacht", slug: "wohnen-neu-gedacht" },
  {
    id: "section5",
    title: "Mehr als vier Wände",
    slug: "mehr-als-vier-waende",
  },
  {
    id: "section6",
    title: "Gestaltung für Visionen",
    slug: "gestaltung-fuer-visionen",
  },
  { id: "section7", title: "Raum für Ideen", slug: "raum-fuer-ideen" },
  { id: "section8", title: "Design im Freistil", slug: "design-im-freistil" },
];

// Helper function to get mobile image path
const getMobileImagePath = (section: { imagePath: string }): string => {
  // Map desktop image paths to mobile versions
  const mobileMapping: { [key: string]: string } = {
    [IMAGES.hero.nestHaus1]: IMAGES.hero.mobile.nestHaus1,
    [IMAGES.hero.nestHaus2]: IMAGES.hero.mobile.nestHaus2,
    [IMAGES.hero.nestHaus3]: IMAGES.hero.mobile.nestHaus3,
    [IMAGES.hero.nestHaus4]: IMAGES.hero.mobile.nestHaus4,
    [IMAGES.hero.nestHaus5]: IMAGES.hero.mobile.nestHaus5,
    [IMAGES.hero.nestHaus6]: IMAGES.hero.mobile.nestHaus6,
    [IMAGES.hero.nestHaus7]: IMAGES.hero.mobile.nestHaus7,
    [IMAGES.hero.nestHaus8]: IMAGES.hero.mobile.nestHaus8,
  };

  return mobileMapping[section.imagePath] || section.imagePath;
};

// Sample content for the 8 sections - using IMAGES constants
const sectionsContent = [
  {
    id: 1,
    sectionId: "section1",
    imagePath: IMAGES.hero.nestHaus1,
    h1: "Dein Nest Haus",
    h3: "Die Welt ist dein Zuhause",
    button1: "Entdecken",
    button2: "Jetzt bauen",
    secondaryButtonVariant: "landing-secondary" as const,
  },
  {
    id: 2,
    sectionId: "section2",
    imagePath: IMAGES.hero.nestHaus2,
    h1: "Wohnen ohne Grenzen",
    h3: "Ein Haus das mit dir geht",
    button1: "Entdecken",
    button2: "Jetzt bauen",
    secondaryButtonVariant: "landing-secondary-blue" as const,
  },
  {
    id: 3,
    sectionId: "section3",
    imagePath: IMAGES.hero.nestHaus3,
    h1: "Ein Zuhause für Ideen",
    h3: "Visionen brauchen Räume",
    button1: "Entdecken",
    button2: "Jetzt bauen",
    secondaryButtonVariant: "landing-secondary" as const,
  },
  {
    id: 4,
    sectionId: "section4",
    imagePath: IMAGES.hero.nestHaus4,
    h1: "Wohnen neu gedacht",
    h3: "Individualität. Design. Flexibilität.",
    button1: "Entdecken",
    button2: "Jetzt bauen",
    secondaryButtonVariant: "landing-secondary" as const,
  },
  {
    id: 5,
    sectionId: "section5",
    imagePath: IMAGES.hero.nestHaus5,
    h1: "Mehr als nur vier Wände",
    h3: "Mit Nest bleibt kein Ort unerreichbar",
    button1: "Entdecken",
    button2: "Jetzt bauen",
    secondaryButtonVariant: "landing-secondary-blue" as const,
  },
  {
    id: 6,
    sectionId: "section6",
    imagePath: IMAGES.hero.nestHaus6,
    h1: "Gestaltung für Visionen",
    h3: "neue Wege. Neue Räume.",
    button1: "Entdecken",
    button2: "Jetzt bauen",
    secondaryButtonVariant: "landing-secondary" as const,
  },
  {
    id: 7,
    sectionId: "section7",
    imagePath: IMAGES.hero.nestHaus7,
    h1: "Raum für deine Ideen",
    h3: "Dein Stil. Dein Zuhause.",
    button1: "Entdecken",
    button2: "Jetzt bauen",
    secondaryButtonVariant: "landing-secondary-blue" as const,
  },
  {
    id: 8,
    sectionId: "section8",
    imagePath: IMAGES.hero.nestHaus8,
    h1: "Dein Design im Freistil",
    h3: "So individuell wie du",
    button1: "Entdecken",
    button2: "Jetzt bauen",
    secondaryButtonVariant: "landing-secondary-blue" as const,
  },
];

export default function LandingPageClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("section1");
  const { isMobile: _isMobile } = useDeviceDetect();

  // Landing page specific image styling - applies to all 8 images
  const landingImageStyle = {
    objectPosition: "center center",
    transform: "scale(1.05)",
    transformOrigin: "center center",
  };

  return (
    <div
      className="w-full bg-white"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {sectionsContent.map((section) => (
          <section
            key={section.id}
            id={section.sectionId}
            className="relative w-full overflow-hidden"
            style={{
              marginBottom: section.id !== sectionsContent.length ? "1vh" : "0",
            }}
          >
            {/* Desktop image container - 16:9 aspect ratio */}
            <div
              className="hidden md:block relative w-full h-full"
              style={{ aspectRatio: "16/9" }}
            >
              <HybridBlobImage
                path={section.imagePath}
                alt={`${section.h1} - NEST-Haus modulare Häuser Ansicht ${section.id}`}
                fill
                className="object-cover"
                style={landingImageStyle}
                strategy={section.id <= 2 ? "ssr" : "client"}
                isAboveFold={section.id <= 3}
                isCritical={section.id <= 2}
                priority={section.id <= 3}
                enableMobileDetection={false}
                sizes="100vw"
                quality={90}
                unoptimized={true}
              />

              {/* Desktop Content Overlay */}
              <div
                className={`absolute inset-0 z-20 flex flex-col items-center justify-start pt-[5vh] ${section.id === 2 ? "px-0" : "px-8"}`}
              >
                <div className="text-center">
                  <h1 className="font-bold text-white text-5xl lg:text-6xl xl:text-7xl mb-1 lg:mb-1.5">
                    {section.h1}
                  </h1>
                  <h3 className="text-white text-xl lg:text-2xl xl:text-3xl mb-4 lg:mb-5">
                    {section.h3}
                  </h3>
                </div>

                <div className="flex gap-4">
                  <Button variant="landing-primary" size="xs">
                    {section.button1}
                  </Button>
                  <Button variant={section.secondaryButtonVariant} size="xs">
                    {section.button2}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile image container - natural aspect ratio */}
            <div className="block md:hidden relative w-full">
              <HybridBlobImage
                path={getMobileImagePath(section)}
                alt={`${section.h1} - NEST-Haus modulare Häuser Mobile Ansicht ${section.id}`}
                width={0}
                height={0}
                className="w-full h-auto object-cover"
                style={{
                  ...landingImageStyle,
                  position: "relative",
                  width: "100%",
                  height: "auto",
                }}
                strategy={section.id <= 2 ? "ssr" : "client"}
                isAboveFold={section.id <= 3}
                isCritical={section.id <= 2}
                priority={section.id <= 3}
                enableMobileDetection={false}
                sizes="100vw"
                quality={90}
                unoptimized={true}
              />

              {/* Mobile Content Overlay */}
              <div
                className={`absolute inset-0 z-20 flex flex-col items-center justify-start pt-[5vh] ${section.id === 2 ? "px-0" : "px-8"}`}
              >
                <div className="text-center">
                  <h1 className="font-bold text-white text-3xl sm:text-4xl md:text-5xl mb-1">
                    {section.h1}
                  </h1>
                  <h3 className="text-white text-lg sm:text-xl mb-4">
                    {section.h3}
                  </h3>
                </div>

                <div className="flex gap-4">
                  <Button variant="landing-primary" size="xs">
                    {section.button1}
                  </Button>
                  <Button variant={section.secondaryButtonVariant} size="xs">
                    {section.button2}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ))}
      </SectionRouter>
    </div>
  );
}
