import type { Metadata } from "next";
import KonzeptClient from "./KonzeptClient";

// Enhanced SEO metadata for the konzept page
export const metadata: Metadata = {
  title: "Konzept | NEST-Haus | Dein Hauskonzept beginnt hier",
  description:
    "Dein NEST-Haus Konzept: Entdecke unsere Beratung, Planungsunterstützung und den Weg zu deinem individuellen modularen Hauskonzept.",
  keywords:
    "konzept, nest haus konzept, modulhaus planung, hauskonzept, nest haus design, professioneller hauskonzept, modulhaus konzept",
  alternates: {
    canonical: "https://nest-haus.at/konzept",
  },
  openGraph: {
    title: "Konzept | NEST-Haus | Dein Hauskonzept beginnt hier",
    description:
      "Dein NEST-Haus Konzept: Entdecke unsere Beratung und Planungsunterstützung.",
    url: "https://nest-haus.at/konzept",
    images: [
      {
        url: "/images/konzept-hero.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Konzept - Beratung und Planungsunterstützung",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Konzept | NEST-Haus | Dein Hauskonzept beginnt hier",
    description:
      "Dein NEST-Haus Konzept: Entdecke unsere Beratung und Planungsunterstützung.",
    images: ["/images/konzept-twitter.jpg"],
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

// Structured Data for the Konzept page
const konzeptSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Konzept - NEST-Haus",
  description:
    "Dein NEST-Haus Konzept - Beratung, Planungsunterstützung und professionelle Begleitung für dein Hauskonzept",
  url: "https://nest-haus.at/konzept",
  mainEntity: {
    "@type": "Service",
    name: "NEST-Haus Konzept und Beratung",
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
  name: "NEST-Haus Konzept und Planungsberatung",
  description:
    "Professionelle Konzept- und Planungsberatung für modulare Häuser",
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
export default function KonzeptPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(konzeptSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(designServiceSchema),
        }}
      />
      <KonzeptClient />
    </>
  );
}
