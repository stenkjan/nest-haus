import React from "react";

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
 * Note: iconNumber specifies which step icon to use (1-7)
 * You can change iconNumber to use a different icon for each step
 */
export const ABLAUF_STEPS_CARDS: SquareTextCardPreset[] = [
    {
        id: 1,
        title: "1. Vorentwurf",
        subtitle: "Erster Schritt.",
        description:
            "Beim Vorentwurf planen wir dein Nest-Haus direkt auf deinem Grundstück. Wir legen die optimale Ausrichtung, Raumaufteilung sowie die Position von Fenstern und Türen fest.\n\nZusätzlich überprüfen wir alle rechtlichen Rahmenbedingungen, damit dein Nest-Haus effizient und rechtssicher realisiert werden kann.\n\nBist du mit dem Vorentwurf nicht zufrieden, kannst du vom Kauf zurücktreten.",
        backgroundColor: "#f4f4f4",
        iconNumber: 1, // Uses step icon 1
    },
    {
        id: 2,
        title: "2. Einreichplan",
        subtitle: "Formalitäten Abklären.",
        description:
            "Sobald dein Vorentwurf fertiggestellt ist, starten wir mit der rechtlich korrekten Planung für dein zuständiges Bauamt (Planungspaket Basis).\n\nDabei werden alle formellen Aspekte wie Stromversorgung, Wasser- und Kanalanschlüsse, Zufahrten sowie örtliche Bauvorschriften geprüft, abgestimmt und detailliert definiert, um eine reibungslose Genehmigung sicherzustellen.",
        backgroundColor: "#f4f4f4",
        iconNumber: 2, // Uses step icon 2
    },
    {
        id: 3,
        title: "3. Baubescheid",
        subtitle: "Grundstücksvorbereitung",
        description:
            "Sobald dein Baubescheid vorliegt, starten die Vorbereitungen auf deinem Grundstück. Dazu zählen alle notwendigen Erschließungs- und Grabungsarbeiten wie Strom-, Wasser- und Kanalanschlüsse sowie die Zufahrt.\n\nDie Kosten dafür trägst du selbst. Wir begleiten dich mit erfahrenen Partnerfirmen, damit jeder Schritt reibungslos und effizient umgesetzt wird.",
        backgroundColor: "#f4f4f4",
        iconNumber: 3, // Uses step icon 3
    },
    {
        id: 4,
        title: "4. Fundament",
        subtitle: "Eine solide Basis",
        description:
            "Wenn du dein Fundament selbst bauen möchtest, erhältst du von uns alle notwendigen Informationen und detaillierten Planungsunterlagen.\n\nSolltest du die Arbeiten an uns übergeben wollen, übernehmen wir Planung, Organisation und Umsetzung. Zuverlässig und fachgerecht.",
        backgroundColor: "#f4f4f4",
        iconNumber: 4, // Uses step icon 4
    },
    {
        id: 5,
        title: "5. Lieferung + Aufbau",
        subtitle: "Immer transparent",
        description:
            "Sobald dein Fundament fertig ist, liefern wir dein Nest-Haus direkt zu dir. Unser erfahrenes Team übernimmt die Montage vor Ort, sodass dein Zuhause in kürzester Zeit steht.\n\nDie Kosten sind transparent geregelt und werden nach Bekanntgabe deines Bauplatzes exakt festgelegt.",
        backgroundColor: "#f4f4f4",
        iconNumber: 5, // Uses step icon 5
    },
    {
        id: 6,
        title: "6. Fertigstellung",
        subtitle: "Planungspaket Plus",
        description:
            "Für die Fertigstellung begleiten wir dich Schritt für Schritt und vermitteln bei Bedarf zuverlässige Partnerfirmen. Ob in Eigenregie oder mit Fachbetrieben\n\nMit dem Planungspaket Plus erhältst du einen klaren Ablaufplan und Unterstützung bis zur Schlüsselübergabe, inklusive aller Gewerke von Elektro über Sanitär bis Innenausbau.",
        backgroundColor: "#f4f4f4",
        iconNumber: 6, // Uses step icon 6
    },
    {
        id: 7,
        title: "7. Interior Design",
        subtitle: "Planungspaket Pro",
        description:
            "In der Interior Planung entsteht ein stimmiges Konzept aus Möbeln, Materialien, Farben und Licht, das Funktion und Atmosphäre vereint.\n\nMit dem Planungspaket Pro begleiten wir dich bis zur Fertigstellung, damit dein Zuhause innen wie außen perfekt harmoniert.",
        backgroundColor: "#f4f4f4",
        iconNumber: 7, // Uses step icon 7
    },
];

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
 */
export const PLANUNGSPAKETE_CARDS = [
    {
        id: 1,
        title: "Planungspaket 01",
        subtitle: "Basis",
        description:
            "Inkl.\nEinreichplanung des Gesamtprojekts\nFachberatung und Baubegleitung\nBürokratische Unterstützung",
        mobileTitle: "Planungspaket 01",
        mobileSubtitle: "Basis",
        mobileDescription:
            "Inkl.\nEinreichplanung des Gesamtprojekts\nFachberatung und Baubegleitung\nBürokratische Unterstützung",
        image: "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
        price: "€10.900,00",
        backgroundColor: "#F4F4F4",
        grayWord: "Basis",
        extendedDescription:
            "Nachdem dein Vorentwurf abgeschlossen ist, erstellen wir die vollständige und rechtlich korrekte Planung für dein zuständiges Bauamt. Im Planungspaket Basis bereiten wir alle notwendigen Unterlagen auf, die für den offiziellen Einreichprozess erforderlich sind. Dazu gehören die präzise Darstellung des geplanten Gebäudes auf deinem Grundstück, die Prüfung der örtlichen Bauvorschriften sowie die Berücksichtigung aller relevanten Abstände, Höhen und Flächen. \n \n Darüber hinaus stimmen wir technische Aspekte wie Stromversorgung, Wasser- und Kanalanschlüsse, Heizungsanschlussmöglichkeiten und Zufahrtswege sorgfältig ab. Auch Anforderungen zur Erschließung, zu Brandschutz oder zu besonderen Auflagen der Behörde werden berücksichtigt und in die Planung integriert. \n \n Mit dem Planungspaket Basis erhältst du eine genehmigungsfähige Einreichplanung und die Sicherheit, dass wir dich während des gesamten Bauprozesses begleiten und unterstützen, von den ersten Behördenschritten bis hin zur finalen Umsetzung deines Nest Hauses.",
        mobileExtendedDescription:
            "Nachdem dein Vorentwurf abgeschlossen ist, erstellen wir die vollständige und rechtlich korrekte Planung für dein zuständiges Bauamt. Im Planungspaket Basis bereiten wir alle notwendigen Unterlagen auf, die für den offiziellen Einreichprozess erforderlich sind. Dazu gehören die präzise Darstellung des geplanten Gebäudes auf deinem Grundstück, die Prüfung der örtlichen Bauvorschriften sowie die Berücksichtigung aller relevanten Abstände, Höhen und Flächen. \n \n Darüber hinaus stimmen wir technische Aspekte wie Stromversorgung, Wasser- und Kanalanschlüsse, Heizungsanschlussmöglichkeiten und Zufahrtswege sorgfältig ab. Auch Anforderungen zur Erschließung, zu Brandschutz oder zu besonderen Auflagen der Behörde werden berücksichtigt und in die Planung integriert. \n \n Mit dem Planungspaket Basis erhältst du eine genehmigungsfähige Einreichplanung und die Sicherheit, dass wir dich während des gesamten Bauprozesses begleiten und unterstützen, von den ersten Behördenschritten bis hin zur finalen Umsetzung deines Nest Hauses.",
    },
    {
        id: 2,
        title: "Planungspaket 02",
        subtitle: "Plus",
        description:
            "Inkl.\nPlanungspaket Basis (Einreichplanung) \n Haustechnik-Planung \n Ausführungsplanung Innenausbau",
        mobileTitle: "Planungspaket 02",
        mobileSubtitle: "Plus",
        mobileDescription:
            "Inkl.\nPlanungspaket Basis (Einreichplanung) \n Haustechnik-Planung \n Ausführungsplanung Innenausbau",
        image: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
        price: "€16.900,00",
        backgroundColor: "#F4F4F4",
        grayWord: "Plus",
        extendedDescription:
            "Du möchtest Unterstützung bei der technischen Innenausbauplanung? Dann ist unser Plus-Paket genau das Richtige für dich. Es umfasst alle Leistungen des Basispakets, von der Einreichplanung bis zur Detailplanung und ergänzt sie um die komplette Haustechnikplanung: Elektrik, Sanitär, Abwasser und Innenausbau. \n \n Warum das sinnvoll ist? Weil du damit alle Leitungen, Anschlüsse und Einbauten frühzeitig mitplanst. Das spart Zeit, vermeidet Abstimmungsprobleme auf der Baustelle und sorgt dafür, dass dein Haus technisch von Anfang an durchdacht ist. \n \n Aber klar, wenn du die technische Planung lieber selbst übernehmen oder mit einem Partner deines Vertrauens umsetzen möchtest, ist das genauso möglich. Unser Nest-System ist so konzipiert, dass du flexibel bleibst und auch diesen Weg einfach gehen kannst. \n \n Das Plus-Paket ist unsere Lösung für dich, wenn du maximale Planungssicherheit willst. Alles aus einer Hand, alles bestens vorbereitet.",
        mobileExtendedDescription:
            "Du möchtest Unterstützung bei der technischen Innenausbauplanung? Dann ist unser Plus-Paket genau das Richtige für dich. Es umfasst alle Leistungen des Basispakets, von der Einreichplanung bis zur Detailplanung und ergänzt sie um die komplette Haustechnikplanung: Elektrik, Sanitär, Abwasser und Innenausbau. \n \n Warum das sinnvoll ist? Weil du damit alle Leitungen, Anschlüsse und Einbauten frühzeitig mitplanst. Das spart Zeit, vermeidet Abstimmungsprobleme auf der Baustelle und sorgt dafür, dass dein Haus technisch von Anfang an durchdacht ist. \n \n Aber klar, wenn du die technische Planung lieber selbst übernehmen oder mit einem Partner deines Vertrauens umsetzen möchtest, ist das genauso möglich. Unser Nest-System ist so konzipiert, dass du flexibel bleibst und auch diesen Weg einfach gehen kannst. \n \n Das Plus-Paket ist unsere Lösung für dich, wenn du maximale Planungssicherheit willst. Alles aus einer Hand, alles bestens vorbereitet.",
    },
    {
        id: 3,
        title: "Planungspaket 03",
        subtitle: "Pro",
        description:
            "Inkl.\nPlanungspaket Plus (HKLS Planung) \n Belauchtungskonzept, Möblierungsplanung, Farb- und Materialkonzept",
        mobileTitle: "Planungspaket 03",
        mobileSubtitle: "Pro",
        mobileDescription:
            "Inkl.\nPlanungspaket Plus (HKLS Planung) \n Belauchtungskonzept, Möblierungsplanung, Farb- und Materialkonzept",
        image: "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche.png",
        price: "€21.900,00",
        backgroundColor: "#F4F4F4",
        grayWord: "Pro",
        extendedDescription:
            "Du willst nicht nur planen, du willst gestalten. Mit Gefühl für Raum, Stil und Atmosphäre. \n \n Das Pro-Paket ergänzt die technischen und baurechtlichen Grundlagen der ersten beiden Pakete um eine umfassende gestalterische Ebene. Gemeinsam entwickeln wir ein Interiorkonzept, das deine Wünsche in Raumgefühl, Möblierung und Stil widerspiegelt. Die Küche wird funktional durchdacht und gestalterisch in das Gesamtkonzept eingebettet – alle Anschlüsse und Geräte exakt geplant. Ein stimmungsvolles Licht- und Beleuchtungskonzept bringt Leben in deine Räume, während harmonisch abgestimmte Farben und Materialien innen wie außen für ein rundes Gesamtbild sorgen. Auch der Garten und die Außenräume werden in die Planung miteinbezogen, sodass dein neues Zuhause nicht nur innen, sondern auch im Außenbereich überzeugt. \n \nMit dem Pro-Paket wird dein Nest-Haus zum Ausdruck deiner Persönlichkeit. Durchdacht, gestaltet und bereit zum Leben.",
        mobileExtendedDescription:
            "Du willst nicht nur planen, du willst gestalten. Mit Gefühl für Raum, Stil und Atmosphäre. \n \n Das Pro-Paket ergänzt die technischen und baurechtlichen Grundlagen der ersten beiden Pakete um eine umfassende gestalterische Ebene. Gemeinsam entwickeln wir ein Interiorkonzept, das deine Wünsche in Raumgefühl, Möblierung und Stil widerspiegelt. Die Küche wird funktional durchdacht und gestalterisch in das Gesamtkonzept eingebettet – alle Anschlüsse und Geräte exakt geplant. Ein stimmungsvolles Licht- und Beleuchtungskonzept bringt Leben in deine Räume, während harmonisch abgestimmte Farben und Materialien innen wie außen für ein rundes Gesamtbild sorgen. Auch der Garten und die Außenräume werden in die Planung miteinbezogen, sodass dein neues Zuhause nicht nur innen, sondern auch im Außenbereich überzeugt. \n \nMit dem Pro-Paket wird dein Nest-Haus zum Ausdruck deiner Persönlichkeit. Durchdacht, gestaltet und bereit zum Leben.",
    },
];

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

// Export all presets for easy access
export const CONTENT_CARD_PRESETS = {};
