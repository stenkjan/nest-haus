import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DatenschutzClient from "./DatenschutzClient";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | NEST-Haus",
  description:
    "Datenschutzerklärung und Informationen zur Verarbeitung personenbezogener Daten bei NEST-Haus gemäß DSGVO.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Datenschutzerklärung | NEST-Haus",
    description:
      "Datenschutzerklärung und Informationen zur Verarbeitung personenbezogener Daten bei NEST-Haus gemäß DSGVO.",
    type: "website",
  },
};

export default async function DatenschutzPage() {
  // Server-side authentication check
  const correctPassword = process.env.SITE_PASSWORD;

  if (correctPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-auth");

    if (!authCookie || authCookie.value !== correctPassword) {
      redirect("/auth?redirect=" + encodeURIComponent("/datenschutz"));
    }
  }

  return <DatenschutzClient />;
}
