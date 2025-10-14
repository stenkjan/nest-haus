"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { HybridBlobImage } from "@/components/images";
import { PARTNERS_DATA } from "@/constants/contentCardPresets";

/**
 * PartnersSection Component
 *
 * Displays partner logos in a responsive grid with optional action buttons.
 * Content is managed via preset system in contentCardPresets.ts
 *
 * Usage:
 * - Use SectionHeader component for title/subtitle in parent
 * - Pass partners and buttons via PARTNERS_PRESET
 */

export interface PartnerData {
  id: string;
  name: string;
  path: string;
}

interface PartnersSectionProps {
  /**
   * Partner data array
   */
  partners?: PartnerData[];
  /**
   * Action buttons configuration
   */
  buttons?: Array<{
    text: string;
    variant:
      | "primary"
      | "secondary"
      | "primary-narrow"
      | "secondary-narrow"
      | "secondary-narrow-white"
      | "secondary-narrow-blue"
      | "tertiary"
      | "outline"
      | "ghost"
      | "danger"
      | "success"
      | "info"
      | "landing-primary"
      | "landing-secondary"
      | "landing-secondary-blue"
      | "landing-secondary-blue-white"
      | "configurator";
    size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
    link?: string;
    onClick?: () => void;
  }>;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function PartnersSection({
  partners = PARTNERS_DATA,
  buttons,
  className = "",
}: PartnersSectionProps) {
  return (
    <div className={className}>
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

      {/* Action Buttons - Rendered from preset configuration */}
      {buttons && buttons.length > 0 && (
        <div className="flex flex-row gap-4 justify-center">
          {buttons.map((button, index) => {
            // Button with link
            if (button.link) {
              return (
                <Link key={index} href={button.link}>
                  <Button variant={button.variant} size={button.size || "xs"}>
                    {button.text}
                  </Button>
                </Link>
              );
            }

            // Button with onClick
            return (
              <Button
                key={index}
                variant={button.variant}
                size={button.size || "xs"}
                onClick={button.onClick}
              >
                {button.text}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
