"use client";

import React from "react";
import { ProtectedPhoneNumber } from "@/components/security/ProtectedPhoneNumber";

interface TerminVereinbarenContentProps {
  className?: string;
  variant?: "mobile" | "desktop" | "popup" | "dialog";
}

/**
 * Reusable component for "Termin Vereinbaren" content
 * Contains the descriptive text and contact information boxes
 * Used in CalendarDialog popup and AppointmentBookingSection
 */
export const TerminVereinbarenContent: React.FC<
  TerminVereinbarenContentProps
> = ({ className = "", variant = "desktop" }) => {
  const isPopup = variant === "popup";
  const isMobile = variant === "mobile";
  const isDesktop = variant === "desktop";
  const isDialog = variant === "dialog";

  // Popup variant - compact layout
  if (isPopup) {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        <div>
          <p className="text-xs sm:text-sm mb-3 leading-snug">
            <span className="text-nest-gray">
              Der Kauf deines Hauses ist ein großer Schritt –{" "}
            </span>
            <span className="text-black font-medium">
              und wir sind da, um dir dabei zu helfen.
            </span>
            <span className="text-nest-gray">
              {" "}
              Für mehr Sicherheit und Klarheit{" "}
            </span>
            <span className="text-black font-medium">
              stehen wir dir jederzeit persönlich zur Seite.
            </span>
            <span className="text-nest-gray"> Ruf uns an, um dein </span>
            <span className="text-black font-medium">Beratungsgespräch</span>
            <span className="text-nest-gray">
              {" "}
              zu vereinbaren, oder buche deinen{" "}
            </span>
            <span className="text-black font-medium">
              Termin ganz einfach online.
            </span>
            <span className="text-nest-gray">
              {" "}
              Dein Weg zu deinem Traumhaus beginnt mit einem Gespräch.
            </span>
          </p>
        </div>
        <div className="space-y-2">
          <div className="bg-[#f4f4f4] border border-gray-200 rounded-lg p-2 md:p-4">
            <h4 className="font-bold mb-1 text-black text-sm md:text-base">
              Kontakt
            </h4>
            <div className="grid grid-cols-[max-content_1fr] gap-x-2 md:gap-x-4 text-xs md:text-sm">
              <span className="text-nest-gray">Telefon1:</span>
              <ProtectedPhoneNumber
                number="+43 664 3949605"
                displayFormat="+43 (0) 664 3949605"
                className="text-black font-medium"
                enableTelLink={true}
              />
              <span className="text-nest-gray">Telefon2:</span>
              <ProtectedPhoneNumber
                number="+43 660 5649683"
                displayFormat="+43 (0) 660 5649683"
                className="text-black font-medium"
                enableTelLink={true}
              />
              <span className="text-nest-gray">Email:</span>
              <span className="text-black font-medium">mail@hoam-house.com</span>
            </div>
          </div>
          <div className="bg-[#f4f4f4] border border-gray-200 rounded-lg p-2 md:p-4">
            <h4 className="font-bold mb-1 text-black text-sm md:text-base">
              Adresse
            </h4>
            <div className="text-xs md:text-sm">
              <span className="text-black font-medium">
                Zösenberg 51
                <br />
                8045, Weinitzen
                <br />
                Steiermark
                <br />
                Österreich
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile variant
  if (isMobile) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Descriptive Text for Mobile - NO BOX */}
        <div className="text-center">
          <p className="p-primary leading-relaxed">
            <span className="text-nest-gray">
              Der Kauf deines Hauses ist ein großer Schritt – und{" "}
            </span>
            <span className="text-black font-medium">
              wir sind da, um dir dabei zu helfen
            </span>
            <span className="text-nest-gray">
              . Für mehr Sicherheit und Klarheit{" "}
            </span>
            <span className="text-black font-medium">
              stehen wir dir jederzeit persönlich zur Seite
            </span>
            <span className="text-nest-gray">
              . Ruf uns an, um dein Beratungsgespräch zu vereinbaren, oder buche
              deinen{" "}
            </span>
            <span className="text-black font-medium">
              Termin ganz einfach online
            </span>
            <span className="text-nest-gray">
              . Dein Weg zu deinem Traumhaus beginnt mit einem Gespräch.
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Desktop variant
  if (isDesktop) {
    return (
      <div
        className={`space-y-8 max-w-[500px] justify-self-center ${className}`}
      >
        {/* Spacer to align text with calendar border start */}
        <div className="h-16"></div>

        {/* Descriptive Text - INCREASED LINE SPACING */}
        <div className="text-center">
          <p className="p-primary leading-relaxed">
            <span className="text-nest-gray">
              Der Kauf deines Hauses ist ein großer Schritt – und{" "}
            </span>
            <span className="text-black font-medium">
              wir sind da, um dir dabei zu helfen
            </span>
            <span className="text-nest-gray">
              . Für mehr Sicherheit und Klarheit{" "}
            </span>
            <span className="text-black font-medium">
              stehen wir dir jederzeit persönlich zur Seite
            </span>
            <span className="text-nest-gray">
              . Ruf uns an, um dein Beratungsgespräch zu vereinbaren, oder buche
              deinen{" "}
            </span>
            <span className="text-black font-medium">
              Termin ganz einfach online
            </span>
            <span className="text-nest-gray">
              . Dein Weg zu deinem Traumhaus beginnt mit einem Gespräch.
            </span>
          </p>
        </div>

        {/* Spacer to push contact boxes down to radio button level */}
        <div className="h-3"></div>

        {/* Contact Box */}
        <div className="rounded-3xl shadow-lg overflow-hidden bg-[#f4f4f4]">
          <div className="p-6">
            <h2 className="h2-title text-black mb-3">
              Kontakt <span className="text-nest-gray ">Melde dich!</span>
            </h2>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 p-primary-small leading-relaxed">
              <span className="text-nest-gray">Telefon 1:</span>
              <ProtectedPhoneNumber
                number="+43 664 3949605"
                displayFormat="+43 (0) 664 3949605"
                className="text-black font-medium"
                enableTelLink={true}
              />
              <span className="text-nest-gray">Telefon 2:</span>
              <ProtectedPhoneNumber
                number="+43 660 5649683"
                displayFormat="+43 (0) 660 5649683"
                className="text-black font-medium"
                enableTelLink={true}
              />
              <span className="text-nest-gray">Email:</span>
              <span className="text-black font-medium">mail@hoam-house.com</span>
            </div>
          </div>
        </div>

        {/* Address Box */}
        <div className="rounded-3xl shadow-lg overflow-hidden bg-[#f4f4f4]">
          <div className="p-6">
            <h2 className="h2-title text-black mb-3">
              Adresse <span className="text-nest-gray">Komm vorbei!</span>
            </h2>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 p-primary-small leading-relaxed">
              <span className="text-nest-gray">Straße:</span>
              <span className="text-black font-medium">Karmeliterplatz 8</span>
              <span className="text-nest-gray">Stadt:</span>
              <span className="text-black font-medium">
                8010, Graz, Steiermark
              </span>
              <span className="text-nest-gray">Land:</span>
              <span className="text-black font-medium">Österreich</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dialog variant - compact like other dialogs
  if (isDialog) {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        <div>
          <p className="text-xs sm:text-sm mb-3 leading-snug">
            <span className="text-nest-gray">
              Der Kauf deines Hauses ist ein großer Schritt –{" "}
            </span>
            <span className="text-black font-medium">
              und wir sind da, um dir dabei zu helfen.
            </span>
            <span className="text-nest-gray">
              {" "}
              Für mehr Sicherheit und Klarheit{" "}
            </span>
            <span className="text-black font-medium">
              stehen wir dir jederzeit persönlich zur Seite.
            </span>
            <span className="text-nest-gray"> Ruf uns an, um dein </span>
            <span className="text-black font-medium">Beratungsgespräch</span>
            <span className="text-nest-gray">
              {" "}
              zu vereinbaren, oder buche deinen{" "}
            </span>
            <span className="text-black font-medium">
              Termin ganz einfach online.
            </span>
            <span className="text-nest-gray">
              {" "}
              Dein Weg zu deinem Traumhaus beginnt mit einem Gespräch.
            </span>
          </p>
        </div>
        <div className="space-y-2">
          <div className="bg-[#f4f4f4] border border-gray-200 rounded-lg p-2 md:p-4">
            <h4 className="font-bold mb-1 text-black text-sm md:text-base">
              Kontakt
            </h4>
            <div className="grid grid-cols-[max-content_1fr] gap-x-2 md:gap-x-4 text-xs md:text-sm">
              <span className="text-nest-gray">Telefon:</span>
              <ProtectedPhoneNumber
                number="+43 664 3949605"
                displayFormat="+43 (0) 664 3949605"
                className="text-black font-medium"
                enableTelLink={true}
              />
              <span className="text-nest-gray">Mobil:</span>
              <ProtectedPhoneNumber
                number="+43 660 5649683"
                displayFormat="+43 (0) 660 5649683"
                className="text-black font-medium"
                enableTelLink={true}
              />
              <span className="text-nest-gray">Email:</span>
              <span className="text-black font-medium">mail@hoam-house.com</span>
            </div>
          </div>
          <div className="bg-[#f4f4f4] border border-gray-200 rounded-lg p-2 md:p-4">
            <h4 className="font-bold mb-1 text-black text-sm md:text-base">
              Adresse
            </h4>
            <div className="text-xs md:text-sm">
              <span className="text-black font-medium">
                Zösenberg 51
                <br />
                8045, Weinitzen
                <br />
                Steiermark
                <br />
                Österreich
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TerminVereinbarenContent;
