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
 * Displays phone numbers as clickable tel: links
 * - Always visible (no blur effect)
 * - Clickable tel: links for easy calling
 * - Obfuscated data attributes for anti-scraping
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
  const displayText = displayFormat || number;
  
  // Encode phone number for tel: link (remove spaces and special chars except +)
  const cleanNumber = number.replace(/[^\d+]/g, "");
  
  // Base64 encode the tel link to prevent simple scraping
  // Use state to avoid hydration mismatch - only set after client-side mount
  const [encodedTel, setEncodedTel] = useState("");

  useEffect(() => {
    setEncodedTel(btoa(`tel:${cleanNumber}`));
  }, [cleanNumber]);

  // Reverse the number for data attribute obfuscation
  const reversedNumber = number.split("").reverse().join("");

  // If tel link enabled, wrap in anchor
  if (enableTelLink) {
    return (
      <a
        href={`tel:${cleanNumber}`}
        className={`${className} ${textColor} hover:underline`}
        data-protected="true"
        data-phone-rev={reversedNumber}
        data-encoded={encodedTel}
      >
        {displayText}
      </a>
    );
  }

  // No tel link, just display text
  return (
    <span
      className={`${className} ${textColor}`}
      data-phone-rev={reversedNumber}
      data-protected="true"
      data-encoded={encodedTel}
    >
      {displayText}
    </span>
  );
};

export default ProtectedPhoneNumber;
