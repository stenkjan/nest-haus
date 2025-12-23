import type { Metadata } from "next";
import HoamClient from "./HoamClient";
import {
  generatePageMetadata,
  generateStructuredData,
  generatePageProductSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/generateMetadata";

// Enhanced SEO metadata for the hoam page
export const metadata: Metadata = generatePageMetadata("hoam");

// Structured Data for the Hoam page
const hoamSchema = generateStructuredData("hoam");

// Product Schema for modular houses
const productSchema = generatePageProductSchema({
  name: "®Hoam Modulhäuser",
  description: "Modulare Häuser mit individueller Gestaltung, nachhaltiger Bauweise und flexibler Architektur",
  category: "Modulhäuser",
  lowPrice: "177000",
  highPrice: "313000",
  offerCount: "3",
});

// Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema("hoam");

// Server Component - Can handle SEO, metadata, and structured data
export default function HoamPage() {
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
          __html: JSON.stringify(hoamSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <HoamClient />
    </>
  );
}



