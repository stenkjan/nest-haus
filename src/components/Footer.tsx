"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LandingImagesCarousel from "./sections/LandingImagesCarousel";
import { GetInContactBanner } from "./sections/GetInContactBanner";

export default function Footer() {
  const pathname = usePathname();
  const hideContactBanner = pathname === "/kontakt";
  const currentYear = new Date().getFullYear();

  // Footer structure with navigation links
  const footerColumns = [
    {
      title: "Überblick",
      items: [
        { text: "Home", href: "/#hoam-house" },
        { text: "Kontakt", href: "/kontakt" },
        { text: "Konfigurator", href: "/konfigurator" },
        { text: "Warenkorb", href: "/warenkorb?mode=konzept-check" },
        { text: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "®Hoam",
      items: [
        { text: "Preise", href: "/hoam#preise" },
        { text: "Position am Markt", href: "/hoam#position-am-markt" },
        { text: "Haus Konfigurator", href: "/hoam#haus-konfiguraton" },
        { text: "Vorteile", href: "/hoam#vorteile-hoam" },
        { text: "Transportabilität", href: "/hoam#transport" },
      ],
    },
    {
      title: "Konzept-Check",
      items: [
        { text: "Einstieg", href: "/konzept-check#schritte" },
        {
          text: "Grundstücksanalyse",
          href: "/konzept-check#grundstueckscheck",
        },
        { text: "Entwurfplan", href: "/konzept-check#entwurfsplan" },
        { text: "Kostenplanung", href: "/konzept-check#kostenplanung" },
        { text: "Der Ablauf", href: "/konzept-check#anleitung" },
      ],
    },
    {
      title: "Hoam System",
      items: [
        { text: "Unsere Technik", href: "/hoam-system#unsere-technik" },
        { text: "Materialien", href: "/hoam-system#materialien" },
        { text: "Fenster & Türen", href: "/hoam-system#fenster-tueren" },
        { text: "Individualisierung", href: "/hoam-system#individualisierung" },
        { text: "Modulerweiterung", href: "/hoam-system#modulerweiterung" },
      ],
    },
    {
      title: "Warum Wir?",
      items: [
        { text: "Wir sind ®Hoam", href: "/warum-wir#wir-sind-hoam" },
        { text: "Verlässlichkeit", href: "/warum-wir#verlaesslichkeit" },
        { text: "Unser Team", href: "/warum-wir#unser-team" },
        { text: "Unsere Partner", href: "/warum-wir#unsere-partner" },
        { text: "Unsere Zukunft", href: "/warum-wir#innovation" },
      ],
    },
  ];

  return (
    <footer className="bg-[#F4F4F4] text-gray-700 mt-auto" role="contentinfo">
      {/* Get In Contact Banner - Above Footer */}
      {!hideContactBanner && <GetInContactBanner />}

      {/* Image Carousel Section */}
      <div className="bg-white">
        <h3 className="h3-secondary text-center text-black px-4 mb-0">
          Lass dich inspirieren und entdecke die Vielfalt unserer zahlreichen
          Konfigurationen
        </h3>
        <LandingImagesCarousel 
          backgroundColor="white" 
          maxWidth={false} 
          forceDesktopImages={true} 
        />
      </div>

      {/* Main footer content */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-12 lg:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {footerColumns.map((column, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-[clamp(14px,2.5vw,16px)] font-medium tracking-[-0.015em] text-black mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3" role="list">
                {column.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className="text-[clamp(12px,2.2vw,14px)] text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200"></div>
      </div>

      {/* Bottom footer */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-[clamp(12px,2.2vw,14px)] text-gray-500 space-y-4 md:space-y-0">
          <div>
            <p>Copyright © {currentYear} Hoam-House. Alle Rechte vorbehalten.</p>
          </div>

          <div className="flex space-x-6">
            <a
              href="/datenschutz"
              className="hover:text-gray-700 cursor-pointer transition-colors"
            >
              Datenschutz
            </a>
            <a
              href="/impressum"
              className="hover:text-gray-700 cursor-pointer transition-colors"
            >
              Impressum
            </a>
            <a
              href="/agb"
              className="hover:text-gray-700 cursor-pointer transition-colors"
            >
              AGB
            </a>
          </div>

          <div>
            <p className="font-medium">Österreich {currentYear}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
