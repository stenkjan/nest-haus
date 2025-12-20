"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ResponsiveHybridImage } from "@/components/images";
import { IMAGES } from "@/constants/images";
import { SectionRouter } from "@/components/SectionRouter";
import { useDeviceDetect } from "@/hooks";
import TwoByTwoImageGrid from "@/components/grids/TwoByTwoImageGrid";
import Footer from "@/components/Footer";
import LaunchFireworks from "@/components/effects/LaunchFireworks";

// Define sections for landing page
const sections = [
  { id: "dein-hoam-haus", title: "Dein ®Hoam", slug: "dein-hoam-haus" },
  {
    id: "design-im-freistil",
    title: "Dein Design im Freistil",
    slug: "design-im-freistil",
  },
  {
    id: "visionen-brauchen-raeume",
    title: "Visionen brauchen Räume",
    slug: "visionen-brauchen-raeume",
  },
  {
    id: "wohnen-ohne-grenzen",
    title: "Wohnen ohne Grenzen",
    slug: "wohnen-ohne-grenzen",
  },
  {
    id: "wohnen-neu-gedacht",
    title: "Wohnen neu gedacht",
    slug: "wohnen-neu-gedacht",
  },
  {
    id: "keine-lebensentscheidung",
    title: "Keine Lebensentscheidung",
    slug: "keine-lebensentscheidung",
  },
  {
    id: "hoam-entdecken",
    title: "®Hoam Entdecken",
    slug: "hoam-entdecken",
  },
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
  };

  return mobileMapping[section.imagePath] || section.imagePath;
};

// Sample content for the 6 sections - using IMAGES constants
const sectionsContent = [
  {
    id: 1,
    sectionId: "dein-hoam-haus",
    imagePath: IMAGES.hero.nestHaus1,
    h1: "®Hoam",
    h3: "Wohne wie du willst",
    modelName: "Hoam 140",
    configuration: "Fassadenplatten Weiß",
    button1: "Konzept-Check",
    button2: "Dein ®Hoam",
    secondaryButtonVariant: "landing-secondary-blue" as const, // Will be overridden by getSecondaryButtonVariant
  },
  {
    id: 2,
    sectionId: "design-im-freistil",
    imagePath: IMAGES.hero.nestHaus2,
    h1: "Dein Design im Freistil",
    h3: "So individuell wie du",
    modelName: "Hoam 100",
    configuration: "Holzlattung Lärche Natur",
    button1: "Konzept-Check",
    button2: "Dein ®Hoam",
    secondaryButtonVariant: "landing-secondary" as const,
  },
  {
    id: 3,
    sectionId: "visionen-brauchen-raeume",
    imagePath: IMAGES.hero.nestHaus3,
    h1: "Visionen brauchen Räume",
    h3: "Dein Zuhause für Ideen",
    modelName: "Belichtungspaket Bright",
    configuration: "Innenverkleidung Fichte, Steinbelag hell",
    button1: "Konzept-Check",
    button2: "Dein ®Hoam",
    secondaryButtonVariant: "landing-secondary" as const,
  },
  {
    id: 4,
    sectionId: "wohnen-ohne-grenzen",
    imagePath: IMAGES.hero.nestHaus7,
    h1: "Wohnen ohne Grenzen",
    h3: "Wo Effizienz auf Architektur trifft",
    modelName: "Hoam 140",
    configuration: "Fassadenplatten Schwarz",
    button1: "Konzept-Check",
    button2: "Dein ®Hoam",
    secondaryButtonVariant: "landing-secondary" as const,
  },
  {
    id: 5,
    sectionId: "wohnen-neu-gedacht",
    imagePath: IMAGES.hero.nestHaus6,
    h1: "Wohnen neu gedacht",
    h3: "Individualität. Design. Flexibilität.",
    modelName: "Belichtungspaket Medium",
    configuration: "Innenverkleidung Fichte, Parkett Eiche",
    button1: "Konzept-Check",
    button2: "Dein ®Hoam",
    secondaryButtonVariant: "landing-secondary" as const,
  },
  {
    id: 6,
    sectionId: "keine-lebensentscheidung",
    imagePath: IMAGES.hero.nestHaus5,
    h1: "Keine Lebensentscheidung",
    h3: "Mit ®Hoam bleibt kein Ort unerreichbar",
    modelName: "Hoam 80",
    configuration: "Trapezblech",
    button1: "Konzept-Check",
    button2: "Dein ®Hoam",
    secondaryButtonVariant: "landing-secondary" as const,
  },
];

// ImageCaption Component - Bottom-left overlay for image descriptions
interface ImageCaptionProps {
  modelName: string; // e.g., "Hoam 80"
  configuration: string; // e.g., "Holzlattung Lärche Natur"
}

const ImageCaption = ({ modelName, configuration }: ImageCaptionProps) => (
  <div className="pointer-events-none select-none">
    <p className="p-primary text-white drop-shadow-lg mb-0">{modelName}</p>
    <p className="p-primary-small text-white drop-shadow-lg">{configuration}</p>
  </div>
);

export default function LandingPageClient() {
  const [_currentSectionId, setCurrentSectionId] =
    useState<string>("dein-hoam-haus");
  const [showFireworks, setShowFireworks] = useState(false);
  const { isMobile } = useDeviceDetect();

  // Check for #launch hash to trigger fireworks easter egg
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#launch") {
      setShowFireworks(true);
      // Clear hash to avoid re-trigger on reload
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Landing page specific image styling - applies to all 8 images
  const landingImageStyle = {
    objectPosition: "center center",
    objectFit: "contain" as const,
  };

  // Get responsive button variant for sections 1, 3, and 5
  const getSecondaryButtonVariant = (sectionId: number) => {
    if (sectionId === 1) {
      return "landing-secondary-blue"; // Always blue for section 1
    }
    if (sectionId === 3) {
      return isMobile ? "landing-secondary" : "landing-secondary";
    }
    if (sectionId === 5) {
      return isMobile ? "landing-secondary" : "landing-secondary-blue";
    }
    if (sectionId === 6) {
      return "landing-secondary"; // Always white for section 6
    }
    return sectionsContent[sectionId - 1].secondaryButtonVariant;
  };

  // Utility: Text color logic for sections
  const getSectionTextColor = (sectionId: number, _isMobile: boolean) => {
    if (sectionId === 1) {
      return "text-[#605047]";
    }
    if (sectionId === 4) {
      return "text-white md:text-white";
    }
    return "text-white";
  };

  return (
    <>
      {/* Launch Fireworks Easter Egg */}
      {showFireworks && (
        <LaunchFireworks onComplete={() => setShowFireworks(false)} />
      )}

      <div
        className="w-full bg-white"
        style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
      >
        <SectionRouter
          sections={sections}
          onSectionChange={setCurrentSectionId}
        >
          {sectionsContent.map((section) => (
            <React.Fragment key={section.id}>
              <section
                id={section.sectionId}
                className="relative w-full"
                style={{
                  marginBottom:
                    section.id !== sectionsContent.length ? "1vh" : "0",
                }}
              >
                {/* PERFORMANCE FIX: Single responsive image container with proper overlay positioning */}
                <div
                  className="relative w-full select-none"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  style={{
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    userSelect: "none",
                    WebkitTouchCallout: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <ResponsiveHybridImage
                    desktopPath={section.imagePath}
                    mobilePath={getMobileImagePath(section)}
                    alt={`${section.h1} - NEST-Haus modulare Häuser Ansicht ${section.id}`}
                    style={
                      {
                        ...landingImageStyle,
                        pointerEvents: "none", // Prevents direct interaction with image
                      } as any // eslint-disable-line @typescript-eslint/no-explicit-any
                    }
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
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />

                  {/* Image Caption - Bottom Left with Padding */}
                  {section.modelName && section.configuration && (
                    <div className="hidden md:block absolute bottom-0 left-0 z-30 p-4 md:p-8">
                      <ImageCaption
                        modelName={section.modelName}
                        configuration={section.configuration}
                      />
                    </div>
                  )}

                  {/* Content Overlay - responsive for both mobile and desktop */}
                  <div
                    className={`absolute inset-0 z-20 flex flex-col items-center ${
                      // Mobile: sections 3, 4, 5 have buttons at bottom
                      section.id === 3 || section.id === 4 || section.id === 5
                        ? "justify-start pt-[5vh] md:justify-start md:pt-[5vh] max-md:justify-between max-md:pt-[5vh] max-md:pb-[5vh]" // Sections 3,4,5: bottom on mobile only
                        : "justify-start pt-[5vh]" // Other sections: always top
                    } ${section.id === 2 ? "px-0" : "px-8"}`}
                  >
                    <div className="text-center">
                      <h1
                        className={`h1-primary ${getSectionTextColor(section.id, isMobile)} ${
                          section.id === 3 ||
                          section.id === 4 ||
                          section.id === 5
                            ? "drop-shadow-lg"
                            : ""
                        }`}
                      >
                        {section.h1}
                      </h1>
                      <h3
                        className={`h3-primary ${getSectionTextColor(section.id, isMobile)} ${
                          section.id === 3 ||
                          section.id === 4 ||
                          section.id === 5
                            ? "drop-shadow-lg"
                            : ""
                        }`}
                      >
                        {section.h3}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Link href="/konzept-check">
                        <Button
                          variant="landing-primary"
                          size="xs"
                          className="w-full"
                        >
                          {section.button1}
                        </Button>
                      </Link>
                      <Link href="/dein-hoam">
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

              {/* TwoByTwoImageGrid Section - After section 3 (zuhause-fuer-ideen) */}
              {section.id === 3 && (
                <section
                  id="nest-entdecken"
                  className="relative w-full bg-white"
                  style={{
                    marginBottom: "1vh",
                  }}
                >
                  <TwoByTwoImageGrid
                    maxWidth={true}
                    customData={[
                      {
                        id: 1,
                        title: "Die Vision ®Hoam",
                        subtitle: "®Hoam mit Verantwortung",
                        description: "",
                        image: IMAGES.function.nestHausCardsTeamVisionMission,
                        backgroundColor: "#F4F4F4",
                        primaryAction: "Unsere Mission",
                        primaryLink: "/warum-wir",
                      },
                      {
                        id: 2,
                        title: "Wir bauen Freiheit",
                        subtitle: "Finde heraus was ®Hoam ausmacht",
                        description: "",
                        image:
                          IMAGES.function
                            .nestHausEntdeckenDeinNestErklaerungProdukt,
                        backgroundColor: "#F4F4F4",
                        primaryAction: "Konfigurator",
                        primaryLink: "/konfigurator",
                      },
                      {
                        id: 3,
                        title: "Konzept-Check",
                        subtitle: "Deine optimale Entscheidungsgrundlage",
                        description: "",
                        image:
                          IMAGES.function
                            .nestHausEntwurfVorentwurfCheckGrundstueckscheck,
                        backgroundColor: "#F4F4F4",
                        primaryAction: "Konzept-Check",
                        primaryLink: "/konzept-check",
                      },
                      {
                        id: 4,
                        title: "Kein Plan? Kein Problem!",
                        subtitle: "Melde dich, wir sind für dich da",
                        description: "",
                        image:
                          IMAGES.function
                            .nestHausTerminVereinbarungBuchenGespraechAnrufenEmail,
                        backgroundColor: "#F4F4F4",
                        primaryAction: "Termin sichern",
                        primaryLink: "/kontakt",
                      },
                    ]}
                    textColor="black"
                  />
                </section>
              )}
            </React.Fragment>
          ))}
        </SectionRouter>
        <div className="pb-16" />
        <Footer />
      </div>
    </>
  );
}
