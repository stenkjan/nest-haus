"use client";

import React from "react";
import Footer from "@/components/Footer";
import { UnifiedContentCard } from "@/components/cards";
import { IMAGES } from "@/constants/images";

export default function EntwurfClient() {
  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ paddingTop: "var(--navbar-height, 3.5rem)" }}
    >
      {/* White background for navbar area */}
      <div
        className="fixed top-0 left-0 right-0 bg-white z-[90]"
        style={{ height: "var(--navbar-height, 3.5rem)" }}
      ></div>

      {/* Content Section */}
      <section className="w-full py-8 md:py-16 bg-white">
        <UnifiedContentCard
          layout="video"
          variant="static"
          heightMode="tall"
          maxWidth={true}
          showInstructions={false}
          customData={[
            {
              id: 1,
              title: "Der Auftakt",
              subtitle: "",
              description:
                "Dein Nest entsteht schnell, doch Individualität steht immer an erster Stelle. Mit deiner ersten Anzahlung erhältst du rechtliche Sicherheit und Klarheit darüber, ob dein Grundstück geeignet ist. Anschließend erstellen wir einen Vorentwurf, der deine Idee greifbar macht.\n\nDu entscheidest, ob du dein Zuhause bereits konfigurieren möchtest, um ein Gefühl für die Kosten zu bekommen, oder ob du ohne Konfiguration fortfährst. In beiden Fällen zahlst du nur für die rechtliche Prüfung und den Vorentwurf.",
              image: IMAGES.function.nestHausEntwurfVorentwurf,
              backgroundColor: "#F4F4F4",
              buttons: [
                {
                  text: "Vorentwurf kaufen",
                  variant: "primary",
                  size: "xs",
                  link: "/kontakt",
                },
                {
                  text: "Unsere Technik",
                  variant: "landing-secondary-blue",
                  size: "xs",
                  link: "/nest-system",
                },
              ],
            },
          ]}
        />
      </section>

      <Footer />
    </div>
  );
}
