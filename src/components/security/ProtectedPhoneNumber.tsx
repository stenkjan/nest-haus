"use client";

import React, { useState, useEffect } from "react";

interface ProtectedPhoneNumberProps {
  /** The phone number to display (e.g., "+43 664 3949605") */
  number: string;
  /** Display format (e.g., "+43 (0) 664 3949605") */
  displayFormat?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show as a clickable tel: link */
  enableTelLink?: boolean;
  /** Text color class (default: inherits) */
  textColor?: string;
}

/**
 * ProtectedPhoneNumber Component
 * 
 * Displays phone numbers with anti-scraper protection:
 * - CSS blur effect initially
 * - Reveals on hover (desktop) or click (mobile)
 * - Encoded tel: links that decode on interaction
 * - Obfuscated data attributes
 * 
 * Used on /kontakt and terminvereinbarung sections
 */
export const ProtectedPhoneNumber: React.FC<ProtectedPhoneNumberProps> = ({
  number,
  displayFormat,
  className = "",
  enableTelLink = true,
  textColor = "",
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, []);

  const displayText = displayFormat || number;
  
  // Encode phone number for tel: link (remove spaces and special chars except +)
  const cleanNumber = number.replace(/[^\d+]/g, "");
  
  // Base64 encode the tel link to prevent simple scraping
  const encodedTel = typeof window !== "undefined" 
    ? btoa(`tel:${cleanNumber}`)
    : "";

  // Reverse the number for data attribute obfuscation
  const reversedNumber = number.split("").reverse().join("");

  const handleInteraction = () => {
    setIsRevealed(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      setIsRevealed(true);
      
      // After revealing, if tel link is enabled, trigger it
      if (enableTelLink && isRevealed) {
        window.location.href = `tel:${cleanNumber}`;
      }
    }
  };

  const blurStyle: React.CSSProperties = {
    filter: isRevealed ? "none" : "blur(4px)",
    transition: "filter 0.3s ease",
    cursor: isMobile && !isRevealed ? "pointer" : "default",
    userSelect: isRevealed ? "text" : "none",
  };

  // If revealed and tel link enabled, wrap in anchor
  if (isRevealed && enableTelLink) {
    return (
      <a
        href={`tel:${cleanNumber}`}
        className={`${className} ${textColor} hover:underline`}
        data-protected="true"
        onMouseEnter={handleInteraction}
      >
        <span style={blurStyle}>{displayText}</span>
      </a>
    );
  }

  // Not revealed or no tel link
  return (
    <span
      className={`${className} ${textColor}`}
      style={blurStyle}
      onMouseEnter={handleInteraction}
      onClick={handleClick}
      data-phone-rev={reversedNumber}
      data-protected="true"
      data-encoded={encodedTel}
      role={isMobile && !isRevealed ? "button" : undefined}
      tabIndex={isMobile && !isRevealed ? 0 : undefined}
      title={
        isMobile && !isRevealed
          ? "Tippen zum Anzeigen der Telefonnummer"
          : undefined
      }
    >
      {displayText}
    </span>
  );
};

export default ProtectedPhoneNumber;

