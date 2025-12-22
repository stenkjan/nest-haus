"use client";

import { useState, useEffect } from "react";
import { resetAlphaTest } from "@/components/testing/config/TestQuestions";

export default function AlphaTestClient() {
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
                ®Hoam House 🧪 Alpha Test
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
