import React from "react";
import { Button } from "@/components/ui";
import { ClientBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

/**
 * GetInContactBanner Component
 *
 * Uses consistent typography standards:
 * - Title: text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-medium
 * - Subtitle: text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl
 * - Colors: Dynamic based on background (gray-300 on dark, gray-600 on light)
 *
 * See: /docs/TYPOGRAPHY_STANDARDS.md
 */

interface GetInContactBannerProps {
  /**
   * Section ID for navigation
   */
  id?: string;
  /**
   * Main title text
   * @default "Kein Plan? Kein Problem!"
   */
  title?: string;
  /**
   * Subtitle text
   * @default "Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch"
   */
  subtitle?: string;
  /**
   * Button text
   * @default "Jetzt Termin sichern"
   */
  buttonText?: string;
  /**
   * Button click handler
   */
  onButtonClick?: () => void;
  /**
   * Background color
   * @default "white"
   */
  backgroundColor?: string;
  /**
   * Additional text below the banner
   * @default "Lass dich inspirieren und entdecke die Vielfalt unserer zahlreichen Konfigurationen"
   */
  bottomText?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}
export function GetInContactBanner({
  id,
  title = "Kein Plan? Kein Problem!",
  subtitle = "Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch",
  buttonText = "Jetzt Termin sichern",
  onButtonClick,
  backgroundColor = "white",
  bottomText = "Lass dich inspirieren und entdecke die Vielfalt unserer zahlreichen Konfigurationen",
  className = "",
}: GetInContactBannerProps) {
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      // Default behavior: navigate to /kontakt page
      window.location.href = "/kontakt";
    }
  };

  return (
    <section
      id={id}
      className={`w-full ${className}`}
      style={{ backgroundColor }}
    >
      <div className="w-full max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-gray-50 hover:scale-[1.02] transition-transform w-[90%]">
            <div className="p-12 text-center">
              {/* Icon */}
              <div className="flex justify-center">
                <ClientBlobImage
                  path={IMAGES.contactIcons.appointment}
                  alt="Termin Icon"
                  width={240}
                  height={240}
                  className="h-10 w-20 sm:h-12 sm:w-24 md:h-16 md:w-32 lg:h-20 lg:w-40 xl:h-26 xl:w-52 2xl:h-32 2xl:w-64 mb-4 md:mb-8"
                  enableCache={true}
                  enableMobileDetection={false}
                  showLoadingSpinner={false}
                />
              </div>

              {/* Title */}
              <h1 className="h1-secondary text-gray-900 mb-3">{title}</h1>

              {/* Subtitle */}
              <h3 className="h3-secondary text-gray-700 leading-relaxed">
                {subtitle}
              </h3>

              {/* Button */}
              <Button variant="primary" className="mt-4 md:mt-6" size="xs" onClick={handleButtonClick}>
                {buttonText}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        {bottomText && (
          <div className="text-center pt-6">
            <h3 className="h3-tertiary-no-m text-gray-700 max-w-full mx-auto">
              {bottomText}
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}
