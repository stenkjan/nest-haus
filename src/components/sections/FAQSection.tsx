"use client";

import React, { useState, useRef, useEffect } from "react";
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
    question: "Wie lange dauert der Entwurfsprozess?",
    answer:
      "Der Entwurfsprozess dauert in der Regel 2-4 Wochen, abhängig von der Komplexität deines Projekts und der Anzahl der Anpassungswünsche. Sobald wir deine erste Anzahlung erhalten haben, beginnen wir mit der rechtlichen Prüfung und der Erstellung deines individuellen Vorentwurfs.",
  },
  {
    id: 2,
    question: "Was ist im Grundstückscheck enthalten?",
    answer:
      "Der Grundstückscheck umfasst eine umfassende rechtliche Prüfung deines Grundstücks. Wir analysieren die Vereinbarkeit mit dem Landesbaugesetz, dem Raumordnungsgesetz und den örtlichen Bestimmungen. Zusätzlich prüfen wir alle technischen Voraussetzungen für den Aufbau deines Nest-Hauses.",
  },
  {
    id: 3,
    question: "Kann ich den Entwurf später noch ändern?",
    answer:
      "Ja, selbstverständlich! Der Vorentwurf ist der erste Schritt, um deine Idee greifbar zu machen. Nach der Präsentation des Vorentwurfs kannst du Änderungswünsche äußern, die wir gemeinsam besprechen und umsetzen. Kleinere Anpassungen sind im Paket enthalten, größere Änderungen werden transparent kalkuliert.",
  },
  {
    id: 4,
    question: "Muss ich vor dem Entwurf konfigurieren?",
    answer:
      "Nein, das ist nicht notwendig. Du entscheidest selbst, ob du dein Zuhause bereits im Konfigurator gestalten möchtest, um ein Gefühl für die Kosten zu bekommen, oder ob du ohne Konfiguration fortfährst. In beiden Fällen zahlst du nur für die rechtliche Prüfung und den Vorentwurf.",
  },
  {
    id: 5,
    question: "Was passiert, wenn mein Grundstück nicht geeignet ist?",
    answer:
      "Sollte sich bei der Prüfung herausstellen, dass dein Grundstück nicht für ein Nest-Haus geeignet ist, informieren wir dich umgehend und transparent über die Gründe. In diesem Fall erstatten wir dir einen Teil der Anzahlung zurück und bieten dir an, gemeinsam nach Lösungen oder Alternativen zu suchen.",
  },
];

export default function FAQSection({
  title = "Klarheit an erster Stelle",
  description = "Antworten auf  häufig gestellte Fragen",
  buttonText = "Melde dich jetzt",
  buttonLink = "/kontakt",
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
              <p className="p-primary-small text-gray-700 hidden">
                {description}
              </p>
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
                <p className="p-primary-small text-gray-700">{description}</p>
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
