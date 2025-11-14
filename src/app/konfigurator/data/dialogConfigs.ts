import { IMAGES } from '@/constants/images';

export interface MaterialSliderDialogConfig {
  title: {
    main: string;
    subtitle: string;
  };
  sliderKey: string;
  actionButton: {
    text: string;
    href: string;
  };
  cards: Array<{
    id: number;
    title: string;
    subtitle: string;
    description: {
      mobile: string;
      desktop: string;
    };
    imagePath: string;
  }>;
}

export const dialogConfigs: Record<string, MaterialSliderDialogConfig> = {
  materials: {
    title: {
      main: "Die Außenhülle",
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
        title: "Schiefer",
        subtitle: "Die Außenhülle",
        description: {
          mobile: "Schiefer steht für natürliche Eleganz und hohe Strapazierfähigkeit. Robuste, trittfeste Oberfläche, beständig gegen Temperaturschwankungen. Charakteristische Farbpalette von Anthrazit bis Grau.",
          desktop: "Schiefer steht für natürliche Eleganz, hohe Strapazierfähigkeit und zeitlose Ästhetik. Als Bodenbelag im Innenraum überzeugt er durch seine robuste, trittfeste Oberfläche und seine Beständigkeit gegenüber Temperaturschwankungen und Feuchtigkeit. Die feine, geschichtete Struktur und die charakteristische Farbpalette von Anthrazit bis Tiefgrau verleihen jedem Raum eine edle, zugleich warme Ausstrahlung. Schiefer bringt Ursprünglichkeit und Stil in Einklang – und wird so zum langlebigen Gestaltungselement für moderne wie klassische Wohnkonzepte."
        },
        imagePath: IMAGES.materials.schiefer
      },
      {
        id: 2,
        title: "Lärche Natur",
        subtitle: "Die Außenhülle",
        description: {
          mobile: "Lärchen-Fassade vereint natürliche Ästhetik mit langlebiger Qualität. Die charakteristische Maserung verleiht zeitlose Eleganz. Hohe Witterungsbeständigkeit und natürliche Patina.",
          desktop: "Die Fassade in Holzlattung aus Lärche Natur vereint natürliche Ästhetik mit langlebiger Qualität. Die charakteristische Maserung und warme Farbgebung der Lärche verleihen Gebäuden eine zeitlose Eleganz und fügen sich harmonisch in die Umgebung ein. Dank der hohen Witterungsbeständigkeit des Holzes entwickelt die unbehandelte Lärche mit der Zeit eine silbergraue Patina, die den rustikalen Charme unterstreicht und zugleich vor Umwelteinflüssen schützt."
        },
        imagePath: IMAGES.materials.laercheFassade
      },
      {
        id: 3,
        title: "Kalkstein",
        subtitle: "Die Außenhülle",
        description: {
          mobile: "Massiver Kalkstein überzeugt durch natürliche Eleganz und hohe Widerstandsfähigkeit. Charakteristische Farbgebung von warmen Beigetönen bis sanften Graunuancen. Edle Ausstrahlung.",
          desktop: "Der massive Kalkstein überzeugt durch seine natürliche Eleganz, zeitlose Ästhetik und hohe Widerstandsfähigkeit. Mit seiner charakteristischen Farbgebung, die von warmen Beigetönen bis hin zu sanften Graunuancen reicht, verleiht er Innen- und Außenbereichen eine edle, harmonische Ausstrahlung. Seine fein strukturierte Oberfläche und die einzigartigen Adern und Fossileinschlüsse machen jedes Element zu einem Unikat."
        },
        imagePath: IMAGES.materials.kalkstein
      },
      {
        id: 4,
        title: "FUNDERMAX® HPL-Platten",
        subtitle: "Die Außenhülle",
        description: {
          mobile: "Fundermax HPL-Platten: moderne, langlebige Fassadenlösung. Hochverdichtete Laminatplatten bieten Witterungsbeständigkeit, UV-Stabilität und Schlagfestigkeit. Kratzfest und pflegeleicht.",
          desktop: "Die Fundermax HPL-Platten sind eine erstklassige Lösung für moderne und langlebige Fassadengestaltungen. Gefertigt aus hochverdichteten Laminatplatten, bieten sie eine außergewöhnliche Witterungsbeständigkeit, UV-Stabilität und Schlagfestigkeit. Ihre widerstandsfähige Oberfläche ist kratzfest, pflegeleicht und trotzt selbst extremen klimatischen Bedingungen."
        },
        imagePath: IMAGES.materials.fundermaxWeiss
      },
      {
        id: 5,
        title: "Eiche Parkett",
        subtitle: "Die Außenhülle",
        description: {
          mobile: "Eichen-Parkett steht für zeitlose Eleganz und natürliche Wärme. Die charakteristische Maserung verleiht jedem Raum eine edle Atmosphäre. Dank hoher Härte besonders langlebig.",
          desktop: "Der Parkettboden aus Eiche steht für zeitlose Eleganz, natürliche Wärme und außergewöhnliche Langlebigkeit. Die charakteristische Maserung und die warme Farbgebung der Eiche verleihen jedem Raum eine edle und zugleich gemütliche Atmosphäre. Dank der hohen Härte und Widerstandsfähigkeit des Holzes ist Eichenparkett besonders strapazierfähig und eignet sich sowohl für Wohnräume als auch für stark frequentierte Bereiche."
        },
        imagePath: IMAGES.materials.eicheParkett
      },
      {
        id: 6,
        title: "Trapezblech",
        subtitle: "Die Außenhülle",
        description: {
          mobile: "Trapezblech: langlebige Lösung für Dach und Fassade. Hohe Stabilität und Widerstandsfähigkeit für privaten und gewerblichen Bereich. Wetterfest mit geringem Eigengewicht.",
          desktop: "Trapezblech ist eine langlebige und vielseitig einsetzbare Lösung für Dach- und Fassadenkonstruktionen. Dank seiner hohen Stabilität und Widerstandsfähigkeit eignet es sich perfekt für den privaten als auch den gewerblichen Bereich. Das Material zeichnet sich durch seine wetterfesten Eigenschaften aus und bietet einen zuverlässigen Schutz vor Wind, Regen und Schnee. Die profilierte Form sorgt für eine hohe Tragfähigkeit bei geringem Eigengewicht, was die Montage besonders effizient und kostensparend macht."
        },
        imagePath: IMAGES.materials.trapezblech
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
        title: "Eiche",
        subtitle: "Die Innenverkleidung",
        description: {
          mobile: "Eichen-Innenverkleidung bringt die unvergleichliche Ausstrahlung echten Holzes in Ihre Räume. Warme Farbgebung und charaktervolle Maserung schaffen eine behagliche, hochwertige Atmosphäre.",
          desktop: "Die Innenverkleidung aus Eiche bringt die unvergleichliche Ausstrahlung echten Holzes in Ihre Räume. Mit ihrer warmen Farbgebung und der charaktervollen Maserung schafft Eiche eine behagliche Atmosphäre und verleiht jedem Interieur eine hochwertige, natürliche Note. Eiche ist nicht nur schön, sondern auch extrem widerstandsfähig. Die robuste Holzart eignet sich perfekt für den täglichen Gebrauch und bewahrt über viele Jahre hinweg ihre Form und Anmutung."
        },
        imagePath: IMAGES.interiorMaterials.eiche
      },
      {
        id: 2,
        title: "Fichte",
        subtitle: "Die Innenverkleidung",
        description: {
          mobile: "Fichte-Innenverkleidung überzeugt durch helle, freundliche Ausstrahlung. Sanfte Maserung und feuchtigkeitsregulierende Eigenschaften sorgen für angenehmes Raumklima.",
          desktop: "Die Innenverkleidung aus Fichte überzeugt durch ihre helle, freundliche Ausstrahlung und verleiht jedem Raum ein Gefühl von Weite und Geborgenheit. Die sanfte Maserung und der warme Farbton der Fichte bringen die natürliche Schönheit des Holzes zur Geltung und schaffen eine wohltuende, harmonische Atmosphäre. Fichte ist leicht, vielseitig einsetzbar und sorgt dank ihrer feuchtigkeitsregulierenden Eigenschaften für ein angenehmes Raumklima."
        },
        imagePath: IMAGES.interiorMaterials.fichte
      },
      {
        id: 3,
        title: "Lärche",
        subtitle: "Die Innenverkleidung",
        description: {
          mobile: "Lärchen-Innenverkleidung bringt natürliche Wärme in den Raum. Markante Maserung und goldgelbe Töne schaffen gemütliche Atmosphäre. Leicht, gut verarbeitbar und feuchtigkeitsregulierend.",
          desktop: "Die Innenverkleidung aus Lärchenholz bringt natürliche Wärme und lebendige Optik in den Innenraum. Die markante Maserung und die warmen, goldgelben Töne schaffen eine gemütliche, einladende Atmosphäre. Gleichzeitig ist das Holz leicht, gut zu verarbeiten und wirkt feuchtigkeitsregulierend – ideal für ein angenehmes, gesundes Raumklima. Mit seiner zeitlosen Ausstrahlung passt es sowohl in moderne als auch in traditionelle Wohnkonzepte."
        },
        imagePath: IMAGES.interiorMaterials.laerche
      }
    ]
  },

  fenster: {
    title: {
      main: "Fenster & Türen",
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
        title: "Kunststoff PVC",
        subtitle: "Fenster & Türen",
        description: {
          mobile: "PVC-Fenster bieten hervorragende Wärmedämmung und Langlebigkeit. Sie sind pflegeleicht, witterungsbeständig und in verschiedenen Farben und Designs erhältlich.",
          desktop: "PVC-Fenster bieten hervorragende Wärmedämmung und Langlebigkeit bei optimaler Kosteneffizienz. Das hochwertige Kunststoffmaterial ist pflegeleicht, witterungsbeständig und UV-stabil. Moderne PVC-Fenster sind in verschiedenen Farben und Designs erhältlich und überzeugen durch ihre ausgezeichneten Isoliereigenschaften, die zu niedrigeren Heizkosten beitragen."
        },
        imagePath: IMAGES.windows.pvc
      },
      {
        id: 2,
        title: "Holz Fichte",
        subtitle: "Fenster & Türen",
        description: {
          mobile: "Fichte-Holzfenster stehen für natürliche Schönheit und nachhaltiges Bauen. Das helle, warme Holz schafft eine gemütliche Atmosphäre und reguliert das Raumklima.",
          desktop: "Fichte-Holzfenster stehen für natürliche Schönheit, nachhaltiges Bauen und zeitlose Eleganz. Das helle, warme Holz mit seiner charakteristischen Maserung schafft eine gemütliche Atmosphäre und reguliert auf natürliche Weise das Raumklima. Holzfenster aus Fichte sind umweltfreundlich, renewable und verleihen jedem Zuhause eine authentische, warme Ausstrahlung."
        },
        imagePath: IMAGES.windows.fichte
      },
      {
        id: 3,
        title: "Aluminium",
        subtitle: "Fenster & Türen",
        description: {
          mobile: "Aluminium-Fenster überzeugen durch ihre moderne Optik und hohe Stabilität. Sie sind korrosionsbeständig, wartungsarm und ermöglichen große Glasflächen.",
          desktop: "Aluminium-Fenster überzeugen durch ihre moderne, puristische Optik und außergewöhnliche Stabilität. Das robuste Material ist korrosionsbeständig, wartungsarm und ermöglicht die Realisierung großer Glasflächen bei schlanken Profilen. Aluminium-Fenster sind langlebig, recyclebar und fügen sich perfekt in zeitgenössische Architekturkonzepte ein."
        },
        imagePath: IMAGES.windows.aluminium
      }
    ]
  },

  fussboden: {
    title: {
      main: "Der Fußboden",
      subtitle: "Unsere Materialien"
    },
    sliderKey: "fussboden-slider",
    actionButton: {
      text: "Mehr erfahren",
      href: "/fussboden"
    },
    cards: [
      {
        id: 1,
        title: "Der Fußboden",
        subtitle: "Feinsteinzeug - Schiefer",
        description: {
          mobile: "Schiefer steht für natürliche Eleganz und hohe Strapazierfähigkeit. Robuste, trittfeste Oberfläche, beständig gegen Temperaturschwankungen. Charakteristische Farbpalette von Anthrazit bis Grau.",
          desktop: "Schiefer steht für natürliche Eleganz, hohe Strapazierfähigkeit und zeitlose Ästhetik. Als Bodenbelag im Innenraum überzeugt er durch seine robuste, trittfeste Oberfläche und seine Beständigkeit gegenüber Temperaturschwankungen und Feuchtigkeit. Die feine, geschichtete Struktur und die charakteristische Farbpalette von Anthrazit bis Tiefgrau verleihen jedem Raum eine edle, zugleich warme Ausstrahlung. Schiefer bringt Ursprünglichkeit und Stil in Einklang – und wird so zum langlebigen Gestaltungselement für moderne wie klassische Wohnkonzepte."
        },
        imagePath: IMAGES.flooring.schiefer
      },
      {
        id: 2,
        title: "Der Fußboden",
        subtitle: "Naturstein - Kanafar",
        description: {
          mobile: "Massiver Kalkstein überzeugt durch natürliche Eleganz und hohe Widerstandsfähigkeit. Charakteristische Farbgebung von warmen Beigetönen bis sanften Graunuancen. Edle Ausstrahlung.",
          desktop: "Der massive Kalkstein überzeugt durch seine natürliche Eleganz, zeitlose Ästhetik und hohe Widerstandsfähigkeit. Mit seiner charakteristischen Farbgebung, die von warmen Beigetönen bis hin zu sanften Graunuancen reicht, verleiht er Innen- und Außenbereichen eine edle, harmonische Ausstrahlung. Seine fein strukturierte Oberfläche und die einzigartigen Adern und Fossileinschlüsse machen jedes Element zu einem Unikat."
        },
        imagePath: IMAGES.flooring.kalkstein
      },
      {
        id: 3,
        title: "Der Fußboden",
        subtitle: "Eichenholz - Parkett",
        description: {
          mobile: "Eichen-Parkett steht für zeitlose Eleganz und natürliche Wärme. Die charakteristische Maserung verleiht jedem Raum eine edle Atmosphäre. Dank hoher Härte besonders langlebig.",
          desktop: "Der Parkettboden aus Eiche steht für zeitlose Eleganz, natürliche Wärme und außergewöhnliche Langlebigkeit. Die charakteristische Maserung und die warme Farbgebung der Eiche verleihen jedem Raum eine edle und zugleich gemütliche Atmosphäre. Dank der hohen Härte und Widerstandsfähigkeit des Holzes ist Eichenparkett besonders strapazierfähig und eignet sich sowohl für Wohnräume als auch für stark frequentierte Bereiche."
        },
        imagePath: IMAGES.flooring.eicheParkett
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
        title: "Varianten Holzfassade",
        subtitle: "Photovoltaik",
        description: {
          mobile: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten.",
          desktop: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr. Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie."
        },
        imagePath: IMAGES.configurations.pv_holzfassade
      },
      {
        id: 2,
        title: "Varianten Trapezblech",
        subtitle: "Photovoltaik",
        description: {
          mobile: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten.",
          desktop: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr. Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie."
        },
        imagePath: IMAGES.configurations.pv_trapezblech
      },
      {
        id: 3,
        title: "Varianten Fassadenplatten Schwarz",
        subtitle: "Photovoltaik",
        description: {
          mobile: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten.",
          desktop: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr. Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie."
        },
        imagePath: IMAGES.configurations.pv_plattenschwarz
      },
      {
        id: 4,
        title: "Varianten Fassadenplatten Weiß",
        subtitle: "Photovoltaik",
        description: {
          mobile: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten.",
          desktop: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr. Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie."
        },
        imagePath: IMAGES.configurations.pv_plattenweiss
      }
    ]
  },

  belichtungspaket: {
    title: {
      main: "Belichtungspaket",
      subtitle: "Natürliches Licht für Ihr Zuhause"
    },
    sliderKey: "belichtungspaket-slider",
    actionButton: {
      text: "Mehr über Fenster & Türen",
      href: "/fenster-tueren"
    },
    cards: [
      {
        id: 1,
        title: "Belichtungspaket - Light",
        subtitle: "Grundbeleuchtung",
        description: {
          mobile: "Das Light-Paket bietet eine solide Grundbeleuchtung mit 15% der Nestfläche. Ideal für gemütliche Wohnbereiche mit gezielter Lichtführung.",
          desktop: "Das Light-Paket bietet eine durchdachte Grundbeleuchtung mit 15% der Nestfläche als Fenster- und Türenöffnungen. Diese Konfiguration schafft eine angenehme, gemütliche Atmosphäre und eignet sich besonders für Wohnbereiche, in denen gezieltes, warmes Licht gewünscht ist. Die bewusst reduzierte Verglasung sorgt für optimale Energieeffizienz bei gleichzeitig ausreichend natürlichem Lichteinfall."
        },
        imagePath: IMAGES.hero.nestHaus7
      },
      {
        id: 2,
        title: "Belichtungspaket - Medium",
        subtitle: "Ausgewogene Beleuchtung",
        description: {
          mobile: "Das Medium-Paket bietet ausgewogene Helligkeit mit 22% der Nestfläche. Perfekt für Wohn- und Arbeitsbereiche mit natürlichem Lichtbedarf.",
          desktop: "Das Medium-Paket bietet eine ausgewogene Beleuchtung mit 22% der Nestfläche als Fenster- und Türenöffnungen. Diese Konfiguration schafft eine harmonische Balance zwischen natürlichem Lichteinfall und Energieeffizienz. Ideal für Wohn- und Arbeitsbereiche, die sowohl Gemütlichkeit als auch ausreichend Tageslicht benötigen. Die durchdachte Verteilung der Öffnungen sorgt für optimale Raumausleuchtung."
        },
        imagePath: IMAGES.hero.nestHaus1
      },
      {
        id: 3,
        title: "Belichtungspaket - Bright",
        subtitle: "Maximale Helligkeit",
        description: {
          mobile: "Das Bright-Paket bietet maximale Helligkeit mit 28% der Nestfläche. Ideal für lichtdurchflutete, offene Wohnkonzepte mit großzügiger Verglasung.",
          desktop: "Das Bright-Paket bietet maximale Helligkeit mit 28% der Nestfläche als Fenster- und Türenöffnungen. Diese Konfiguration schafft lichtdurchflutete, offene Räume mit großzügiger Verglasung und optimaler Tageslichtnutzung. Perfekt für moderne Wohnkonzepte, die Transparenz, Weite und eine starke Verbindung zur Natur schaffen möchten. Die großflächigen Öffnungen ermöglichen spektakuläre Ausblicke und ein Gefühl von Grenzenlosigkeit."
        },
        imagePath: IMAGES.hero.nestHaus3
      }
    ]
  },

  stirnseite: {
    title: {
      main: "Stirnseite Verglasung",
      subtitle: "Licht und Ausblick"
    },
    sliderKey: "stirnseite-slider",
    actionButton: {
      text: "Mehr über Verglasung",
      href: "/fenster-tueren"
    },
    cards: [
      {
        id: 1,
        title: "Stirnseite - Keine Verglasung",
        subtitle: "Geschlossen",
        description: {
          mobile: "Die geschlossene Stirnseite bietet maximale Privatsphäre und Energieeffizienz. Ideal für ruhige Bereiche ohne zusätzliche Fensteröffnungen.",
          desktop: "Die geschlossene Stirnseite bietet maximale Privatsphäre, Energieeffizienz und strukturelle Integrität. Diese Option eignet sich besonders für Bereiche, in denen Ruhe und Intimität gewünscht sind, oder wenn die Hauptverglasung bereits über andere Gebäudeseiten realisiert wird. Die geschlossene Konstruktion minimiert Wärmeverluste und bietet optimalen Schutz vor Witterungseinflüssen."
        },
        imagePath: IMAGES.configurations.nest75_holzlattung
      },
      {
        id: 2,
        title: "Stirnseite - Verglasung Oben",
        subtitle: "8m² Verglasung",
        description: {
          mobile: "Die obere Verglasung schafft interessante Lichteffekte und ermöglicht Ausblicke nach oben. 8m² strategisch positionierte Fensterfläche für natürliches Licht.",
          desktop: "Die obere Verglasung der Stirnseite schafft faszinierende Lichteffekte und ermöglicht einzigartige Ausblicke in den Himmel und die Baumkronen. Mit 8m² strategisch positionierter Fensterfläche bringt diese Option natürliches Licht in die oberen Bereiche des Raumes und schafft eine offene, luftige Atmosphäre. Besonders wirkungsvoll in Räumen mit hohen Decken oder Galeriebereichen."
        },
        imagePath: IMAGES.configurations.stirnseiteHolzfassade
      },
      {
        id: 3,
        title: "Stirnseite - Verglasung Unten",
        subtitle: "17m² Verglasung",
        description: {
          mobile: "Die untere Verglasung bietet direkten Ausblick und Zugang. 17m² Fensterfläche im Erdgeschossbereich für optimale Raumverbindung.",
          desktop: "Die untere Verglasung der Stirnseite bietet direkten Ausblick auf Augenhöhe und ermöglicht eine starke Verbindung zwischen Innen- und Außenraum. Mit 17m² großzügiger Fensterfläche im Erdgeschossbereich schaffen Sie optimale Sichtbeziehungen und natürlichen Lichteinfall. Diese Option eignet sich besonders für Wohnbereiche, die eine direkte Verbindung zur Terrasse oder zum Garten schaffen sollen."
        },
        imagePath: IMAGES.configurations.stirnseitePlattenSchwarz
      },
      {
        id: 4,
        title: "Stirnseite - Vollverglasung",
        subtitle: "25m² Verglasung",
        description: {
          mobile: "Die komplette Stirnseite verglast bietet maximales Licht und spektakuläre Ausblicke. 25m² durchgehende Verglasung für ein Gefühl von Grenzenlosigkeit.",
          desktop: "Die komplette Verglasung der Stirnseite bietet ein spektakuläres, raumgreifendes Erlebnis mit maximaler Transparenz und Lichtdurchflutung. Mit 25m² durchgehender Verglasung entsteht ein Gefühl von Grenzenlosigkeit und eine dramatische Verbindung zur Landschaft. Diese Option schafft einen wahren Blickfang und eignet sich besonders für Häuser mit außergewöhnlichen Ausblicken oder als architektonisches Statement."
        },
        imagePath: IMAGES.configurations.stirnseiteTrapezblech
      }
    ]
  }
}; 