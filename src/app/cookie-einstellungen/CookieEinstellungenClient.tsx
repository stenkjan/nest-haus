"use client";

import React, { useState, useEffect } from "react";
import {
  useCookieConsent,
  CookiePreferences,
} from "@/contexts/CookieConsentContext";
import Footer from "@/components/Footer";

interface CookieCategory {
  id: keyof CookiePreferences;
  title: string;
  description: string;
  required: boolean;
  cookies: {
    name: string;
    purpose: string;
    duration: string;
    provider: string;
  }[];
}

const cookieCategories: CookieCategory[] = [
  {
    id: "necessary",
    title: "Notwendige Cookies",
    description:
      "Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.",
    required: true,
    cookies: [
      {
        name: "nest-haus-session",
        purpose: "Speichert Ihre Konfiguration im Haus-Konfigurator",
        duration: "Session (bis Browser geschlossen wird)",
        provider: "NEST-Haus",
      },
      {
        name: "nest-haus-cookie-consent",
        purpose: "Speichert Ihre Cookie-Einstellungen",
        duration: "1 Jahr",
        provider: "NEST-Haus",
      },
      {
        name: "csrf-token",
        purpose: "Schutz vor Cross-Site-Request-Forgery-Angriffen",
        duration: "Session",
        provider: "NEST-Haus",
      },
    ],
  },
  {
    id: "analytics",
    title: "Analyse-Cookies",
    description:
      "Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, indem sie Informationen anonym sammeln und melden.",
    required: false,
    cookies: [
      {
        name: "nest-analytics",
        purpose: "Erfasst anonyme Nutzungsstatistiken und Seitenaufrufe",
        duration: "30 Tage",
        provider: "NEST-Haus",
      },
      {
        name: "configurator-analytics",
        purpose:
          "Analysiert die Nutzung des Haus-Konfigurators zur Verbesserung",
        duration: "30 Tage",
        provider: "NEST-Haus",
      },
      {
        name: "performance-metrics",
        purpose: "Misst Ladezeiten und technische Performance",
        duration: "7 Tage",
        provider: "NEST-Haus",
      },
    ],
  },
  {
    id: "functional",
    title: "Funktionale Cookies",
    description:
      "Diese Cookies ermöglichen erweiterte Funktionalitäten und Personalisierung der Website.",
    required: false,
    cookies: [
      {
        name: "user-preferences",
        purpose: "Speichert Ihre bevorzugten Einstellungen (Sprache, Region)",
        duration: "1 Jahr",
        provider: "NEST-Haus",
      },
      {
        name: "saved-configurations",
        purpose: "Speichert Ihre gespeicherten Haus-Konfigurationen",
        duration: "6 Monate",
        provider: "NEST-Haus",
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing-Cookies",
    description:
      "Diese Cookies werden verwendet, um Werbung zu personalisieren und die Effektivität von Werbekampagnen zu messen.",
    required: false,
    cookies: [
      {
        name: "marketing-attribution",
        purpose:
          "Verfolgt, über welche Kanäle Besucher auf unsere Website gelangen",
        duration: "90 Tage",
        provider: "NEST-Haus",
      },
      {
        name: "campaign-tracking",
        purpose: "Misst die Effektivität von Werbekampagnen",
        duration: "30 Tage",
        provider: "NEST-Haus",
      },
    ],
  },
];

export default function CookieEinstellungenClient() {
  const { preferences, updatePreferences, hasConsented } = useCookieConsent();
  const [localPreferences, setLocalPreferences] =
    useState<CookiePreferences>(preferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleToggle = (categoryId: keyof CookiePreferences) => {
    if (categoryId === "necessary") return; // Cannot toggle necessary cookies

    const newPreferences = {
      ...localPreferences,
      [categoryId]: !localPreferences[categoryId],
    };
    setLocalPreferences(newPreferences);
    setHasChanges(true);
  };

  const handleSave = () => {
    updatePreferences(localPreferences);
    setHasChanges(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    setLocalPreferences(allAccepted);
    updatePreferences(allAccepted);
    setHasChanges(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    setLocalPreferences(onlyNecessary);
    updatePreferences(onlyNecessary);
    setHasChanges(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4">
              Cookie-Einstellungen
            </h1>
            <h2 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto">
              Verwalten Sie Ihre Datenschutz- und Cookie-Präferenzen
            </h2>
          </div>

          {/* Status Message */}
          {showSaved && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium text-center">
                ✓ Ihre Cookie-Einstellungen wurden gespeichert
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Schnellauswahl</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-6 py-3 bg-[#3D6DE1] text-white rounded-full font-medium hover:bg-[#2855d6] transition-colors"
              >
                Alle Cookies akzeptieren
              </button>
              <button
                onClick={handleRejectAll}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-full font-medium hover:bg-gray-300 transition-colors"
              >
                Nur notwendige Cookies
              </button>
            </div>
          </div>

          {/* Cookie Categories */}
          <div className="space-y-8">
            {cookieCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white border rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-2">
                        {category.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    <div className="ml-6">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localPreferences[category.id]}
                          onChange={() => handleToggle(category.id)}
                          disabled={category.required}
                          className="sr-only"
                        />
                        <div
                          className={`w-11 h-6 rounded-full transition-colors ${
                            localPreferences[category.id]
                              ? "bg-[#3D6DE1]"
                              : "bg-gray-300"
                          } ${category.required ? "opacity-50" : ""}`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                              localPreferences[category.id]
                                ? "translate-x-6"
                                : "translate-x-1"
                            } mt-1`}
                          />
                        </div>
                        {category.required && (
                          <span className="ml-3 text-sm text-gray-500">
                            Erforderlich
                          </span>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Cookie Details */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-3 text-gray-900">
                      Verwendete Cookies:
                    </h4>
                    <div className="space-y-3">
                      {category.cookies.map((cookie, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium text-sm">
                                {cookie.name}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {cookie.purpose}
                              </p>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>
                                <strong>Speicherdauer:</strong>{" "}
                                {cookie.duration}
                              </p>
                              <p>
                                <strong>Anbieter:</strong> {cookie.provider}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          {hasChanges && (
            <div className="mt-12 text-center">
              <button
                onClick={handleSave}
                className="px-8 py-4 bg-[#3D6DE1] text-white rounded-full font-medium text-lg hover:bg-[#2855d6] transition-colors"
              >
                Einstellungen speichern
              </button>
            </div>
          )}

          {/* Additional Information */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium mb-3">Weitere Informationen</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                Sie können Ihre Cookie-Einstellungen jederzeit ändern, indem Sie
                diese Seite erneut besuchen.
              </p>
              <p>
                Weitere Informationen zum Datenschutz finden Sie in unserer{" "}
                <a
                  href="/datenschutz"
                  className="text-[#3D6DE1] hover:text-[#2855d6] underline"
                >
                  Datenschutzerklärung
                </a>
                .
              </p>
              <p>
                Bei Fragen zu Cookies und Datenschutz kontaktieren Sie uns
                unter:{" "}
                <a
                  href="mailto:datenschutz@nest-haus.com"
                  className="text-[#3D6DE1] hover:text-[#2855d6] underline"
                >
                  datenschutz@nest-haus.com
                </a>
              </p>
            </div>
          </div>

          {/* Current Status */}
          {hasConsented && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Aktuelle Einstellungen:</h3>
              <div className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(preferences).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${value ? "bg-green-500" : "bg-gray-400"}`}
                    />
                    <span className="capitalize">{key}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
