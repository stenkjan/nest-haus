"use client";

import React, { useState, useCallback } from "react";
import SimplifiedCategorySection from "./SimplifiedCategorySection";
import SimplifiedPreviewPanel from "./SimplifiedPreviewPanel";
import VorentwurfButton from "./VorentwurfButton";

// Simplified configurator data - only size and facade
const NEST_OPTIONS = [
  {
    id: 'nest80',
    name: 'Hoam 80',
    subtitle: '4 Module / 75m²',
  },
  {
    id: 'nest100',
    name: 'Hoam 100',
    subtitle: '5 Module / 95m²',
  },
  {
    id: 'nest120',
    name: 'Hoam 120',
    subtitle: '6 Module / 115m²',
  },
  {
    id: 'nest140',
    name: 'Hoam 140',
    subtitle: '7 Module / 135m²',
  },
  {
    id: 'nest160',
    name: 'Hoam 160',
    subtitle: '8 Module / 155m²',
  },
];

const FACADE_OPTIONS = [
  {
    id: 'trapezblech',
    name: 'Trapezblech',
    subtitle: 'RAL 9005; 3000 x 1142 mm',
  },
  {
    id: 'holzlattung',
    name: 'Holzlattung',
    subtitle: 'Lärche Natur; 5,0 x 4,0 cm',
  },
  {
    id: 'fassadenplatten_schwarz',
    name: 'Fassadenplatten Schwarz',
    subtitle: '268 x 130 cm',
  },
  {
    id: 'fassadenplatten_weiss',
    name: 'Fassadenplatten Weiß',
    subtitle: '268 x 130 cm',
  },
];

export default function Konfigurator2Client() {
  const [selectedNest, setSelectedNest] = useState<string | null>(null);
  const [selectedFacade, setSelectedFacade] = useState<string | null>(null);

  const handleNestSelection = useCallback((optionId: string) => {
    setSelectedNest(optionId);
  }, []);

  const handleFacadeSelection = useCallback((optionId: string) => {
    setSelectedFacade(optionId);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1920px] mx-auto">
        {/* Desktop Layout: Split Panel */}
        <div className="hidden lg:flex lg:h-screen">
          {/* Left Panel - Preview Image */}
          <div className="w-1/2 relative bg-gray-100">
            <SimplifiedPreviewPanel
              selectedNest={selectedNest}
              selectedFacade={selectedFacade}
            />
          </div>

          {/* Right Panel - Selections */}
          <div className="w-1/2 overflow-y-auto mt-6">
            <div className="p-8 space-y-8">
              {/* Size Selection */}
              <SimplifiedCategorySection
                title="Nest"
                subtitle="Wie groß"
                options={NEST_OPTIONS}
                selectedOption={selectedNest}
                onSelect={handleNestSelection}
              />

              {/* Facade Selection */}
              <SimplifiedCategorySection
                title="Gebäudehülle"
                subtitle="Kleide dich ein"
                options={FACADE_OPTIONS}
                selectedOption={selectedFacade}
                onSelect={handleFacadeSelection}
              />

              {/* Vorentwurf Button */}
              <VorentwurfButton
                selectedNest={selectedNest}
                selectedFacade={selectedFacade}
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout: Stacked */}
        <div className="lg:hidden">
          {/* Preview Image */}
          <div className="w-full min-h-[400px] bg-gray-100">
            <SimplifiedPreviewPanel
              selectedNest={selectedNest}
              selectedFacade={selectedFacade}
            />
          </div>

          {/* Selections */}
          <div className="p-6 space-y-6">
            {/* Size Selection */}
            <SimplifiedCategorySection
              title="Nest"
              subtitle="Wie groß"
              options={NEST_OPTIONS}
              selectedOption={selectedNest}
              onSelect={handleNestSelection}
            />

            {/* Facade Selection */}
            <SimplifiedCategorySection
              title="Gebäudehülle"
              subtitle="Kleide dich ein"
              options={FACADE_OPTIONS}
              selectedOption={selectedFacade}
              onSelect={handleFacadeSelection}
            />

            {/* Vorentwurf Button */}
            <VorentwurfButton
              selectedNest={selectedNest}
              selectedFacade={selectedFacade}
            />
          </div>
        </div>
      </div>
    </div>
  );
}



