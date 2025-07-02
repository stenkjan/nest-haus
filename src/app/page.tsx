import { Button } from "@/components/ui";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

// Helper function to get mobile image path
const getMobileImagePath = (section: { imagePath: string }): string => {
  const mobileImageMap = {
    [IMAGES.hero.nestHaus1]: IMAGES.hero.mobile.nestHaus1,
    [IMAGES.hero.nestHaus2]: IMAGES.hero.mobile.nestHaus2,
    [IMAGES.hero.nestHaus3]: IMAGES.hero.mobile.nestHaus3,
    [IMAGES.hero.nestHaus4]: IMAGES.hero.mobile.nestHaus4,
    [IMAGES.hero.nestHaus5]: IMAGES.hero.mobile.nestHaus5,
    [IMAGES.hero.nestHaus6]: IMAGES.hero.mobile.nestHaus6,
    [IMAGES.hero.nestHaus7]: IMAGES.hero.mobile.nestHaus7,
    [IMAGES.hero.nestHaus8]: IMAGES.hero.mobile.nestHaus8,
  };
  return mobileImageMap[section.imagePath as keyof typeof mobileImageMap] || section.imagePath;
};

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
  // Landing page specific image styling - applies to all 8 images
  const landingImageStyle = {
    objectPosition: 'center center',
    transform: 'scale(1.05)',
    transformOrigin: 'center center',
  };

  return (
    <div className="w-full bg-white" style={{ paddingTop: 'var(--navbar-height, 3.5rem)' }}>
      {sections.map((section) => (
        <section 
          key={section.id} 
          className="relative w-full overflow-hidden"
          style={{ marginBottom: section.id !== sections.length ? '1vh' : '0' }}
        >
          {/* Desktop image container - 16:9 aspect ratio */}
          <div 
            className="hidden md:block relative w-full h-full"
            style={{ aspectRatio: '16/9' }}
          >
            <HybridBlobImage
              path={section.imagePath}
              alt={section.h1}
              fill
              className="object-cover"
              style={landingImageStyle}
              
              strategy="client"
              isAboveFold={section.id === 1}
              isCritical={section.id === 1}
              priority={section.id === 1}
              enableMobileDetection={false}
              sizes="100vw"
              quality={90}
              unoptimized={true}
            />
            
            {/* Desktop Content Overlay */}
            <div className={`absolute inset-0 z-20 flex flex-col items-center justify-start pt-[5vh] ${section.id === 2 ? 'px-0' : 'px-8'}`}>
              <div className="text-center">
                <h1 className="font-bold text-white text-5xl lg:text-6xl xl:text-7xl mb-1 lg:mb-1.5">
                  {section.h1}
                </h1>
                <h3 className="text-white text-xl lg:text-2xl xl:text-3xl mb-4 lg:mb-5">
                  {section.h3}
                </h3>
              </div>
              
              <div className="flex gap-4">
                <Button variant="landing-primary" size="xs">
                  {section.button1}
                </Button>
                <Button variant="landing-secondary" size="xs">
                  {section.button2}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile image container - natural aspect ratio */}
          <div className="block md:hidden relative w-full">
            <HybridBlobImage
              path={getMobileImagePath(section)}
              alt={section.h1}
              width={0}
              height={0}
              className="w-full h-auto object-cover"
              style={{
                ...landingImageStyle,
                position: 'relative',
                width: '100%',
                height: 'auto',
              }}
              
              strategy="client"
              isAboveFold={section.id === 1}
              isCritical={section.id === 1}
              priority={section.id === 1}
              enableMobileDetection={false}
              sizes="100vw"
              quality={90}
              unoptimized={true}
            />
            
            {/* Mobile Content Overlay */}
            <div className={`absolute inset-0 z-20 flex flex-col items-center justify-start pt-[5vh] ${section.id === 2 ? 'px-0' : 'px-8'}`}>
              <div className="text-center">
                <h1 className="font-bold text-white text-3xl sm:text-4xl md:text-5xl mb-1">
                  {section.h1}
                </h1>
                <h3 className="text-white text-lg sm:text-xl mb-4">
                  {section.h3}
                </h3>
              </div>
              
              <div className="flex gap-4">
                <Button variant="landing-primary" size="xs">
                  {section.button1}
                </Button>
                <Button variant="landing-secondary" size="xs">
                  {section.button2}
                </Button>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
