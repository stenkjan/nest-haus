"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import Footer from "@/components/Footer";

const sections = [
  { id: "overview", title: "Überblick", slug: "ueberblick" },
  { id: "responsible", title: "Verantwortlicher", slug: "verantwortlicher" },
  {
    id: "data-processing",
    title: "Datenverarbeitung",
    slug: "datenverarbeitung",
  },
  { id: "cookies", title: "Cookies", slug: "cookies" },
  { id: "rights", title: "Ihre Rechte", slug: "ihre-rechte" },
  { id: "contact", title: "Kontakt", slug: "kontakt" },
];

export default function DatenschutzClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("overview");

  return (
    <div className="min-h-screen pt-16">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Overview Section */}
        <section id="overview" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Datenschutzerklärung
            </h1>
            <h2 className="h2-subtitle tracking-[-0.015em] leading-8 max-w-3xl mx-auto text-center">
              Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO
            </h2>

            <div className="max-w-4xl mx-auto space-y-8 text-gray-700">
              <p className="text-lg leading-relaxed text-center">
                Der Schutz Ihrer personenbezogenen Daten ist uns ein besonderes
                Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf
                Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). In
                diesen Datenschutzinformationen informieren wir Sie über die
                wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer
                Website.
              </p>

              <div className="text-center py-6">
                <p className="text-sm text-gray-600">
                  Letzte Aktualisierung:{" "}
                  {new Date().toLocaleDateString("de-AT")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Responsible Section */}
        <section id="responsible" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="h2-section tracking-[-0.02em]">Verantwortlicher</h2>

            <div className="max-w-4xl mx-auto space-y-8 text-gray-700">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-medium mb-6">NEST-Haus GmbH</h3>
                <div className="space-y-3 text-lg">
                  <p>Karmeliterplatz 8, 8010 Graz</p>
                  <p>Telefon: </p>
                  <p>E-Mail: info@nest-haus.at</p>
                </div>
                <div className="space-y-2 text-base pt-4">
                  <p>Firmenbuchnummer: [FN-Nummer]</p>
                  <p>Firmenbuchgericht: [Gericht]</p>
                  <p>UID-Nummer: [UID-Nummer]</p>
                </div>
              </div>

              <p className="text-lg leading-relaxed text-center pt-8">
                Als Verantwortlicher im Sinne der DSGVO bestimmen wir die Zwecke
                und Mittel der Verarbeitung personenbezogener Daten. Bei Fragen
                zum Datenschutz können Sie sich jederzeit an uns wenden.
              </p>
            </div>
          </div>
        </section>

        {/* Data Processing Section */}
        <section id="data-processing" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="h2-section tracking-[-0.02em]">Datenverarbeitung</h2>

            <div className="max-w-4xl mx-auto space-y-12 text-gray-700">
              {/* Website Usage */}
              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-center">
                  Nutzung unserer Website
                </h3>
                <div className="space-y-4 text-center">
                  <p className="text-lg">
                    <strong>Verarbeitete Daten:</strong>
                  </p>
                  <div className="space-y-2">
                    <p>
                      IP-Adresse • Browser-Informationen • Besuchte Seiten und
                      Verweildauer
                    </p>
                    <p>Referrer-URL • Zeitpunkt des Zugriffs</p>
                  </div>
                  <div className="space-y-2 pt-4">
                    <p>
                      <strong>Rechtsgrundlage:</strong> Berechtigtes Interesse
                      (Art. 6 Abs. 1 lit. f DSGVO)
                    </p>
                    <p>
                      <strong>Zweck:</strong> Bereitstellung und Optimierung der
                      Website, Sicherheit
                    </p>
                    <p>
                      <strong>Speicherdauer:</strong> 30 Tage
                    </p>
                  </div>
                </div>
              </div>

              {/* Configurator */}
              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-center">
                  Haus-Konfigurator
                </h3>
                <div className="space-y-4 text-center">
                  <p className="text-lg">
                    <strong>Verarbeitete Daten:</strong>
                  </p>
                  <div className="space-y-2">
                    <p>
                      Konfigurationsdaten (Haustyp, Materialien, Ausstattung)
                    </p>
                    <p>
                      Session-ID zur Zuordnung • Interaktionsdaten •
                      Preisberechnungen
                    </p>
                  </div>
                  <div className="space-y-2 pt-4">
                    <p>
                      <strong>Rechtsgrundlage:</strong> Berechtigtes Interesse
                      (Art. 6 Abs. 1 lit. f DSGVO)
                    </p>
                    <p>
                      <strong>Zweck:</strong> Bereitstellung des Konfigurators,
                      Verbesserung der Nutzererfahrung
                    </p>
                    <p>
                      <strong>Speicherdauer:</strong> Session-basiert, 24
                      Stunden
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Forms */}
              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-center">
                  Kontaktformulare
                </h3>
                <div className="space-y-4 text-center">
                  <p className="text-lg">
                    <strong>Verarbeitete Daten:</strong>
                  </p>
                  <div className="space-y-2">
                    <p>Name, E-Mail-Adresse, Telefonnummer</p>
                    <p>
                      Nachrichteninhalt • Konfigurationsdaten (falls
                      übermittelt)
                    </p>
                  </div>
                  <div className="space-y-2 pt-4">
                    <p>
                      <strong>Rechtsgrundlage:</strong> Einwilligung (Art. 6
                      Abs. 1 lit. a DSGVO)
                    </p>
                    <p>
                      <strong>Zweck:</strong> Bearbeitung Ihrer Anfrage,
                      Kundenbetreuung
                    </p>
                    <p>
                      <strong>Speicherdauer:</strong> Bis zur vollständigen
                      Bearbeitung, max. 3 Jahre
                    </p>
                  </div>
                </div>
              </div>

              {/* External Services */}
              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-center">
                  Externe Dienste
                </h3>
                <div className="space-y-6 text-center">
                  <div>
                    <h4 className="font-medium text-lg mb-2">
                      Vercel (Hosting)
                    </h4>
                    <p>
                      Unsere Website wird bei Vercel Inc. (USA) gehostet. Dabei
                      können personenbezogene Daten in die USA übertragen
                      werden.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-2">
                      Upstash Redis (Session-Speicherung)
                    </h4>
                    <p>
                      Für die Session-Verwaltung nutzen wir Upstash Redis. Die
                      Daten werden verschlüsselt gespeichert.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-2">
                      Neon PostgreSQL (Datenbank)
                    </h4>
                    <p>
                      Permanente Daten werden in einer PostgreSQL-Datenbank bei
                      Neon (EU) gespeichert.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cookies Section */}
        <section id="cookies" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="h2-section tracking-[-0.02em]">
              Cookies und Tracking
            </h2>

            <div className="max-w-4xl mx-auto space-y-12 text-gray-700">
              <p className="text-lg leading-relaxed text-center">
                Unsere Website verwendet Cookies, um die Funktionalität zu
                gewährleisten und Ihre Nutzererfahrung zu verbessern. Sie können
                Ihre Cookie-Einstellungen jederzeit anpassen.
              </p>

              {/* Essential Cookies */}
              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-center">
                  Notwendige Cookies
                </h3>
                <div className="space-y-4 text-center">
                  <p>
                    Diese Cookies sind für die Grundfunktionen der Website
                    erforderlich:
                  </p>
                  <div className="space-y-2">
                    <p>
                      <strong>Session-Cookie:</strong> Zuordnung Ihrer
                      Konfiguration
                    </p>
                    <p>
                      <strong>Cookie-Einstellungen:</strong> Speicherung Ihrer
                      Cookie-Präferenzen
                    </p>
                    <p>
                      <strong>Sicherheits-Cookies:</strong> Schutz vor
                      CSRF-Angriffen
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 pt-4">
                    Diese Cookies können nicht deaktiviert werden.
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-center">
                  Analyse-Cookies
                </h3>
                <div className="space-y-4 text-center">
                  <p>Diese Cookies helfen uns, die Website zu verbessern:</p>
                  <div className="space-y-2">
                    <p>
                      <strong>Nutzungsstatistiken:</strong> Anonyme Auswertung
                      der Website-Nutzung
                    </p>
                    <p>
                      <strong>Performance-Tracking:</strong> Ladezeiten und
                      technische Metriken
                    </p>
                    <p>
                      <strong>Konfigurator-Analytics:</strong> Optimierung des
                      Konfigurators
                    </p>
                  </div>
                  <p className="pt-4">
                    <strong>Speicherdauer:</strong> 30 Tage
                  </p>
                </div>
              </div>

              <div className="text-center pt-8">
                <button className="bg-black text-white rounded-full font-medium text-lg px-8 py-4 transition-all hover:bg-gray-800">
                  Cookie-Einstellungen verwalten
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Rights Section */}
        <section id="rights" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="h2-section tracking-[-0.02em]">Ihre Rechte</h2>

            <div className="max-w-4xl mx-auto space-y-12 text-gray-700">
              <p className="text-lg leading-relaxed text-center">
                Sie haben bezüglich Ihrer personenbezogenen Daten folgende
                Rechte:
              </p>

              <div className="grid md:grid-cols-2 gap-8 text-center">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Auskunftsrecht</h3>
                  <p>
                    Sie haben das Recht zu erfahren, welche Daten wir über Sie
                    gespeichert haben.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Berichtigungsrecht</h3>
                  <p>Sie können die Korrektur unrichtiger Daten verlangen.</p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Löschungsrecht</h3>
                  <p>
                    Sie können die Löschung Ihrer Daten unter bestimmten
                    Voraussetzungen verlangen.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Widerspruchsrecht</h3>
                  <p>
                    Sie können der Verarbeitung Ihrer Daten aus berechtigtem
                    Interesse widersprechen.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Datenübertragbarkeit</h3>
                  <p>
                    Sie haben das Recht, Ihre Daten in einem strukturierten
                    Format zu erhalten.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Beschwerde</h3>
                  <p>Sie können sich bei der Datenschutzbehörde beschweren.</p>
                </div>
              </div>

              <div className="text-center space-y-6 pt-8">
                <h3 className="text-2xl font-medium">Kontakt Datenschutz</h3>
                <p className="text-lg">
                  Für Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte
                  wenden Sie sich an:
                </p>
                <div className="space-y-2">
                  <p>
                    <strong>E-Mail:</strong> datenschutz@nest-haus.at
                  </p>
                  <p>
                    <strong>Telefon:</strong> [Ihre Telefonnummer]
                  </p>
                  <p>
                    <strong>Post:</strong> NEST-Haus GmbH, Datenschutz, [Ihre
                    Adresse]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-16 bg-gray-50">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="h2-section tracking-[-0.02em]">
              Kontakt & Beschwerden
            </h2>

            <div className="max-w-4xl mx-auto space-y-12 text-gray-700">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-medium">Datenschutzbehörde</h3>
                <p className="text-lg">
                  Bei Beschwerden können Sie sich an die österreichische
                  Datenschutzbehörde wenden:
                </p>
                <div className="space-y-2">
                  <p>
                    <strong>Österreichische Datenschutzbehörde</strong>
                  </p>
                  <p>Barichgasse 40-42, 1030 Wien</p>
                  <p>Telefon: +43 1 52 152-0</p>
                  <p>E-Mail: dsb@dsb.gv.at</p>
                  <p>Website: www.dsb.gv.at</p>
                </div>
              </div>

              <div className="text-center space-y-6">
                <p className="text-lg">
                  Diese Datenschutzerklärung kann bei Änderungen der rechtlichen
                  Bestimmungen oder unserer Datenverarbeitung angepasst werden.
                </p>
                <p className="text-sm text-gray-600">
                  Stand: {new Date().toLocaleDateString("de-AT")}
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
