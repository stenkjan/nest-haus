"use client";

import React, { useState } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

export default function CookieBanner() {
  const { showBanner, acceptAll, acceptNecessary, showSettings } =
    useCookieConsent();
  const [isVisible, setIsVisible] = useState(true);

  if (!showBanner || !isVisible) {
    return null;
  }

  const handleAcceptAll = () => {
    acceptAll();
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    acceptNecessary();
    setIsVisible(false);
  };

  const handleShowSettings = () => {
    showSettings();
  };

  return (
    <div className="fixed bottom-[2vh] left-[1vw] right-[1vw] z-50 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-[1.5rem] min-h-[120px] flex items-center">
      <div className="px-6 py-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 h-full">
          {/* Content */}
          <div className="flex-1 pr-0 lg:pr-8">
            <div className="text-sm text-black leading-tight space-y-0">
              <p className="font-semibold text-black">
                Helfen Sie uns, unsere Website mit Cookies zu verbessern
              </p>
              <p>
                Wir verwenden Cookies und ähnliche Technologien, um die Leistung
                der Website zu analysieren, Inhalte zu personalisieren und
                relevante Werbung anzuzeigen. Ihre Einwilligung umfasst die
                Aktivierung von Google Signals für demografische Berichte und
                Remarketing sowie die Datenübertragung in Drittländer (z.B.
                USA).
                <br />
                Weitere Informationen finden Sie in den{" "}
                <button
                  onClick={handleShowSettings}
                  className="text-[#000000FF] hover:text-[#2855d6] underline font-medium"
                >
                  Cookie-Einstellungen
                </button>
                .
              </p>
              <p className="text-xs text-gray-600 mt-2 italic">
                Hinweis: Auch bei Ablehnung erfassen wir anonymisierte,
                cookiefreie Seitenaufrufe ohne Nutzeridentifikation (Google
                Consent Mode v2).
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[300px] lg:ml-8 ml-2">
            <button
              onClick={handleAcceptNecessary}
              className="flex-1 lg:flex-none px-6 py-3 bg-white/95 text-black rounded-full font-medium text-sm hover:bg-black hover:text-white transition-colors border border-black-300/50 min-h-[44px] flex items-center justify-center backdrop-blur-sm"
            >
              Ablehnen
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 lg:flex-none px-6 py-3 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-colors min-h-[44px] flex items-center justify-center"
            >
              Akzeptieren
            </button>
          </div>
        </div>

        {/* Mobile Settings Link */}
        <div className="mt-3 lg:hidden">
          <button
            onClick={handleShowSettings}
            className="text-sm text-black hover:text-[#2855d6] underline font-medium"
          >
            Cookie-Einstellungen anpassen
          </button>
        </div>
      </div>
    </div>
  );
}
