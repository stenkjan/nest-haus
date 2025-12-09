"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import Footer from "@/components/Footer";

const sections = [
  {
    id: "allgemeine-hinweise",
    title: "Allgemeine Hinweise",
    slug: "allgemeine-hinweise",
  },
  {
    id: "verantwortliche-stelle",
    title: "Verantwortliche Stelle",
    slug: "verantwortliche-stelle",
  },
  {
    id: "hosting-server",
    title: "Hosting und Server-Log-Dateien",
    slug: "hosting-server",
  },
  { id: "cookies", title: "Cookies", slug: "cookies" },
  { id: "kontaktaufnahme", title: "Kontaktaufnahme", slug: "kontaktaufnahme" },
  {
    id: "website-analyse",
    title: "Website-Analyse und Tracking",
    slug: "website-analyse",
  },
  {
    id: "zahlungsabwicklung",
    title: "Zahlungsabwicklung",
    slug: "zahlungsabwicklung",
  },
  {
    id: "email-kommunikation",
    title: "E-Mail-Kommunikation",
    slug: "email-kommunikation",
  },
  {
    id: "google-dienste",
    title: "Google-Dienste und externe Tools",
    slug: "google-dienste",
  },
  {
    id: "speicherdauer",
    title: "Dauer der Speicherung",
    slug: "speicherdauer",
  },
  { id: "rechte", title: "Rechte der betroffenen Person", slug: "rechte" },
  { id: "aktualitaet", title: "Aktualität und Änderung", slug: "aktualitaet" },
];

export default function DatenschutzClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>(
    "allgemeine-hinweise"
  );

  return (
    <div className="min-h-screen pt-16">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Header */}
        <section className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
              Datenschutzerklärung
            </h1>

            <div className="max-w-4xl mx-auto space-y-8">
              <p className="p-primary text-center">
                Letzte Aktualisierung: {new Date().toLocaleDateString("de-AT")}
              </p>
            </div>
          </div>
        </section>

        {/* Allgemeine Hinweise Section */}
        <section id="allgemeine-hinweise" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">Allgemeine Hinweise</h3>
              <p className="p-primary">
                Wir behandeln Ihre personenbezogenen Daten vertraulich und
                entsprechend den gesetzlichen Datenschutzvorschriften sowie
                dieser Datenschutzerklärung. Wenn Sie diese Website benutzen,
                werden verschiedene personenbezogene Daten erhoben.
                Personenbezogene Daten sind Daten, mit denen Sie persönlich
                identifiziert werden können.
              </p>

              <p className="p-primary">
                Ein Teil der Daten wird erhoben, wenn Sie uns diese mitteilen
                (z. B. durch Eingaben in ein Kontaktformular). Andere Daten
                werden automatisch beim Besuch der Website durch unsere
                IT‑Systeme erfasst (insbesondere technische Daten, z. B.
                Internetbrowser, Betriebssystem, Uhrzeit des Seitenaufrufs oder
                IP-Adresse). Die Erfassung dieser Daten erfolgt automatisch,
                sobald Sie unsere Website betreten.
              </p>

              <p className="p-primary">
                Wofür nutzen wir Ihre Daten? Ein Großteil der Daten wird
                erhoben, um eine fehlerfreie Bereitstellung der Website zu
                gewährleisten (Gewährleistung des technischen Betriebs und
                Sicherheit der Website). Andere Daten können zur Analyse Ihres
                Nutzerverhaltens verwendet werden, sofern wir Analyse-Tools
                einsetzen (Details dazu finden Sie weiter unten in dieser
                Datenschutzerklärung).
              </p>

              <p className="p-primary">
                Ihre Rechte: Sie haben u. a. das Recht, jederzeit unentgeltlich
                Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten
                personenbezogenen Daten zu erhalten. Ihnen stehen außerdem
                weitere Rechte zu, wie das Recht auf Berichtigung, Löschung oder
                Einschränkung der Verarbeitung dieser Daten, die wir Ihnen in
                dieser Datenschutzerklärung unter &ldquo;Rechte der betroffenen
                Person&rdquo; näher erläutern. Des Weiteren haben Sie das Recht,
                eine erteilte Einwilligung jederzeit für die Zukunft zu
                widerrufen, sowie das Recht auf Beschwerde bei der zuständigen
                Aufsichtsbehörde.
              </p>
            </div>
          </div>
        </section>

        {/* Verantwortliche Stelle Section */}
        <section id="verantwortliche-stelle" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">Verantwortliche Stelle</h3>
              <p className="p-primary">
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser
                Website ist:
              </p>

              <p className="p-primary">
                eco Chalets GmbH
                <br />
                Zösenberg 51, 8045 Weinitzen
                <br />
                Telefon: +43 664 3949605
                <br />
                E-Mail: markus@sustain-nest.at
              </p>

              <p className="p-primary">
                Verantwortliche Stelle ist die natürliche oder juristische
                Person, die allein oder gemeinsam mit anderen über die Zwecke
                und Mittel der Verarbeitung von personenbezogenen Daten
                entscheidet.
              </p>
            </div>
          </div>
        </section>

        {/* Hosting und Server-Log-Dateien Section */}
        <section id="hosting-server" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">Hosting und Server-Log-Dateien</h3>
              <h4 className="h3-secondary">Externes Hosting</h4>

              <p className="p-primary">
                Diese Website wird bei einem externen Dienstleister (Hoster)
                betrieben. Personenbezogene Daten, die auf dieser Website
                erfasst werden, werden auf den Servern des Hosters gespeichert.
                Dies kann u. a. IP-Adressen, Meta- und Kommunikationsdaten,
                Webseitenzugriffe, Kontaktdaten, Nutzungsdaten, Vertragsdaten
                und sonstige Daten, die über eine Website generiert werden,
                umfassen. Der Einsatz des Hosters erfolgt zum Zwecke der
                Vertragserfüllung gegenüber unseren potenziellen und bestehenden
                Kunden (Art. 6 Abs. 1 lit. b DSGVO) und in unserem berechtigten
                Interesse an einer sicheren, schnellen und effizienten
                Bereitstellung unseres Online-Angebots durch einen
                professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO). Unser
                Hoster wird Ihre Daten nur insoweit verarbeiten, wie dies zur
                Erfüllung seiner Leistungspflichten erforderlich ist und unsere
                Weisungen in Bezug auf diese Daten befolgen.
              </p>

              <p className="p-primary">
                Wir haben mit dem Hoster einen Vertrag über Auftragsverarbeitung
                abgeschlossen, um die datenschutzkonforme Verarbeitung zu
                gewährleisten.
              </p>

              <h4 className="h3-secondary">Server-Log-Dateien</h4>

              <p className="p-primary">
                Der Provider der Seiten (bzw. unser Hosting-Anbieter) erhebt und
                speichert automatisch Informationen in sogenannten
                Server-Log-Dateien, die Ihr Browser automatisch an uns
                übermittelt. Dies sind:
              </p>

              <p className="p-primary">
                • Browsertyp und Browserversion
                <br />
                • verwendetes Betriebssystem
                <br />
                • Referrer URL (die zuvor besuchte Seite)
                <br />
                • Hostname des zugreifenden Rechners
                <br />
                • Uhrzeit der Serveranfrage
                <br />• IP-Adresse
              </p>

              <p className="p-primary">
                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird
                nicht vorgenommen.
              </p>

              <p className="p-primary">
                Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs.
                1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an der
                technisch fehlerfreien Darstellung und der Optimierung dieser
                Website – hierzu müssen die Server-Logfiles erfasst werden.
              </p>
            </div>
          </div>
        </section>

        {/* Cookies Section */}
        <section id="cookies" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">Cookies</h3>
              <p className="p-primary">
                Unsere Internetseiten verwenden teilweise sogenannte Cookies.
                Cookies sind kleine Textdateien, die auf Ihrem Endgerät keinen
                Schaden anrichten. Sie werden entweder vorübergehend für die
                Dauer einer Sitzung (Session-Cookies) oder dauerhaft
                (persistente Cookies) auf Ihrem Endgerät gespeichert.
                Session-Cookies werden nach Ende Ihres Besuchs automatisch
                gelöscht. Persistente Cookies verbleiben auf Ihrem Endgerät, bis
                Sie diese selbst löschen oder eine automatische Löschung durch
                Ihren Webbrowser erfolgt.
              </p>

              <p className="p-primary">
                Cookies haben verschiedene Funktionen. Viele Cookies sind
                technisch notwendig, da bestimmte Website-Funktionen ohne diese
                nicht funktionieren würden (z. B. die Seitennavigation). Andere
                Cookies können zur Analyse des Nutzerverhaltens oder zu
                Werbezwecken verwendet werden.
              </p>

              <p className="p-primary">
                Cookies, die zur Durchführung des elektronischen
                Kommunikationsvorgangs oder zur Bereitstellung bestimmter von
                Ihnen gewünschter Funktionen erforderlich sind, werden auf
                Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert. Wir als
                Websitebetreiber haben ein berechtigtes Interesse an der
                Speicherung von essenziellen Cookies zur technisch fehlerfreien
                und optimierten Bereitstellung unserer Dienste. Sofern wir eine
                Einwilligung für die Speicherung von Cookies einholen (z. B. für
                nicht essenzielle Cookies oder Analysen), erfolgt die
                Speicherung der betreffenden Cookies ausschließlich auf
                Grundlage dieser Einwilligung (Art. 6 Abs. 1 lit. a DSGVO); die
                Einwilligung ist jederzeit widerrufbar.
              </p>

              <p className="p-primary">
                Sie können Ihren Browser so einstellen, dass Sie über das Setzen
                von Cookies informiert werden und Cookies nur im Einzelfall
                erlauben, die Annahme von Cookies für bestimmte Fälle oder
                generell ausschließen sowie das automatische Löschen der Cookies
                beim Schließen des Browsers aktivieren. Bitte beachten Sie, dass
                bei der Deaktivierung von Cookies die Funktionalität dieser
                Website eingeschränkt sein kann.
              </p>

              <h4 className="h3-secondary">
                Übersicht der verwendeten Cookies
              </h4>

              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-black mb-2">
                    Notwendige Cookies (keine Einwilligung erforderlich)
                  </h5>
                  <p className="p-primary text-sm">
                    <strong>nest-haus-session</strong>
                    <br />
                    Zweck: Verwaltung der Nutzersitzung, Speicherung der
                    Konfigurator-Auswahl
                    <br />
                    Speicherdauer: 7 Tage
                    <br />
                    Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                    Interesse)
                  </p>
                  <p className="p-primary text-sm mt-2">
                    <strong>nest-haus-cookie-consent</strong>
                    <br />
                    Zweck: Speicherung Ihrer Cookie-Einwilligung
                    <br />
                    Speicherdauer: 365 Tage
                    <br />
                    Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                    Interesse)
                  </p>
                  <p className="p-primary text-sm mt-2">
                    <strong>nest-haus-cookie-preferences</strong>
                    <br />
                    Zweck: Speicherung Ihrer Cookie-Präferenzen
                    <br />
                    Speicherdauer: 365 Tage
                    <br />
                    Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                    Interesse)
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-black mb-2">
                    Analyse-Cookies (Einwilligung erforderlich)
                  </h5>
                  <p className="p-primary text-sm">
                    <strong>_ga</strong>
                    <br />
                    Anbieter: Google Analytics
                    <br />
                    Zweck: Eindeutige Nutzer-ID für Analyse
                    <br />
                    Speicherdauer: 2 Jahre
                    <br />
                    Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                  </p>
                  <p className="p-primary text-sm mt-2">
                    <strong>_ga_*</strong>
                    <br />
                    Anbieter: Google Analytics
                    <br />
                    Zweck: Session-Tracking und Engagement-Messung
                    <br />
                    Speicherdauer: 2 Jahre
                    <br />
                    Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                  </p>
                  <p className="p-primary text-sm mt-2">
                    <strong>_gid</strong>
                    <br />
                    Anbieter: Google Analytics
                    <br />
                    Zweck: Unterscheidung von Nutzern
                    <br />
                    Speicherdauer: 24 Stunden
                    <br />
                    Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                  </p>
                  <p className="p-primary text-sm mt-2">
                    <strong>nest-analytics</strong>
                    <br />
                    Zweck: Eigene Website-Analyse
                    <br />
                    Speicherdauer: 30 Tage
                    <br />
                    Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                  </p>
                  <p className="p-primary text-sm mt-2">
                    <strong>configurator-analytics</strong>
                    <br />
                    Zweck: Konfigurator-Nutzung analysieren
                    <br />
                    Speicherdauer: 30 Tage
                    <br />
                    Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-black mb-2">
                    Marketing-Cookies (Einwilligung erforderlich)
                  </h5>
                  <p className="p-primary text-sm">
                    <strong>_gcl_*</strong>
                    <br />
                    Anbieter: Google Ads
                    <br />
                    Zweck: Conversion-Tracking für Google Ads
                    <br />
                    Speicherdauer: 90 Tage
                    <br />
                    Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                  </p>
                  <p className="p-primary text-sm mt-2">
                    <strong>campaign-tracking</strong>
                    <br />
                    Zweck: Tracking von Marketing-Kampagnen
                    <br />
                    Speicherdauer: 30 Tage
                    <br />
                    Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kontaktaufnahme Section */}
        <section id="kontaktaufnahme" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">
                Kontaktaufnahme (Kontaktformular, E-Mail, Telefon)
              </h3>
              <p className="p-primary">
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen oder
                per E-Mail/Telefon kontaktieren, werden Ihre Angaben inklusive
                der von Ihnen angegebenen Kontaktdaten (Name, E-Mail-Adresse,
                Telefonnummer etc.) zwecks Bearbeitung der Anfrage und für den
                Fall von Anschlussfragen bei uns gespeichert. Wir geben diese
                Daten nicht ohne Ihre Einwilligung weiter.
              </p>

              <p className="p-primary">
                Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6
                Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines
                Vertrags zusammenhängt oder zur Durchführung vorvertraglicher
                Maßnahmen erforderlich ist. In übrigen Fällen beruht die
                Verarbeitung auf unserem berechtigten Interesse an der
                effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6
                Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1
                lit. a DSGVO), sofern diese abgefragt wurde; die Einwilligung
                ist jederzeit widerrufbar.
              </p>

              <p className="p-primary">
                Die von Ihnen an uns per Kontaktanfrage übersandten Daten
                verbleiben bei uns, bis der Zweck für die Datenverarbeitung
                entfällt (z. B. nach abgeschlossener Bearbeitung Ihrer Anfrage).
                Sie haben jederzeit das Recht, die Löschung dieser Daten von uns
                zu verlangen oder eine ggf. erteilte Einwilligung zur
                Datenverarbeitung zu widerrufen. Gesetzliche
                Aufbewahrungspflichten bleiben davon unberührt.
              </p>

              <h4 className="h3-secondary">Terminbuchungen und Anfragen</h4>

              <p className="p-primary">
                Wenn Sie über unsere Website einen Termin für eine Beratung
                buchen oder eine Anfrage senden, speichern wir die von Ihnen
                angegebenen Daten in unserer PostgreSQL-Datenbank. Diese Daten
                umfassen Name, E-Mail-Adresse, Telefonnummer (optional),
                gewünschter Terminzeitpunkt und ggf. weitere Anmerkungen.
              </p>

              <p className="p-primary">
                Zusätzlich erfassen wir im Rahmen unserer Nutzungsanalyse (siehe
                Abschnitt &quot;Eigene Nutzungsanalyse&quot;) anonymisierte
                Daten über Ihre Interaktion mit der Terminbuchungs-Funktion,
                jedoch ohne Zuordnung zu Ihrer Person.
              </p>

              <p className="p-primary">
                Die E-Mail-Kommunikation im Zusammenhang mit Ihrer Anfrage oder
                Terminbuchung erfolgt über unseren E-Mail-Dienstleister Resend
                (siehe Abschnitt &quot;E-Mail-Kommunikation&quot;).
              </p>
            </div>
          </div>
        </section>

        {/* Website-Analyse und Tracking Section */}
        <section id="website-analyse" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">Website-Analyse und Tracking</h3>

              <p className="p-primary">
                Wir setzen verschiedene Technologien zur Analyse der
                Website-Nutzung ein, um unser Angebot zu verbessern und Ihnen
                eine optimale Nutzererfahrung zu bieten. Im Folgenden erläutern
                wir, welche Analyseverfahren wir einsetzen und auf welcher
                Rechtsgrundlage dies erfolgt.
              </p>

              <h4 className="h3-secondary">
                Google Analytics 4 mit Consent Mode v2
              </h4>

              <p className="p-primary">
                Diese Website nutzt Google Analytics 4, einen Webanalysedienst
                der Google Ireland Limited, Gordon House, Barrow Street, Dublin
                4, Irland (&quot;Google&quot;). Google Analytics verwendet
                Cookies und ähnliche Technologien, um die Nutzung unserer
                Website zu analysieren.
              </p>

              <p className="p-primary">
                <strong>
                  Welche Daten werden mit Ihrer Einwilligung erhoben?
                </strong>
              </p>

              <p className="p-primary">
                Wenn Sie Analyse-Cookies akzeptieren, erfasst Google Analytics:
              </p>

              <p className="p-primary">
                • Seitenaufrufe, Klicks und Navigation
                <br />
                • Verweildauer auf Seiten und Absprungraten
                <br />
                • Demografische Daten (Alter, Geschlecht) über Google Signals
                <br />
                • Interessenskategorien der Nutzer
                <br />
                • Geräteinformationen (Browser, Betriebssystem,
                Bildschirmauflösung)
                <br />
                • Geografische Daten (Land, Stadt)
                <br />
                • Traffic-Quellen und Kampagnen-Tracking
                <br />
                • Nutzerverhalten und Conversions
                <br />
                • Geräteübergreifendes Tracking (Google Signals)
                <br />• IP-Adresse (gekürzt/anonymisiert)
              </p>

              <p className="p-primary">
                <strong>IP-Anonymisierung:</strong> Wir nutzen Google Analytics
                mit IP-Anonymisierung. Ihre IP-Adresse wird von Google innerhalb
                der Europäischen Union oder im Europäischen Wirtschaftsraum vor
                der Übermittlung in die USA gekürzt. Nur in Ausnahmefällen wird
                die volle IP-Adresse an einen Server von Google in den USA
                übertragen und dort gekürzt.
              </p>

              <p className="p-primary">
                <strong>Google Signals:</strong> Mit Ihrer Einwilligung zu
                Marketing-Cookies aktivieren wir Google Signals, wodurch Google
                geräteübergreifende Daten erheben und für Remarketing-Zwecke
                nutzen kann.
              </p>

              <p className="p-primary">
                <strong>Rechtsgrundlage:</strong> Die Nutzung von Google
                Analytics mit vollem Funktionsumfang erfolgt nur mit Ihrer
                ausdrücklichen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO und § 25
                Abs. 1 TTDSG). Sie können Ihre Einwilligung jederzeit mit
                Wirkung für die Zukunft widerrufen, indem Sie die
                Cookie-Einstellungen anpassen.
              </p>

              <p className="p-primary">
                <strong>Datenübertragung in die USA:</strong> Die erhobenen
                Daten werden in der Regel an Server von Google in den USA
                übertragen. Die Datenübertragung erfolgt auf Grundlage von
                EU-Standardvertragsklauseln oder im Rahmen des EU-US Data
                Privacy Framework. Wir haben mit Google einen Vertrag zur
                Auftragsverarbeitung abgeschlossen.
              </p>

              <p className="p-primary">
                <strong>Speicherdauer:</strong> Von Google Analytics erfasste
                Daten werden nach 14 Monaten automatisch gelöscht (für
                nutzerbasierte Daten) bzw. nach 2 Monaten (für ereignisbasierte
                Daten ohne Nutzer-ID).
              </p>

              <p className="p-primary">
                Weitere Informationen zu Google Analytics finden Sie unter:{" "}
                <a
                  href="https://policies.google.com/privacy?hl=de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://policies.google.com/privacy?hl=de
                </a>
              </p>

              <h4 className="h3-secondary">
                Cookiefreie Pings (Google Consent Mode v2)
              </h4>

              <p className="p-primary">
                Auch wenn Sie Analyse-Cookies ablehnen, verwendet unsere Website
                Google Analytics im &quot;Consent Mode v2&quot;. Dies bedeutet,
                dass Google anonymisierte, cookiefreie &quot;Pings&quot; erhält,
                die keinerlei Rückschlüsse auf Ihre Person zulassen.
              </p>

              <p className="p-primary">
                <strong>Was wir erfassen:</strong>
              </p>

              <p className="p-primary">
                • Anonymisierte Seitenaufrufe (nur Zählung, keine
                Nutzeridentifikation)
                <br />
                • Herkunftsland Ihres Zugriffs (nur Land, keine Stadt oder IP)
                <br />• Grobe Gerätekategorie (Desktop/Mobil) – geschätzt durch
                Google
              </p>

              <p className="p-primary">
                <strong>Was wir NICHT erfassen:</strong>
              </p>

              <p className="p-primary">
                • Keine Cookies auf Ihrem Gerät
                <br />
                • Keine individuelle Nutzerverfolgung
                <br />
                • Keine Profilbildung
                <br />
                • Keine Weitergabe an Werbepartner
                <br />• Keine demografischen Daten (Alter, Geschlecht,
                Interessen)
              </p>

              <p className="p-primary">
                <strong>Rechtsgrundlage:</strong> Die cookiefreien Pings
                erfolgen auf Basis unseres berechtigten Interesses (Art. 6 Abs.
                1 lit. f DSGVO) zur anonymisierten Website-Analyse. Da keine
                personenbezogenen Daten erfasst werden und keine Cookies gesetzt
                werden, ist hierfür keine Einwilligung erforderlich.
              </p>

              <p className="p-primary">
                <strong>Ihr Widerspruchsrecht:</strong> Sie können auch diese
                anonymisierte Erfassung deaktivieren über das{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout?hl=de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Analytics Browser-Add-on
                </a>
                .
              </p>

              <h4 className="h3-secondary">
                Eigene Nutzungsanalyse (PostgreSQL-Datenbank)
              </h4>

              <p className="p-primary">
                Zusätzlich zu Google Analytics betreiben wir ein eigenes
                Analyse-System auf Basis einer PostgreSQL-Datenbank. Dies
                erfolgt unabhängig von Ihrer Cookie-Einwilligung auf Grundlage
                unseres berechtigten Interesses an der Optimierung unserer
                Website und der Sicherheitsüberwachung.
              </p>

              <p className="p-primary">
                <strong>Welche Daten werden erfasst?</strong>
              </p>

              <p className="p-primary">
                • Session-ID (anonyme Sitzungskennung, keine personenbezogenen
                Daten)
                <br />
                • Zeitstempel der Seitenaufrufe
                <br />
                • Besuchte Seiten und Klickpfade
                <br />
                • Klick- und Scroll-Verhalten (über data-tracking-id-Attribute)
                <br />
                • Konfigurator-Auswahl und Konfigurationsdaten (anonymisiert)
                <br />
                • Geografische Daten (Land, Stadt – ermittelt über IP-Hash)
                <br />
                • Traffic-Quelle (Referrer-URL, UTM-Parameter)
                <br />
                • Geräteinformationen (Browser, Betriebssystem)
                <br />
                • Verweildauer auf der Website
                <br />• IP-Adresse (gehasht zur Anonymisierung, nicht im
                Klartext gespeichert)
              </p>

              <p className="p-primary">
                <strong>Zweck der Verarbeitung:</strong>
              </p>

              <p className="p-primary">
                • Optimierung der Website-Funktionalität und Nutzererfahrung
                <br />
                • Sicherheitsüberwachung und Missbrauchserkennung
                <br />
                • Analyse der Konfigurator-Nutzung zur Produktverbesserung
                <br />
                • Technische Fehleranalyse
                <br />• Verständnis des Nutzerverhaltens zur Angebotsoptimierung
              </p>

              <p className="p-primary">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
                (berechtigtes Interesse). Unser berechtigtes Interesse liegt in
                der Optimierung unserer Website, der Gewährleistung der
                Sicherheit und der Verbesserung unseres Angebots. Die IP-Adresse
                wird gehasht, sodass keine direkte Identifizierung möglich ist.
              </p>

              <p className="p-primary">
                <strong>Datenspeicherung:</strong> Die Session-Daten werden in
                einer PostgreSQL-Datenbank gespeichert. Detaillierte
                Analysedaten werden für 30 Tage aufbewahrt, danach werden sie
                gelöscht oder zu aggregierten Statistiken zusammengefasst (ohne
                Personenbezug).
              </p>

              <p className="p-primary">
                <strong>Datenverarbeiter:</strong> Die Datenbank wird bei
                unserem Hosting-Anbieter NeonDB betrieben. Wir haben einen
                Vertrag zur Auftragsverarbeitung abgeschlossen.
              </p>

              <p className="p-primary">
                <strong>Ihr Widerspruchsrecht:</strong> Sie haben das Recht, aus
                Gründen, die sich aus Ihrer besonderen Situation ergeben,
                jederzeit gegen die Verarbeitung Ihrer Daten auf Grundlage von
                Art. 6 Abs. 1 lit. f DSGVO Widerspruch einzulegen. Bitte
                kontaktieren Sie uns hierzu unter den oben angegebenen
                Kontaktdaten.
              </p>
            </div>
          </div>
        </section>

        {/* Zahlungsabwicklung Section */}
        <section id="zahlungsabwicklung" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">Zahlungsabwicklung</h3>

              <h4 className="h3-secondary">Stripe (Zahlungsdienstleister)</h4>

              <p className="p-primary">
                Für die Abwicklung von Zahlungen auf unserer Website nutzen wir
                den Zahlungsdienstleister Stripe. Anbieter ist Stripe Payments
                Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock,
                Dublin, Irland.
              </p>

              <p className="p-primary">
                <strong>Wofür nutzen wir Stripe?</strong>
              </p>

              <p className="p-primary">
                Stripe kommt zum Einsatz bei der Bezahlung unseres
                Konzept-Check-Service (€3.000). Über Stripe können Sie sicher
                und verschlüsselt per Kreditkarte, SEPA-Lastschrift oder anderen
                angebotenen Zahlungsmethoden bezahlen.
              </p>

              <p className="p-primary">
                <strong>Welche Daten werden an Stripe übermittelt?</strong>
              </p>

              <p className="p-primary">
                Wenn Sie eine Zahlung über Stripe vornehmen, werden folgende
                Daten an Stripe übertragen:
              </p>

              <p className="p-primary">
                • Name und E-Mail-Adresse
                <br />
                • Zahlungsinformationen (Kreditkartendaten, Bankverbindung – je
                nach gewählter Zahlungsmethode)
                <br />
                • Transaktions-ID und Betrag
                <br />
                • Rechnungsadresse (sofern angegeben)
                <br />• IP-Adresse (zur Betrugsprävention)
              </p>

              <p className="p-primary">
                <strong>Wichtig:</strong> Die Zahlungsinformationen (z. B.
                Kreditkartennummer) werden direkt von Stripe verarbeitet und
                niemals auf unseren Servern gespeichert. Wir erhalten von Stripe
                lediglich eine Bestätigung über die erfolgreiche oder
                fehlgeschlagene Zahlung sowie eine anonymisierte
                Transaktions-ID.
              </p>

              <p className="p-primary">
                <strong>Rechtsgrundlage:</strong> Die Datenverarbeitung erfolgt
                auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO
                (Vertragserfüllung). Die Verarbeitung Ihrer Daten durch Stripe
                ist notwendig, um die von Ihnen beauftragte Zahlung
                durchzuführen.
              </p>

              <p className="p-primary">
                <strong>Datensicherheit:</strong> Stripe erfüllt die strengen
                PCI-DSS-Standards (Payment Card Industry Data Security Standard)
                zur sicheren Verarbeitung von Zahlungsdaten. Wir haben mit
                Stripe einen Vertrag zur Auftragsverarbeitung abgeschlossen.
              </p>

              <p className="p-primary">
                <strong>Datenübertragung in die USA:</strong> Stripe kann Daten
                in die USA übertragen. Die Übertragung erfolgt auf Grundlage von
                EU-Standardvertragsklauseln oder im Rahmen des EU-US Data
                Privacy Framework.
              </p>

              <p className="p-primary">
                Weitere Informationen zum Datenschutz bei Stripe finden Sie
                unter:{" "}
                <a
                  href="https://stripe.com/de-at/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://stripe.com/de-at/privacy
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* E-Mail-Kommunikation Section */}
        <section id="email-kommunikation" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">E-Mail-Kommunikation</h3>

              <h4 className="h3-secondary">Resend (E-Mail-Versandservice)</h4>

              <p className="p-primary">
                Für den Versand von Transaktions-E-Mails (z. B.
                Terminbestätigungen, Zahlungsbestätigungen) nutzen wir den
                E-Mail-Dienst Resend. Anbieter ist Resend, Inc. mit Sitz in den
                USA.
              </p>

              <p className="p-primary">
                <strong>Welche E-Mails werden über Resend versendet?</strong>
              </p>

              <p className="p-primary">
                • Bestätigung von Terminbuchungen
                <br />
                • Bestätigung von Konzept-Check-Käufen
                <br />
                • Antworten auf Kontaktformular-Anfragen
                <br />• Sonstige transaktionale E-Mails im Zusammenhang mit
                Ihren Anfragen
              </p>

              <p className="p-primary">
                <strong>Welche Daten werden an Resend übermittelt?</strong>
              </p>

              <p className="p-primary">
                • Ihre E-Mail-Adresse (Empfänger)
                <br />
                • Ihr Name (falls angegeben)
                <br />
                • E-Mail-Inhalt (Betreff und Nachrichtentext)
                <br />• Zeitstempel des Versands
              </p>

              <p className="p-primary">
                <strong>Rechtsgrundlage:</strong> Die Verarbeitung erfolgt auf
                Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung),
                sofern die E-Mail im Zusammenhang mit einer vertraglichen
                Beziehung steht, oder auf Grundlage von Art. 6 Abs. 1 lit. f
                DSGVO (berechtigtes Interesse an effizienter
                E-Mail-Kommunikation).
              </p>

              <p className="p-primary">
                <strong>Datenübertragung in die USA:</strong> Resend ist ein
                US-amerikanischer Dienst, sodass Ihre E-Mail-Daten in die USA
                übertragen werden können. Die Übertragung erfolgt auf Grundlage
                von EU-Standardvertragsklauseln. Wir haben mit Resend einen
                Vertrag zur Auftragsverarbeitung abgeschlossen.
              </p>

              <p className="p-primary">
                <strong>Speicherdauer:</strong> Resend speichert die versandten
                E-Mails für maximal 30 Tage zur Zustellungs- und
                Fehlerprotokollierung. Danach werden die E-Mail-Daten gelöscht.
              </p>

              <p className="p-primary">
                Weitere Informationen zum Datenschutz bei Resend finden Sie
                unter:{" "}
                <a
                  href="https://resend.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://resend.com/privacy
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Google-Dienste und externe Tools Section */}
        <section id="google-dienste" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">Google-Dienste und externe Tools</h3>
              <h4 className="h3-secondary">
                Hinweis zur Datenweitergabe in die USA
              </h4>

              <p className="p-primary">
                Wir weisen darauf hin, dass bei Verwendung von Google-Tools
                Daten der Websitebesucher in die USA übertragen werden können.
                Die USA werden vom Europäischen Gerichtshof derzeit als ein Land
                mit nach EU-Maßstäben unzureichendem Datenschutzniveau
                eingeschätzt. US-Unternehmen wie Google sind dazu verpflichtet,
                personenbezogene Daten an Sicherheitsbehörden herauszugeben,
                ohne dass Sie als Betroffener hiergegen gerichtlich vorgehen
                können. Um ein mit der EU vergleichbares Datenschutzniveau in
                den USA zu gewährleisten, haben wir mit den Anbietern, die Daten
                in den USA verarbeiten, sog. EU-Standardvertragsklauseln
                abgeschlossen bzw. stellen wir sicher, dass entsprechende
                Zertifizierungen (z. B. EU-US Data Privacy Framework) vorliegen.
                Die Datenübertragung an Google erfolgt somit auf Grundlage der
                Standardvertragsklauseln oder eines angemessenen
                Datenschutz-Niveaus gemäß Art. 44 ff. DSGVO.
              </p>

              <h4 className="h3-secondary">Google Maps</h4>

              <p className="p-primary">
                Diese Seite nutzt über eine API den Kartendienst Google Maps.
                Anbieter ist ebenfalls Google Ireland Limited, Dublin, Irland.
                Zur Nutzung der Funktionen von Google Maps kann es erforderlich
                sein, Ihre IP-Adresse zu speichern. Diese Informationen werden
                in der Regel an einen Server von Google übertragen und dort
                gespeichert, wobei es zu einer Übermittlung in die USA kommen
                kann. Der Anbieter dieser Seite hat keinen Einfluss auf diese
                Datenübertragung.
              </p>

              <p className="p-primary">
                Die Nutzung von Google Maps erfolgt im Interesse einer
                ansprechenden Darstellung unseres Online-Angebots und einer
                leichten Auffindbarkeit der von uns auf der Website angegebenen
                Orte. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6
                Abs. 1 lit. f DSGVO dar. Sofern eine entsprechende Einwilligung
                abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf
                Grundlage von Art. 6 Abs. 1 lit. a DSGVO; die Einwilligung ist
                jederzeit widerrufbar.
              </p>

              <p className="p-primary">
                Die Datenübertragung in die USA erfolgt, wie oben erwähnt, auf
                Grundlage von EU-Standardvertragsklauseln oder im Rahmen des
                EU-US Data Privacy Framework. Mehr Informationen zum Umgang mit
                Nutzerdaten finden Sie in der Datenschutzerklärung von Google.
              </p>

              <h4 className="h3-secondary">YouTube</h4>

              <p className="p-primary">
                Unsere Website bindet Videos der Plattform YouTube ein. Anbieter
                ist Google Ireland Limited, Dublin, Irland. Wir nutzen YouTube
                im &ldquo;erweiterten Datenschutzmodus&rdquo;. Dieser Modus
                bewirkt laut YouTube, dass YouTube keine Informationen über die
                Besucher auf dieser Website speichert, bevor diese das Video
                ansehen. Dennoch wird beim Starten eines YouTube-Videos eine
                Verbindung zu den YouTube-Servern hergestellt. Dabei wird dem
                YouTube-Server mitgeteilt, welche unserer Seiten Sie besucht
                haben.
              </p>

              <p className="p-primary">
                Wenn Sie in Ihrem YouTube-Account eingeloggt sind, ermöglichen
                Sie YouTube, Ihr Surfverhalten direkt Ihrem persönlichen Profil
                zuzuordnen. Dies können Sie verhindern, indem Sie sich aus Ihrem
                YouTube-Account ausloggen.
              </p>

              <p className="p-primary">
                Des Weiteren kann YouTube nach Start eines Videos verschiedene
                Cookies auf Ihrem Gerät speichern oder vergleichbare
                Wiedererkennungstechnologien (z. B. Device-Fingerprinting)
                verwenden. Auf diese Weise kann YouTube Informationen über
                Besucher dieser Website erhalten. Diese Informationen werden
                unter anderem verwendet, um Videostatistiken zu erfassen, die
                Anwenderfreundlichkeit zu verbessern und Betrugsversuchen
                vorzubeugen. Gegebenenfalls können nach dem Ende eines
                YouTube-Videos weitere Datenverarbeitungsvorgänge ausgelöst
                werden, auf die wir keinen Einfluss haben.
              </p>

              <p className="p-primary">
                Wir nutzen YouTube im Interesse einer ansprechenden Darstellung
                unserer Online-Angebote. Dies stellt ein berechtigtes Interesse
                gemäß Art. 6 Abs. 1 lit. f DSGVO dar. Sofern eine entsprechende
                Einwilligung abgefragt wurde, erfolgt die Verarbeitung
                ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO; die
                Einwilligung ist jederzeit widerrufbar.
              </p>

              <p className="p-primary">
                Weitere Informationen zum Datenschutz bei YouTube finden Sie in
                deren Datenschutzerklärung unter:
                https://policies.google.com/privacy?hl=de.
              </p>

              <h4 className="h3-secondary">Google Web Fonts</h4>

              <p className="p-primary">
                Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten
                sogenannte Web Fonts, die von Google bereitgestellt werden. Beim
                Aufruf einer Seite lädt Ihr Browser die benötigten Web Fonts in
                ihren Browsercache, um Texte und Schriftarten korrekt
                anzuzeigen. Dazu nimmt der von Ihnen verwendete Browser
                Verbindung zu den Servern von Google auf. Hierdurch erlangt
                Google Kenntnis darüber, dass über Ihre IP-Adresse unsere
                Website aufgerufen wurde. Wenn Ihr Browser Web Fonts nicht
                unterstützt, wird eine Standardschrift von Ihrem Computer
                genutzt.
              </p>

              <p className="p-primary">
                Die Nutzung von Google Web Fonts erfolgt im Interesse einer
                einheitlichen und ansprechenden Darstellung unserer
                Online-Angebote (berechtigtes Interesse gemäß Art. 6 Abs. 1 lit.
                f DSGVO). Sofern eine Einwilligung eingeholt wurde, erfolgt die
                Verarbeitung der Daten ausschließlich auf Grundlage von Art. 6
                Abs. 1 lit. a DSGVO; die Einwilligung ist jederzeit widerrufbar.
              </p>

              <p className="p-primary">
                Die Übertragung von Daten in die USA erfolgt entweder auf Basis
                von Standardvertragsklauseln oder im Rahmen eines
                Angemessenheitsbeschlusses (z. B. EU-US Data Privacy Framework).
                Weitere Informationen zu Google Web Fonts finden Sie unter
                https://developers.google.com/fonts/faq und in der
                Datenschutzerklärung von Google:
                https://policies.google.com/privacy?hl=de.
              </p>
            </div>
          </div>
        </section>

        {/* Dauer der Speicherung Section */}
        <section id="speicherdauer" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">Dauer der Speicherung</h3>
              <p className="p-primary">
                Soweit innerhalb dieser Datenschutzerklärung keine speziellere
                Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen
                Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.
                Wenn Sie ein berechtigtes Löschersuchen stellen oder eine
                Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten
                gelöscht, sofern wir nicht rechtlich zur weiteren Speicherung
                verpflichtet sind (z. B. steuer- oder handelsrechtliche
                Aufbewahrungsfristen). In letzterem Fall erfolgt die Löschung
                nach Wegfall der entsprechenden Verpflichtungen.
              </p>

              <h4 className="h3-secondary">
                Spezifische Speicherfristen im Überblick
              </h4>

              <p className="p-primary">
                <strong>Cookies:</strong>
                <br />
                • Notwendige Cookies: 7 bis 365 Tage (je nach Cookie-Typ)
                <br />
                • Analyse-Cookies (Google Analytics): Bis zu 2 Jahre
                <br />
                • Marketing-Cookies: Bis zu 90 Tage
                <br />• Cookie-Einwilligung: 12 Monate (danach erneute Abfrage)
              </p>

              <p className="p-primary">
                <strong>Website-Analyse-Daten:</strong>
                <br />
                • Google Analytics: Nutzerbasierte Daten 14 Monate,
                ereignisbasierte Daten 2 Monate
                <br />• Eigene Nutzungsanalyse (PostgreSQL): Detaillierte
                Session-Daten 30 Tage, danach nur aggregierte Statistiken (ohne
                Personenbezug)
              </p>

              <p className="p-primary">
                <strong>Kontaktanfragen und Terminbuchungen:</strong>
                <br />
                Ihre Kontaktdaten werden gespeichert, bis der Zweck der
                Datenverarbeitung entfällt (z. B. nach abgeschlossener
                Bearbeitung Ihrer Anfrage oder nach Durchführung des Termins).
                Danach werden sie gelöscht, sofern keine gesetzlichen
                Aufbewahrungspflichten bestehen.
              </p>

              <p className="p-primary">
                <strong>Zahlungsdaten (Konzept-Check):</strong>
                <br />
                Transaktionsdaten werden gemäß steuer- und handelsrechtlicher
                Aufbewahrungspflichten für 7 bis 10 Jahre aufbewahrt (§ 147 AO,
                § 257 HGB). Zahlungsinformationen (Kreditkartendaten) werden
                nicht von uns gespeichert, sondern ausschließlich von Stripe
                verarbeitet.
              </p>

              <p className="p-primary">
                <strong>E-Mail-Kommunikation (Resend):</strong>
                <br />
                E-Mail-Versandprotokolle werden von Resend für maximal 30 Tage
                gespeichert.
              </p>

              <p className="p-primary">
                <strong>Server-Log-Dateien:</strong>
                <br />
                Server-Logfiles werden in der Regel nach 7 bis 14 Tagen
                automatisch gelöscht.
              </p>
            </div>
          </div>
        </section>

        {/* Rechte der betroffenen Person Section */}
        <section id="rechte" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">Rechte der betroffenen Person</h3>
              <p className="p-primary">
                Als betroffene Person im Sinne der DSGVO stehen Ihnen die
                folgenden Rechte zu:
              </p>

              <p className="p-primary">
                • Recht auf Auskunft (Art. 15 DSGVO): Sie haben das Recht,
                Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten
                zu erhalten.
              </p>

              <p className="p-primary">
                Insbesondere können Sie Auskunft über die Verarbeitungszwecke,
                die Kategorien personenbezogener Daten, die Kategorien von
                Empfängern, gegenüber denen Ihre Daten offengelegt wurden oder
                werden, die geplante Speicherdauer, das Bestehen eines Rechts
                auf Berichtigung, Löschung, Einschränkung der Verarbeitung oder
                Widerspruch, das Bestehen eines Beschwerderechts, die Herkunft
                Ihrer Daten (sofern wir diese nicht bei Ihnen erhoben haben)
                sowie – falls zutreffend – das Bestehen einer automatisierten
                Entscheidungsfindung einschließlich Profiling verlangen.
              </p>

              <p className="p-primary">
                • Recht auf Berichtigung (Art. 16 DSGVO): Sie haben das Recht,
                unverzüglich die Berichtigung unrichtiger oder Vervollständigung
                Ihrer bei uns gespeicherten personenbezogenen Daten zu
                verlangen.
              </p>

              <p className="p-primary">
                • Recht auf Löschung (Art. 17 DSGVO): Sie haben das Recht, die
                Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu
                verlangen, soweit die Verarbeitung nicht erforderlich ist. Dies
                ist z. B. der Fall, wenn Ihre Daten für die Zwecke, für die sie
                erhoben wurden, nicht mehr notwendig sind, Sie Ihre Einwilligung
                widerrufen haben oder die Verarbeitung unrechtmäßig erfolgte.
              </p>

              <p className="p-primary">
                • Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO): Sie
                haben das Recht, die Einschränkung der Verarbeitung Ihrer
                personenbezogenen Daten zu verlangen, solange die Richtigkeit
                der Daten von Ihnen bestritten wird, wenn Sie anstelle einer
                Löschung die Einschränkung der Verarbeitung verlangen, wenn wir
                die Daten nicht mehr benötigen, Sie diese jedoch zur
                Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen
                benötigen, oder wenn Sie Widerspruch gegen die Verarbeitung
                eingelegt haben, solange noch nicht feststeht, ob unsere
                berechtigten Gründe überwiegen.
              </p>

              <p className="p-primary">
                • Recht auf Datenübertragbarkeit (Art. 20 DSGVO): Sie haben das
                Recht, die Sie betreffenden personenbezogenen Daten, die Sie uns
                bereitgestellt haben, in einem gängigen, maschinenlesbaren
                Format zu erhalten oder die Übermittlung an einen anderen
                Verantwortlichen zu verlangen, soweit dies technisch machbar
                ist.
              </p>

              <p className="p-primary">
                • Recht auf Widerspruch (Art. 21 DSGVO): Wenn Ihre Daten auf
                Grundlage von berechtigten Interessen (Art. 6 Abs. 1 lit. f
                DSGVO) oder im öffentlichen Interesse (Art. 6 Abs. 1 lit. e
                DSGVO) verarbeitet werden, haben Sie das Recht, aus Gründen, die
                sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die
                Verarbeitung Widerspruch einzulegen.
              </p>

              <p className="p-primary">
                Werden Ihre Daten verarbeitet, um Direktwerbung zu betreiben,
                haben Sie ein generelles Widerspruchsrecht, das ohne Angabe
                einer besonderen Situation von uns umgesetzt wird.
              </p>

              <p className="p-primary">
                • Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO): Sie
                haben das Recht, eine einmal erteilte Einwilligung zur
                Verarbeitung Ihrer Daten jederzeit mit Wirkung für die Zukunft
                zu widerrufen. Die Rechtmäßigkeit der Verarbeitung bis zum
                Widerruf bleibt hiervon unberührt.
              </p>

              <p className="p-primary">
                • Beschwerderecht bei der Aufsichtsbehörde (Art. 77 DSGVO): Wenn
                Sie der Ansicht sind, dass die Verarbeitung Ihrer
                personenbezogenen Daten gegen die DSGVO verstößt, steht Ihnen
                ein Beschwerderecht bei einer Aufsichtsbehörde zu.
              </p>

              <p className="p-primary">
                Sie können sich hierfür z. B. an die Datenschutzbehörde in dem
                Mitgliedstaat Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder
                des Orts des mutmaßlichen Verstoßes wenden. In Österreich ist
                die zuständige Aufsichtsbehörde die Österreichische
                Datenschutzbehörde (Barichgasse 40–42, 1030 Wien,
                www.dsb.gv.at).
              </p>
            </div>
          </div>
        </section>

        {/* Aktualität und Änderung Section */}
        <section id="aktualitaet" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">
                Aktualität und Änderung dieser Datenschutzerklärung
              </h3>
              <p className="p-primary">
                Diese Datenschutzerklärung hat den Stand von Dezember 2025.
              </p>

              <p className="p-primary">
                Wir behalten uns vor, den Inhalt dieser Erklärung jederzeit
                anzupassen, sofern dies erforderlich sein sollte (etwa bei
                gesetzlichen Änderungen oder neuen Angeboten auf unserer
                Website). Die jeweils aktuelle Datenschutzerklärung kann
                jederzeit auf unserer Website eingesehen werden.
              </p>

              <p className="p-primary text-center">
                Stand: {new Date().toLocaleDateString("de-AT")}
              </p>
            </div>
          </div>
        </section>
      </SectionRouter>
      <Footer />
    </div>
  );
}
