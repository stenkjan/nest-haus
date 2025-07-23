import type { Metadata } from "next";

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
      <div className="min-h-screen pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Dein Part</h1>
          <p className="text-xl text-gray-600 mb-8">
            Deine Rolle beim Bau deines Traumhauses
          </p>
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-gray-500">
              Diese Seite wird derzeit überarbeitet und steht bald zur
              Verfügung.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
