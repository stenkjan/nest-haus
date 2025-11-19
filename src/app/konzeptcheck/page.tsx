import type { Metadata } from "next";
import KonzeptcheckClient from "./KonzeptcheckClient";

// Enhanced SEO metadata for the konzeptcheck page
export const metadata: Metadata = {
  title: "Konzeptcheck | NEST-Haus | Dein Konzeptcheck beginnt hier",
  description:
    "Dein NEST-Haus Konzeptcheck: Entdecke unsere Beratung, Planungsunterstützung und den Weg zu deinem individuellen modularen Hauskonzept.",
  keywords:
    "konzeptcheck, nest haus konzeptcheck, modulhaus planung, hauskonzept, nest haus design, professioneller konzeptcheck, modulhaus konzept",
  alternates: {
    canonical: "https://nest-haus.at/konzeptcheck",
  },
  openGraph: {
    title: "Konzeptcheck | NEST-Haus | Dein Konzeptcheck beginnt hier",
    description:
      "Dein NEST-Haus Konzeptcheck: Entdecke unsere Beratung und Planungsunterstützung.",
    url: "https://nest-haus.at/konzeptcheck",
    images: [
      {
        url: "/images/konzeptcheck-hero.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Konzeptcheck - Beratung und Planungsunterstützung",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Konzeptcheck | NEST-Haus | Dein Konzeptcheck beginnt hier",
    description:
      "Dein NEST-Haus Konzeptcheck: Entdecke unsere Beratung und Planungsunterstützung.",
    images: ["/images/konzeptcheck-twitter.jpg"],
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

// Structured Data for the Konzeptcheck page
const konzeptcheckSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Konzeptcheck - NEST-Haus",
  description:
    "Dein NEST-Haus Konzeptcheck - Beratung, Planungsunterstützung und professionelle Begleitung für dein Hauskonzept",
  url: "https://nest-haus.at/konzeptcheck",
  mainEntity: {
    "@type": "Service",
    name: "NEST-Haus Konzeptcheck und Beratung",
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
  name: "NEST-Haus Konzeptcheck und Planungsberatung",
  description:
    "Professionelle Konzeptcheck- und Planungsberatung für modulare Häuser",
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
export default function KonzeptcheckPage() {
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
