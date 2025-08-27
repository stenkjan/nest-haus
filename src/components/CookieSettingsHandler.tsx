"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CookieSettingsHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleShowCookieSettings = () => {
      router.push("/cookie-einstellungen");
    };

    // Listen for the custom event from the cookie banner
    window.addEventListener("showCookieSettings", handleShowCookieSettings);

    return () => {
      window.removeEventListener(
        "showCookieSettings",
        handleShowCookieSettings
      );
    };
  }, [router]);

  return null; // This component doesn't render anything
}
