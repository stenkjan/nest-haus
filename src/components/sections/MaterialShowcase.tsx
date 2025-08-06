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

  const bgClass = {
    white: "bg-white",
    gray: "bg-gray-50",
    black: "bg-black",
  }[backgroundColor];

  // Use full width container when maxWidth is false to avoid constraints
  if (!maxWidth) {
    return (
      <section
        id="materialien"
        className={`w-full py-16 ${bgClass} ${className}`}
      >
        {/* Only show header if title is provided */}
        {title && (
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <SectionHeader
                title={title}
                subtitle={subtitle}
                titleSize="large"
                titleClassName={textColor}
                subtitleClassName={textColor}
              />
            </div>
          </div>
        )}

        {/* ContentCardsGlass with optimized material data - full width */}
        <ContentCardsGlass
          variant="responsive"
          title=""
          subtitle=""
          maxWidth={false}
          showInstructions={showInstructions}
          customData={materials}
        />
      </section>
    );
  }

  // Use SectionContainer for constrained width
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
