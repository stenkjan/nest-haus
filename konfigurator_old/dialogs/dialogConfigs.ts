import { MaterialSliderDialogConfig } from './MaterialSliderDialog';
import { IMAGES } from '../../../src/constants/images';

export const dialogConfigs: Record<string, MaterialSliderDialogConfig> = {
  materials: {
    title: {
      main: "Die Materialien",
      subtitle: "Unsere Materialien"
    },
    sliderKey: "material-slider",
    actionButton: {
      text: "Mehr erfahren",
      href: "/materialien"
    },
    cards: [
      {
        id: 1,
        title: "Fichte",
        subtitle: "Konstruktives Holz",
        description: {
          mobile: "Fichte überzeugt durch ihre helle, freundliche Ausstrahlung und verleiht jedem Raum Weite und Geborgenheit. Die sanfte Maserung schafft eine wohltuende, harmonische Atmosphäre.",
          desktop: "Die Innenverkleidung aus Fichte überzeugt durch ihre helle, freundliche Ausstrahlung und verleiht jedem Raum ein Gefühl von Weite und Geborgenheit. Die sanfte Maserung und der warme Farbton der Fichte bringen die natürliche Schönheit des Holzes zur Geltung und schaffen eine wohltuende, harmonische Atmosphäre."
        },
        imagePath: IMAGES.materials.fichte
      },
      {
        id: 2,
        title: "Oriented Strand Board",
        subtitle: "Nachhaltige Konstruktion",
        description: {
          mobile: "OSB-Platten vereinen hohe Druck- und Biegefestigkeit mit exzellenter Maßhaltigkeit. Ideal für tragende Bauteile im Holzbau. Nachhaltig durch schnell wachsende Hölzer.",
          desktop: "OSB-Platten vereinen hohe Druck- und Biegefestigkeit mit exzellenter Maßhaltigkeit. Ideal für tragende und aussteifende Bauteile im Holzbau. Die kreuzweise Verleimung der Späne sorgt für formstabile, verzugsfreie Elemente mit hoher Belastbarkeit. Durch den Einsatz schnell wachsender Hölzer und effizienter Produktion aus Nebenprodukten sind OSB-Platten besonders ressourcenschonend. Sie bieten eine langlebige, robuste Lösung für Wand, Boden und Dach – auch bei hoher Beanspruchung. Als sortenreines Holzprodukt lassen sich OSB-Platten problemlos wiederverwenden oder recyceln und tragen so zur Kreislauffähigkeit moderner Bausysteme bei."
        },
        imagePath: IMAGES.materials.osb
      },
      {
        id: 3,
        title: "Eichenholz - Parkett",
        subtitle: "Eleganter Bodenbelag",
        description: {
          mobile: "Eichen-Parkett steht für zeitlose Eleganz und natürliche Wärme. Die charakteristische Maserung verleiht jedem Raum eine edle Atmosphäre. Dank hoher Härte besonders langlebig.",
          desktop: "Der Parkettboden aus Eiche steht für zeitlose Eleganz, natürliche Wärme und außergewöhnliche Langlebigkeit. Die charakteristische Maserung und die warme Farbgebung der Eiche verleihen jedem Raum eine edle und zugleich gemütliche Atmosphäre. Dank der hohen Härte und Widerstandsfähigkeit des Holzes ist Eichenparkett besonders strapazierfähig und eignet sich sowohl für Wohnräume als auch für stark frequentierte Bereiche."
        },
        imagePath: IMAGES.materials.parkettEiche
      },
      {
        id: 4,
        title: "Eiche",
        subtitle: "Edle Innenausstattung",
        description: {
          mobile: "Eichen-Innenverkleidung bringt die Ausstrahlung echten Holzes in Ihre Räume. Warme Farbgebung und charaktervolle Maserung schaffen eine behagliche, hochwertige Atmosphäre.",
          desktop: "Die Innenverkleidung aus Eiche bringt die unvergleichliche Ausstrahlung echten Holzes in Ihre Räume. Mit ihrer warmen Farbgebung und der charaktervollen Maserung schafft Eiche eine behagliche Atmosphäre und verleiht jedem Interieur eine hochwertige, natürliche Note. Eiche ist nicht nur schön, sondern auch extrem widerstandsfähig. Die robuste Holzart eignet sich perfekt für den täglichen Gebrauch und bewahrt über viele Jahre hinweg ihre Form und Anmutung."
        },
        imagePath: IMAGES.materials.interiorEiche
      },
      {
        id: 5,
        title: "Lärche - Fassade",
        subtitle: "Natürliche Fassade",
        description: {
          mobile: "Lärchen-Fassade vereint natürliche Ästhetik mit langlebiger Qualität. Die charakteristische Maserung verleiht zeitlose Eleganz. Hohe Witterungsbeständigkeit und natürliche Patina.",
          desktop: "Die Fassade in Holzlattung aus Lärche Natur vereint natürliche Ästhetik mit langlebiger Qualität. Die charakteristische Maserung und warme Farbgebung der Lärche verleihen Gebäuden eine zeitlose Eleganz und fügen sich harmonisch in die Umgebung ein. Dank der hohen Witterungsbeständigkeit des Holzes entwickelt die unbehandelte Lärche mit der Zeit eine silbergraue Patina, die den rustikalen Charme unterstreicht und zugleich vor Umwelteinflüssen schützt."
        },
        imagePath: IMAGES.materials.laercheLattung
      },
      {
        id: 6,
        title: "HPL - Holzverbundplatten Schwarz",
        subtitle: "Moderne Ästhetik",
        description: {
          mobile: "Fundermax HPL-Platten: moderne, langlebige Fassadenlösung. Hochverdichtete Laminatplatten bieten Witterungsbeständigkeit, UV-Stabilität und Schlagfestigkeit. Kratzfest und pflegeleicht.",
          desktop: "Die Fundermax HPL-Platten sind eine erstklassige Lösung für moderne und langlebige Fassadengestaltungen. Gefertigt aus hochverdichteten Laminatplatten, bieten sie eine außergewöhnliche Witterungsbeständigkeit, UV-Stabilität und Schlagfestigkeit. Ihre widerstandsfähige Oberfläche ist kratzfest, pflegeleicht und trotzt selbst extremen klimatischen Bedingungen."
        },
        imagePath: IMAGES.materials.plattenSchwarz
      },
      {
        id: 7,
        title: "HPL - Holzverbundplatten Hellgrau",
        subtitle: "Zeitlose Eleganz",
        description: {
          mobile: "Fundermax HPL-Platten: moderne, langlebige Fassadenlösung. Hochverdichtete Laminatplatten bieten Witterungsbeständigkeit, UV-Stabilität und Schlagfestigkeit. Kratzfest und pflegeleicht.",
          desktop: "Die Fundermax HPL-Platten sind eine erstklassige Lösung für moderne und langlebige Fassadengestaltungen. Gefertigt aus hochverdichteten Laminatplatten, bieten sie eine außergewöhnliche Witterungsbeständigkeit, UV-Stabilität und Schlagfestigkeit. Ihre widerstandsfähige Oberfläche ist kratzfest, pflegeleicht und trotzt selbst extremen klimatischen Bedingungen."
        },
        imagePath: IMAGES.materials.plattenWeiss
      },
      {
        id: 8,
        title: "Trapezblech - Schwarz",
        subtitle: "Industrieller Charme",
        description: {
          mobile: "Trapezblech: langlebige Lösung für Dach und Fassade. Hohe Stabilität und Widerstandsfähigkeit für privaten und gewerblichen Bereich. Wetterfest mit geringem Eigengewicht.",
          desktop: "Trapezblech ist eine langlebige und vielseitig einsetzbare Lösung für Dach- und Fassadenkonstruktionen. Dank seiner hohen Stabilität und Widerstandsfähigkeit eignet es sich perfekt für den privaten als auch den gewerblichen Bereich. Das Material zeichnet sich durch seine wetterfesten Eigenschaften aus und bietet einen zuverlässigen Schutz vor Wind, Regen und Schnee. Die profilierte Form sorgt für eine hohe Tragfähigkeit bei geringem Eigengewicht, was die Montage besonders effizient und kostensparend macht."
        },
        imagePath: IMAGES.materials.trapezblech
      },
      {
        id: 9,
        title: "Naturstein - Kanafar",
        subtitle: "Natürlicher Bodenbelag",
        description: {
          mobile: "Massiver Kalkstein überzeugt durch natürliche Eleganz und hohe Widerstandsfähigkeit. Charakteristische Farbgebung von warmen Beigetönen bis sanften Graunuancen. Edle Ausstrahlung.",
          desktop: "Der massive Kalkstein überzeugt durch seine natürliche Eleganz, zeitlose Ästhetik und hohe Widerstandsfähigkeit. Mit seiner charakteristischen Farbgebung, die von warmen Beigetönen bis hin zu sanften Graunuancen reicht, verleiht er Innen- und Außenbereichen eine edle, harmonische Ausstrahlung. Seine fein strukturierte Oberfläche und die einzigartigen Adern und Fossileinschlüsse machen jedes Element zu einem Unikat."
        },
        imagePath: IMAGES.materials.kalkstein
      },
      {
        id: 10,
        title: "Feinsteinzeug - Schiefer",
        subtitle: "Robuste Eleganz",
        description: {
          mobile: "Schiefer steht für natürliche Eleganz und hohe Strapazierfähigkeit. Robuste, trittfeste Oberfläche, beständig gegen Temperaturschwankungen. Charakteristische Farbpalette von Anthrazit bis Grau.",
          desktop: "Schiefer steht für natürliche Eleganz, hohe Strapazierfähigkeit und zeitlose Ästhetik. Als Bodenbelag im Innenraum überzeugt er durch seine robuste, trittfeste Oberfläche und seine Beständigkeit gegenüber Temperaturschwankungen und Feuchtigkeit. Die feine, geschichtete Struktur und die charakteristische Farbpalette von Anthrazit bis Tiefgrau verleihen jedem Raum eine edle, zugleich warme Ausstrahlung. Schiefer bringt Ursprünglichkeit und Stil in Einklang – und wird so zum langlebigen Gestaltungselement für moderne wie klassische Wohnkonzepte."
        },
        imagePath: IMAGES.materials.schiefer
      },
      {
        id: 11,
        title: "Kiefer",
        subtitle: "Warme Atmosphäre",
        description: {
          mobile: "Kiefern-Innenverkleidung bringt natürliche Wärme in den Raum. Markante Maserung und goldgelbe Töne schaffen gemütliche Atmosphäre. Leicht, gut verarbeitbar und feuchtigkeitsregulierend.",
          desktop: "Die Innenverkleidung aus Kiefernholz bringt natürliche Wärme und lebendige Optik in den Innenraum. Die markante Maserung und die warmen, goldgelben Töne schaffen eine gemütliche, einladende Atmosphäre. Gleichzeitig ist das Holz leicht, gut zu verarbeiten und wirkt feuchtigkeitsregulierend – ideal für ein angenehmes, gesundes Raumklima. Mit seiner zeitlosen Ausstrahlung passt es sowohl in moderne als auch in traditionelle Wohnkonzepte."
        },
        imagePath: IMAGES.materials.kieferNatur
      }
    ]
  },

  innenverkleidung: {
    title: {
      main: "Die Innenverkleidung",
      subtitle: "Unsere Materialien"
    },
    sliderKey: "innenverkleidung-slider",
    actionButton: {
      text: "Mehr erfahren",
      href: "/innenverkleidung"
    },
    cards: [
      {
        id: 1,
        title: "Die Innenverkleidung",
        subtitle: "Unsere Materialien",
        description: {
          mobile: "Du hast die Freiheit, die Innenverkleidung nach deinen Vorstellungen zu gestalten. Wähle aus verschiedenen Holzarten und Oberflächen für deine Wände und Decken. Falls du Unterstützung benötigst, kannst du auf unsere Planungspakete zählen, die dir bei der Auswahl der passenden Materialien helfen.",
          desktop: "Du hast die Freiheit, die Innenverkleidung nach deinen Vorstellungen zu gestalten. Wähle aus verschiedenen Holzarten und Oberflächen für deine Wände und Decken. Falls du Unterstützung benötigst, kannst du auf unsere Planungspakete zählen, die dir bei der Auswahl der passenden Materialien helfen."
        },
        imagePath: IMAGES.aboutus.materialEiche
      },
      {
        id: 2,
        title: "Steirische Eiche",
        subtitle: "Natürlich & Nachhaltig",
        description: {
          mobile: "Die steirische Eiche steht für Beständigkeit und zeitlose Eleganz. Mit ihrer warmen, natürlichen Ausstrahlung schafft sie eine einladende Atmosphäre und bringt die Natur in dein Zuhause. Ein Material, das durch seine natürliche Schönheit und Langlebigkeit überzeugt und jedem Raum Charakter verleiht.",
          desktop: "Die steirische Eiche steht für Beständigkeit und zeitlose Eleganz. Mit ihrer warmen, natürlichen Ausstrahlung schafft sie eine einladende Atmosphäre und bringt die Natur in dein Zuhause."
        },
        imagePath: IMAGES.materials.interiorEiche
      },
      {
        id: 3,
        title: "Kalkstein",
        subtitle: "Modern & Zeitlos",
        description: {
          mobile: "Kalkstein verbindet moderne Ästhetik mit natürlicher Eleganz. Seine helle, gleichmäßige Struktur schafft eine zeitlose Basis für deine individuelle Raumgestaltung. Ein vielseitiges Material, das sowohl in modernen als auch klassischen Wohnkonzepten eine edle Ausstrahlung verleiht und durch seine Beständigkeit überzeugt.",
          desktop: "Kalkstein verbindet moderne Ästhetik mit natürlicher Eleganz. Seine helle, gleichmäßige Struktur schafft eine zeitlose Basis für deine individuelle Raumgestaltung."
        },
        imagePath: IMAGES.materials.kalkstein
      }
    ]
  },

  fenster: {
    title: {
      main: "Die Fenster",
      subtitle: "Unsere Materialien"
    },
    sliderKey: "fenster-slider",
    actionButton: {
      text: "Mehr erfahren",
      href: "/fenster"
    },
    cards: [
      {
        id: 1,
        title: "Holzfenster",
        subtitle: "Natürliche Eleganz",
        description: {
          mobile: "Holzfenster vereinen natürliche Schönheit mit hervorragender Wärmedämmung und schaffen eine warme, einladende Atmosphäre. Die charakteristische Maserung und die warmen Farbtöne des Holzes verleihen jedem Raum eine behagliche Ausstrahlung. Dank moderner Oberflächenbehandlungen sind unsere Holzfenster langlebig.",
          desktop: "Holzfenster vereinen natürliche Schönheit mit hervorragender Wärmedämmung und schaffen eine warme, einladende Atmosphäre. Die charakteristische Maserung und die warmen Farbtöne des Holzes verleihen jedem Raum eine behagliche Ausstrahlung. Dank moderner Oberflächenbehandlungen sind unsere Holzfenster langlebig, pflegeleicht und bieten optimalen Schutz vor Witterungseinflüssen. Sie sind nicht nur ästhetisch ansprechend, sondern auch nachhaltig und umweltfreundlich."
        },
        imagePath: IMAGES.materials.interiorEiche
      },
      {
        id: 2,
        title: "Kunststofffenster",
        subtitle: "Pflegeleicht & Effizient",
        description: {
          mobile: "Kunststofffenster überzeugen durch ihre hervorragende Wärmedämmung, Pflegeleichtigkeit und ihr ausgezeichnetes Preis-Leistungs-Verhältnis. Sie sind wartungsarm, wetterbeständig und bieten eine lange Lebensdauer ohne regelmäßige Wartung. Die modernen Mehrkammersysteme sorgen für optimale Energieeffizienz.",
          desktop: "Kunststofffenster überzeugen durch ihre hervorragende Wärmedämmung, Pflegeleichtigkeit und ihr ausgezeichnetes Preis-Leistungs-Verhältnis. Sie sind wartungsarm, wetterbeständig und bieten eine lange Lebensdauer ohne regelmäßige Wartung. Die modernen Mehrkammersysteme sorgen für optimale Energieeffizienz und tragen zur Reduzierung der Heizkosten bei. Kunststofffenster sind in verschiedenen Farben und Oberflächenstrukturen erhältlich und lassen sich perfekt an die Architektur Ihres Hauses anpassen."
        },
        imagePath: IMAGES.materials.fichte
      },
      {
        id: 3,
        title: "Aluminiumfenster",
        subtitle: "Modern & Robust",
        description: {
          mobile: "Aluminiumfenster sind äußerst robust, pflegeleicht und bieten maximale Stabilität bei minimaler Wartung. Sie ermöglichen schlanke Profile für große Glasflächen und schaffen so lichtdurchflutete Räume mit modernem Design. Die hohe Korrosionsbeständigkeit und Langlebigkeit machen sie zur idealen Wahl.",
          desktop: "Aluminiumfenster sind äußerst robust, pflegeleicht und bieten maximale Stabilität bei minimaler Wartung. Sie ermöglichen schlanke Profile für große Glasflächen und schaffen so lichtdurchflutete Räume mit modernem Design. Die hohe Korrosionsbeständigkeit und Langlebigkeit machen sie zur idealen Wahl für anspruchsvolle Architektur. Aluminiumfenster sind in einer Vielzahl von Farben und Oberflächenfinishs erhältlich und bieten grenzenlose Gestaltungsmöglichkeiten für zeitgemäße Wohnkonzepte."
        },
        imagePath: IMAGES.materials.osb
      },
      {
        id: 4,
        title: "Holz-Aluminium-Fenster",
        subtitle: "Das Beste aus beiden Welten",
        description: {
          mobile: "Holz-Aluminium-Fenster kombinieren die natürliche Wärme und Behaglichkeit von Holz im Innenbereich mit der Robustheit und Pflegeleichtigkeit von Aluminium außen. Diese innovative Kombination bietet optimalen Schutz vor Witterungseinflüssen bei gleichzeitig hoher Energieeffizienz. Die Aluminiumschale schützt das Holz.",
          desktop: "Holz-Aluminium-Fenster kombinieren die natürliche Wärme und Behaglichkeit von Holz im Innenbereich mit der Robustheit und Pflegeleichtigkeit von Aluminium außen. Diese innovative Kombination bietet optimalen Schutz vor Witterungseinflüssen bei gleichzeitig hoher Energieeffizienz. Die Aluminiumschale schützt das Holz vor UV-Strahlung und Feuchtigkeit, während die Holzoberfläche innen für ein angenehmes Raumklima sorgt. So erhalten Sie ein langlebiges, wartungsarmes Fenster mit natürlicher Ausstrahlung."
        },
        imagePath: IMAGES.materials.parkettEiche
      },
      {
        id: 5,
        title: "Dreifachverglasung",
        subtitle: "Maximale Energieeffizienz",
        description: {
          mobile: "Unsere hochwertigen Dreifachverglasungen bieten hervorragende Wärmedämmwerte und tragen erheblich zur Energieeinsparung bei. Die speziellen Beschichtungen und Edelgasfüllungen zwischen den Scheiben minimieren Wärmeverluste und sorgen für ein angenehmes Raumklima das ganze Jahr über. Zusätzlich bieten sie verbesserten Schallschutz.",
          desktop: "Unsere hochwertigen Dreifachverglasungen bieten hervorragende Wärmedämmwerte und tragen erheblich zur Energieeinsparung bei. Die speziellen Beschichtungen und Edelgasfüllungen zwischen den Scheiben minimieren Wärmeverluste und sorgen für ein angenehmes Raumklima das ganze Jahr über. Zusätzlich bieten sie verbesserten Schallschutz und erhöhen den Wohnkomfort spürbar. Die moderne Verglasung verhindert Kondensation und sorgt für klare Sicht bei jedem Wetter."
        },
        imagePath: IMAGES.materials.laercheLattung
      },
      {
        id: 6,
        title: "Sicherheitsverglasung",
        subtitle: "Schutz & Sicherheit",
        description: {
          mobile: "Sicherheitsverglasungen bieten erhöhten Einbruchschutz und Sicherheit für Ihr Zuhause. Die speziell gehärteten oder laminierten Gläser sind widerstandsfähiger gegen Beschädigungen und erschweren unerwünschte Zugriffe erheblich. Bei Beschädigung zerfallen sie in kleine, stumpfe Bruchstücke oder bleiben durch die Sicherheitsfolie zusammengehalten.",
          desktop: "Sicherheitsverglasungen bieten erhöhten Einbruchschutz und Sicherheit für Ihr Zuhause. Die speziell gehärteten oder laminierten Gläser sind widerstandsfähiger gegen Beschädigungen und erschweren unerwünschte Zugriffe erheblich. Bei Beschädigung zerfallen sie in kleine, stumpfe Bruchstücke oder bleiben durch die Sicherheitsfolie zusammengehalten, was das Verletzungsrisiko minimiert. Verschiedene Sicherheitsklassen ermöglichen eine individuelle Anpassung an Ihre Sicherheitsbedürfnisse."
        },
        imagePath: IMAGES.materials.plattenSchwarz
      },
      {
        id: 7,
        title: "Schallschutzfenster",
        subtitle: "Ruhe & Komfort",
        description: {
          mobile: "Schallschutzfenster schaffen eine ruhige Wohnatmosphäre auch in lärmbelasteten Umgebungen. Durch spezielle Glasaufbauten und optimierte Dichtungssysteme reduzieren sie Außengeräusche erheblich und sorgen für erholsamen Schlaf und konzentriertes Arbeiten. Die verschiedenen Schallschutzklassen ermöglichen eine gezielte Anpassung.",
          desktop: "Schallschutzfenster schaffen eine ruhige Wohnatmosphäre auch in lärmbelasteten Umgebungen. Durch spezielle Glasaufbauten und optimierte Dichtungssysteme reduzieren sie Außengeräusche erheblich und sorgen für erholsamen Schlaf und konzentriertes Arbeiten. Die verschiedenen Schallschutzklassen ermöglichen eine gezielte Anpassung an die örtlichen Gegebenheiten. So können Sie die Ruhe und den Komfort Ihres Zuhauses auch bei starkem Verkehrslärm oder anderen Störquellen genießen."
        },
        imagePath: IMAGES.materials.plattenWeiss
      },
      {
        id: 8,
        title: "Smart Home Integration",
        subtitle: "Intelligente Steuerung",
        description: {
          mobile: "Moderne Fenster lassen sich nahtlos in Smart Home Systeme integrieren und bieten automatisierte Lüftung, Sonnenschutz und Sicherheitsfunktionen. Sensoren überwachen Raumklima und Luftqualität und steuern die Fenster entsprechend. Die intelligente Vernetzung ermöglicht Fernsteuerung und programmierbare Szenarien für optimalen Komfort.",
          desktop: "Moderne Fenster lassen sich nahtlos in Smart Home Systeme integrieren und bieten automatisierte Lüftung, Sonnenschutz und Sicherheitsfunktionen. Sensoren überwachen Raumklima und Luftqualität und steuern die Fenster entsprechend. Die intelligente Vernetzung ermöglicht Fernsteuerung und programmierbare Szenarien für optimalen Komfort und Energieeffizienz. So wird Ihr Zuhause nicht nur komfortabler, sondern auch energiesparender und sicherer."
        },
        imagePath: IMAGES.materials.trapezblech
      }
    ]
  },

  photovoltaik: {
    title: {
      main: "Photovoltaik",
      subtitle: "Nachhaltige Energie"
    },
    sliderKey: "photovoltaik-slider",
    actionButton: {
      text: "Mehr erfahren",
      href: "/photovoltaik"
    },
    cards: [
      {
        id: 1,
        title: "Photovoltaik Varianten",
        subtitle: "Gemeinsam in die Zukunft",
        description: {
          mobile: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicherer. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr. Eine Investition in die Zukunft, die sich langfristig auszahlt und die Umwelt schont.",
          desktop: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicherer. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr."
        },
        imagePath: IMAGES.photovoltaik.paneleFassade
      },
      {
        id: 2,
        title: "Nachhaltige Integration",
        subtitle: "Harmonisches Design",
        description: {
          mobile: "Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie. Eine nachhaltige Lösung für moderne Wohnkonzepte.",
          desktop: "Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie."
        },
        imagePath: IMAGES.photovoltaik.paneleFassade
      },
      {
        id: 3,
        title: "Intelligente Integration",
        subtitle: "Nahtloses Design",
        description: {
          mobile: "Die PV-Module werden perfekt in die Fassade integriert und schaffen ein harmonisches Gesamtbild. So bleibt die Ästhetik deines Hauses erhalten, während du von der Sonnenenergie profitierst. Eine elegante Lösung, die Funktionalität und Design perfekt vereint und dabei höchste Effizienz bietet.",
          desktop: "Die PV-Module werden perfekt in die Fassade integriert und schaffen ein harmonisches Gesamtbild. So bleibt die Ästhetik deines Hauses erhalten, während du von der Sonnenenergie profitierst."
        },
        imagePath: IMAGES.configurations.photovoltaik_holz
      },
      {
        id: 4,
        title: "Photovoltaik (Kopie)",
        subtitle: "Nachhaltige Energie",
        description: {
          mobile: "Mit unserer Photovoltaik-Lösung machst du dein NEST Haus energieautark. Die hochwertigen PV-Module werden nahtlos in die Fassade integriert und erzeugen sauberen Strom für deinen täglichen Bedarf. Eine zukunftsweisende Technologie, die Nachhaltigkeit und Effizienz perfekt kombiniert und dabei langfristig Kosten spart.",
          desktop: "Mit unserer Photovoltaik-Lösung machst du dein NEST Haus energieautark. Die hochwertigen PV-Module werden nahtlos in die Fassade integriert und erzeugen sauberen Strom für deinen täglichen Bedarf."
        },
        imagePath: IMAGES.configurations.photovoltaik_holz
      },
      {
        id: 5,
        title: "Effiziente Module (Kopie)",
        subtitle: "Maximale Leistung",
        description: {
          mobile: "Unsere PV-Module sind speziell für die Integration in die NEST Haus Fassade entwickelt. Sie bieten eine optimale Balance zwischen Ästhetik und Energieeffizienz. Hochwertige Technologie, die maximale Leistung bei minimaler Wartung garantiert und dabei die architektonische Schönheit Ihres Hauses unterstreicht.",
          desktop: "Unsere PV-Module sind speziell für die Integration in die NEST Haus Fassade entwickelt. Sie bieten eine optimale Balance zwischen Ästhetik und Energieeffizienz."
        },
        imagePath: IMAGES.configurations.photovoltaik_holz
      }
    ]
  }
}; 