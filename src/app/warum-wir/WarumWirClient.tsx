"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
// Removed ModernVideoPlayer - using YouTube embed instead
import { UnifiedContentCard } from "@/components/cards";
import {
  GetInContactBanner,
  SectionHeader,
  PartnersSection,
  FAQSection,
} from "@/components/sections";
import { IMAGES } from "@/constants/images";
import { TALL_CARD_PROPS_WITH_PADDING } from "@/constants/cardContent";
import Footer from "@/components/Footer";

// Define sections
const sections = [
  {
    id: "hero",
    title: "Design für dich gemacht",
    slug: "hero",
  },
  {
    id: "video",
    title: "Video Segment",
    slug: "video",
  },
  {
    id: "testimonials",
    title: "Expertenstimmen",
    slug: "testimonials",
  },
  {
    id: "features",
    title: "Unsere Features",
    slug: "features",
  },
];

export default function WarumWirClient() {
  const [_currentSectionId, setCurrentSectionId] = useState<string>("hero");

  return (
    <div className="min-h-screen pt-12 bg-white">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Section 1 - Hero */}
        <section id="hero" className="w-full bg-black pt-12 flex items-center">
          <div className="w-full">
            <SectionHeader
              title="Die ®Nest Vision"
              subtitle="Eine Welt, in der Effizienz auf Architektur trifft."
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-8"
            />
          </div>
        </section>

        {/* Section 2 - YouTube Video Embed */}
        <section id="video" className="w-full bg-black pb-8 md:pb-16">
          <div className="w-full">
            {/* Responsive YouTube Embed Container */}
            <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/Z05jRVentdc?si=qGjw2glOumXnECch"
                  title="Nest Haus Vision - Die ®Nest Vision"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Text Content Below Video */}
            <div className="max-w-[1024px] 2xl:max-w-[1400px] mx-auto px-8 sm:px-16 lg:px-24 xl:px-32 2xl:px-8 mt-8 md:mt-12">
              <h2
                className="h2-title text-white text-center"
                dangerouslySetInnerHTML={{
                  __html:
                    "<span class='text-nest-gray'>Dein Nest ist</span> <span class='text-white font-medium'>mehr als ein Gebäude.</span> <span class='text-nest-gray'>Es ist </span> <span class='text-white font-medium'>eine neue Art zu leben.</span> <span class='text-nest-gray'>Ein</span> <span class='text-white font-medium'>Zuhause,</span> <span class='text-nest-gray'>das mit dir wächst, sich bewegt und</span> <span class='text-white font-medium'>Freiraum</span> <span class='text-nest-gray'>schafft.</span>",
                }}
              />

              {/* Buttons Below Text */}
              <div className="flex gap-4 justify-center w-full mt-8">
                <Link href="/nest-system">
                  <Button variant="primary" size="xs">
                    Termin vereinbaren
                  </Button>
                </Link>
                <Link href="/entwurf">
                  <Button variant="secondary-narrow-blue" size="xs">
                    Projekt starten
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 - Testimonials / Glass Quote Cards */}
        <section id="testimonials" className="w-full bg-black py-8 md:py-16">
          <div className="w-full">
            <SectionHeader
              title="Verlässlichkeit, auf die du bauen kannst"
              subtitle="Innovationen entstehen dort, wo junge Ideen auf Erfahrung treffen."
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-12"
            />

            <UnifiedContentCard
              layout="glass-quote"
              style="glass"
              variant="responsive"
              category="glassQuoteCards"
              backgroundColor="black"
              maxWidth={false}
              showInstructions={false}
              alignment="left"
            />
          </div>
        </section>

        {/* Section 4 - Team Values Cards */}
        <section className="w-full bg-white py-8 md:py-16">
          <div className="w-full mb-12 px-4 lg:pl-16 xl:pl-20 2xl:pl-24">
            <div className="text-left">
              <h2 className="h2-title font-normal text-black mb-3 md:mb-4">
                Kreativität und Erfahrung vereint
              </h2>
              <h3 className="h3-secondary font-normal text-black">
                Wir stellen uns kurz vor
              </h3>
            </div>
          </div>
          <div className="w-full">
            <UnifiedContentCard
              layout="team-card"
              style="glass"
              variant="responsive"
              category="warumWirTeamCards"
              backgroundColor="black"
              maxWidth={false}
              showInstructions={false}
              alignment="left"
            />
          </div>
        </section>

        {/* Partners Section */}
        <PartnersSection />

        {/* Section 5 - Tall Video Cards Features */}
        <section id="features" className="w-full bg-white py-8 md:py-16">
          <div className="w-full">
            <SectionHeader
              title="Innovation für unsere Zukunft"
              subtitle="Weil Nachhaltigkeit schon mit deinem Zuhause beginnt"
              wrapperMargin="mb-12"
            />

            <UnifiedContentCard
              {...TALL_CARD_PROPS_WITH_PADDING}
              variant="responsive"
              noPadding={true}
              customData={[
                {
                  id: 1,
                  title: "Wohnen im Kreislauf ",
                  subtitle: "",
                  description:
                    "Wohnen bedeutet Verantwortung. Deshalb bildet Nest jedes Modul als Teil eines Kreislaufes aus . Wir denken Gebäude so, dass sie sich verändern, zerlegen und wiederverwenden lassen. So entsteht ein Zuhause, das nicht nur gebaut, sondern bewusst geschaffen wird. Stets im Einklang mit Mensch und Umwelt.",
                  video: IMAGES.videos.nestHausTransport,
                  backgroundColor: "#F4F4F4",
                  buttons: [
                    {
                      text: "Unsere Technik verstehen",
                      variant: "primary",
                      size: "xs",
                      link: "/kontakt",
                    },
                  ],
                },
                {
                  id: 2,
                  title: "Wohnen, dass mit dir wächst",
                  subtitle: "",
                  description:
                    "Das Leben verändert sich, dein Zuhause sollte das auch können. Mit dem modularen Aufbau von Nest wächst oder schrumpft dein Raum, zieht mit dir um oder bleibt dort, wo du Wurzeln schlägst. So wird Wohnen flexibel, frei und zukunftsfähig. Wir glauben an ein Zuhause ohne Kompromisse.",
                  video: IMAGES.variantvideo.ten,
                  backgroundColor: "#F4F4F4",
                  buttons: [
                    {
                      text: "Zum Entwurf",
                      variant: "primary",
                      size: "xs",
                      link: "/kontakt",
                    },
                    {
                      text: "Jetzt konfigurieren",
                      variant: "secondary-narrow-blue",
                      size: "xs",
                      link: "/kontakt",
                    },
                  ],
                },
                {
                  id: 3,
                  title: "Wohnen im Kreislauf",
                  subtitle: "",
                  description:
                    "Holz ist mehr als ein Baustoff, es ist ein Versprechen an die Zukunft. Als nachwachsender Rohstoff speichert es CO₂, reguliert das Raumklima und schafft eine Atmosphäre, die natürlich wirkt und sich echt anfühlt.  Mit moderner Fertigungstechnik macht Nest aus einem natürlichen Material eine zukunftsfähige Bauweise.",
                  image: IMAGES.function.nestHausMaterialienSchema,
                  backgroundColor: "#F4F4F4",
                  buttons: [
                    {
                      text: "Mehr zu den Materialien",
                      variant: "primary",
                      size: "xs",
                      link: "/kontakt",
                    },
                  ],
                },
              ]}
            />
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />
      </SectionRouter>

      {/* Contact Banner - Kein Plan? Kein Problem! */}
      <GetInContactBanner />

      {/* Footer */}
      <Footer />
    </div>
  );
}
