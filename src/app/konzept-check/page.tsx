import type { Metadata } from "next";
import KonzeptcheckClient from "./KonzeptcheckClient";

// Enhanced SEO metadata for the konzept-check page
export const metadata: Metadata = {
  title: "Konzept-Check | NEST-Haus | Dein Konzept-Check beginnt hier",
  description:
    "Dein NEST-Haus Konzept-Check: Entdecke unsere Beratung, Planungsunterstützung und den Weg zu deinem individuellen modularen Hauskonzept.",
  keywords:
    "konzept-check, nest haus konzept-check, modulhaus planung, hauskonzept, nest haus design, professioneller konzept-check, modulhaus konzept",
  alternates: {
    canonical: "https://nest-haus.at/konzept-check",
  },
  openGraph: {
    title: "Konzept-Check | NEST-Haus | Dein Konzept-Check beginnt hier",
    description:
      "Dein NEST-Haus Konzept-Check: Entdecke unsere Beratung und Planungsunterstützung.",
    url: "https://nest-haus.at/konzept-check",
    images: [
      {
        url: "/images/konzept-check-hero.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Konzept-Check - Beratung und Planungsunterstützung",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Konzept-Check | NEST-Haus | Dein Konzept-Check beginnt hier",
    description:
      "Dein NEST-Haus Konzept-Check: Entdecke unsere Beratung und Planungsunterstützung.",
    images: ["/images/konzept-check-twitter.jpg"],
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

// Structured Data for the Konzept-Check page
const konzeptcheckSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Konzept-Check - NEST-Haus",
  description:
    "Dein NEST-Haus Konzept-Check - Beratung, Planungsunterstützung und professionelle Begleitung für dein Hauskonzept",
  url: "https://nest-haus.at/konzept-check",
  mainEntity: {
    "@type": "Service",
    name: "NEST-Haus Konzept-Check und Beratung",
    description:
      "Professionelle Beratung und Unterstützung für dein individuelles Hauskonzept",
    provider: {
      "@type": "Organization",
      name: "NEST-Haus",
    },
  },
};

// Service Schema for design services
const designServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "NEST-Haus Konzept-Check und Planungsberatung",
  description:
    "Professionelle Konzept-Check- und Planungsberatung für modulare Häuser",
  provider: {
    "@type": "Organization",
    name: "NEST-Haus",
  },
  serviceType: "Hauskonzept und Planungsberatung",
  areaServed: {
    "@type": "Country",
    name: "Austria",
  },
};

// Server Component - Can handle SEO, metadata, and structured data
export default function KonzeptCheckPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(konzeptcheckSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(designServiceSchema),
        }}
      />
      <KonzeptcheckClient />
    </>
  );
}
