"use client";

import React from "react";
import ContentCards from "./ContentCards";
import ContentCardsGlass from "./ContentCardsGlass";
import { PresetConfig, applyPresetConfig, PresetName } from "./presetSystem";

interface UnifiedCardPresetProps extends Omit<PresetConfig, "preset"> {
  preset: PresetName;
  style?: "default" | "glass";
  isLightboxMode?: boolean;
  onCardClick?: (cardId: number) => void;
}

/**
 * Unified component for rendering card presets with either default or glass styling
 *
 * Usage examples:
 *
 * // Default Sicherheit preset
 * <UnifiedCardPreset preset="sicherheit" />
 *
 * // Glass version of Sicherheit preset
 * <UnifiedCardPreset preset="sicherheit" style="glass" />
 *
 * // Custom configuration
 * <UnifiedCardPreset
 *   preset="sicherheit"
 *   style="glass"
 *   title="Custom Title"
 *   variant="static"
 *   maxWidth={true}
 * />
 */
export default function UnifiedCardPreset({
  preset,
  style = "default",
  variant,
  title,
  subtitle,
  maxWidth,
  showInstructions,
  isLightboxMode = false,
  onCardClick,
}: UnifiedCardPresetProps) {
  // Apply preset configuration
  const config = applyPresetConfig({
    preset,
    variant,
    title,
    subtitle,
    maxWidth,
    showInstructions,
  });

  // Render appropriate component based on style
  if (style === "glass") {
    // Filter out "pricing" variant for ContentCardsGlass (only supports "responsive" | "static")
    const glassConfig = {
      ...config,
      variant: config.variant === "pricing" ? "responsive" : config.variant,
    };

    return (
      <ContentCardsGlass
        {...glassConfig}
        isLightboxMode={isLightboxMode}
        onCardClick={onCardClick}
      />
    );
  }

  // Filter out "pricing" variant for ContentCards (only supports "responsive" | "static")
  const defaultConfig = {
    ...config,
    variant: config.variant === "pricing" ? "responsive" : config.variant,
  };

  return (
    <ContentCards
      {...defaultConfig}
      isLightboxMode={isLightboxMode}
      onCardClick={onCardClick}
    />
  );
}

// Export convenience components for specific presets
export const SicherheitCardPreset = (
  props: Omit<UnifiedCardPresetProps, "preset">
) => <UnifiedCardPreset preset="sicherheit" {...props} />;

export const SicherheitCardPresetGlass = (
  props: Omit<UnifiedCardPresetProps, "preset" | "style">
) => <UnifiedCardPreset preset="sicherheit" style="glass" {...props} />;
