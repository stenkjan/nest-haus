/**
 * Card Components Export Index
 * 
 * This file exports all card-related components, types, and content.
 * The system is built around UnifiedContentCard as the main component,
 * with specialized components for specific use cases.
 */

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * UnifiedContentCard - Primary card component
 * Supports multiple layouts: horizontal, vertical, square, video, text-icon, image-only
 * Supports multiple styles: standard, glass
 */
export { default as UnifiedContentCard } from "./UnifiedContentCard";
export type {
    CardLayout,
    CardStyle,
    CardVariant,
    UnifiedContentCardProps,
} from "./UnifiedContentCard";

// ============================================================================
// SPECIALIZED COMPONENTS
// ============================================================================

/**
 * PlanungspaketeCards - Planning packages with pricing
 * Used for displaying the 3 planning packages (Basis, Plus, Pro)
 */
export { default as PlanungspaketeCards } from "./PlanungspaketeCards";
export { default as PlanungspaketeCardsLightbox } from "./PlanungspaketeCardsLightbox";

/**
 * CheckoutPlanungspaketeCards - Checkout planning packages with selection
 * Used in the checkout/cart flow for selecting planning packages
 */
export { default as CheckoutPlanungspaketeCards } from "./CheckoutPlanungspaketeCards";

// ============================================================================
// TYPES
// ============================================================================

/**
 * SquareTextCardData - Type for text-only cards with icons
 * Legacy type kept for backwards compatibility
 */
export type { SquareTextCardData } from "./cardTypes";

// ============================================================================
// CONTENT & PRESETS
// ============================================================================

/**
 * Preset configurations for common card setups
 * - ABLAUF_STEPS: Process steps for "So läuft's ab" section
 * - PLANUNGSPAKETE: Planning packages configuration
 */
export {
    ABLAUF_STEPS_PRESET,
    ABLAUF_STEPS_CARDS,
    ABLAUF_STEPS_BUTTONS,
    PLANUNGSPAKETE_CARDS,
    PLANUNGSPAKETE_BUTTONS,
    PLANUNGSPAKETE_PRESET
} from "@/constants/contentCardPresets";

export type {
    ContentCardPreset,
    VideoCardPreset,
    SquareTextCardPreset
} from "@/constants/contentCardPresets";

/**
 * Centralized content system - all card content organized by category
 * Use getContentByCategory() to access content arrays by category name
 */
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

export type {
    ContentCategory,
    ContentCardData,
    ButtonConfig
} from "@/constants/cardContent";