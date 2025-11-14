import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

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
  link?: string; // Optional external link
}

const partners: Partner[] = [
  {
    id: "tu-graz",
    name: "Technische Universität Graz",
    path: IMAGES.partners.partner1,
    description: "Förderung und Entwicklung",
    link: "https://www.tugraz.at",
  },
  {
    id: "tu-iam",
    name: "Institut für Digitalisierung",
    path: IMAGES.partners.partner3,
    description: "Forschung und Entwicklung",
    link: "https://iam.tugraz.at/main-website/",
  },
  {
    id: "tu-bauphysik",
    name: "Labor für Bauphysik",
    path: IMAGES.partners.partner4,
    description: "LFB TU Graz Forschung",
    link: "https://www.tugraz.at/arbeitsgruppen/lfb/labor-fuer-bauphysik-tu-graz",
  },
  {
    id: "lki-tu-graz",
    name: "LKI TU Graz",
    path: IMAGES.partners.lkiTuGraz,
    description: "Labor für konstruktiven Ingenieurbau",
    link: "https://www.tugraz.at/institute/lki/home",
  },
  {
    id: "engelsmann-peters",
    name: "Engelsmann und Peters",
    path: IMAGES.partners.partner2,
    description: "Statische Entwicklung",
    link: "https://engelsmannpeters.de/",
  },
  {
    id: "schwarz",
    name: "Schwarz & Partner",
    path: IMAGES.partners.partner5,
    description: "Patentanwälte",
    link: "https://www.schwarz-ip.at/",
  },
  {
    id: "sobitsch",
    name: "Sobitsch Bau GmbH",
    path: IMAGES.partners.partner6,
    description: "Zimmermann",
    link: "https://www.sobi.at",
  },
  {
    id: "rockenbauer",
    name: "Rockenbauer",
    path: IMAGES.partners.rockenbauer,
    description: "Dachdecker und Spengler",
    link: "https://www.rockenbauer.at",
  },
  {
    id: "markus-krampl",
    name: "Markus Krampl Creative",
    path: IMAGES.partners.markusKrampl,
    description: "Video Production & Photography",
    link: "https://www.markuskrampl.com",
  },
  {
    id: "zarnhofer",
    name: "Zarnhofer",
    path: IMAGES.partners.zarnhofer,
    description: "Holzbaumeisterbetrieb",
    link: "https://www.zarnhofer.at",
  },
  {
    id: "bp-elektrotechnik",
    name: "BP Elektrotechnik GmbH",
    path: IMAGES.partners.bpElektrotechnik,
    description: "Elektrotechnik",
    link: "https://www.bp-elektrotechnik.at",
  },
  {
    id: "gemeinsam-staerker",
    name: "Gemeinsam stärker",
    path: IMAGES.partners.kollaborationPartner,
    description: "Werde Teil von Nest",
    link: "/kontakt",
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
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
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
              {partners.map((partner) => {
                const content = (
                  <div className="flex flex-col items-center">
                    {/* Square container wrapper */}
                    <div className="w-full aspect-square mb-3 bg-white rounded-3xl p-4 md:p-6 flex items-center justify-center transition-transform duration-300 hover:scale-105">
                      {/* Image content */}
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
                    {partner.name && (
                      <p className="p-primary-small text-gray-700 text-center mb-1">
                        {partner.name}
                      </p>
                    )}
                    {partner.description && (
                      <p className="p-primary-small2 text-nest-gray text-center">
                        {partner.description}
                      </p>
                    )}
                  </div>
                );

                return partner.link ? (
                  <Link
                    key={partner.id}
                    href={partner.link}
                    target={
                      partner.link.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      partner.link.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="cursor-pointer"
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={partner.id}>{content}</div>
                );
              })}
            </div>

            {/* Buttons at the bottom */}
            <div className="flex flex-col gap-4 items-center">
              <Link href="/kontakt">
                <Button variant="primary" size="xs">
                  Melde dich!
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
                <Link href="/kontakt">
                  <Button variant="primary" size="xs">
                    Melde dich!
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Partner Logo Boxes */}
            <div className="lg:flex-1">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {partners.map((partner) => {
                  const content = (
                    <div className="flex flex-col items-center">
                      {/* Square container wrapper */}
                      <div className="w-full aspect-square mb-3 bg-white rounded-3xl p-4 md:p-6 flex items-center justify-center transition-transform duration-300 hover:scale-105">
                        {/* Image content */}
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
                      {partner.name && (
                        <p className="p-primary-small text-black text-center">
                          {partner.name}
                        </p>
                      )}
                      {partner.description && (
                        <p className="p-primary-small2 text-gray-400 text-center">
                          {partner.description}
                        </p>
                      )}
                    </div>
                  );

                  return partner.link ? (
                    <Link
                      key={partner.id}
                      href={partner.link}
                      target={
                        partner.link.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        partner.link.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="cursor-pointer"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={partner.id}>{content}</div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
