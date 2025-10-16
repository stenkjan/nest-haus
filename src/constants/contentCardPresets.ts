import React from "react";
import { ABLAUF_STEPS_CONTENT, PLANUNGSPAKETE_CONTENT } from "./cardContent";

// Content Card Presets for reuse across the application
export interface ContentCardPreset {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    mobileTitle?: string;
    mobileSubtitle?: string;
    mobileDescription?: string;
    image: string;
    backgroundColor: string;
    buttons?: Array<{
        text: string;
        variant: "primary" | "secondary" | "landing-secondary-blue";
        size: "xs" | "sm" | "md" | "lg";
        link?: string;
        onClick?: () => void;
    }>;
}

// Video Card Preset interface for 16:9 video cards
export interface VideoCardPreset {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    mobileTitle?: string;
    mobileSubtitle?: string;
    mobileDescription?: string;
    video: string;
    backgroundColor: string;
    playbackRate?: number; // Optional playback speed (1.0 = normal, 0.5 = half speed, 2.0 = double speed)
    buttons?: Array<{
        text: string;
        variant: "primary" | "secondary" | "primary-narrow" | "secondary-narrow" | "secondary-narrow-white" | "secondary-narrow-blue" | "tertiary" | "outline" | "ghost" | "danger" | "success" | "info" | "landing-primary" | "landing-secondary" | "landing-secondary-blue" | "landing-secondary-blue-white" | "configurator";
        size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
        link?: string;
        onClick?: () => void;
    }>;
}

// Square Text Card Preset interface for text-based carousel cards
export interface SquareTextCardPreset {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    mobileTitle?: string;
    mobileSubtitle?: string;
    mobileDescription?: string;
    backgroundColor: string;
    textColor?: string;
    icon?: React.ReactNode; // Custom icon component
    iconNumber?: number; // Or use a step icon by number (1-7)
    buttons?: Array<{
        text: string;
        variant: "primary" | "secondary" | "primary-narrow" | "secondary-narrow" | "secondary-narrow-white" | "secondary-narrow-blue" | "tertiary" | "outline" | "ghost" | "danger" | "success" | "info" | "landing-primary" | "landing-secondary" | "landing-secondary-blue" | "landing-secondary-blue-white" | "configurator";
        size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
        link?: string;
        file?: string; // Path to file for download/open
        fileMode?: "open" | "download"; // How to handle the file
        onClick?: () => void;
    }>;
}

// Helper to create icons - will be populated by importing from SquareTextCard
// This is exported so components can use it when defining presets
export let createSquareTextCardIcon: (cardId: number, customIcon?: React.ReactNode) => React.ReactNode;

// Function to set the icon creator (called from SquareTextCard component)
export const setIconCreator = (creator: typeof createSquareTextCardIcon) => {
    createSquareTextCardIcon = creator;
};

/**
 * Preset: Process Steps ("So läuft's ab")
 * 7-step process showing how to build with Nest-Haus
 * 
 * Re-exported from cardContent.ts for backwards compatibility
 */
export const ABLAUF_STEPS_CARDS = ABLAUF_STEPS_CONTENT;

/**
 * Buttons configuration for "So läuft's ab" section
 * These buttons appear below the card carousel
 */
export const ABLAUF_STEPS_BUTTONS = [
    {
        text: "Anleitung als PDF",
        variant: "primary" as const,
        size: "xs" as const,
        file: "/files/anleitung.pdf", // Path to the PDF file
        fileMode: "open" as const, // Open in new tab
    },
    {
        text: "Jetzt bauen",
        variant: "landing-secondary-blue" as const,
        size: "xs" as const,
        link: "/konfigurator",
    },
];

/**
 * Complete preset configuration for "So läuft's ab" section
 */
export const ABLAUF_STEPS_PRESET = {
    cards: ABLAUF_STEPS_CARDS,
    buttons: ABLAUF_STEPS_BUTTONS,
};

/**
 * Preset: Planungspakete Cards
 * 3 planning packages with pricing and descriptions
 * 
 * Re-exported from cardContent.ts for backwards compatibility
 */
export const PLANUNGSPAKETE_CARDS = PLANUNGSPAKETE_CONTENT;

/**
 * Buttons configuration for Planungspakete section
 * These buttons appear below the cards
 * Note: onOpenLightbox will be provided by the component
 */
export const PLANUNGSPAKETE_BUTTONS = [
    {
        text: "Die Pakete",
        variant: "primary" as const,
        size: "xs" as const,
        showOnlyOnDesktop: true, // Only show on desktop
        // onClick will be set to openPlanungspakete in the component
    },
    {
        text: "Jetzt bauen",
        variant: "landing-secondary-blue" as const,
        size: "xs" as const,
        link: "/konfigurator",
    },
];

/**
 * Complete preset configuration for Planungspakete section
 */
export const PLANUNGSPAKETE_PRESET = {
    cards: PLANUNGSPAKETE_CARDS,
    buttons: PLANUNGSPAKETE_BUTTONS,
};