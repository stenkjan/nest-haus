"use client";

import React, { useState, useEffect } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import type { CookiePreferences } from "@/contexts/CookieConsentContext";

export default function CookieSettingsModal() {
  const { preferences, updatePreferences, hideBanner } = useCookieConsent();
  const [isOpen, setIsOpen] = useState(false);
  const [localPreferences, setLocalPreferences] =
    useState<CookiePreferences>(preferences);

  useEffect(() => {
    const handleShowSettings = () => {
      setIsOpen(true);
      setLocalPreferences(preferences);
    };

    window.addEventListener("showCookieSettings", handleShowSettings);
    return () => {
      window.removeEventListener("showCookieSettings", handleShowSettings);
    };
  }, [preferences]);

  const handleSave = () => {
    updatePreferences(localPreferences);
    setIsOpen(false);
    hideBanner();
  };

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === "necessary") return; // Cannot disable necessary cookies
    setLocalPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black">
              Cookie-Einstellungen
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-black text-2xl leading-none"
              aria-label="Schließen"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Legal Information */}
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              Wir verwenden Cookies und ähnliche Technologien, um die Leistung
              unserer Website zu verbessern, Inhalte zu personalisieren und
              Werbung anzuzeigen. Einige dieser Cookies sind für die
              Grundfunktionen der Website erforderlich, während andere uns
              helfen, Ihre Nutzererfahrung zu verbessern.
            </p>
            <p className="font-semibold">
              Ihre Einwilligung umfasst auch die Übertragung von Daten an
              Drittländer außerhalb der EU/des EWR (z.B. USA), die
              möglicherweise nicht das gleiche Datenschutzniveau bieten.
            </p>
            <p className="text-xs bg-green-50 border border-green-200 rounded p-2 mt-2">
              <strong>✅ Sensible Kategorien:</strong> Wir erfassen KEINE
              sensiblen Kategorien gemäß Google-Richtlinien (keine Gesundheits-,
              Finanz-, religiösen oder politischen Daten). Wir erfassen nur
              Standard-Kontaktdaten und Hausbau-Konfigurationen.
            </p>
          </div>

          {/* Necessary Cookies */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-black">Notwendige Cookies</h3>
              <div className="bg-gray-300 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                Immer aktiv
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Diese Cookies sind für die Grundfunktionen der Website
              erforderlich und können nicht deaktiviert werden. Sie speichern
              keine personenbezogenen Daten.
            </p>
          </div>

          {/* Analytics Cookies */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-black">Analyse-Cookies</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPreferences.analytics}
                  onChange={() => handleToggle("analytics")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Diese Cookies ermöglichen es uns, die Nutzung unserer Website zu
              analysieren und die Leistung zu messen. Wir verwenden Google
              Analytics 4 mit aktivierten Google Signals.
            </p>
            <p className="text-xs text-gray-500 italic">
              Anbieter: Google LLC, Google Ireland Limited
              <br />
              Zweck: Website-Analyse, Nutzerverhalten verstehen, demografische
              Berichte, Remarketing
              <br />
              Datenübertragung: USA (Drittland ohne Angemessenheitsbeschluss)
            </p>
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2">
              <p className="text-xs text-blue-800">
                <strong>Bei Ablehnung:</strong> Wir senden weiterhin
                anonymisierte, cookiefreie &quot;Pings&quot; an Google Analytics
                (nur Seitenaufrufe, keine Nutzeridentifikation, keine Cookies).
                Dies entspricht Google Consent Mode v2 und ist DSGVO-konform.
              </p>
            </div>
          </div>

          {/* Functional Cookies */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-black">Funktionale Cookies</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPreferences.functional}
                  onChange={() => handleToggle("functional")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600">
              Diese Cookies ermöglichen erweiterte Funktionen und
              Personalisierung wie Videos und Live-Chats.
            </p>
          </div>

          {/* Marketing Cookies */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-black">Marketing-Cookies</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPreferences.marketing}
                  onChange={() => handleToggle("marketing")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Diese Cookies werden verwendet, um Ihnen relevante Werbung
              anzuzeigen und die Wirksamkeit von Werbekampagnen zu messen.
            </p>
            <p className="text-xs text-gray-500 italic">
              Anbieter: Google LLC, Google Ireland Limited
              <br />
              Zweck: Personalisierte Werbung, Remarketing, Conversion-Tracking
              <br />
              Datenübertragung: USA (Drittland ohne Angemessenheitsbeschluss)
            </p>
          </div>

          {/* Additional Information */}
          <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-4">
            <p className="mb-2">
              <strong>Weitere Informationen:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Sie können Ihre Einwilligung jederzeit widerrufen oder ändern
              </li>
              <li>
                Ihre Wahl gilt für diese Website und wird für 12 Monate
                gespeichert
              </li>
              <li>
                Weitere Informationen finden Sie in unserer{" "}
                <a
                  href="/datenschutz"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datenschutzerklärung
                </a>
              </li>
              <li>
                Sie können Google Analytics auch über das{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout?hl=de"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Browser-Add-on
                </a>{" "}
                deaktivieren
              </li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 px-6 py-3 bg-white text-black rounded-full font-medium text-sm hover:bg-gray-100 transition-colors border border-gray-300"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
          >
            Einstellungen speichern
          </button>
        </div>
      </div>
    </div>
  );
}
