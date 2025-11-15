"use client";

import React from "react";
import Link from "next/link";
import LandingImagesCarousel from "./sections/LandingImagesCarousel";
import { GetInContactBanner } from "./sections/GetInContactBanner";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Footer structure with navigation links
  const footerColumns = [
    {
      title: "Home",
      items: [
        { text: "Galerie", href: "/" },
        { text: "Dein Nest entdecken", href: "/dein-nest" },
        { text: "Entwurf", href: "/entwurf" },
        { text: "Terminvereinbarung", href: "/kontakt" },
        { text: "Warum Wir?", href: "/warum-wir" },
      ],
    },
    {
      title: "Dein Nest",
      items: [
        { text: "Preise", href: "/dein-nest" },
        { text: "Intro Nest", href: "/dein-nest" },
        { text: "Position am Markt", href: "/dein-nest" },
        { text: "Haus Konfigurator", href: "/konfigurator" },
      ],
    },
    {
      title: "Entwurf",
      items: [
        { text: "Entwurf", href: "/entwurf" },
        { text: "Beispiele", href: "/entwurf" },
        { text: "Grundstücks-Check", href: "/entwurf" },
        { text: "Anleitung", href: "/entwurf" },
        { text: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Nest System",
      items: [
        { text: "Unsere Technik", href: "/kontakt" },
        { text: "Materialien", href: "/nest-system" },
        { text: "Fenster & Türen", href: "/kontakt" },
        { text: "Individualisierung", href: "/nest-system" },
        { text: "Haustechnik", href: "/nest-system" },
        { text: "Modulweiterung", href: "/nest-system" },
      ],
    },
    {
      title: "Kontakt",
      items: [
        { text: "Terminvereinbarung", href: "/kontakt" },
        { text: "Warum Wir?", href: "/warum-wir" },
        { text: "Wo du uns findest", href: "/kontakt" },
        { text: "FAQ", href: "/faq" },
        { text: "Anschrift", href: "/kontakt" },
      ],
    },
  ];

  return (
    <footer className="bg-[#F4F4F4] text-gray-700 mt-auto" role="contentinfo">
      {/* Get In Contact Banner - Above Footer */}
      <GetInContactBanner />

      {/* Image Carousel Section */}
      <div className="bg-white">
        <h3 className="h3-secondary text-center text-black px-4 mb-0">
          Lass dich inspirieren und entdecke die Vielfalt unserer zahlreichen
          Konfigurationen
        </h3>
        <LandingImagesCarousel backgroundColor="white" maxWidth={false} />
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
            <p>
              Copyright © {currentYear} NEST-Haus. Alle Rechte vorbehalten.
            </p>
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
