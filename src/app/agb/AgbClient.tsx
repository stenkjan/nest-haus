"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import Footer from "@/components/Footer";

const sections = [
  {
    id: "general",
    title: "Allgemeine Bestimmungen",
    slug: "allgemeine-bestimmungen",
  },
  { id: "contract", title: "Vertragsabschluss", slug: "vertragsabschluss" },
  { id: "services", title: "Leistungen", slug: "leistungen" },
  { id: "prices", title: "Preise & Zahlung", slug: "preise-zahlung" },
  { id: "delivery", title: "Lieferung & Montage", slug: "lieferung-montage" },
  { id: "withdrawal", title: "Widerrufsrecht", slug: "widerrufsrecht" },
  { id: "warranty", title: "Gewährleistung", slug: "gewaehrleistung" },
  { id: "liability", title: "Haftung", slug: "haftung" },
  { id: "final", title: "Schlussbestimmungen", slug: "schlussbestimmungen" },
];

export default function AgbClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("general");

  return (
    <div className="min-h-screen pt-16 bg-[#F4F4F4]">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* General Section */}
        <section id="general" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center text-black">
              Allgemeine Geschäftsbedingungen
            </h1>
            <h2 className="h2-subtitle tracking-[-0.015em] leading-8 max-w-3xl mx-auto text-center text-black">
              Nest-Haus GmbH - Modulare Häuser
            </h2>

            <div className="max-w-4xl mx-auto space-y-12 text-gray-700">
              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-black">
                  Geltungsbereich
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle
                    Verträge zwischen der Nest-Haus GmbH (nachfolgend
                    &quot;Nest-Haus&quot; oder &quot;Anbieter&quot;) und ihren
                    Kunden über die Planung, Lieferung und Montage modularer
                    Häuser.
                  </p>
                  <p className="leading-relaxed">
                    Abweichende Bedingungen des Kunden werden nicht anerkannt,
                    es sei denn, Nest-Haus stimmt ihrer Geltung ausdrücklich
                    schriftlich zu.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-black">
                  Definitionen
                </h3>
                <div className="space-y-4">
                  <p>
                    <strong>Verbraucher:</strong> Natürliche Person, die ein
                    Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder
                    ihrer gewerblichen noch ihrer selbständigen berufstätigen
                    Tätigkeit zugerechnet werden können.
                  </p>
                  <p>
                    <strong>Unternehmer:</strong> Natürliche oder juristische
                    Person oder rechtsfähige Personengesellschaft, die bei
                    Abschluss eines Rechtsgeschäfts in Ausübung ihrer
                    gewerblichen oder selbständigen beruflichen Tätigkeit
                    handelt.
                  </p>
                  <p>
                    <strong>Modulares Haus:</strong> Vorgefertigte
                    Gebäudemodule, die nach individueller Konfiguration
                    geliefert und montiert werden.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-black">
                  Anwendbares Recht
                </h3>
                <p className="leading-relaxed">
                  Für alle Rechtsbeziehungen zwischen Nest-Haus und dem Kunden
                  gilt ausschließlich österreichisches Recht unter Ausschluss
                  des UN-Kaufrechts. Bei Verbrauchern gelten zusätzlich die
                  zwingenden Bestimmungen des Konsumentenschutzgesetzes (KSchG)
                  und des Fern- und Auswärtsgeschäfte-Gesetzes (FAGG).
                </p>
              </div>

              <div className="pt-8">
                <p className="text-sm text-gray-600">
                  Stand: {new Date().toLocaleDateString("de-AT")} | Version 1.0
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contract Section */}
        <section id="contract" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="h2-section tracking-[-0.02em] text-black">
              Vertragsabschluss
            </h2>

            <div className="max-w-4xl mx-auto space-y-12 text-gray-700">
              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-black">
                  Angebot und Bestellung
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Die Darstellung der Produkte auf unserer Website stellt kein
                    rechtlich bindendes Angebot, sondern eine Aufforderung zur
                    Abgabe einer Bestellung dar.
                  </p>
                  <p className="leading-relaxed">
                    Durch die Nutzung des Konfigurators und die Übermittlung
                    einer Anfrage gibt der Kunde eine verbindliche Bestellung
                    ab.
                  </p>
                  <p className="leading-relaxed">
                    Nest-Haus kann die Bestellung binnen 14 Tagen nach Eingang
                    annehmen oder ablehnen.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12">
                <h3 className="text-xl font-medium text-black mb-4">
                  Vertragsbestätigung
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Der Vertrag kommt durch die schriftliche Auftragsbestätigung
                    von Nest-Haus zustande.
                  </p>
                  <p className="leading-relaxed">
                    Die Auftragsbestätigung enthält alle wesentlichen
                    Vertragsbestandteile:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Detaillierte Produktbeschreibung und Konfiguration</li>
                    <li>Gesamtpreis inkl. aller Nebenkosten</li>
                    <li>Liefertermin und Montagezeitraum</li>
                    <li>Zahlungsmodalitäten</li>
                    <li>Besondere Vereinbarungen</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-black">
                  Elektronische Vertragsabwicklung
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Verträge können auch elektronisch über unsere Website
                    abgeschlossen werden.
                  </p>
                  <p className="leading-relaxed">
                    Der Kunde erhält eine Kopie der Bestellung per E-Mail. Die
                    Vertragssprache ist Deutsch.
                  </p>
                  <p className="leading-relaxed">
                    Nest-Haus speichert den Vertragstext und sendet dem Kunden
                    die Bestelldaten und AGB per E-Mail zu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="h2-section tracking-[-0.02em] text-black">
              Leistungen
            </h2>

            <div className="max-w-4xl mx-auto space-y-8 text-gray-700">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Leistungsumfang
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Nest-Haus erbringt folgende Leistungen:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Planung und Konstruktion des modularen Hauses</li>
                    <li>
                      Herstellung der Gebäudemodule nach Kundenkonfiguration
                    </li>
                    <li>Lieferung zur vereinbarten Baustelle</li>
                    <li>Montage und Aufbau des Hauses</li>
                    <li>Übergabe im bezugsfertigen Zustand</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Planungsleistungen
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Die Planungsleistungen umfassen:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Statische Berechnungen</li>
                    <li>Einreichpläne für Baubehörden</li>
                    <li>Detailpläne für die Produktion</li>
                    <li>Koordination mit örtlichen Gewerken</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    Zusätzliche Planungsleistungen werden gesondert berechnet.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Kundenpflichten
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">Der Kunde ist verpflichtet:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Ein baureifes Grundstück zur Verfügung zu stellen</li>
                    <li>Alle erforderlichen Genehmigungen einzuholen</li>
                    <li>
                      Anschlüsse für Strom, Wasser und Abwasser bereitzustellen
                    </li>
                    <li>Zufahrt für Lieferfahrzeuge zu gewährleisten</li>
                    <li>
                      Bei der Montage anwesend zu sein oder einen
                      Bevollmächtigten zu bestellen
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prices Section */}
        <section id="prices" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="h2-section tracking-[-0.02em] text-black">
              Preise & Zahlung
            </h2>

            <div className="max-w-4xl mx-auto space-y-8 text-gray-700">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Preisgestaltung
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Alle Preise verstehen sich in Euro (€) inklusive der
                    gesetzlichen Mehrwertsteuer.
                  </p>
                  <p className="leading-relaxed">
                    Der Gesamtpreis setzt sich zusammen aus:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Grundpreis des konfigurierten Hauses</li>
                    <li>Kosten für Zusatzausstattung</li>
                    <li>Planungskosten</li>
                    <li>Lieferkosten</li>
                    <li>Montagekosten</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-3xl border-2 border-[#3D6CE1] p-8 md:p-12">
                <h3 className="text-xl font-medium text-black mb-4">
                  Zahlungsmodalitäten
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Die Zahlung erfolgt in folgenden Raten:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Anzahlung:</strong> 30% bei Vertragsabschluss
                    </li>
                    <li>
                      <strong>Zwischenzahlung:</strong> 40% bei
                      Produktionsbeginn
                    </li>
                    <li>
                      <strong>Restzahlung:</strong> 30% bei Übergabe
                    </li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    Zahlungen sind binnen 14 Tagen nach Rechnungsstellung
                    fällig.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Zahlungsverzug
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Bei Zahlungsverzug sind Verzugszinsen in Höhe von 4% über
                    dem Basiszinssatz p.a. zu zahlen.
                  </p>
                  <p className="leading-relaxed">
                    Nest-Haus ist berechtigt, bei Zahlungsverzug die weitere
                    Leistungserbringung einzustellen, bis alle offenen Beträge
                    beglichen sind.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Preisänderungen
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Preisänderungen nach Vertragsabschluss sind nur zulässig
                    bei:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Änderungen der gesetzlichen Mehrwertsteuer</li>
                    <li>Nachträglichen Änderungswünschen des Kunden</li>
                    <li>
                      Unvorhersehbaren Kostensteigerungen bei Materialien (&gt;
                      5%)
                    </li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    Der Kunde ist über Preisänderungen unverzüglich zu
                    informieren.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Section */}
        <section id="delivery" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="h2-section tracking-[-0.02em] text-black">
              Lieferung & Montage
            </h2>

            <div className="max-w-4xl mx-auto space-y-8 text-gray-700">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">Lieferzeiten</h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Die Lieferzeit beträgt in der Regel 8-12 Wochen ab
                    Vertragsabschluss und Vorliegen aller erforderlichen
                    Unterlagen.
                  </p>
                  <p className="leading-relaxed">
                    Liefertermine sind nur dann verbindlich, wenn sie
                    ausdrücklich als &quot;Fixtermin&quot; vereinbart wurden.
                  </p>
                  <p className="leading-relaxed">
                    Verzögerungen durch höhere Gewalt, Streik oder behördliche
                    Maßnahmen verlängern die Lieferzeit entsprechend.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12">
                <h3 className="text-xl font-medium text-black mb-4">
                  Lieferung
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Die Lieferung erfolgt frei Baustelle innerhalb Österreichs.
                  </p>
                  <p className="leading-relaxed">
                    Voraussetzungen für die Lieferung:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Befahrbare Zufahrt für 40-Tonnen-LKW</li>
                    <li>Ausreichend Platz für Kranaufstellung</li>
                    <li>Baustelle ist vermessen und eingerichtet</li>
                    <li>Fundament ist fertiggestellt und abgenommen</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">Montage</h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Die Montage wird durch qualifizierte Fachkräfte von
                    Nest-Haus durchgeführt.
                  </p>
                  <p className="leading-relaxed">
                    Montagedauer: In der Regel 2-5 Arbeitstage je nach
                    Hausgröße.
                  </p>
                  <p className="leading-relaxed">Die Montage umfasst:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Aufstellung der Module</li>
                    <li>Verbindung der Module untereinander</li>
                    <li>Anschluss an die Hausanschlüsse</li>
                    <li>Funktionsprüfung aller Systeme</li>
                    <li>Übergabe mit Einweisung</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">Lieferverzug</h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Bei Lieferverzug von mehr als 4 Wochen kann der Kunde nach
                    schriftlicher Mahnung mit angemessener Nachfrist vom Vertrag
                    zurücktreten.
                  </p>
                  <p className="leading-relaxed">
                    Schadensersatzansprüche wegen Lieferverzugs sind auf 5% des
                    Kaufpreises begrenzt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Withdrawal Section */}
        <section id="withdrawal" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="h2-section tracking-[-0.02em] text-black">
              Widerrufsrecht
            </h2>

            <div className="max-w-4xl mx-auto space-y-8 text-gray-700">
              <div className="bg-white rounded-3xl border-2 border-[#3D6CE1] p-8 md:p-12">
                <h3 className="text-xl font-medium text-black mb-4">
                  Ausschluss des Widerrufsrechts
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    <strong>Wichtiger Hinweis:</strong> Bei Verträgen über die
                    Lieferung von Waren, die nach Kundenspezifikation
                    angefertigt werden oder eindeutig auf die persönlichen
                    Bedürfnisse zugeschnitten sind, besteht kein Widerrufsrecht
                    (§ 18 Abs. 1 Z 3 FAGG).
                  </p>
                  <p className="leading-relaxed">
                    Da modulare Häuser individuell nach Kundenkonfiguration
                    geplant und hergestellt werden, ist ein Widerruf nach
                    Produktionsbeginn ausgeschlossen.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Widerruf vor Produktionsbeginn
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Bis zum Beginn der Produktion (Freigabe der Werkplanung)
                    kann der Kunde den Vertrag widerrufen.
                  </p>
                  <p className="leading-relaxed">
                    Der Widerruf muss schriftlich erklärt werden an:
                  </p>
                  <div className="bg-white rounded-2xl p-4">
                    <p>
                      <strong>Eco Chalets GmbH</strong>
                    </p>
                    <p>[Adresse]</p>
                    <p>E-Mail: mail@nest-haus.at</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Folgen des Widerrufs
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">Bei rechtmäßigem Widerruf:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Rückzahlung der Anzahlung binnen 14 Tagen</li>
                    <li>Abzug der bereits erbrachten Planungsleistungen</li>
                    <li>Bearbeitungsgebühr von 5% der Auftragssumme</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-3xl border-2 border-[#3D6CE1] p-8 md:p-12">
                <h3 className="text-xl font-medium text-black mb-4">
                  Muster-Widerrufsformular
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Sie können das folgende Formular verwenden:
                  </p>
                  <div className="bg-[#F4F4F4] p-4 rounded-2xl text-sm">
                    <p className="mb-2">
                      An: Nest-Haus GmbH, [Adresse], widerruf@nest-haus.at
                    </p>
                    <p className="mb-2">
                      Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
                      abgeschlossenen Vertrag über den Kauf der folgenden Waren
                      (*):
                    </p>
                    <p className="mb-2">Bestellt am (*): ____________</p>
                    <p className="mb-2">
                      Name des/der Verbraucher(s): ____________
                    </p>
                    <p className="mb-2">
                      Anschrift des/der Verbraucher(s): ____________
                    </p>
                    <p className="mb-2">
                      Unterschrift des/der Verbraucher(s): ____________
                    </p>
                    <p>Datum: ____________</p>
                    <p className="mt-2 text-xs">
                      (*) Unzutreffendes streichen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Warranty Section */}
        <section id="warranty" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="h2-section tracking-[-0.02em] text-black">
              Gewährleistung
            </h2>

            <div className="max-w-4xl mx-auto space-y-8 text-gray-700">
              <div className="bg-white rounded-3xl border-2 border-[#3D6CE1] p-8 md:p-12">
                <h3 className="text-xl font-medium text-black mb-4">
                  Gewährleistungsfristen
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Nest-Haus gewährt folgende Gewährleistungsfristen:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Konstruktion und Statik:</strong> 30 Jahre
                    </li>
                    <li>
                      <strong>Gebäudehülle (Dach, Wände):</strong> 10 Jahre
                    </li>
                    <li>
                      <strong>Haustechnik:</strong> 2 Jahre
                    </li>
                    <li>
                      <strong>Oberflächenbehandlungen:</strong> 2 Jahre
                    </li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    Die Gewährleistungsfrist beginnt mit der Übergabe des
                    Hauses.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Gewährleistungsansprüche
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Bei Mängeln hat der Kunde zunächst Anspruch auf:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Verbesserung (Reparatur)</li>
                    <li>Austausch</li>
                    <li>Preisminderung</li>
                    <li>Wandlung (Vertragsauflösung)</li>
                  </ol>
                  <p className="leading-relaxed mt-4">
                    Mängel sind unverzüglich, spätestens binnen 8 Tagen nach
                    Entdeckung, schriftlich anzuzeigen.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Ausschluss der Gewährleistung
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Die Gewährleistung ist ausgeschlossen bei:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Natürlicher Abnutzung</li>
                    <li>Unsachgemäßer Behandlung oder Wartung</li>
                    <li>Schäden durch Dritte</li>
                    <li>Höhere Gewalt</li>
                    <li>Eigenmächtigen Änderungen am Gebäude</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Wartung und Pflege
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Der Kunde erhält eine detaillierte Wartungsanleitung und ist
                    verpflichtet:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Regelmäßige Sichtkontrollen durchzuführen</li>
                    <li>Empfohlene Wartungsintervalle einzuhalten</li>
                    <li>
                      Nur qualifizierte Fachbetriebe mit Reparaturen zu
                      beauftragen
                    </li>
                    <li>Originalersatzteile zu verwenden</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Liability Section */}
        <section id="liability" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="h2-section tracking-[-0.02em] text-black">
              Haftung
            </h2>

            <div className="max-w-4xl mx-auto space-y-8 text-gray-700">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Haftungsumfang
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Nest-Haus haftet für Schäden nur bei:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Vorsatz oder grober Fahrlässigkeit</li>
                    <li>Verletzung wesentlicher Vertragspflichten</li>
                    <li>Schäden an Leben, Körper oder Gesundheit</li>
                    <li>Produkthaftung nach dem Produkthaftungsgesetz</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12">
                <h3 className="text-xl font-medium text-black mb-4">
                  Haftungsbeschränkung
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Die Haftung für Vermögensschäden ist begrenzt auf:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Bei leichter Fahrlässigkeit: Vertragswert</li>
                    <li>Für mittelbare Schäden: 50% des Vertragswertes</li>
                    <li>Für entgangenen Gewinn: ausgeschlossen</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    Diese Beschränkungen gelten nicht bei Vorsatz oder grober
                    Fahrlässigkeit.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">Versicherung</h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Nest-Haus ist durch eine Betriebshaftpflichtversicherung mit
                    einer Deckungssumme von € [Betrag] versichert.
                  </p>
                  <p className="leading-relaxed">
                    Dem Kunden wird empfohlen, eine
                    Bauherrenhaftpflichtversicherung und
                    Bauleistungsversicherung abzuschließen.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">Verjährung</h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Schadensersatzansprüche verjähren in 3 Jahren ab Kenntnis
                    von Schaden und Schädiger.
                  </p>
                  <p className="leading-relaxed">
                    Bei Bauwerken beträgt die Verjährungsfrist für
                    Schadensersatzansprüche wegen Mängeln 30 Jahre ab Übergabe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final Section */}
        <section id="final" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="h2-section tracking-[-0.02em] text-black">
              Schlussbestimmungen
            </h2>

            <div className="max-w-4xl mx-auto space-y-8 text-gray-700">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Gerichtsstand
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Für alle Streitigkeiten aus diesem Vertragsverhältnis ist
                    das sachlich zuständige Gericht am Sitz von Nest-Haus
                    zuständig.
                  </p>
                  <p className="leading-relaxed">
                    Bei Verbrauchern gilt diese Vereinbarung nur, wenn der
                    Verbraucher nach Vertragsabschluss seinen Wohnsitz oder
                    gewöhnlichen Aufenthalt aus dem Geltungsbereich der
                    österreichischen Gerichtsbarkeit verlegt hat.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Salvatorische Klausel
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder
                    werden, bleibt die Wirksamkeit der übrigen Bestimmungen
                    unberührt.
                  </p>
                  <p className="leading-relaxed">
                    Unwirksame Bestimmungen sind durch solche zu ersetzen, die
                    dem wirtschaftlichen Zweck am nächsten kommen.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-medium text-black">
                  Änderungen der AGB
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Nest-Haus behält sich vor, diese AGB zu ändern. Kunden
                    werden über Änderungen rechtzeitig informiert.
                  </p>
                  <p className="leading-relaxed">
                    Für bereits abgeschlossene Verträge gelten die zum Zeitpunkt
                    des Vertragsabschlusses gültigen AGB.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border-2 border-[#3D6CE1] p-8 md:p-12">
                <h3 className="text-xl font-medium text-black mb-4">
                  Streitbeilegung
                </h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Für Streitigkeiten mit Verbrauchern steht die
                    Online-Streitbeilegungsplattform der EU zur Verfügung:
                  </p>
                  <p className="text-center">
                    <a
                      href="https://ec.europa.eu/consumers/odr/"
                      className="text-[#3D6CE1] hover:underline"
                    >
                      https://ec.europa.eu/consumers/odr/
                    </a>
                  </p>
                  <p className="leading-relaxed">
                    Nest-Haus ist nicht verpflichtet, an
                    Streitbeilegungsverfahren vor Verbraucherschlichtungsstellen
                    teilzunehmen.
                  </p>
                </div>
              </div>

              <div className="text-center border-t border-gray-300 pt-8 mt-12">
                <p className="text-lg font-medium text-black mb-4">
                  Nest-Haus GmbH
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Stand: {new Date().toLocaleDateString("de-AT")} | Version 1.0
                </p>
                <p className="text-sm text-gray-600">
                  Bei Fragen zu diesen AGB wenden Sie sich an: info@nest-haus.at
                </p>
              </div>
            </div>
          </div>
        </section>
      </SectionRouter>
      <Footer />
    </div>
  );
}
