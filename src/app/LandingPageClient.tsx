"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ResponsiveHybridImage } from "@/components/images";
import { IMAGES } from "@/constants/images";
import { SectionRouter } from "@/components/SectionRouter";
import { useDeviceDetect } from "@/hooks";
import Footer from "@/components/Footer";

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
    h1: "Dein ®Nest Haus",
    h3: "Dein Stil. Dein Zuhause.",
    button1: "Entdecken",
    button2: "Jetzt bauen",
    secondaryButtonVariant: "landing-secondary" as const,
  },
  {
    id: 2,
    sectionId: "section2",
    imagePath: IMAGES.hero.nestHaus2,
    h1: "Wohnen ohne Grenzen",
    h3: "Wo Effizienz auf Architektur trifft.",
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
    secondaryButtonVariant: "landing-secondary-blue" as const,
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
    secondaryButtonVariant: "landing-secondary" as const,
  },
  {
    id: 6,
    sectionId: "section6",
    imagePath: IMAGES.hero.nestHaus6,
    h1: "Gestaltung für Visionen",
    h3: "Neue Wege. Neue Räume.",
    button1: "Entdecken",
    button2: "Jetzt bauen",
    secondaryButtonVariant: "landing-secondary-blue" as const,
  },
  {
    id: 7,
    sectionId: "section7",
    imagePath: IMAGES.hero.nestHaus7,
    h1: "Raum für deine Ideen",
    h3: "Dein Stil. Dein Zuhause.",
    button1: "Entdecken",
    button2: "Jetzt bauen",
    secondaryButtonVariant: "landing-secondary" as const,
  },
  {
    id: 8,
    sectionId: "section8",
    imagePath: IMAGES.hero.nestHaus8,
    h1: "Dein Design im Freistil",
    h3: "So individuell wie du",
    button1: "Entdecken",
    button2: "Jetzt bauen",
    secondaryButtonVariant: "landing-secondary" as const,
  },
];

export default function LandingPageClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("section1");
  const { isMobile } = useDeviceDetect();

  // Landing page specific image styling - applies to all 8 images
  const landingImageStyle = {
    objectPosition: "center center",
    objectFit: "contain" as const,
  };

  // Get responsive button variant for section 3
  const getSecondaryButtonVariant = (sectionId: number) => {
    if (sectionId === 3) {
      return isMobile ? "landing-secondary" : "landing-secondary-blue";
    }
    return sectionsContent[sectionId - 1].secondaryButtonVariant;
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
            {/* PERFORMANCE FIX: Single responsive image container with proper overlay positioning */}
            <div className="relative w-full">
              <ResponsiveHybridImage
                desktopPath={section.imagePath}
                mobilePath={getMobileImagePath(section)}
                alt={`${section.h1} - NEST-Haus modulare Häuser Ansicht ${section.id}`}
                style={landingImageStyle}
                strategy={section.id <= 2 ? "ssr" : "client"}
                isAboveFold={section.id <= 3}
                isCritical={section.id <= 2}
                priority={section.id <= 3}
                sizes="100vw"
                quality={90}
                unoptimized={true}
                breakpoint={768}
                // Aspect ratio configuration
                desktopAspectRatio="16/9" // Desktop: landscape 16:9
                useMobileNaturalRatio={true} // Mobile: natural vertical ratio
              />

              {/* Content Overlay - responsive for both mobile and desktop */}
              <div
                className={`absolute inset-0 z-20 flex flex-col items-center ${
                  // Desktop: section 4 has buttons at bottom, others at top
                  // Mobile: sections 3, 4, 6, 7 have buttons at bottom
                  section.id === 4
                    ? "justify-between pt-[5vh] pb-[5vh]" // Section 4: always bottom on both mobile and desktop
                    : section.id === 3 || section.id === 6 || section.id === 7
                      ? "justify-start pt-[5vh] md:justify-start md:pt-[5vh] max-md:justify-between max-md:pt-[5vh] max-md:pb-[5vh]" // Sections 3,6,7: bottom on mobile only
                      : "justify-start pt-[5vh]" // Other sections: always top
                } ${section.id === 2 ? "px-0" : "px-8"}`}
              >
                <div className="text-center">
                  <h1
                    className={`h1-primary ${
                      section.id === 2
                        ? "text-[#605047]"
                        : section.id === 7
                          ? "text-[#605047] md:text-white"
                          : "text-white"
                    } ${
                      section.id === 3 || section.id === 6 || section.id === 7
                        ? "drop-shadow-lg"
                        : ""
                    }`}
                  >
                    {section.h1}
                  </h1>
                  <h3
                    className={`h3-primary ${
                      section.id === 2
                        ? "text-[#605047]"
                        : section.id === 7
                          ? "text-[#605047] md:text-white"
                          : "text-white"
                    } ${
                      section.id === 3 || section.id === 6 || section.id === 7
                        ? "drop-shadow-lg"
                        : ""
                    }`}
                  >
                    {section.h3}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Link href="/entdecken">
                    <Button
                      variant="landing-primary"
                      size="xs"
                      className="w-full"
                    >
                      {section.button1}
                    </Button>
                  </Link>
                  <Link href="/konfigurator">
                    <Button
                      variant={getSecondaryButtonVariant(section.id)}
                      size="xs"
                      className="w-full"
                    >
                      {section.button2}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </SectionRouter>
      <Footer />
    </div>
  );
}
