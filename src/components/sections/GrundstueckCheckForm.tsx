"use client";

import React, { useState } from "react";
import { SectionContainer } from "./SectionContainer";

interface GrundstueckCheckFormProps {
  backgroundColor?: "white" | "gray" | "black";
  maxWidth?: string | false;
  padding?: "sm" | "md" | "lg";
  className?: string;
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
  backgroundColor = "white",
  maxWidth = false,
  padding = "lg",
  className = "",
}: GrundstueckCheckFormProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔧 Grundstückscheck submission:", formData);
    // Here you would typically send the data to your API
    alert("Formular wurde übermittelt! Wir melden uns bald bei Ihnen.");
  };

  // When used in CheckoutStepper, render only the form without container
  if (maxWidth === false && padding === "sm") {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium mb-4">
          Daten Bewerber
        </h3>
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

        <h3 className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium mb-4">
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
              placeholder="Katastergemeinde"
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

        <h3 className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium mb-4">
          Anmerkungen
        </h3>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded-xl p-3 mb-6"
          placeholder="Zusatzinformationen - optional"
        />
      </form>
    );
  }

  // Default full-page layout for standalone use
  return (
    <SectionContainer
      id="grundstueck-check-form"
      backgroundColor={backgroundColor}
      padding={padding}
      maxWidth={maxWidth}
      className={className}
    >
      <div className="text-center mb-16">
        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-2 md:mb-3">
          Dein Grundstück - Unser Check
        </h1>
        <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Wir überprüfen für dich wie dein neues Haus auf ein Grundstück deiner
          Wahl passt
        </h3>
      </div>

      <div className="w-full">
        {/* Desktop Layout: Side by side matching CheckoutStepper layout */}
        <div className="hidden md:flex md:flex-col md:items-center md:justify-start gap-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-start gap-6 w-full">
            {/* Info Section - Left side matching description area */}
            <div className="w-full md:w-1/2 text-left px-12 md:px-16 lg:px-24">
              <div>
                <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-gray-700 leading-relaxed mb-4 mt-12">
                  Bevor dein Traum vom Nest-Haus Realität wird, ist es wichtig,
                  dass dein Grundstück alle{" "}
                  <strong>rechtlichen und baulichen Anforderungen</strong>{" "}
                  erfüllt. Genau hier setzen wir an!
                </p>
                {/* Spacer to align with Name/Nachname form fields */}
                <div className="h-3"></div>
                <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-gray-700 leading-relaxed mb-6">
                  <strong>Für nur € 200,-</strong> übernehmen wir für dich die
                  Prüfung der relevanten Rahmenbedingungen und Baugesetze, um
                  dir <strong>Sicherheit und Klarheit</strong> zu verschaffen.
                  Jetzt den <strong>Quick-Check</strong> machen und uns die
                  rechtlichen und baulichen Voraussetzungen deines Grundstücks
                  prüfen lassen, damit du{" "}
                  <strong>
                    entspannt und sicher in die Planung deines Nest-Hauses
                    starten
                  </strong>{" "}
                  kannst.
                </p>
              </div>

              <div className="mt-2 space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                    Was wir prüfen
                  </h4>
                  <p
                    className="text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base leading-relaxed"
                    style={{ color: "#99a1af" }}
                  >
                    Rechtliche Rahmenbedingungen: Wir prüfen, ob dein Grundstück
                    den Vorgaben des jeweiligen Landes-Baugesetzes, des
                    Raumordnungsgesetzes und ortsgebundener Vorschriften
                    entspricht.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                    Baugesetze
                  </h4>
                  <p
                    className="text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base leading-relaxed"
                    style={{ color: "#99a1af" }}
                  >
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
                  <h3 className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium mb-4">
                    Daten Bewerber
                  </h3>
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

                  <h3 className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium mb-4">
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
                        placeholder="Katastergemeinde"
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

                  <h3 className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium mb-4">
                    Anmerkungen
                  </h3>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl p-3 mb-6"
                    placeholder="Zusatzinformationen - optional"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout: Custom stacking order as specified */}
        <div className="md:hidden space-y-8">
          {/* 1. Main text until "Planung deines Nest-Hauses starten kann" */}
          <div>
            <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-gray-700 leading-relaxed mb-4">
              Bevor dein Traum vom Nest-Haus Realität wird, ist es wichtig, dass
              dein Grundstück alle{" "}
              <strong>rechtlichen und baulichen Anforderungen</strong> erfüllt.
              Genau hier setzen wir an!
            </p>
            <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-gray-700 leading-relaxed mb-6">
              <strong>Für nur € 200,-</strong> übernehmen wir für dich die
              Prüfung der relevanten Rahmenbedingungen und Baugesetze, um dir{" "}
              <strong>Sicherheit und Klarheit</strong> zu verschaffen. Jetzt den{" "}
              <strong>Quick-Check</strong> machen und uns die rechtlichen und
              baulichen Voraussetzungen deines Grundstücks prüfen lassen, damit
              du{" "}
              <strong>
                entspannt und sicher in die Planung deines Nest-Hauses starten
              </strong>{" "}
              kannst.
            </p>
          </div>

          {/* 2. Form fields */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium mb-4">
                Daten Bewerber
              </h3>
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

              <h3 className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium mb-4">
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
                  placeholder="Katastergemeinde"
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

              <h3 className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium mb-4">
                Anmerkungen
              </h3>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-xl p-3 mb-6"
                placeholder="Zusatzinformationen - optional"
              />
            </form>
          </div>

          {/* 3. "Was wir prüfen" and "Baugesetze" sections */}
          <div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                  Was wir prüfen
                </h4>
                <p
                  className="text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base leading-relaxed"
                  style={{ color: "#99a1af" }}
                >
                  Rechtliche Rahmenbedingungen: Wir prüfen, ob dein Grundstück
                  den Vorgaben des jeweiligen Landes-Baugesetzes, des
                  Raumordnungsgesetzes und ortsgebundener Vorschriften
                  entspricht.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                  Baugesetze
                </h4>
                <p
                  className="text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base leading-relaxed"
                  style={{ color: "#99a1af" }}
                >
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
