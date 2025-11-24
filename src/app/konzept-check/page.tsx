import type { Metadata } from "next";
import KonzeptcheckClient from "./KonzeptcheckClient";
import {
  generatePageMetadata,
  generateStructuredData,
  generatePageServiceSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/generateMetadata";

// Enhanced SEO metadata for the konzept-check page
export const metadata: Metadata = generatePageMetadata("konzept-check");

// Structured Data for the Konzept-Check page
const konzeptcheckSchema = generateStructuredData("konzept-check");

// Service Schema for design services
const designServiceSchema = generatePageServiceSchema({
  name: "NEST-Haus Konzept-Check und Planungsberatung",
  description:
    "Professionelle Konzept-Check- und Planungsberatung für modulare Häuser",
  serviceType: "Hauskonzept und Planungsberatung",
});

// Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema("konzept-check");

// Server Component - Can handle SEO, metadata, and structured data
export default function KonzeptCheckPage() {
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
          __html: JSON.stringify(konzeptcheckSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(designServiceSchema),
        }}
      />
      <KonzeptcheckClient />
    </>
  );
}
