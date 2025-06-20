import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Nest-Haus | Modulare Häuser Konfigurator",
  description: "Konfigurieren Sie Ihr modulares Traumhaus mit unserem interaktiven Konfigurator. Personalisierte Häuser nach Ihren Wünschen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${inter.className} antialiased`}
      >
        <Navbar />
        <main className="pt-10">
          {children}
        </main>
      </body>
    </html>
  );
}
