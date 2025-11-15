import type { Metadata } from "next";
import Konfigurator2Client from "./components/Konfigurator2Client";
import {
  generatePageMetadata,
  generateStructuredData,
} from "@/lib/seo/generateMetadata";
import { generateConfiguratorSchema } from "@/lib/seo/priceSchema";

// Dynamic SEO metadata for the simplified configurator page
export const metadata: Metadata = generatePageMetadata("konfigurator");

// Dynamic structured data for the configurator
const configuratorSchema = generateStructuredData("konfigurator");
const enhancedConfiguratorSchema = generateConfiguratorSchema();

// MUST be dynamic for authentication to work
export const dynamic = "force-dynamic";

// Server Component - Simplified version of konfigurator
export default function Konfigurator2Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(configuratorSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(enhancedConfiguratorSchema),
        }}
      />
      <Konfigurator2Client />
    </>
  );
}



