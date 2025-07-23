import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";

// Enhanced SEO metadata for the landing page
export const metadata: Metadata = {
  title: "NEST-Haus | Modulare Häuser & Nachhaltiges Bauen in Deutschland",
  description:
    "Entdecken Sie NEST-Haus modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar. Jetzt kostenlos beraten lassen!",
  keywords:
    "modulhaus, fertighaus, nachhaltiges bauen, energieeffizient, Deutschland, hausbau konfigurator, modulare häuser, nachhaltig wohnen",
  alternates: {
    canonical: "https://nest-haus.com",
  },
  openGraph: {
    title: "NEST-Haus | Modulare Häuser & Nachhaltiges Bauen",
    description:
      "Entdecken Sie NEST-Haus modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar.",
    url: "https://nest-haus.com",
    images: [
      {
        url: "/images/nest-haus-hero.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Modulare Häuser Hero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEST-Haus | Modulare Häuser & Nachhaltiges Bauen",
    description:
      "Entdecken Sie NEST-Haus modulare Bausysteme. Nachhaltig, energieeffizient und individuell konfigurierbar.",
    images: ["/images/nest-haus-hero-twitter.jpg"],
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

// Structured Data for Website/HomePage
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NEST-Haus",
  description: "Modulare Häuser und nachhaltiges Bauen",
  url: "https://nest-haus.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://nest-haus.com/konfigurator?query={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

// Product schema for modular houses
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "NEST-Haus Modulares Bausystem",
  description:
    "Individuell konfigurierbare modulare Häuser für nachhaltiges Wohnen",
  brand: {
    "@type": "Brand",
    name: "NEST-Haus",
  },
  category: "Modulhaus",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: "https://nest-haus.com/konfigurator",
  },
  manufacturer: {
    "@type": "Organization",
    name: "NEST-Haus",
  },
};



// Server Component - Can handle SEO, metadata, and structured data
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <LandingPageClient />
    </>
  );
}
