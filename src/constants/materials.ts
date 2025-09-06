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
        title: "Naturstein - Kalkstein",
        subtitle: "",
        description:
            "Der massive Kalkstein überzeugt durch seine natürliche Eleganz, zeitlose Ästhetik und hohe Widerstandsfähigkeit. Mit seiner charakteristischen Farbgebung, die von warmen Beigetönen bis hin zu sanften Graunuancen reicht, verleiht er Innen- und Außenbereichen eine edle, harmonische Ausstrahlung.",
        mobileTitle: "Kanfanar Naturstein",
        mobileSubtitle: "",
        mobileDescription:
            "Massive Kalkstein-Eleganz mit warmen Beigetönen bis sanften Graunuancen. Zeitlose Ästhetik und hohe Widerstandsfähigkeit für edle Ausstrahlung.",
        image: IMAGES.materials.kalkstein,
        backgroundColor: "#121212",
    },
    {
        id: 2,
        title: "Naturstein - Schiefer",
        subtitle: "",
        description:
            "Hochwertiger Schiefer verleiht jedem Raum eine edle und natürliche Atmosphäre. Seine charakteristische dunkelgraue Färbung und die natürliche Schieferung schaffen einzigartige Lichtreflexe und eine lebendige Oberflächenstruktur.",
        mobileTitle: "Schiefer Naturstein",
        mobileSubtitle: "",
        mobileDescription:
            "Hochwertiger Schiefer mit charakteristischer dunkelgrauer Färbung. Natürliche Schieferung für einzigartige Lichtreflexe.",
        image: IMAGES.materials.schiefer,
        backgroundColor: "#121212",
    },
    {
        id: 3,
        title: "Eichen-Parkett",
        subtitle: "",
        description:
            "Edles Eichen-Fischgrätparkett verbindet traditionelle Handwerkskunst mit zeitgemäßer Eleganz. Die charakteristische Maserung der Eiche und das klassische Verlegemuster schaffen eine warme, wohnliche Atmosphäre mit hoher Langlebigkeit.",
        mobileTitle: "Eichen-Parkett",
        mobileSubtitle: "",
        mobileDescription:
            "Edles Eichen-Fischgrätparkett mit traditioneller Handwerkskunst. Warme, wohnliche Atmosphäre mit hoher Langlebigkeit.",
        image: IMAGES.materials.eicheParkett,
        backgroundColor: "#121212",
    },
    {
        id: 4,
        title: "Lärchen-Holzlattung",
        subtitle: "",
        description:
            "Natürliche Lärchen-Holzlattung für die Fassadengestaltung. Das robuste Bauholz besticht durch seine warme Farbe und natürliche Widerstandsfähigkeit gegen Witterungseinflüsse. Eine nachhaltige und ästhetische Lösung für moderne Architektur.",
        mobileTitle: "Lärchen-Fassade",
        mobileSubtitle: "",
        mobileDescription:
            "Robuste Lärchen-Holzlattung mit warmer Farbe. Natürliche Widerstandsfähigkeit und nachhaltige Ästhetik.",
        image: IMAGES.materials.laercheFassade,
        backgroundColor: "#121212",
    },
    {
        id: 5,
        title: "Fundermax Platten",
        subtitle: "",
        description:
            "Hochwertige Fundermax Fassadenplatten in elegantem Schwarz. Die wetterbeständigen Platten bieten eine moderne, puristische Optik und sind langlebig sowie pflegeleicht. Ideal für zeitgemäße Architektur mit hohen Ansprüchen.",
        mobileTitle: "Fundermax Platten",
        mobileSubtitle: "",
        mobileDescription:
            "Hochwertige schwarze Fundermax Platten. Wetterbeständig, modern und pflegeleicht für zeitgemäße Architektur.",
        image: IMAGES.materials.fundermax,
        backgroundColor: "#121212",
    },
    {
        id: 6,
        title: "Trapezblech",
        subtitle: "",
        description:
            "Robustes Trapezblech in mattem Schwarz für eine kraftvolle, industrielle Ästhetik. Das langlebige Material ist wartungsarm, witterungsbeständig und verleiht Gebäuden einen markanten, modernen Charakter.",
        mobileTitle: "Trapezblech",
        mobileSubtitle: "",
        mobileDescription:
            "Robustes schwarzes Trapezblech für kraftvolle Ästhetik. Wartungsarm, witterungsbeständig und markant modern.",
        image: IMAGES.materials.trapezblech,
        backgroundColor: "#121212",
    },
]; 