import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { HybridBlobImage } from "@/components/images";
import { SectionHeader } from "./SectionHeader";

/**
 * PartnersSection Component
 *
 * Displays partner logos in a responsive grid with action buttons.
 * This is a fully self-contained component with title, subtitle, partners and buttons.
 *
 * Usage:
 * - Just render <PartnersSection /> - everything is included
 */

interface Partner {
  id: string;
  name: string;
  path: string;
}

const partners: Partner[] = [
  {
    id: "tu-graz",
    name: "TU Graz",
    path: "60-NEST-Haus-Partner-Kooperation-Technische-Universitaet-Graz-TU-Graz",
  },
  {
    id: "engelsmann-peters",
    name: "Engelsmann Peters",
    path: "61-NEST-Haus-Partner-Kooperation-Engelsmann-Peters-Professor-TU-Graz-Stefan-Peters",
  },
  {
    id: "tu-iam",
    name: "TU-IAM",
    path: "62-NEST-Haus-Partner-Kooperation-Technische-Universitaet-Graz-TU-Graz-IAM-Institut",
  },
  {
    id: "tu-bauphysik",
    name: "Tu-Bauphysik",
    path: "63-NEST-Haus-Partner-Kooperation-Technische-Universitaet-Graz-TU-Graz-Labor-Bauphysik",
  },
  {
    id: "schwarz",
    name: "Schwarz",
    path: "64-NEST-Haus-Partner-Kooperation-Schwarz-Partner-Patentanwaelte",
  },
  {
    id: "sobitsch",
    name: "Sobitsch",
    path: "65-NEST-Haus-Partner-Kooperation-Sobitsch-Zimmerer-Zimmerermeisterbetrieb-Holzbaumeister-Innenausbau",
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
    <div className={className}>
      {/* Section Header */}
      <SectionHeader
        title="Gemeinsam mit starken Partnern."
        subtitle="Wir setzen auf ein Netzwerk aus erfahrenen Experten"
        wrapperMargin="mb-12"
      />

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
  );
}
