"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui";
import Link from "next/link";
import Footer from "@/components/Footer";
import { SectionHeader } from "@/components/sections";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "Wie lange dauert der Entwurfsprozess?",
    answer:
      "Der Entwurfsprozess dauert in der Regel 4-6 Wochen, abhängig von der Komplexität deines Projekts und der Anzahl der Anpassungswünsche. Sobald wir deine erste Anzahlung erhalten haben, beginnen wir mit der rechtlichen Prüfung und der Erstellung deines individuellen Entwurfs.",
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
      "Ja, selbstverständlich! Der Entwurf ist der erste Schritt, um deine Idee greifbar zu machen. Nach der Präsentation des Entwurfs kannst du Änderungswünsche äußern, die wir gemeinsam besprechen und umsetzen. Kleinere Anpassungen sind im Paket enthalten, größere Änderungen werden transparent kalkuliert.",
  },
  {
    id: 4,
    question: "Muss ich vor dem Entwurf konfigurieren?",
    answer:
      "Nein, das ist nicht notwendig. Du entscheidest selbst, ob du dein Zuhause bereits im Konfigurator gestalten möchtest, um ein Gefühl für die Kosten zu bekommen, oder ob du ohne Konfiguration fortfährst. In beiden Fällen zahlst du nur für die rechtliche Prüfung und den Entwurf.",
  },
  {
    id: 5,
    question: "Was passiert, wenn mein Grundstück nicht geeignet ist?",
    answer:
      "Sollte sich bei der Prüfung herausstellen, dass dein Grundstück nicht für ein Nest-Haus geeignet ist, informieren wir dich umgehend und transparent über die Gründe. In diesem Fall erstatten wir dir einen Teil der Anzahlung zurück und bieten dir an, gemeinsam nach Lösungen oder Alternativen zu suchen.",
  },
];

export default function FAQClient() {
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

  // Render FAQ item component
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
    <div
      className="w-full"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      {/* FAQ Items Section with Gray Background */}
      <section className="w-full pt-12 pb-8 md:pb-16">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Häufig gestellte Fragen"
          wrapperMargin="mb-8 md:mb-12"
          mobileTitle="Häufig gestellte Fragen"
        />
        <div className="w-full max-w-[1536px] bg-[#f4f4f4] mx-auto px-4 md:px-12 pt-8 md:pt-12">
          <div className="max-w-4xl mx-auto space-y-3">
            {faqItems.map(renderFAQItem)}
          </div>

          {/* CTA Button */}
          <div className="py-8 md:py-12 flex justify-center">
            <Link href="/kontakt">
              <Button variant="primary" size="xs">
                Melde dich jetzt
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
