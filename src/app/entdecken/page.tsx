import type { Metadata } from "next";
import EntdeckenClient from "./EntdeckenClient";

// Enhanced SEO metadata for the entdecken page
export const metadata: Metadata = {
  title: "Entdecken | NEST-Haus | Modulare Häuser & Nachhaltiges Bauen",
  description:
    "Entdecken Sie die Welt der NEST-Haus modularen Bausysteme. Innovation, Nachhaltigkeit und Design für Ihr Traumhaus.",
  keywords:
    "entdecken nest haus, modulhaus innovation, nachhaltiges bauen, modulare architektur, zukunft des wohnens, energieeffizient",
  alternates: {
    canonical: "https://nest-haus.com/entdecken",
  },
  openGraph: {
    title: "Entdecken | NEST-Haus | Modulare Häuser & Innovation",
    description:
      "Entdecken Sie die Welt der NEST-Haus modularen Bausysteme. Innovation, Nachhaltigkeit und Design.",
    url: "https://nest-haus.com/entdecken",
    images: [
      {
        url: "/images/entdecken-hero.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Entdecken - Modulare Innovationen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Entdecken | NEST-Haus | Modulare Häuser & Innovation",
    description:
      "Entdecken Sie die Welt der NEST-Haus modularen Bausysteme. Innovation, Nachhaltigkeit und Design.",
    images: ["/images/entdecken-twitter.jpg"],
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

// Structured Data for the Entdecken page
const entdeckenSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Entdecken - NEST-Haus",
  description:
    "Entdecken Sie die Innovation und Nachhaltigkeit der NEST-Haus modularen Bausysteme",
  url: "https://nest-haus.com/entdecken",
  mainEntity: {
    "@type": "Product",
    name: "NEST-Haus Modulares Bausystem",
    description: "Innovative modulare Häuser für nachhaltiges Wohnen",
    brand: {
      "@type": "Brand",
      name: "NEST-Haus",
    },
  },
};

// Innovation Schema
const innovationSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "NEST-Haus Innovation im modularen Bauen",
  description: "Innovative Ansätze und Technologien im modularen Hausbau",
  creator: {
    "@type": "Organization",
    name: "NEST-Haus",
  },
  about: "Modulares Bauen und nachhaltige Architektur",
};

// Server Component - Can handle SEO, metadata, and structured data
export default function EntdeckenPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(entdeckenSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(innovationSchema),
        }}
      />
      <EntdeckenClient />
    </>
  );
}
