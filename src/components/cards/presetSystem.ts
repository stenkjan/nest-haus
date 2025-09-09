import { CONTENT_CARD_PRESETS, ContentCardPreset } from "@/constants/contentCardPresets";

// Unified preset system for both ContentCards and ContentCardsGlass
export type PresetName = keyof typeof CONTENT_CARD_PRESETS;

// Configuration for applying presets to components
export interface PresetConfig {
    preset: PresetName;
    variant?: "responsive" | "static" | "pricing";
    title?: string;
    subtitle?: string;
    maxWidth?: boolean;
    showInstructions?: boolean;
}

// Helper to get preset data
export const getPresetData = (presetName: PresetName): ContentCardPreset => {
    return CONTENT_CARD_PRESETS[presetName];
};

// Helper to create custom data array for component
export const createPresetCustomData = (presetName: PresetName): ContentCardPreset[] => {
    return [getPresetData(presetName)];
};

// Helper to get all available presets
export const getAvailablePresets = (): PresetName[] => {
    return Object.keys(CONTENT_CARD_PRESETS) as PresetName[];
};

// Helper to validate preset name
export const isValidPreset = (name: string): name is PresetName => {
    return name in CONTENT_CARD_PRESETS;
};

// Helper to apply preset configuration to component props
export const applyPresetConfig = (config: PresetConfig) => {
    return {
        variant: config.variant || "static",
        title: config.title || `${config.preset} Card Preset`,
        subtitle: config.subtitle || `Reusable preset used across the site • Wide layout on desktop, mobile layout on tablets/phones`,
        maxWidth: config.maxWidth ?? false,
        showInstructions: config.showInstructions ?? true,
        customData: createPresetCustomData(config.preset),
    };
};

// Predefined configurations for common use cases
export const PRESET_CONFIGS: Record<string, PresetConfig> = {
    // Note: Sicherheit preset has been moved to VIDEO_CARD_PRESETS
    // Use VideoCard16by9 with VIDEO_CARD_PRESETS.sicherheit instead
};
