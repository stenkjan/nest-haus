"use client";

import React, { useState } from "react";
import { Dialog, Button } from "@/components/ui";
import { PLANNING_PACKAGES } from "@/constants/configurator";
import { useConfiguratorStore } from "@/store/configuratorStore";

interface PlanungspaketeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanungspaketeDialog: React.FC<PlanungspaketeDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { configuration: _configuration, updateSelection: _updateSelection, removeSelection: _removeSelection } =
    useConfiguratorStore();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(
    null // Planungspaket removed from configurator - always start with no selection
  );

  const handlePackageSelect = (packageValue: string) => {
    if (selectedPackage === packageValue) {
      // Unselect if clicking the same package
      setSelectedPackage(null);
    } else {
      setSelectedPackage(packageValue);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedPackage) {
      const selectedPlanningPackage = PLANNING_PACKAGES.find(
        (pkg) => pkg.value === selectedPackage
      );
      if (selectedPlanningPackage) {
        // Planungspaket no longer handled by configurator - this dialog is now for informational purposes only
        console.log("Planungspaket selected:", selectedPlanningPackage.name);
        // Note: Actual planungspaket selection will be handled in the separate cart flow
      }
    } else {
      // Planungspaket no longer part of configurator - no need to remove
      console.log("No planungspaket selected");
    }
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMonthly = (monthly: number) => {
    return `€ ${monthly},-/Monat`;
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      transparent={true}
      className="p-0"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Title above the dialog */}
        <div className="absolute top-ios-5 z-[100] w-full max-w-[1700px] px-6 left-0 right-0 mx-auto">
          <h2 className="hidden md:block font-bold text-h2-mobile md:text-3xl text-center text-gray-900 mb-2">
            Unsere Planungspakete
          </h2>
        </div>

        <div
          className="relative w-[95vw] h-ios-90 md:h-ios-85 overflow-y-auto pt-1 pb-1 md:pt-2 md:pb-2 px-1 md:px-1 flex justify-center items-start mt-ios-10 md:mt-ios-5 ios-dialog-container"
          style={{ minHeight: "300px" }}
        >
          <div className="max-w-[1700px] mx-auto bg-[#F4F4F4] rounded-[32px] md:rounded-[32px] px-1 md:px-5 pb-3 flex flex-col items-center shadow-md">
            <div className="relative w-full flex flex-col md:flex-row justify-start items-start gap-4 md:gap-8 pt-6 md:pt-0 px-2 sm:px-4 lg:px-8 overflow-y-auto h-full pointer-events-auto z-10">
              {/* Left Info Section */}
              <div className="w-full md:flex-1 md:min-w-[180px] md:max-w-[340px] xl:min-w-[320px] xl:max-w-[420px] flex flex-col justify-start px-2 sm:px-4 md:pl-4 md:pr-0 lg:pl-10 mt-4 md:mt-7 z-10">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-700 mb-3 leading-snug">
                      Wir konzentrieren uns darauf, alle standardisierten
                      Arbeitsprozesse zu optimieren und{" "}
                      <span className="font-bold">
                        höchste Qualität zu fairen Preisen
                      </span>{" "}
                      sicherzustellen. Darauf aufbauend machst{" "}
                      <span className="font-bold">
                        du dein Nest. Individuell.
                      </span>
                    </p>
                    <p className="text-[13px] sm:text-base text-gray-700 mb-3 leading-snug">
                      Unsere <span className="font-bold">Planungspakete</span>{" "}
                      bieten dir die perfekte Unterstützung für dein Bauvorhaben
                      – von der{" "}
                      <span className="font-bold">
                        Grundplanung bis hin zur kompletten Baubegleitung
                      </span>{" "}
                      mit Innenraumkonzept.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-semibold text-[11px] text-gray-700 mb-0">
                        Professionelle Planung
                      </h4>
                      <p className="text-[11px] text-gray-400 leading-tight">
                        Einreichplanung, Fachberatung und Baubegleitung für
                        einen reibungslosen Bauprozess.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[11px] text-gray-700 mb-0">
                        Technische Expertise
                      </h4>
                      <p className="text-[11px] text-gray-400 leading-tight">
                        HKLS-Planung und Gebäudetechnik für optimale
                        Energieeffizienz und Komfort.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[11px] text-gray-700 mb-0">
                        Individuelle Gestaltung
                      </h4>
                      <p className="text-[11px] text-gray-400 leading-tight">
                        Interiorkonzept und Möblierungsvorschläge für dein
                        persönliches Traumhaus.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Planning Packages */}
              <div className="w-full md:flex-1 md:min-w-[260px] md:max-w-[540px] flex flex-col px-2 sm:px-4 md:pl-8 md:pr-4 lg:pl-12 lg:pr-0 pb-4 mt-4 md:mt-[2vh]">
                <div className="space-y-3 sm:space-y-4">
                  {PLANNING_PACKAGES.map((planningPackage) => (
                    <div
                      key={planningPackage.value}
                      className={`relative border-2 rounded-2xl p-3 sm:p-4 cursor-pointer transition-all duration-200 ${
                        selectedPackage === planningPackage.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      onClick={() => handlePackageSelect(planningPackage.value)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1">
                            {planningPackage.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 leading-tight whitespace-pre-line">
                            {planningPackage.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                              {formatPrice(planningPackage.price)}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {formatMonthly(planningPackage.monthly)}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`ml-3 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPackage === planningPackage.value
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {selectedPackage === planningPackage.value && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Selection Info */}
                  <div className="text-center text-xs text-gray-500 mt-3">
                    {selectedPackage
                      ? "Paket ausgewählt - klicke erneut zum Abwählen"
                      : "Wähle ein Planungspaket oder lasse die Auswahl leer"}
                  </div>

                  {/* Confirm Button */}
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={handleConfirmSelection}
                      className="bg-blue-600 text-white hover:bg-blue-700 rounded-full py-2 text-sm px-6 whitespace-nowrap min-w-[140px] flex-shrink-0 !w-auto"
                    >
                      {selectedPackage
                        ? "Paket auswählen"
                        : "Ohne Paket fortfahren"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PlanungspaketeDialog;
