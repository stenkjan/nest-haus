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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        overlayImage: IMAGES.pvModule.nest_75_fenster_overlay_light_holz,
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
        backgroundColor: "#121212",
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
 * CATEGORY TYPE
 * Type-safe category keys
 */
export type ContentCategory =
    | "materialien"
    | "photovoltaik"
    | "belichtungspaket"
    | "fensterTueren"
    | "stirnseite"
    | "kontaktformular";

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
    ContentCardData[]
> = {
    materialien: MATERIALIEN_CONTENT,
    photovoltaik: PHOTOVOLTAIK_CONTENT,
    belichtungspaket: BELICHTUNGSPAKET_CONTENT,
    fensterTueren: FENSTER_TUEREN_CONTENT,
    stirnseite: STIRNSEITE_CONTENT,
    kontaktformular: KONTAKTFORMULAR_CONTENT,
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

// Validate category name
export const isValidCategory = (name: string): name is ContentCategory => {
    return name in CARD_CONTENT_BY_CATEGORY;
};

