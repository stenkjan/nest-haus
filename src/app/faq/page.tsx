import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FAQClient from "./FAQClient";

// Enhanced SEO metadata for the FAQ page
export const metadata: Metadata = {
  title: "Frequently Asked Questions | NEST-Haus",
  description:
    "Antworten auf häufig gestellte Fragen zu NEST-Haus. Informationen zu Bauablauf, Kosten, Konfiguration und mehr.",
  keywords:
    "nest haus faq, häufig gestellte fragen, bauablauf, kosten, konfiguration, modulhaus fragen",
  alternates: {
    canonical: "https://nest-haus.at/faq",
  },
  openGraph: {
    title: "NEST-Haus FAQ | Häufig gestellte Fragen",
    description:
      "Antworten auf häufig gestellte Fragen zu NEST-Haus. Informationen zu Bauablauf, Kosten, Konfiguration und mehr.",
    url: "https://nest-haus.at/faq",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Structured Data for FAQ Page
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "NEST-Haus Häufig gestellte Fragen",
  description: "Antworten auf häufig gestellte Fragen zu NEST-Haus",
  url: "https://nest-haus.at/faq",
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

