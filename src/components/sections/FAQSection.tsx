"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui";
import Link from "next/link";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  faqItems?: FAQItem[];
}

const defaultFAQItems: FAQItem[] = [
  {
    id: 1,
    question:
      "Was genau ist ein Nest Haus und wie unterscheidet es sich von einem Fertigteilhaus, Tiny House oder Architektenhaus?",
    answer:
      "Das Nest Haus versucht durch optimierte Produktionsbedingungen eine enorm hohe Qualität – vergleichbar mit Luxus-Architektenhäusern – leistbar zu machen. Darüber hinaus ermöglichen wir trotz Standardisierung weiterhin individuelle Gestaltungsmöglichkeiten bei der Raumaufteilung und Grundrissplanung. Die hochpräzise Produktion macht es uns möglich, die Module so passgenau zu fertigen, dass sie mehrmals zusammen- und wieder auseinandergebaut werden können. Dadurch entsteht eine Flexibilität ähnlich wie bei einem Tiny House: Du kannst flexibel bleiben und dein Haus mitnehmen, erweitern oder verkaufen. Das Grundstück bleibt dabei stets unabhängig vom Haus.",
  },
  {
    id: 2,
    question: "Was ist der Konzept-Check?",
    answer:
      "Mit dem Konzept-Check erhältst du deine Grundstücksanalyse, einen individuellen Entwurfsplan sowie eine konkrete Kosten- und Zeitplanung. Solltest du dich gegen den Bau deines Nest Hauses entscheiden, kannst du die Grundstücksanalyse auch für andere Bauvorhaben verwenden.",
  },
  {
    id: 3,
    question:
      "Fenster und Türen – warum sind keine Fenster im Konfigurator zu sehen?",
    answer:
      "Alle Fenster und Türen werden bei uns individuell mit dir gemeinsam und passend zu deinem Grundriss gestaltet. Wir positionieren diese perfekt nach den örtlichen Gegebenheiten, idealer Himmelsausrichtung, Belichtungssituation und deinen persönlichen Präferenzen.",
  },
  {
    id: 4,
    question: "Was kostet ein Nest Haus?",
    answer:
      "Der exakte Preis ist abhängig von deinem individuellen Nest-Entwurf. Diesen arbeiten wir gemeinsam im Konzept-Check aus. Danach erhältst du ein konkretes Angebot für Dein ®Hoam.",
  },
];

export default function FAQSection({
  title = "Klarheit an erster Stelle",
  description = "Antworten auf  häufig gestellte Fragen",
  buttonText = "Zu den FAQs",
  buttonLink = "/faq",
  faqItems = defaultFAQItems,
}: FAQSectionProps) {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set([2])); // Start with second question open
  const [, forceUpdate] = useState(0);
  const contentRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const toggleFAQ = (id: number) => {
    setOpenIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    // Force a re-render after a short delay to recalculate heights
    setTimeout(() => forceUpdate((prev) => prev + 1), 10);
  };

  // Get dynamic height for each answer
  const getContentHeight = (id: number): number => {
    const element = contentRefs.current.get(id);
    if (!element) return 1000; // Default large height if not measured yet

    // Get the actual scrollHeight
    const height = element.scrollHeight;
    return height > 0 ? height : 1000; // Use 1000px as fallback
  };

  // Render FAQ item component (reused for both layouts)
  const renderFAQItem = (item: FAQItem) => {
    const isOpen = openIds.has(item.id);

    return (
      <div key={item.id} className="bg-white rounded-2xl overflow-hidden">
        {/* Question Header */}
        <button
          onClick={() => toggleFAQ(item.id)}
          className="w-full px-3 sm:px-6 py-4 sm:py-2 flex items-center justify-between bg-white transition-colors duration-200"
          aria-expanded={isOpen}
        >
          <span className="text-left p-primary font-medium text-black pr-4">
            {item.question}
          </span>

          {/* Arrow Icon with Circle Background */}
          <div
            className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f4f4f4] flex items-center justify-center transition-transform duration-300 ${
              isOpen ? "rotate-90" : ""
            }`}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>

        {/* Answer Content with measured height */}
        <div
          style={{
            maxHeight: isOpen ? `${getContentHeight(item.id)}px` : "0px",
            transition: "max-height 300ms ease-in-out",
          }}
          className="overflow-hidden"
        >
          <div
            ref={(el) => {
              if (el) {
                contentRefs.current.set(item.id, el);
              }
            }}
            className="px-4 sm:px-6 pb-4 sm:pb-5"
          >
            <p className="p-primary-small text-gray-700">{item.answer}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full py-8 md:py-16 bg-[#f4f4f4]">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-12 lg:px-12">
        {/* Mobile/Tablet Layout (< 1024px) - Stacked */}
        <div className="lg:hidden">
          {/* Header Section */}
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="h2-title text-black mb-3 md:mb-4 whitespace-pre-line">
              {title}
            </h2>
            {description && (
              <p className="p-primary text-black hidden">{description}</p>
            )}
          </div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto space-y-3">
            {faqItems.map(renderFAQItem)}
          </div>

          {/* Button at the bottom */}
          <div className="mt-8 md:mt-12 flex justify-center">
            <Link href={buttonLink}>
              <Button variant="primary" size="xs">
                {buttonText}
              </Button>
            </Link>
          </div>
        </div>

        {/* Desktop Layout (>= 1024px) - Side by Side */}
        <div className="hidden lg:flex lg:gap-12 xl:gap-16">
          {/* Left Column - Title and Button */}
          <div className="lg:w-1/3 xl:w-1/4 flex flex-col justify-between">
            {/* Title and Description at top */}
            <div className="max-w-[300px] pr-8">
              <h2 className="h2-title text-black mb-3 md:mb-4 whitespace-pre-line">
                {title}
              </h2>
              {description && (
                <p className="p-primary text-black">{description}</p>
              )}
            </div>

            {/* Button at bottom */}
            <div className="mt-8">
              <Link href={buttonLink}>
                <Button variant="primary" size="xs">
                  {buttonText}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="lg:flex-1 space-y-3">
            {faqItems.map(renderFAQItem)}
          </div>
        </div>
      </div>
    </section>
  );
}
