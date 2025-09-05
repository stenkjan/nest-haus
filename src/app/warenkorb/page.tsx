import type { Metadata } from "next";
import WarenkorbClient from "../warenkorb/WarenkorbClient";

// Enhanced SEO metadata for the shopping cart page
export const metadata: Metadata = {
  title: "Warenkorb | NEST-Haus Modulare Häuser | Ihre Konfiguration",
  description:
    "Überprüfen Sie Ihre NEST-Haus Konfiguration und stellen Sie Ihre Anfrage. Transparent kalkulierte Preise für modulare Häuser.",
  keywords:
    "warenkorb, nest haus konfiguration, modulhaus anfrage, hausbau warenkorb, fertighaus bestellen",
  alternates: {
    canonical: "https://nest-haus.at/warenkorb",
  },
  openGraph: {
    title: "NEST-Haus Warenkorb | Ihre Konfiguration",
    description:
      "Überprüfen Sie Ihre NEST-Haus Konfiguration und stellen Sie Ihre unverbindliche Anfrage.",
    url: "https://nest-haus.at/warenkorb",
    images: [
      {
        url: "/images/warenkorb-preview.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Warenkorb Übersicht",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEST-Haus Warenkorb | Ihre Konfiguration",
    description:
      "Überprüfen Sie Ihre NEST-Haus Konfiguration und stellen Sie Ihre unverbindliche Anfrage.",
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
  name: "NEST-Haus Warenkorb",
  description: "Modulhaus Konfiguration Warenkorb",
  url: "https://nest-haus.at/warenkorb",
};

// Product schema for modular houses
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "NEST-Haus Modulares Bausystem",
  description: "Individuell konfigurierbare modulare Häuser",
  brand: {
    "@type": "Brand",
    name: "NEST-Haus",
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
          __html: JSON.stringify(shoppingCartSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <WarenkorbClient />
    </>
  );
}
