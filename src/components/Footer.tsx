"use client";

import React from "react";
import Link from "next/link";
import LandingImagesCarousel from "./sections/LandingImagesCarousel";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Footer structure with navigation links
  const footerColumns = [
    {
      title: "Mit uns Bauen",
      items: [
        { text: "Der Konfigurator", href: "/konfigurator" },
        { text: "Unsere Angebote", href: "/warenkorb" },
        { text: "Finanzierung", href: "/warenkorb" },
        { text: "Rechtliches", href: "/warenkorb" },
      ],
    },
    {
      title: "Warum Wir",
      items: [
        { text: "Deine Vorteile", href: "/dein-nest" },
        { text: "Funktionsweise", href: "/dein-nest" },
        { text: "Nachhaltigkeit", href: "/dein-nest" },
        { text: "Qualität", href: "/dein-nest" },
      ],
    },
    {
      title: "Unsere Services",
      items: [
        { text: "Die Pakete", href: "/entwurf" },
        { text: "Beratungen", href: "/entwurf" },
        { text: "Finanzierung", href: "/entwurf" },
        { text: "Support", href: "/entwurf" },
      ],
    },
    {
      title: "Unternehmen",
      items: [
        { text: "Über uns", href: "/warum-wir" },
        { text: "Team", href: "/warum-wir" },
        { text: "Karriere", href: "/warum-wir" },
        { text: "Presse", href: "/warum-wir" },
      ],
    },
    {
      title: "Kontakt",
      items: [
        { text: "Beratung", href: "/kontakt" },
        { text: "Support", href: "/kontakt" },
        { text: "Standorte", href: "/kontakt" },
        { text: "Newsletter", href: "/kontakt" },
      ],
    },
  ];

  return (
    <footer className="bg-[#F4F4F4] text-gray-700 mt-auto" role="contentinfo">
      {/* Image Carousel Section - Hidden on mobile */}
      <div className="hidden md:block bg-white">
        <h3 className="h3-secondary text-center text-black">
          Lass dich inspirieren und entdecke die Vielfalt unserer zahlreichen
          Konfigurationen
        </h3>
        <LandingImagesCarousel backgroundColor="white" maxWidth={false} />
      </div>

      {/* Main footer content */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
