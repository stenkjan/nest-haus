import { Button } from "@/components/ui";
import { ServerBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

// Sample content for the 8 sections - using IMAGES constants
const sections = [
  {
    id: 1,
    imagePath: IMAGES.hero.nestHaus1,
    h1: "Dein Nest Haus",
    h3: "Die Welt ist dein Zuhause",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 2,
    imagePath: IMAGES.hero.nestHaus2,
    h1: "Wohnen ohne Grenzen",
    h3: "Ein Haus das mit dir geht",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 3,
    imagePath: IMAGES.hero.nestHaus3,
    h1: "Vogelperspektive",
    h3: "3 Gebäude Holzlattung Lärche",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 4,
    imagePath: IMAGES.hero.nestHaus4,
    h1: "Winter Design",
    h3: "2 Gebäude schwarze Trapezblech Fassade",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 5,
    imagePath: IMAGES.hero.nestHaus5,
    h1: "Wald Ansicht",
    h3: "6 Module schwarze Fassadenplatten",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 6,
    imagePath: IMAGES.hero.nestHaus6,
    h1: "Mediterrane Aussicht",
    h3: "4 Module am Meer mit Holzlattung",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 7,
    imagePath: IMAGES.hero.nestHaus7,
    h1: "Innenperspektive",
    h3: "Kalkstein Holz Verglasung",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 8,
    imagePath: IMAGES.hero.nestHaus8,
    h1: "Elegante Innenräume",
    h3: "Schwarze Steinplatten Design",
    button1: "Entdecken",
    button2: "Jetzt bauen"
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
    <div className="w-full bg-white">
      {sections.map((section) => (
        <section key={section.id} className="relative w-full overflow-hidden mb-2.5">
          
          {/* Background Image - Desktop (sm breakpoint: ≥640px) - 16:9 aspect ratio */}
          <div className="hidden sm:block relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <ServerBlobImage
              path={section.imagePath}
              alt={section.h1}
              fill
              className="object-cover"
              style={landingImageStyle}
              critical={section.id === 1}
              unoptimized
            />
          </div>
          
          {/* Background Image - Mobile (<640px) - Taller aspect ratio for mobile screens */}
          <div className="block sm:hidden relative w-full overflow-hidden" style={{ 
            aspectRatio: '4/5' // Mobile gets 4:5 aspect ratio (taller than 16:9)
          }}>
            <ServerBlobImage
              path={`${section.imagePath}-mobile`}
              fallbackSrc={section.imagePath} // Fallback to desktop image if mobile doesn't exist
              alt={section.h1}
              fill
              className="object-cover"
              style={landingImageStyle}
              critical={section.id === 1}
              unoptimized
            />
          </div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-start px-8 pt-[5vh]">
            
            <div className="text-center">
              <h1 className="font-bold text-white text-5xl lg:text-6xl xl:text-7xl mb-1 lg:mb-1.5">
                {section.h1}
              </h1>
              <h3 className="text-white text-xl lg:text-2xl xl:text-3xl mb-4 lg:mb-5">
                {section.h3}
              </h3>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-4">
              <Button variant="landing-primary" size="xs">
                {section.button1}
              </Button>
              <Button variant="landing-secondary" size="xs">
                {section.button2}
              </Button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
