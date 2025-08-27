"use client";

import { useState, useEffect } from "react";
import { resetAlphaTest } from "@/components/testing/config/TestQuestions";

export default function AlphaTestDemo() {
  const [_agreed, _setAgreed] = useState(false);
  const [name, setName] = useState("");

  // Force alpha-test parameter in URL
  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    if (!currentUrl.searchParams.has("alpha-test")) {
      currentUrl.searchParams.set("alpha-test", "true");
      window.history.replaceState({}, "", currentUrl.toString());
    }
  }, []);

  const handleStart = () => {
    if (!name.trim()) {
      alert("Bitte gib deinen Namen ein.");
      return;
    }

    // Clear any existing test data first
    resetAlphaTest();

    // Store user name for the test session
    localStorage.setItem("nest-haus-test-user-name", name.trim());

    // Set flag to auto-open popup after navigation
    localStorage.setItem("alphaTestNavigationTriggered", "true");

    // Navigate to landing page
    window.location.href = "/?alpha-test=true";
  };

  const handleReset = () => {
    if (confirm("Möchtest du alle Testdaten zurücksetzen?")) {
      resetAlphaTest();
      setName("");
      alert("Test wurde zurückgesetzt. Du kannst nun neu beginnen.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <div></div>
              <h1 className="text-4xl font-bold text-gray-900">
                ®Nest Haus 🧪 Alpha Test
              </h1>
              <button
                onClick={handleReset}
                className="text-gray-400 hover:text-red-600 transition-colors p-2"
                title="Test zurücksetzen"
              >
                <span className="text-2xl">🔄</span>
              </button>
            </div>
            <p className="text-xl text-gray-600">
              Willkommen zum Alpha-Test unserer Website 🍻
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Ablauf
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <ol className="space-y-4 text-blue-700">
                  {[1, 2, 3].map((num) => (
                    <li className="flex items-start" key={num}>
                      <span
                        className="flex items-center justify-center mr-3 mt-0.5 rounded-full bg-blue-600 text-white font-bold text-sm"
                        style={{
                          width: "1.5rem",
                          height: "1.5rem",
                          minWidth: "1.5rem",
                          minHeight: "1.5rem",
                          display: "inline-flex",
                        }}
                      >
                        {num}
                      </span>
                      <span>
                        {num === 1 && (
                          <>
                            <strong>Du willst ein Haus bauen</strong> - mache
                            dir selbstständig einen Überblick über die Seite,
                            wechsle durch die einzelnen Unterseiten und schaue
                            dir genau das an, was dich anspricht.
                          </>
                        )}
                        {num === 2 && (
                          <>
                            <strong>Jetzt geht es an die Substanz</strong> -
                            gestalte dir dein Haus mit unserem Konfigurator,
                            schaue dir dabei jede Sektion an und treffe eine
                            Auswahl, bestelle das Haus anschließend und führe
                            dabei den Kaufabschluss bis zum Ende durch (Keine
                            Angst, du musst es nicht wirklich kaufen ;-)
                          </>
                        )}
                        {num === 3 && (
                          <>
                            <strong>Beantworte den Feedback-Fragebogen</strong>{" "}
                            um den Test zu beenden.
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* 
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Datenschutz und Teilnahmebedingungen
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="text-gray-700 space-y-3 text-sm leading-relaxed">
                  <p>
                    <strong>
                      Der Test ist freiwillig und kann jederzeit abgebrochen
                      werden.
                    </strong>{" "}
                    Die Daten werden ausschließlich für die Analyse des
                    Nutzungsverhaltens und zur Verbesserung der
                    Nutzerfreundlichkeit verwendet.
                  </p>
                  <p>
                    Während des Tests werden folgende Daten erfasst: Ihre
                    Interaktionen mit der Website (Klicks, Scrollverhalten,
                    Verweildauer), technische Informationen zu Ihrem Gerät
                    (Bildschirmauflösung, Browser-Typ), Ihre Antworten auf
                    Fragen zur Benutzerfreundlichkeit sowie eventuelle
                    Fehlermeldungen oder technische Probleme.
                  </p>
                  <p>
                    Alle erhobenen Daten werden anonymisiert gespeichert und
                    können nicht zu Ihrer Person zurückverfolgt werden. Der von
                    Ihnen angegebene Name dient lediglich der internen Zuordnung
                    und wird nicht mit anderen Daten verknüpft oder an Dritte
                    weitergegeben.
                  </p>
                  <p>
                    Die Daten werden für einen Zeitraum von maximal 12 Monaten
                    gespeichert und anschließend automatisch gelöscht. Sie haben
                    jederzeit das Recht, die Löschung Ihrer Daten zu verlangen
                    oder Auskunft über die gespeicherten Informationen zu
                    erhalten.
                  </p>
                  <p>
                    Die Teilnahme am Test erfolgt auf freiwilliger Basis. Es
                    entstehen Ihnen keine Nachteile, wenn Sie den Test nicht
                    durchführen oder vorzeitig beenden. Die Nutzung unserer
                    Website ist auch ohne Teilnahme am Test vollständig möglich.
                  </p>
                  <p>
                    Ihre Daten werden ausschließlich auf Servern innerhalb der
                    Europäischen Union gespeichert und verarbeitet. Wir halten
                    uns dabei strikt an die Bestimmungen der
                    Datenschutz-Grundverordnung (DSGVO).
                  </p>
                  <p>
                    Die Ergebnisse des Tests werden nur in aggregierter und
                    anonymisierter Form für interne Analysen verwendet. Einzelne
                    Antworten oder Verhaltensweisen können nicht zu bestimmten
                    Personen zurückverfolgt werden.
                  </p>
                  <p>
                    Bei technischen Problemen oder Fragen zum Datenschutz können
                    Sie sich jederzeit an unser Support-Team wenden.
                    Kontaktinformationen finden Sie in unserem Impressum.
                  </p>
                  <p>
                    Mit der Teilnahme am Test bestätigen Sie, dass Sie
                    mindestens 16 Jahre alt sind oder die
                    Einverständniserklärung eines Erziehungsberechtigten
                    vorliegt.
                  </p>
                  <p>
                    Der Test kann jederzeit durch Schließen des Test-Popups oder
                    Verlassen der Website beendet werden. Bereits erfasste Daten
                    werden in diesem Fall nach 7 Tagen automatisch gelöscht.
                  </p>
                  <p>
                    Wir verwenden keine Tracking-Cookies oder externe
                    Analysedienste während des Tests. Alle Datenerfassung
                    erfolgt direkt über unsere eigenen, DSGVO-konformen Server.
                  </p>
                  <p>
                    Die Teilnahme am Test berechtigt nicht zu
                    Gewährleistungsansprüchen oder Schadenersatzforderungen. Der
                    Test dient ausschließlich der Verbesserung unserer
                    Website-Qualität.
                  </p>
                </div>
              </div>
            </section>
            */}

            {/* 
            <section>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="agreement"
                    className="text-gray-700 cursor-pointer"
                  >
                    Ich habe die Datenschutz- und Teilnahmebedingungen gelesen
                    und stimme der Erhebung und Verarbeitung meiner Daten wie
                    beschrieben zu.
                  </label>
                </div>
            */}

            <section>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name (Vor-/ Nachname)
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bsp.: Max M."
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleStart}
                    disabled={!name.trim()}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Starten
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
