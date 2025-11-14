"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import Button from "@/components/ui/Button";

interface ConfigurationModeSelectionProps {
  onClose: () => void;
}

export default function ConfigurationModeSelection({
  onClose,
}: ConfigurationModeSelectionProps) {
  const [selectedMode, setSelectedMode] = useState<"with" | "without" | null>(
    null
  );
  const router = useRouter();
  const { setOhneNestMode } = useCartStore();

  const handleContinue = () => {
    if (selectedMode === "with") {
      // User wants to configure - just close the overlay
      onClose();
    } else if (selectedMode === "without") {
      // User wants to skip configuration and go directly to warenkorb
      setOhneNestMode(true);
      router.push("/warenkorb#entwurf");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background overlay */}
      <div
        className="absolute inset-0 bg-white/80 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-gray-900 mb-8 text-center">
          Zwei Wege zum Ziel
        </h2>

        {/* Main box */}
        <div className="rounded-3xl shadow-lg overflow-hidden bg-[#F4F4F4] w-full p-8 md:p-12">
          {/* Two selection boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left box - Mit Konfiguration */}
            <div
              className={`box_selection flex flex-col justify-center min-h-[12rem] border rounded-[1.2rem] px-6 py-8 cursor-pointer transition-all duration-200 ${
                selectedMode === "with"
                  ? "selected border-[#3D6CE1] shadow-[0_0_0_1px_#3D6CE1] bg-blue-50/50"
                  : "border-gray-300 hover:border-[#3D6CE1] hover:shadow-sm bg-white"
              }`}
              onClick={() => setSelectedMode("with")}
            >
              <h3 className="text-xl md:text-2xl font-normal text-gray-900 mb-4 text-center">
                Mit Konfiguration
              </h3>
              <p className="text-base md:text-lg text-gray-700 text-center leading-relaxed">
                <strong>Konfiguriere dein Nest</strong> nach deinem Geschmack
                und behalte die <strong>Preise</strong> deines Hauses{" "}
                <strong>transparent im Blick</strong>.
              </p>
            </div>

            {/* Right box - Ohne Konfiguration */}
            <div
              className={`box_selection flex flex-col justify-center min-h-[12rem] border rounded-[1.2rem] px-6 py-8 cursor-pointer transition-all duration-200 ${
                selectedMode === "without"
                  ? "selected border-[#3D6CE1] shadow-[0_0_0_1px_#3D6CE1] bg-blue-50/50"
                  : "border-gray-300 hover:border-[#3D6CE1] hover:shadow-sm bg-white"
              }`}
              onClick={() => setSelectedMode("without")}
            >
              <h3 className="text-xl md:text-2xl font-normal text-gray-900 mb-4 text-center">
                Ohne Konfiguration
              </h3>
              <p className="text-base md:text-lg text-gray-700 text-center leading-relaxed">
                Starte <strong>ohne Konfiguration</strong> und gehe{" "}
                <strong>direkt</strong> weiter <strong>zum Warenkorb</strong>.
                Dein Nest entwirfst du mit dem Team.
              </p>
            </div>
          </div>

          {/* Small text below boxes */}
          <p className="text-sm text-gray-500 text-center mb-6">
            <strong>Triff eine Auswahl um fortzufahren</strong>
          </p>

          {/* Continue button */}
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              disabled={!selectedMode}
              className={`${
                !selectedMode ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Fortfahren
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

