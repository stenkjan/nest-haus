"use client";

import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Clean footer structure without functional links
  const footerColumns = [
    {
      title: "Mit uns Bauen",
      items: [
        "Der Konfigurator",
        "Unsere Angebote",
        "Finanzierung",
        "Rechtliches",
      ],
    },
    {
      title: "Warum Wir",
      items: ["Deine Vorteile", "Funktionsweise", "Nachhaltigkeit", "Qualität"],
    },
    {
      title: "Unsere Services",
      items: ["Die Pakete", "Beratungen", "Finanzierung", "Support"],
    },
    {
      title: "Unternehmen",
      items: ["Über uns", "Team", "Karriere", "Presse"],
    },
    {
      title: "Kontakt",
      items: ["Beratung", "Support", "Standorte", "Newsletter"],
    },
  ];

  return (
    <footer className="bg-white text-gray-700 mt-auto" role="contentinfo">
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
                    <span className="text-[clamp(12px,2.2vw,14px)] text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">
                      {item}
                    </span>
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
