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
    playbackRate?: number; // Optional playback speed (1.0 = normal, 0.5 = half speed, 2.0 = double speed)
    buttons?: Array<{
        text: string;
        variant: "primary" | "secondary" | "landing-secondary-blue" | "primary-narrow" | "secondary-narrow-blue";
        size: "xs" | "sm" | "md" | "lg";
        link?: string;
        onClick?: () => void;
    }>;
}

// Sicherheit Video Card Preset - Used on konzept#sicherheit and showcase
export const SICHERHEIT_VIDEO_PRESET: VideoCardPreset = {
    id: 1,
    title: "Du hast die Wahl",
    subtitle: "",
    description:
        "Gestalte dein Zuhause so individuell wie dein Leben. In unserem Online-Konfigurator wählst du Größe, Materialien, Ausstattung und Optionen Schritt für Schritt aus. Jede Entscheidung zeigt dir sofort, wie dein Haus aussieht und was es kostet.\nSo erhältst du volle Transparenz und ein realistisches Bild, wie dein Nest-Haus zu deinen Wünschen, deinem Grundstück und deinem Budget passt.",
    mobileTitle: "Du hast die Wahl",
    mobileSubtitle: "",
    mobileDescription:
        "Gestalte dein Zuhause individuell. Wähle Größe, Materialien und Ausstattung im Online-Konfigurator. Jede Entscheidung zeigt dir sofort, wie dein Haus aussieht und was es kostet.",
    video: IMAGES.variantvideo.twelve,
    backgroundColor: "#F4F4F4",
    playbackRate: 0.5, // Play at half speed for better visibility
    buttons: [
        {
            text: "Unser Part",
            variant: "primary" as const,
            size: "xs" as const,
            link: "/konzept",
        },
        {
            text: "Jetzt bauen",
            variant: "secondary" as const,
            size: "xs" as const,
            link: "/konfigurator",
        },
    ],
};

// Transportabilitaet Video Card Preset - Transport animation with technology description
export const TRANSPORTABILITAET_VIDEO_PRESET: VideoCardPreset = {
    id: 2,
    title: "Unsere Technik",
    subtitle: "",
    description:
        "Aufbauen. Mitnehmen. Weitergeben.\nGanz wie du willst. Dank hochpräziser Konstruktion entsteht dein Zuhause in kürzester Zeit, an nahezu jedem Ort. Und wenn du weiterziehst? Dann ziehst du nicht nur um, sondern nimmst dein Zuhause einfach mit. Oder du bleibst flexibel und verkaufst es weiter, so wie ein gut gepflegtes Auto.",
    video: IMAGES.videos.nestHausTransport,
    backgroundColor: "#F4F4F4",
    buttons: [
        {
            text: "Unser Part",
            variant: "primary" as const,
            size: "xs" as const,
            link: "/konzept",
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
};

export const VIDEO_CARD_PRESETS = {
    sicherheit: SICHERHEIT_VIDEO_PRESET,
    transportabilitaet: TRANSPORTABILITAET_VIDEO_PRESET,
};
