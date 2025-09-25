"use client";

import React from "react";

interface TerminVereinbarenContentProps {
  className?: string;
  variant?: "mobile" | "desktop" | "popup";
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

  // Popup variant - compact layout
  if (isPopup) {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        <div>
          <p className="text-xs sm:text-sm text-gray-700 mb-3 leading-snug">
            Der Kauf deines Hauses ist ein großer Schritt –{" "}
            <span className="font-bold">
              und wir sind da, um dir dabei zu helfen.
            </span>{" "}
            Für mehr Sicherheit und Klarheit{" "}
            <span className="font-bold">
              stehen wir dir jederzeit persönlich zur Seite.
            </span>{" "}
            Ruf uns an, um dein{" "}
            <span className="font-bold">Beratungsgespräch</span> zu vereinbaren,
            oder buche deinen{" "}
            <span className="font-bold">Termin ganz einfach online.</span> Dein
            Weg zu deinem Traumhaus beginnt mit einem Gespräch.
          </p>
        </div>
        <div className="space-y-2">
          <div className="bg-[#f4f4f4] border border-gray-200 rounded-lg p-2 md:p-4">
            <h4 className="font-bold mb-1 text-gray-800 text-sm md:text-base">
              Kontakt
            </h4>
            <div className="grid grid-cols-[max-content_1fr] gap-x-2 md:gap-x-4 text-xs md:text-sm text-gray-700">
              <span>Telefon:</span>
              <span>+43 (0) 664 5403399</span>
              <span>Mobil:</span>
              <span>+43 (0) 664 2531869</span>
              <span>Email:</span>
              <span>nest@haus.at</span>
            </div>
          </div>
          <div className="bg-[#f4f4f4] border border-gray-200 rounded-lg p-2 md:p-4">
            <h4 className="font-bold mb-1 text-gray-800 text-sm md:text-base">
              Adresse
            </h4>
            <div className="text-xs md:text-sm text-gray-700">
              Karmeliterplatz 8
              <br />
              8010, Graz
              <br />
              Steiermark
              <br />
              Österreich
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
        <div className="text-center px-4">
          <p className="p-primary text-gray-700 leading-relaxed">
            Der Kauf deines Hauses ist ein großer Schritt – und{" "}
            <strong>wir sind da, um dir dabei zu helfen</strong>. Für mehr
            Sicherheit und Klarheit{" "}
            <strong>stehen wir dir jederzeit persönlich zur Seite</strong>. Ruf
            uns an, um dein Beratungsgespräch zu vereinbaren, oder buche deinen{" "}
            <strong>Termin ganz einfach online</strong>. Dein Weg zu deinem
            Traumhaus beginnt mit einem Gespräch.
          </p>
        </div>

        {/* Contact Info Boxes for Mobile */}
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-gray-50 hover:scale-[1.02] transition-transform">
            <div className="p-6">
              <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-900 mb-3 text-center">
                Kontakt <span className="text-gray-400">Melde dich!</span>
              </h2>
              <div className="text-center">
                <p className="text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base text-gray-700 leading-relaxed">
                  <span className="font-medium">Telefon:</span> +43 (0) 664 5403399
                  <br />
                  <span className="font-medium">Mobil:</span> +43 (0) 664 2531869
                  <br />
                  <span className="font-medium">Email:</span> nest@haus.at
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-gray-50 hover:scale-[1.02] transition-transform">
            <div className="p-6">
              <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-900 mb-3 text-center">
                Adresse <span className="text-gray-400">Komm vorbei!</span>
              </h2>
              <div className="text-center">
                <p className="text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base text-gray-700 leading-relaxed">
                  Karmeliterplatz 8
                  <br />
                  8010, Graz
                  <br />
                  Steiermark
                  <br />
                  Österreich
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop variant
  if (isDesktop) {
    return (
      <div
        className={`space-y-8 max-w-[500px] justify-self-start ${className}`}
      >
        {/* Spacer to align text with calendar border start */}
        <div className="h-16"></div>

        {/* Descriptive Text - INCREASED LINE SPACING */}
        <div>
          <p className="p-primary text-gray-700 leading-relaxed">
            Der Kauf deines Hauses ist ein großer Schritt – und{" "}
            <strong>wir sind da, um dir dabei zu helfen</strong>. Für mehr
            Sicherheit und Klarheit{" "}
            <strong>stehen wir dir jederzeit persönlich zur Seite</strong>. Ruf
            uns an, um dein Beratungsgespräch zu vereinbaren, oder buche deinen{" "}
            <strong>Termin ganz einfach online</strong>. Dein Weg zu deinem
            Traumhaus beginnt mit einem Gespräch.
          </p>
        </div>

        {/* Spacer to push contact boxes down to radio button level */}
        <div className="h-3"></div>

        {/* Contact Box */}
        <div className="rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-gray-50 hover:scale-[1.02] transition-transform">
          <div className="p-6">
            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-900 mb-3">
              Kontakt <span className="text-gray-400">Melde dich!</span>
            </h2>
            <div>
              <p className="text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base text-gray-700 leading-relaxed">
                <span className="font-medium">Telefon:</span> +43 (0) 664 5403399
                <br />
                <span className="font-medium">Mobil:</span> +43 (0) 664 2531869
                <br />
                <span className="font-medium">Email:</span> nest@haus.at
              </p>
            </div>
          </div>
        </div>

        {/* Address Box */}
        <div className="rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-gray-50 hover:scale-[1.02] transition-transform">
          <div className="p-6">
            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-900 mb-3">
              Adresse <span className="text-gray-400">Komm vorbei!</span>
            </h2>
            <div>
              <p className="text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base text-gray-700 leading-relaxed">
                Karmeliterplatz 8
                <br />
                8010, Graz
                <br />
                Steiermark
                <br />
                Österreich
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TerminVereinbarenContent;
