import type { Metadata } from "next";
import AgbClient from "./AgbClient";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen | Hoam-House",
  description:
    "Allgemeine Geschäftsbedingungen der ®Hoam GmbH für den Verkauf modularer Häuser gemäß österreichischem Konsumentenschutzgesetz.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Allgemeine Geschäftsbedingungen | Hoam-House",
    description:
      "Allgemeine Geschäftsbedingungen der ®Hoam GmbH für den Verkauf modularer Häuser gemäß österreichischem Konsumentenschutzgesetz.",
    type: "website",
  },
};

export default function AgbPage() {
  return <AgbClient />;
}
