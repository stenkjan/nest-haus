import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";
import { generatePageMetadata } from "@/lib/seo/generateMetadata";

// Dynamic SEO metadata for the landing page
export const metadata: Metadata = generatePageMetadata("home");

// Structured Data for Website/HomePage
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NEST-Haus",
  description: "Modulare Häuser und nachhaltiges Bauen",
  url: "https://nest-haus.at",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://nest-haus.at/konfigurator?query={search_term_string}",
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
    url: "https://nest-haus.at/konfigurator",
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
