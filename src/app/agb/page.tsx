import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AgbClient from "./AgbClient";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen | NEST-Haus",
  description:
    "Allgemeine Geschäftsbedingungen der NEST-Haus GmbH für den Verkauf modularer Häuser gemäß österreichischem Konsumentenschutzgesetz.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Allgemeine Geschäftsbedingungen | NEST-Haus",
    description:
      "Allgemeine Geschäftsbedingungen der NEST-Haus GmbH für den Verkauf modularer Häuser gemäß österreichischem Konsumentenschutzgesetz.",
    type: "website",
  },
};

export default async function AgbPage() {
  // Server-side authentication check
  const correctPassword = process.env.SITE_PASSWORD;

  if (correctPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-auth");

    if (!authCookie || authCookie.value !== correctPassword) {
      redirect("/auth?redirect=" + encodeURIComponent("/agb"));
    }
  }

  return <AgbClient />;
}
