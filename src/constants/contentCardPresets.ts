import { IMAGES } from "./images";

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
    buttons?: Array<{
        text: string;
        variant: "primary" | "secondary" | "landing-secondary-blue";
        size: "xs" | "sm" | "md" | "lg";
        link?: string;
        onClick?: () => void;
    }>;
}

// Sicherheit Card Preset - Used on unser-part#sicherheit and showcase
export const SICHERHEIT_CARD_PRESET: ContentCardPreset = {
    id: 1,
    title: "Sicherheit",
    subtitle: "",
    description:
        "Häuser bauen bedeutet, sich an die Spielregeln zu halten und diese können je nach Region unterschiedlich sein. Wir kennen die gesetzlichen Vorgaben genau und unterstützen dich dabei, die Anforderungen deines Baugrunds zu verstehen. Mit unserem Grundstücks-Check prüfen wir, welche Gegebenheiten du bei deinem Wunschgrundstück beachten musst.",
    mobileTitle: "Sicherheit & Grundstücks-Check",
    mobileSubtitle: "",
    mobileDescription:
        "Wir kennen die gesetzlichen Vorgaben genau und unterstützen dich dabei, die Anforderungen deines Baugrunds zu verstehen. Mit unserem Grundstücks-Check prüfen wir alle Gegebenheiten.",
    image: IMAGES.function.nestHausGrundstueckCheck,
    backgroundColor: "#F4F4F4",
    buttons: [
        {
            text: "Dein Part",
            variant: "primary" as const,
            size: "xs" as const,
            link: "/dein-part",
        },
        {
            text: "Jetzt bauen",
            variant: "secondary" as const,
            size: "xs" as const,
            link: "/konfigurator",
        },
    ],
};

// Unsere Technik Video Card Preset - Transport animation with technology description
export const UNSERE_TECHNIK_VIDEO_PRESET: VideoCardPreset = {
    id: 2,
    title: "Unsere Technik",
    subtitle: "",
    description:
        "Aufbauen. Mitnehmen. Weitergeben.\nGanz wie du willst. Dank hochpräziser Konstruktion entsteht dein Zuhause in kürzester Zeit, an nahezu jedem Ort. Und wenn du weiterziehst? Dann ziehst du nicht nur um, sondern nimmst dein Zuhause einfach mit. Oder du bleibst flexibel und verkaufst es weiter, so wie ein gut gepflegtes Auto.",
    video: IMAGES.videos.nestHausTransport,
    backgroundColor: "#F4F4F4",
    buttons: [
        {
            text: "Dein Part",
            variant: "primary" as const,
            size: "xs" as const,
            link: "/dein-part",
        },
        {
            text: "Jetzt bauen",
            variant: "landing-secondary-blue" as const,
            size: "xs" as const,
            link: "/konfigurator",
        },
    ],
};

// Export all presets for easy access
export const CONTENT_CARD_PRESETS = {
    sicherheit: SICHERHEIT_CARD_PRESET,
};

export const VIDEO_CARD_PRESETS = {
    unsereTechnik: UNSERE_TECHNIK_VIDEO_PRESET,
};
