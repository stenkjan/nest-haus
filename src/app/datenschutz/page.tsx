import type { Metadata } from "next";
import DatenschutzClient from "./DatenschutzClient";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Nest-Haus",
  description:
    "Datenschutzerklärung und Informationen zur Verarbeitung personenbezogener Daten bei NEST-Haus gemäß DSGVO.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Datenschutzerklärung | Nest-Haus",
    description:
      "Datenschutzerklärung und Informationen zur Verarbeitung personenbezogener Daten bei NEST-Haus gemäß DSGVO.",
    type: "website",
  },
};

export default function DatenschutzPage() {
  return <DatenschutzClient />;
}
