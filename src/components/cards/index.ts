// NEW: Unified Card System (Main Component)
export { default as UnifiedContentCard } from "./UnifiedContentCard";
export type {
    CardLayout,
    CardStyle,
    CardVariant,
    UnifiedContentCardProps,
} from "./UnifiedContentCard";

// Specialized card components (kept for specific use cases)
export { default as PlanungspaketeCards } from "./PlanungspaketeCards";
export { default as PlanungspaketeCardsLightbox } from "./PlanungspaketeCardsLightbox";
export { default as CheckoutStepCard } from "./CheckoutStepCard";
export { default as CheckoutPlanungspaketeCards } from "./CheckoutPlanungspaketeCards";

// Utilities and types
export * from "./cardTypes";
export * from "./cardUtils";
export type { SquareTextCardData } from "./cardTypes";
export type { PresetName, PresetConfig } from "./presetSystem";
export {
    getPresetData,
    createPresetCustomData,
    getAvailablePresets,
    isValidPreset as isValidPresetName,
    applyPresetConfig,
    PRESET_CONFIGS
} from "./presetSystem";

// Re-export preset constants for convenience
export { CONTENT_CARD_PRESETS, VIDEO_CARD_PRESETS, ABLAUF_STEPS_PRESET, ABLAUF_STEPS_CARDS, ABLAUF_STEPS_BUTTONS, PLANUNGSPAKETE_CARDS, PLANUNGSPAKETE_BUTTONS, PLANUNGSPAKETE_PRESET } from "@/constants/contentCardPresets";
export type { ContentCardPreset, VideoCardPreset, SquareTextCardPreset } from "@/constants/contentCardPresets";

// NEW: Centralized content system
export {
    MATERIALIEN_CONTENT,
    PHOTOVOLTAIK_CONTENT,
    BELICHTUNGSPAKET_CONTENT,
    FENSTER_TUEREN_CONTENT,
    STIRNSEITE_CONTENT,
    KONTAKTFORMULAR_CONTENT,
    CARD_CONTENT_BY_CATEGORY,
    getContentByCategory,
    getContentById,
    getAvailableCategories,
    isValidCategory,
} from "@/constants/cardContent";
export type { ContentCategory, ContentCardData, ButtonConfig } from "@/constants/cardContent";