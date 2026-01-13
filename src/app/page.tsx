import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";
import { generatePageMetadata } from "@/lib/seo/generateMetadata";

// Dynamic SEO metadata for the landing page
export const metadata: Metadata = generatePageMetadata("home");

// Structured Data for Website/HomePage
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "®Hoam",
  description: "Modulare Häuser und nachhaltiges Bauen",
  url: "https://hoam-house.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://hoam-house.com/konfigurator?query={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

// Product schema for modular houses
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "®Hoam Modulares Bausystem",
  description:
    "Individuell konfigurierbare modulare Häuser für nachhaltiges Wohnen",
  brand: {
    "@type": "Brand",
    name: "®Hoam",
  },
  category: "Modulhaus",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: "https://hoam-house.com/konfigurator",
  },
  manufacturer: {
    "@type": "Organization",
    name: "®Hoam",
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
