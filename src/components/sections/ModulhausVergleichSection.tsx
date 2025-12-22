"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

/**
 * Blue checkmark bullet - for included/granted features
 */
const CheckmarkBullet = () => (
  <svg
    className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="12" cy="9" r="8" fill="#3d6ce1" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.0}
      stroke="white"
      d="M8 9l3 3 5-6"
    />
  </svg>
);

/**
 * Grey circle bullet - for non-granted/optional features
 */
const CircleBullet = () => (
  <svg
    className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="12" cy="9" r="8" stroke="#9CA3AF" strokeWidth="2" fill="none" />
  </svg>
);

// Content data - Single source of truth
const boxesData = [
  {
    id: 1,
    label: "Für Abenteurer",
    title: "Tiny House",
    items: [
      { type: "check", text: "Kompakt und Mobil" },
      { type: "check", text: "Niedrige Kosten" },
      { type: "circle", text: "Unkomfortables Wohnen" },
      { type: "circle", text: "Wenig architektonische Qualität" },
      { type: "circle", text: "Platzbedarf" },
    ],
  },
  {
    id: 2,
    label: "Für Vernünftige",
    title: "Fertigteilhaus",
    items: [
      { type: "check", text: "Komfortables Wohnen" },
      { type: "check", text: "Transparente Planung" },
      { type: "check", text: "Schnelle Bauzeiten" },
      { type: "circle", text: "Meist minderwärtige Qualität" },
      { type: "circle", text: "Versteckte Kosten für Individualität" },
      { type: "circle", text: "Bindung über Jahrzehnte" },
      { type: "circle", text: "Reduzierte Standards für niedrigere Kosten" },
      { type: "circle", text: "Keine Individualität" },
    ],
  },
  {
    id: 3,
    label: "Für Vorrausdenker",
    title: "®Hoam Haus",
    hasButton: true,
    hasBorder: true,
    items: [
      { type: "check", text: "Hohe Qualitäts-Standards" },
      { type: "check", text: "Individuelle Grundrissgestaltung" },
      { type: "check", text: "Transparente Bau-und Lieferzeit" },
      { type: "check", text: "Transparenter Preis" },
      { type: "check", text: "Architektonische Atmosphäre" },
      { type: "check", text: "Langlebige Bauweise" },
      { type: "check", text: "Auf- und Abbaubar" },
      { type: "check", text: "Vernünftig wie ein Fertighaus" },
      { type: "check", text: "Hochwertig wie ein Architektenhaus" },
    ],
  },
];

// Reusable Box Component
interface BoxProps {
  data: (typeof boxesData)[0];
  layout: "mobile" | "desktop";
}

const Box: React.FC<BoxProps> = ({ data, layout }) => {
  const spacing = layout === "mobile" ? "space-y-" : "space-y-1";
  const minHeight = layout === "mobile" ? "min-h-[200px]" : "min-h-[200px]";
  const borderClass = data.hasBorder ? "border-2 border-[#3D6DE1]" : "";

  return (
    <div
      className={`bg-white rounded-3xl p-8 ${borderClass} ${layout === "mobile" ? minHeight : `flex flex-col ${minHeight}`}`}
    >
      <p className="p-primary-small text-gray-600">{data.label}</p>
      <div className="h-16 md:h-20 lg:h-24 flex items-start">
        <h3 className="h3-secondary text-black">{data.title}</h3>
      </div>

      {/* Spacer between title and bullet points */}

      <ul className={`${spacing} mb-6 ${layout === "desktop" ? "flex-1" : ""}`}>
        {data.items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            {item.type === "check" ? <CheckmarkBullet /> : <CircleBullet />}
            <span
              className={`p-primary-small ${
                item.type === "check" ? "text-black" : "text-[#9CA3AF]"
              }`}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
      {data.hasButton && (
        <div className="flex justify-center mt-0">
          <Link href="/konzept-check">
            <Button variant="primary" size="xs">
              Konzept-Check
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

/**
 * ModulhausVergleichSection - Three Options Section
 *
 * Displays three service options in responsive layouts:
 * - Mobile/Tablet (< 1024px): Stacked vertically with title on top
 * - Desktop lg (1024px-1439px): Title on top, boxes in 3 columns
 * - Desktop xl+ (≥ 1440px): Title on left, boxes in 3 columns on right
 */
export default function ModulhausVergleichSection() {
  return (
    <section className="w-full bg-[#f4f4f4]">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-12 lg:px-12">
        {/* Mobile/Tablet Layout (< 1024px) - Stacked */}
        <div className="lg:hidden">
          {/* Header Section */}
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="h2-title text-black mb-3 md:mb-4">
              Die smarte Wahl treffen
            </h2>
            <p className="p-primary text-black">Weniger Kompromiss Mehr Nest</p>
          </div>

          {/* Three Boxes Stacked */}
          <div className="max-w-4xl mx-auto space-y-3">
            {boxesData.map((box) => (
              <Box key={box.id} data={box} layout="mobile" />
            ))}
          </div>
        </div>

        {/* Desktop lg Layout (1024px-1439px) - Title on top, boxes below */}
        <div className="hidden lg:block xl:hidden">
          {/* Header Section */}
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="h2-title text-black mb-3 md:mb-4">
              Die smarte Wahl treffen
            </h2>
            <p className="p-primary text-black">Weniger Kompromiss Mehr Nest</p>
          </div>

          {/* Three Boxes in Grid */}
          <div className="grid grid-cols-3 gap-3">
            {boxesData.map((box) => (
              <Box key={box.id} data={box} layout="desktop" />
            ))}
          </div>
        </div>

        {/* Desktop xl+ Layout (≥ 1440px) - Title on left, boxes on right */}
        <div className="hidden xl:flex xl:gap-16">
          {/* Left Column - Title and Text */}
          <div className="xl:w-1/4 flex flex-col">
            <div className="max-w-[300px] pr-8">
              <h2 className="h2-title text-black mb-3 md:mb-4">
                Die smarte Wahl treffen
              </h2>
              <p className="p-primary text-black">
                Weniger Kompromiss Mehr Nest
              </p>
            </div>
          </div>

          {/* Right Column - Three Boxes */}
          <div className="xl:flex-1 grid grid-cols-3 gap-3">
            {boxesData.map((box) => (
              <Box key={box.id} data={box} layout="desktop" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
