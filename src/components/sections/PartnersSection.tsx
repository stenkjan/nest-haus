import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { HybridBlobImage } from "@/components/images";

/**
 * PartnersSection Component
 *
 * Displays partner logos in a responsive grid with action buttons.
 * Layout matches FAQSection: title and buttons on left, partner boxes on right (desktop).
 * This is a fully self-contained component with title, subtitle, partners and buttons.
 *
 * Usage:
 * - Just render <PartnersSection /> - everything is included
 */

interface Partner {
  id: string;
  name: string;
  path: string;
  description: string;
}

const partners: Partner[] = [
  {
    id: "tu-graz",
    name: "Technische Universität Graz",
    path: "60-NEST-Haus-Partner-Kooperation-Technische-Universitaet-Graz-TU-Graz",
    description: "Förderung und Entwicklung",
  },
  {
    id: "engelsmann-peters",
    name: "Engelsmann und Peters",
    path: "61-NEST-Haus-Partner-Kooperation-Engelsmann-Peters-Professor-TU-Graz-Stefan-Peters",
    description: "Statische Entwicklung",
  },
  {
    id: "tu-iam",
    name: "Institut für Digitalisierung",
    path: "62-NEST-Haus-Partner-Kooperation-Technische-Universitaet-Graz-TU-Graz-IAM-Institut",
    description: "Forschung und Entwicklung",
  },
  {
    id: "tu-bauphysik",
    name: "Labor für Bauphysik",
    path: "63-NEST-Haus-Partner-Kooperation-Technische-Universitaet-Graz-TU-Graz-Labor-Bauphysik",
    description: "LFB TU Graz Forschung",
  },
  {
    id: "schwarz",
    name: "Schwarz & Peter",
    path: "64-NEST-Haus-Partner-Kooperation-Schwarz-Partner-Patentanwaelte",
    description: "Patentanwälte",
  },
  {
    id: "sobitsch",
    name: "Sobitsch Bau GmbH",
    path: "65-NEST-Haus-Partner-Kooperation-Sobitsch-Zimmerer-Zimmerermeisterbetrieb-Holzbaumeister-Innenausbau",
    description: "Zimmermann",
  },
];

interface PartnersSectionProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function PartnersSection({ className = "" }: PartnersSectionProps) {
  return (
    <section className={`w-full py-8 md:py-16 bg-[#f4f4f4] ${className}`}>
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-12 lg:px-12">
        {/* Mobile/Tablet Layout (< 1024px) - Stacked */}
        <div className="lg:hidden">
          {/* Header Section */}
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="h2-title text-black mb-3 md:mb-4">
              Gemeinsam mit starken Partnern.
            </h2>
            <p className="p-primary text-gray-700">
              Wir setzen auf ein Netzwerk aus erfahrenen Experten
            </p>
          </div>

          {/* Partner Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {partners.map((partner) => (
              <div key={partner.id} className="flex flex-col items-center">
                {/* Square container wrapper */}
                <div className="w-full aspect-square mb-3 bg-white rounded-3xl p-4 md:p-6 flex items-center justify-center">
                  {/* Image constrained to fit within padding */}
                  <div className="w-full h-full flex items-center justify-center">
                    <HybridBlobImage
                      path={partner.path}
                      alt={partner.name}
                      strategy="auto"
                      isAboveFold={false}
                      isCritical={false}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      quality={85}
                    />
                  </div>
                </div>
                <p className="p-primary-small text-gray-700 text-center mb-1">
                  {partner.name}
                </p>
                {partner.description && (
                  <p className="p-primary-small2 text-gray-700 text-center">
                    {partner.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Buttons at the bottom */}
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
        </div>

        {/* Desktop Layout (>= 1024px) - Side by Side */}
        <div className="hidden lg:flex lg:gap-12 xl:gap-16">
          {/* Left Column - Title and Buttons */}
          <div className="lg:w-1/3 xl:w-1/4 flex flex-col justify-between">
            {/* Title at top */}
            <div className="max-w-[300px] pr-8">
              <h2 className="h2-title text-black mb-3 md:mb-4">
                Gemeinsam mit starken Partnern.
              </h2>
              <p className="p-primary text-black">
                Wir setzen auf ein Netzwerk aus erfahrenen Experten
              </p>
            </div>

            {/* Buttons at bottom */}
            <div className="mt-8 flex flex-col gap-4">
              <Link href="/warum-wir">
                <Button variant="primary" size="xs">
                  Melde dich!
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Partner Logo Boxes */}
          <div className="lg:flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {partners.map((partner) => (
                <div key={partner.id} className="flex flex-col items-center">
                  {/* Square container wrapper */}
                  <div className="w-full aspect-square mb-3 bg-white rounded-3xl p-4 md:p-6 flex items-center justify-center">
                    {/* Image constrained to fit within padding */}
                    <div className="w-full h-full flex items-center justify-center">
                      <HybridBlobImage
                        path={partner.path}
                        alt={partner.name}
                        strategy="auto"
                        isAboveFold={false}
                        isCritical={false}
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        quality={85}
                      />
                    </div>
                  </div>
                  <p className="p-primary-small text-black text-center">
                    {partner.name}
                  </p>
                  {partner.description && (
                    <p className="p-primary-small2 text-gray-400 text-center">
                      {partner.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
