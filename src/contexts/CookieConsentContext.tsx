"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

export interface CookieConsentContextType {
  preferences: CookiePreferences;
  hasConsented: boolean;
  showBanner: boolean;
  updatePreferences: (preferences: Partial<CookiePreferences>) => void;
  acceptAll: () => void;
  acceptNecessary: () => void;
  showSettings: () => void;
  hideBanner: () => void;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true, cannot be disabled
  analytics: false,
  functional: false,
  marketing: false,
};

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

const COOKIE_CONSENT_KEY = "nest-haus-cookie-consent";
const COOKIE_PREFERENCES_KEY = "nest-haus-cookie-preferences";

interface CookieConsentProviderProps {
  children: ReactNode;
}

export function CookieConsentProvider({
  children,
}: CookieConsentProviderProps) {
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);
  const [hasConsented, setHasConsented] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (savedConsent === "true" && savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        setPreferences({ ...defaultPreferences, ...parsedPreferences });
        setHasConsented(true);
        setShowBanner(false);
      } catch (error) {
        console.error("Error parsing cookie preferences:", error);
        setShowBanner(true);
      }
    } else {
      // Show banner if no consent has been given
      setShowBanner(true);
    }
  }, []);

  const savePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(
      COOKIE_PREFERENCES_KEY,
      JSON.stringify(newPreferences)
    );
    setPreferences(newPreferences);
    setHasConsented(true);
    setShowBanner(false);

    // Trigger custom event for analytics integration
    window.dispatchEvent(
      new CustomEvent("cookiePreferencesUpdated", {
        detail: newPreferences,
      })
    );
  };

  const updatePreferences = (newPreferences: Partial<CookiePreferences>) => {
    const updatedPreferences = {
      ...preferences,
      ...newPreferences,
      necessary: true, // Always keep necessary cookies enabled
    };
    savePreferences(updatedPreferences);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    savePreferences(defaultPreferences);
  };

  const showSettings = () => {
    // This will be handled by the cookie settings modal/page
    window.dispatchEvent(new CustomEvent("showCookieSettings"));
  };

  const hideBanner = () => {
    setShowBanner(false);
  };

  const contextValue: CookieConsentContextType = {
    preferences,
    hasConsented,
    showBanner,
    updatePreferences,
    acceptAll,
    acceptNecessary,
    showSettings,
    hideBanner,
  };

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
}

// Utility functions for checking cookie consent
export const canUseAnalytics = (preferences: CookiePreferences): boolean => {
  return preferences.analytics;
};

export const canUseFunctional = (preferences: CookiePreferences): boolean => {
  return preferences.functional;
};

export const canUseMarketing = (preferences: CookiePreferences): boolean => {
  return preferences.marketing;
};
