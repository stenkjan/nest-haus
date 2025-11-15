"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
}: GrundstueckCheckFormProps) {
  const router = useRouter();
  const { sessionId } = useConfiguratorStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Bitte fülle die Inforamtionen zum Grundstück aus.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🔧 Grundstückscheck submission:", formData);

      // Prepare data for API
      const fullName =
        `${formData.name.trim()} ${formData.lastName.trim()}`.trim();
      const contactData = {
        sessionId: sessionId || undefined,
        name: fullName || formData.name.trim(),
        email: formData.email,
        phone: formData.phone || undefined,
        message: `Grundstückscheck Anfrage\n\nAdresse: ${formData.address}${formData.addressLine2 ? `\n${formData.addressLine2}` : ""}\nStadt: ${formData.city}\nBundesland: ${formData.state}\nPLZ: ${formData.postalCode}\nLand: ${formData.country}\nGrundstücknummer: ${formData.propertyNumber || "—"}\nKatastralgemeinde: ${formData.cadastralCommunity || "—"}\n\nAnmerkungen: ${formData.notes || "—"}`,
        requestType: "grundstueck" as const,
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
        result,
      });

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

        alert(
          "Formular wurde erfolgreich übermittelt! Wir melden uns bald bei Ihnen."
        );
      } else {
        throw new Error(result.error || "Failed to submit form");
      }
    } catch (error) {
      console.error("❌ Error submitting Grundstückscheck form:", error);
      alert(
        "Es gab einen Fehler beim Senden des Formulars. Bitte versuche es später erneut."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleZahlenUndPruefen = async () => {
    // First, submit the form to save to customer inquiries
    const submitEvent = new Event("submit", {
      bubbles: true,
      cancelable: true,
    });
    const formElement = document.querySelector("form");

    if (formElement) {
      // Trigger form submission which includes validation
      formElement.dispatchEvent(submitEvent);

      // Wait a bit for submission to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if we have data in sessionStorage (indicating successful submission)
      const storedData = sessionStorage.getItem("grundstueckCheckData");
      if (storedData) {
        // Navigate to warenkorb terminvereinbarung step
        router.push("/warenkorb#terminvereinbarung");
      }
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
                required
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
              disabled={isSubmitting}
              className="rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center font-normal whitespace-nowrap bg-[#3D6CE1] border border-[#3D6CE1] text-white hover:bg-[#3D6CE1] focus:ring-[#3D6CE1] shadow-sm box-border px-6 py-1.5 text-sm xl:text-base 2xl:text-lg w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Wird gespeichert..." : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Default full-page layout for standalone use
  return (
    <SectionContainer
      id={id || "grundstueck-check-form"}
      backgroundColor={backgroundColor}
      padding={padding}
      maxWidth={maxWidth}
      className={className}
    >
      <SectionHeader
        title="Dein Nest-Haus Entwurf"
        subtitle="Wir überprüfen für dich wie dein neues Haus auf ein Grundstück deiner Wahl passt"
        titleClassName="text-black"
        subtitleClassName="text-black"
        wrapperMargin="mb-16"
      />

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
                        required
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Wird gespeichert..." : "Speichern"}
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
                  required
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Wird gespeichert..." : "Speichern"}
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
    </SectionContainer>
  );
}
