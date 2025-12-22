import type { Metadata } from "next";
import ImpressumClient from "./ImpressumClient";

export const metadata: Metadata = {
  title: "Impressum | Hoam-House",
  description:
    "Impressum und rechtliche Informationen der ®Hoam GmbH gemäß österreichischem E-Commerce-Gesetz.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Impressum | Hoam-House",
    description:
      "Impressum und rechtliche Informationen der ®Hoam GmbH gemäß österreichischem E-Commerce-Gesetz.",
    type: "website",
  },
};

export default function ImpressumPage() {
  return <ImpressumClient />;
}
