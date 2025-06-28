'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface GrundstueckCheckDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const BrightOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>((props, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className="fixed inset-0 z-50"
    style={{ 
      backdropFilter: "brightness(2.5) blur(4px)",
      backgroundColor: "transparent"
    }}
    {...props}
  />
));
BrightOverlay.displayName = "BrightOverlay";

const GrundstueckCheckDialog: React.FC<GrundstueckCheckDialogProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    nachname: '',
    telefon: '',
    email: '',
    strasse: '',
    strasseZeile2: '',
    grundstuecksnummer: '',
    katastergemeinde: '',
    stadt: '',
    bundesland: '',
    postleitzahl: '',
    land: '',
    anmerkungen: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Title above the dialog */}
      <div
        className="fixed top-[1vh] z-[100] w-full max-w-[1700px] px-6 left-0 right-0 mx-auto"
      >
        <DialogTitle className="hidden md:block font-bold text-h2-mobile md:text-3xl text-center text-gray-900 mb-2 mt-[5vh] md:mt-[5vh]">
          Grundstückscheck
        </DialogTitle>
      </div>
      <DialogPrimitive.Portal>
        <BrightOverlay />
        <DialogPrimitive.Content
          className="max-w-full w-[95vw] fixed top-[5vh] md:top-[10vh] left-0 right-0 mx-auto p-0 overflow-hidden z-[100]"
        >
          <div 
            className="relative w-full h-[90vh] md:h-[88vh] overflow-y-auto pt-1 pb-1 md:pt-2 md:pb-2 px-1 md:px-1 flex justify-center items-start"
            style={{ minHeight: '300px' }}
          >
            <div className="max-w-[1700px] mx-auto bg-[#F4F4F4] rounded-[32px] md:rounded-[32px] px-1 md:px-5 pb-3 flex flex-col items-center shadow-md">
              <div className="relative w-full flex flex-col md:flex-row justify-start items-start gap-4 md:gap-8 pt-0 px-2 sm:px-4 lg:px-8 overflow-y-auto h-full pointer-events-auto z-10">
                {/* Left Info Section (responsive) */}
                <div className="w-full md:flex-1 md:min-w-[180px] md:max-w-[340px] xl:min-w-[320px] xl:max-w-[420px] flex flex-col justify-start px-2 sm:px-4 md:pl-4 md:pr-0 lg:pl-10 md:mt-7 z-10">
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 leading-snug">
                        Bevor dein Traum vom Nest-Haus Realität wird, ist es wichtig, dass dein Grundstück alle <span className="font-semibold text-gray-700">rechtlichen und baulichen Anforderungen</span> erfüllt. Genau hier setzen wir an!
                      </p>
                      <p className="text-[13px] sm:text-base text-gray-700 mb-3 leading-snug">
                        <span className="font-bold">Für nur € 400,-</span> übernehmen wir für dich die Prüfung der relevanten Rahmenbedingungen und Baugesetze, um dir <span className="font-bold">Sicherheit und Klarheit</span> zu verschaffen. Jetzt den <span className="font-bold">Grundstücks-Check</span> machen und uns die rechtlichen und baulichen Voraussetzungen deines Grundstücks prüfen lassen, damit du <span className="font-bold">entspannt und sicher in die Planung deines Nest-Hauses starten</span> kannst.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-semibold text-[11px] text-gray-700 mb-0">Was wir prüfen</h4>
                        <p className="text-[11px] text-gray-400 leading-tight">
                          Rechtliche Rahmenbedingungen: Wir prüfen, ob dein Grundstück den Vorgaben des jeweiligen Landes-Baugesetzes, des Raumordnungsgesetzes und ortsgebundener Vorschriften entspricht.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[11px] text-gray-700 mb-0">Baugesetze</h4>
                        <p className="text-[11px] text-gray-400 leading-tight">
                          Alle relevanten Bauvorschriften werden detailliert überprüft, um sicherzustellen, dass dein Bauvorhaben genehmigungsfähig ist. Geeignetheit des Grundstücks: Wir stellen fest, ob dein Grundstück alle notwendigen Voraussetzungen für den Aufbau deines Nest-Hauses erfüllt.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right Column - Form (responsive, compact) */}
                <div className="w-full md:flex-1 md:min-w-[260px] md:max-w-[540px] flex flex-col px-2 sm:px-4 md:pl-8 md:pr-4 lg:pl-12 lg:pr-0 pb-4 md:mt-[2vh]">
                  <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
                    <h3 className="font-normal mb-1 sm:mb-2 text-xs sm:text-sm text-gray-700">Daten Bewerber</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                      />
                      <input
                        type="text"
                        name="nachname"
                        value={formData.nachname}
                        onChange={handleChange}
                        placeholder="Nachname"
                        className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                      <input
                        type="tel"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleChange}
                        placeholder="Telefon"
                        className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                      />
                    </div>

                    <h3 className="font-normal mt-2 sm:mt-3 mb-1 sm:mb-2 text-xs sm:text-sm text-gray-700">Informationen zum Grundstück</h3>
                    <input
                      type="text"
                      name="strasse"
                      value={formData.strasse}
                      onChange={handleChange}
                      placeholder="Straße und Hausnummer"
                      className="w-full p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                    />
                    <input
                      type="text"
                      name="strasseZeile2"
                      value={formData.strasseZeile2}
                      onChange={handleChange}
                      placeholder="Straße - Zeile 2 - optional"
                      className="w-full p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                      <input
                        type="text"
                        name="grundstuecksnummer"
                        value={formData.grundstuecksnummer}
                        onChange={handleChange}
                        placeholder="Grundstücksnummer"
                        className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                      />
                      <input
                        type="text"
                        name="katastergemeinde"
                        value={formData.katastergemeinde}
                        onChange={handleChange}
                        placeholder="Katastergemeinde"
                        className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                      <input
                        type="text"
                        name="stadt"
                        value={formData.stadt}
                        onChange={handleChange}
                        placeholder="Stadt"
                        className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                      />
                      <input
                        type="text"
                        name="bundesland"
                        value={formData.bundesland}
                        onChange={handleChange}
                        placeholder="Bundesland"
                        className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                      <input
                        type="text"
                        name="postleitzahl"
                        value={formData.postleitzahl}
                        onChange={handleChange}
                        placeholder="Postleitzahl"
                        className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                      />
                      <input
                        type="text"
                        name="land"
                        value={formData.land}
                        onChange={handleChange}
                        placeholder="Land"
                        className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                      />
                    </div>

                    <div>
                      <h3 className="font-normal mb-1 sm:mb-1.5 text-xs sm:text-sm text-gray-700">Anmerkungen</h3>
                      <textarea
                        name="anmerkungen"
                        value={formData.anmerkungen}
                        onChange={handleChange}
                        placeholder="Zusatzinformationen - optional"
                        className="w-full p-1 sm:p-1.5 border rounded h-14 sm:h-16 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="flex justify-center">
                      <Button
                        type="submit"
                        className="w-1/2 bg-blue-600 text-white hover:bg-blue-700 rounded-full py-1.5 sm:py-2 text-xs sm:text-sm"
                      >
                        Zum Warenkorb
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};

export default GrundstueckCheckDialog; 