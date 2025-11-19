"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { useDeviceDetect } from "@/hooks";

// import { ImageGallery } from "@/components/grids";
import {
  ContactMap as _ContactMap,
  AppointmentBookingSection,
  GrundstueckCheckForm,
  LandingImagesCarousel as _LandingImagesCarousel,
  SectionHeader,
} from "@/components/sections";
import Footer from "@/components/Footer";

// Define sections for kontakt page
const sections = [
  {
    id: "terminvereinbarung",
    title: "Terminvereinbarung",
    slug: "terminvereinbarung",
  },
  {
    id: "grundstueckscheck",
    title: "Grundstück Check",
    slug: "grundstueckscheck",
  },
  {
    id: "kontakt-karte",
    title: "Wo du uns findest",
    slug: "kontakt-karte",
  },
];

export default function KontaktClient() {
  const [_currentSectionId, setCurrentSectionId] =
    useState<string>("terminvereinbarung");
  const { isMobile: _isMobile } = useDeviceDetect();

  return (
    <div
      className="min-h-screen"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Vereinbare jetzt deinen Termin - Section 1 */}
        <section
          id="terminvereinbarung"
          className="w-full pt-12 pb-8 md:pb-16 bg-white"
        >
          <SectionHeader
            title="Vereinbare jetzt deinen Termin"
            subtitle="Wir helfen gerne."
            titleClassName="text-black"
            subtitleClassName="text-black"
            mobileTitle="Vereinbare jetzt deinen Termin"
            wrapperMargin="mb-8 md:mb-12"
          />
          <AppointmentBookingSection
            backgroundColor="white"
            maxWidth={false}
            padding={true}
            title=""
            subtitle=""
          />
        </section>

        {/* Section 2 - Dein Grundstück - Unser Check */}
        <section
          id="grundstueckscheck"
          className="w-full py-8 md:py-16 bg-white"
        >
          <SectionHeader
            title="Dein Konzeptcheck"
            subtitle="Wir überprüfen für dich wie dein neues Haus auf ein Grundstück deiner Wahl passt"
            titleClassName="text-black"
            subtitleClassName="text-black"
            mobileTitle="Dein Konzeptcheck"
            wrapperMargin="mb-8 md:mb-12"
          />
          <GrundstueckCheckForm
            backgroundColor="white"
            maxWidth="max-w-[1536px]"
            showHeader={false}
            excludePersonalData={false}
            useWrapper={false}
          />
        </section>

        {/* Section 3 - Wo du uns findest */}
        <section id="kontakt-karte" className="w-full py-8 md:py-16">
          <SectionHeader
            title="Wo du uns findest"
            subtitle="Komm vorbei um deinen Traum mit uns zu besprechen."
            titleClassName="text-black"
            subtitleClassName="text-black"
            mobileTitle="Wo du uns findest"
            wrapperMargin="mb-8 md:mb-12"
          />
          <div className="w-full max-w-[1536px] mx-auto px-4 md:px-12">
            <div
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
        </section>
      </SectionRouter>

      <Footer />
    </div>
  );
}
