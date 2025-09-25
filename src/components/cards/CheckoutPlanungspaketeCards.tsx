"use client";

import React from "react";
import { PLANNING_PACKAGES } from "@/constants/configurator";
import { planungspaketeCardData } from "@/components/cards/PlanungspaketeCards";

interface CheckoutPlanungspaketeCardsProps {
  selectedPlan: string | null;
  onPlanSelect: (value: string) => void;
  basisDisplayPrice?: number;
}

export default function CheckoutPlanungspaketeCards({
  selectedPlan,
  onPlanSelect,
  basisDisplayPrice: _basisDisplayPrice = 10900, // Default basis price for delta calculation
}: CheckoutPlanungspaketeCardsProps) {
  // Helper function to get the corresponding card data from PlanungspaketeCards
  const getCardData = (packageValue: string) => {
    const cardMap = {
      basis: planungspaketeCardData[0], // Planungspaket 01 Basis
      plus: planungspaketeCardData[1], // Planungspaket 02 Plus
      pro: planungspaketeCardData[2], // Planungspaket 03 Pro
    };
    return cardMap[packageValue as keyof typeof cardMap];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
      {PLANNING_PACKAGES.map((pkg) => {
        const isSelected = selectedPlan === pkg.value;
        const isBasis = pkg.value === "basis";
        const cardData = getCardData(pkg.value);

        return (
          <div key={pkg.value} className="h-full">
            <div
              className={`w-full h-full rounded-3xl overflow-hidden border bg-white cursor-pointer transition-all duration-200 hover:shadow-lg flex flex-col ${
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
                      ? "€ 10.900,00"
                      : pkg.value === "plus"
                        ? "€ 16.900,00"
                        : "€ 21.900,00"}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {pkg.value === "basis"
                      ? "Grundlegende Planungsleistungen"
                      : "Kosten nur bei Inanspruchnahme"}
                  </div>
                </div>
              </div>

              {/* Content Section - Description */}
              <div className="px-6 py-6 flex-grow flex flex-col min-h-[400px]">
                {/* Main Description Content */}
                <div className="space-y-6">
                  {/* Smaller text for "Inkl." section - use from cardData */}
                  <div className="text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                    {cardData?.description || pkg.description}
                  </div>

                  {/* Standard p text for main description */}
                  <div className="p-primary black leading-relaxed whitespace-pre-line">
                    {pkg.value === "basis"
                      ? "Nachdem dein Vorentwurf abgeschlossen ist, erstellen wir die vollständige und rechtlich korrekte Planung für dein zuständiges Bauamt. Im Planungspaket Basis bereiten wir alle notwendigen Unterlagen auf, die für den offiziellen Einreichprozess erforderlich sind. Dazu gehören die präzise Darstellung des geplanten Gebäudes auf deinem Grundstück, die Prüfung der örtlichen Bauvorschriften sowie die Berücksichtigung aller relevanten Abstände, Höhen und Flächen.\n\nDarüber hinaus stimmen wir technische Aspekte wie Stromversorgung, Wasser- und Kanalanschlüsse, Heizungsanschlussmöglichkeiten und Zufahrtswege sorgfältig ab. Auch Anforderungen zur Erschließung, zu Brandschutz oder zu besonderen Auflagen der Behörde werden berücksichtigt und in die Planung integriert.\n\nMit dem Planungspaket Basis erhältst du eine genehmigungsfähige Einreichplanung und die Sicherheit, dass wir dich während des gesamten Bauprozesses begleiten und unterstützen, von den ersten Behördenschritten bis hin zur finalen Umsetzung deines Nest Hauses."
                      : pkg.value === "plus"
                        ? "Du möchtest Unterstützung bei der technischen Innenausbauplanung? Dann ist unser Plus-Paket genau das Richtige für dich. Es umfasst alle Leistungen des Basispakets, von der Einreichplanung bis zur Detailplanung und ergänzt sie um die komplette Haustechnikplanung: Elektrik, Sanitär, Abwasser und Innenausbau.\n\nWarum das sinnvoll ist? Weil du damit alle Leitungen, Anschlüsse und Einbauten frühzeitig mitplanst. Das spart Zeit, vermeidet Abstimmungsprobleme auf der Baustelle und sorgt dafür, dass dein Haus technisch von Anfang an durchdacht ist.\n\nAber klar, wenn du die technische Planung lieber selbst übernehmen oder mit einem Partner deines Vertrauens umsetzen möchtest, ist das genauso möglich. Unser Nest-System ist so konzipiert, dass du flexibel bleibst und auch diesen Weg einfach gehen kannst.\n\nDas Plus-Paket ist unsere Lösung für dich, wenn du maximale Planungssicherheit willst. Alles aus einer Hand, alles bestens vorbereitet."
                        : "Du willst nicht nur planen, du willst gestalten. Mit Gefühl für Raum, Stil und Atmosphäre.\n\nDas Pro-Paket ergänzt die technischen und baurechtlichen Grundlagen der ersten beiden Pakete um eine umfassende gestalterische Ebene. Gemeinsam entwickeln wir ein Interiorkonzept, das deine Wünsche in Raumgefühl, Möblierung und Stil widerspiegelt. Die Küche wird funktional durchdacht und gestalterisch in das Gesamtkonzept eingebettet – alle Anschlüsse und Geräte exakt geplant. Ein stimmungsvolles Licht- und Beleuchtungskonzept bringt Leben in deine Räume, während harmonisch abgestimmte Farben und Materialien innen wie außen für ein rundes Gesamtbild sorgen. Auch der Garten und die Außenräume werden in die Planung miteinbezogen, sodass dein neues Zuhause nicht nur innen, sondern auch im Außenbereich überzeugt.\n\nMit dem Pro-Paket wird dein Nest-Haus zum Ausdruck deiner Persönlichkeit. Durchdacht, gestaltet und bereit zum Leben."}
                  </div>
                </div>

                {/* Spacer to push bottom text down */}
                <div className="flex-grow"></div>

                {/* Bottom text - always at bottom */}
                <div className="text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-lg text-gray-600 mt-6">
                  Basierend auf Modulkonstellation deiner Wahl
                </div>
              </div>

              {/* Price Section - Both mobile and desktop (at bottom) */}
              <div className="px-6 pb-6 flex-shrink-0">
                <div className="pt-4">
                  <div className="text-left">
                    <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-regular text-gray-900">
                      {pkg.value === "basis"
                        ? "€ 10.900,00"
                        : pkg.value === "plus"
                          ? "€ 16.900,00"
                          : "€ 21.900,00"}
                    </div>
                    <div className="text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-lg text-gray-600 mt-1">
                      {pkg.value === "basis"
                        ? "Grundlegende Planungsleistungen"
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
