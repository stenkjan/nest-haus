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
    image?: string;
    video?: string;
    overlayImage?: string;
    backgroundColor: string;
    textColor?: string; // Optional custom text color
    icon?: React.ReactNode; // Optional custom icon component
    iconNumber?: number; // Or specify a step icon by number (1-7)
    playbackRate?: number; // For video cards (1.0 = normal speed)
    buttons?: ButtonConfig[];
    aspectRatio?: "2x1" | "1x1" | "2x2"; // Optional aspect ratio for overlay-text cards - "2x1" = portrait, "1x1" = square, "2x2" = extra wide
    imageFit?: "cover" | "contain-width"; // Optional image fit behavior: "cover" (default - fills container), "contain-width" (fits width, crops top/bottom)
    reverseTextOrder?: boolean; // Optional: reverse text order in overlay-text layout (title first, then description)
    headingLevel?: "h2" | "h3"; // Optional: control heading level for title in overlay-text layout (default: h3)
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
            "Der Parkettboden aus Eiche steht für zeitlose Eleganz, natürliche Wärme und außergewöhnliche Langlebigkeit. Die charakteristische Maserung und die warme Farbgebung der Eiche verleihen jedem Raum eine edle und zugleich gemütliche Atmosphäre. Dank der hohen Härte und Widerstandsfähigkeit des Holzes ist Eichenparkett besonders strapazierfähig und eignet sich sowohl für Wohnräume als auch für stark frequentierte Bereiche.",
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
            "Schiefer steht für natürliche Eleganz, hohe Strapazierfähigkeit und zeitlose Ästhetik. Als Bodenbelag überzeugt er durch robuste, trittfeste Oberfläche und Beständigkeit gegen Temperatur- und Feuchtigkeitseinflüsse. Feine, geschichtete Struktur und Anthrazit- bis Tiefgrautöne verleihen Räumen eine edle, warme Ausstrahlung – langlebig in modernen wie klassischen Wohnkonzepten.",
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
            "Lärchen-Holzlattung vereint natürliche Ästhetik und Langlebigkeit. Warme Farbgebung und charakteristische Maserung sorgen für zeitlose Eleganz. Unbehandelte Lärche ist witterungsbeständig und entwickelt mit der Zeit eine edle silbergraue Patina, die den rustikalen Charme unterstreicht und schützt.",
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
            "Die Fundermax HPL-Platten sind eine erstklassige Lösung für moderne und langlebige Fassadengestaltungen. Gefertigt aus hochverdichteten Laminatplatten, bieten sie eine außergewöhnliche Witterungsbeständigkeit, UV-Stabilität und Schlagfestigkeit. Ihre widerstandsfähige Oberfläche ist kratzfest, pflegeleicht und trotzt selbst extremen klimatischen Bedingungen.",
        mobileTitle: "Verbundplatten - Schwarz",
        mobileSubtitle: "",
        mobileDescription:
            "HPL-Verbundplatten: wetterfest, UV-stabil, kratz- und schlagfest. Pflegeleicht und langlebig für moderne Fassaden.",
        image: IMAGES.materials.fundermaxSchwarz,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 6,
        title: "Verbundplatten - Weiß",
        subtitle: "",
        description:
            "Die Fundermax HPL-Platten sind eine erstklassige Lösung für moderne und langlebige Fassadengestaltungen. Gefertigt aus hochverdichteten Laminatplatten, bieten sie eine außergewöhnliche Witterungsbeständigkeit, UV-Stabilität und Schlagfestigkeit. Ihre widerstandsfähige Oberfläche ist kratzfest, pflegeleicht und trotzt selbst extremen klimatischen Bedingungen. ",
        mobileTitle: "Verbundplatten - Weiß",
        mobileSubtitle: "",
        mobileDescription:
            "HPL-Verbundplatten in Weiß: wetterfest, UV-stabil und kratzfest. Pflegeleicht, langlebig und ideal für klare, moderne Fassaden.",
        image: IMAGES.materials.fundermaxWeiss,
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
            "Eichen-Innenverkleidung bringt die Ausstrahlung echten Holzes in Ihre Räume. Warme Farbgebung und charaktervolle Maserung schaffen eine behagliche, hochwertige Atmosphäre. Eiche ist widerstandsfähig und eignet sich für den täglichen Gebrauch – formstabil und langlebig über viele Jahre.",
        mobileTitle: "Eiche - Innenverkleidung",
        mobileSubtitle: "",
        mobileDescription:
            "Echte Eiche für warme, natürliche Räume. Widerstandsfähig, pflegeleicht und ideal für den täglichen Gebrauch.",
        image: IMAGES.materials.eiche,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 9,
        title: "Kiefer - Innenverkleidung",
        subtitle: "",
        description:
            "Die Innenverkleidung aus Kiefernholz bringt natürliche Wärme und lebendige Optik in den Innenraum. Die markante Maserung und die warmen, goldgelben Töne schaffen eine gemütliche, einladende Atmosphäre. Gleichzeitig ist das Holz leicht, gut zu verarbeiten und wirkt feuchtigkeitsregulierend – ideal für ein angenehmes, gesundes Raumklima. Mit seiner zeitlosen Ausstrahlung passt es sowohl in moderne als auch in traditionelle Wohnkonzepte.",
        mobileTitle: "Kiefer - Innenverkleidung",
        mobileSubtitle: "",
        mobileDescription:
            "Kiefernholz mit lebendiger Maserung und warmen Tönen. Gemütlich, leicht zu verarbeiten und raumklimafreundlich.",
        image: IMAGES.materials.holzKiefer,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 10,
        title: "Fichte - Innenverkleidung",
        subtitle: "",
        description:
            "Die Innenverkleidung aus Fichte überzeugt durch ihre helle, freundliche Ausstrahlung und verleiht jedem Raum ein Gefühl von Weite und Geborgenheit. Die sanfte Maserung und der warme Farbton der Fichte bringen die natürliche Schönheit des Holzes zur Geltung und schaffen eine wohltuende, harmonische Atmosphäre. Fichte ist leicht, vielseitig einsetzbar und sorgt dank ihrer feuchtigkeitsregulierenden Eigenschaften für ein angenehmes Raumklima.",
        mobileTitle: "Fichte - Innenverkleidung",
        mobileSubtitle: "",
        mobileDescription:
            "Helle Fichte für freundliche, weite Räume. Natürlich, feuchtigkeitsregulierend und vielseitig im Innenraum einsetzbar.",
        image: IMAGES.materials.holzFichte,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 11,
        title: "Fichte - Konstruktion",
        subtitle: "",
        description:
            "Brettschichtholz (BSH) ist ein hochwertiger Holzwerkstoff aus verleimten, faserparallel angeordneten Lamellen: formstabil, tragfähig und rissarm – ideal für langlebige Konstruktionen. Zertifizierte Forstwirtschaft, effiziente Fertigung und Wiederverwendbarkeit fördern Nachhaltigkeit und Kreislaufwirtschaft.",
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
            "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr. Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie.",
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
            "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr. Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie.",
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
            "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr. Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie.",
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
            "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr. Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie.",
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
            "Das Light-Paket bietet eine durchdachte Grundbeleuchtung mit 12% der Nestfläche als Fenster- und Türenöffnungen. Diese Konfiguration schafft eine angenehme, gemütliche Atmosphäre und eignet sich besonders für Wohnbereiche, in denen gezieltes, warmes Licht gewünscht ist. Die bewusst reduzierte Verglasung sorgt für optimale Energieeffizienz bei gleichzeitig ausreichend natürlichem Lichteinfall.",
        mobileTitle: "Belichtungspaket - Light",
        mobileSubtitle: "Grundbeleuchtung",
        mobileDescription:
            "Das Light-Paket bietet eine solide Grundbeleuchtung mit 12% der Nestfläche. Ideal für gemütliche Wohnbereiche mit gezielter Lichtführung.",
        image: IMAGES.hero.nestHaus7,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 2,
        title: "Belichtungspaket - Medium",
        subtitle: "Ausgewogene Beleuchtung",
        description:
            "Das Medium-Paket bietet eine ausgewogene Beleuchtung mit 16% der Nestfläche als Fenster- und Türenöffnungen. Diese Konfiguration schafft eine harmonische Balance zwischen natürlichem Lichteinfall und Energieeffizienz. Ideal für Wohn- und Arbeitsbereiche, die sowohl Gemütlichkeit als auch ausreichend Tageslicht benötigen. Die durchdachte Verteilung der Öffnungen sorgt für optimale Raumausleuchtung.",
        mobileTitle: "Belichtungspaket - Medium",
        mobileSubtitle: "Ausgewogene Beleuchtung",
        mobileDescription:
            "Das Medium-Paket bietet ausgewogene Helligkeit mit 16% der Nestfläche. Perfekt für Wohn- und Arbeitsbereiche mit natürlichem Lichtbedarf.",
        image: IMAGES.hero.nestHaus1,
        backgroundColor: "#F4F4F4",
    },
    {
        id: 3,
        title: "Belichtungspaket - Bright",
        subtitle: "Maximale Helligkeit",
        description:
            "Das Bright-Paket bietet maximale Helligkeit mit 22% der Nestfläche als Fenster- und Türenöffnungen. Diese Konfiguration schafft lichtdurchflutete, offene Räume mit großzügiger Verglasung und optimaler Tageslichtnutzung. Perfekt für moderne Wohnkonzepte, die Transparenz, Weite und eine starke Verbindung zur Natur schaffen möchten. Die großflächigen Öffnungen ermöglichen spektakuläre Ausblicke und ein Gefühl von Grenzenlosigkeit.",
        mobileTitle: "Belichtungspaket - Bright",
        mobileSubtitle: "Maximale Helligkeit",
        mobileDescription:
            "Das Bright-Paket bietet maximale Helligkeit mit 22% der Nestfläche. Ideal für lichtdurchflutete, offene Wohnkonzepte mit großzügiger Verglasung.",
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
            "Eichen-Holzfenster stehen für höchste Qualität, zeitlose Eleganz und außergewöhnliche Langlebigkeit. Das robuste Hartholz überzeugt durch seine charaktervolle Maserung und warme Farbgebung, die jedem Raum eine edle, behagliche Atmosphäre verleiht. Eiche ist extrem widerstandsfähig und entwickelt über die Jahre eine wunderschöne Patina, die den natürlichen Charakter des Holzes unterstreicht.",
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
        title: "1. Vorentwurf",
        subtitle: "Erster Schritt.",
        description:
            "Beim Vorentwurf planen wir dein Nest-Haus direkt auf deinem Grundstück. Wir legen die optimale Ausrichtung, Raumaufteilung sowie die Position von Fenstern und Türen fest.\n\nZusätzlich überprüfen wir alle rechtlichen Rahmenbedingungen, damit dein Nest-Haus effizient und rechtssicher realisiert werden kann.\n\nBist du mit dem Vorentwurf nicht zufrieden, kannst du vom Kauf zurücktreten.",
        backgroundColor: "#f4f4f4",
        iconNumber: 1,
    },
    {
        id: 2,
        title: "2. Einreichplan",
        subtitle: "Formalitäten Abklären.",
        description:
            "Sobald dein Vorentwurf fertiggestellt ist, starten wir mit der rechtlich korrekten Planung für dein zuständiges Bauamt (Planungspaket Basis).\n\nDabei werden alle formellen Aspekte wie Stromversorgung, Wasser- und Kanalanschlüsse, Zufahrten sowie örtliche Bauvorschriften geprüft, abgestimmt und detailliert definiert, um eine reibungslose Genehmigung sicherzustellen.",
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
        subtitle: "Immer transparent",
        description:
            "Sobald dein Fundament fertig ist, liefern wir dein Nest-Haus direkt zu dir. Unser erfahrenes Team übernimmt die Montage vor Ort, sodass dein Zuhause in kürzester Zeit steht.\n\nDie Kosten sind transparent geregelt und werden nach Bekanntgabe deines Bauplatzes exakt festgelegt.",
        backgroundColor: "#f4f4f4",
        iconNumber: 5,
    },
    {
        id: 6,
        title: "6. Fertigstellung",
        subtitle: "Planungspaket Plus",
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
            "Inkl.\nEinreichplanung des Gesamtprojekts\nFachberatung und Baubegleitung\nBürokratische Unterstützung",
        mobileTitle: "Planungspaket 01",
        mobileSubtitle: "Basis",
        mobileDescription:
            "Inkl.\nEinreichplanung des Gesamtprojekts\nFachberatung und Baubegleitung\nBürokratische Unterstützung",
        image: IMAGES.hero.nestHaus8,
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
        image: IMAGES.hero.nestHaus1,
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
        image: IMAGES.hero.nestHaus4,
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
        title: "Moderne Architektur trifft Natur",
        subtitle: "",
        description: "Zeitloses Design fürs Leben",
        video: IMAGES.videos.videoCard01,
        backgroundColor: "#F4F4F4",
        aspectRatio: "2x1", // Tall portrait format
        buttons: [
            {
                text: "Vorentwurf kaufen",
                variant: "primary",
                size: "xs",
                link: "/kontakt",
            },
        ],
    },
    {
        id: 2,
        title: "Flexibel wohnen nach Maß",
        subtitle: "",
        description: "Dein Zuhause wächst mit",
        video: IMAGES.videos.videoCard02,
        backgroundColor: "#F4F4F4",
        aspectRatio: "1x1", // Square format
    },
    {
        id: 3,
        title: "Nachhaltigkeit trifft Innovation",
        subtitle: "",
        description: "Grünes Bauen für morgen",
        video: IMAGES.videos.videoCard03,
        backgroundColor: "#F4F4F4",
        aspectRatio: "2x1", // Tall portrait format
    },
    {
        id: 4,
        title: "Transparenz durch großzügige Verglasung",
        subtitle: "",
        description: "Licht durchflutet jeden Raum",
        video: IMAGES.videos.videoCard04,
        backgroundColor: "#F4F4F4",
        aspectRatio: "1x1", // Square format
    },
    {
        id: 5,
        title: "Natürliche Materialien erleben",
        subtitle: "",
        description: "Holz schafft warme Atmosphäre",
        video: IMAGES.videos.videoCard05,
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
                text: "Jetzt Vorentwurf sichern",
                variant: "primary",
                size: "xs",
                link: "/kontakt",
            },
            {
                text: "Warum mit Nest",
                variant: "secondary-narrow-blue",
                size: "xs",
                link: "/kontakt",
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
    },
    {
        id: 3,
        title: "Wohnen wie du willst, Nur mit Nest",
        subtitle: "",
        description: "So funktioniert die Zukunft",
        image: IMAGES.function.nestHausInteriorSteinplatten,
        backgroundColor: "#f4f4f4",
        aspectRatio: "2x1", // Portrait format
    },
    {
        id: 4,
        title: "Erzähle uns von deiner Idee",
        subtitle: "",
        description: "Wir machen's möglich",
        video: IMAGES.videos.videoCard07,
        backgroundColor: "#F4F4F4",
        aspectRatio: "2x1", // Portrait format
        buttons: [
            {
                text: "Termin vereinbaren",
                variant: "primary",
                size: "xs",
                link: "/konfigurator",
            },
        ],
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
            "Dein Nest entsteht schnell, doch Individualität steht immer an erster Stelle. Mit deiner ersten Anzahlung erhältst du rechtliche Sicherheit und Klarheit darüber, ob dein Grundstück geeignet ist. Anschließend erstellen wir einen Vorentwurf, der deine Idee greifbar macht.\n\nDu entscheidest, ob du dein Zuhause bereits konfigurieren möchtest, um ein Gefühl für die Kosten zu bekommen, oder ob du ohne Konfiguration fortfährst. In beiden Fällen zahlst du nur für die rechtliche Prüfung und den Vorentwurf.",
        image: IMAGES.function.nestHausEntwurfVorentwurf,
        backgroundColor: "#F4F4F4",
        buttons: [
            {
                text: "Vorentwurf kaufen",
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
            "Mit dem Grundstückscheck, der Teil deiner ersten Anzahlung ist, erhältst du sofort rechtliche Sicherheit. Wir prüfen alle relevanten Grundlagen, damit dein Bauvorhaben auf festen Boden gestellt ist. \n\n Dabei analysieren wir, ob dein Grundstück den Vorgaben des Landesbaugesetzes, des Raumordnungsgesetzes und den örtlichen Bestimmungen entspricht.Zusätzlich prüfen wir, ob alle Voraussetzungen für den Aufbau deines Nest Hauses erfüllt sind.So kannst du von Anfang an mit Sicherheit planen.",
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
                text: "Vorentwurf kaufen",
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
    | "processCards";

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

