import Image from "next/image";
import { Button } from "@/components/ui";

// Sample content for the 8 sections
const sections = [
  {
    id: 1,
    image: "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
    mobileImage: "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche-mobile.png",
    h1: "Dein Nest Haus",
    h3: "Die Welt ist dein Zuhause",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 2,
    image: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
    mobileImage: "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten-mobile.png",
    h1: "Wohnen ohne Grenzen",
    h3: "Ein Haus das mit dir geht",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 3,
    image: "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche.png",
    mobileImage: "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche-mobile.png",
    h1: "Vogelperspektive",
    h3: "3 Gebäude Holzlattung Lärche",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 4,
    image: "/images/4-NEST-Haus-2-Gebaeude-Schnee-Stirnseite-Schwarze-Trapezblech-Fassade.png",
    mobileImage: "/images/4-NEST-Haus-2-Gebaeude-Schnee-Stirnseite-Schwarze-Trapezblech-Fassade-mobile.png",
    h1: "Winter Design",
    h3: "2 Gebäude schwarze Trapezblech Fassade",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 5,
    image: "/images/5-NEST-Haus-6-Module-Wald-Ansicht-Schwarze-Fassadenplatten.png",
    mobileImage: "/images/5-NEST-Haus-6-Module-Wald-Ansicht-Schwarze-Fassadenplatten-mobile.png",
    h1: "Wald Ansicht",
    h3: "6 Module schwarze Fassadenplatten",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 6,
    image: "/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche.png",
    mobileImage: "/images/6-NEST-Haus-4-Module-Ansicht-Meer-Mediteran-Stirnseite-Holzlattung-Laerche-mobile.png",
    h1: "Mediterrane Aussicht",
    h3: "4 Module am Meer mit Holzlattung",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 7,
    image: "/images/7-NEST-Haus-Innenperspektive-Kalkstein-Holz-Verglasung-Stirnseite.jpg",
    mobileImage: "/images/7-NEST-Haus-Innenperspektive-Kalkstein-Holz-Verglasung-Stirnseite-mobile.png",
    h1: "Innenperspektive",
    h3: "Kalkstein Holz Verglasung",
    button1: "Entdecken",
    button2: "Jetzt bauen"
  },
  {
    id: 8,
    image: "/images/8-NEST-Haus-Innenperspektive-Schwarze-Steinplatten.jpg",
    mobileImage: "/images/8-NEST-Haus-Innenperspektive-Schwarze-Steinplatten-mobile.png",
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
          {/* Background Image - Desktop (16:9 aspect ratio) */}
          <div className="hidden md:block relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
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
          
          {/* Background Image - Mobile (natural aspect ratio) */}
          <div className="block md:hidden relative w-full overflow-hidden">
            <Image
              src={section.mobileImage}
              alt={section.h1}
              width={800}
              height={1200}
              className="w-full h-auto object-cover"
              style={landingImageStyle}
              unoptimized
              priority={section.id === 1}
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
