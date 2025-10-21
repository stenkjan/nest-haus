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

// Tall Card Preset interface for tall video/image cards (25% taller than standard)
// Used for content-heavy cards with images and buttons
export interface TallCardPreset {
    id: number;
    title: string;
    subtitle?: string;
    description: string;
    mobileTitle?: string;
    mobileSubtitle?: string;
    mobileDescription?: string;
    image?: string; // Image path (stored in IMAGES.function or other category)
    video?: string; // Video path (if using video instead of image)
    backgroundColor: string;
    playbackRate?: number; // For video cards (1.0 = normal speed)
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

/**
 * ==================================================================================
 * TALL CARD COMPONENT PRESET GUIDE
 * ==================================================================================
 * 
 * Tall cards are 25% taller than standard cards and designed for content-heavy
 * sections with images/videos and buttons. They automatically adapt to all breakpoints.
 * 
 * TWO VARIANTS AVAILABLE:
 * -----------------------
 * 1. **No Padding** (TALL_CARD_PROPS) - Image fills to card edges
 * 2. **With Padding** (TALL_CARD_PROPS_WITH_PADDING) - 15px gap around image
 * 
 * USAGE EXAMPLE (No Padding):
 * ----------------------------
 * ```tsx
 * import { getTallCard, TALL_CARD_PROPS } from "@/constants/cardContent";
 * 
 * const myCard = getTallCard(1);
 * 
 * <UnifiedContentCard {...TALL_CARD_PROPS} customData={[myCard]} />
 * ```
 * 
 * USAGE EXAMPLE (With Padding):
 * ------------------------------
 * ```tsx
 * import { getTallCard, TALL_CARD_PROPS_WITH_PADDING } from "@/constants/cardContent";
 * 
 * const myCard = getTallCard(1);
 * 
 * <UnifiedContentCard {...TALL_CARD_PROPS_WITH_PADDING} customData={[myCard]} />
 * ```
 * 
 * OR MANUALLY SET PADDING:
 * ------------------------
 * ```tsx
 * <UnifiedContentCard
 *   layout="video"
 *   style="standard"
 *   variant="static"
 *   heightMode="tall"
 *   imagePadding="none"      // or "standard" for padding
 *   maxWidth={true}
 *   showInstructions={false}
 *   customData={[myCard]}
 * />
 * ```
 * 
 * CREATING NEW TALL CARD CONTENT:
 * --------------------------------
 * Add to PROCESS_CARDS_CONTENT in src/constants/cardContent.ts:
 * 
 * ```tsx
 * {
 *   id: 2,
 *   title: "Your Title",
 *   subtitle: "", // Optional
 *   description: "Your description text...",
 *   image: IMAGES.function.yourImage, // Add image to IMAGES.function first
 *   backgroundColor: "#F4F4F4",
 *   buttons: [
 *     {
 *       text: "Primary Action",
 *       variant: "primary",
 *       size: "xs",
 *       link: "/your-link",
 *     },
 *     {
 *       text: "Secondary Action",
 *       variant: "landing-secondary-blue",
 *       size: "xs",
 *       link: "/another-link",
 *     },
 *   ],
 * }
 * ```
 * 
 * AUTOMATIC BREAKPOINT BEHAVIOR:
 * ------------------------------
 * Mobile (<1024px):
 *   - Vertical stack: text top, image (16:10) bottom
 *   - Text centered
 *   - Buttons HIDDEN on mobile (per design standard)
 *   - Auto height
 * 
 * Tablet (1024px):
 *   - Horizontal split: text 1/3, image 2/3
 *   - Image aspect ratio: 1:1 (square)
 *   - Image aligned LEFT (starts from left edge, crops right)
 *   - Card height: 657.5px
 *   - Text padding: 48px (px-12)
 * 
 * Desktop (1280px - 1379px):
 *   - Horizontal split: text 1/3, image 2/3
 *   - Image fills full height (no aspect ratio constraint)
 *   - Image aligned LEFT
 *   - Card height: 637.5px
 *   - Text padding: 48px (px-12)
 * 
 * Desktop Large (1380px - 1599px):
 *   - Horizontal split: text 1/3, image 2/3
 *   - Image fills full height
 *   - Image aligned LEFT
 *   - Card height: 685px
 *   - Text padding: 48px (px-12)
 * 
 * Desktop XL (1600px+):
 *   - Horizontal split: text 1/3, image 2/3
 *   - Image fills full height
 *   - Image aligned LEFT
 *   - Card height: 787.5px
 *   - Text padding: 48px (px-12)
 * 
 * IMAGE ALIGNMENT DETAIL:
 * -----------------------
 * - Desktop: `object-left` - Image LEFT edge aligns with container LEFT edge
 *   - If image is wider than container: RIGHT side gets cropped (not visible)
 *   - If image is narrower: whitespace appears on RIGHT
 * - Mobile: `object-center` - Image centered in container
 * 
 * COMPONENT PROPS EXPLAINED:
 * --------------------------
 * - layout: "video" 
 *   → Enables horizontal split layout (text left, media right)
 *   → Automatically switches to vertical on mobile
 * 
 * - style: "standard" | "glass"
 *   → "standard": Black text on light background (#F4F4F4)
 *   → "glass": White text on dark background (#121212)
 * 
 * - variant: "static" | "responsive"
 *   → "static": Single card, no carousel
 *   → "responsive": Multiple cards with navigation
 * 
 * - heightMode: "tall" | "standard"
 *   → "tall": 25% taller (for content-heavy cards)
 *   → "standard": Normal height
 * 
 * - maxWidth: boolean
 *   → true: Apply max-w-[1700px] container
 *   → false: Full width
 * 
 * - showInstructions: boolean
 *   → true: Show "Use arrow keys to navigate"
 *   → false: Hide instructions
 * 
 * WHERE IS THIS USED:
 * -------------------
 * - /entwurf page: "Der Auftakt" card
 * - Any page needing a tall, content-rich card with image and buttons
 * 
 * COMPARISON TO STANDARD VIDEO CARD:
 * -----------------------------------
 * Standard video card (like on /dein-nest):
 *   - Heights: 510px (1280px), 548px (1380px), 630px (1600px)
 *   - Buttons: Shown on desktop, hidden on mobile
 *   - Image: Centered (object-center)
 * 
 * Tall video card:
 *   - Heights: 637.5px (1280px), 685px (1380px), 787.5px (1600px)
 *   - Buttons: Shown on desktop, hidden on mobile
 *   - Image: Left-aligned (object-left) to ensure important content visible
 * 
 * ==================================================================================
 */