import { CONTENT_CARD_PRESETS } from "@/constants/contentCardPresets";

// Unified card preset system for both ContentCards and ContentCardsGlass
export type CardPresetName = keyof typeof CONTENT_CARD_PRESETS;

// Helper function to get card preset by name
export const getCardPreset = (presetName: CardPresetName) => {
    return CONTENT_CARD_PRESETS[presetName];
};

// Helper function to create custom data array with preset
export const createCardPresetData = (presetName: CardPresetName) => {
    return [getCardPreset(presetName)];
};

// Available presets for easy reference
export const AVAILABLE_PRESETS: CardPresetName[] = Object.keys(CONTENT_CARD_PRESETS) as CardPresetName[];

// Helper function to validate preset name
export const isValidPreset = (presetName: string): presetName is CardPresetName => {
    return presetName in CONTENT_CARD_PRESETS;
};
