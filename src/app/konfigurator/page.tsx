import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

// Enable static generation for optimal SEO and performance
export const dynamic = "force-static";

// Generate static params for SEO optimization
export async function generateStaticParams() {
  // Return empty array for static generation without dynamic params
  return [];
}

// Server Component - Can handle initial data fetching, SEO, etc.
export default async function KonfiguratorPage() {
  // Server-side authentication check
  const correctPassword = process.env.SITE_PASSWORD;

  if (correctPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-auth");

    if (!authCookie || authCookie.value !== correctPassword) {
      redirect("/auth?redirect=" + encodeURIComponent("/konfigurator"));
    }
  }

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
