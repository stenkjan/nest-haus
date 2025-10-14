import React from "react";
import { VideoCard16by9 } from "@/components/cards";
import { SectionHeader } from "@/components/sections";
import { VIDEO_CARD_PRESETS } from "@/constants/contentCardPresets";

/**
 * TransportabilitaetVideo Section Component
 *
 * Displays the transportability/technology video card with section header.
 * Shows how Nest-Haus modules can be built, moved, and passed on.
 *
 * Typography Standards:
 * - Uses SectionHeader component for consistent title/subtitle styling
 * - VideoCard16by9 uses preset typography from VIDEO_CARD_PRESETS
 *
 * See: /docs/TYPOGRAPHY_STANDARDS.md
 */

interface TransportabilitaetVideoProps {
  /**
   * Section ID for navigation
   * @default "zuhause-zieht-um"
   */
  id?: string;
  /**
   * Main section title
   * @default "Dein Zuhause zieht um"
   */
  title?: string;
  /**
   * Section subtitle
   * @default "Architektur für ein bewegtes Leben."
   */
  subtitle?: string;
  /**
   * Additional CSS classes for the section
   */
  className?: string;
  /**
   * Padding configuration
   * @default "py-8 md:py-16"
   */
  sectionPadding?: string;
  /**
   * Header margin bottom
   * @default "md:mb-12 mb-12"
   */
  headerMargin?: string;
}

export default function TransportabilitaetVideo({
  id = "zuhause-zieht-um",
  title = "Dein Zuhause zieht um",
  subtitle = "Architektur für ein bewegtes Leben.",
  className = "",
  sectionPadding = "py-8 md:py-16",
  headerMargin = "md:mb-12 mb-12",
}: TransportabilitaetVideoProps) {
  return (
    <section
      id={id}
      className={`w-full ${sectionPadding} bg-white ${className}`}
    >
      <SectionHeader
        title={title}
        subtitle={subtitle}
        wrapperMargin={headerMargin}
      />

      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <VideoCard16by9
          maxWidth={false}
          showInstructions={false}
          customData={[VIDEO_CARD_PRESETS.transportabilitaet]}
        />
      </div>
    </section>
  );
}
