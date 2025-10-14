"use client";

import React, { useState } from "react";
import {
  GetInContactBanner,
  PlanungspaketeSection,
  GrundstueckCheckSection,
  PartnersSection,
  MaterialShowcase,
  AppointmentBookingSection,
  LandingImagesCarousel,
} from "@/components/sections";

// Section configuration with metadata
interface SectionConfig {
  id: string;
  name: string;
  renderComponent: (bgColor: "white" | "black") => React.ReactNode;
}

// Section wrapper component with individual color toggle
function SectionWrapper({
  name,
  children,
  backgroundColor,
  onToggleColor,
}: {
  name: string;
  children: React.ReactNode;
  backgroundColor: "white" | "black";
  onToggleColor: () => void;
}) {
  return (
    <div className="relative">
      {/* Floating Controls - Positioned at top right of section */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <span
          className={`text-xs font-medium px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm ${
            backgroundColor === "black"
              ? "bg-white/90 text-gray-900"
              : "bg-gray-900/90 text-white"
          }`}
        >
          {name}
        </span>

        {/* Individual Color Toggle Button */}
        <button
          onClick={onToggleColor}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-lg backdrop-blur-sm ${
            backgroundColor === "black"
              ? "bg-white/90 text-black hover:bg-white"
              : "bg-gray-900/90 text-white hover:bg-gray-900"
          }`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
          <span>{backgroundColor === "black" ? "Light" : "Dark"}</span>
        </button>
      </div>

      {/* Section Content - No container constraints */}
      <div className="w-full">{children}</div>

      {/* Subtle divider between sections */}
      <div className="h-px bg-gray-200 my-8"></div>
    </div>
  );
}

export default function TestSectionsPage() {
  // Define all sections with their render functions
  const sections: SectionConfig[] = [
    {
      id: "get-in-contact-banner",
      name: "Get In Contact Banner",
      renderComponent: (bgColor) => (
        <GetInContactBanner
          title="Kein Plan? Kein Problem!"
          subtitle="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch"
          buttonText="Jetzt vereinbaren"
          backgroundColor={bgColor === "black" ? "#1a1a1a" : "#F4F4F4"}
        />
      ),
    },
    {
      id: "planungspakete-section",
      name: "Planungspakete Section",
      renderComponent: (bgColor) => (
        <PlanungspaketeSection
          title="Unterstützung gefällig?"
          subtitle="Entdecke unsere Planungs-Pakete, um das Beste für dich und dein Nest rauszuholen."
          backgroundColor={bgColor}
          showCards={true}
        />
      ),
    },
    {
      id: "grundstueck-check-section",
      name: "Grundstück Check Section",
      renderComponent: (_bgColor) => (
        <GrundstueckCheckSection
          title="Grundstück Check"
          subtitle="Prüfe dein Grundstück auf Eignung"
        />
      ),
    },
    {
      id: "partners-section",
      name: "Partners Section",
      renderComponent: (_bgColor) => (
        <PartnersSection
          title="Unsere Partner"
          subtitle="Gemeinsam für dein Traumhaus"
        />
      ),
    },
    {
      id: "material-showcase",
      name: "Material Showcase",
      renderComponent: (_bgColor) => (
        <MaterialShowcase
          title="Materialien & Qualität"
          subtitle="Hochwertige Materialien für dein Nest"
        />
      ),
    },
    {
      id: "appointment-booking-section",
      name: "Appointment Booking Section",
      renderComponent: (_bgColor) => <AppointmentBookingSection />,
    },
    {
      id: "landing-images-carousel",
      name: "Landing Images Carousel",
      renderComponent: (_bgColor) => <LandingImagesCarousel />,
    },
  ];

  // Individual color state for each section
  const [sectionColors, setSectionColors] = useState<
    Record<string, "white" | "black">
  >(
    sections.reduce(
      (acc, section) => {
        acc[section.id] = "white";
        return acc;
      },
      {} as Record<string, "white" | "black">
    )
  );

  // Toggle color for a specific section
  const toggleSectionColor = (sectionId: string) => {
    setSectionColors((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId] === "white" ? "black" : "white",
    }));
  };

  // Toggle all sections to the same color
  const toggleAllColors = () => {
    const firstColor = sectionColors[sections[0].id];
    const newColor = firstColor === "white" ? "black" : "white";
    setSectionColors(
      sections.reduce(
        (acc, section) => {
          acc[section.id] = newColor;
          return acc;
        },
        {} as Record<string, "white" | "black">
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Control Panel - Fixed at top */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between max-w-[1536px] mx-auto">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Section Testing Playground
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">
                Toggle individual section themes • Test consistency
              </p>
            </div>

            {/* Toggle All Colors Button */}
            <button
              onClick={toggleAllColors}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-900 text-white hover:bg-gray-800"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              <span>Toggle All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sections Container - Full width, no constraints */}
      <div className="w-full">
        {sections.map((section) => (
          <SectionWrapper
            key={section.id}
            name={section.name}
            backgroundColor={sectionColors[section.id]}
            onToggleColor={() => toggleSectionColor(section.id)}
          >
            {section.renderComponent(sectionColors[section.id])}
          </SectionWrapper>
        ))}
      </div>

      {/* Footer Info */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm text-gray-600 max-w-[1536px] mx-auto">
          <p>
            This is a development/testing page • Total sections:{" "}
            {sections.length}
          </p>
        </div>
      </div>
    </div>
  );
}
