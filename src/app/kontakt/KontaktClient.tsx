"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { useDeviceDetect } from "@/hooks";

// import { ImageGallery } from "@/components/grids";
import {
  ContactMap,
  AppointmentBookingSection,
  GrundstueckCheckForm,
  GetInContactBanner,
  LandingImagesCarousel,
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
        <AppointmentBookingSection
          id="calendar"
          backgroundColor="white"
          maxWidth={false}
        />

        {/* Wo du uns findest - Section 2 */}
        <ContactMap id="address" backgroundColor="gray" maxWidth={false} />

        {/* Dein Grundstück - Unser Check - Section 3 */}
        <GrundstueckCheckForm
          id="contact"
          backgroundColor="white"
          maxWidth="max-w-[1440px]"
        />

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
      </SectionRouter>

      {/* Image Carousel Section - Outside SectionRouter to avoid width issues */}
      <div className="hidden md:block">
        <LandingImagesCarousel backgroundColor="white" maxWidth={false} />
      </div>

      <Footer />
    </div>
  );
}
