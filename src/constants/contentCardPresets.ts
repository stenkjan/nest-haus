import React from "react";
import {
    ABLAUF_STEPS_CONTENT,
    PLANUNGSPAKETE_CONTENT,
    ENTWURF_VIDEO_CARDS_CONTENT,
    VIDEO_BACKGROUND_CARDS_CONTENT,
    GLASS_QUOTE_CARDS_CONTENT,
} from "./cardContent";

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
        file: "20250708-Ikea-Layout-A5", // Clean path (API adds files/ prefix and resolves hash/extension)
        fileMode: "open" as const, // Open in new tab
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
 * ENTWURF VIDEO CARDS PRESET
 * ==================================================================================
 * 
 * Mixed media cards (images + videos) for the Entwurf page with overlay text.
 * Features card ID 1 with reversed text order (title first, then description).
 * 
 * CARD FEATURES:
 * ---------------
 * - Layout: "overlay-text" - Full background image/video with text overlay
 * - Aspect Ratios: Mix of 2x2 (extra wide) and 2x1 (portrait) on desktop
 * - Mobile Override: All cards forced to 2x1 (portrait) on mobile (<768px)
 * - Card ID 1 Special: Uses h2-title instead of h3, reversed text order, title has line break
 * - Buttons: Multiple buttons supported, 2nd+ buttons hidden on mobile
 * - Text Color: Customizable per card (e.g., black text on light backgrounds)
 * - Image Fit: Supports "contain-width" for full-width images with cropping
 * 
 * USAGE EXAMPLE:
 * ---------------
 * ```tsx
 * import { ENTWURF_VIDEO_CARDS_PRESET } from "@/constants/contentCardPresets";
 * 
 * <UnifiedContentCard
 *   layout="overlay-text"
 *   style="standard"
 *   variant="responsive"
 *   maxWidth={true}
 *   showInstructions={true}
 *   customData={ENTWURF_VIDEO_CARDS_PRESET.cards}
 * />
 * ```
 * 
 * CARD STRUCTURE:
 * ----------------
 * Card 1: "Architektur fühlen,\nstatt nur sehen" (2x2, h2, reversed order, 2 buttons)
 * Card 2: "So fühlt sich Wohnen im Nest Haus an" (2x1)
 * Card 3: "Wohnen wie du willst, Nur mit Nest" (2x1)
 * Card 4+: Additional entwurf-specific cards
 * 
 * MOBILE BEHAVIOR:
 * -----------------
 * - All cards display as 2x1 (portrait) regardless of desktop aspect ratio
 * - Only first button visible on mobile
 * - Text scales responsively using h2-title/h3-secondary/p-primary classes
 * 
 * ==================================================================================
 */
export const ENTWURF_VIDEO_CARDS_PRESET = {
    cards: ENTWURF_VIDEO_CARDS_CONTENT,
    // Optional: Add buttons that appear below the carousel (none for now)
    buttons: [],
};

/**
 * ==================================================================================
 * VIDEO BACKGROUND CARDS PRESET
 * ==================================================================================
 * 
 * Video background cards with overlay text in mixed aspect ratios.
 * Designed for seamless carousel experience with alternating card widths.
 * 
 * CARD FEATURES:
 * ---------------
 * - Layout: "overlay-text" - Full video background with text overlay
 * - Aspect Ratios: Alternating 2x1 (portrait) and 1x1 (square) on desktop
 *   - Cards 1, 3, 5: 2x1 (portrait - narrower)
 *   - Cards 2, 4, 6: 1x1 (square - wider)
 * - Mobile Override: All cards forced to 2x1 (portrait) on mobile (<768px)
 * - Autoplay Videos: All videos loop continuously with optional playback rate control
 * - Text: White text overlay by default (customizable per card)
 * 
 * USAGE EXAMPLE:
 * ---------------
 * ```tsx
 * import { VIDEO_BACKGROUND_CARDS_PRESET } from "@/constants/contentCardPresets";
 * 
 * <UnifiedContentCard
 *   layout="overlay-text"
 *   style="standard"
 *   variant="responsive"
 *   maxWidth={true}
 *   showInstructions={true}
 *   customData={VIDEO_BACKGROUND_CARDS_PRESET.cards}
 * />
 * ```
 * 
 * ASPECT RATIO PATTERN:
 * ----------------------
 * Desktop (≥768px):
 * - Odd cards (1,3,5): 2x1 portrait → narrower, more cards visible
 * - Even cards (2,4,6): 1x1 square → wider, fewer cards visible
 * - Creates visual rhythm in carousel
 * 
 * Mobile (<768px):
 * - All cards: 2x1 portrait → consistent scrolling experience
 * 
 * VIDEO HANDLING:
 * ----------------
 * - Autoplay: Videos start automatically when card is visible
 * - Loop: Videos loop continuously
 * - Muted: All videos muted by default (browser requirement for autoplay)
 * - Playback Rate: Optional speed control (e.g., 0.8 for slower motion)
 * - Caching: Videos cached for better performance
 * 
 * TEXT OVERLAY:
 * --------------
 * - Default order: Description first (p-primary), Title second (h3-secondary)
 * - Position: Left-aligned with padding
 * - Color: White by default (text-white), customizable per card
 * - Responsive: Text scales with breakpoints using standard typography classes
 * 
 * ==================================================================================
 */
export const VIDEO_BACKGROUND_CARDS_PRESET = {
    cards: VIDEO_BACKGROUND_CARDS_CONTENT,
    // Optional: Add buttons that appear below the carousel (none for now)
    buttons: [],
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
 * Desktop XL (1536px+):
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
 * - /konzept-check page: "Der Auftakt" card
 * - Any page needing a tall, content-rich card with image and buttons
 * 
 * COMPARISON TO STANDARD VIDEO CARD:
 * -----------------------------------
 * Standard video card (like on /hoam):
 *   - Heights: 510px (1280px), 548px (1380px), 630px (1536px)
 *   - Buttons: Shown on desktop, hidden on mobile
 *   - Image: Centered (object-center)
 * 
 * Tall video card:
 *   - Heights: 637.5px (1280px), 685px (1380px), 787.5px (1536px)
 *   - Buttons: Shown on desktop, hidden on mobile
 *   - Image: Left-aligned (object-left) to ensure important content visible
 * 
 * ==================================================================================
 */

/**
 * ==================================================================================
 * TALL VIDEO CARDS PRESET
 * ==================================================================================
 * 
 * Tall video cards with overlay text - 25% taller than standard video cards.
 * Combines the video background overlay-text layout with heightMode="tall" for
 * more prominent, impactful video content cards.
 * 
 * CARD FEATURES:
 * ---------------
 * - Layout: "overlay-text" - Full video background with text overlay
 * - Height Mode: "tall" - 25% taller than standard video cards
 * - Aspect Ratios: Supports same aspect ratios as VIDEO_BACKGROUND_CARDS_PRESET
 *   - 2x1 (portrait) and 1x1 (square) on desktop
 *   - All cards forced to 2x1 (portrait) on mobile (<768px)
 * - Autoplay Videos: All videos loop continuously with optional playback rate control
 * - Text: White text overlay by default (customizable per card)
 * 
 * USAGE EXAMPLE:
 * ---------------
 * ```tsx
 * import { TALL_VIDEO_CARDS_PRESET } from "@/constants/contentCardPresets";
 * 
 * // Option 1: Use preset with default cards
 * <UnifiedContentCard
 *   {...TALL_VIDEO_CARDS_PRESET}
 *   customData={TALL_VIDEO_CARDS_PRESET.cards}
 * />
 * 
 * // Option 2: Use preset props with custom cards
 * <UnifiedContentCard
 *   {...TALL_VIDEO_CARDS_PRESET}
 *   customData={yourCustomCards}
 * />
 * ```
 * 
 * HEIGHT COMPARISON:
 * ------------------
 * Standard video cards (VIDEO_BACKGROUND_CARDS_PRESET):
 *   - Desktop (1280px): ~692px width, ~692px height
 *   - Desktop (1536px+): ~830px width, ~830px height
 * 
 * Tall video cards (TALL_VIDEO_CARDS_PRESET):
 *   - Desktop (1280px): ~865px width, ~865px height (25% taller)
 *   - Desktop (1536px+): ~1037px width, ~1037px height (25% taller)
 * 
 * KEY DIFFERENCES FROM STANDARD VIDEO CARDS:
 * ------------------------------------------
 * - 25% taller for more visual impact
 * - Same video handling (autoplay, loop, muted)
 * - Same text overlay behavior
 * - Same aspect ratio support
 * - Better for featured or hero video content
 * 
 * COMPARISON TO OTHER TALL CARDS:
 * --------------------------------
 * - TALL_CARD_PROPS (layout="video"): Horizontal split (text left, image right)
 * - TALL_VIDEO_CARDS_PRESET (layout="overlay-text"): Full video background with overlay
 * 
 * ==================================================================================
 */
export const TALL_VIDEO_CARDS_PRESET = {
    layout: "overlay-text" as const,
    style: "standard" as const,
    variant: "responsive" as const,
    heightMode: "tall" as const,
    maxWidth: true,
    showInstructions: true,
    cards: VIDEO_BACKGROUND_CARDS_CONTENT, // Uses same content as standard video cards
    buttons: [], // Optional: Add buttons that appear below the carousel
};

/**
 * ==================================================================================
 * GLASS QUOTE CARDS PRESET
 * ==================================================================================
 * 
 * Quote-style cards with glass background for testimonials and impactful statements.
 * Features quote mark, mixed bold/gray text formatting, and attribution.
 * 
 * CARD FEATURES:
 * ---------------
 * - Layout: "glass-quote" - Glass background with quote-style text layout
 * - Text Format: Quote text with **bold segments** (wrap in **text** for bold)
 * - Attribution: Separated by ||| (triple pipe)
 *   Format: "quote text with **bold**|||Name|||Title"
 * - Style: Glass effect with backdrop blur
 * - Colors: White text for bold, gray for normal text
 * - Aspect Ratio: Wider cards (1.2x width) for better readability
 * 
 * USAGE EXAMPLE:
 * ---------------
 * ```tsx
 * import { GLASS_QUOTE_CARDS_PRESET } from "@/constants/contentCardPresets";
 * 
 * <UnifiedContentCard
 *   layout="glass-quote"
 *   style="glass"
 *   variant="responsive"
 *   backgroundColor="black"
 *   maxWidth={true}
 *   showInstructions={true}
 *   customData={GLASS_QUOTE_CARDS_PRESET.cards}
 * />
 * ```
 * 
 * TEXT FORMATTING:
 * -----------------
 * - Use **text** to make text white and bold
 * - Regular text appears in gray
 * - Separate quote, name, and title with |||
 * 
 * Example:
 * "Ein **zukunftsweisendes** Projekt|||Dr. Name|||Position"
 * 
 * BACKGROUND:
 * -----------
 * - Use black background (backgroundColor="black") for best glass effect
 * - Glass effect includes backdrop blur and subtle border
 * - Dark overlay ensures text readability
 * 
 * RESPONSIVE BEHAVIOR:
 * --------------------
 * - Desktop: 1.9 cards per view on large screens
 * - Tablet: 1.5 cards per view
 * - Mobile: 1.3 cards per view with narrower aspect ratio
 * - Text scales with breakpoints for optimal readability
 * 
 * ==================================================================================
 */
export const GLASS_QUOTE_CARDS_PRESET = {
    layout: "glass-quote" as const,
    style: "glass" as const,
    variant: "responsive" as const,
    backgroundColor: "black" as const,
    maxWidth: true,
    showInstructions: true,
    cards: GLASS_QUOTE_CARDS_CONTENT,
};
