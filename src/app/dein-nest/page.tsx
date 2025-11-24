import type { Metadata } from "next";
import DeinNestClient from "./DeinNestClient";
import {
  generatePageMetadata,
  generateStructuredData,
  generatePageProductSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/generateMetadata";

// Enhanced SEO metadata for the dein-nest page
export const metadata: Metadata = generatePageMetadata("dein-nest");

// Structured Data for the Dein Nest page
const deinNestSchema = generateStructuredData("dein-nest");

// Product Schema for modular houses
const productSchema = generatePageProductSchema({
  name: "NEST-Haus Modulhäuser",
  description: "Modulare Häuser mit individueller Gestaltung, nachhaltiger Bauweise und flexibler Architektur",
  category: "Modulhäuser",
  lowPrice: "177000",
  highPrice: "313000",
  offerCount: "3",
});

// Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema("dein-nest");

// Server Component - Can handle SEO, metadata, and structured data
export default function DeinNestPage() {
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
          __html: JSON.stringify(deinNestSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <DeinNestClient />
    </>
  );
}
