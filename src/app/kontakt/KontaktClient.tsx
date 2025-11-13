"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { useDeviceDetect } from "@/hooks";

// import { ImageGallery } from "@/components/grids";
import {
  ContactMap as _ContactMap,
  AppointmentBookingSection,
  GrundstueckCheckForm,
  GetInContactBanner,
  LandingImagesCarousel as _LandingImagesCarousel,
  SectionHeader,
} from "@/components/sections";
import Footer from "@/components/Footer";

// Define sections for kontakt page
const sections = [
  { id: "calendar", title: "Terminvereinbarung", slug: "termin" },
  { id: "contact", title: "Grundstück Check", slug: "grundstueck-check" },
  { id: "address", title: "Wo du uns findest", slug: "standort" },
  { id: "impressum", title: "Impressum", slug: "impressum" },
  { id: "call-to-action", title: "Kein Plan? Kein Problem!", slug: "beratung" },
  { id: "gallery", title: "Bildergalerie", slug: "galerie" },
];

export default function KontaktClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("calendar");
  const { isMobile: _isMobile } = useDeviceDetect();

  return (
    <div
      className="min-h-screen"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Vereinbare jetzt deinen Termin - Section 1 */}
        <AppointmentBookingSection
          id="calendar"
          backgroundColor="white"
          maxWidth={false}
        />

        {/* Dein Grundstück - Unser Check - Section 2 */}
        <GrundstueckCheckForm
          id="contact"
          backgroundColor="white"
          maxWidth="max-w-[1440px]"
        />

        {/* Wo du uns findest - Section 3 */}
        <div className="w-full py-16 bg-gray-50">
          <SectionHeader
            title="Wo du uns findest"
            subtitle="Komm vorbei um deinen Traum mit uns zu besprechen."
            titleClassName="text-black"
            subtitleClassName="text-black"
            wrapperMargin="mb-12"
          />
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div
              id="address"
              className="relative h-[600px] w-full bg-white rounded-[60px] overflow-hidden shadow-xl"
              style={{ border: "15px solid #F4F4F4" }}
            >
              <iframe
                title="Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2717.0612860304307!2d15.416334776632444!3d47.08126897114428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476e3352d2429edf%3A0x3a9430b9a0f0fd25!2sKarmeliterplatz%208%2C%208010%20Graz%2C%20Austria!5e0!3m2!1sen!2sus!4v1712087456318!5m2!1sen!2sus"
                width="600"
                height="450"
                style={{ width: "100%", height: "100%", border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Get In Contact Banner Section */}
        <GetInContactBanner
          id="call-to-action"
          title="Kein Plan? Kein Problem!"
          subtitle="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch"
          buttonText="Jetzt Termin sichern"
          backgroundColor="white"
          onButtonClick={() => {
            // Scroll to calendar section for appointment booking
            const calendarSection = document.getElementById("calendar");
            if (calendarSection) {
              calendarSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />
      </SectionRouter>

      <Footer />
    </div>
  );
}
