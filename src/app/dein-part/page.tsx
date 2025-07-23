import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";
import { HybridBlobImage } from "@/components/images";
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
        className="min-h-screen bg-white"
        style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
      >
        {/* Hero Section - Dein Part */}
        <section className="relative bg-gradient-to-br from-blue-50 to-gray-50 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                    Dein Part
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600">
                    Deine Rolle beim Bau deines Traumhauses
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Bei NEST-Haus bist du nicht nur Kunde, sondern aktiver
                    Gestalter deines Zuhauses. Entdecke, wie du von der ersten
                    Idee bis zur Schlüsselübergabe dein Traumhaus mitformst.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Link href="/konfigurator">
                    <Button variant="primary" size="lg">
                      Jetzt konfigurieren
                    </Button>
                  </Link>
                  <Link href="/kontakt">
                    <Button variant="secondary" size="lg">
                      Beratung buchen
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right side - Image */}
              <div className="relative">
                <HybridBlobImage
                  path={IMAGES.function.nestHausKonfigurator}
                  strategy="ssr"
                  isAboveFold={true}
                  isCritical={true}
                  priority={true}
                  alt="NEST-Haus Konfigurator - Dein Part beim Hausbau"
                  width={600}
                  height={400}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Deine Vision - Section 2 */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Deine Vision
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Alles beginnt mit deiner Idee. Du bringst die Vision mit, wir
                sorgen für die Umsetzung.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Deine Ideen
                </h3>
                <p className="text-gray-600">
                  Bring deine Wünsche und Träume mit. Ob Arbeitsplatz,
                  Familienzuhause oder Rückzugsort - deine Vision steht im
                  Mittelpunkt.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Deine Bedürfnisse
                </h3>
                <p className="text-gray-600">
                  Erzähl uns von deinem Lebensstil. Wie wohnst du? Was brauchst
                  du? Gemeinsam finden wir die perfekte Lösung für dich.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Dein Stil
                </h3>
                <p className="text-gray-600">
                  Zeig uns deinen persönlichen Geschmack. Von minimalistisch bis
                  gemütlich - dein Stil prägt dein Zuhause.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Deine Reise - Section 3 */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Deine Reise zu deinem Nest
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Schritt für Schritt begleiten wir dich auf dem Weg zu deinem
                Traumhaus. Hier siehst du, welche Rolle du in jeder Phase
                spielst.
              </p>
            </div>

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      1
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Deine Konfiguration
                    </h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    <span className="font-semibold">Dein Part:</span> Nutze
                    unseren Konfigurator, um dein Haus nach deinen Wünschen zu
                    gestalten. Wähle Größe, Layout, Materialien und Features -
                    alles in Echtzeit und mit sofortiger Preistransparenz.
                  </p>
                  <div className="pt-4">
                    <Link href="/konfigurator">
                      <Button variant="primary">Konfigurator starten</Button>
                    </Link>
                  </div>
                </div>
                <div className="order-first lg:order-last">
                  <HybridBlobImage
                    path={IMAGES.materials.holzFichte}
                    strategy="client"
                    isAboveFold={false}
                    alt="NEST-Haus Konfigurator - Deine Materialauswahl"
                    width={500}
                    height={300}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="order-last lg:order-first">
                  <HybridBlobImage
                    path={IMAGES.function.nestHausGrundstueckCheck}
                    strategy="client"
                    isAboveFold={false}
                    alt="NEST-Haus Beratung - Deine persönliche Betreuung"
                    width={500}
                    height={300}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      2
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Deine Beratung
                    </h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    <span className="font-semibold">Dein Part:</span> Teile
                    deine Wünsche und Fragen mit unserem Expertenteam. In
                    persönlichen Gesprächen verfeinern wir gemeinsam deine
                    Konfiguration und klären alle Details.
                  </p>
                  <div className="pt-4">
                    <Link href="/kontakt">
                      <Button variant="secondary">Termin vereinbaren</Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      3
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Deine Entscheidungen
                    </h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    <span className="font-semibold">Dein Part:</span> Du
                    entscheidest über finale Details, Sonderwünsche und
                    Anpassungen. Wir begleiten dich bei allen wichtigen
                    Entscheidungen und sorgen für Klarheit bei jedem Schritt.
                  </p>
                  <div className="pt-4">
                    <Button variant="primary">Mehr erfahren</Button>
                  </div>
                </div>
                <div className="order-first lg:order-last">
                  <HybridBlobImage
                    path={IMAGES.hero.nestHaus4}
                    strategy="client"
                    isAboveFold={false}
                    alt="NEST-Haus Planung - Deine Entscheidungen"
                    width={500}
                    height={300}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>

              {/* Step 4 */}
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="order-last lg:order-first">
                  <HybridBlobImage
                    path={IMAGES.hero.nestHaus7}
                    strategy="client"
                    isAboveFold={false}
                    alt="NEST-Haus Realisierung - Dein Traumhaus wird Realität"
                    width={500}
                    height={300}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      4
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Deine Realisierung
                    </h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    <span className="font-semibold">Dein Part:</span> Verfolge
                    den Fortschritt deines Hauses und bereite dich auf den
                    Einzug vor. Wir halten dich über jeden Meilenstein auf dem
                    Laufenden bis zur Schlüsselübergabe.
                  </p>
                  <div className="pt-4">
                    <Button variant="primary">Zur Realisierung</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action - Section 4 */}
        <section className="bg-blue-600 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-6 text-white">
              <h2 className="text-4xl md:text-5xl font-bold">
                Bereit für deinen Part?
              </h2>
              <p className="text-xl md:text-2xl opacity-90">
                Starte jetzt deine Reise zu deinem Traumhaus
              </p>
              <p className="text-lg opacity-80 max-w-2xl mx-auto">
                Nutze unseren Konfigurator für den ersten Schritt oder
                vereinbare einen Beratungstermin. Wir freuen uns darauf, deine
                Vision gemeinsam mit dir zu verwirklichen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/konfigurator">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Konfigurator starten
                  </Button>
                </Link>
                <Link href="/kontakt">
                  <Button variant="landing-secondary" size="lg" className="w-full sm:w-auto">
                    Beratung buchen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 