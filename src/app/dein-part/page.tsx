import type { Metadata } from "next";
import { Button } from "@/components/ui";
import { FullWidthVideoGrid, FullWidthTextGrid } from "@/components/grids";
import { ClientBlobImage } from "@/components/images";
import { ImageGlassCard } from "@/components/cards";
import { IMAGES } from "@/constants/images";

// Enhanced SEO metadata for the dein-part page
export const metadata: Metadata = {
  title: "Dein Part | NEST-Haus | Deine Rolle beim Hausbau",
  description:
    "Entdecke deine Rolle beim NEST-Haus Bauprozess. Von der ersten Idee bis zur Realisierung - dein aktiver Part für dein Traumhaus.",
  keywords:
    "dein part, hausbau mitgestaltung, modulhaus planung, kundenpart, bauherr rolle, nest haus kunde, individueller hausbau",
  alternates: {
    canonical: "https://nest-haus.com/dein-part",
  },
  openGraph: {
    title: "Dein Part | NEST-Haus | Deine Rolle beim Hausbau",
    description:
      "Entdecke deine Rolle beim NEST-Haus Bauprozess. Von der ersten Idee bis zur Realisierung.",
    url: "https://nest-haus.com/dein-part",
    images: [
      {
        url: "/images/dein-part-hero.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Dein Part - Kundenrolle beim Hausbau",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dein Part | NEST-Haus | Deine Rolle beim Hausbau",
    description:
      "Entdecke deine Rolle beim NEST-Haus Bauprozess. Von der ersten Idee bis zur Realisierung.",
    images: ["/images/dein-part-twitter.jpg"],
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

// Structured Data for the Dein Part page
const deinPartSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Dein Part - NEST-Haus",
  description:
    "Deine Rolle und dein Beitrag beim NEST-Haus Bauprozess - von der Planung bis zur Realisierung",
  url: "https://nest-haus.com/dein-part",
  mainEntity: {
    "@type": "Service",
    name: "Kundenbetreuung und Planungsunterstützung",
    description:
      "Begleitung der Kunden durch den gesamten Planungs- und Bauprozess",
    provider: {
      "@type": "Organization",
      name: "NEST-Haus",
    },
  },
};

// Service Schema for customer involvement
const customerServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Kundeneinbindung beim Hausbau",
  description:
    "Aktive Einbindung der Kunden in den Planungs- und Bauprozess ihres modularen Traumhauses",
  provider: {
    "@type": "Organization",
    name: "NEST-Haus",
  },
  serviceType: "Bauberatung und Kundenbetreuung",
  areaServed: {
    "@type": "Country",
    name: "Austria",
  },
};

// Server Component - Can handle SEO, metadata, and structured data
export default function DeinPartPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(deinPartSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(customerServiceSchema),
        }}
      />
      <div
        className="min-h-screen bg-black text-white"
        style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
      >
        {/* Hero Section - Dein kreativer Freiraum */}
        <section className="relative bg-white py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-1 lg:mb-1.5">
                Dein kreativer Freiraum
              </h1>
              <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-black mb-4 lg:mb-5">
                Gestalte dein NEST Haus nach deinen Vorstellungen.
              </p>

              <div className="flex gap-4 justify-center">
                <Button variant="primary" size="xs">
                  Dein Part
                </Button>
                <Button variant="secondary" size="xs">
                  Unser Part
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FullWidthVideoGrid */}
        <section className="pt-20 pb-8">
          <FullWidthVideoGrid
            title="Wir liefern Möglichkeiten"
            subtitle="Wo Effizienz auf Architektur trifft - Nest®"
            backgroundColor="black"
            textBox1="Nach der Lieferung deines NEST Hauses ist die Grundlage für dein neues Zuhause geschaffen, im wahrsten Sinne des Wortes. Damit du es ganz an deine persönlichen Vorstellungen anpassen kannst, übernimmst du den letzten Feinschliff selbst. Dazu gehören der Aufbau der Innenwände sowie die Verlegung von Elektrik und Sanitärtechnik. Das System ist exakt dafür vorbereitet und macht jeden Schritt klar."
            textBox2="Dank vorkonzipierter Wandpaneele wird das Einziehen von Leitungen besonders einfach. So behältst du maximale Freiheit in der Gestaltung, kannst regionale Fachbetriebe einbinden oder selbst aktiv werden. Alles richtet sich nach deinem Tempo und deinem Budget. Dieses flexible Ausbaukonzept spart Kosten, stärkt die Eigenverantwortung und macht dein NEST Haus zu einem Ort, der wirklich dir gehört."
            maxWidth={false}
            video={IMAGES.function.nestHausModulSchema}
            autoPlay={true}
            loop={false}
            muted={true}
            controls={false}
            reversePlayback={true}
          />
        </section>

        {/* Single Image Section - Du individualisierst dein NEST Haus */}
        <section className="bg-black pt-20 pb-20">
          <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-white mb-3">
                Du individualisierst dein NEST Haus.
              </h2>
              <p className="text-base md:text-lg lg:text-xl 2xl:text-2xl text-white">
                Weil nur du weißt, wie du richtig wohnst.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-full relative" style={{ aspectRatio: "1.9/1" }}>
                <ClientBlobImage
                  path={IMAGES.function.nestHausGrundrissSchema}
                  alt="NEST-Haus Grundriss Schema - Individualisierung und Planung"
                  enableCache={true}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 1550px"
                  quality={85}
                />
              </div>
            </div>
          </div>
        </section>

        {/* FullWidthTextGrid */}
        <section className="pt-20 pb-20">
          <FullWidthTextGrid
            title="Hier beginnt Freiheit"
            subtitle="Weil nur Du weißt, wie du richtig wohnst."
            backgroundColor="black"
            textBox1="Mit Nest hast du die Freiheit, deinen Grundriss so zu gestalten, wie es zu deinem Leben passt. Kein Schema, kein Standard. Nur Räume, die sich anfühlen wie du selbst. Denn richtig wohnen bedeutet mehr als Fläche und Funktion. Es ist Persönlichkeit, Ausdruck und Alltag der von dir in Einklang gebracht wird."
            textBox2="Wenn du auf dem Weg dorthin Unterstützung möchtest, begleiten wir dich Schritt für Schritt. Unsere Planungspakete führen dich von der Einreichplanung bis zur Gestaltung des Innenraums. Individuell, durchdacht und auf deine Vorstellungen abgestimmt. So entsteht aus einer Idee ein Zuhause, das wirklich zu dir passt."
            maxWidth={false}
          />
        </section>

        {/* ImageGlassCard */}
        <section className="pt-20 pb-20">
          <ImageGlassCard
            backgroundColor="black"
            primaryButtonText="Zum Konfigurator"
            secondaryButtonText="Mehr erfahren"
            maxWidth={false}
          />
        </section>
      </div>
    </>
  );
}
