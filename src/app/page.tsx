import Image from "next/image";

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

  // Landing page specific spacing
  const landingSpacing = {
    topMargin: '10vh',
    h1ToH3Gap: '-1rem',
    h3ToButtonsGap: '1vh',
  };

  // Landing page specific typography - responsive sizing
  const landingTypography = {
    h1Size: 'clamp(4rem, 2.5vw, 1.5rem)', // 18pt at full screen, scales down
    h3Size: 'clamp(1.5rem, 1.8vw, 1.125rem)',  // Proportional to h1
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
          <div className="relative z-20 flex flex-col items-center justify-start px-8" 
               style={{ paddingTop: landingSpacing.topMargin }}>
            
            <div className="text-center">
              <h1 className="font-bold text-white"
                  style={{ 
                    marginBottom: landingSpacing.h1ToH3Gap,
                    fontSize: landingTypography.h1Size
                  }}>
                {section.h1}
              </h1>
              <h3 className="text-white"
                  style={{ 
                    marginBottom: landingSpacing.h3ToButtonsGap,
                    fontSize: landingTypography.h3Size
                  }}>
                {section.h3}
              </h3>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white text-black rounded">
                {section.button1}
              </button>
              <button className="px-6 py-3 bg-transparent border border-white text-white rounded">
                {section.button2}
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
