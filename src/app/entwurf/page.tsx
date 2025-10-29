import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EntwurfClient from "./EntwurfClient";

// Enhanced SEO metadata for the entwurf page
export const metadata: Metadata = {
  title: "Entwurf | NEST-Haus | Dein Hausentwurf beginnt hier",
  description:
    "Dein NEST-Haus Entwurf: Entdecke unsere Beratung, Planungsunterstützung und den Weg zu deinem individuellen modularen Hausentwurf.",
  keywords:
    "entwurf, nest haus entwurf, modulhaus planung, hausentwurf, nest haus design, professioneller hausentwurf, modulhaus entwurf",
  alternates: {
    canonical: "https://nest-haus.at/entwurf",
  },
  openGraph: {
    title: "Entwurf | NEST-Haus | Dein Hausentwurf beginnt hier",
    description:
      "Dein NEST-Haus Entwurf: Entdecke unsere Beratung und Planungsunterstützung.",
    url: "https://nest-haus.at/entwurf",
    images: [
      {
        url: "/images/entwurf-hero.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus Entwurf - Beratung und Planungsunterstützung",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Entwurf | NEST-Haus | Dein Hausentwurf beginnt hier",
    description:
      "Dein NEST-Haus Entwurf: Entdecke unsere Beratung und Planungsunterstützung.",
    images: ["/images/entwurf-twitter.jpg"],
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

// Structured Data for the Entwurf page
const entwurfSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Entwurf - NEST-Haus",
  description:
    "Dein NEST-Haus Entwurf - Beratung, Planungsunterstützung und professionelle Begleitung für deinen Hausentwurf",
  url: "https://nest-haus.at/entwurf",
  mainEntity: {
    "@type": "Service",
    name: "NEST-Haus Entwurf und Beratung",
    description:
      "Professionelle Beratung und Unterstützung für deinen individuellen Hausentwurf",
    provider: {
      "@type": "Organization",
      name: "NEST-Haus",
    },
  },
};

// Service Schema for design services
const designServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "NEST-Haus Entwurf und Planungsberatung",
  description:
    "Professionelle Entwurfs- und Planungsberatung für modulare Häuser",
  provider: {
    "@type": "Organization",
    name: "NEST-Haus",
  },
  serviceType: "Hausentwurf und Planungsberatung",
  areaServed: {
    "@type": "Country",
    name: "Austria",
  },
};

// Server Component - Can handle SEO, metadata, and structured data
export default async function EntwurfPage() {
  // Server-side authentication check
  const correctPassword = process.env.SITE_PASSWORD;

  if (correctPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-auth");

    if (!authCookie || authCookie.value !== correctPassword) {
      redirect("/auth?redirect=" + encodeURIComponent("/entwurf"));
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(entwurfSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(designServiceSchema),
        }}
      />
      <EntwurfClient />
    </>
  );
}
