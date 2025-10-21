import type { Metadata } from "next";
import DeinNestClient from "./DeinNestClient";

// Enhanced SEO metadata for the dein-nest page
export const metadata: Metadata = {
  title: "Dein Nest | NEST-Haus | Design für dich gemacht",
  description:
    "Entdecke dein NEST-Haus: Design für dich gemacht. Modulare Häuser mit individueller Gestaltung und nachhaltiger Bauweise.",
  keywords:
    "dein nest, nest haus, modulhaus, design, individuell, nachhaltig, modulbau, österreich",
  alternates: {
    canonical: "https://nest-haus.at/dein-nest",
  },
  openGraph: {
    title: "Dein Nest | NEST-Haus | Design für dich gemacht",
    description:
      "Entdecke dein NEST-Haus: Design für dich gemacht. Modulare Häuser mit individueller Gestaltung.",
    url: "https://nest-haus.at/dein-nest",
    images: [
      {
        url: "/images/dein-nest-hero.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Dein Nest - Design für dich gemacht",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dein Nest | NEST-Haus | Design für dich gemacht",
    description:
      "Entdecke dein NEST-Haus: Design für dich gemacht. Modulare Häuser mit individueller Gestaltung.",
    images: ["/images/dein-nest-twitter.jpg"],
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

// Structured Data for the Dein Nest page
const deinNestSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Dein Nest - NEST-Haus",
  description:
    "Entdecke dein NEST-Haus: Design für dich gemacht. Modulare Häuser mit individueller Gestaltung und nachhaltiger Bauweise.",
  url: "https://nest-haus.at/dein-nest",
  mainEntity: {
    "@type": "Product",
    name: "NEST-Haus Modulhäuser",
    description:
      "Modulare Häuser mit individueller Gestaltung und nachhaltiger Bauweise",
    brand: {
      "@type": "Brand",
      name: "NEST-Haus",
    },
  },
};

// Product Schema for modular houses
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "NEST-Haus Modulhäuser",
  description:
    "Modulare Häuser mit individueller Gestaltung, nachhaltiger Bauweise und flexibler Architektur",
  brand: {
    "@type": "Brand",
    name: "NEST-Haus",
  },
  category: "Modulhäuser",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    lowPrice: "177000",
    highPrice: "313000",
    offerCount: "3",
  },
};

// Server Component - Can handle SEO, metadata, and structured data
export default function DeinNestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(deinNestSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <DeinNestClient />
    </>
  );
}
