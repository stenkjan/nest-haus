import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ImpressumClient from "./ImpressumClient";

export const metadata: Metadata = {
  title: "Impressum | NEST-Haus",
  description:
    "Impressum und rechtliche Informationen der NEST-Haus GmbH gemäß österreichischem E-Commerce-Gesetz.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Impressum | NEST-Haus",
    description:
      "Impressum und rechtliche Informationen der NEST-Haus GmbH gemäß österreichischem E-Commerce-Gesetz.",
    type: "website",
  },
};

export default async function ImpressumPage() {
  // Server-side authentication check
  const correctPassword = process.env.SITE_PASSWORD;

  if (correctPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-auth");

    if (!authCookie || authCookie.value !== correctPassword) {
      redirect("/auth?redirect=" + encodeURIComponent("/impressum"));
    }
  }

  return <ImpressumClient />;
}
