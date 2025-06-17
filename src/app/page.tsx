import Image from "next/image";
import { Button } from "@/components/ui";

// Sample content for the 8 sections
const sections = [
  {
    id: 1,
    image: "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    h1: "Dein Nest Haus",
    h3: "Die Welt ist dein Zuhause",
    button1: "Mehr erfahren",
    button2: "Konfigurator"
  },
  {
    id: 2,
    image: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
    h1: "Moderne Architektur",
    h3: "7 Module mit weißen Fassadenplatten",
    button1: "Details ansehen",
    button2: "Jetzt planen"
  },
  {
    id: 3,
    image: "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche.png",
    h1: "Vogelperspektive",
    h3: "3 Gebäude Holzlattung Lärche",
    button1: "Galerie",
    button2: "Beratung"
  },
  {
    id: 4,
    image: "/images/4-NEST-Haus-2-Gebaeude-Schnee-Stirnseite-Schwarze-Trapezblech-Fassade.png",
    h1: "Winter Design",
    h3: "2 Gebäude schwarze Trapezblech Fassade",
    button1: "Wintermodell",
    button2: "Preis kalkulieren"
  },
  {
    id: 5,
    image: "/images/5-NEST-Haus-6-Module-Wald-Ansicht-Schwarze-Fassadenplatten.png",
    h1: "Wald Ansicht",
    h3: "6 Module schwarze Fassadenplatten",
    button1: "Waldmodell",
    button2: "Individuell gestalten"
  },
  {
    id: 6,
    image: "/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.png",
    h1: "Mediterrane Aussicht",
    h3: "4 Module am Meer mit Holzlattung",
    button1: "Meerblick",
    button2: "Standort planen"
  },
  {
    id: 7,
    image: "/images/7-NEST-Haus-Innenperspektive-Kalkstein-Holz-Verglasung-Stirnseite.jpg",
    h1: "Innenperspektive",
    h3: "Kalkstein Holz Verglasung",
    button1: "Innenansicht",
    button2: "Ausstattung wählen"
  },
  {
    id: 8,
    image: "/images/8-NEST-Haus-Innenperspektive-Schwarze-Steinplatten.jpg",
    h1: "Elegante Innenräume",
    h3: "Schwarze Steinplatten Design",
    button1: "Innenausstattung",
    button2: "Termine vereinbaren"
  }
];

export default function Home() {
  // Landing page specific image styling
  const landingImageStyle = {
    objectPosition: 'center center',
    transform: 'scale(1.05)',
    transformOrigin: 'center center',
  };

  return (
    <div className="w-full">
      {sections.map((section) => (
        <section key={section.id} className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={section.image}
              alt={section.h1}
              fill
              className="object-cover"
              style={landingImageStyle}
              unoptimized
              priority={section.id === 1}
            />
          </div>
          
          {/* Content Overlay */}
          <div className="relative z-20 flex flex-col items-center justify-start px-8 pt-[5vh]">
            
            <div className="text-center">
              <h1 className="font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-1 sm:mb-2 md:mb-3 lg:mb-4">
                {section.h1}
              </h1>
              <h3 className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 md:mb-8 lg:mb-10">
                {section.h3}
              </h3>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-4">
              <Button variant="primary" size="lg">
                {section.button1}
              </Button>
              <Button variant="secondary" size="lg">
                {section.button2}
              </Button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
