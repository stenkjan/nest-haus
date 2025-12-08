import type { Metadata } from "next";
import WarenkorbWrapper from "./WarenkorbWrapper";
import { generateShoppingCartSchema as _generateShoppingCartSchema } from "@/lib/seo/priceSchema";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo/generateMetadata";

// Enhanced SEO metadata for the shopping cart page
export const metadata: Metadata = generatePageMetadata("warenkorb");

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

// Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema("warenkorb");

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
