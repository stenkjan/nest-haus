import React, { memo } from "react";
import { ContentCards } from "@/components/cards";
import { MATERIAL_CARDS, type MaterialCardData } from "@/constants/materials";
import { SectionContainer } from "@/components/sections";

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
      <section id="materialien" className={`w-full ${bgClass} ${className}`}>
        {/* Only show header if title is provided */}
        {title && (
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <h1 className={`h1-secondary ${textColor}`}>{title}</h1>
              {subtitle && (
                <h3 className={`h3-secondary ${textColor}`}>{subtitle}</h3>
              )}
            </div>
          </div>
        )}

        {/* ContentCards with glass styling and optimized material data - full width */}
        <ContentCards
          variant="responsive"
          title=""
          subtitle=""
          maxWidth={false}
          showInstructions={showInstructions}
          customData={materials}
          style="glass"
          backgroundColor={backgroundColor}
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
          <h1 className={`h1-secondary ${textColor}`}>{title}</h1>
          {subtitle && (
            <h3 className={`h3-secondary ${textColor}`}>{subtitle}</h3>
          )}
        </div>
      )}

      {/* ContentCards with glass styling and optimized material data */}
      <ContentCards
        variant="responsive"
        title=""
        subtitle=""
        maxWidth={maxWidth}
        showInstructions={showInstructions}
        customData={materials}
        style="glass"
        backgroundColor={backgroundColor}
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
