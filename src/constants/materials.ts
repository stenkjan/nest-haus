import { IMAGES } from "./images";

export interface MaterialCardData {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    mobileTitle: string;
    mobileSubtitle: string;
    mobileDescription: string;
    image: string;
    backgroundColor: string;
}

export const MATERIAL_CARDS: MaterialCardData[] = [
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
        // Original description: "Schiefer steht für natürliche Eleganz, hohe Strapazierfähigkeit und zeitlose Ästhetik. Als Bodenbelag im Innenraum überzeugt er durch seine robuste, trittfeste Oberfläche und seine Beständigkeit gegenüber Temperaturschwankungen und Feuchtigkeit. Die feine, geschichtete Struktur und die charakteristische Farbpalette von Anthrazit bis Tiefgrau verleihen jedem Raum eine edle, zugleich warme Ausstrahlung. Schiefer bringt Ursprünglichkeit und Stil in Einklang – und wird so zum langlebigen Gestaltungselement für moderne wie klassische Wohnkonzepte.",
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
        // Original description: "Die Fassade in Holzlattung aus Lärche Natur vereint natürliche Ästhetik mit langlebiger Qualität. Die charakteristische Maserung und warme Farbgebung der Lärche verleihen Gebäuden eine zeitlose Eleganz und fügen sich harmonisch in die Umgebung ein. Dank der hohen Witterungsbeständigkeit des Holzes entwickelt die unbehandelte Lärche mit der Zeit eine silbergraue Patina, die den rustikalen Charme unterstreicht und zugleich vor Umwelteinflüssen schützt. ",
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
        // Original description: "Trapezblech ist eine langlebige und vielseitig einsetzbare Lösung für Dach- und Fassadenkonstruktionen. Dank seiner hohen Stabilität und Widerstandsfähigkeit eignet es sich perfekt für den privaten als auch den gewerblichen Bereich. Das Material zeichnet sich durch seine wetterfesten Eigenschaften aus und bietet einen zuverlässigen Schutz vor Wind, Regen und Schnee. Die profilierte Form sorgt für eine hohe Tragfähigkeit bei geringem Eigengewicht, was die Montage besonders effizient und kostensparend macht.",
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
        // Original description: "Die Innenverkleidung aus Eiche bringt die unvergleichliche Ausstrahlung echten Holzes in Ihre Räume. Mit ihrer warmen Farbgebung und der charaktervollen Maserung schafft Eiche eine behagliche Atmosphäre und verleiht jedem Interieur eine hochwertige, natürliche Note. Eiche ist nicht nur schön, sondern auch extrem widerstandsfähig.Die robuste Holzart eignet sich perfekt für den täglichen Gebrauch und bewahrt über viele Jahre hinweg ihre Form und Anmutung.",
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
        // Original description: "Brettschichtholz ist ein hochwertiger Holzwerkstoff aus verleimten, faserparallel angeordneten Lamellen. Das Resultat: hohe Formstabilität, enorme Tragkraft und minimale Rissbildung. Ideal für anspruchsvolle, langlebige Konstruktionen.  Als Produkt aus zertifizierter Forstwirtschaft steht es für Nachhaltigkeit und eine effiziente Kreislaufwirtschaft.Die präzise Fertigung ermöglicht nicht nur sparsamen Materialeinsatz, sondern auch Wiederverwendung oder sortenreines Recycling.",
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
        // Original description: "Holzfaserplatten überzeugen als leistungsstarke, nachhaltige Dämmplatten für den Einsatz in Dach und Wand. Hergestellt aus natürlichen Holzfasern, bieten sie exzellenten Wärmeschutz, sowohl im Winter gegen Kälte als auch im Sommer gegen Hitze.  Dank ihrer diffusionsoffenen Struktur unterstützt sie ein gesundes Raumklima und schützt gleichzeitig vor Feuchtigkeit.Die Platte ist recyclebar, stammt aus nachhaltiger Forstwirtschaft und fügt sich nahtlos in ein kreislauffähiges Bausystem ein.  Mit ihrer hohen Speichermasse, ihrer Formstabilität und ihrer einfachen Verarbeitung ist sie die ideale Lösung für ökologisches Bauen – dauerhaft, ressourcenschonend und effektiv.",
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
        // Original description: "OSB-Platten vereinen hohe Druck- und Biegefestigkeit mit exzellenter Maßhaltigkeit. Ideal für tragende und aussteifende Bauteile im Holzbau. Die kreuzweise Verleimung der Späne sorgt für formstabile, verzugsfreie Elemente mit hoher Belastbarkeit.  Durch den Einsatz schnell wachsender Hölzer und effizienter Produktion aus Nebenprodukten sind OSB- Platten besonders ressourcenschonend.Sie bieten eine langlebige, robuste Lösung für Wand, Boden und Dach – auch bei hoher Beanspruchung.  Als sortenreines Holzprodukt lassen sich OSB - Platten problemlos wiederverwenden oder recyceln und tragen so zur Kreislauffähigkeit moderner Bausysteme bei.",
        mobileTitle: "OSB - Konstruktion",
        mobileSubtitle: "",
        mobileDescription:
            "OSB‑Platten: druck- und biegefest, formstabil, ressourcenschonend. Langlebig, wiederverwendbar und gut recyclebar.",
        image: IMAGES.materials.konstruktionOSB,
        backgroundColor: "#121212",
    },
]; 