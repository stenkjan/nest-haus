import type { Metadata } from "next";
import WarenkorbWrapper from "./WarenkorbWrapper";
import { generateShoppingCartSchema as _generateShoppingCartSchema } from "@/lib/seo/priceSchema";
import { generateBreadcrumbSchema } from "@/lib/seo/generateMetadata";

// Enhanced SEO metadata for the shopping cart page
export const metadata: Metadata = {
  title: "Warenkorb | Hoam-House Modulare Häuser | Ihre Konfiguration",
  description:
    "Überprüfen Sie Ihre ®Hoam Konfiguration und stellen Sie Ihre Anfrage. Transparent kalkulierte Preise für modulare Häuser.",
  keywords:
    "warenkorb, hoam konfiguration, modulhaus anfrage, hausbau warenkorb, fertighaus bestellen",
  alternates: {
    canonical: "https://hoam-house.com/warenkorb",
  },
  openGraph: {
    title: "®Hoam Warenkorb | Ihre Konfiguration",
    description:
      "Überprüfen Sie Ihre ®Hoam Konfiguration und stellen Sie Ihre unverbindliche Anfrage.",
    url: "https://hoam-house.com/warenkorb",
    images: [
      {
        url: "/images/warenkorb-preview.jpg",
        width: 1200,
        height: 630,
        alt: "®Hoam Warenkorb Übersicht",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "®Hoam Warenkorb | Ihre Konfiguration",
    description:
      "Überprüfen Sie Ihre ®Hoam Konfiguration und stellen Sie Ihre unverbindliche Anfrage.",
    images: ["/images/warenkorb-twitter.jpg"],
  },
  robots: {
    index: false, // Don't index individual shopping carts
    follow: true,
  },
};

// Structured Data for Shopping Cart
const shoppingCartSchema = {
  "@context": "https://schema.org",
  "@type": "ShoppingCart",
  name: "®Hoam Warenkorb",
  description: "Modulhaus Konfiguration Warenkorb",
  url: "https://hoam-house.com/warenkorb",
};

// Breadcrumb schema for SEO
const breadcrumbSchema = generateBreadcrumbSchema("warenkorb");

// Product schema for modular houses
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "®Hoam Modulares Bausystem",
  description: "Individuell konfigurierbare modulare Häuser",
  brand: {
    "@type": "Brand",
    name: "®Hoam",
  },
  category: "Modulhaus",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days from now
  },
};

// Server Component - Can handle SEO, metadata, and structured data
export default function WarenkorbPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(shoppingCartSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <WarenkorbWrapper />
    </>
  );
}
