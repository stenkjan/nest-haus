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
    id: "analyse-tools",
    title: "Analyse-Tools und Werbung",
    slug: "analyse-tools",
  },
  {
    id: "plugins",
    title: "Plugins und eingebettete Funktionen",
    slug: "plugins",
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
                SustainNest GmbH
                <br />
                Zösenberg 51, 8044 Weinitzen
                <br />
                Telefon: +43 (0) 664 5403399
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
              <h3 className="h3-secondary">Externes Hosting</h3>

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

              <h3 className="h3-secondary">Server-Log-Dateien</h3>

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
            </div>
          </div>
        </section>

        {/* Analyse-Tools und Werbung Section */}
        <section id="analyse-tools" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">Analyse-Tools und Werbung</h3>
              <h3 className="h3-secondary">
                Hinweis zur Datenweitergabe in die USA
              </h3>

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

              <p className="p-primary">
                Google Analytics: Diese Website nutzt Funktionen des
                Webanalysedienstes Google Analytics. Anbieter ist die Google
                Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland
                (&ldquo;Google&rdquo;). Google Analytics ermöglicht es uns, das
                Verhalten der Websitebesucher zu analysieren. Dabei werden
                Cookies eingesetzt, die eine Analyse Ihrer Benutzung der Website
                ermöglichen. Die hierdurch erzeugten Informationen über Ihre
                Benutzung dieser Website (einschließlich Ihrer gekürzten
                IP-Adresse) werden in der Regel an einen Server von Google
                übertragen und dort gespeichert.
              </p>

              <p className="p-primary">
                Wir verwenden Google Analytics in der Regel in der aktuellen
                Version (z. B. Google Analytics 4) mit IP-Anonymisierung. Das
                bedeutet, Ihre IP-Adresse wird von Google innerhalb der
                Europäischen Union oder im Europäischen Wirtschaftsraum vor der
                Übermittlung in die USA gekürzt. Nur in Ausnahmefällen wird die
                volle IP-Adresse an einen Server von Google in den USA
                übertragen und dort gekürzt. Die im Rahmen von Google Analytics
                von Ihrem Browser übermittelte IP-Adresse wird nach Angaben von
                Google nicht mit anderen Daten von Google zusammengeführt.
              </p>

              <p className="p-primary">
                Google wird diese Informationen in unserem Auftrag benutzen, um
                Ihre Nutzung der Website auszuwerten, Reports über die
                Websiteaktivitäten zusammenzustellen und weitere mit der
                Websitenutzung und der Internetnutzung verbundene
                Dienstleistungen gegenüber uns zu erbringen. Wir haben mit
                Google einen Vertrag zur Auftragsverarbeitung abgeschlossen.
              </p>

              <p className="p-primary">
                Die Setzung von Google-Analytics-Cookies und die Nutzung dieses
                Analysetools erfolgen nur mit Ihrer ausdrücklichen Einwilligung
                (Art. 6 Abs. 1 lit. a DSGVO). Sie können diese Einwilligung
                jederzeit mit Wirkung für die Zukunft widerrufen, indem Sie die
                entsprechenden Cookie-Einstellungen über unseren Consent-Manager
                anpassen oder die Verwendung von Google Analytics in Ihrem
                Browser deaktivieren.
              </p>

              <p className="p-primary">
                Zudem können Sie die Erfassung der durch Google Analytics
                erzeugten und auf Ihre Nutzung der Website bezogenen Daten
                (inkl. Ihrer IP-Adresse) an Google sowie die Verarbeitung dieser
                Daten durch Google verhindern, indem Sie das unter folgendem
                Link verfügbare Browser-Plugin herunterladen und installieren:
                Google Analytics Opt-Out Plugin.
              </p>

              <p className="p-primary">
                Mehr Informationen zum Umgang mit Nutzerdaten bei Google
                Analytics finden Sie in der Datenschutzerklärung von Google.
              </p>
            </div>
          </div>
        </section>

        {/* Plugins und eingebettete Funktionen Section */}
        <section id="plugins" className="w-full py-16">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="h3-secondary">
                Plugins und eingebettete Funktionen
              </h3>
              <h3 className="h3-secondary">Google Maps</h3>

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

              <h3 className="h3-secondary">YouTube</h3>

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

              <h3 className="h3-secondary">Google Web Fonts</h3>

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
                Diese Datenschutzerklärung hat den Stand von August 2025.
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
