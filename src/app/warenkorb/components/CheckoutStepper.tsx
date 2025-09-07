"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PriceUtils } from "@/app/konfigurator/core/PriceUtils";
import type { CartItem, ConfigurationCartItem } from "@/store/cartStore";
import { PLANNING_PACKAGES } from "@/constants/configurator";
import { GrundstueckCheckForm } from "@/components/sections";
import { AppointmentBooking } from "@/components/sections";
import {
  planungspaketeCardData,
  type PlanungspaketeCardData,
} from "@/components/cards/PlanungspaketeCards";
import { defaultSquareTextCardData } from "@/components/cards/SquareTextCard";
import { CheckoutStepCard } from "@/components/cards";
import { ImageManager } from "@/app/konfigurator/core/ImageManager";
import { HybridBlobImage } from "@/components/images";
import { useConfiguratorStore } from "@/store/configuratorStore";
import type { ViewType } from "@/app/konfigurator/types/configurator.types";
import { CHECKOUT_STEPS } from "@/app/warenkorb/steps";
import { IMAGES } from "@/constants/images";
import { Button } from "@/components/ui";

interface CheckoutStepperProps {
  items: (CartItem | ConfigurationCartItem)[];
  getCartTotal: () => number;
  removeFromCart: (itemId: string) => void;
  addConfigurationToCart: (config: ConfigurationCartItem) => void;
  onScrollToContact?: () => void;
  stepIndex?: number;
  onStepChange?: (nextIndex: number) => void;
  hideProgress?: boolean;
}

export default function CheckoutStepper({
  items,
  getCartTotal,
  removeFromCart,
  addConfigurationToCart,
  onScrollToContact,
  stepIndex: controlledStepIndex,
  onStepChange,
  hideProgress = false,
}: CheckoutStepperProps) {
  const [internalStepIndex, setInternalStepIndex] = useState<number>(0);
  const [hasScrolledToBottom, setHasScrolledToBottom] =
    useState<boolean>(false);
  const isControlled =
    typeof controlledStepIndex === "number" &&
    typeof onStepChange === "function";
  const stepIndex = isControlled
    ? (controlledStepIndex as number)
    : internalStepIndex;
  const setStepIndex = (updater: number | ((i: number) => number)) => {
    const next =
      typeof updater === "function"
        ? (updater as (i: number) => number)(stepIndex)
        : updater;
    if (isControlled) {
      // Controlled: delegate to parent
      onStepChange!(Math.max(0, Math.min(next, steps.length - 1)));
    } else {
      // Uncontrolled or missing handler: update internal state
      setInternalStepIndex(Math.max(0, Math.min(next, steps.length - 1)));
    }
  };
  const {
    configuration: _configuration,
    hasPart2BeenActive: _hasPart2BeenActive,
    hasPart3BeenActive: _hasPart3BeenActive,
  } = useConfiguratorStore();

  const configItem = useMemo(() => {
    return items.find((it) => "nest" in it && it.nest) as
      | ConfigurationCartItem
      | undefined;
  }, [items]);

  const [localSelectedPlan, setLocalSelectedPlan] = useState<string | null>(
    ((): string | null => {
      const initial = (
        items.find((it) => "nest" in it && it.nest) as
          | ConfigurationCartItem
          | undefined
      )?.planungspaket?.value;
      return initial ?? null;
    })()
  );

  useEffect(() => {
    setLocalSelectedPlan(configItem?.planungspaket?.value ?? null);
  }, [configItem?.planungspaket?.value]);

  // Scroll detection for top forward button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if user has scrolled to within 100px of the bottom
      const hasReachedBottom = scrollTop + windowHeight >= documentHeight - 100;
      setHasScrolledToBottom(hasReachedBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = CHECKOUT_STEPS;

  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const goPrev = () => setStepIndex((i) => Math.max(i - 1, 0));

  const ensureGrundstueckscheckIncluded = () => {
    if (!configItem) return;
    const previousPrice = configItem.grundstueckscheck?.price || 0;

    const updated: ConfigurationCartItem = {
      ...configItem,
      grundstueckscheck: {
        category: "grundstueckscheck",
        value: "grundstueckscheck",
        name: "Grundstückscheck",
        price: 0,
        description: "Grundstückscheck",
      },
      totalPrice: Math.max(0, (configItem.totalPrice || 0) - previousPrice),
    };

    removeFromCart(configItem.id);
    addConfigurationToCart(updated);
  };

  const setPlanningPackage = (value: string) => {
    if (!configItem) return;
    const target = PLANNING_PACKAGES.find((p) => p.value === value);
    if (!target) return;

    const previousPrice = configItem.planungspaket?.price || 0;
    const updated: ConfigurationCartItem = {
      ...configItem,
      planungspaket: {
        category: "planungspaket",
        value: target.value,
        name: target.name,
        price: target.price,
        description: target.description.replace(/\n/g, " "),
      },
      totalPrice: Math.max(
        0,
        (configItem.totalPrice || 0) - previousPrice + target.price
      ),
    };

    removeFromCart(configItem.id);
    addConfigurationToCart(updated);
  };

  // Helpers for Überblick step
  const calculateMonthlyPayment = (price: number) => {
    const months = 240;
    const interestRate = 0.035 / 12;
    const monthlyPayment =
      (price * (interestRate * Math.pow(1 + interestRate, months))) /
      (Math.pow(1 + interestRate, months) - 1);
    return PriceUtils.formatPrice(monthlyPayment);
  };

  const getCategoryDisplayName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      nest: "Nest",
      gebaeudehuelle: "Gebäudehülle",
      innenverkleidung: "Innenverkleidung",
      fussboden: "Fußboden",
      pvanlage: "PV-Anlage",
      fenster: "Fenster",
      planungspaket: "Planungspaket",
      grundstueckscheck: "Grundstückscheck",
    };
    return categoryNames[category] || category;
  };

  const getConfigurationTitle = (
    item: CartItem | ConfigurationCartItem
  ): string => {
    if ("nest" in item) {
      if (item.nest?.name) return item.nest.name;
      if (item.grundstueckscheck && !item.nest) return "Grundstückscheck";
      return "Nest Konfiguration";
    }
    if ("name" in item) return item.name;
    return "Artikel";
  };

  const renderConfigurationDetails = (
    item: CartItem | ConfigurationCartItem
  ) => {
    const details: Array<{
      label: string;
      value: string;
      price: number;
      isIncluded: boolean;
      category: string;
      isBottomItem?: boolean;
    }> = [];

    if ("nest" in item) {
      const configEntries = Object.entries(item).filter(
        ([key, selection]) =>
          selection &&
          key !== "sessionId" &&
          key !== "totalPrice" &&
          key !== "timestamp" &&
          key !== "id" &&
          key !== "addedAt" &&
          key !== "isFromConfigurator" &&
          key !== "nest"
      );

      const { middleItems, bottomItems } =
        PriceUtils.sortConfigurationEntries(configEntries);

      middleItems.forEach(([key, selection]) => {
        if (
          [
            "gebaeudehuelle",
            "innenverkleidung",
            "fussboden",
            "pvanlage",
            "fenster",
          ].includes(key)
        ) {
          let displayName = selection.name;
          let displayPrice = selection.price || 0;

          if (key === "fenster" && selection.squareMeters) {
            displayName = `${selection.name} (${selection.squareMeters}m²)`;
            displayPrice =
              (selection.squareMeters || 1) * (selection.price || 0);
          } else if (
            key === "pvanlage" &&
            selection.quantity &&
            selection.quantity > 1
          ) {
            displayName = `${selection.name} (${selection.quantity}x)`;
            displayPrice = (selection.quantity || 1) * (selection.price || 0);
          }

          const isIncluded = displayPrice === 0;

          details.push({
            label: getCategoryDisplayName(key),
            value: displayName,
            price: isIncluded ? 0 : displayPrice,
            isIncluded,
            category: key,
            isBottomItem: false,
          });
        }
      });

      bottomItems.forEach(([key, selection]) => {
        if (key === "planungspaket" || key === "grundstueckscheck") {
          const displayName = selection.name;
          const displayPrice = selection.price || 0;
          const isIncluded = displayPrice === 0;

          details.push({
            label: getCategoryDisplayName(key),
            value: displayName,
            price: isIncluded ? 0 : displayPrice,
            isIncluded,
            category: key,
            isBottomItem: true,
          });
        }
      });
    }

    return details;
  };

  const getNextPlanungspaket = (currentPackage?: string) => {
    const packageHierarchy = [
      { id: "basis", name: "Planung Basis", price: 8900 },
      { id: "plus", name: "Planung Plus", price: 13900 },
      { id: "pro", name: "Planung Pro", price: 18900 },
    ];
    if (!currentPackage) return packageHierarchy[0];
    const currentIndex = packageHierarchy.findIndex(
      (pkg) => pkg.id === currentPackage
    );
    if (currentIndex !== -1 && currentIndex < packageHierarchy.length - 1) {
      return packageHierarchy[currentIndex + 1];
    }
    return null;
  };

  const _getUpgradeSuggestion = (item: CartItem | ConfigurationCartItem) => {
    if (!("nest" in item) || !item.nest) return null;
    const currentPlanungspaket = item.planungspaket?.value;
    const nextPlanungspaket = getNextPlanungspaket(currentPlanungspaket);
    if (nextPlanungspaket) {
      const currentPrice = item.planungspaket?.price || 0;
      const upgradePrice = nextPlanungspaket.price - currentPrice;
      return {
        type: "planungspaket" as const,
        name: nextPlanungspaket.name,
        price: upgradePrice,
        description: `Planungspaket ${nextPlanungspaket.name} hinzufügen`,
      };
    }
    if (!item.grundstueckscheck) {
      return {
        type: "grundstueckscheck" as const,
        name: "Grundstückscheck",
        price: 2000,
        description: "Grundstückscheck hinzufügen",
      };
    }
    return null;
  };

  const renderProgress = () => {
    return (
      <div className="w-full mb-6">
        {/* Desktop/Tablet */}
        <div className="relative hidden md:block">
          <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-200" />
          <div
            className="absolute left-0 top-3 h-0.5 bg-blue-600 transition-all"
            style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
          />
          <div className="grid grid-cols-5 gap-0">
            {steps.map((label, idx) => {
              const isDone = idx < stepIndex;
              const isCurrent = idx === stepIndex;
              const circleClass = isDone
                ? "bg-blue-600 border-blue-600"
                : isCurrent
                ? "bg-white border-blue-600"
                : "bg-white border-gray-300";
              const dotInner = isDone ? (
                <span className="w-2 h-2 bg-white rounded-full" />
              ) : null;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center ${circleClass}`}
                    aria-label={`Schritt ${idx + 1}: ${label}`}
                  >
                    {dotInner}
                  </div>
                  <div className="mt-2 text-sm text-center text-gray-700 leading-tight break-words px-1">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: two rows with circles and labels */}
        <div className="md:hidden">
          {/* Top row with connecting line and fill */}
          <div className="relative mb-1">
            <div className="absolute left-0 right-0 top-2.5 h-0.5 bg-gray-200" />
            <div
              className="absolute left-0 top-2.5 h-0.5 bg-blue-600 transition-all"
              style={{
                width: `${Math.min(100, (Math.min(stepIndex, 2) / 2) * 100)}%`,
              }}
            />
            <div className="grid grid-cols-3 gap-2">
              {steps.slice(0, 3).map((label, i) => {
                const idx = i;
                const isDone = idx < stepIndex;
                const isCurrent = idx === stepIndex;
                const circleClass = isDone
                  ? "bg-blue-600 border-blue-600"
                  : isCurrent
                  ? "bg-white border-blue-600"
                  : "bg-white border-gray-300";
                const dotInner = isDone ? (
                  <span className="w-2 h-2 bg-white rounded-full" />
                ) : null;
                return (
                  <div
                    key={`mrow1-${idx}`}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center ${circleClass}`}
                    >
                      {dotInner}
                    </div>
                    <div className="mt-1 text-[11px] text-center text-gray-700 leading-tight break-words px-1">
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Bottom row with connecting line and fill */}
          <div className="relative mt-2">
            <div className="absolute left-0 right-0 top-2.5 h-0.5 bg-gray-200" />
            <div
              className="absolute left-0 top-2.5 h-0.5 bg-blue-600 transition-all"
              style={{ width: `${stepIndex >= 4 ? 100 : 0}%` }}
            />
            <div className="grid grid-cols-2 gap-2">
              {steps.slice(3).map((label, i) => {
                const idx = i + 3;
                const isDone = idx < stepIndex;
                const isCurrent = idx === stepIndex;
                const circleClass = isDone
                  ? "bg-blue-600 border-blue-600"
                  : isCurrent
                  ? "bg-white border-blue-600"
                  : "bg-white border-gray-300";
                const dotInner = isDone ? (
                  <span className="w-2 h-2 bg-white rounded-full" />
                ) : null;
                return (
                  <div
                    key={`mrow2-${idx}`}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center ${circleClass}`}
                    >
                      {dotInner}
                    </div>
                    <div className="mt-1 text-[11px] text-center text-gray-700 leading-tight break-words px-1">
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const copyByStep: Array<{
    title: string;
    subtitle: string;
    description: string;
  }> = [
    {
      title: "Bereit für dein neues Zuhause?",
      subtitle:
        "In wenigen Schritten zu deinem neuen Zuhause - ganz ohne Verpflichtungen!",
      description:
        "Du hast dich für dein Nest-Haus entschieden. In den nächsten Schritten klären wir gemeinsam, was wir von dir benötigen und was wir für dich übernehmen, damit dein Zuhause genau so wird, wie du es dir wünschst. \n\n Wir kümmern uns um die Rahmenbedingungen und rechtlichen Schritte. Bis dahin zahlst du nur für unseren Service – keine Verpflichtung, falls etwas nicht passt.",
    },
    {
      title: "Eine starke Basis",
      subtitle: "Vorentwurf und Grundstückscheck",
      description:
        "Mit dem **Grundstückscheck** prüfen wir alle **relevanten Rahmenbedingungen** wie Bebauungsrichtlinien, Abstände, Zufahrten und Anschlüsse. So weißt du von Anfang an, womit du planen kannst und hast die **Sicherheit**, dass dein Projekt auf **soliden Grundlagen** steht.\n\nIm **Vorentwurf** legen wir gemeinsam die Position deiner Fenster und Türen fest. Schritt für Schritt entsteht so **ein Grundriss, der zu deinem Alltag passt**. All diese Leistungen sind Teil des **Planungspakets Basis**, das bereits **im Preis** deines Nest Hauses **enthalten ist**.",
    },
    {
      title: "Wähle dein Planungspaket",
      subtitle: "Basis ist inkludiert – Upgrades jederzeit möglich.",
      description:
        "Starte mit dem Basis-Paket oder wähle Plus/Pro für mehr Leistungen. Wir erstellen die Einreichplanung, koordinieren Technik und unterstützen dich bei allen Schritten. Du kannst später jederzeit upgraden. Preise sind transparent – du zahlst nur, was du brauchst.",
    },
    {
      title: "Termin vereinbaren",
      subtitle: "Persönlich oder telefonisch – wie es dir am besten passt.",
      description:
        "Wähle Datum und Uhrzeit und entscheide, ob du ein persönliches Gespräch oder einen Telefontermin möchtest. Wir besprechen die Ergebnisse des Grundstückschecks, deine Auswahl und die nächsten Schritte. Der Termin ist kostenlos und unverbindlich.",
    },
    {
      title: "Zusammenfassung & Anfrage",
      subtitle: "Prüfe deine Angaben und sende deine Anfrage.",
      description:
        "Hier siehst du alle Details deiner Auswahl samt Preisen. Nach dem Absenden bestätigen wir alles schriftlich und klären offene Fragen. Bis zur finalen Freigabe entstehen dir keine Bauverpflichtungen und keine Kosten über unseren Service hinaus.",
    },
  ];

  // Helper: parse euro-formatted strings like "€10.900" into integer euros (10900)
  const parseEuro = (s: string): number => {
    const digitsOnly = s.replace(/[^\d]/g, "");
    return digitsOnly ? parseInt(digitsOnly, 10) : 0;
  };

  // Basis price from displayed pricing cards to compute deltas consistently
  const basisDisplayPrice = useMemo(() => {
    const basisCard = (planungspaketeCardData as PlanungspaketeCardData[]).find(
      (c) => c.title.toLowerCase().includes("basis")
    );
    return parseEuro(basisCard?.price || "€0");
  }, []);

  const renderIntro = () => {
    const c = copyByStep[stepIndex];
    const total = getCartTotal();
    const dueNow = 0; // Current upfront payment (service-only) – adjustable later
    const grundstueckscheckDone = Boolean(configItem?.grundstueckscheck);
    const _planungspaketDone = Boolean(configItem?.planungspaket?.value);
    const _terminDone = false; // Integrate with AppointmentBooking state if available

    // Use local selection if available so summary reflects user choice immediately
    const selectedPlanValue =
      localSelectedPlan ?? configItem?.planungspaket?.value ?? null;
    const selectedPlanName = selectedPlanValue
      ? PLANNING_PACKAGES.find((p) => p.value === selectedPlanValue)?.name ||
        selectedPlanValue
      : "—";
    const isPlanSelected = Boolean(selectedPlanValue);

    const rowWrapperClass =
      "flex items-center justify-between gap-4 py-3 md:py-4 px-6 md:px-7";
    const rowTextClass = (rowStep: number) =>
      stepIndex === rowStep ? "text-gray-900" : "text-gray-400";
    const getRowSubtitle = (rowStep: number): string => {
      switch (rowStep) {
        case 0:
          return "Preis deiner Auswahl";
        case 1:
          return "Prüfung deines Grundstücks";
        case 2:
          return "Gewähltes Planungsniveau";
        case 3:
          return "Terminplanung";
        default:
          return "Voraussichtliches Datum";
      }
    };
    return (
      <div className="flex flex-col gap-6">
        <div className="w-full">
          {stepIndex === 4 ? (
            <div className="pt-4 md:pt-6 pb-2 md:pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="text-left">
                  <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900">
                    Garantierter Liefertermin
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900">
                    {deliveryDateString}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-2 md:mb-3 text-gray-900 whitespace-pre-line">
                {stepIndex === 0 ? "Bereit einzuziehen?" : c.title}
              </h1>
              <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto text-center whitespace-pre-line">
                {stepIndex === 0 ? "Liefergarantie von 6 Monaten" : c.subtitle}
              </h3>
            </div>
          )}
          <div className="w-full"></div>
        </div>
        {/* Timeline directly after title/subtitle */}
        {!hideProgress && <div className="mb-6">{renderProgress()}</div>}
        <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-6">
          <div className="w-full md:w-1/2 text-left px-12 md:px-16 lg:px-24">
            {stepIndex === 0 ? (
              <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-500 leading-relaxed text-center md:text-left">
                <p>
                  Du hast dich für {""}
                  <span className="text-black">dein Nest-Haus</span> {""}
                  entschieden. In den nächsten Schritten klären wir gemeinsam,
                  was wir von dir benötigen und was wir für dich übernehmen,
                  damit {""}
                  <span className="text-black">dein Zuhause genau so</span> {""}
                  wird, wie du es dir wünschst.
                </p>
                <p className="mt-6">
                  <span className="text-black">Wir kümmern uns</span> um die
                  Rahmenbedingungen und rechtlichen Schritte. Bis dahin zahlst
                  du nur für unseren Service – {""}
                  <span className="text-black">keine Verpflichtung</span>, falls
                  etwas nicht passt.
                </p>
              </div>
            ) : (
              <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-500 leading-relaxed whitespace-pre-line text-center md:text-left">
                {c.description.split("\n").map((paragraph, index) => (
                  <p key={index} className={index > 0 ? "mt-6" : ""}>
                    {paragraph
                      .split(/(\*\*[^*]+\*\*)/)
                      .map((part, partIndex) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return (
                            <span key={partIndex} className="text-black">
                              {part.slice(2, -2)}
                            </span>
                          );
                        }
                        return part;
                      })}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2">
            <div className="w-full max-w-[520px] ml-auto mt-1 md:mt-2">
              <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-500 mb-3">
                <span className="text-black">Dein Preis</span>
                <span className="text-gray-300"> Überblick</span>
              </h2>
              <div className="border border-gray-300 rounded-2xl md:min-w-[260px] w-full overflow-hidden">
                <div>
                  <div className={rowWrapperClass}>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(
                          0
                        )}`}
                      >
                        Dein Nest Haus
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                        {getRowSubtitle(0)}
                      </div>
                    </div>
                    <div
                      className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(
                        0
                      )}`}
                    >
                      {PriceUtils.formatPrice(total)}
                    </div>
                  </div>
                  <div className={rowWrapperClass}>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(
                          1
                        )}`}
                      >
                        Grundstückscheck
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                        {getRowSubtitle(1)}
                      </div>
                    </div>
                    <div
                      className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(
                        1
                      )}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {PriceUtils.formatPrice(3000)}
                        {grundstueckscheckDone && (
                          <span aria-hidden className="text-green-600">
                            ✓
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={rowWrapperClass}>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(
                          2
                        )}`}
                      >
                        Planungspaket
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                        {getRowSubtitle(2)}
                      </div>
                    </div>
                    <div
                      className={`text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed ${rowTextClass(
                        2
                      )}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {selectedPlanName}
                        {isPlanSelected && (
                          <span aria-hidden className="text-green-600">
                            ✓
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={rowWrapperClass}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-400">
                        Termin mit dem Nest Team
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                        {getRowSubtitle(3)}
                      </div>
                    </div>
                    <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-400">
                      —
                    </div>
                  </div>
                  <div className={rowWrapperClass}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-400">
                        Garantierter Liefertermin
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                        {getRowSubtitle(4)}
                      </div>
                    </div>
                    <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-400">
                      —
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 rounded-2xl w-full overflow-hidden mt-3 md:mt-4">
                <div className={rowWrapperClass}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-900 leading-relaxed">
                      Heute zu bezahlen
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                      Grundstückscheck
                    </div>
                  </div>
                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-900 leading-relaxed">
                    {PriceUtils.formatPrice(dueNow)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width GrundstueckCheckForm section for step 2 */}
        {stepIndex === 1 && (
          <div className="mt-16">
            <div className="text-center mb-8 pt-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-2 md:mb-3">
                Dein Grundstück - Unser Check
              </h2>
              <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8 pb-4 max-w-3xl mx-auto">
                Wir Prüfen deinen Baugrund
              </h3>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-6">
              <div className="w-full md:w-1/2 text-left px-12 md:px-16 lg:px-24">
                <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-gray-500 leading-relaxed mb-4 mt-12">
                  Wir prüfen, ob{" "}
                  <span className="text-black">dein Grundstück</span> die
                  gesetzlichen{" "}
                  <span className="text-black">Anforderungen erfüllt</span>.
                  Dazu gehören das jeweilige{" "}
                  <span className="text-black">Landesbaugesetz</span>, das{" "}
                  <span className="text-black">Raumordnungsgesetz</span> und die{" "}
                  <span className="text-black">örtlichen Vorschriften</span>,
                  damit dein Bauvorhaben von Beginn an auf{" "}
                  <span className="text-black">sicheren Grundlagen</span> steht.
                </p>
                <div className="h-3"></div>
                <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-gray-500 leading-relaxed mb-6">
                  Außerdem analysieren wir die{" "}
                  <span className="text-black">Eignung des Grundstücks</span>{" "}
                  für dein Nest Haus. Dabei geht es um alle notwendigen
                  Voraussetzungen, die für Planung und Aufbau entscheidend sind,
                  sodass{" "}
                  <span className="text-black">
                    dein Zuhause zuverlässig und ohne Hindernisse
                  </span>{" "}
                  entstehen kann.
                </p>

                <div className="mt-2 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base"></h4>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <div className="w-full max-w-[520px] ml-auto mt-1 md:mt-2">
                  <GrundstueckCheckForm
                    backgroundColor="white"
                    maxWidth={false}
                    padding="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStepHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="secondary-narrow"
        size="xs"
        onClick={goPrev}
        disabled={stepIndex <= 0}
      >
        Zurück
      </Button>
      <div className="text-sm text-gray-600">{steps[stepIndex]}</div>
      <Button
        variant="primary-narrow"
        size="xs"
        onClick={goNext}
        disabled={stepIndex >= steps.length - 1 || !hasScrolledToBottom}
      >
        Weiter
      </Button>
    </div>
  );

  const _renderOverviewPrice = () => (
    <div className="border border-gray-300 rounded-[19px] px-6 py-4">
      <div className="flex justify-between items-center gap-4">
        <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black">
          Gesamt:
        </div>
        <div className="text-black text-[clamp(16px,3vw,18px)] font-medium tracking-[-0.015em] leading-[1.2]">
          {PriceUtils.formatPrice(getCartTotal())}
        </div>
      </div>
    </div>
  );

  // Compute guaranteed delivery date (6 months from now)
  const deliveryDateString = useMemo(() => {
    const date = new Date();
    const currentMonth = date.getMonth();
    date.setMonth(currentMonth + 6);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  // Decide which configuration to use for images: prefer the cart's config item
  const sourceConfig = useMemo(() => {
    return (configItem as ConfigurationCartItem | undefined) || undefined;
  }, [configItem]);

  // Determine interior availability based on actual selections in the source config
  const interiorActive = useMemo(() => {
    return Boolean(
      sourceConfig?.innenverkleidung ||
        sourceConfig?.fussboden ||
        _hasPart2BeenActive
    );
  }, [
    sourceConfig?.innenverkleidung,
    sourceConfig?.fussboden,
    _hasPart2BeenActive,
  ]);

  // Gallery state for overview step (uses the cart configuration images)
  const availableViews: ViewType[] = useMemo(() => {
    return ImageManager.getAvailableViews(sourceConfig || null, interiorActive);
  }, [sourceConfig, interiorActive]);

  const galleryViews: ViewType[] = useMemo(() => {
    return availableViews && availableViews.length > 0
      ? availableViews
      : (["exterior"] as ViewType[]);
  }, [availableViews]);

  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  useEffect(() => {
    setGalleryIndex(0);
  }, [galleryViews.length]);

  const currentView: ViewType =
    galleryViews[Math.min(galleryIndex, galleryViews.length - 1)] || "exterior";
  const currentImagePath = ImageManager.getPreviewImage(
    sourceConfig || null,
    currentView
  );

  const goPrevImage = () =>
    setGalleryIndex((i) => (i - 1 + galleryViews.length) % galleryViews.length);
  const goNextImage = () =>
    setGalleryIndex((i) => (i + 1) % galleryViews.length);

  useEffect(() => {
    ImageManager.preloadImages(sourceConfig || null);
  }, [sourceConfig]);

  // No extra memoization for summary; rely on lightweight renderer

  return (
    <section className="w-full py-16">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {renderIntro()}
        <div className="mt-6 pt-6">
          {stepIndex === 0 && (
            <div className="space-y-6 pt-8">
              {/* Overview grid: cart on left, summary/upgrade on right */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="space-y-6 w-full max-w-[520px] lg:flex-none">
                  <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-500">
                    <span className="text-black">Dein Nest</span>
                    <span className="text-gray-300"> Deine Konfiguration</span>
                  </h2>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-300 rounded-[19px] px-6 py-4"
                    >
                      <div className="flex items-center justify-between gap-4 py-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900 break-words">
                            {getConfigurationTitle(item)}
                          </div>
                          <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1">
                            {(() => {
                              const priceValue =
                                "totalPrice" in item &&
                                (item as ConfigurationCartItem).nest
                                  ? (item as ConfigurationCartItem).nest
                                      ?.price || 0
                                  : "totalPrice" in item
                                  ? (item as ConfigurationCartItem).totalPrice
                                  : (item as CartItem).price;
                              return `oder ${calculateMonthlyPayment(
                                priceValue
                              )} für 240 Monate`;
                            })()}
                          </div>
                        </div>
                        <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-900 leading-relaxed min-w-0">
                          {PriceUtils.formatPrice(
                            "totalPrice" in item &&
                              (item as ConfigurationCartItem).nest
                              ? (item as ConfigurationCartItem).nest?.price || 0
                              : "totalPrice" in item
                              ? (item as ConfigurationCartItem).totalPrice
                              : (item as CartItem).price
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {(() => {
                          const details = renderConfigurationDetails(item);
                          const topAndMiddleItems = details.filter(
                            (d) => !d.isBottomItem
                          );
                          const bottomItems = details.filter(
                            (d) => d.isBottomItem
                          );

                          const renderDetailItem = (
                            detail: {
                              label: string;
                              value: string;
                              price: number;
                              isIncluded: boolean;
                              category: string;
                              isBottomItem?: boolean;
                            },
                            idx: number
                          ) => {
                            if (!detail.value || detail.value === "—")
                              return null;
                            return (
                              <div
                                key={detail.category + "-" + idx}
                                className="flex items-center justify-between gap-4 py-3"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal leading-relaxed text-gray-900 break-words">
                                    {detail.value}
                                  </div>
                                  <div className="text-xs md:text-sm text-gray-500 leading-snug mt-1 break-words">
                                    {detail.label}
                                  </div>
                                </div>
                                <div className="text-right min-w-0">
                                  {detail.isIncluded ||
                                  (detail.price && detail.price === 0) ? (
                                    <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-500 leading-relaxed">
                                      inkludiert
                                    </div>
                                  ) : (
                                    <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-900 leading-relaxed">
                                      {PriceUtils.formatPrice(
                                        detail.price || 0
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          };

                          return (
                            <>
                              {topAndMiddleItems.map(renderDetailItem)}
                              {bottomItems.length > 0 && (
                                <div>
                                  {bottomItems.map((detail, idx) => (
                                    <div key={detail.category + "-" + idx}>
                                      {renderDetailItem(detail, idx)}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 w-full lg:flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-500">
                    <span className="text-black">Dein Nest</span>
                    <span className="text-gray-300">
                      {" "}
                      Ein Einblick in die Zukunft
                    </span>
                  </h2>
                  {/* Configuration Image Gallery */}
                  <div className="border border-gray-300 rounded-[19px] overflow-hidden bg-transparent">
                    <div
                      className="relative w-full"
                      style={{ aspectRatio: "16/10" }}
                    >
                      <HybridBlobImage
                        key={`${currentView}:${currentImagePath}`}
                        path={currentImagePath}
                        alt={`Konfiguration Vorschau – ${currentView}`}
                        fill
                        className="object-contain"
                        strategy="client"
                        isInteractive={true}
                        sizes="(max-width: 1023px) 100vw, 70vw"
                        quality={85}
                        priority={true}
                      />
                      {galleryViews.length > 1 && (
                        <>
                          <button
                            type="button"
                            aria-label="Vorheriges Bild"
                            onClick={goPrevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center border border-gray-300 shadow"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            aria-label="Nächstes Bild"
                            onClick={goNextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center border border-gray-300 shadow"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>
                    {galleryViews.length > 1 && (
                      <div className="flex items-center justify-center gap-2 py-2">
                        {galleryViews.map((v, i) => (
                          <button
                            key={v + i}
                            type="button"
                            aria-label={`Wechsel zu Ansicht ${v}`}
                            onClick={() => setGalleryIndex(i)}
                            className={
                              "w-2.5 h-2.5 rounded-full " +
                              (i === galleryIndex
                                ? "bg-blue-600"
                                : "bg-gray-300")
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-10 md:mt-14">
                <Button
                  variant="landing-secondary-blue"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={goPrev}
                  disabled={stepIndex <= 0}
                >
                  Neu konfigurieren
                </Button>
                <span className="inline-block w-3" />
                <Button
                  variant="primary"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={goNext}
                >
                  Nächster Schritt
                </Button>
              </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-4 pt-8">
              {/* Process Steps Cards */}
              <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">
                So läuft der Prozess ab:
              </h4>

              <CheckoutStepCard
                cards={defaultSquareTextCardData}
                maxWidth={true}
              />

              <div className="flex justify-center mt-10 md:mt-14">
                <Button
                  variant="landing-secondary-blue"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={goPrev}
                  disabled={stepIndex <= 0}
                >
                  Zurück
                </Button>
                <span className="inline-block w-3" />
                <Button
                  variant="primary"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={() => {
                    ensureGrundstueckscheckIncluded();
                    goNext();
                  }}
                >
                  Nächster Schritt
                </Button>
              </div>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-4 pt-8">
              <div className="space-y-6">
                {(planungspaketeCardData as PlanungspaketeCardData[])
                  .slice(0, 3)
                  .map((card) => {
                    const value = card.title.toLowerCase().includes("pro")
                      ? "pro"
                      : card.title.toLowerCase().includes("plus")
                      ? "plus"
                      : "basis";
                    const isSelected = localSelectedPlan === value;
                    const isBasis = value === "basis";
                    const cardPriceNumber = parseEuro(card.price);
                    const deltaPrice = Math.max(
                      0,
                      cardPriceNumber - basisDisplayPrice
                    );
                    return (
                      <div key={card.id}>
                        <div
                          className={
                            "w-full rounded-3xl overflow-hidden border bg-white " +
                            (isSelected ? "border-blue-600" : "border-gray-300")
                          }
                        >
                          {/* Top Section */}
                          <div className="px-6 pt-6 pb-4">
                            {/* Header Row - Title/Subtitle left, Price right */}
                            <div className="flex mb-5">
                              {/* Title/Subtitle - Left Side */}
                              <div className="flex-1 pr-3">
                                <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 mb-2">
                                  {card.title}
                                </div>
                                {card.subtitle && (
                                  <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-normal text-gray-700">
                                    {card.subtitle}
                                  </div>
                                )}
                              </div>
                              {/* Price - Right Side */}
                              <div className="w-24 md:w-32 flex flex-col justify-start items-end text-right">
                                <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                                  {isBasis ? (
                                    <span className="text-green-600">
                                      inkludiert
                                    </span>
                                  ) : (
                                    PriceUtils.formatPrice(deltaPrice)
                                  )}
                                </div>
                                <div className="text-xs md:text-sm font-medium text-gray-600 line-through opacity-60">
                                  {card.price}
                                </div>
                              </div>
                            </div>
                            {/* Description */}
                            <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-600 leading-relaxed whitespace-pre-line">
                              {card.description}
                            </div>
                          </div>

                          {/* Extended Description */}
                          {card.extendedDescription && (
                            <div className="px-6 pt-2 pb-4">
                              <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 leading-relaxed whitespace-pre-line">
                                {card.extendedDescription}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Select Button below the card */}
                        <div className="pt-3 pb-6 flex justify-center">
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() => setLocalSelectedPlan(value)}
                          >
                            Paket auswählen
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="flex justify-center mt-10 md:mt-14">
                <Button
                  variant="landing-secondary-blue"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={goPrev}
                  disabled={stepIndex <= 0}
                >
                  Zurück
                </Button>
                <span className="inline-block w-3" />
                <Button
                  variant="primary"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={() => {
                    if (localSelectedPlan) {
                      setPlanningPackage(localSelectedPlan);
                    }
                    goNext();
                  }}
                >
                  Nächster Schritt
                </Button>
              </div>
            </div>
          )}

          {stepIndex === 3 && (
            <div className="space-y-4 pt-8">
              <AppointmentBooking showLeftSide={false} />

              <div className="flex justify-center mt-10 md:mt-14">
                <Button
                  variant="landing-secondary-blue"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={goPrev}
                  disabled={stepIndex <= 0}
                >
                  Zurück
                </Button>
                <span className="inline-block w-3" />
                <Button
                  variant="primary"
                  size="xs"
                  className="whitespace-nowrap"
                  onClick={goNext}
                >
                  Nächster Schritt
                </Button>
              </div>
            </div>
          )}

          {stepIndex === 4 && (
            <div className="space-y-4 pt-8">
              <div className="pt-2"></div>
              {/* Title row replaced above - keep spacing consistent */}
              {/* Deine Auswahl Title */}
              <div className="pt-2"></div>
              <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900">
                Deine Auswahl:
              </div>
              <div className="pb-2"></div>

              <div className="space-y-4">
                {configItem ? (
                  <>
                    {(() => {
                      const details = renderConfigurationDetails(configItem);
                      const topAndMiddleItems = details.filter(
                        (d) => !d.isBottomItem
                      );
                      const _bottomItems = details.filter(
                        (d) => d.isBottomItem
                      );

                      const renderDetailItem = (
                        detail: {
                          label: string;
                          value: string;
                          price: number;
                          isIncluded: boolean;
                          category: string;
                          isBottomItem?: boolean;
                          selectionValue?: string;
                        },
                        idx: number
                      ) => {
                        if (!detail.value || detail.value === "—") return null;
                        return (
                          <div
                            key={detail.category + "-" + idx}
                            className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4"
                          >
                            <div className="flex-1 min-w-0 max-w-[50%]">
                              <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                                {detail.value}
                              </div>
                              <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                                {detail.label}
                              </div>
                            </div>
                            <div className="flex-1 text-right max-w-[50%] min-w-0">
                              {detail.isIncluded ||
                              (detail.price && detail.price === 0) ? (
                                <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-600">
                                  inkludiert
                                </div>
                              ) : (
                                <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                                  {PriceUtils.formatPrice(detail.price || 0)}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      };

                      return (
                        <>
                          {topAndMiddleItems.length > 0 && (
                            <div className="border border-gray-300 rounded-[19px] px-6 py-4 bg-white">
                              {topAndMiddleItems.map(renderDetailItem)}
                            </div>
                          )}
                          <div className="border border-gray-300 rounded-[19px] px-6 py-4 bg-white">
                            {/* Grundstückscheck row */}
                            {configItem?.grundstueckscheck && (
                              <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                                <div className="flex-1 min-w-0 max-w-[50%]">
                                  <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                                    {configItem.grundstueckscheck.name}
                                  </div>
                                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                                    Grundstückscheck
                                  </div>
                                </div>
                                <div className="flex-1 text-right max-w-[50%] min-w-0">
                                  <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                                    {PriceUtils.formatPrice(3000)}
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* Planungspaket row - show if exists in cart OR if locally selected */}
                            {(configItem?.planungspaket ||
                              localSelectedPlan) && (
                              <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                                <div className="flex-1 min-w-0 max-w-[50%]">
                                  <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                                    {(() => {
                                      // Get name from cart item first
                                      if (configItem?.planungspaket?.name) {
                                        return configItem.planungspaket.name;
                                      }
                                      // Otherwise get from pricing cards based on localSelectedPlan
                                      if (localSelectedPlan) {
                                        const pricingCard = (
                                          planungspaketeCardData as PlanungspaketeCardData[]
                                        ).find((card) => {
                                          const cardValue = card.title
                                            .toLowerCase()
                                            .includes("pro")
                                            ? "pro"
                                            : card.title
                                                .toLowerCase()
                                                .includes("plus")
                                            ? "plus"
                                            : "basis";
                                          return (
                                            cardValue === localSelectedPlan
                                          );
                                        });
                                        return (
                                          pricingCard?.title ||
                                          localSelectedPlan
                                        );
                                      }
                                      return "—";
                                    })()}
                                  </div>
                                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                                    Planungspaket
                                  </div>
                                </div>
                                <div className="flex-1 text-right max-w-[50%] min-w-0">
                                  {(() => {
                                    // Get pricing info from cart item first
                                    if (
                                      configItem?.planungspaket?.price !==
                                      undefined
                                    ) {
                                      // For cart items, we might not have the full pricing card info
                                      // So we'll try to find the matching pricing card for display consistency
                                      const matchingCard = (
                                        planungspaketeCardData as PlanungspaketeCardData[]
                                      ).find(
                                        (card) =>
                                          card.title ===
                                          configItem.planungspaket?.name
                                      );
                                      if (matchingCard) {
                                        const isBasis = matchingCard.title
                                          .toLowerCase()
                                          .includes("basis");
                                        const fullPrice = parseEuro(
                                          matchingCard.price
                                        );
                                        const deltaPrice = Math.max(
                                          0,
                                          fullPrice - basisDisplayPrice
                                        );

                                        return (
                                          <div className="flex flex-col items-end">
                                            <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 mb-1">
                                              {isBasis ? (
                                                <span className="text-green-600">
                                                  inkludiert
                                                </span>
                                              ) : (
                                                PriceUtils.formatPrice(
                                                  deltaPrice
                                                )
                                              )}
                                            </div>
                                            <div className="text-xs md:text-sm font-medium text-gray-600 line-through opacity-60">
                                              {matchingCard.price}
                                            </div>
                                          </div>
                                        );
                                      }
                                      // Fallback if no matching card found
                                      return (
                                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                                          {PriceUtils.formatPrice(
                                            configItem.planungspaket.price
                                          )}
                                        </div>
                                      );
                                    }

                                    // Otherwise get from pricing cards based on localSelectedPlan
                                    if (localSelectedPlan) {
                                      const pricingCard = (
                                        planungspaketeCardData as PlanungspaketeCardData[]
                                      ).find((card) => {
                                        const cardValue = card.title
                                          .toLowerCase()
                                          .includes("pro")
                                          ? "pro"
                                          : card.title
                                              .toLowerCase()
                                              .includes("plus")
                                          ? "plus"
                                          : "basis";
                                        return cardValue === localSelectedPlan;
                                      });
                                      if (pricingCard) {
                                        const isBasis =
                                          localSelectedPlan === "basis";
                                        const fullPrice = parseEuro(
                                          pricingCard.price
                                        );
                                        const deltaPrice = Math.max(
                                          0,
                                          fullPrice - basisDisplayPrice
                                        );

                                        return (
                                          <div className="flex flex-col items-end">
                                            <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 mb-1">
                                              {isBasis ? (
                                                <span className="text-green-600">
                                                  inkludiert
                                                </span>
                                              ) : (
                                                PriceUtils.formatPrice(
                                                  deltaPrice
                                                )
                                              )}
                                            </div>
                                            <div className="text-xs md:text-sm font-medium text-gray-600 line-through opacity-60">
                                              {pricingCard.price}
                                            </div>
                                          </div>
                                        );
                                      }
                                    }

                                    return (
                                      <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                                        —
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}
                            {/* Termin mit dem Nest Team row */}
                            <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                              <div className="flex-1 min-w-0 max-w-[50%]">
                                <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                                  —
                                </div>
                                <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                                  Termin mit dem Nest Team
                                </div>
                              </div>
                              <div className="flex-1 text-right max-w-[50%] min-w-0">
                                <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                                  —
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <div className="text-sm text-gray-600">
                    Keine Konfiguration im Warenkorb.
                  </div>
                )}
              </div>

              {/* Teilzahlungen Title */}
              <div className="border-t border-gray-200 pt-2"></div>
              <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900">
                Teilzahlungen:
              </div>
              <div className="border-b border-gray-200 pb-2"></div>

              {/* Instalment Breakdown */}
              {(() => {
                const totalPrice = Math.max(0, getCartTotal());
                const firstPayment = 3000;
                const grundstueckscheckCredit = 3000;
                const secondPaymentOriginal = Math.max(0, totalPrice * 0.3);
                const secondPayment = Math.max(
                  0,
                  secondPaymentOriginal - grundstueckscheckCredit
                );
                const thirdPayment = Math.max(0, totalPrice * 0.5);
                const fourthPayment = Math.max(
                  0,
                  totalPrice -
                    firstPayment -
                    secondPaymentOriginal -
                    thirdPayment
                );
                return (
                  <div className="border border-gray-300 rounded-[19px] px-6 py-4 bg-white">
                    <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                      <div className="flex-1 min-w-0 max-w-[50%]">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                          1. Teilzahlung
                        </div>
                        <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                          Grundstückscheck <br /> Kosten werden bei negativem
                          Erstgespräch rückerstattet
                        </div>
                      </div>
                      <div className="flex-1 text-right max-w-[50%] min-w-0">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                          {PriceUtils.formatPrice(firstPayment)}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                      <div className="flex-1 min-w-0 max-w-[50%]">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                          2. Teilzahlung
                        </div>
                        <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                          30% vom Gesamtpreis <br /> abzüglich Grundstückscheck:{" "}
                          {PriceUtils.formatPrice(grundstueckscheckCredit)}{" "}
                          <br />
                          Planungspaket:
                          <ul className="list-disc list-inside mt-2 text-sm md:text-base lg:text-lg 2xl:text-xl">
                            <li>Einreichplanung des Gesamtprojekts</li>
                            <li>Fachberatung und Baubegleitung</li>
                            <li>Bürokratische Unterstützung</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex-1 text-right max-w-[50%] min-w-0">
                        <div className="flex flex-col items-end">
                          <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 mb-1">
                            {PriceUtils.formatPrice(secondPayment)}
                          </div>
                          <div className="text-xs md:text-sm font-medium text-gray-600 line-through opacity-60">
                            {PriceUtils.formatPrice(secondPaymentOriginal)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                      <div className="flex-1 min-w-0 max-w-[50%]">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                          3. Teilzahlung
                        </div>
                        <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                          50% vom Gesamtpreis <br /> Fällig nach fertigstellung
                          in der Produktion
                        </div>
                      </div>
                      <div className="flex-1 text-right max-w-[50%] min-w-0">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                          {PriceUtils.formatPrice(thirdPayment)}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start border-b border-gray-200 py-3 first:pt-0 last:pb-0 last:border-b-0 gap-4">
                      <div className="flex-1 min-w-0 max-w-[50%]">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                          4. Teilzahlung
                        </div>
                        <div className="text-sm md:text-base lg:text-lg 2xl:text-xl font-normal text-gray-700 leading-relaxed mt-1 break-words">
                          Restbetrag <br /> Fällig nach Errichtung am Grundstück
                        </div>
                      </div>
                      <div className="flex-1 text-right max-w-[50%] min-w-0">
                        <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900">
                          {PriceUtils.formatPrice(fourthPayment)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="border border-gray-300 rounded-[19px] px-6 py-4 bg-blue-50 mt-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0 max-w-[50%]">
                    <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 break-words">
                      Gesamtpreis
                    </div>
                  </div>
                  <div className="flex-1 text-right max-w-[50%] min-w-0">
                    <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 underline">
                      {PriceUtils.formatPrice(getCartTotal())}
                    </div>
                  </div>
                </div>
              </div>

              {/* Moved: Heute zu bezahlen section at the end */}
              <div className="border-t border-gray-200 pt-2"></div>
              <div className="flex items-start justify-between gap-4 py-3">
                <div className="text-left">
                  <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900">
                    Heute zu bezahlen
                  </div>
                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 leading-snug"></div>
                </div>
                <div className="text-right">
                  <div className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900">
                    {PriceUtils.formatPrice(3000)}
                  </div>
                  <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 leading-snug"></div>
                </div>
              </div>
              <div className="border-b border-gray-200 pb-2"></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                <button
                  type="button"
                  className="bg-black text-white py-4 px-12 rounded-full text-[clamp(16px,4vw,20px)] font-medium hover:bg-gray-800 transition-colors"
                >
                  Mit Apple Pay bezahlen
                </button>
                <button
                  type="button"
                  onClick={onScrollToContact}
                  className="bg-blue-600 text-white py-4 px-12 rounded-full text-[clamp(16px,4vw,20px)] font-medium hover:bg-blue-700 transition-colors"
                >
                  Zur Kassa
                </button>
              </div>

              <div className="border border-gray-300 rounded-[19px] px-6 py-4 bg-white mt-6">
                <div className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold text-gray-900 mb-2">
                  Doch anders entschieden?
                </div>
                <div className="text-sm md:text-base lg:text-lg 2xl:text-xl text-gray-700 leading-relaxed">
                  Im Hauspreis enthalten. Bei erfolgreichem ersten Termin und
                  Start des Vorentwurfsplans wird dieser Betrag vollständig vom
                  Gesamtpreis abgezogen. Sollte der Vorentwurfsplan ergeben,
                  dass das Projekt nicht möglich oder unzumutbar ist, erstatten
                  wir den Betrag vollständig.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
