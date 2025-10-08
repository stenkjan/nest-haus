import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
export default async function Home() {
  // Server-side authentication check
  const correctPassword = process.env.SITE_PASSWORD;

  if (correctPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-auth");

    console.log("[SERVER] Password protection enabled");
    console.log("[SERVER] Auth cookie exists:", !!authCookie);

    if (!authCookie || authCookie.value !== correctPassword) {
      console.log("[SERVER] Redirecting to auth page");
      redirect("/auth?redirect=" + encodeURIComponent("/"));
    }

    console.log("[SERVER] User authenticated, rendering page");
  }

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
