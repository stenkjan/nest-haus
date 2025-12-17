"use client";

import React, { useState, useRef } from "react";
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
    question: "Was kostet der Konzept-Check?",
    answer: "Der Konzept-Check kostet regulär € 3.000,–.",
  },
  {
    id: 4,
    question: "Wer erstellt den Einreichplan?",
    answer:
      "Alles in einer Hand. Wir sind ein staatlich zertifizierter und registrierter Baumeisterbetrieb in Österreich. Somit dürfen wir alle Pläne, die zu deinem Bauprojekt gehören, in allen Bundesländern stempeln, einreichen und auch die Bauausführung übernehmen.",
  },
  {
    id: 5,
    question:
      "Fenster und Türen – warum sind keine Fenster im Konfigurator zu sehen?",
    answer:
      "Alle Fenster und Türen werden bei uns individuell mit dir gemeinsam und passend zu deinem Grundriss gestaltet. Wir positionieren diese perfekt nach den örtlichen Gegebenheiten, idealer Himmelsausrichtung, Belichtungssituation und deinen persönlichen Präferenzen.",
  },
  {
    id: 6,
    question: "Ist der Preis im Konfigurator fix?",
    answer:
      "Die Preise im Konfigurator dienen als Basis für die Gestaltung deines Hauses. Du bekommst damit ein erstes Preisgefühl, das uns in der gemeinsamen Planung deines individuellen Nest Hauses hilft. Einen konkreten Preis erhältst du nach Durchführung des Konzept-Checks.",
  },
  {
    id: 7,
    question: "Was kostet ein Nest Haus?",
    answer:
      "Der exakte Preis ist abhängig von deinem individuellen Hoam-Entwurf. Diesen arbeiten wir gemeinsam im Konzept-Check aus. Danach erhältst du ein konkretes Angebot für dein Hoam Haus.",
  },
  {
    id: 8,
    question: "Wie lange dauert der Konzept-Check?",
    answer:
      "Wir stellen deinen Konzept-Check innerhalb von 4 bis 6 Wochen fertig.",
  },
  {
    id: 9,
    question:
      "Was passiert, wenn ich mich nach dem Konzept-Check gegen das Nest Haus entscheide?",
    answer:
      "Die Unterlagen des Konzept-Checks gehören dir. Das bedeutet, du kannst die Grundstücksanalyse auch für andere Bauvorhaben verwenden.",
  },
  {
    id: 10,
    question: "Wie aufwändig ist der Auf- und Abbau des Nest Hauses?",
    answer:
      "Mit unserer Technologie ermöglichen wir einen sehr unkomplizierten Auf- und Abbau deines Nest Hauses. Der Abbau erfolgt innerhalb von 1 bis 2 Werktagen. Der Aufbau erfolgt ebenso in 1 bis 2 Werktagen.",
  },
  {
    id: 11,
    question: "Wie groß ist das Nest Haus?",
    answer:
      "Das Nest Haus ermöglicht eine hochwertige architektonische Atmosphäre mit Raumhöhen von bis zu 5 Metern. Diese Höhe erlaubt es, eine Zwischendecke einzuziehen und ein zweites Geschoss zu schaffen. Die Raumbreite beträgt 7,5 Meter. Die Wohnfläche eines Moduls beträgt 20 Quadratmeter, und diese Module können beliebig kombiniert werden.",
  },
  {
    id: 12,
    question: "Muss ich die vorgeschlagenen Fassadensysteme verwenden?",
    answer:
      "Unser Nest-System ist bis zur letzten Schraube durchdacht und optimiert. Das trägt wesentlich dazu bei, hochwertige Architektur leistbar zu machen. Wir empfehlen daher nicht, das Fassadensystem zu ändern.",
  },
  {
    id: 13,
    question: "Muss ich die vorgeschlagenen Innenwand-Paneele verwenden?",
    answer:
      "Die Innenwandverkleidung basiert auf den von uns vorgeschlagenen Paneelen, kann jedoch problemlos durch andere Paneele ersetzt werden. Hier kannst du dich frei entfalten.",
  },
  {
    id: 14,
    question: "Muss ich den vorgeschlagenen Fußbodenbelag verwenden?",
    answer:
      "Die vorgeschlagenen Fußbodenbeläge können ebenfalls problemlos durch andere Materialien ersetzt werden. Auch hier kannst du dich gestalterisch frei entfalten.",
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

          {/* Bottom padding to match top spacing */}
          <div className="pb-8 md:pb-12"></div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
