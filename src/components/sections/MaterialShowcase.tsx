import React, { memo } from "react";
import { ContentCardsGlass } from "@/components/cards";
import { MATERIAL_CARDS, type MaterialCardData } from "@/constants/materials";
import { SectionHeader, SectionContainer } from "@/components/sections";

interface MaterialShowcaseProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: "white" | "gray" | "black";
  maxWidth?: boolean;
  customMaterials?: MaterialCardData[];
  showInstructions?: boolean;
  className?: string;
}

// Memoized component for performance optimization
export const MaterialShowcase = memo(function MaterialShowcase({
  title = "Gut für Dich, besser für die Zukunft",
  subtitle = "Entdecke unsere sorgfältig ausgewählten Materialien",
  backgroundColor = "black",
  maxWidth = false,
  customMaterials,
  showInstructions = true,
  className = "",
}: MaterialShowcaseProps) {
  const materials = customMaterials || MATERIAL_CARDS;
  const textColor =
    backgroundColor === "black" ? "text-white" : "text-gray-900";

  return (
    <SectionContainer
      id="materialien"
      backgroundColor={backgroundColor}
      className={className}
    >
      {/* Only show header if title is provided */}
      {title && (
        <div className="text-center mb-24">
          <SectionHeader
            title={title}
            subtitle={subtitle}
            titleSize="large"
            titleClassName={textColor}
            subtitleClassName={textColor}
          />
        </div>
      )}

      {/* ContentCardsGlass with optimized material data */}
      <ContentCardsGlass
        variant="responsive"
        title=""
        subtitle=""
        maxWidth={maxWidth}
        showInstructions={showInstructions}
        customData={materials}
      />
    </SectionContainer>
  );
});

// Export individual material categories for specific use cases
export const getNatursteinMaterials = () =>
  MATERIAL_CARDS.filter((material) => material.title.includes("Naturstein"));

export const getHolzMaterials = () =>
  MATERIAL_CARDS.filter(
    (material) =>
      material.title.includes("Lärchen") || material.title.includes("Eichen")
  );

export const getMetallMaterials = () =>
  MATERIAL_CARDS.filter(
    (material) =>
      material.title.includes("Fundermax") ||
      material.title.includes("Trapezblech")
  );
