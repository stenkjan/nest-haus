"use client";

import React, { useState } from "react";

// Inline form component for the contact page (no dialog overlay)
const GrundstueckCheckWrapper = () => {
  const [formData, setFormData] = useState({
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

  return (
    <>
      {/* Desktop Layout: Side by side with 500px width constraints */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-0 w-full max-w-[1536px] mx-auto px-[5%]">
        {/* Info Section - POSITIONED AT LEFT EDGE */}
        <div className="space-y-8 max-w-[500px] justify-self-start">
          <div className="bg-white p-6 rounded-lg flex flex-col justify-between">
            <div>
              <p className="text-xl leading-[1.5] mb-4">
                Bevor dein Traum vom Nest-Haus Realität wird, ist es wichtig,
                dass dein Grundstück alle{" "}
                <strong>rechtlichen und baulichen Anforderungen</strong>{" "}
                erfüllt. Genau hier setzen wir an!
              </p>
              {/* Spacer to align with Name/Nachname form fields */}
              <div className="h-3"></div>
              <p className="text-xl leading-[1.5] mb-6">
                Für nur € 200,- übernehmen wir für dich die Prüfung der
                relevanten Rahmenbedingungen und Baugesetze, um dir{" "}
                <strong>Sicherheit und Klarheit</strong> zu verschaffen. Jetzt
                den <strong>Quick-Check</strong> machen und uns die rechtlichen
                und baulichen Voraussetzungen deines Grundstücks prüfen lassen,
                damit du{" "}
                <strong>
                  entspannt und sicher in die Planung deines Nest-Hauses starten
                </strong>{" "}
                kannst.
              </p>
            </div>

            <div className="mt-2 text-sm space-y-4">
              <div>
                <h4 className="font-medium mb-1 text-sm">Was wir prüfen</h4>
                <p className="text-sm leading-4">
                  Rechtliche Rahmenbedingungen: Wir prüfen, ob dein Grundstück
                  den Vorgaben des jeweiligen Landes-Baugesetzes, des
                  Raumordnungsgesetzes und ortsgebundener Vorschriften
                  entspricht.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1 text-sm">Baugesetze</h4>
                <p className="text-sm leading-4">
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

        {/* Form Section - POSITIONED AT RIGHT EDGE */}
        <div className="space-y-6 max-w-[500px] justify-self-end">
          <div className="bg-white p-6 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-medium mb-4">Daten Bewerber</h3>
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

              <h3 className="text-xl font-medium mb-4">
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

              <h3 className="text-xl font-medium mb-4">Anmerkungen</h3>
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
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-base rounded-full px-6 py-3 transition-colors w-auto"
                >
                  Zahlen und Prüfen
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Layout: Custom stacking order as specified */}
      <div className="lg:hidden space-y-8">
        {/* 1. Main text until "Planung deines Nest-Hauses starten kann" */}
        <div className="bg-white p-6 rounded-lg">
          <p className="text-xl leading-[1.5] mb-4">
            Bevor dein Traum vom Nest-Haus Realität wird, ist es wichtig, dass
            dein Grundstück alle{" "}
            <strong>rechtlichen und baulichen Anforderungen</strong> erfüllt.
            Genau hier setzen wir an!
          </p>
          <p className="text-xl leading-[1.5] mb-6">
            Für nur € 200,- übernehmen wir für dich die Prüfung der relevanten
            Rahmenbedingungen und Baugesetze, um dir{" "}
            <strong>Sicherheit und Klarheit</strong> zu verschaffen. Jetzt den{" "}
            <strong>Quick-Check</strong> machen und uns die rechtlichen und
            baulichen Voraussetzungen deines Grundstücks prüfen lassen, damit du{" "}
            <strong>
              entspannt und sicher in die Planung deines Nest-Hauses starten
            </strong>{" "}
            kannst.
          </p>
        </div>

        {/* 2. Form fields */}
        <div className="bg-white p-6 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-medium mb-4">Daten Bewerber</h3>
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

            <h3 className="text-xl font-medium mb-4">
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

            <h3 className="text-xl font-medium mb-4">Anmerkungen</h3>
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
        <div className="bg-white p-6 rounded-lg">
          <div className="text-sm space-y-4">
            <div>
              <h4 className="font-medium mb-1 text-sm">Was wir prüfen</h4>
              <p className="text-sm leading-4">
                Rechtliche Rahmenbedingungen: Wir prüfen, ob dein Grundstück den
                Vorgaben des jeweiligen Landes-Baugesetzes, des
                Raumordnungsgesetzes und ortsgebundener Vorschriften entspricht.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1 text-sm">Baugesetze</h4>
              <p className="text-sm leading-4">
                Alle relevanten Bauvorschriften werden detailliert überprüft, um
                sicherzustellen, dass dein Bauvorhaben genehmigungsfähig ist.
                Geeignetheit des Grundstücks: Wir stellen fest, ob dein
                Grundstück alle notwendigen Voraussetzungen für den Aufbau
                deines Nest-Hauses erfüllt.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Button at the bottom */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-base rounded-full px-6 py-3 transition-colors w-auto"
          >
            Zahlen und Prüfen
          </button>
        </div>
      </div>
    </>
  );
};

export default GrundstueckCheckWrapper;
