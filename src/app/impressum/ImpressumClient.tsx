"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import Footer from "@/components/Footer";

const sections = [
  {
    id: "company-info",
    title: "Unternehmensangaben",
    slug: "unternehmensangaben",
  },
  { id: "contact", title: "Kontaktdaten", slug: "kontaktdaten" },
  { id: "legal", title: "Rechtliche Hinweise", slug: "rechtliche-hinweise" },
  { id: "liability", title: "Haftungsausschluss", slug: "haftungsausschluss" },
];

export default function ImpressumClient() {
  const [currentSectionId, setCurrentSectionId] =
    useState<string>("company-info");

  return (
    <div className="min-h-screen pt-16">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Company Info Section */}
        <section id="company-info" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Impressum
            </h1>
            <h2 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center">
              Angaben gemäß § 5 E-Commerce-Gesetz (ECG)
            </h2>

            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h3 className="text-2xl font-medium mb-8">NEST-Haus GmbH</h3>

              <div className="grid md:grid-cols-2 gap-12 text-gray-700">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-lg mb-3">
                      Firmenanschrift
                    </h4>
                    <div className="space-y-1">
                      <p>[Straße und Hausnummer]</p>
                      <p>[PLZ Ort]</p>
                      <p>Österreich</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg mb-3">
                      Geschäftsführung
                    </h4>
                    <p>[Name des Geschäftsführers]</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-lg mb-3">
                      Handelsregister
                    </h4>
                    <div className="space-y-1">
                      <p>
                        <strong>Firmenbuchnummer:</strong> FN [Nummer]
                      </p>
                      <p>
                        <strong>Firmenbuchgericht:</strong> [Gericht]
                      </p>
                      <p>
                        <strong>Rechtsform:</strong> Gesellschaft mit
                        beschränkter Haftung
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg mb-3">Steuernummer</h4>
                    <div className="space-y-1">
                      <p>
                        <strong>UID-Nummer:</strong> ATU [Nummer]
                      </p>
                      <p>
                        <strong>Steuernummer:</strong> [Steuernummer]
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-3xl md:text-4xl tracking-[-0.02em] mb-8 text-center">
              Kontaktdaten
            </h2>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 text-center text-gray-700">
                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-6">
                    Allgemeine Kontaktdaten
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Telefon</h4>
                      <p>[Ihre Telefonnummer]</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">E-Mail</h4>
                      <p>info@nest-haus.com</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Website</h4>
                      <p>www.nest-haus.com</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Geschäftszeiten</h4>
                      <div className="space-y-1">
                        <p>Montag - Freitag: 8:00 - 18:00 Uhr</p>
                        <p>Samstag: 9:00 - 16:00 Uhr</p>
                        <p>Sonntag: Nach Vereinbarung</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-medium mb-6">Fachbereiche</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Beratung & Planung</h4>
                      <p>beratung@nest-haus.com</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Kundenservice</h4>
                      <p>service@nest-haus.com</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Datenschutz</h4>
                      <p>datenschutz@nest-haus.com</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Presse & Medien</h4>
                      <p>presse@nest-haus.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Section */}
        <section id="legal" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-3xl md:text-4xl tracking-[-0.02em] mb-8 text-center">
              Rechtliche Hinweise
            </h2>

            <div className="max-w-4xl mx-auto space-y-12 text-center text-gray-700">
              <div className="space-y-4">
                <h3 className="text-2xl font-medium">Gewerbeordnung</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Gewerbeberechtigung:</strong> Baumeistergewerbe
                  </p>
                  <p>
                    <strong>Gewerbebehörde:</strong> [Zuständige Behörde]
                  </p>
                  <p>
                    <strong>Berufsbezeichnung:</strong> Baumeister
                  </p>
                  <p>
                    <strong>Verleihungsstaat:</strong> Österreich
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-medium">Kammerzugehörigkeit</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Wirtschaftskammer:</strong> Wirtschaftskammer
                    [Bundesland]
                  </p>
                  <p>
                    <strong>Fachgruppe:</strong> Baugewerbe
                  </p>
                  <p>
                    <strong>Mitgliedsnummer:</strong> [Nummer]
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-medium">Versicherung</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Betriebshaftpflichtversicherung:</strong>
                  </p>
                  <p>[Name der Versicherung]</p>
                  <p>Versicherungssumme: € [Betrag]</p>
                  <p>Geltungsbereich: Österreich/EU</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-medium">Aufsichtsbehörde</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Bezirkshauptmannschaft:</strong> [Zuständige BH]
                  </p>
                  <p>
                    <strong>Gewerbebehörde:</strong> [Adresse]
                  </p>
                  <p>
                    <strong>Telefon:</strong> [Telefonnummer]
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-medium">
                  Berufsrechtliche Regelungen
                </h3>
                <div className="space-y-4">
                  <p>Es gelten folgende berufsrechtliche Regelungen:</p>
                  <div className="space-y-1">
                    <p>
                      Gewerbeordnung (GewO) • Bauordnung des jeweiligen
                      Bundeslandes
                    </p>
                    <p>ÖNORMEN für das Bauwesen • EU-Bauproduktenverordnung</p>
                  </div>
                  <p className="pt-4">
                    <strong>Einsehbar unter:</strong>
                    <a
                      href="https://www.ris.bka.gv.at"
                      className="text-blue-600 hover:text-blue-800 ml-2"
                    >
                      www.ris.bka.gv.at
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Liability Section */}
        <section id="liability" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-medium text-3xl md:text-4xl tracking-[-0.02em] mb-8 text-center">
              Haftungsausschluss
            </h2>

            <div className="max-w-4xl mx-auto space-y-12 text-center text-gray-700">
              <div className="space-y-4">
                <h3 className="text-2xl font-medium">Haftung für Inhalte</h3>
                <p className="leading-relaxed">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
                  Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                  verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                  Diensteanbieter jedoch nicht unter der Verpflichtung,
                  übermittelte oder gespeicherte fremde Informationen zu
                  überwachen oder nach Umständen zu forschen, die auf eine
                  rechtswidrige Tätigkeit hinweisen.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-medium">Haftung für Links</h3>
                <p className="leading-relaxed">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf
                  deren Inhalte wir keinen Einfluss haben. Deshalb können wir
                  für diese fremden Inhalte auch keine Gewähr übernehmen. Für
                  die Inhalte der verlinkten Seiten ist stets der jeweilige
                  Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-medium">Urheberrecht</h3>
                <p className="leading-relaxed">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                  diesen Seiten unterliegen dem österreichischen Urheberrecht.
                  Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                  der Verwertung außerhalb der Grenzen des Urheberrechtes
                  bedürfen der schriftlichen Zustimmung des jeweiligen Autors
                  bzw. Erstellers.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-medium">Streitbeilegung</h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Wir sind nicht bereit oder verpflichtet, an
                    Streitbeilegungsverfahren vor einer
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                  <p className="leading-relaxed">
                    <strong>Online-Streitbeilegung:</strong> Die Europäische
                    Kommission stellt eine Plattform zur Online-Streitbeilegung
                    (OS) bereit:
                    <a
                      href="https://ec.europa.eu/consumers/odr/"
                      className="text-blue-600 hover:text-blue-800 ml-2"
                    >
                      https://ec.europa.eu/consumers/odr/
                    </a>
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <p className="text-lg">
                  Bei Fragen zu diesem Impressum wenden Sie sich bitte an:
                </p>
                <p className="text-xl font-medium">info@nest-haus.com</p>
              </div>
            </div>
          </div>
        </section>
      </SectionRouter>
      <Footer />
    </div>
  );
}
