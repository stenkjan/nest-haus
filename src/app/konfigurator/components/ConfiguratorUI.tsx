import React from "react";
import { configuratorData } from "../data/configuratorData";
import { PriceCalculator } from "../core/PriceCalculator";
import { PriceUtils } from "../core/PriceUtils";
import CategorySection from "./CategorySection";
import SelectionOption from "./SelectionOption";
import QuantitySelector from "./QuantitySelector";
import SummaryPanel from "./SummaryPanel";
import PreviewPanel from "./PreviewPanel";
import FactsBox from "./FactsBox";
import { InfoBox, CartFooter } from "./index";
import ConfiguratorContentCardsLightbox from "./ConfiguratorContentCardsLightbox";
import ConfiguratorCheckbox from "./ConfiguratorCheckbox";
import { CalendarDialog } from "@/components/dialogs";
import type { useConfiguratorLogic } from "../hooks/useConfiguratorLogic";

type ConfiguratorLogic = ReturnType<typeof useConfiguratorLogic>;

interface ConfiguratorUIProps {
  logic: ConfiguratorLogic;
  rightPanelRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ConfiguratorUI({ logic, rightPanelRef }: ConfiguratorUIProps) {
  const {
    isPricingDataLoaded,
    pricingDataError,
    configuration,
    pvQuantity,
    geschossdeckeQuantity,
    isPvOverlayVisible,
    isGeschossdeckeOverlayVisible,
    isBelichtungspaketOverlayVisible,
    isCalendarDialogOpen,
    setIsCalendarDialogOpen,
    resetLocalState,
    handleSelection,
    handlePvQuantityChange,
    handleInfoClick,
    handleKamindurchzugChange,
    handleFundamentChange,
    handleGeschossdeckeQuantityChange,
    isOptionSelected,
    getDisplayPrice,
    getActualContributionPrice,
    getMaxPvModules,
    getMaxGeschossdecken,
  } = logic;

  // Consistent viewport height calculation for both panels - 5vh higher as requested
  const panelHeight = "calc(100vh - var(--navbar-height, 3.5rem) - var(--footer-height, 2.5rem) + 5vh)";
  const panelPaddingTop = "var(--navbar-height, 3.5rem)";

  // Show loading state while pricing data is being fetched
  if (!isPricingDataLoaded && !pricingDataError) {
    return (
      <div className="configurator-shell w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Preisdaten werden geladen...</p>
        </div>
      </div>
    );
  }

  // Show error state if pricing data failed to load
  if (pricingDataError) {
    return (
      <div className="configurator-shell w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Fehler beim Laden der Preisdaten</h2>
          <p className="text-gray-600 mb-4">{pricingDataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
          >
            Seite neu laden
          </button>
        </div>
      </div>
    );
  }

  // Render selection content
  const SelectionContent = () => (
    <div className="p-[clamp(0.875rem,2.75vw,1.75rem)] space-y-[clamp(2.75rem,5vh,3.75rem)]">
      {/* Ohne Nest fortfahren button - at the top */}
      <div className="flex flex-col items-center mt-3 lg:mt-0 mb-4 gap-2">
        <button
          onClick={() => {
            window.location.href = "/warenkorb?mode=konzept-check";
          }}
          className="w-full max-w-[280px] bg-white text-[#3D6CE1] border-2 border-[#3D6CE1] rounded-full font-medium text-[clamp(0.875rem,1.2vw,1rem)] px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.5rem,1vw,0.75rem)] transition-all hover:bg-[#3D6CE1] hover:text-white min-h-[48px] flex items-center justify-center touch-manipulation cursor-pointer shadow-sm hover:shadow-md"
        >
          Konzept-Check bestellen
        </button>
        <p className="text-gray-600 text-[clamp(0.75rem,1vw,0.875rem)]">
          Ohne Konfiguration fortfahren
        </p>
      </div>

      {configuratorData.map((category) => (
        <React.Fragment key={category.id}>
          {/* Add Optionen section before planungspaket */}
          {category.id === "planungspaket" && (
            <CategorySection
              id="section-optionen"
              title="Optionen"
              subtitle="Zusätzliche Ausstattung"
            >
              <div className="space-y-4">
                {/* Kamindurchzug Checkbox */}
                <ConfiguratorCheckbox
                  id="kamindurchzug-checkbox"
                  uncheckedText="Kaminschachtvorbereitung"
                  checkedText="Kaminschachtvorbereitung"
                  price={(() => {
                    const pricingData = PriceCalculator.getPricingData();
                    return pricingData?.optionen?.kaminschacht || 887;
                  })()}
                  isChecked={!!configuration?.kamindurchzug}
                  onChange={handleKamindurchzugChange}
                />

                {/* Fundament Checkbox */}
                <ConfiguratorCheckbox
                  id="fundament-checkbox"
                  uncheckedText="Fundament"
                  checkedText="Fundament"
                  price={(() => {
                    if (configuration?.nest?.value) {
                      const pricingData = PriceCalculator.getPricingData();
                      if (pricingData) {
                        const nestSize = configuration.nest.value as "nest80" | "nest100" | "nest120" | "nest140" | "nest160";
                        return pricingData.optionen.fundament[nestSize] || 15480;
                      }
                    }
                    return 15480;
                  })()}
                  pricePerSqm={
                    configuration?.nest?.value
                      ? (() => {
                        const pricingData = PriceCalculator.getPricingData();
                        if (pricingData) {
                          const nestSize = configuration.nest.value as "nest80" | "nest100" | "nest120" | "nest140" | "nest160";
                          const fundamentPrice = pricingData.optionen.fundament[nestSize] || 15480;
                          const nestSquareMeters = parseInt(configuration.nest.value.replace("nest", "")) || 80;
                          return fundamentPrice / nestSquareMeters;
                        }
                        return 193.5;
                      })()
                      : 193.5
                  }
                  isChecked={!!configuration?.fundament}
                  onChange={handleFundamentChange}
                />

                <p className="text-sm text-gray-600 leading-relaxed mt-4 px-1">
                  Das Fundament bildet die stabile Basis für dein Hoam-House. Es wird individuell auf dein Grundstück und die Bodenbeschaffenheit angepasst und sorgt für einen sicheren Stand über viele Jahre.
                </p>
              </div>
            </CategorySection>
          )}

          <CategorySection
            id={`section-${category.id}`}
            title={category.title}
            subtitle={category.subtitle}
          >
            {(() => {
              return (
                <>
                  <div className="space-y-2">
                    {category.options.map((option) => {
                      const displayPrice = getDisplayPrice(category.id, option.id);
                      // For fenster, always calculate contributionPrice (m² price) for all options
                      // For other categories, only calculate for selected options
                      const contributionPrice = (category.id === "fenster" || isOptionSelected(category.id, option.id))
                        ? getActualContributionPrice(category.id, option.id)
                        : null;

                      // For fenster, also get the selected option's m² price for relative pricing
                      const selectedFensterM2Price = category.id === "fenster" && configuration?.fenster
                        ? getActualContributionPrice(category.id, configuration.fenster.value)
                        : null;

                      let dynamicDescription = option.description;
                      if (category.id === "geschossdecke") {
                        const pricingData = PriceCalculator.getPricingData();
                        if (pricingData) {
                          const unitPrice = pricingData.geschossdecke.basePrice;
                          const formattedPrice = PriceUtils.formatPrice(unitPrice);
                          dynamicDescription = `Zusätzliche Geschossdecke\n${formattedPrice} pro Einheit`;
                        }
                      }

                      return (
                        <SelectionOption
                          key={option.id}
                          id={option.id}
                          name={option.name}
                          description={dynamicDescription}
                          price={displayPrice}
                          isSelected={isOptionSelected(category.id, option.id)}
                          categoryId={category.id}
                          nestModel={configuration?.nest?.value}
                          contributionPrice={contributionPrice}
                          selectedFensterM2Price={selectedFensterM2Price}
                          geschossdeckeQuantity={configuration?.geschossdecke?.quantity || 0}
                          onClick={(optionId) => {
                            handleSelection(category.id, optionId);
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* PV Quantity Selector */}
                  {category.id === "pvanlage" && configuration?.pvanlage && (
                    <QuantitySelector
                      label="Anzahl der PV-Module"
                      value={pvQuantity}
                      max={getMaxPvModules()}
                      unitPrice={0}
                      cumulativePrice={(() => {
                        const pricingData = PriceCalculator.getPricingData();
                        if (!pricingData || !configuration.nest) return 0;
                        const nestSize = configuration.nest.value as "nest80" | "nest100" | "nest120" | "nest140" | "nest160";
                        return pricingData.pvanlage.pricesByQuantity[nestSize]?.[pvQuantity] || 0;
                      })()}
                      onChange={handlePvQuantityChange}
                    />
                  )}

                  {/* Geschossdecke Quantity Selector */}
                  {category.id === "geschossdecke" && (configuration?.geschossdecke || geschossdeckeQuantity > 0) && (
                    <QuantitySelector
                      label="Anzahl der Geschossdecken"
                      value={geschossdeckeQuantity}
                      max={getMaxGeschossdecken()}
                      unitPrice={(() => {
                        const pricingData = PriceCalculator.getPricingData();
                        return pricingData?.geschossdecke?.basePrice || 4115;
                      })()}
                      onChange={handleGeschossdeckeQuantityChange}
                    />
                  )}

                  {/* Noch Fragen offen? InfoBox */}
                  {category.id === "nest" && (
                    <InfoBox
                      title="Noch Fragen offen?"
                      description="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch."
                      onClick={() => window.open("/kontakt", "_blank")}
                    />
                  )}

                  {/* Info Box */}
                  {category.infoBox && (
                    <>
                      {category.id === "gebaeudehuelle" ||
                        category.id === "innenverkleidung" ||
                        category.id === "fussboden" ||
                        category.id === "belichtungspaket" ||
                        category.id === "fenster" ||
                        category.id === "pvanlage" ? (
                        <ConfiguratorContentCardsLightbox
                          categoryKey={
                            category.id === "gebaeudehuelle"
                              ? "materials"
                              : category.id === "pvanlage"
                                ? "photovoltaik"
                                : category.id === "fussboden"
                                  ? "fussboden"
                                  : category.id === "belichtungspaket"
                                    ? "belichtungspaket"
                                    : (category.id as "innenverkleidung" | "fenster")
                          }
                          triggerText={category.infoBox.title}
                        />
                      ) : (
                        <InfoBox
                          title={category.infoBox.title}
                          description={category.infoBox.description}
                          onClick={() => handleInfoClick(category.id)}
                        />
                      )}
                    </>
                  )}
                </>
              );
            })()}
          </CategorySection>
        </React.Fragment>
      ))}

      {/* Energieausweis Facts Box - positioned after planungspaket and before summary */}
      {(() => {
        const nestCategory = configuratorData.find(cat => cat.id === "nest");
        if (nestCategory?.facts) {
          return (
            <div className="px-[clamp(0.875rem,2.75vw,1.75rem)]">
              <FactsBox
                title={nestCategory.facts.title}
                facts={nestCategory.facts.content}
                links={nestCategory.facts.links}
              />
            </div>
          );
        }
        return null;
      })()}

      <SummaryPanel onInfoClick={handleInfoClick} onReset={resetLocalState} />
    </div>
  );

  return (
    <div className="configurator-shell w-full h-full bg-white">
      {/* Mobile Layout (< 1024px) */}
      <div className="lg:hidden min-h-screen bg-white">
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <PreviewPanel
            isMobile={true}
            isPvOverlayVisible={isPvOverlayVisible}
            isGeschossdeckeOverlayVisible={isGeschossdeckeOverlayVisible}
            isBelichtungspaketOverlayVisible={isBelichtungspaketOverlayVisible}
          />
        </div>

        <div
          ref={rightPanelRef}
          className="relative bg-white"
          style={{
            WebkitOverflowScrolling: "touch",
            paddingBottom: "calc(var(--footer-height, 2.5rem) + 1rem)",
          }}
        >
          <SelectionContent />
        </div>
      </div>

      {/* Desktop Layout (≥ 1024px) */}
      <div className="hidden lg:flex">
        <div
          className="flex-[7] relative"
          style={{
            height: panelHeight,
            paddingTop: panelPaddingTop,
          }}
        >
          <PreviewPanel
            isMobile={false}
            isPvOverlayVisible={isPvOverlayVisible}
            isGeschossdeckeOverlayVisible={isGeschossdeckeOverlayVisible}
            isBelichtungspaketOverlayVisible={isBelichtungspaketOverlayVisible}
          />
        </div>

        <div
          ref={rightPanelRef}
          className="configurator-right-panel flex-[3] bg-white overflow-y-auto"
          style={{
            height: panelHeight,
            paddingTop: panelPaddingTop,
          }}
        >
          <SelectionContent />
        </div>
      </div>

      <div className="lg:relative lg:static">
        <CartFooter onReset={resetLocalState} />
      </div>

      <CalendarDialog
        isOpen={isCalendarDialogOpen}
        onClose={() => setIsCalendarDialogOpen(false)}
      />
    </div>
  );
}

