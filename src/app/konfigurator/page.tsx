import type { Metadata } from "next";
import KonfiguratorClient from "./components/KonfiguratorClient";
import { generatePageMetadata, generateStructuredData } from "@/lib/seo/generateMetadata";

// Dynamic SEO metadata for the configurator page
export const metadata: Metadata = generatePageMetadata('konfigurator');

// Dynamic structured data for the configurator
const configuratorSchema = generateStructuredData('konfigurator');

// Enable static generation for optimal SEO and performance
export const dynamic = "force-static";

// Generate static params for SEO optimization
export async function generateStaticParams() {
  // Return empty array for static generation without dynamic params
  return [];
}

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
      <KonfiguratorClient />
    </>
  );
}
