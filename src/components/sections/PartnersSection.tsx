import React from "react";
import { Button } from "@/components/ui";
import { HybridBlobImage } from "@/components/images";
import Link from "next/link";
import { IMAGES } from "@/constants/images";

/**
 * PartnersSection Component
 *
 * Displays partner logos with consistent typography standards.
 * Uses proper responsive breakpoints and semantic HTML structure.
 *
 * Typography Standards:
 * - Title: text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold
 * - Subtitle: text-base md:text-lg lg:text-xl 2xl:text-2xl
 *
 * See: /docs/TYPOGRAPHY_STANDARDS.md
 */

interface PartnersSectionProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Background color
   * @default "white"
   */
  backgroundColor?: "white" | "black";
  /**
   * Custom title
   * @default "Gemeinsam mit starken Partnern."
   */
  title?: string;
  /**
   * Custom subtitle
   * @default "Wir setzen auf ein Netzwerk aus erfahrenen Experten"
   */
  subtitle?: string;
  /**
   * Show action buttons
   * @default true
   */
  showButtons?: boolean;
}

interface Partner {
  id: string;
  name: string;
  path: string;
}

const partners: Partner[] = [
  {
    id: "tu-graz",
    name: "TU Graz",
    path: IMAGES.partners.partner1,
  },
  {
    id: "engelsmann-peters",
    name: "Engelsmann Peters",
    path: IMAGES.partners.partner2,
  },
  {
    id: "tu-iam",
    name: "TU-IAM",
    path: IMAGES.partners.partner3,
  },
  {
    id: "tu-bauphysik",
    name: "Tu-Bauphysik",
    path: IMAGES.partners.partner4,
  },
  {
    id: "schwarz",
    name: "Schwarz",
    path: IMAGES.partners.partner5,
  },
  {
    id: "sobitsch",
    name: "Sobitsch",
    path: IMAGES.partners.partner6,
  },
];

export function PartnersSection({
  className = "",
  backgroundColor = "white",
  title = "Gemeinsam mit starken Partnern.",
  subtitle = "Wir setzen auf ein Netzwerk aus erfahrenen Experten",
  showButtons = true,
}: PartnersSectionProps) {
  const backgroundClasses =
    backgroundColor === "black" ? "bg-black" : "bg-white";

  return (
    <section
      className={`w-full py-8 md:py-16 ${backgroundClasses} ${className}`}
    >
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-0">
          <h1 className={`h1-secondary mb-2 md:mb-3`}>{title}</h1>
          <h3 className={`h3-secondary mb-8`}>{subtitle}</h3>
        </div>

        {/* Partner Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8 items-center justify-items-center">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className={`flex items-center justify-center w-full ${
                partner.id === "tu-graz"
                  ? "h-26 md:h-30 lg:h-30"
                  : "h-10 md:h-24 lg:h-28"
              }`}
            >
              <HybridBlobImage
                path={partner.path}
                alt={partner.name}
                strategy="auto"
                isAboveFold={false}
                isCritical={false}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                quality={85}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {showButtons && (
          <div className="flex flex-row gap-4 justify-center">
            <Link href="/warum-wir">
              <Button variant="primary" size="xs">
                Warum NEST?
              </Button>
            </Link>
            <Link href="/konfigurator">
              <Button variant="landing-secondary-blue" size="xs">
                Jetzt bauen
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
