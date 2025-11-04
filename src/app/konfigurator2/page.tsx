import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
export default async function Konfigurator2Page() {
  // Server-side authentication check
  const correctPassword = process.env.SITE_PASSWORD;

  if (correctPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-auth");

    if (!authCookie || authCookie.value !== correctPassword) {
      redirect("/auth?redirect=" + encodeURIComponent("/konfigurator2"));
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
      <Konfigurator2Client />
    </>
  );
}



