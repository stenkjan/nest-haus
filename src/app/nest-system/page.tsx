import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NestSystemClient from "./NestSystemClient";

// Enhanced SEO metadata for the nest-system page
export const metadata: Metadata = {
  title: "Nest System | NEST-Haus | Dein modulares Bausystem",
  description:
    "Das NEST-System: Entdecke unser modulares Bausystem mit individueller Gestaltung, nachhaltigen Materialien und flexibler Architektur für dein Traumhaus.",
  keywords:
    "nest system, modulbau, bausystem, modulhaus system, nachhaltig bauen, flexible architektur, nest haus system",
  alternates: {
    canonical: "https://nest-haus.at/nest-system",
  },
  openGraph: {
    title: "Nest System | NEST-Haus | Dein modulares Bausystem",
    description:
      "Das NEST-System: Entdecke unser modulares Bausystem mit individueller Gestaltung und nachhaltigen Materialien.",
    url: "https://nest-haus.at/nest-system",
    images: [
      {
        url: "/images/nest-system-hero.jpg",
        width: 1200,
        height: 630,
        alt: "NEST-Haus System - Modulares Bausystem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nest System | NEST-Haus | Dein modulares Bausystem",
    description:
      "Das NEST-System: Entdecke unser modulares Bausystem mit individueller Gestaltung und nachhaltigen Materialien.",
    images: ["/images/nest-system-twitter.jpg"],
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

// Structured Data for the Nest System page
const nestSystemSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Nest System - NEST-Haus",
  description:
    "Das NEST-System: Modulares Bausystem mit individueller Gestaltung, nachhaltigen Materialien und flexibler Architektur",
  url: "https://nest-haus.at/nest-system",
  mainEntity: {
    "@type": "Product",
    name: "NEST-System Modulbau",
    description: "Modulares Bausystem für individuelle und nachhaltige Häuser",
    brand: {
      "@type": "Brand",
      name: "NEST-Haus",
    },
  },
};

// Service Schema for modular building system
const buildingSystemSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "NEST-System Modulbau",
  description:
    "Modulares Bausystem für individuelle, nachhaltige und flexible Häuser",
  provider: {
    "@type": "Organization",
    name: "NEST-Haus",
  },
  serviceType: "Modulbau und Bausystem",
  areaServed: {
    "@type": "Country",
    name: "Austria",
  },
};

// Server Component - Can handle SEO, metadata, and structured data
export default async function NestSystemPage() {
  // Server-side authentication check
  const correctPassword = process.env.SITE_PASSWORD;

  if (correctPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-auth");

    if (!authCookie || authCookie.value !== correctPassword) {
      redirect("/auth?redirect=" + encodeURIComponent("/nest-system"));
    }
  }

  return (
    <>
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
