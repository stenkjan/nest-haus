import type { Metadata } from "next";
import DatenschutzClient from "./DatenschutzClient";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Hoam-House",
  description:
    "Datenschutzerklärung und Informationen zur Verarbeitung personenbezogener Daten bei ®Hoam gemäß DSGVO.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Datenschutzerklärung | Hoam-House",
    description:
      "Datenschutzerklärung und Informationen zur Verarbeitung personenbezogener Daten bei ®Hoam gemäß DSGVO.",
    type: "website",
  },
};

export default function DatenschutzPage() {
  return <DatenschutzClient />;
}
