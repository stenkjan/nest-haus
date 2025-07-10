"use client";

import { Suspense } from "react";
import { GrundstueckCheckDialog } from "@/components/dialogs";
import { HybridBlobImage } from "@/components/images";
import { IMAGES } from "@/constants/images";

// Embedded Calendar Component for Contact Page
const ContactCalendar = () => {
  // Generate calendar days for January 2025
  const renderCalendar = () => {
    const year = 2025;
    const month = 0; // January (0-indexed)

    // First day of the month (0 = Sunday, 1 = Monday, etc.)
    let firstDay = new Date(year, month, 1).getDay();
    if (firstDay === 0) firstDay = 7; // Adjust Sunday to be 7 instead of 0

    // Last date of the month
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = [];
    const daysOfWeek = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

    // Days of week header
    daysOfWeek.forEach((day) => {
      days.push(
        <div
          key={day}
          className="text-center p-2 text-xs font-medium text-gray-500"
        >
          {day}
        </div>
      );
    });

    // Empty cells for days before the first day of the month
    for (let i = 1; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-center p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= lastDate; day++) {
      const date = new Date(year, month, day);
      const isToday = day === 13; // Highlight 13th as example selected date
      const isPast = day < 13;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isAvailable = !isPast && !isWeekend;

      days.push(
        <div
          key={day}
          className={`text-center p-2 rounded-full text-sm cursor-pointer transition-colors
            ${isToday ? "bg-blue-600 text-white" : ""}
            ${!isAvailable ? "text-gray-300 cursor-not-allowed" : "hover:bg-blue-50"}
            ${isAvailable && !isToday ? "text-gray-700" : ""}
          `}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="text-center mb-4">
        <h3 className="font-semibold text-gray-900">Jänner 2025</h3>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">{renderCalendar()}</div>

      <div className="space-y-3">
        <div className="text-center">
          <span className="text-sm text-gray-600">13. Jänner 2025</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <button className="p-2 bg-gray-100 rounded text-center">8:00</button>
          <button className="p-2 bg-blue-600 text-white rounded text-center">
            10:00
          </button>
          <button className="p-2 bg-gray-100 rounded text-center">14:00</button>
        </div>

        <div className="pt-4">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors">
            Termin anfragen
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Vereinbare jetzt deinen Termin - Section 1 */}
      <section className="relative bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Vereinbare jetzt deinen Termin
            </h1>
            <p className="text-lg text-gray-600 mb-2">Wir beraten gerne.</p>
            <p className="text-sm text-gray-500">Jänner 2025</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left side - Calendar and contact info */}
            <div className="space-y-8">
              {/* Calendar component */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <ContactCalendar />
              </div>

              {/* Contact information */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Kontakt</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>📧 office@nest-haus.at</p>
                    <p>📱 +43 1 234 5678</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Adresse</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>NEST Haus GmbH</p>
                    <p>Musterstraße 123</p>
                    <p>1010 Wien, Österreich</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Additional info */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Beratungstermin vereinbaren
                </h3>
                <p className="text-blue-800 mb-4">
                  Lass uns dein Traumhaus gemeinsam planen. In einem
                  persönlichen Gespräch besprechen wir deine Wünsche und
                  Vorstellungen.
                </p>
                <ul className="space-y-2 text-blue-800">
                  <li>✓ Kostenlose Erstberatung</li>
                  <li>✓ Individuelle Planung</li>
                  <li>✓ Transparente Preise</li>
                </ul>
              </div>

              <div className="text-center">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Termin Anfragen
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wo du uns findest - Section 2 */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Wo du uns findest
            </h2>
            <p className="text-lg text-gray-600">
              Komm vorbei und lass dich von unserem Team beraten.
            </p>
          </div>

          {/* Map image - Optimized for client-side loading */}
          <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
            <HybridBlobImage
              path={IMAGES.function.nestHausGrundstueckCheck}
              strategy="client"
              isAboveFold={false}
              isCritical={false}
              isInteractive={false}
              enableCache={true}
              enableMobileDetection={false}
              showLoadingSpinner={false}
              alt="NEST Haus Standort und Grundstück Check"
              width={1200}
              height={675}
              sizes="(max-width: 768px) 100vw, 90vw"
              className="w-full h-auto object-cover"
              priority={false}
            />
          </div>
        </div>
      </section>

      {/* Dein Grundstück - Unser Check - Section 3 */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Dein Grundstück - Unser Check
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Wir überprüfen für dich wie dein neues Haus auf ein Grundstück
              deiner Wahl passt
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Information */}
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Bevor dein Traum vom Nest-Haus Realität wird, ist es wichtig,
                  dass dein Grundstück alle{" "}
                  <span className="font-semibold">
                    rechtlichen und baulichen Anforderungen
                  </span>{" "}
                  erfüllt. Genau hier setzen wir an!
                </p>

                <p className="text-gray-700 leading-relaxed">
                  <span className="font-bold">Für nur € 200,-</span> übernehmen
                  wir für dich die Prüfung der relevanten Rahmenbedingungen und
                  Baugesetze, um dir{" "}
                  <span className="font-bold">Sicherheit und Klarheit</span> zu
                  verschaffen. Jetzt den{" "}
                  <span className="font-bold">Quick-Check</span> machen und uns
                  die rechtlichen und baulichen Voraussetzungen deines
                  Grundstücks prüfen lassen, damit du{" "}
                  <span className="font-bold">
                    entspannt und sicher in die Planung deines Nest-Hauses
                    starten
                  </span>{" "}
                  kannst.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Was wir prüfen
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Rechtliche Rahmenbedingungen: Wir prüfen, ob dein Grundstück
                    den Vorgaben des jeweiligen Landes-Baugesetzes, des
                    Raumordnungsgesetzes und ortsgebundener Vorschriften
                    entspricht.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Baugesetze
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Alle relevanten Bauvorschriften werden detailliert
                    überprüft, um sicherzustellen, dass dein Bauvorhaben
                    genehmigungsfähig ist. Geeignetheit des Grundstücks: Wir
                    stellen fest, ob dein Grundstück alle notwendigen
                    Voraussetzungen für den Aufbau deines Nest-Hauses erfüllt.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <Suspense
                fallback={
                  <div className="animate-pulse bg-gray-200 h-96 rounded"></div>
                }
              >
                <GrundstueckCheckDialog />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
