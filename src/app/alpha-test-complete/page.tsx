"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AlphaTestCompletion() {
  const [additionalFeedback, setAdditionalFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if user completed the test
    const urlParams = new URLSearchParams(window.location.search);
    const completed = urlParams.get("completed") === "true";
    setIsCompleted(completed);
  }, []);

  const handleSubmitFeedback = async () => {
    if (!additionalFeedback.trim()) {
      return; // Allow empty feedback
    }

    setIsSubmitting(true);

    try {
      // Get testSessionId from localStorage or URL params
      let testSessionId = localStorage.getItem("nest-haus-test-session-id");

      // If not in localStorage, try to get from URL params (backup)
      if (!testSessionId) {
        const urlParams = new URLSearchParams(window.location.search);
        testSessionId = urlParams.get("testId");
      }

      console.log(
        "🧪 Submitting additional feedback with testId:",
        testSessionId
      );

      if (!testSessionId) {
        console.warn(
          "⚠️ No testSessionId found, skipping additional feedback submission"
        );
        alert(
          "Test-Session nicht gefunden. Das Feedback konnte nicht gespeichert werden."
        );
        setAdditionalFeedback("");
        return;
      }

      const response = await fetch("/api/usability-test/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: testSessionId,
          stepId: "additional-feedback",
          responses: [
            {
              questionId: "additional-feedback",
              questionType: "TEXT",
              questionText: "Zusätzliche Fragen oder Anmerkungen",
              response: additionalFeedback,
              responseTime: 0,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log("✅ Additional feedback submitted successfully");

      // Clear test data only after successful submission
      localStorage.removeItem("nest-haus-test-session-id");
      localStorage.removeItem("nest-haus-test-step1-completed");
      localStorage.removeItem("nest-haus-test-step2-completed");
      localStorage.removeItem("nest-haus-test-step3-completed");
      localStorage.removeItem("nest-haus-test-purchase-completed");
      localStorage.removeItem("nest-haus-test-completed");
      localStorage.removeItem("nest-haus-test-user-name");

      alert("Vielen Dank für dein zusätzliches Feedback!");
      setAdditionalFeedback("");
    } catch (error) {
      console.error("❌ Failed to submit additional feedback:", error);
      alert("Fehler beim Senden des Feedbacks. Bitte versuch es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Alpha Test
            </h1>
            <p className="text-gray-600">
              Diese Seite ist nur nach Abschluss des Alpha-Tests verfügbar.
            </p>
            <div className="mt-6">
              <a
                href="/alpha-test-demo"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Zum Alpha-Test
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Vielen Dank für die Teilnahme an unserem Test!
            </h1>
            <p className="text-lg text-gray-600">Wir werten die Fragen aus.</p>
            <p className="text-lg text-gray-600 mt-2">
              Die nächste Runde geht auf uns! 🍻
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">
                Deine Teilnahme hilft uns dabei:
              </h2>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>
                    Die Benutzerfreundlichkeit unserer Website zu verbessern
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Den Konfigurator intuitiver zu gestalten</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Den Bestellprozess zu optimieren</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Inhalte verständlicher zu präsentieren</span>
                </li>
              </ul>
            </div>

            <div>
              <label
                htmlFor="additional-feedback"
                className="block text-sm font-medium text-gray-700 mb-3"
              >
                Zusätzliche Fragen oder Anmerkungen
              </label>
              <textarea
                id="additional-feedback"
                value={additionalFeedback}
                onChange={(e) => setAdditionalFeedback(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Hast du noch weitere Anmerkungen, Fragen oder Verbesserungsvorschläge? (Optional)"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Wird gesendet...
                  </div>
                ) : (
                  "Feedback senden"
                )}
              </button>

              <Link
                href="/"
                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-center"
              >
                Zur Startseite
              </Link>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Ihre Daten werden anonymisiert ausgewertet und helfen uns, die
                NEST-Haus Website kontinuierlich zu verbessern.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
