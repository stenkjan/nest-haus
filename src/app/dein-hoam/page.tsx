import type { Metadata } from "next";
import DeinHoamClient from "./DeinHoamClient";
import {
  generatePageMetadata,
  generateStructuredData,
  generatePageProductSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/generateMetadata";

// Enhanced SEO metadata for the dein-hoam page
export const metadata: Metadata = generatePageMetadata("dein-hoam");

// Structured Data for the Dein Hoam page
const deinHoamSchema = generateStructuredData("dein-hoam");

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
const breadcrumbSchema = generateBreadcrumbSchema("dein-hoam");

// Server Component - Can handle SEO, metadata, and structured data
export default function DeinHoamPage() {
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
          __html: JSON.stringify(deinHoamSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <DeinHoamClient />
    </>
  );
}

