import type { Metadata } from "next";
import HoamSystemClient from "./HoamSystemClient";
import {
  generatePageMetadata,
  generateStructuredData,
  generatePageServiceSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/generateMetadata";

// Enhanced SEO metadata for the hoam-system page
export const metadata: Metadata = generatePageMetadata("hoam-system");

// Structured Data for the Hoam System page
const hoamSystemSchema = generateStructuredData("hoam-system");

// Service Schema for modular building system
const buildingSystemSchema = generatePageServiceSchema({
  name: "Hoam System Modulbau",
  description: "Modulares Bausystem für individuelle, nachhaltige und flexible Häuser",
  serviceType: "Modulbau und Bausystem",
});

// Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema("hoam-system");

// Server Component - Can handle SEO, metadata, and structured data
export default function HoamSystemPage() {
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
          __html: JSON.stringify(hoamSystemSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildingSystemSchema),
        }}
      />
      <HoamSystemClient />
    </>
  );
}

