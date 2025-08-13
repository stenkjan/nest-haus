"use client";

import React, { useMemo, useState } from "react";
import { PriceUtils } from "@/app/konfigurator/core/PriceUtils";
import type { CartItem, ConfigurationCartItem } from "@/store/cartStore";
import GrundstueckCheckWrapper from "@/app/kontakt/components/GrundstueckCheckWrapper";
import AppointmentBooking from "@/app/kontakt/components/AppointmentBooking";
import {
  pricingCardData,
  type PricingCardData,
} from "@/components/cards/ContentCards";

interface CheckoutStepperProps {
  items: (CartItem | ConfigurationCartItem)[];
  getCartTotal: () => number;
  removeFromCart: (itemId: string) => void;
  addConfigurationToCart: (config: ConfigurationCartItem) => void;
  onScrollToContact?: () => void;
}

export default function CheckoutStepper({
  items,
  getCartTotal,
  removeFromCart,
  addConfigurationToCart,
  onScrollToContact,
}: CheckoutStepperProps) {
  const [stepIndex, setStepIndex] = useState<number>(0);

  const configItem = useMemo(() => {
    return items.find((it) => "nest" in it && it.nest) as
      | ConfigurationCartItem
      | undefined;
  }, [items]);

  const steps = [
    "Übersicht",
    "Grundstückscheck",
    "Planungspaket",
    "Termin",
    "Zusammenfassung",
  ] as const;

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

  const getUpgradeSuggestion = (item: CartItem | ConfigurationCartItem) => {
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
        <div className="relative">
          {/* Background line */}
          <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-200" />
          {/* Progress line */}
          <div
            className="absolute left-0 top-3 h-0.5 bg-blue-600 transition-all"
            style={{
              width: `${(stepIndex / (steps.length - 1)) * 100}%`,
            }}
          />
          {/* Steps */}
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
                  <div className="mt-2 text-[12px] md:text-sm text-center text-gray-700 leading-tight">
                    {label}
                  </div>
                </div>
              );
            })}
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
      title: "Dein Nest-Haus ist bereit",
      subtitle:
        "Schnell, individuell, stressfrei – wir bringen dein neues Zuhause zu dir.",
      description:
        "Du hast dich für dein Nest-Haus entschieden. In den nächsten Schritten klären wir gemeinsam, was wir von dir benötigen und was wir für dich übernehmen, damit dein Zuhause genau so wird, wie du es dir wünschst. Wir kümmern uns um die Rahmenbedingungen und rechtlichen Schritte. Bis dahin zahlst du nur für unseren Service – keine Verpflichtung, falls etwas nicht passt.",
    },
    {
      title: "Grundstückscheck",
      subtitle: "Wir prüfen Machbarkeit, Vorschriften und Anschlüsse.",
      description:
        "Teile die Daten zu deinem Grundstück – wir prüfen Bebauungsrichtlinien, Abstände, Zufahrt, Versorgungsanschlüsse und rechtliche Rahmenbedingungen. Du erhältst eine klare Einschätzung, ob und wie dein Nest bei dir stehen kann. Der Grundstückscheck ist inkludiert und unverbindlich.",
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

  const renderIntro = () => {
    const c = copyByStep[stepIndex];
    const total = getCartTotal();
    const dueNow = 0; // Current upfront payment (service-only) – adjustable later
    return (
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="md:max-w-3xl">
          <h2 className="font-medium text-2xl md:text-[32px] tracking-[-0.02em] mb-2 text-left">
            {c.title}
          </h2>
          <h3 className="text-lg md:text-xl font-medium tracking-[-0.015em] leading-7 mb-3 text-left text-gray-900">
            {c.subtitle}
          </h3>
          <p className="text-base md:text-[17px] text-gray-600 leading-7 text-left">
            {c.description}
          </p>
        </div>
        <div className="w-full md:w-auto">
          <div className="border border-gray-300 rounded-2xl px-4 py-3 md:min-w-[260px]">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="text-sm text-gray-600">Gesamtpreis</div>
              <div className="text-base md:text-lg font-semibold text-gray-900">
                {PriceUtils.formatPrice(total)}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-600">Heute fällig</div>
              <div className="text-base md:text-lg font-semibold text-gray-900">
                {PriceUtils.formatPrice(dueNow)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <button
        type="button"
        onClick={goPrev}
        disabled={stepIndex === 0}
        className="px-3 py-1 rounded-full border border-gray-300 text-sm disabled:opacity-50"
      >
        Zurück
      </button>
      <div className="text-sm text-gray-600">{steps[stepIndex]}</div>
      <div className="w-[64px]" />
    </div>
  );

  const renderOverviewPrice = () => (
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

  return (
    <div className="border border-gray-300 rounded-[19px] px-6 py-6 bg-white">
      {renderIntro()}
      <div className="mt-6 border-t border-gray-200 pt-6">
        {renderProgress()}
        {renderStepHeader()}

        {stepIndex === 0 && (
          <div className="space-y-6">
            {/* Overview grid: cart on left, summary/upgrade on right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-300 rounded-[19px] px-6 py-4"
                  >
                    <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
                      <div className="flex-1 min-w-0 max-w-[70%]">
                        <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black break-words">
                          {getConfigurationTitle(item)}
                        </div>
                      </div>
                      <div className="flex-1 text-right max-w-[30%] min-w-0">
                        <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                          {PriceUtils.formatPrice(
                            "totalPrice" in item &&
                              (item as ConfigurationCartItem).nest
                              ? (item as ConfigurationCartItem).nest?.price || 0
                              : "totalPrice" in item
                              ? (item as ConfigurationCartItem).totalPrice
                              : (item as CartItem).price
                          )}
                        </div>
                        {(() => {
                          const isConfigItem = "nest" in item;
                          if (isConfigItem) {
                            return !!(item as ConfigurationCartItem).nest;
                          }
                          return true;
                        })() && (
                          <div className="text-[clamp(10px,2.5vw,12px)] text-gray-600 mt-1">
                            oder{" "}
                            {calculateMonthlyPayment(
                              "totalPrice" in item &&
                                (item as ConfigurationCartItem).nest
                                ? (item as ConfigurationCartItem).nest?.price ||
                                    0
                                : "totalPrice" in item
                                ? (item as ConfigurationCartItem).totalPrice
                                : (item as CartItem).price
                            )}{" "}
                            für 240 Monate
                          </div>
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
                              className="flex justify-between items-center border-b border-gray-100 pb-3 gap-4"
                            >
                              <div className="flex-1 min-w-0 max-w-[50%]">
                                <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black break-words">
                                  {detail.value}
                                </div>
                                <div className="font-normal text-[clamp(10px,2.5vw,12px)] tracking-[0.03em] leading-[1.17] text-gray-600 mt-1 break-words">
                                  {detail.label}
                                </div>
                              </div>
                              <div className="flex-1 text-right max-w-[50%] min-w-0">
                                {detail.isIncluded ||
                                (detail.price && detail.price === 0) ? (
                                  <div className="text-gray-500 text-[clamp(12px,2.5vw,14px)]">
                                    inkludiert
                                  </div>
                                ) : (
                                  <div className="text-black text-[clamp(13px,3vw,15px)] font-medium">
                                    {PriceUtils.formatPrice(detail.price || 0)}
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
                              <div className="border-t border-gray-200 pt-6 mt-4">
                                {bottomItems.map((detail, idx) => (
                                  <div
                                    key={detail.category + "-" + idx}
                                    className={
                                      detail.category === "grundstueckscheck"
                                        ? "pt-2"
                                        : ""
                                    }
                                  >
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

              <div className="space-y-6">
                {/* Price Summary Box */}
                <div className="border border-gray-300 rounded-[19px] px-6 py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center gap-4">
                      <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black">
                        Gesamt:
                      </div>
                      <div className="text-black text-[clamp(16px,3vw,18px)] font-medium tracking-[-0.015em] leading-[1.2]">
                        {PriceUtils.formatPrice(getCartTotal())}
                      </div>
                    </div>
                    <div className="text-right">
                      {items.some((it) => {
                        if (!("nest" in it)) return true;
                        return !!(it as ConfigurationCartItem).nest;
                      }) && (
                        <p className="text-[clamp(12px,2.5vw,12px)] text-gray-600 mt-2 leading-[1.3]">
                          oder {calculateMonthlyPayment(getCartTotal())} für 240
                          Monate
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upgrade Box */}
                {(() => {
                  const upgradeItem = items.find(
                    (it) => "nest" in it && (it as ConfigurationCartItem).nest
                  );
                  const upgrade = upgradeItem
                    ? getUpgradeSuggestion(upgradeItem as any)
                    : null;
                  if (!upgrade) return null;
                  return (
                    <div className="border border-gray-300 rounded-[19px] px-6 py-4">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black mb-2">
                            für weitere
                          </div>
                          <div className="text-[clamp(16px,3vw,18px)] font-medium tracking-[-0.015em] leading-[1.2] text-black mb-2">
                            {PriceUtils.formatPrice(upgrade.price)}
                          </div>
                          <div className="font-medium text-[clamp(14px,3vw,16px)] tracking-[0.02em] leading-[1.25] text-black mb-4">
                            {upgrade.description}
                          </div>
                          <button
                            onClick={() => {
                              const upItem = items.find(
                                (it) =>
                                  "nest" in it &&
                                  (it as ConfigurationCartItem).nest
                              ) as ConfigurationCartItem | undefined;
                              if (upItem && upgrade.type === "planungspaket") {
                                const nextPkg = getNextPlanungspaket(
                                  upItem.planungspaket?.value
                                );
                                if (nextPkg) {
                                  const updatedItem: ConfigurationCartItem = {
                                    ...upItem,
                                    planungspaket: {
                                      category: "planungspaket",
                                      value: nextPkg.id,
                                      name: nextPkg.name,
                                      price: nextPkg.price,
                                      description: `Planungspaket ${nextPkg.name}`,
                                    },
                                    totalPrice:
                                      upItem.totalPrice + upgrade.price,
                                  };
                                  removeFromCart(upItem.id);
                                  addConfigurationToCart(updatedItem);
                                }
                              } else if (
                                upItem &&
                                upgrade.type === "grundstueckscheck"
                              ) {
                                const updatedItem: ConfigurationCartItem = {
                                  ...upItem,
                                  grundstueckscheck: {
                                    category: "grundstueckscheck",
                                    value: "grundstueckscheck",
                                    name: "Grundstückscheck",
                                    price: 2000,
                                    description: "Grundstückscheck",
                                  },
                                  totalPrice: upItem.totalPrice + 2000,
                                };
                                removeFromCart(upItem.id);
                                addConfigurationToCart(updatedItem);
                              }
                            }}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-full text-[clamp(14px,3vw,16px)] font-medium hover:bg-gray-200 transition-colors"
                          >
                            Hinzufügen
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={goNext}
                className="bg-blue-600 text-white py-3 px-8 rounded-full text-[clamp(14px,3vw,16px)] font-medium hover:bg-blue-700 transition-colors"
              >
                Weiter zum Checkout
              </button>
            </div>
          </div>
        )}

        {stepIndex === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Preis: inkludiert</p>
            <GrundstueckCheckWrapper />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  ensureGrundstueckscheckIncluded();
                  goNext();
                }}
                className="bg-blue-600 text-white py-2 px-6 rounded-full text-[clamp(14px,3vw,16px)] font-medium hover:bg-blue-700 transition-colors"
              >
                Bestätigen & Weiter
              </button>
            </div>
          </div>
        )}

        {stepIndex === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(pricingCardData as PricingCardData[])
                .slice(0, 3)
                .map((card) => {
                  const value = card.title.toLowerCase().includes("pro")
                    ? "pro"
                    : card.title.toLowerCase().includes("plus")
                    ? "plus"
                    : "basis";
                  const isSelected = configItem?.planungspaket?.value === value;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setPlanningPackage(value)}
                      className={
                        "text-left border rounded-3xl p-5 transition-colors " +
                        (isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 bg-white hover:bg-gray-50")
                      }
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="pr-3">
                          <div className="text-lg font-semibold text-gray-900">
                            {card.title}
                          </div>
                          {card.subtitle && (
                            <div className="text-sm text-gray-700">
                              {card.subtitle}
                            </div>
                          )}
                        </div>
                        <div className="text-right min-w-[96px]">
                          <div className="text-base font-bold text-gray-900">
                            {card.price}
                          </div>
                          {card.monthlyPrice && (
                            <div className="text-xs text-gray-600">
                              {card.monthlyPrice}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 whitespace-pre-line">
                        {card.description}
                      </div>
                      {card.extendedDescription && (
                        <div className="mt-3 text-sm text-gray-700 whitespace-pre-line">
                          {card.extendedDescription}
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={goNext}
                className="bg-blue-600 text-white py-2 px-6 rounded-full text-[clamp(14px,3vw,16px)] font-medium hover:bg-blue-700 transition-colors"
              >
                Weiter
              </button>
            </div>
          </div>
        )}

        {stepIndex === 3 && (
          <div className="space-y-4">
            <AppointmentBooking />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={goNext}
                className="bg-blue-600 text-white py-2 px-6 rounded-full text-[clamp(14px,3vw,16px)] font-medium hover:bg-blue-700 transition-colors"
              >
                Weiter
              </button>
            </div>
          </div>
        )}

        {stepIndex === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              {configItem ? (
                <>
                  {Object.entries(configItem)
                    .filter(
                      ([key, value]) =>
                        value &&
                        ![
                          "sessionId",
                          "totalPrice",
                          "timestamp",
                          "id",
                          "addedAt",
                          "isFromConfigurator",
                        ].includes(key)
                    )
                    .map(([key, value]) => {
                      const selection = value as {
                        name?: string;
                        price?: number;
                      };
                      if (!selection || typeof selection !== "object")
                        return null;
                      return (
                        <div
                          key={key}
                          className="flex justify-between border-b border-gray-100 pb-2"
                        >
                          <div className="text-sm text-gray-700 capitalize">
                            {key}
                          </div>
                          <div className="text-sm font-medium">
                            {selection.name || "—"}
                            {typeof selection.price === "number" &&
                              selection.price > 0 && (
                                <span className="ml-2 text-gray-500">
                                  {PriceUtils.formatPrice(selection.price)}
                                </span>
                              )}
                            {selection.price === 0 && (
                              <span className="ml-2 text-gray-400">
                                inkludiert
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </>
              ) : (
                <div className="text-sm text-gray-600">
                  Keine Konfiguration im Warenkorb.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="font-medium">Gesamt</div>
              <div className="font-semibold">
                {PriceUtils.formatPrice(getCartTotal())}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
              <button
                type="button"
                onClick={goPrev}
                className="px-6 py-2 rounded-full border border-gray-300 text-[clamp(14px,3vw,16px)]"
              >
                Zurück
              </button>
              <button
                type="button"
                onClick={onScrollToContact}
                className="bg-blue-600 text-white py-2 px-6 rounded-full text-[clamp(14px,3vw,16px)] font-medium hover:bg-blue-700 transition-colors"
              >
                Jetzt bauen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
