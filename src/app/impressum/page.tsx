import type { Metadata } from "next";
import ImpressumClient from "./ImpressumClient";

export const metadata: Metadata = {
  title: "Impressum | Nest-Haus",
  description:
    "Impressum und rechtliche Informationen der NEST-Haus GmbH gemäß österreichischem E-Commerce-Gesetz.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Impressum | Nest-Haus",
    description:
      "Impressum und rechtliche Informationen der NEST-Haus GmbH gemäß österreichischem E-Commerce-Gesetz.",
    type: "website",
  },
};

export default function ImpressumPage() {
  return <ImpressumClient />;
}
