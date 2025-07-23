"use client";

import React, { useState, Suspense } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { useDeviceDetect } from "@/hooks";
import AppointmentBooking from "./components/AppointmentBooking";
import GrundstueckCheckWrapper from "./components/GrundstueckCheckWrapper";

// Define sections for kontakt page
const sections = [
  { id: "calendar", title: "Terminvereinbarung", slug: "termin" },
  { id: "address", title: "Wo du uns findest", slug: "standort" },
  { id: "contact", title: "Grundstück Check", slug: "grundstueck-check" },
  { id: "impressum", title: "Impressum", slug: "impressum" },
];

export default function KontaktClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("calendar");
  const { isMobile: _isMobile } = useDeviceDetect();

  return (
    <div className="min-h-screen pt-16">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Vereinbare jetzt deinen Termin - Section 1 */}
        <section id="calendar" className="w-full py-16 bg-white">
          <div className="w-full px-[7.5%]">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-1 lg:mb-1.5 text-center">
              Vereinbare jetzt deinen Termin
            </h2>
            <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl mb-8 lg:mb-12 max-w-3xl mx-auto text-center">
              Wir helfen gerne.
            </h3>
            <Suspense
              fallback={
                <div className="animate-pulse bg-gray-200 h-96 rounded max-w-5xl mx-auto"></div>
              }
            >
              <AppointmentBooking />
            </Suspense>
          </div>
        </section>

        {/* Wo du uns findest - Section 2 */}
        <section id="address" className="w-full py-16 bg-gray-50">
          <div className="w-full px-[8%]">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-1 lg:mb-1.5 text-center">
              Wo du uns findest
            </h2>
            <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl mb-8 lg:mb-8 max-w-3xl mx-auto text-center">
              Komm vorbei um deinen Traum mit uns zu besprechen.
            </h3>
            <div
              className="relative h-[600px] w-full bg-white rounded-[60px] overflow-hidden shadow-xl"
              style={{ border: "15px solid #F4F4F4" }}
            >
              <iframe
                title="Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2717.0612860304307!2d15.416334776632444!3d47.08126897114428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476e3352d2429edf%3A0x3a9430b9a0f0fd25!2sKarmeliterplatz%201%2C%208010%20Graz%2C%20Austria!5e0!3m2!1sen!2sus!4v1712087456318!5m2!1sen!2sus"
                width="600"
                height="450"
                style={{ width: "100%", height: "100%", border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>

        {/* Dein Grundstück - Unser Check - Section 3 */}
        <section id="contact" className="w-full py-16">
          <div className="w-full px-[7.5%]">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-1 lg:mb-1.5 text-center">
              Dein Grundstück - Unser Check
            </h2>
            <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl mb-8 lg:mb-12 max-w-3xl mx-auto text-center">
              Wir überprüfen für dich wie dein neues Haus auf ein Grundstück
              deiner Wahl passt
            </h3>

            <Suspense
              fallback={
                <div className="animate-pulse bg-gray-200 h-96 rounded"></div>
              }
            >
              <GrundstueckCheckWrapper />
            </Suspense>
          </div>
        </section>

        {/* Impressum - Section 4 */}
        <section id="impressum" className="w-full py-16 bg-gray-50">
          <div className="w-full px-[5%]">
            <div className="text-center mb-6">
              <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-1 lg:mb-1.5 text-center">
                Impressum
              </h2>
              <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl mb-8 lg:mb-8 max-w-3xl mx-auto text-center">
                Alle wichtigen Infos und Vorgaben, damit dein Projekt sicher auf
                festen Regeln steht.
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-8 text-gray-700 w-full max-w-4xl mx-auto">
              <div>
                <p className="text-lg leading-6 mb-4">
                  Mit Nest erreichst du in Rekordzeit dein Traumhaus. Unsere
                  seriell gefertigten Module überzeugen durch ihre einfache
                  Transportierbarkeit und schnelle Fertigung. Dank eines
                  durchdachten Konzepts wird dein Haus in wenigen Wochen vom
                  Zimmerer-Werkstatt direkt auf dein Grundstück geliefert und
                  verwandelt sich rasch in dein Eigenheim.Mit Nest erreichst du
                  in Rekordzeit dein Traumhaus. Unsere seriell gefertigten
                  Module überzeugen durch ihre einfache Transportierbarkeit und
                  schnelle Fertigung. Dank eines durchdachten Konzepts wird dein
                  Haus in wenigen Wochen vom Zimmerer-Werkstatt direkt auf dein
                  Grundstück geliefert und verwandelt sich rasch in dein
                  Eigenheim.Mit Nest erreichst du in Rekordzeit dein Traumhaus.
                  Unsere seriell gefertigten Module überzeugen durch ihre
                  einfache Transportierbarkeit und schnelle Fertigung.
                </p>
                <p className="text-lg leading-6 mb-4">
                  Dank eines durchdachten Konzepts wird dein Haus in wenigen
                  Wochen vom Zimmerer-Werkstatt direkt auf dein Grundstück
                  geliefert und verwandelt sich rasch in dein Eigenheim.Mit Nest
                  erreichst du in Rekordzeit dein Traumhaus. Unsere seriell
                  gefertigten Module überzeugen durch ihre einfache
                  Transportierbarkeit und schnelle Fertigung. Dank eines
                  durchdachten Konzepts wird dein Haus in wenigen Wochen vom
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg mb-4">
                  Kontaktinformationen
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-2">SustainNest GmbH</h5>
                    <p className="text-gray-600">
                      Karmeliterplatz 1<br />
                      8010 Graz
                      <br />
                      Österreich
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Kontakt</h5>
                    <p className="text-gray-600">
                      Telefon: 03847 75090
                      <br />
                      Mobil: 0664 394 9604
                      <br />
                      Email: hello@nest.at
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionRouter>
    </div>
  );
}
