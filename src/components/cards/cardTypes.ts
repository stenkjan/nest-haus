/**
 * Card Types - Simplified
 * 
 * This file contains type definitions for specialized card components.
 * For the main UnifiedContentCard component, use types from @/constants/cardContent
 */

/**
 * SquareTextCardData - Used by CheckoutStepCard
 * Text-only square cards with optional icons
 */
export interface SquareTextCardData {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    mobileTitle?: string;
    mobileSubtitle?: string;
    mobileDescription?: string;
    backgroundColor: string;
    textColor?: string;
    icon?: React.ReactNode;
    iconNumber?: number;
}
