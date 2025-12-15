import { IMAGES } from "./images";

/**
 * Centralized Card Content System
 * 
 * This file contains all content data for UnifiedContentCard components.
 * Content is organized by category for easy import and management.
 */

// Button configuration shared across all card types
export interface ButtonConfig {
    text: string;
    variant:
    | "primary"
    | "secondary"
    | "primary-narrow"
    | "secondary-narrow"
    | "secondary-narrow-white"
    | "secondary-narrow-blue"
    | "tertiary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "info"
    | "landing-primary"
    | "landing-secondary"
    | "landing-secondary-blue"
    | "landing-secondary-blue-white"
    | "configurator";
    size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
    link?: string;
    file?: string;
    fileMode?: "open" | "download";
    onClick?: () => void;
}

// Unified content card data structure
export interface ContentCardData {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    mobileTitle?: string;
    mobileSubtitle?: string;
    mobileDescription?: string;
    mobileTitleClass?: string; // Optional: mobile-only title class override
    mobileDescriptionClass?: string; // Optional: mobile-only description class override
    image?: string;
    video?: string;
    overlayImage?: string;
    backgroundColor: string;
    textColor?: string; // Optional custom text color
    descriptionColor?: string; // Optional custom color for description text
    icon?: React.ReactNode; // Optional custom icon component
    iconNumber?: number; // Or specify a step icon by number (1-7)
    playbackRate?: number; // For video cards (1.0 = normal speed)
    buttons?: ButtonConfig[];
    aspectRatio?: "2x1" | "1x1" | "2x2"; // Optional aspect ratio for overlay-text cards - "2x1" = portrait, "1x1" = square, "2x2" = extra wide
    imageFit?: "cover" | "contain-width" | "contain"; // Optional image fit behavior: "cover" (default - fills container), "contain-width" (fits width, crops top/bottom), "contain" (fits entire image, may show background)
    reverseTextOrder?: boolean; // Optional: reverse text order in overlay-text layout (title first, then description)
    headingLevel?: "h2" | "h3"; // Optional: control heading level for title in overlay-text layout (default: h3)
    externalLink?: string; // Optional: external URL to link the entire card to
    bottomLabel?: string; // Optional: bottom metadata label (p-primary-small) - for team-card layout (can contain HTML)
    bottomText?: string; // Optional: bottom metadata text (p-tertiary) - for team-card layout
    imagePosition?: "left" | "center" | "right"; // Optional: override image position (object-left, object-center, object-right)
    customPadding?: string; // Optional: custom padding classes for glass-quote layout (e.g., "p-8 md:p-10 lg:p-12")
}

/**
 * MATERIALIEN CONTENT
 * Material cards for construction materials showcase
 * Used in: MaterialShowcase, Configurator lightboxes
 */
export const MATERIALIEN_CONTENT: ContentCardData[] = [
    {
        id: 1,
        title: "Naturstein - Kanfanar",
        subtitle: "",
        description:
            "Der massive Kalkstein überzeugt durch seine natürliche Eleganz, zeitlose Ästhetik und hohe Widerstandsfähigkeit. Mit seiner charakteristischen Farbgebung, die von warmen Beigetönen bis hin zu sanften Graunuancen reicht, verleiht er Innen- und Außenbereichen eine edle, harmonische Ausstrahlung.",
        mobileTitle: "Naturstein - Kanfanar",
        mobileSubtitle: "",
        mobileDescription:
            "Kalkstein mit warmen Beige- bis Grautönen. Elegante, widerstandsfähige Oberfläche für Innen- und Außenbereiche.",
        image: IMAGES.materials.kalkstein,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 2,
        title: "Eichenholz - Parkett",
        subtitle: "",
        description:
            "Der Parkettboden aus Eiche steht für zeitlose Eleganz, natürliche Wärme und außergewöhnliche Langlebigkeit. Die charakteristische Maserung und warme Farbgebung verleihen jedem Raum eine edle, gemütliche Atmosphäre. Dank hoher Härte ist Eichenparkett besonders strapazierfähig und eignet sich für Wohnräume sowie stark frequentierte Bereiche.",
        mobileTitle: "Eichenholz - Parkett",
        mobileSubtitle: "",
        mobileDescription:
            "Zeitloses Eichenparkett: warm, strapazierfähig und langlebig – ideal für Wohnräume und stark genutzte Bereiche.",
        image: IMAGES.materials.eicheParkett,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 3,
        title: "Feinsteinzeug - Schiefer",
        subtitle: "",
        description:
            "Schiefer steht für natürliche Eleganz, hohe Strapazierfähigkeit und zeitlose Ästhetik. Als Bodenbelag überzeugt er durch robuste, trittfeste Oberfläche und Beständigkeit gegen Temperatur- und Feuchtigkeitseinflüsse. Die geschichtete Struktur und Anthrazit- bis Tiefgrautöne verleihen Räumen eine edle Ausstrahlung – langlebig in modernen wie klassischen Wohnkonzepten.",
        mobileTitle: "Feinsteinzeug - Schiefer",
        mobileSubtitle: "",
        mobileDescription:
            "Robustes Feinsteinzeug in Schieferoptik: trittfest, feuchtigkeitsbeständig und edel in Anthrazit bis Tiefgrau.",
        image: IMAGES.materials.schiefer,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 4,
        title: "Lärche - Fassade",
        subtitle: "",
        description:
            "Lärchen-Holzlattung vereint natürliche Ästhetik und Langlebigkeit. Warme Farbgebung und charakteristische Maserung sorgen für zeitlose Eleganz. Unbehandelte Lärche ist witterungsbeständig und entwickelt mit der Zeit eine edle silbergraue Patina, die den rustikalen Charme unterstreicht.",
        mobileTitle: "Lärche-Fassade",
        mobileSubtitle: "",
        mobileDescription:
            "Lärchenlattung: warm, witterungsbeständig, entwickelt edle Patina. Zeitlose, nachhaltige Fassadengestaltung.",
        image: IMAGES.materials.laercheFassade,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 5,
        title: "Verbundplatten - Schwarz",
        subtitle: "",
        description:
            "Die HPL-Platten sind eine erstklassige Lösung für moderne, langlebige Fassadengestaltungen. Gefertigt aus hochverdichteten Laminatplatten, bieten sie außergewöhnliche Witterungsbeständigkeit, UV-Stabilität und Schlagfestigkeit. Die kratzfeste, pflegeleichte Oberfläche trotzt selbst extremen klimatischen Bedingungen.",
        mobileTitle: "Verbundplatten - Schwarz",
        mobileSubtitle: "",
        mobileDescription:
            "HPL-Verbundplatten: wetterfest, UV-stabil, kratz- und schlagfest. Pflegeleicht und langlebig für moderne Fassaden.",
        image: IMAGES.materials.fassadenplattenSchwarz,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 6,
        title: "Verbundplatten - Weiß",
        subtitle: "",
        description:
            "Die HPL-Platten sind eine erstklassige Lösung für moderne, langlebige Fassadengestaltungen. Gefertigt aus hochverdichteten Laminatplatten, bieten sie außergewöhnliche Witterungsbeständigkeit, UV-Stabilität und Schlagfestigkeit. Die kratzfeste, pflegeleichte Oberfläche trotzt selbst extremen klimatischen Bedingungen.",
        mobileTitle: "Verbundplatten - Weiß",
        mobileSubtitle: "",
        mobileDescription:
            "HPL-Verbundplatten in Weiß: wetterfest, UV-stabil und kratzfest. Pflegeleicht, langlebig und ideal für klare, moderne Fassaden.",
        image: IMAGES.materials.fassadenplattenWeiss,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 7,
        title: "Trapezblech - Schwarz",
        subtitle: "",
        description:
            "Trapezblech ist langlebig und vielseitig für Dach- und Fassadenkonstruktionen. Hohe Stabilität und Wetterfestigkeit bieten zuverlässigen Schutz vor Wind, Regen und Schnee. Die profilierte Form ermöglicht hohe Tragfähigkeit bei geringem Eigengewicht – für effiziente, kostensparende Montage.",
        mobileTitle: "Trapezblech - Schwarz",
        mobileSubtitle: "",
        mobileDescription:
            "Robustes Trapezblech: hohe Tragfähigkeit, geringes Gewicht, wetterfest und langlebig – ideal für Dach und Fassade.",
        image: IMAGES.materials.trapezblech,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 8,
        title: "Eiche - Innenverkleidung",
        subtitle: "",
        description:
            "Eichen-Innenverkleidung bringt die Wärme von Holz in Ihre Räume. Die Farbgebung und charaktervolle Maserung schaffen eine behagliche, hochwertige Atmosphäre. Eiche ist widerstandsfähig und eignet sich für den täglichen Gebrauch – formstabil und langlebig.",
        mobileTitle: "Eiche - Innenverkleidung",
        mobileSubtitle: "",
        mobileDescription:
            "Echte Eiche für warme, natürliche Räume. Widerstandsfähig, pflegeleicht und ideal für den täglichen Gebrauch.",
        image: IMAGES.materials.eiche,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 9,
        title: "Lärche - Innenverkleidung",
        subtitle: "",
        description:
            "Die Innenverkleidung aus Lärchenholz bringt natürliche Wärme und lebendige Optik in den Innenraum. Die markante Maserung und warmen, goldgelben Töne schaffen eine gemütliche Atmosphäre. Das Holz ist leicht, gut zu verarbeiten und wirkt feuchtigkeitsregulierend – ideal für ein angenehmes Raumklima. Zeitlos in modernen wie traditionellen Wohnkonzepten.",
        mobileTitle: "Lärche - Innenverkleidung",
        mobileSubtitle: "",
        mobileDescription:
            "Lärchenholz mit lebendiger Maserung und warmen Tönen. Gemütlich, leicht zu verarbeiten und raumklimafreundlich.",
        image: IMAGES.materials.holzLaerche,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 10,
        title: "Fichte - Innenverkleidung",
        subtitle: "",
        description:
            "Die Innenverkleidung aus Fichte überzeugt durch ihre helle, freundliche Ausstrahlung und verleiht jedem Raum Weite und Geborgenheit. Die sanfte Maserung und warme Farbgebung schaffen eine wohltuende Atmosphäre. Fichte ist leicht, vielseitig einsetzbar und sorgt dank feuchtigkeitsregulierender Eigenschaften für ein angenehmes Raumklima.",
        mobileTitle: "Fichte - Innenverkleidung",
        mobileSubtitle: "",
        mobileDescription:
            "Helle Fichte für freundliche, weite Räume. Natürlich, feuchtigkeitsregulierend und vielseitig im Innenraum einsetzbar.",
        image: IMAGES.materials.holzFichte,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 11,
        title: "Brettschichtholz",
        subtitle: "",
        description:
            "Brettschichtholz (BSH) ist ein hochwertiger Holzwerkstoff aus verleimten, faserparallel angeordneten Lamellen: formstabil, tragfähig und rissarm – ideal für langlebige Konstruktionen. Zertifizierte Forstwirtschaft und effiziente Fertigung fördern Nachhaltigkeit. Wiederverwendbar und recyclingfähig für eine echte Kreislaufwirtschaft.",
        mobileTitle: "Fichte - Konstruktion",
        mobileSubtitle: "",
        mobileDescription:
            "BSH-Fichte: formstabil, tragfähig, rissarm. Nachhaltig produziert, präzise gefertigt, wiederverwendbar und recyclingfähig.",
        image: IMAGES.materials.konstruktionFichte,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 12,
        title: "Isolierung - Dämmplatten",
        subtitle: "",
        description:
            "Holzfaser-Dämmplatten sind eine nachhaltige Lösung für Dach und Wand. Sie bieten hervorragenden Wärme- und Hitzeschutz, sind diffusionsoffen, regulieren das Raumklima und schützen vor Feuchtigkeit. Aus nachhaltiger Forstwirtschaft, recycelbar, mit hoher Speichermasse und einfacher Verarbeitung.",
        mobileTitle: "Isolierung - Dämmplatten",
        mobileSubtitle: "",
        mobileDescription:
            "Holzfaser-Dämmplatten: starker Wärme- und Hitzeschutz, diffusionsoffen, klimaregulierend, nachhaltig und recycelbar.",
        image: IMAGES.materials.konstruktionIsolierung,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 13,
        title: "OSB - Konstruktion",
        subtitle: "",
        description:
            "OSB‑Platten bieten hohe Druck- und Biegefestigkeit sowie exzellente Maßhaltigkeit – ideal für tragende und aussteifende Bauteile. Die kreuzweise Verleimung sorgt für formstabile, belastbare Elemente. Ressourcenschonend produziert, langlebig und sortenrein wiederverwendbar oder recycelbar.",
        mobileTitle: "OSB - Konstruktion",
        mobileSubtitle: "",
        mobileDescription:
            "OSB‑Platten: druck- und biegefest, formstabil, ressourcenschonend. Langlebig, wiederverwendbar und gut recyclebar.",
        image: IMAGES.materials.konstruktionOSB,
        backgroundColor: "#F4F4F4",
    },
];

/**
 * PHOTOVOLTAIK CONTENT
 * Solar panel and renewable energy content
 * Used in: Configurator lightboxes
 */
export const PHOTOVOLTAIK_CONTENT: ContentCardData[] = [
    {
        id: 1,
        title: "Photovoltaik - Varianten",
        subtitle: "Holzfassade",
        description:
            "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken dauerhaft Ihre Energiekosten. Die hochwertigen Systeme sind langlebig, wartungsarm und fügen sich harmonisch in Ihre Architektur ein. Sie leisten einen Beitrag zum Klimaschutz und steigern den Immobilienwert.",
        mobileTitle: "Photovoltaik - Varianten",
        mobileSubtitle: "Holzfassade",
        mobileDescription:
            "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten.",
        image: IMAGES.configurations.pv_holzfassade,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 2,
        title: "Photovoltaik - Varianten",
        subtitle: "Trapezblech",
        description:
            "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken dauerhaft Ihre Energiekosten. Die hochwertigen Systeme sind langlebig, wartungsarm und fügen sich harmonisch in Ihre Architektur ein. Sie leisten einen Beitrag zum Klimaschutz und steigern den Immobilienwert.",
        mobileTitle: "Photovoltaik - Varianten",
        mobileSubtitle: "Trapezblech",
        mobileDescription:
            "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten.",
        image: IMAGES.configurations.pv_trapezblech,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 3,
        title: "Photovoltaik - Varianten",
        subtitle: "Fassadenplatten Schwarz",
        description:
            "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken dauerhaft Ihre Energiekosten. Die hochwertigen Systeme sind langlebig, wartungsarm und fügen sich harmonisch in Ihre Architektur ein. Sie leisten einen Beitrag zum Klimaschutz und steigern den Immobilienwert.",
        mobileTitle: "Photovoltaik - Varianten",
        mobileSubtitle: "Fassadenplatten Schwarz",
        mobileDescription:
            "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten.",
        image: IMAGES.configurations.pv_plattenschwarz,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 4,
        title: "Photovoltaik - Varianten",
        subtitle: "Fassadenplatten Weiß",
        description:
            "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken dauerhaft Ihre Energiekosten. Die hochwertigen Systeme sind langlebig, wartungsarm und fügen sich harmonisch in Ihre Architektur ein. Sie leisten einen Beitrag zum Klimaschutz und steigern den Immobilienwert.",
        mobileTitle: "Photovoltaik - Varianten",
        mobileSubtitle: "Fassadenplatten Weiß",
        mobileDescription:
            "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten.",
        image: IMAGES.configurations.pv_plattenweiss,
        backgroundColor: "#F4F4F4",
    },
];

/**
 * BELICHTUNGSPAKET CONTENT
 * Lighting package content with overlay images
 * Used in: Configurator lightboxes
 */
export const BELICHTUNGSPAKET_CONTENT: ContentCardData[] = [
    {
        id: 1,
        title: "Belichtungspaket - Light",
        subtitle: "Grundbeleuchtung",
        description:
            "Das Light-Paket bietet eine durchdachte Grundbeleuchtung mit 15% der Nestfläche als Fenster- und Türenöffnungen. Diese Konfiguration schafft eine angenehme, gemütliche Atmosphäre und eignet sich besonders für Wohnbereiche, in denen gezieltes, warmes Licht gewünscht ist. Die bewusst reduzierte Verglasung sorgt für optimale Energieeffizienz bei gleichzeitig ausreichend natürlichem Lichteinfall.",
        mobileTitle: "Belichtungspaket - Light",
        mobileSubtitle: "Grundbeleuchtung",
        mobileDescription:
            "Das Light-Paket bietet eine solide Grundbeleuchtung mit 15% der Nestfläche. Ideal für gemütliche Wohnbereiche mit gezielter Lichtführung.",
        image: IMAGES.hero.nestHaus7,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 2,
        title: "Belichtungspaket - Medium",
        subtitle: "Ausgewogene Beleuchtung",
        description:
            "Das Medium-Paket bietet eine ausgewogene Beleuchtung mit 22% der Nestfläche als Fenster- und Türenöffnungen. Diese Konfiguration schafft eine harmonische Balance zwischen natürlichem Lichteinfall und Energieeffizienz. Ideal für Wohn- und Arbeitsbereiche, die sowohl Gemütlichkeit als auch ausreichend Tageslicht benötigen. Die durchdachte Verteilung der Öffnungen sorgt für optimale Raumausleuchtung.",
        mobileTitle: "Belichtungspaket - Medium",
        mobileSubtitle: "Ausgewogene Beleuchtung",
        mobileDescription:
            "Das Medium-Paket bietet ausgewogene Helligkeit mit 22% der Nestfläche. Perfekt für Wohn- und Arbeitsbereiche mit natürlichem Lichtbedarf.",
        image: IMAGES.hero.nestHaus1,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 3,
        title: "Belichtungspaket - Bright",
        subtitle: "Maximale Helligkeit",
        description:
            "Das Bright-Paket bietet maximale Helligkeit mit 28% der Nestfläche als Fenster- und Türenöffnungen. Diese Konfiguration schafft lichtdurchflutete, offene Räume mit großzügiger Verglasung und optimaler Tageslichtnutzung. Perfekt für moderne Wohnkonzepte, die Transparenz, Weite und eine starke Verbindung zur Natur schaffen möchten. Die großflächigen Öffnungen ermöglichen spektakuläre Ausblicke und ein Gefühl von Grenzenlosigkeit.",
        mobileTitle: "Belichtungspaket - Bright",
        mobileSubtitle: "Maximale Helligkeit",
        mobileDescription:
            "Das Bright-Paket bietet maximale Helligkeit mit 28% der Nestfläche. Ideal für lichtdurchflutete, offene Wohnkonzepte mit großzügiger Verglasung.",
        image: IMAGES.hero.nestHaus3,
        backgroundColor: "#F4F4F4",
    },
];

/**
 * FENSTER & TÜREN CONTENT
 * Windows and doors content
 * Used in: Configurator lightboxes
 */
export const FENSTER_TUEREN_CONTENT: ContentCardData[] = [
    {
        id: 1,
        title: "Fenster & Türen - Unsere Materialien",
        subtitle: "Kunststoff PVC",
        description:
            "PVC-Fenster bieten hervorragende Wärmedämmung und Langlebigkeit bei optimaler Kosteneffizienz. Das hochwertige Kunststoffmaterial ist pflegeleicht, witterungsbeständig und UV-stabil. Moderne PVC-Fenster sind in verschiedenen Farben und Designs erhältlich und überzeugen durch ihre ausgezeichneten Isoliereigenschaften, die zu niedrigeren Heizkosten beitragen.",
        mobileTitle: "Fenster & Türen - Unsere Materialien",
        mobileSubtitle: "Kunststoff PVC",
        mobileDescription:
            "PVC-Fenster bieten hervorragende Wärmedämmung und Langlebigkeit. Sie sind pflegeleicht, witterungsbeständig und in verschiedenen Farben und Designs erhältlich.",
        image: IMAGES.windows.pvc,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 2,
        title: "Fenster & Türen - Unsere Materialien",
        subtitle: "Holz Fichte",
        description:
            "Fichte-Holzfenster stehen für natürliche Schönheit, nachhaltiges Bauen und zeitlose Eleganz. Das helle, warme Holz mit seiner charakteristischen Maserung schafft eine gemütliche Atmosphäre und reguliert auf natürliche Weise das Raumklima. Holzfenster aus Fichte sind umweltfreundlich, renewable und verleihen jedem Zuhause eine authentische, warme Ausstrahlung.",
        mobileTitle: "Fenster & Türen - Unsere Materialien",
        mobileSubtitle: "Holz Fichte",
        mobileDescription:
            "Fichte-Holzfenster stehen für natürliche Schönheit und nachhaltiges Bauen. Das helle, warme Holz schafft eine gemütliche Atmosphäre und reguliert das Raumklima.",
        image: IMAGES.windows.fichte,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 3,
        title: "Fenster & Türen - Unsere Materialien",
        subtitle: "Aluminium",
        description:
            "Aluminium-Fenster überzeugen durch ihre moderne, puristische Optik und außergewöhnliche Stabilität. Das robuste Material ist korrosionsbeständig, wartungsarm und ermöglicht die Realisierung großer Glasflächen bei schlanken Profilen. Aluminium-Fenster sind langlebig, recyclebar und fügen sich perfekt in zeitgenössische Architekturkonzepte ein.",
        mobileTitle: "Fenster & Türen - Unsere Materialien",
        mobileSubtitle: "Aluminium",
        mobileDescription:
            "Aluminium-Fenster überzeugen durch ihre moderne Optik und hohe Stabilität. Sie sind korrosionsbeständig, wartungsarm und ermöglichen große Glasflächen.",
        image: IMAGES.windows.aluminium,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 4,
        title: "Fenster & Türen - Unsere Materialien",
        subtitle: "Holz Eiche",
        description:
            "Eichen-Holzfenster stehen für höchste Qualität, zeitlose Eleganz und außergewöhnliche Langlebigkeit. Das robuste Hartholz überzeugt durch charaktervolle Maserung und warme Farbgebung, die jedem Raum eine edle, behagliche Atmosphäre verleiht. Eiche ist extrem widerstandsfähig und entwickelt über Jahre eine wunderschöne Patina, die den natürlichen Charakter unterstreicht.",
        mobileTitle: "Fenster & Türen - Unsere Materialien",
        mobileSubtitle: "Holz Eiche",
        mobileDescription:
            "Eichen-Holzfenster stehen für höchste Qualität und zeitlose Eleganz. Das robuste Hartholz überzeugt durch seine charaktervolle Maserung und außergewöhnliche Langlebigkeit.",
        image: IMAGES.windows.eiche,
        backgroundColor: "#F4F4F4",
    },
];

/**
 * STIRNSEITE CONTENT (Optional)
 * Front side glazing options
 * Used in: Configurator lightboxes (optional category)
 */
export const STIRNSEITE_CONTENT: ContentCardData[] = [
    {
        id: 1,
        title: "Stirnseite - Keine Verglasung",
        subtitle: "Geschlossen",
        description:
            "Die geschlossene Stirnseite bietet maximale Privatsphäre, Energieeffizienz und strukturelle Integrität. Diese Option eignet sich besonders für Bereiche, in denen Ruhe und Intimität gewünscht sind, oder wenn die Hauptverglasung bereits über andere Gebäudeseiten realisiert wird. Die geschlossene Konstruktion minimiert Wärmeverluste und bietet optimalen Schutz vor Witterungseinflüssen.",
        mobileTitle: "Stirnseite - Keine Verglasung",
        mobileSubtitle: "Geschlossen",
        mobileDescription:
            "Die geschlossene Stirnseite bietet maximale Privatsphäre und Energieeffizienz. Ideal für ruhige Bereiche ohne zusätzliche Fensteröffnungen.",
        image: IMAGES.configurations.nest75_holzlattung,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 2,
        title: "Stirnseite - Verglasung Oben",
        subtitle: "8m² Verglasung",
        description:
            "Die obere Verglasung der Stirnseite schafft faszinierende Lichteffekte und ermöglicht einzigartige Ausblicke in den Himmel und die Baumkronen. Mit 8m² strategisch positionierter Fensterfläche bringt diese Option natürliches Licht in die oberen Bereiche des Raumes und schafft eine offene, luftige Atmosphäre. Besonders wirkungsvoll in Räumen mit hohen Decken oder Galeriebereichen.",
        mobileTitle: "Stirnseite - Verglasung Oben",
        mobileSubtitle: "8m² Verglasung",
        mobileDescription:
            "Die obere Verglasung schafft interessante Lichteffekte und ermöglicht Ausblicke nach oben. 8m² strategisch positionierte Fensterfläche für natürliches Licht.",
        image: IMAGES.configurations.stirnseiteHolzfassade,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 3,
        title: "Stirnseite - Verglasung Unten",
        subtitle: "17m² Verglasung",
        description:
            "Die untere Verglasung der Stirnseite bietet direkten Ausblick auf Augenhöhe und ermöglicht eine starke Verbindung zwischen Innen- und Außenraum. Mit 17m² großzügiger Fensterfläche im Erdgeschossbereich schaffen Sie optimale Sichtbeziehungen und natürlichen Lichteinfall. Diese Option eignet sich besonders für Wohnbereiche, die eine direkte Verbindung zur Terrasse oder zum Garten schaffen sollen.",
        mobileTitle: "Stirnseite - Verglasung Unten",
        mobileSubtitle: "17m² Verglasung",
        mobileDescription:
            "Die untere Verglasung bietet direkten Ausblick und Zugang. 17m² Fensterfläche im Erdgeschossbereich für optimale Raumverbindung.",
        image: IMAGES.configurations.stirnseitePlattenSchwarz,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 4,
        title: "Stirnseite - Vollverglasung",
        subtitle: "25m² Verglasung",
        description:
            "Die komplette Verglasung der Stirnseite bietet ein spektakuläres, raumgreifendes Erlebnis mit maximaler Transparenz und Lichtdurchflutung. Mit 25m² durchgehender Verglasung entsteht ein Gefühl von Grenzenlosigkeit und eine dramatische Verbindung zur Landschaft. Diese Option schafft einen wahren Blickfang und eignet sich besonders für Häuser mit außergewöhnlichen Ausblicken oder als architektonisches Statement.",
        mobileTitle: "Stirnseite - Vollverglasung",
        mobileSubtitle: "25m² Verglasung",
        mobileDescription:
            "Die komplette Stirnseite verglast bietet maximales Licht und spektakuläre Ausblicke. 25m² durchgehende Verglasung für ein Gefühl von Grenzenlosigkeit.",
        image: IMAGES.configurations.stirnseiteTrapezblech,
        backgroundColor: "#F4F4F4",
    },
];

/**
 * KONTAKTFORMULAR CONTENT
 * Contact form content (special case - different structure)
 * Used in: Configurator lightboxes
 * 
 * Note: This category works differently and may need custom handling
 */
export const KONTAKTFORMULAR_CONTENT: ContentCardData[] = [
    {
        id: 1,
        title: "Kontaktformular",
        subtitle: "Get in touch",
        description: "Contact form content - special handling required",
        mobileTitle: "Kontakt",
        mobileSubtitle: "Get in touch",
        mobileDescription: "Contact form",
        image: "/images/placeholder.png",
        backgroundColor: "#F4F4F4",
    },
];

/**
 * ABLAUF STEPS CONTENT
 * Process steps showing how to build with Nest-Haus
 * Used in: Entdecken page
 */
export const ABLAUF_STEPS_CONTENT: ContentCardData[] = [
    {
        id: 1,
        title: "1. Konzept-Check",
        subtitle: "Der erste Schritt",
        description:
            "Mit dem Konzept-Check erhältst du deine Grundstücksanalyse, deinen individuellen Entwurfsplan und eine konkrete Kostenplanung. \n\nSolltest du dich gegen den Bau deines Nest Hauses entscheiden, kannst du die Grundstücksanalyse auch für andere Bauvorhaben verwenden.",
        backgroundColor: "#f4f4f4",
        iconNumber: 1,
    },
    {
        id: 2,
        title: "2. Einreichplan",
        subtitle: "Rechtliche Grundlagen",
        description:
            "Sobald dein Konzept-Check fertiggestellt ist, starten wir mit der rechtlich korrekten Planung für dein zuständiges Bauamt (Planungspaket Basis).\n\nDabei werden alle formellen Aspekte wie Stromversorgung, Wasser- und Kanalanschlüsse, Zufahrten sowie örtliche Bauvorschriften geprüft, abgestimmt und detailliert definiert, um eine reibungslose Genehmigung sicherzustellen.",
        backgroundColor: "#f4f4f4",
        iconNumber: 2,
    },
    {
        id: 3,
        title: "3. Baubescheid",
        subtitle: "Grundstücksvorbereitung",
        description:
            "Sobald dein Baubescheid vorliegt, starten die Vorbereitungen auf deinem Grundstück. Dazu zählen alle notwendigen Erschließungs- und Grabungsarbeiten wie Strom-, Wasser- und Kanalanschlüsse sowie die Zufahrt.\n\nDie Kosten dafür trägst du selbst. Wir begleiten dich mit erfahrenen Partnerfirmen, damit jeder Schritt reibungslos und effizient umgesetzt wird.",
        backgroundColor: "#f4f4f4",
        iconNumber: 3,
    },
    {
        id: 4,
        title: "4. Fundament",
        subtitle: "Eine solide Basis",
        description:
            "Wenn du dein Fundament selbst bauen möchtest, erhältst du von uns alle notwendigen Informationen und detaillierten Planungsunterlagen.\n\nSolltest du die Arbeiten an uns übergeben wollen, übernehmen wir Planung, Organisation und Umsetzung. Zuverlässig und fachgerecht.",
        backgroundColor: "#f4f4f4",
        iconNumber: 4,
    },
    {
        id: 5,
        title: "5. Lieferung + Aufbau",
        subtitle: "In nur 6 Monaten",
        description:
            "Sobald dein Fundament fertig ist, liefern wir dein Nest-Haus direkt zu dir. Unser erfahrenes Team übernimmt die Montage vor Ort, sodass dein Zuhause in kürzester Zeit steht.\n\nDie Kosten sind transparent geregelt und werden nach Bekanntgabe deines Bauplatzes exakt festgelegt.",
        backgroundColor: "#f4f4f4",
        iconNumber: 5,
    },
    {
        id: 6,
        title: "6. Fertigstellung",
        subtitle: "Gemeinsam ans Ziel",
        description:
            "Für die Fertigstellung begleiten wir dich Schritt für Schritt und vermitteln bei Bedarf zuverlässige Partnerfirmen. Ob in Eigenregie oder mit Fachbetrieben\n\nMit dem Planungspaket Plus erhältst du einen klaren Ablaufplan und Unterstützung bis zur Schlüsselübergabe, inklusive aller Gewerke von Elektro über Sanitär bis Innenausbau.",
        backgroundColor: "#f4f4f4",
        iconNumber: 6,
    },
    {
        id: 7,
        title: "7. Interior Design",
        subtitle: "Planungspaket Pro",
        description:
            "In der Interior Planung entsteht ein stimmiges Konzept aus Möbeln, Materialien, Farben und Licht, das Funktion und Atmosphäre vereint.\n\nMit dem Planungspaket Pro begleiten wir dich bis zur Fertigstellung, damit dein Zuhause innen wie außen perfekt harmoniert.",
        backgroundColor: "#f4f4f4",
        iconNumber: 7,
    },
];

/**
 * PLANUNGSPAKETE CONTENT
 * Planning packages with pricing and extended descriptions
 * Used in: Dein-Part page, Planungspakete lightbox
 */
export interface PlanungspaketCardData extends ContentCardData {
    image: string; // Override to make image required for Planungspakete
    price: string; // Override to make price required for Planungspakete
    grayWord?: string;
    extendedDescription?: string;
    mobileExtendedDescription?: string;
}

export const PLANUNGSPAKETE_CONTENT: PlanungspaketCardData[] = [
    {
        id: 1,
        title: "Planungspaket 01",
        subtitle: "Basis",
        description:
            "Inkl.\n\nEinreichplanung des Gesamtprojekts,\n\nFachberatung und Baubegleitung,\n\nBürokratische Unterstützung",
        mobileTitle: "Planungspaket 01",
        mobileSubtitle: "Basis",
        mobileDescription:
            "Inkl.\n\nEinreichplanung des Gesamtprojekts,\n\nFachberatung und Baubegleitung,\n\nBürokratische Unterstützung",
        image: IMAGES.hero.nestHaus8,
        price: "inkludiert",
        backgroundColor: "#F4F4F4",
        grayWord: "Basis",
        extendedDescription:
            "Nachdem dein Konzept-Check abgeschlossen ist, erstellen wir die vollständige und rechtlich korrekte Planung für dein zuständiges Bauamt. Im Planungspaket Basis bereiten wir alle notwendigen Unterlagen auf, die für den offiziellen Einreichprozess erforderlich sind. Dazu gehören die präzise Darstellung des geplanten Gebäudes auf deinem Grundstück, die Prüfung der örtlichen Bauvorschriften sowie die Berücksichtigung aller relevanten Abstände, Höhen und Flächen. \n \n Darüber hinaus stimmen wir technische Aspekte wie Stromversorgung, Wasser- und Kanalanschlüsse, Heizungsanschlussmöglichkeiten und Zufahrtswege sorgfältig ab. Auch Anforderungen zur Erschließung, zu Brandschutz oder zu besonderen Auflagen der Behörde werden berücksichtigt und in die Planung integriert. \n \n Mit dem Planungspaket Basis erhältst du eine genehmigungsfähige Einreichplanung und die Sicherheit, dass wir dich während des gesamten Bauprozesses begleiten und unterstützen, von den ersten Behördenschritten bis hin zur finalen Umsetzung deines Nest Hauses.",
        mobileExtendedDescription:
            "Nachdem dein Konzept-Check abgeschlossen ist, erstellen wir die vollständige und rechtlich korrekte Planung für dein zuständiges Bauamt. Im Planungspaket Basis bereiten wir alle notwendigen Unterlagen auf, die für den offiziellen Einreichprozess erforderlich sind. Dazu gehören die präzise Darstellung des geplanten Gebäudes auf deinem Grundstück, die Prüfung der örtlichen Bauvorschriften sowie die Berücksichtigung aller relevanten Abstände, Höhen und Flächen. \n \n Darüber hinaus stimmen wir technische Aspekte wie Stromversorgung, Wasser- und Kanalanschlüsse, Heizungsanschlussmöglichkeiten und Zufahrtswege sorgfältig ab. Auch Anforderungen zur Erschließung, zu Brandschutz oder zu besonderen Auflagen der Behörde werden berücksichtigt und in die Planung integriert. \n \n Mit dem Planungspaket Basis erhältst du eine genehmigungsfähige Einreichplanung und die Sicherheit, dass wir dich während des gesamten Bauprozesses begleiten und unterstützen, von den ersten Behördenschritten bis hin zur finalen Umsetzung deines Nest Hauses.",
    },
    {
        id: 2,
        title: "Planungspaket 02",
        subtitle: "Plus",
        description:
            "Inkl.\n\nPlanungspaket Basis,\n\nHaustechnikplanung\n\nDetailplanungen,\n\nAusführungsplanung Innenausbau",
        mobileTitle: "Planungspaket 02",
        mobileSubtitle: "Plus",
        mobileDescription:
            "Inkl.\n\nPlanungspaket Basis,\n\nHaustechnikplanung\n\nDetailplanungen,\n\nAusführungsplanung Innenausbau",
        image: IMAGES.hero.nestHaus1,
        price: "€4.900,00", // Updated Nov 2025 - NEW: 4900€
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
            "Inkl.\n\nPlanungspaket Plus,\n\nBeleuchtungskonzept, Möblierungsplanung,\n\nFarb- und Materialkonzept",
        mobileTitle: "Planungspaket 03",
        mobileSubtitle: "Pro",
        mobileDescription:
            "Inkl.\n\nPlanungspaket Plus,\n\nBeleuchtungskonzept, Möblierungsplanung,\n\nFarb- und Materialkonzept",
        image: IMAGES.hero.nestHaus4,
        price: "€9.600,00", // Updated Nov 2025 - NEW: 9600€
        backgroundColor: "#F4F4F4",
        grayWord: "Pro",
        extendedDescription:
            "Du willst nicht nur planen, du willst gestalten. Mit Gefühl für Raum, Stil und Atmosphäre. \n \n Das Pro-Paket ergänzt die technischen und baurechtlichen Grundlagen der ersten beiden Pakete um eine umfassende gestalterische Ebene. Gemeinsam entwickeln wir ein Interiorkonzept, das deine Wünsche in Raumgefühl, Möblierung und Stil widerspiegelt. Die Küche wird funktional durchdacht und gestalterisch in das Gesamtkonzept eingebettet – alle Anschlüsse und Geräte exakt geplant. Ein stimmungsvolles Licht- und Beleuchtungskonzept bringt Leben in deine Räume, während harmonisch abgestimmte Farben und Materialien innen wie außen für ein rundes Gesamtbild sorgen. Auch der Garten und die Außenräume werden in die Planung miteinbezogen, sodass dein neues Zuhause nicht nur innen, sondern auch im Außenbereich überzeugt. \n \nMit dem Pro-Paket wird dein Nest-Haus zum Ausdruck deiner Persönlichkeit. Durchdacht, gestaltet und bereit zum Leben.",
        mobileExtendedDescription:
            "Du willst nicht nur planen, du willst gestalten. Mit Gefühl für Raum, Stil und Atmosphäre. \n \n Das Pro-Paket ergänzt die technischen und baurechtlichen Grundlagen der ersten beiden Pakete um eine umfassende gestalterische Ebene. Gemeinsam entwickeln wir ein Interiorkonzept, das deine Wünsche in Raumgefühl, Möblierung und Stil widerspiegelt. Die Küche wird funktional durchdacht und gestalterisch in das Gesamtkonzept eingebettet – alle Anschlüsse und Geräte exakt geplant. Ein stimmungsvolles Licht- und Beleuchtungskonzept bringt Leben in deine Räume, während harmonisch abgestimmte Farben und Materialien innen wie außen für ein rundes Gesamtbild sorgen. Auch der Garten und die Außenräume werden in die Planung miteinbezogen, sodass dein neues Zuhause nicht nur innen, sondern auch im Außenbereich überzeugt. \n \nMit dem Pro-Paket wird dein Nest-Haus zum Ausdruck deiner Persönlichkeit. Durchdacht, gestaltet und bereit zum Leben.",
    },
];

/**
 * FULL IMAGE CARDS CONTENT
 * Single full-width image cards for various uses
 * Used in: Various sections as static single images or image galleries
 */
export const FULL_IMAGE_CARDS_CONTENT: ContentCardData[] = [
    {
        id: 1,
        title: "Hand Drawing - Planning Sketch",
        subtitle: "",
        description: "",
        image: IMAGES.function.nestHausHandDrawing,
        backgroundColor: "#F4F4F4",
    },
    // Add more full image cards here as needed
];

/**
 * VIDEO BACKGROUND CARDS CONTENT
 * Overlay-text cards with video backgrounds - minimal text
 * Used in: Various pages with video-driven content
 */
export const VIDEO_BACKGROUND_CARDS_CONTENT: ContentCardData[] = [
    {
        id: 1,
        title: "Grundstücksanalyse und Entwurfsplan",
        subtitle: "",
        description: "Dein Konzept-Check",
        video: IMAGES.videos.videoCard01,
        backgroundColor: "#F4F4F4",
        aspectRatio: "2x1", // Tall portrait format
        buttons: [
            {
                text: "Dein Konzept-Check",
                variant: "primary",
                size: "xs",
                link: "/konzept-check",
            },
        ],
    },
    {
        id: 2,
        title: "Keine Lebensentscheidung. Bleib flexibel.",
        subtitle: "",
        description: "Warum Nest?",
        video: IMAGES.videos.videoCard02,
        backgroundColor: "#F4F4F4",
        aspectRatio: "2x1", // Square format
        buttons: [
            {
                text: "Unsere Philosophie",
                variant: "secondary-narrow-white",
                size: "xs",
                link: "/warum-wir",
            },
        ],
    },
    {
        id: 3,
        title: "Schaffen neue Möglichkeiten",
        subtitle: "",
        description: "Neue Technologien",
        video: IMAGES.videos.videoCard03,
        backgroundColor: "#F4F4F4",
        aspectRatio: "2x1", // Tall portrait format
        buttons: [
            {
                text: "Das System verstehen",
                variant: "secondary-narrow-white",
                size: "xs",
                link: "/nest-system",
            },
        ],
    },
    {
        id: 4,
        title: "Gemeinsam Großes schaffen",
        subtitle: "",
        description: "Lerne uns kennen",
        video: IMAGES.videos.videoCard04,
        backgroundColor: "#F4F4F4",
        aspectRatio: "2x1", // Square format
        buttons: [
            {
                text: "Termin vereinbaren",
                variant: "secondary-narrow-white",
                size: "xs",
                link: "/kontakt",
            },
        ],
    },
    {
        id: 5,
        title: "Klarheit an erster Stelle",
        subtitle: "",
        description: "Zu den häufig gestellten Fragen",
        video: IMAGES.videos.videoCard05,
        backgroundColor: "#F4F4F4",
        aspectRatio: "2x1", // Square format
        buttons: [
            {
                text: "Häufige Fragen",
                variant: "secondary-narrow-white",
                size: "xs",
                link: "/faq",
            },
        ],
    },
    {
        id: 6,
        title: "Natürliche Materialien erleben",
        subtitle: "",
        description: "Holz schafft warme Atmosphäre",
        video: IMAGES.videos.videoCard06,
        backgroundColor: "#F4F4F4",
        aspectRatio: "2x1", // Tall portrait format
    },
    {
        id: 6,
        title: "Intelligente Raumkonzepte entdecken",
        subtitle: "",
        description: "Jeder Quadratmeter zählt hier",
        video: IMAGES.videos.videoCard06,
        backgroundColor: "#F4F4F4",
        aspectRatio: "1x1", // Square format
    },
    {
        id: 7,
        title: "Effizienz im modernen Wohnbau",
        subtitle: "",
        description: "Schnell gebaut trotz Qualität",
        video: IMAGES.videos.videoCard07,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 8,
        title: "Energieautark in die Zukunft",
        subtitle: "",
        description: "Photovoltaik macht dich unabhängig",
        video: IMAGES.videos.videoCard08,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 9,
        title: "Minimalistisch und funktional leben",
        subtitle: "",
        description: "Weniger ist oft deutlich mehr",
        video: IMAGES.videos.videoCard09,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 10,
        title: "Natur als ständiger Begleiter",
        subtitle: "",
        description: "Draußen und drinnen verschmelzen",
        video: IMAGES.videos.videoCard10,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 11,
        title: "Modulares Bauen neu gedacht",
        subtitle: "",
        description: "Flexibel wie dein Lebensstil",
        video: IMAGES.videos.videoCard11,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 12,
        title: "Präzision durch seriellen Bau",
        subtitle: "",
        description: "Qualität kommt aus Perfektion",
        video: IMAGES.videos.videoCard12,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 13,
        title: "Wohnraum für jede Lebenslage",
        subtitle: "",
        description: "Anpassbar wie du es brauchst",
        video: IMAGES.videos.videoCard13,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 14,
        title: "Hochwertige Details im Fokus",
        subtitle: "",
        description: "Verarbeitung auf höchstem Niveau",
        video: IMAGES.videos.videoCard14,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 15,
        title: "Zeitlose Eleganz vereint Komfort",
        subtitle: "",
        description: "Stil bleibt über Jahrzehnte",
        video: IMAGES.videos.videoCard15,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 16,
        title: "Zukunftssicher und wertbeständig",
        subtitle: "",
        description: "Investition in kommende Generationen",
        video: IMAGES.videos.videoCard16,
        backgroundColor: "#F4F4F4",
    },
];

/**
 * ENTWURF VIDEO CARDS CONTENT
 * Mixed media cards for the Entwurf page with images and videos
 * Used in: Entwurf page
 */
export const ENTWURF_VIDEO_CARDS_CONTENT: ContentCardData[] = [
    {
        id: 1,
        title: "Architektur fühlen,\nstatt nur sehen",
        subtitle: "",
        description: "Gemeinsam entwerfen wir ein Zuhause, \n das dich wiederspiegelt",
        image: IMAGES.function.nestHausHandDrawing,
        backgroundColor: "#f4f4f4",
        aspectRatio: "2x2", // Portrait format
        imageFit: "contain-width", // Fit full width, crop top/bottom
        textColor: "text-black", // Black text instead of white
        reverseTextOrder: true, // Title first, then description
        headingLevel: "h2", // Use h2 instead of default h3
        buttons: [
            {
                text: "Konzept-Check",
                variant: "primary",
                size: "xs",
                link: "/warenkorb?mode=konzept-check",
            },
            {
                text: "Warum mit Nest?",
                variant: "secondary-narrow-blue",
                size: "xs",
                link: "/warum-wir",
            },
        ],
    },
    {
        id: 2,
        title: "So fühlt sich Wohnen im Nest Haus an",
        subtitle: "",
        description: "Momente schaffen",
        image: IMAGES.function.nestHausInteriorKueche,
        backgroundColor: "#F4F4F4",
        aspectRatio: "2x1", // Portrait format
        mobileTitleClass: "text-lg md:h3-secondary",
        mobileDescriptionClass: "text-base md:p-primary",
    },
    {
        id: 3,
        title: "Erzähle uns von deiner Idee",
        subtitle: "",
        description: "Wir machen's möglich",
        video: IMAGES.videos.videoCard04,
        backgroundColor: "#F4F4F4",
        aspectRatio: "2x1", // Portrait format
        mobileTitleClass: "text-lg md:h3-secondary",
        mobileDescriptionClass: "text-base md:p-primary",
        buttons: [
            {
                text: "Termin vereinbaren",
                variant: "primary",
                size: "xs",
                link: "/kontakt",
            },
        ],
    },
    {
        id: 4,
        title: "Atmosphäre die man spürt",
        subtitle: "",
        description: "Fühlen statt sehen",
        image: IMAGES.hero.mobile.nestHaus3,
        backgroundColor: "#F4F4F4",
        aspectRatio: "2x1", // Portrait format
        mobileTitleClass: "text-lg md:h3-secondary",
        mobileDescriptionClass: "text-base md:p-primary",
    },
    {
        id: 5,
        title: "Wohnen wie du willst, nur mit Nest",
        subtitle: "",
        description: "So funktioniert die Zukunft",
        image: IMAGES.function.nestHausInteriorSteinplatten,
        backgroundColor: "#f4f4f4",
        aspectRatio: "2x1", // Portrait format
        mobileTitleClass: "text-lg md:h3-secondary",
        mobileDescriptionClass: "text-base md:p-primary",
    },

];

/**
 * PROCESS CARDS CONTENT
 * General process/section cards for single-use on various pages
 * Used in: Various pages (Entwurf, etc.)
 */
export const PROCESS_CARDS_CONTENT: ContentCardData[] = [
    {
        id: 1,
        title: "Der Auftakt",
        subtitle: "",
        description:
            "Dein Nest entsteht schnell, doch Individualität steht immer an erster Stelle. Mit deiner ersten Anzahlung erhältst du rechtliche Sicherheit und Klarheit darüber, ob dein Grundstück geeignet ist. Anschließend erstellen wir einen Konzept-Check, der deine Idee greifbar macht.\n\nDu entscheidest, ob du dein Zuhause bereits konfigurieren möchtest, um ein Gefühl für die Kosten zu bekommen, oder ob du ohne Konfiguration fortfährst. In beiden Fällen zahlst du nur für die rechtliche Prüfung und den Konzept-Check.",
        image: IMAGES.function.nestHausEntwurfVorentwurf,
        backgroundColor: "#F4F4F4",
        buttons: [
            {
                text: "Konzept-Check",
                variant: "primary",
                size: "xs",
                link: "/kontakt",
            },
            {
                text: "Unsere Technik",
                variant: "landing-secondary-blue",
                size: "xs",
                link: "/nest-system",
            },
        ],
    },
    {
        id: 2,
        title: "Die Basis",
        subtitle: "",
        description:
            "Mit der Grundstücksanalyse, die Teil deiner ersten Anzahlung ist, erhältst du sofort rechtliche Sicherheit. Wir prüfen alle relevanten Grundlagen, damit dein Bauvorhaben auf festen Boden gestellt ist. \n\n Dabei analysieren wir, ob dein Grundstück den Vorgaben des Landesbaugesetzes, des Raumordnungsgesetzes und den örtlichen Bestimmungen entspricht.Zusätzlich prüfen wir, ob alle Voraussetzungen für den Aufbau deines Nest Hauses erfüllt sind.So kannst du von Anfang an mit Sicherheit planen.",
        image: IMAGES.function.nestHausEntwurfVorentwurf,
        backgroundColor: "#F4F4F4",
        buttons: [
            {
                text: "Unsere Philosophie",
                variant: "primary",
                size: "xs",
                link: "/kontakt",
            },
            {
                text: "Wie funktionierts?",
                variant: "landing-secondary-blue",
                size: "xs",
                link: "/nest-system",
            },
        ],
    },
    {
        id: 2,
        title: "Mit Padding-Beispiel",
        subtitle: "",
        description:
            "Dies ist ein Beispiel für eine Tall Card mit Standard-Padding (15px Abstand um das Bild). Der Inhalt bleibt identisch, nur die Bilddarstellung unterscheidet sich durch den Rahmen. Perfekt für Konsistenz mit anderen Card-Komponenten.\n\nDu kannst beide Varianten verwenden – wähle einfach TALL_CARD_PROPS oder TALL_CARD_PROPS_WITH_PADDING beim Import.",
        image: IMAGES.function.nestHausEntwurfVorentwurf,
        backgroundColor: "#F4F4F4",
        buttons: [
            {
                text: "Konzept-Check",
                variant: "primary",
                size: "xs",
                link: "/kontakt",
            },
            {
                text: "Unsere Technik",
                variant: "landing-secondary-blue",
                size: "xs",
                link: "/nest-system",
            },
        ],
    },
    // Add more process cards here as needed
];

/**
 * GLASS QUOTE CARDS CONTENT
 * Quote-style cards with glass background for testimonials or impactful statements
 * Text format: "quote text|||Attribution Name|||Attribution Title"
 * Layout: Icon top-left, title (p-primary), subtitle (p-primary-small), quote in middle (p-secondary), attribution bottom (p-primary + p-primary-small)
 * Used in: Landing pages, About sections, Testimonials
 */
/**
 * WARUM WIR TEAM CARDS
 * Team/company value cards with custom 9:10 aspect ratio (1.8x2)
 * Used in: Warum Wir page (below testimonials section)
 */
export const WARUM_WIR_TEAM_CARDS_CONTENT: ContentCardData[] = [
    {
        id: 1,
        title: "Markus Schmoltner",
        subtitle: "<span class='text-gray-400'>Architekt</span>",
        description: "Gründer und Inhaber",
        image: IMAGES.team.markusSchmoltner,
        backgroundColor: "#121212",
        textColor: "text-white",
        aspectRatio: "2x1", // Will be custom styled for 9:10 ratio
        bottomLabel: "",
        bottomText: "Betreiber Schmolti's Chalet  \n WKO Top 30 unter 30 \n Tongji Const. Festival 1st Price \n „Verbund“ Top 100 Jungunternehmer",
    },
    {
        id: 2,
        title: "Bernhard Grentner",
        subtitle: "<span class='text-gray-400'>Unternehmer</span>",
        description: "Gründer und Inhaber",
        image: IMAGES.team.bernhardGrentner,
        backgroundColor: "#121212",
        textColor: "text-white",
        aspectRatio: "2x1",
        bottomLabel: "",
        bottomText: "Staatspreis für Innovation \n Fast Forward Award \n  European Logistic Award",
    },
    {
        id: 3,
        title: "Philipp Möstl",
        subtitle: "<span class='text-gray-400'></span>",
        description: "Baumeister & Produktion",
        image: IMAGES.team.philippMoestl,
        backgroundColor: "#121212",
        textColor: "text-white",
        aspectRatio: "2x1",
        imagePosition: "center",
        bottomLabel: "",
        bottomText: "",
    },
    {
        id: 4,
        title: "Ines Sagadin",
        subtitle: "<span class='text-gray-400'></span>",
        description: "Head of Design & Sales",
        image: IMAGES.team.inesSagadin,
        backgroundColor: "#121212",
        textColor: "text-white",
        aspectRatio: "2x1",
        bottomLabel: "",
        bottomText: "",
    },
    {
        id: 5,
        title: "Jan Schmoltner",
        subtitle: "<span class='text-gray-400'></span>",
        description: "Marketing & Media",
        image: IMAGES.team.janSchmoltner,
        backgroundColor: "#121212",
        textColor: "text-white",
        aspectRatio: "2x1",
        bottomLabel: "",
        bottomText: "",
    },
    {
        id: 6,
        title: "Jan Stenk",
        subtitle: "<span class='text-gray-400'></span>",
        description: "Head of Development & IT",
        image: IMAGES.team.janStenk,
        backgroundColor: "#121212",
        textColor: "text-white",
        aspectRatio: "2x1",
        bottomLabel: "",
        bottomText: "",
    },
];

export const GLASS_QUOTE_CARDS_CONTENT: ContentCardData[] = [
    {
        id: 0,
        title: "Wir sind registrierter \n Baumeister-Betrieb in \n Österreich",
        mobileTitle: "Wir sind registrierter Baumeister-Betrieb in Österreich",
        subtitle: "Mitglieder der Bundesinnung Bau, die über eine Gewerbeberechtigung für das Baumeistergewerbe verfügt.",
        description: "",
        mobileDescription: "",
        image: IMAGES.partners.baumeisterGuetesiegel,
        backgroundColor: "#121212",
        aspectRatio: "2x1", // Portrait format (tall)
        textColor: "text-white",
        descriptionColor: "text-gray-400", // Same gray as subtitle on other cards
        reverseTextOrder: false, // Description first (p-primary), then title (h2-title)
        headingLevel: "h3", // Use h2-title for bigger title
        buttons: [
            {
                text: "Terminvereinbarung",
                variant: "primary",
                size: "xs",
                link: "/kontakt",
            },
        ],
    },
    {
        id: 1,
        title: "Technische Universität Graz",
        subtitle: "Projektentwicklung",
        description: "<span class='text-nest-gray'>Ein </span> zukunftsweisendes Projekt, <span class='text-nest-gray'>welches in den Bereichen</span> Nachhaltigkeit<span class='text-nest-gray'>, Ökologie und auch vom technischen Ansatz</span> herausragend <span class='text-nest-gray'>ist!</span>|||Assoc. Prof. Dipl-Ing. Dr. Techn.|||Milena Stravic",
        backgroundColor: "#121212",
        image: IMAGES.partners.tuGraz, // TU Graz logo
        externalLink: "https://www.tugraz.at", // Optional: link to TU Graz website
    },
    {
        id: 2,
        title: "Zimmererei Sobitsch",
        subtitle: "Modulbau",
        description: "Einfache Umsetzung <span class='text-nest-gray'>und gleichzeitig </span>hochwertige <span class='text-nest-gray'>und extrem belastbare</span> Ausführung.|||Holzbaumeister|||Franz Sobitsch",
        backgroundColor: "#121212",
        image: IMAGES.partners.sobitschHolzbau,
        externalLink: "https://www.sobi.at", // Optional: link to Sobitsch website
    },
    {
        id: 3,
        title: "Wirtschaftskammer Steiermark",
        subtitle: "Auszeichnung Top 30 unter 30",
        description: "Wegweisend <span class='text-nest-gray'>in</span> Technologie <span class='text-nest-gray'>und</span> nachhaltigem Bauen. <span class='text-nest-gray'>Nest setzt</span> neue Maßstäbe <span class='text-nest-gray'>für die</span> Zukunft.|||WKO Steiermark|||Von Jury gekürt",
        backgroundColor: "#121212",
        image: IMAGES.partners.wko, // TU-IAM logo
        externalLink: "https://www.wko.at", // Optional: link to WKO website
    },
];

/**
 * CATEGORY TYPE
 * Type-safe category keys
 */
export type ContentCategory =
    | "materialien"
    | "photovoltaik"
    | "belichtungspaket"
    | "fensterTueren"
    | "stirnseite"
    | "kontaktformular"
    | "ablaufSteps"
    | "planungspakete"
    | "fullImageCards"
    | "videoBackgroundCards"
    | "entwurfVideoCards"
    | "processCards"
    | "glassQuoteCards"
    | "warumWirTeamCards";

/**
 * MASTER CONTENT LOOKUP
 * Access content by category ID
 * 
 * Usage:
 * import { CARD_CONTENT_BY_CATEGORY } from '@/constants/cardContent';
 * const materials = CARD_CONTENT_BY_CATEGORY.materialien;
 */
export const CARD_CONTENT_BY_CATEGORY: Record<
    ContentCategory,
    ContentCardData[] | PlanungspaketCardData[]
> = {
    materialien: MATERIALIEN_CONTENT,
    photovoltaik: PHOTOVOLTAIK_CONTENT,
    belichtungspaket: BELICHTUNGSPAKET_CONTENT,
    fensterTueren: FENSTER_TUEREN_CONTENT,
    stirnseite: STIRNSEITE_CONTENT,
    kontaktformular: KONTAKTFORMULAR_CONTENT,
    ablaufSteps: ABLAUF_STEPS_CONTENT,
    planungspakete: PLANUNGSPAKETE_CONTENT,
    fullImageCards: FULL_IMAGE_CARDS_CONTENT,
    videoBackgroundCards: VIDEO_BACKGROUND_CARDS_CONTENT,
    entwurfVideoCards: ENTWURF_VIDEO_CARDS_CONTENT,
    processCards: PROCESS_CARDS_CONTENT,
    glassQuoteCards: GLASS_QUOTE_CARDS_CONTENT,
    warumWirTeamCards: WARUM_WIR_TEAM_CARDS_CONTENT,
};

/**
 * HELPER FUNCTIONS
 */

// Get content by category
export const getContentByCategory = (
    category: ContentCategory
): ContentCardData[] => {
    return CARD_CONTENT_BY_CATEGORY[category] || [];
};

// Get single content item by category and ID
export const getContentById = (
    category: ContentCategory,
    id: number
): ContentCardData | undefined => {
    return CARD_CONTENT_BY_CATEGORY[category]?.find((item) => item.id === id);
};

// Get all available categories
export const getAvailableCategories = (): ContentCategory[] => {
    return Object.keys(CARD_CONTENT_BY_CATEGORY) as ContentCategory[];
};

/**
 * TALL CARD HELPER
 * Quick access to process cards (commonly used for tall cards)
 * 
 * Usage:
 * ```tsx
 * import { getTallCard } from "@/constants/cardContent";
 * 
 * const myCard = getTallCard(1); // Gets "Der Auftakt"
 * 
 * <UnifiedContentCard
 *   layout="video"
 *   style="standard"
 *   variant="static"
 *   heightMode="tall"
 *   maxWidth={true}
 *   showInstructions={false}
 *   customData={[myCard]}
 * />
 * ```
 */
export const getTallCard = (id: number): ContentCardData | undefined => {
    return getContentById("processCards", id);
};

/**
 * TALL CARD PROPS TEMPLATE
 * Standard configuration for tall video cards
 * 
 * Usage:
 * ```tsx
 * import { TALL_CARD_PROPS, getTallCard } from "@/constants/cardContent";
 * 
 * const myCard = getTallCard(1);
 * 
 * <UnifiedContentCard
 *   {...TALL_CARD_PROPS}
 *   customData={[myCard]}
 * />
 * ```
 */
export const TALL_CARD_PROPS = {
    layout: "video" as const,
    style: "standard" as const,
    variant: "static" as const,
    heightMode: "tall" as const,
    imagePadding: "none" as const, // No padding, image fills to edges
    maxWidth: true,
    showInstructions: false,
};

/**
 * TALL CARD PROPS WITH PADDING
 * Alternative configuration with standard padding around the image
 * Same as TALL_CARD_PROPS but with 15px padding around image
 * 
 * Usage:
 * ```tsx
 * import { TALL_CARD_PROPS_WITH_PADDING, getTallCard } from "@/constants/cardContent";
 * 
 * const myCard = getTallCard(1);
 * 
 * <UnifiedContentCard
 *   {...TALL_CARD_PROPS_WITH_PADDING}
 *   customData={[myCard]}
 * />
 * ```
 */
export const TALL_CARD_PROPS_WITH_PADDING = {
    layout: "video" as const,
    style: "standard" as const,
    variant: "static" as const,
    heightMode: "tall" as const,
    imagePadding: "standard" as const, // 15px padding (py-[15px] pr-[15px])
    maxWidth: true,
    showInstructions: false,
};

// Validate category name
export const isValidCategory = (name: string): name is ContentCategory => {
    return name in CARD_CONTENT_BY_CATEGORY;
};

