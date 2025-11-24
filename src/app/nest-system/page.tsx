import type { Metadata } from "next";
import NestSystemClient from "./NestSystemClient";
import {
  generatePageMetadata,
  generateStructuredData,
  generatePageServiceSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/generateMetadata";

// Enhanced SEO metadata for the nest-system page
export const metadata: Metadata = generatePageMetadata("nest-system");

// Structured Data for the Nest System page
const nestSystemSchema = generateStructuredData("nest-system");

// Service Schema for modular building system
const buildingSystemSchema = generatePageServiceSchema({
  name: "NEST-System Modulbau",
  description: "Modulares Bausystem für individuelle, nachhaltige und flexible Häuser",
  serviceType: "Modulbau und Bausystem",
});

// Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema("nest-system");

// Server Component - Can handle SEO, metadata, and structured data
export default function NestSystemPage() {
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
          __html: JSON.stringify(nestSystemSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildingSystemSchema),
        }}
      />
      <NestSystemClient />
    </>
  );
}
