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
        title: "Die Außenhülle - Unsere Materialien",
        subtitle: "Schiefer",
        description: {
          mobile: "Schiefer steht für natürliche Eleganz und hohe Strapazierfähigkeit. Robuste, trittfeste Oberfläche, beständig gegen Temperaturschwankungen. Charakteristische Farbpalette von Anthrazit bis Grau.",
          desktop: "Schiefer steht für natürliche Eleganz, hohe Strapazierfähigkeit und zeitlose Ästhetik. Als Bodenbelag im Innenraum überzeugt er durch seine robuste, trittfeste Oberfläche und seine Beständigkeit gegenüber Temperaturschwankungen und Feuchtigkeit. Die feine, geschichtete Struktur und die charakteristische Farbpalette von Anthrazit bis Tiefgrau verleihen jedem Raum eine edle, zugleich warme Ausstrahlung. Schiefer bringt Ursprünglichkeit und Stil in Einklang – und wird so zum langlebigen Gestaltungselement für moderne wie klassische Wohnkonzepte."
        },
        imagePath: IMAGES.materials.schiefer
      },
      {
        id: 2,
        title: "Die Außenhülle - Unsere Materialien",
        subtitle: "Lärche Natur",
        description: {
          mobile: "Lärchen-Fassade vereint natürliche Ästhetik mit langlebiger Qualität. Die charakteristische Maserung verleiht zeitlose Eleganz. Hohe Witterungsbeständigkeit und natürliche Patina.",
          desktop: "Die Fassade in Holzlattung aus Lärche Natur vereint natürliche Ästhetik mit langlebiger Qualität. Die charakteristische Maserung und warme Farbgebung der Lärche verleihen Gebäuden eine zeitlose Eleganz und fügen sich harmonisch in die Umgebung ein. Dank der hohen Witterungsbeständigkeit des Holzes entwickelt die unbehandelte Lärche mit der Zeit eine silbergraue Patina, die den rustikalen Charme unterstreicht und zugleich vor Umwelteinflüssen schützt."
        },
        imagePath: IMAGES.materials.laercheFassade
      },
      {
        id: 3,
        title: "Die Außenhülle - Unsere Materialien",
        subtitle: "Kalkstein",
        description: {
          mobile: "Massiver Kalkstein überzeugt durch natürliche Eleganz und hohe Widerstandsfähigkeit. Charakteristische Farbgebung von warmen Beigetönen bis sanften Graunuancen. Edle Ausstrahlung.",
          desktop: "Der massive Kalkstein überzeugt durch seine natürliche Eleganz, zeitlose Ästhetik und hohe Widerstandsfähigkeit. Mit seiner charakteristischen Farbgebung, die von warmen Beigetönen bis hin zu sanften Graunuancen reicht, verleiht er Innen- und Außenbereichen eine edle, harmonische Ausstrahlung. Seine fein strukturierte Oberfläche und die einzigartigen Adern und Fossileinschlüsse machen jedes Element zu einem Unikat."
        },
        imagePath: IMAGES.materials.kalkstein
      },
      {
        id: 4,
        title: "Die Außenhülle - Unsere Materialien",
        subtitle: "FUNDERMAX® HPL-Platten",
        description: {
          mobile: "Fundermax HPL-Platten: moderne, langlebige Fassadenlösung. Hochverdichtete Laminatplatten bieten Witterungsbeständigkeit, UV-Stabilität und Schlagfestigkeit. Kratzfest und pflegeleicht.",
          desktop: "Die Fundermax HPL-Platten sind eine erstklassige Lösung für moderne und langlebige Fassadengestaltungen. Gefertigt aus hochverdichteten Laminatplatten, bieten sie eine außergewöhnliche Witterungsbeständigkeit, UV-Stabilität und Schlagfestigkeit. Ihre widerstandsfähige Oberfläche ist kratzfest, pflegeleicht und trotzt selbst extremen klimatischen Bedingungen."
        },
        imagePath: IMAGES.materials.fundermax
      },
      {
        id: 5,
        title: "Die Außenhülle - Unsere Materialien",
        subtitle: "Eiche Parkett",
        description: {
          mobile: "Eichen-Parkett steht für zeitlose Eleganz und natürliche Wärme. Die charakteristische Maserung verleiht jedem Raum eine edle Atmosphäre. Dank hoher Härte besonders langlebig.",
          desktop: "Der Parkettboden aus Eiche steht für zeitlose Eleganz, natürliche Wärme und außergewöhnliche Langlebigkeit. Die charakteristische Maserung und die warme Farbgebung der Eiche verleihen jedem Raum eine edle und zugleich gemütliche Atmosphäre. Dank der hohen Härte und Widerstandsfähigkeit des Holzes ist Eichenparkett besonders strapazierfähig und eignet sich sowohl für Wohnräume als auch für stark frequentierte Bereiche."
        },
        imagePath: IMAGES.materials.eicheParkett
      },
      {
        id: 6,
        title: "Die Außenhülle - Unsere Materialien",
        subtitle: "Trapezblech",
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
        title: "Die Innenverkleidung - Unsere Materialien",
        subtitle: "Eiche",
        description: {
          mobile: "Eichen-Innenverkleidung bringt die unvergleichliche Ausstrahlung echten Holzes in Ihre Räume. Warme Farbgebung und charaktervolle Maserung schaffen eine behagliche, hochwertige Atmosphäre.",
          desktop: "Die Innenverkleidung aus Eiche bringt die unvergleichliche Ausstrahlung echten Holzes in Ihre Räume. Mit ihrer warmen Farbgebung und der charaktervollen Maserung schafft Eiche eine behagliche Atmosphäre und verleiht jedem Interieur eine hochwertige, natürliche Note. Eiche ist nicht nur schön, sondern auch extrem widerstandsfähig. Die robuste Holzart eignet sich perfekt für den täglichen Gebrauch und bewahrt über viele Jahre hinweg ihre Form und Anmutung."
        },
        imagePath: IMAGES.interiorMaterials.eiche
      },
      {
        id: 2,
        title: "Die Innenverkleidung - Unsere Materialien",
        subtitle: "Fichte",
        description: {
          mobile: "Fichte-Innenverkleidung überzeugt durch helle, freundliche Ausstrahlung. Sanfte Maserung und feuchtigkeitsregulierende Eigenschaften sorgen für angenehmes Raumklima.",
          desktop: "Die Innenverkleidung aus Fichte überzeugt durch ihre helle, freundliche Ausstrahlung und verleiht jedem Raum ein Gefühl von Weite und Geborgenheit. Die sanfte Maserung und der warme Farbton der Fichte bringen die natürliche Schönheit des Holzes zur Geltung und schaffen eine wohltuende, harmonische Atmosphäre. Fichte ist leicht, vielseitig einsetzbar und sorgt dank ihrer feuchtigkeitsregulierenden Eigenschaften für ein angenehmes Raumklima."
        },
        imagePath: IMAGES.interiorMaterials.fichte
      },
      {
        id: 3,
        title: "Die Innenverkleidung - Unsere Materialien",
        subtitle: "Kiefer",
        description: {
          mobile: "Kiefern-Innenverkleidung bringt natürliche Wärme in den Raum. Markante Maserung und goldgelbe Töne schaffen gemütliche Atmosphäre. Leicht, gut verarbeitbar und feuchtigkeitsregulierend.",
          desktop: "Die Innenverkleidung aus Kiefernholz bringt natürliche Wärme und lebendige Optik in den Innenraum. Die markante Maserung und die warmen, goldgelben Töne schaffen eine gemütliche, einladende Atmosphäre. Gleichzeitig ist das Holz leicht, gut zu verarbeiten und wirkt feuchtigkeitsregulierend – ideal für ein angenehmes, gesundes Raumklima. Mit seiner zeitlosen Ausstrahlung passt es sowohl in moderne als auch in traditionelle Wohnkonzepte."
        },
        imagePath: IMAGES.interiorMaterials.kiefer
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
        title: "Fenster & Türen - Unsere Materialien",
        subtitle: "Kunststoff PVC",
        description: {
          mobile: "PVC-Fenster bieten hervorragende Wärmedämmung und Langlebigkeit. Sie sind pflegeleicht, witterungsbeständig und in verschiedenen Farben und Designs erhältlich.",
          desktop: "PVC-Fenster bieten hervorragende Wärmedämmung und Langlebigkeit bei optimaler Kosteneffizienz. Das hochwertige Kunststoffmaterial ist pflegeleicht, witterungsbeständig und UV-stabil. Moderne PVC-Fenster sind in verschiedenen Farben und Designs erhältlich und überzeugen durch ihre ausgezeichneten Isoliereigenschaften, die zu niedrigeren Heizkosten beitragen."
        },
        imagePath: IMAGES.windows.pvc
      },
      {
        id: 2,
        title: "Fenster & Türen - Unsere Materialien",
        subtitle: "Holz Fichte",
        description: {
          mobile: "Fichte-Holzfenster stehen für natürliche Schönheit und nachhaltiges Bauen. Das helle, warme Holz schafft eine gemütliche Atmosphäre und reguliert das Raumklima.",
          desktop: "Fichte-Holzfenster stehen für natürliche Schönheit, nachhaltiges Bauen und zeitlose Eleganz. Das helle, warme Holz mit seiner charakteristischen Maserung schafft eine gemütliche Atmosphäre und reguliert auf natürliche Weise das Raumklima. Holzfenster aus Fichte sind umweltfreundlich, renewable und verleihen jedem Zuhause eine authentische, warme Ausstrahlung."
        },
        imagePath: IMAGES.windows.fichte
      },
      {
        id: 3,
        title: "Fenster & Türen - Unsere Materialien",
        subtitle: "Aluminium",
        description: {
          mobile: "Aluminium-Fenster überzeugen durch ihre moderne Optik und hohe Stabilität. Sie sind korrosionsbeständig, wartungsarm und ermöglichen große Glasflächen.",
          desktop: "Aluminium-Fenster überzeugen durch ihre moderne, puristische Optik und außergewöhnliche Stabilität. Das robuste Material ist korrosionsbeständig, wartungsarm und ermöglicht die Realisierung großer Glasflächen bei schlanken Profilen. Aluminium-Fenster sind langlebig, recyclebar und fügen sich perfekt in zeitgenössische Architekturkonzepte ein."
        },
        imagePath: IMAGES.windows.aluminium
      },
      {
        id: 4,
        title: "Fenster & Türen - Unsere Materialien",
        subtitle: "Holz Eiche",
        description: {
          mobile: "Eichen-Holzfenster stehen für höchste Qualität und zeitlose Eleganz. Das robuste Hartholz überzeugt durch seine charaktervolle Maserung und außergewöhnliche Langlebigkeit.",
          desktop: "Eichen-Holzfenster stehen für höchste Qualität, zeitlose Eleganz und außergewöhnliche Langlebigkeit. Das robuste Hartholz überzeugt durch seine charaktervolle Maserung und warme Farbgebung, die jedem Raum eine edle, behagliche Atmosphäre verleiht. Eiche ist extrem widerstandsfähig und entwickelt über die Jahre eine wunderschöne Patina, die den natürlichen Charakter des Holzes unterstreicht."
        },
        imagePath: IMAGES.windows.eiche
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
        title: "Der Fußboden - Unsere Materialien",
        subtitle: "Feinsteinzeug - Schiefer",
        description: {
          mobile: "Schiefer steht für natürliche Eleganz und hohe Strapazierfähigkeit. Robuste, trittfeste Oberfläche, beständig gegen Temperaturschwankungen. Charakteristische Farbpalette von Anthrazit bis Grau.",
          desktop: "Schiefer steht für natürliche Eleganz, hohe Strapazierfähigkeit und zeitlose Ästhetik. Als Bodenbelag im Innenraum überzeugt er durch seine robuste, trittfeste Oberfläche und seine Beständigkeit gegenüber Temperaturschwankungen und Feuchtigkeit. Die feine, geschichtete Struktur und die charakteristische Farbpalette von Anthrazit bis Tiefgrau verleihen jedem Raum eine edle, zugleich warme Ausstrahlung. Schiefer bringt Ursprünglichkeit und Stil in Einklang – und wird so zum langlebigen Gestaltungselement für moderne wie klassische Wohnkonzepte."
        },
        imagePath: IMAGES.flooring.schiefer
      },
      {
        id: 2,
        title: "Der Fußboden - Unsere Materialien",
        subtitle: "Naturstein - Kanafar",
        description: {
          mobile: "Massiver Kalkstein überzeugt durch natürliche Eleganz und hohe Widerstandsfähigkeit. Charakteristische Farbgebung von warmen Beigetönen bis sanften Graunuancen. Edle Ausstrahlung.",
          desktop: "Der massive Kalkstein überzeugt durch seine natürliche Eleganz, zeitlose Ästhetik und hohe Widerstandsfähigkeit. Mit seiner charakteristischen Farbgebung, die von warmen Beigetönen bis hin zu sanften Graunuancen reicht, verleiht er Innen- und Außenbereichen eine edle, harmonische Ausstrahlung. Seine fein strukturierte Oberfläche und die einzigartigen Adern und Fossileinschlüsse machen jedes Element zu einem Unikat."
        },
        imagePath: IMAGES.flooring.kalkstein
      },
      {
        id: 3,
        title: "Der Fußboden - Unsere Materialien",
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
        title: "Photovoltaik - Varianten",
        subtitle: "Holzfassade",
        description: {
          mobile: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten.",
          desktop: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr. Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie."
        },
        imagePath: IMAGES.configurations.pv_holzfassade
      },
      {
        id: 2,
        title: "Photovoltaik - Varianten",
        subtitle: "Trapezblech",
        description: {
          mobile: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten.",
          desktop: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr. Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie."
        },
        imagePath: IMAGES.configurations.pv_trapezblech
      },
      {
        id: 3,
        title: "Photovoltaik - Varianten",
        subtitle: "Fassadenplatten Schwarz",
        description: {
          mobile: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten.",
          desktop: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr. Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie."
        },
        imagePath: IMAGES.configurations.pv_plattenschwarz
      },
      {
        id: 4,
        title: "Photovoltaik - Varianten",
        subtitle: "Fassadenplatten Weiß",
        description: {
          mobile: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten.",
          desktop: "Mit unserer Photovoltaik-Lösung machen Sie Ihr Zuhause unabhängiger, nachhaltiger und zukunftssicher. Moderne Solarmodule wandeln Sonnenlicht effizient in Strom um und senken damit dauerhaft Ihre Energiekosten – Tag für Tag, Jahr für Jahr. Unsere hochwertigen Photovoltaik-Systeme sind langlebig, wartungsarm und fügen sich harmonisch in die Architektur Ihres Hauses ein. Sie leisten nicht nur einen aktiven Beitrag zum Klimaschutz, sondern steigern auch langfristig den Wert Ihrer Immobilie."
        },
        imagePath: IMAGES.configurations.pv_plattenweiss
      }
    ]
  }
}; 