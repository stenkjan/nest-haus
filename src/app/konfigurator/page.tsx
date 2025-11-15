import type { Metadata } from "next";
import KonfiguratorClient from "./components/KonfiguratorClient";
import {
  generatePageMetadata,
  generateStructuredData,
} from "@/lib/seo/generateMetadata";
import { generateConfiguratorSchema } from "@/lib/seo/priceSchema";

// Dynamic SEO metadata for the configurator page
export const metadata: Metadata = generatePageMetadata("konfigurator");

// Dynamic structured data for the configurator
const configuratorSchema = generateStructuredData("konfigurator");
const enhancedConfiguratorSchema = generateConfiguratorSchema();

// MUST be dynamic for authentication to work
export const dynamic = "force-dynamic";

// Server Component - Can handle initial data fetching, SEO, etc.
export default function KonfiguratorPage() {
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
      <KonfiguratorClient />
    </>
  );
}
