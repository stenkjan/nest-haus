import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ThreeByOneAdaptiveHeight, FullWidthImageGrid, ThreeByOneGrid } from "@/components/grids";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";
import { ContentCardsGlass } from "@/components/cards";

// Enhanced SEO metadata for the unser-part page
export const metadata: Metadata = {
  title: "Unser Part | NEST-Haus | Unsere Rolle beim Hausbau",
  description:
    "Entdecke unsere Rolle beim NEST-Haus Bauprozess. Von der Beratung bis zur Realisierung - unser Beitrag für dein Traumhaus.",
  keywords:
    "unser part, nest haus leistungen, modulhaus expertise, baubegleitung, hausbau service, nest haus team, professioneller hausbau",
  alternates: {
    canonical: "https://nest-haus.com/unser-part",
  },
  openGraph: {
    title: "Unser Part | NEST-Haus | Unsere Rolle beim Hausbau",
    description:
      "Entdecke unsere Rolle beim NEST-Haus Bauprozess. Von der Beratung bis zur Realisierung.",
    url: "https://nest-haus.com/unser-part",
    images: [
      {
        url: "/images/unser-part-hero.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Unser Part - Unsere Expertise beim Hausbau",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unser Part | NEST-Haus | Unsere Rolle beim Hausbau",
    description:
      "Entdecke unsere Rolle beim NEST-Haus Bauprozess. Von der Beratung bis zur Realisierung.",
    images: ["/images/unser-part-twitter.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Structured Data for the Unser Part page
const unserPartSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Unser Part - NEST-Haus",
  description:
    "Unsere Rolle und unser Beitrag beim NEST-Haus Bauprozess - von der Beratung bis zur Realisierung",
  url: "https://nest-haus.com/unser-part",
  mainEntity: {
    "@type": "Service",
    name: "NEST-Haus Baubegleitung und Expertise",
    description:
      "Professionelle Begleitung und Expertise im gesamten Planungs- und Bauprozess",
    provider: {
      "@type": "Organization",
      name: "NEST-Haus",
    },
  },
};

// Service Schema for company expertise
const companyServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "NEST-Haus Expertise und Baubegleitung",
  description:
    "Professionelle Expertise und Begleitung beim Bau modularer Häuser",
  provider: {
    "@type": "Organization",
    name: "NEST-Haus",
  },
  serviceType: "Bauplanung und Projektmanagement",
  areaServed: {
    "@type": "Country",
    name: "Austria",
  },
};

// Server Component - Can handle SEO, metadata, and structured data
export default function UnserPartPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(unserPartSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(companyServiceSchema),
        }}
      />
      <div
        className="min-h-screen bg-black text-white"
        style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
      >
        {/* Hero Section - Hochpräzise Produktionsmethoden */}
        <section className="relative bg-white py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-1 lg:mb-1.5">
                Hochpräzise Produktionsmethoden
              </h1>
              <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-black mb-4 lg:mb-5">
                Schaffen beste Qualität zu fairen Preisen.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button variant="primary" size="xs">
                  Unser Part
                </Button>
                <Button variant="secondary" size="xs">
                  Dein Part
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section - NEST Haus Modul Schema */}
        <section className="bg-black pt-20 pb-8">
          <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
            <div className="text-center mb-24">
              <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-white mb-3">
                Dein Nest System
              </h2>
              <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-white">
              Individualisiert, wo es Freiheit braucht. Standardisiert, wo es Effizienz schafft. 
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-6xl">
                <HybridBlobImage
                  path={IMAGES.function.nestHausModulSchema}
                  alt="NEST-Haus Modul Schema Explosionszeichnung - Modulare Bauweise Konzept"
                  width={0}
                  height={0}
                  className="w-full h-auto"
                  strategy="auto"
                  isAboveFold={false}
                  isCritical={false}
                  enableMobileDetection={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  quality={90}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Combined ThreeByOneGrid Section */}
        <section className="pt-20 pb-8">
          <ThreeByOneGrid
            title="Manchmal kommt es auf die Größe an."
            subtitle="6 Meter Hoch, 8 Meter Breit, unendlich lang."
            backgroundColor="black"
            text="Unsere Qualitätssicherung beginnt bereits in der Planungsphase und setzt sich durch den gesamten Fertigungsprozess fort. Jedes Modul wird nach strengsten Standards gefertigt und vor der Auslieferung umfassend geprüft."
            mobileText="Qualitätssicherung und Präzision in jedem Arbeitsschritt - das ist unser Versprechen für dein NEST-Haus."
            textPosition="left"
            maxWidth={false}
          />
        </section>

        {/* ThreeByOneGrid - Right Position (No Title/Subtitle) */}
        <section className="pt-4 pb-8">
          <ThreeByOneGrid
            title=""
            subtitle=""
            backgroundColor="black"
            text="Seitliche Ansicht des Moduls zeigt die durchdachte Konstruktion und die optimierte Statik. Jedes Modul ist selbsttragend und kann flexibel mit anderen Modulen kombiniert werden. Die präzise Fertigung garantiert perfekte Passgenauigkeit und höchste Qualität."
            textPosition="right"
            maxWidth={false}
            image1="23-NEST-Haus-Modul-Ansicht-Seite-Holz-Schema-Konzept"
            image2="24-NEST-Haus-Modul-Ansicht-Seite-Holz-Schema-Konzept-Liniengrafik"
            image1Description="Seitliche Ansicht zeigt die durchdachte Konstruktion"
            image2Description="Liniengrafik verdeutlicht die optimierte Statik"
          />
        </section>

        {/* FullWidthImageGrid */}
        <section className="pt-20 pb-8">
          <FullWidthImageGrid
            title="Raum zum Träumen"
            subtitle="Eine Bauweise die, das Beste aus allen Welten, kombiniert."
            backgroundColor="black"
            textBox1="Durch unsere systematische Herangehensweise und bewährte Prozesse stellen wir sicher, dass jedes NEST-Haus den höchsten Qualitätsstandards entspricht. Von der Planung über die Fertigung bis zur Montage - wir überwachen jeden Schritt."
            textBox2="Unser Part ist es, komplexe Bauprojekte zu vereinfachen und für dich transparent zu gestalten. Mit modernen Planungstools und durchdachten Abläufen machen wir den Hausbau zu einem entspannten Erlebnis."
            maxWidth={false}
          />
        </section>

        {/* ContentCardsGlass Section */}
        <section className="bg-black pt-20 pb-8">
          {/* Title and subtitle with max-width constraint */}
          <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
            <div className="text-center mb-24">
              <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-white mb-3">
              Gut für Dich, besser für die Zukunft
              </h2>
              <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-white">
              Entdecke unsere sorgfältig ausgewählten Materialien
              </p>
            </div>
          </div>
          
          {/* ContentCardsGlass with full width */}
          <ContentCardsGlass 
            variant="responsive"
            title=""
            subtitle=""
            maxWidth={false}
            showInstructions={true}
          />
        </section>

        {/* ThreeByOneAdaptiveHeight Grid */}
        <section className="pt-20 pb-8">
          <ThreeByOneAdaptiveHeight
            title="Fenster & Türen"
            subtitle="Deine Fenster- und Türöffnungen werden dort platziert, wo du es möchtest."
            backgroundColor="black"
            text="Unser erfahrenes Team begleitet dich von der ersten Idee bis zum Einzug in dein neues Zuhause. Mit jahrelanger Expertise im modularen Hausbau sorgen wir dafür, dass dein Projekt reibungslos und termingerecht realisiert wird."
            imageDescription="NEST-Haus Expertise und professionelle Beratung"
            maxWidth={false}
          />
        </section>

        {/* ThreeByOneGrid - Left Position (Bottom Section) */}
        <section className="pt-4 pb-8">
          <ThreeByOneGrid
            title=""
            subtitle=""
            backgroundColor="black"
            text="Sobald die Module geliefert sind, beginnt dein Teil der Gestaltung. Fenster und Türen setzt du ganz einfach in die dafür vorgesehenen Öffnungen ein. Jeder Handgriff folgt deinem Plan, jeder Schritt bringt dich deinem Zuhause näher. Du bestimmst, wo Licht einfällt, wo Wege beginnen und wie dein Raum sich öffnet. So entsteht nicht nur ein Haus, sondern ein Ort, der ganz dir gehört."
            textPosition="left"
            maxWidth={false}
            image1="34-NEST-Haus-Planung-Innenausbau-Fenster-Tueren-Stirnseite"
            image2="32-NEST-Haus-Planung-Innenausbau-Fenster-Tueren-Einbau-Positionierung-Abschlussmodul-Liniengrafik"
            image1Description="Fenster und Türen Einbau Positionierung"
            image2Description="Mittelmodul Liniengrafik Fenster und Türen"
          />
        </section>
        {/* ThreeByOneGrid - Right Position (Bottom Section) */}
        <section className="pt-4 pb-20">
          <ThreeByOneGrid
            title=""
            subtitle=""
            backgroundColor="black"
            text="Solltest du Unterstützung bei der Planung benötigen, kannst du eines unserer Planungspakete wählen. So erhältst du genau die Hilfe, die du brauchst, um deine Vision Wirklichkeit werden zu lassen."
            textPosition="right"
            maxWidth={false}
            image1="23-NEST-Haus-Modul-Ansicht-Seite-Holz-Schema-Konzept"
            image2="31-NEST-Haus-Planung-Innenausbau-Fenster-Tueren-Einbau-Positionierung-Mittelmodul-Liniengrafik"
            image1Description="Modul Seitenansicht Holz Schema Konzept"
            image2Description="Planung Innenausbau Fenster Türen Mittelmodul Liniengrafik"
            showButtons={true}
            primaryButtonText="Die Pakete"
            secondaryButtonText="Mehr erfahren"
          />
        </section>
      </div>
    </>
  );
} 