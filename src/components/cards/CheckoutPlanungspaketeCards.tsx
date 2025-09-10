"use client";

import React from "react";
import { PLANNING_PACKAGES } from "@/constants/configurator";

interface CheckoutPlanungspaketeCardsProps {
  selectedPlan: string | null;
  onPlanSelect: (value: string) => void;
  basisDisplayPrice?: number;
}

export default function CheckoutPlanungspaketeCards({
  selectedPlan,
  onPlanSelect,
  basisDisplayPrice: _basisDisplayPrice = 8500, // Default basis price for delta calculation
}: CheckoutPlanungspaketeCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PLANNING_PACKAGES.map((pkg) => {
        const isSelected = selectedPlan === pkg.value;
        const isBasis = pkg.value === "basis";

        return (
          <div key={pkg.value} className="h-full">
            <div
              className={`w-full md:h-full rounded-3xl overflow-hidden border bg-white cursor-pointer transition-all duration-200 hover:shadow-lg flex flex-col ${
                isSelected ? "border-blue-600 shadow-md" : "border-gray-300"
              }`}
              onClick={() => {
                // Allow deselection for Plus and Pro, but always keep Basis selected
                if (pkg.value === "basis") {
                  onPlanSelect(pkg.value);
                } else {
                  // For Plus and Pro: toggle selection, fallback to Basis if deselecting
                  if (isSelected) {
                    onPlanSelect("basis"); // Deselect by selecting Basis
                  } else {
                    onPlanSelect(pkg.value); // Select this package
                  }
                }
              }}
            >
              {/* Header Section - Title and Price */}
              <div className="px-6 pt-6">
                {/* Top Subtitle */}
                <h3 className="text-base md:text-lg lg:text-lg xl:text-xl text-gray-600 mb-2">
                  {isBasis ? "Inkludiert im Preis" : "Für Aufpreis erhältlich"}
                </h3>

                {/* Main Title */}
                <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-500 mb-4">
                  <span className="text-black">
                    Planungspaket{" "}
                    {pkg.value === "basis"
                      ? "01"
                      : pkg.value === "plus"
                        ? "02"
                        : "03"}
                  </span>
                  <span className="text-gray-300">
                    {" "}
                    {pkg.value === "basis"
                      ? "Basis"
                      : pkg.value === "plus"
                        ? "Plus"
                        : "Pro"}
                  </span>
                </h2>

                {/* Price Section - Mobile: After title, Desktop: At bottom */}
                <div className="md:hidden mb-6">
                  <div className="text-lg font-regular text-gray-900">
                    {pkg.value === "basis"
                      ? "€ 00,00"
                      : pkg.value === "plus"
                        ? "€ 13.900,00"
                        : "€ 18.900,00"}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {pkg.value === "basis"
                      ? "Wert im Preis inkludiert"
                      : "Kosten nur bei Inanspruchnahme"}
                  </div>
                </div>
              </div>

              {/* Content Section - Description */}
              <div className="flex-1 px-6 pb-4">
                {/* Description */}
                <div className="space-y-4">
                  {/* Smaller text for "Inkl." section */}
                  <div className="text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                    {pkg.value === "basis"
                      ? "Inkl.\nEinreichplanung des Gesamtprojekts\nFachberatung und Baubegleitung\nBürokratische Unterstützung\n\n"
                      : pkg.value === "plus"
                        ? "Inkl.\nPlanungspaket Basis (Einreichplanung)\nElektrik und Sanitärplanung\nAusführungsplanung Innenausbau\n\n"
                        : "Inkl.\nPlanungspaket Plus (HKLS Planung)\nBelauchtungskonzept, Möblierungsplanung,\nFarb- und Materialkonzept\n\n"}
                  </div>

                  {/* Standard p text for main description */}
                  <div className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl black leading-relaxed whitespace-pre-line">
                    {pkg.value === "basis"
                      ? "Mit dem Basispaket legst du den Grundstein für dein Nest Haus. Wir übernehmen Einreichplanung, Statik, Detailplanung und Energieausweis, passen alles an lokale Vorgaben an und optimieren die Raumaufteilung. So bist du rechtssicher, planungssicher und bereit für den nächsten Schritt."
                      : pkg.value === "plus"
                        ? "Das Plus Paket ergänzt alle Leistungen des Basispakets um die komplette technische Detailplanung für Elektrik, Sanitär, Abwasser und Innenausbau. So wird alles frühzeitig mitgedacht, Abstimmungsprobleme werden vermieden und dein Nest Haus ist von Anfang an technisch perfekt vorbereitet."
                        : "Das Pro Paket erweitert Basis und Plus um eine umfassende Gestaltungsebene. Wir entwickeln ein Interiorkonzept mit Möblierung, Küche, Licht, Farben und Materialien, abgestimmt auf innen und außen. So wird dein Nest Haus zu einem stimmigen Ganzen und zum Ausdruck deiner Persönlichkeit."}
                  </div>

                  {/* Additional small text */}
                  <div className="text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-lg text-gray-600 mt-8">
                    Basierend auf Modulkonstellation deiner Wahl
                  </div>
                </div>
              </div>

              {/* Price Section - Both mobile and desktop (at bottom) */}
              <div className="px-6 pb-6">
                <div className="pt-4">
                  <div className="text-left">
                    <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-regular text-gray-900">
                      {pkg.value === "basis"
                        ? "€ 00,00"
                        : pkg.value === "plus"
                          ? "€ 13.900,00"
                          : "€ 18.900,00"}
                    </div>
                    <div className="text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-lg text-gray-600 mt-1">
                      {pkg.value === "basis"
                        ? "Wert im Preis inkludiert"
                        : "Kosten nur bei Inanspruchnahme"}
                    </div>
                  </div>
                  {/* Click instruction - right side, positioned lower */}
                  <div className="text-right mt-6">
                    <div className="text-xs text-gray-500 italic">
                      {isSelected
                        ? isBasis
                          ? "✓ Ausgewählt"
                          : "✓ Ausgewählt (Klicken zum Abwählen)"
                        : "Klicken zum Auswählen"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
