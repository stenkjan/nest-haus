import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FAQClient from "./FAQClient";
import { generatePageMetadata, SEO_CONFIG } from "@/lib/seo/generateMetadata";

// Use centralized SEO metadata configuration
export const metadata = generatePageMetadata("faq");

// Structured Data for FAQ Page
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "NEST-Haus Häufig gestellte Fragen",
  description: "Antworten auf häufig gestellte Fragen zu NEST-Haus",
  url: `${SEO_CONFIG.baseUrl}/faq`,
};

// Server Component
export default async function FAQPage() {
  // Server-side authentication check
  const correctPassword = process.env.SITE_PASSWORD;

  if (correctPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-auth");

    if (!authCookie || authCookie.value !== correctPassword) {
      redirect("/auth?redirect=" + encodeURIComponent("/faq"));
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <FAQClient />
    </>
  );
}

