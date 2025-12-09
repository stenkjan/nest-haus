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
      title: "Überblick",
      items: [
        { text: "Home", href: "/#dein-nest-haus" },
        { text: "Kontakt", href: "/kontakt" },
        { text: "Konfigurator", href: "/konfigurator" },
        { text: "Warenkorb", href: "/warenkorb?mode=konzept-check" },
        { text: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Dein Nest",
      items: [
        { text: "Preise", href: "/dein-nest#dein-nest-preise" },
        { text: "Position am Markt", href: "/dein-nest#position-am-markt" },
        { text: "Haus Konfigurator", href: "/dein-nest#haus-konfiguraton" },
        { text: "Vorteile", href: "/dein-nest#vorteile-nest" },
        { text: "Transportabilität", href: "/dein-nest#transport" },
      ],
    },
    {
      title: "Konzept-Check",
      items: [
        { text: "Konzept-Check", href: "/konzept-check#schritte" },
        { text: "Grundstücks-Check", href: "/konzept-check#grundstueckscheck" },
        { text: "Entwurfplan", href: "/konzept-check#entwurfsplan" },
        { text: "Der Ablauf", href: "/konzept-check#anleitung" },
        { text: "FAQ", href: "/konzept-check#faq" },
      ],
    },
    {
      title: "Nest System",
      items: [
        { text: "Unsere Technik", href: "/nest-system#unsere-technik" },
        { text: "Materialien", href: "/nest-system#materialien" },
        { text: "Fenster & Türen", href: "/nest-system#fenster-tueren" },
        { text: "Individualisierung", href: "/nest-system#individualisierung" },
        { text: "Haustechnik", href: "/nest-system#haustechnik" },
        { text: "Modulerweiterung", href: "/nest-system#modulerweiterung" },
      ],
    },
    {
      title: "Warum Wir?",
      items: [
        { text: "Wir sind Nest", href: "/warum-wir#wir-sind-nest" },
        { text: "Verlässlichkeit", href: "/warum-wir#verlaesslichkeit" },
        { text: "Unser Team", href: "/warum-wir#unser-team" },
        { text: "Unsere Partner", href: "/warum-wir#unser-partner" },
        { text: "Unsere Zukunft", href: "/warum-wir#innovation" },
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
              Copyright © {currentYear} Nest-Haus. Alle Rechte vorbehalten.
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
