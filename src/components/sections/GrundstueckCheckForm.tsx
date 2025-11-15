"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import { SectionContainer } from "./SectionContainer";
import { SectionHeader } from "./SectionHeader";
import { useConfiguratorStore } from "@/store/configuratorStore";

interface GrundstueckCheckFormProps {
  id?: string;
  backgroundColor?: "white" | "gray" | "black";
  maxWidth?: string | false;
  padding?: "sm" | "md" | "lg";
  className?: string;
  excludePersonalData?: boolean; // Flag to exclude "Daten Bewerber" section
  title?: string;
  subtitle?: string;
  showHeader?: boolean; // Flag to show/hide the SectionHeader
  useWrapper?: boolean; // Flag to use SectionContainer wrapper or render content directly
}

interface FormData {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  addressLine2: string;
  propertyNumber: string;
  cadastralCommunity: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
}

export function GrundstueckCheckForm({
  id,
  backgroundColor = "white",
  maxWidth = false,
  padding = "lg",
  className = "",
  excludePersonalData = false,
  title = "Dein Nest-Haus Entwurf",
  subtitle = "Wir überprüfen für dich wie dein neues Haus auf ein Grundstück deiner Wahl passt",
  showHeader = true,
  useWrapper = true,
}: GrundstueckCheckFormProps) {
  const { sessionId } = useConfiguratorStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    addressLine2: "",
    propertyNumber: "",
    cadastralCommunity: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Österreich",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate minimum required fields: address, city, postalCode
    if (
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.postalCode.trim()
    ) {
      alert(
        "❌ Bitte fülle die Pflichtfelder aus:\n\n• Straße und Hausnummer\n• Stadt\n• Postleitzahl"
      );
      return;
    }

    // Flexible address validation: allows letters, numbers, spaces, common punctuation
    const addressRegex = /^[a-zA-ZäöüÄÖÜß0-9\s,.\-/]+$/;
    if (!addressRegex.test(formData.address)) {
      alert(
        "❌ Ungültige Adresse. Bitte verwende nur Buchstaben, Zahlen und gängige Satzzeichen (,.-/)"
      );
      return;
    }

    // If personal data is shown (not excluded), validate name and email
    if (!excludePersonalData) {
      if (!formData.name.trim() || !formData.email.trim()) {
        alert("❌ Bitte fülle die Pflichtfelder aus:\n\n• Name\n• Email");
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("❌ Bitte gib eine gültige E-Mail-Adresse ein.");
        return;
      }
    }

    setIsSubmitting(true);
    setIsSaved(false);

    try {
      console.log("🔧 Grundstückscheck submission:", formData);

      // Prepare data for API
      const fullName =
        `${formData.name.trim()} ${formData.lastName.trim()}`.trim();
      const contactData = {
        sessionId: sessionId || undefined,
        name: fullName || formData.name.trim() || "Unbekannt",
        email: formData.email.trim() || "keine-email@nest-haus.com",
        phone: formData.phone || undefined,
        message: `Grundstückscheck Anfrage\n\nAdresse: ${formData.address}${formData.addressLine2 ? `\n${formData.addressLine2}` : ""}\nStadt: ${formData.city}\nBundesland: ${formData.state || "—"}\nPLZ: ${formData.postalCode}\nLand: ${formData.country}\nGrundstücknummer: ${formData.propertyNumber || "—"}\nKatastralgemeinde: ${formData.cadastralCommunity || "—"}\n\nAnmerkungen: ${formData.notes || "—"}`,
        requestType: "contact" as const,
        preferredContact: "email" as const,
        configurationData: {
          address: formData.address,
          addressLine2: formData.addressLine2,
          propertyNumber: formData.propertyNumber,
          cadastralCommunity: formData.cadastralCommunity,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          notes: formData.notes,
        },
      };

      // Send to contact API to save in customer inquiries
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      console.log("📬 Grundstückscheck API response:", {
        ok: response.ok,
        status: response.status,
        result,
      });

      // Log detailed error information if request failed
      if (!response.ok) {
        console.error("❌ API returned error:", {
          status: response.status,
          error: result.error,
          details: result.details,
          message: result.message,
          fullResult: result,
        });

        // Log each validation error detail
        if (result.details && Array.isArray(result.details)) {
          console.error("🔍 Validation errors:", result.details);
          result.details.forEach((detail: unknown, index: number) => {
            console.error(`  Error ${index + 1}:`, detail);
          });
        }
      }

      if (response.ok && result.success) {
        console.log("✅ Grundstückscheck data saved to customer inquiries");

        // Store form data in sessionStorage for CheckoutStepper to read
        const grundstueckData = {
          name: formData.name,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          addressLine2: formData.addressLine2,
          propertyNumber: formData.propertyNumber,
          cadastralCommunity: formData.cadastralCommunity,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          notes: formData.notes,
          service: "grundstueck-check",
          inquiryId: result.inquiryId,
        };

        sessionStorage.setItem(
          "grundstueckCheckData",
          JSON.stringify(grundstueckData)
        );

        // Also save to user tracking session in database
        try {
          const sessionResponse = await fetch(
            "/api/sessions/update-user-data",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sessionId: sessionId || "",
                userData: grundstueckData,
              }),
            }
          );

          const sessionResult = await sessionResponse.json();

          if (sessionResponse.ok && sessionResult.success) {
            console.log(
              "✅ Grundstückscheck data saved to user tracking session"
            );
          } else {
            console.warn(
              "⚠️ Failed to save to user session (non-blocking):",
              sessionResult.error
            );
          }
        } catch (sessionError) {
          console.warn(
            "⚠️ Error saving to user session (non-blocking):",
            sessionError
          );
        }

        // Mark as saved
        setIsSaved(true);

        // Show success alert
        alert("✅ Deine Daten wurden erfolgreich gespeichert!");
      } else {
        const errorMessage =
          result.error || result.message || "Unbekannter Fehler";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("❌ Error submitting Grundstückscheck form:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      alert(
        `❌ Fehler beim Speichern:\n\n${errorMessage}\n\nBitte versuche es erneut oder kontaktiere uns unter mail@nest-haus.com`
      );
      setIsSaved(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleZahlenUndPruefen = async () => {
    // Validate minimum required fields: address, city, postalCode
    if (
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.postalCode.trim()
    ) {
      alert(
        "❌ Bitte fülle die Pflichtfelder aus:\n\n• Straße und Hausnummer\n• Stadt\n• Postleitzahl"
      );
      return;
    }

    // Flexible address validation
    const addressRegex = /^[a-zA-ZäöüÄÖÜß0-9\s,.\-/]+$/;
    if (!addressRegex.test(formData.address)) {
      alert(
        "❌ Ungültige Adresse. Bitte verwende nur Buchstaben, Zahlen und gängige Satzzeichen (,.-/)"
      );
      return;
    }

    // If personal data is shown (not excluded), validate name and email
    if (!excludePersonalData) {
      if (!formData.name.trim() || !formData.email.trim()) {
        alert("❌ Bitte fülle die Pflichtfelder aus:\n\n• Name\n• Email");
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("❌ Bitte gib eine gültige E-Mail-Adresse ein.");
        return;
      }
    }

    setIsSubmitting(true);
    setIsSaved(false);

    try {
      console.log("🔧 Grundstückscheck Save button clicked:", formData);

      // Prepare data for API
      const fullName =
        `${formData.name.trim()} ${formData.lastName.trim()}`.trim();
      const contactData = {
        sessionId: sessionId || undefined,
        name: fullName || formData.name.trim() || "Unbekannt",
        email: formData.email.trim() || "keine-email@nest-haus.com",
        phone: formData.phone || undefined,
        message: `Grundstückscheck Anfrage\n\nAdresse: ${formData.address}${formData.addressLine2 ? `\n${formData.addressLine2}` : ""}\nStadt: ${formData.city}\nBundesland: ${formData.state || "—"}\nPLZ: ${formData.postalCode}\nLand: ${formData.country}\nGrundstücknummer: ${formData.propertyNumber || "—"}\nKatastralgemeinde: ${formData.cadastralCommunity || "—"}\n\nAnmerkungen: ${formData.notes || "—"}`,
        requestType: "contact" as const,
        preferredContact: "email" as const,
        configurationData: {
          address: formData.address,
          addressLine2: formData.addressLine2,
          propertyNumber: formData.propertyNumber,
          cadastralCommunity: formData.cadastralCommunity,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          notes: formData.notes,
        },
      };

      console.log("📤 Sending data to API:", contactData);

      // Send to contact API to save in customer inquiries
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      console.log("📬 Grundstückscheck Save API response:", {
        ok: response.ok,
        status: response.status,
        result,
      });

      // Log detailed error information if request failed
      if (!response.ok) {
        console.error("❌ API returned error:", {
          status: response.status,
          error: result.error,
          details: result.details,
          message: result.message,
          fullResult: result,
        });

        // Log each validation error detail
        if (result.details && Array.isArray(result.details)) {
          console.error("🔍 Validation errors:", result.details);
          result.details.forEach((detail: unknown, index: number) => {
            console.error(`  Error ${index + 1}:`, detail);
          });
        }
      }

      if (response.ok && result.success) {
        console.log("✅ Grundstückscheck data saved via Save button");

        // Store form data in sessionStorage for CheckoutStepper to read
        const grundstueckData = {
          name: formData.name,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          addressLine2: formData.addressLine2,
          propertyNumber: formData.propertyNumber,
          cadastralCommunity: formData.cadastralCommunity,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          notes: formData.notes,
          service: "grundstueck-check",
          inquiryId: result.inquiryId,
        };

        sessionStorage.setItem(
          "grundstueckCheckData",
          JSON.stringify(grundstueckData)
        );

        // Also save to user tracking session in database
        try {
          const sessionResponse = await fetch(
            "/api/sessions/update-user-data",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sessionId: sessionId || "",
                userData: grundstueckData,
              }),
            }
          );

          const sessionResult = await sessionResponse.json();

          if (sessionResponse.ok && sessionResult.success) {
            console.log(
              "✅ Grundstückscheck data saved to user tracking session via Save button"
            );
          } else {
            console.warn(
              "⚠️ Failed to save to user session (non-blocking):",
              sessionResult.error
            );
          }
        } catch (sessionError) {
          console.warn(
            "⚠️ Error saving to user session (non-blocking):",
            sessionError
          );
        }

        // Mark as saved - button will show "Gespeichert"
        setIsSaved(true);

        // No alert popup as per user request - button state change is enough feedback
      } else {
        const errorMessage =
          result.error || result.message || "Unbekannter Fehler";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("❌ Error saving Grundstückscheck form:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      alert(
        `❌ Fehler beim Speichern:\n\n${errorMessage}\n\nBitte versuche es erneut oder kontaktiere uns unter mail@nest-haus.com`
      );
      setIsSaved(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // When used in CheckoutStepper, render only the form without container
  if (maxWidth === false && padding === "sm") {
    return (
      <div id="entwurf-formular">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Conditionally render Daten Bewerber section */}
          {!excludePersonalData && (
            <>
              <h3 className="h3-secondary mb-4">Daten Bewerber</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3"
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3"
                  placeholder="Nachname"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3"
                  placeholder="Telefon"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3"
                  placeholder="Email"
                  required
                />
              </div>
            </>
          )}

          <h3 className="h3-secondary mb-4">Informationen zum Grundstück</h3>
          <div className="space-y-4 mb-6">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3"
              placeholder="Straße und Hausnummer"
              required
            />
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3"
              placeholder="Straße - Zeile 2 - optional"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="propertyNumber"
                value={formData.propertyNumber}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-3"
                placeholder="Grundstücknummer"
              />
              <input
                type="text"
                name="cadastralCommunity"
                value={formData.cadastralCommunity}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-3"
                placeholder="Katastralgemeinde"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-3"
                placeholder="Stadt"
                required
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-3"
                placeholder="Bundesland"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-3"
                placeholder="Postleitzahl"
                required
              />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-3"
                placeholder="Land"
                required
              />
            </div>
          </div>

          <h3 className="h3-secondary mb-4">Anmerkungen</h3>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-xl p-3 mb-6"
            placeholder="Zusatzinformationen - optional"
          />

          <div className="flex justify-center">
            <button
              onClick={handleZahlenUndPruefen}
              disabled={isSubmitting || isSaved}
              className="rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center font-normal whitespace-nowrap bg-[#3D6CE1] border border-[#3D6CE1] text-white hover:bg-[#3D6CE1] focus:ring-[#3D6CE1] shadow-sm box-border px-6 py-1.5 text-sm xl:text-base 2xl:text-lg w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Wird gespeichert..."
                : isSaved
                  ? "✓ Gespeichert"
                  : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Default full-page layout for standalone use
  const formContent = (
    <>
      {showHeader && (
        <SectionHeader
          title={title}
          subtitle={subtitle}
          titleClassName="text-black"
          subtitleClassName="text-black"
          wrapperMargin="mb-16"
        />
      )}

      <div className="w-full">
        {/* Desktop Layout: Side by side matching CheckoutStepper layout */}
        <div className="hidden md:flex md:flex-col md:items-center md:justify-start gap-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-start gap-6 w-full">
            {/* Info Section - Left side matching description area */}
            <div className="w-full md:w-1/2 text-left px-12 md:px-16 lg:px-24">
              <div>
                <p className="p-primary leading-loose mb-8 mt-16">
                  <span className="text-nest-gray">Bevor dein </span>
                  <span className="text-black font-medium">
                    Traum vom Nest-Haus
                  </span>
                  <span className="text-nest-gray">
                    {" "}
                    Realität wird, prüfen wir, ob dein{" "}
                  </span>
                  <span className="text-black font-medium">Grundstück</span>
                  <span className="text-nest-gray"> alle rechtlichen und </span>
                  <span className="text-black font-medium">
                    baulichen Anforderungen
                  </span>
                  <span className="text-nest-gray"> erfüllt. Für </span>
                  <span className="text-black font-medium">€ 3.000</span>
                  <span className="text-nest-gray">
                    {" "}
                    übernehmen wir diese Überprüfung und entwickeln gemeinsam
                    mit dir ein individuelles{" "}
                  </span>
                  <span className="text-black font-medium">
                    Vorentwurfskonzept
                  </span>
                  <span className="text-nest-gray"> deines Nest-Hauses.</span>
                </p>
                {/* Spacer to align with Name/Nachname form fields */}
                <div className="h-3"></div>
                <p className="p-primary leading-loose mb-24">
                  <span className="text-nest-gray">
                    Dabei verbinden wir deine{" "}
                  </span>
                  <span className="text-black font-medium">Wünsche</span>
                  <span className="text-nest-gray"> mit den gegebenen </span>
                  <span className="text-black font-medium">
                    Rahmenbedingungen
                  </span>
                  <span className="text-nest-gray">
                    {" "}
                    und schaffen so die ideale Grundlage für dein{" "}
                  </span>
                  <span className="text-black font-medium">
                    zukünftiges Zuhause
                  </span>
                  <span className="text-nest-gray">.</span>
                </p>
              </div>

              <div className="mt-12 space-y-8">
                <div>
                  <h4 className="p-primary text-black font-medium mb-1">
                    Was wir prüfen
                  </h4>
                  <p className="p-primary-small text-nest-gray">
                    Rechtliche Rahmenbedingungen: Wir prüfen, ob dein Grundstück
                    den Vorgaben des jeweiligen Landes-Baugesetzes, des
                    Raumordnungsgesetzes und ortsgebundener Vorschriften
                    entspricht.
                  </p>
                </div>

                <div>
                  <h4 className="p-primary text-black font-medium mb-1">
                    Baugesetze
                  </h4>
                  <p className="p-primary-small text-nest-gray">
                    Alle relevanten Bauvorschriften werden detailliert
                    überprüft, um sicherzustellen, dass dein Bauvorhaben
                    genehmigungsfähig ist. Geeignetheit des Grundstücks: Wir
                    stellen fest, ob dein Grundstück alle notwendigen
                    Voraussetzungen für den Aufbau deines Nest-Hauses erfüllt.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section - Right side matching summary box */}
            <div className="w-full md:w-1/2">
              <div className="w-full max-w-[520px] ml-auto mt-1 md:mt-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="h3-secondary mb-4">Daten Bewerber</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-xl p-3"
                      placeholder="Name"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-xl p-3"
                      placeholder="Nachname"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-xl p-3"
                      placeholder="Telefon"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-xl p-3"
                      placeholder="Email"
                      required
                    />
                  </div>

                  <h3 className="h3-secondary mb-4">
                    Informationen zum Grundstück
                  </h3>
                  <div className="space-y-4 mb-6">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3"
                      placeholder="Straße und Hausnummer"
                      required
                    />
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3"
                      placeholder="Straße - Zeile 2 - optional"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="propertyNumber"
                        value={formData.propertyNumber}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-xl p-3"
                        placeholder="Grundstücknummer"
                      />
                      <input
                        type="text"
                        name="cadastralCommunity"
                        value={formData.cadastralCommunity}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-xl p-3"
                        placeholder="Katastralgemeinde"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-xl p-3"
                        placeholder="Stadt"
                        required
                      />
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-xl p-3"
                        placeholder="Bundesland"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-xl p-3"
                        placeholder="Postleitzahl"
                        required
                      />
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-xl p-3"
                        placeholder="Land"
                        required
                      />
                    </div>
                  </div>

                  <h3 className="h3-secondary mb-4">Anmerkungen</h3>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl p-3 mb-6"
                    placeholder="Zusatzinformationen - optional"
                  />

                  <div className="flex justify-center">
                    <Button
                      onClick={handleZahlenUndPruefen}
                      variant="landing-primary"
                      size="xs"
                      className="w-auto"
                      disabled={isSubmitting || isSaved}
                    >
                      {isSubmitting
                        ? "Wird gespeichert..."
                        : isSaved
                          ? "✓ Gespeichert"
                          : "Speichern"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout: Custom stacking order as specified */}
        <div className="md:hidden space-y-8">
          {/* 1. Main text until "Planung deines Nest-Hauses starten kann" */}
          <div>
            <p className="p-primary leading-relaxed mb-4">
              <span className="text-nest-gray">Bevor dein </span>
              <span className="text-black font-medium">
                Traum vom Nest-Haus
              </span>
              <span className="text-nest-gray">
                {" "}
                Realität wird, prüfen wir, ob dein{" "}
              </span>
              <span className="text-black font-medium">Grundstück</span>
              <span className="text-nest-gray"> alle rechtlichen und </span>
              <span className="text-black font-medium">
                baulichen Anforderungen
              </span>
              <span className="text-nest-gray"> erfüllt. Für </span>
              <span className="text-black font-medium">€ 3.000</span>
              <span className="text-nest-gray">
                {" "}
                übernehmen wir diese Überprüfung und entwickeln gemeinsam mit
                dir ein individuelles{" "}
              </span>
              <span className="text-black font-medium">Vorentwurfskonzept</span>
              <span className="text-nest-gray"> deines Nest-Hauses.</span>
            </p>
            <p className="p-primary leading-relaxed mb-6">
              <span className="text-nest-gray">Dabei verbinden wir deine </span>
              <span className="text-black font-medium">Wünsche</span>
              <span className="text-nest-gray"> mit den gegebenen </span>
              <span className="text-black font-medium">Rahmenbedingungen</span>
              <span className="text-nest-gray">
                {" "}
                und schaffen so die ideale Grundlage für dein{" "}
              </span>
              <span className="text-black font-medium">
                zukünftiges Zuhause
              </span>
              <span className="text-nest-gray">.</span>
            </p>
          </div>

          {/* 2. Form fields */}
          <div id="entwurf-formular">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="h3-secondary mb-4">Daten Bewerber</h3>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3"
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3"
                  placeholder="Nachname"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3"
                  placeholder="Telefon"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3"
                  placeholder="Email"
                  required
                />
              </div>

              <h3 className="h3-secondary mb-4">
                Informationen zum Grundstück
              </h3>
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3"
                  placeholder="Straße und Hausnummer"
                  required
                />
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3"
                  placeholder="Straße - Zeile 2 - optional"
                />
                <input
                  type="text"
                  name="propertyNumber"
                  value={formData.propertyNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3"
                  placeholder="Grundstücknummer"
                />
                <input
                  type="text"
                  name="cadastralCommunity"
                  value={formData.cadastralCommunity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3"
                  placeholder="Katastralgemeinde"
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3"
                  placeholder="Stadt"
                  required
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3"
                  placeholder="Bundesland"
                />
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3"
                  placeholder="Postleitzahl"
                  required
                />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3"
                  placeholder="Land"
                  required
                />
              </div>

              <h3 className="h3-secondary mb-4">Anmerkungen</h3>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-xl p-3 mb-6"
                placeholder="Zusatzinformationen - optional"
              />

              <Button
                onClick={handleZahlenUndPruefen}
                variant="primary"
                size="xs"
                className="w-full"
                disabled={isSubmitting || isSaved}
              >
                {isSubmitting
                  ? "Wird gespeichert..."
                  : isSaved
                    ? "✓ Gespeichert"
                    : "Speichern"}
              </Button>
            </form>
          </div>

          {/* 3. "Was wir prüfen" and "Baugesetze" sections */}
          <div>
            <div className="space-y-3">
              <div>
                <h4 className="p-primary text-black font-medium mb-1">
                  Was wir prüfen
                </h4>
                <p className="p-primary-small text-nest-gray">
                  Rechtliche Rahmenbedingungen: Wir prüfen, ob dein Grundstück
                  den Vorgaben des jeweiligen Landes-Baugesetzes, des
                  Raumordnungsgesetzes und ortsgebundener Vorschriften
                  entspricht.
                </p>
              </div>

              <div>
                <h4 className="p-primary text-black font-medium mb-1">
                  Baugesetze
                </h4>
                <p className="p-primary-small text-nest-gray">
                  Alle relevanten Bauvorschriften werden detailliert überprüft,
                  um sicherzustellen, dass dein Bauvorhaben genehmigungsfähig
                  ist. Geeignetheit des Grundstücks: Wir stellen fest, ob dein
                  Grundstück alle notwendigen Voraussetzungen für den Aufbau
                  deines Nest-Hauses erfüllt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Return with or without SectionContainer wrapper
  if (useWrapper) {
    return (
      <SectionContainer
        id={id || "grundstueck-check-form"}
        backgroundColor={backgroundColor}
        padding={padding}
        maxWidth={maxWidth}
        className={className}
      >
        {formContent}
      </SectionContainer>
    );
  }

  // Return content directly when used within a custom section wrapper
  return (
    <div className="w-full max-w-[1536px] mx-auto px-4 md:px-12">
      {formContent}
    </div>
  );
}
