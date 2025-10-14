"use client";

import React from "react";
import ContentCards from "./ContentCards";
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

  // Filter out "pricing" variant (only supports "responsive" | "static")
  const finalConfig = {
    ...config,
    variant: config.variant === "pricing" ? "responsive" : config.variant,
  };

  // Render ContentCards with appropriate style
  return (
    <ContentCards
      {...finalConfig}
      style={style}
      isLightboxMode={isLightboxMode}
      onCardClick={onCardClick}
    />
  );
}

// Note: Sicherheit preset has been moved to VIDEO_CARD_PRESETS and should use VideoCard16by9 component
// The SicherheitCardPreset components have been removed as they are no longer compatible
