"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { useDeviceDetect } from "@/hooks";

import { ImageGallery } from "@/components/grids";
import {
  ContactMap,
  AppointmentBookingSection,
  GrundstueckCheckForm,
  GetInContactBanner,
} from "@/components/sections";
import Footer from "@/components/Footer";

// Define sections for kontakt page
const sections = [
  { id: "calendar", title: "Terminvereinbarung", slug: "termin" },
  { id: "address", title: "Wo du uns findest", slug: "standort" },
  { id: "contact", title: "Grundstück Check", slug: "grundstueck-check" },
  { id: "impressum", title: "Impressum", slug: "impressum" },
  { id: "call-to-action", title: "Kein Plan? Kein Problem!", slug: "beratung" },
  { id: "gallery", title: "Bildergalerie", slug: "galerie" },
];

export default function KontaktClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("calendar");
  const { isMobile: _isMobile } = useDeviceDetect();

  return (
    <div className="min-h-screen pt-16">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Vereinbare jetzt deinen Termin - Section 1 */}
        <div id="calendar">
          <AppointmentBookingSection backgroundColor="white" maxWidth={false} />
        </div>

        {/* Wo du uns findest - Section 2 */}
        <div id="address">
          <ContactMap backgroundColor="gray" maxWidth={false} />
        </div>

        {/* Dein Grundstück - Unser Check - Section 3 */}
        <div id="contact">
          <GrundstueckCheckForm backgroundColor="white" maxWidth={false} />
        </div>

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

        {/* Get In Contact Banner Section */}
        <GetInContactBanner
          id="call-to-action"
          title="Kein Plan? Kein Problem!"
          subtitle="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch"
          buttonText="Jetzt vereinbaren"
          backgroundColor="#F4F4F4"
          onButtonClick={() => {
            // Scroll to calendar section for appointment booking
            const calendarSection = document.getElementById("calendar");
            if (calendarSection) {
              calendarSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />

        {/* Image Gallery Section */}
        <section id="gallery">
          <ImageGallery
            useHeroImages={true}
            backgroundColor="white"
            maxWidth={false}
          />
        </section>
      </SectionRouter>
      <Footer />
    </div>
  );
}
