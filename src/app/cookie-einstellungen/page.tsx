import type { Metadata } from "next";
import CookieEinstellungenClient from "./CookieEinstellungenClient";

export const metadata: Metadata = {
  title: "Cookie-Einstellungen | Hoam-House",
  description:
    "Verwalten Sie Ihre Cookie-Präferenzen und Datenschutzeinstellungen für die NEST-Haus Website.",
  robots: {
    index: false, // Don't index cookie settings page
    follow: true,
  },
};

export default function CookieEinstellungenPage() {
  return <CookieEinstellungenClient />;
}
