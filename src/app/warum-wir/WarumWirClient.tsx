"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionRouter } from "@/components/SectionRouter";
import { Button } from "@/components/ui";
// Removed ModernVideoPlayer - using YouTube embed instead
import { UnifiedContentCard } from "@/components/cards";
import {
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
    id: "wir-sind-nest",
    title: "Die Nest Vision",
    slug: "wir-sind-nest",
  },
  {
    id: "verlaesslichkeit",
    title: "Verlässlichkeit, auf die du bauen kannst",
    slug: "verlaesslichkeit",
  },
  {
    id: "unser-team",
    title: "Kreativität und Erfahrung vereint",
    slug: "unser-team",
  },
  {
    id: "unsere-partner",
    title: "Unsere Partner",
    slug: "unsere-partner",
  },
  {
    id: "innovation",
    title: "Innovation für unsere Zukunft",
    slug: "innovation",
  },
  {
    id: "faq",
    title: "FAQ",
    slug: "faq",
  },
];

export default function WarumWirClient() {
  const [_currentSectionId, setCurrentSectionId] =
    useState<string>("wir-sind-nest");

  return (
    <div className="min-h-screen pt-12 bg-white">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Section 1 - Wir sind Nest (includes video) */}
        <section
          id="wir-sind-nest"
          className="w-full bg-black pt-12 flex items-center"
        >
          <div className="w-full">
            <SectionHeader
              title="Die ®Nest Vision"
              subtitle="Eine Welt, in der Effizienz auf Architektur trifft"
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-8 md:mb-12"
            />
          </div>
        </section>

        {/* Section 1 continued - YouTube Video Embed */}
        <section className="w-full bg-black pb-8 md:pb-16">
          <div className="w-full">
            {/* Responsive YouTube Embed Container - Privacy-Enhanced Mode */}
            <div className="w-full">
              <div className="max-w-[2000px] mx-auto">
                <div
                  className="relative w-full overflow-hidden"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube-nocookie.com/embed/Z05jRVentdc?si=MbTvwTABV-JtlsRy&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=Z05jRVentdc&amp;modestbranding=1&amp;rel=0&amp;showinfo=0"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    aria-label="YouTube video player"
                    aria-live="off"
                    data-captions="false"
                  />
                </div>
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
                <Link href="/kontakt">
                  <Button variant="primary" size="xs">
                    Termin vereinbaren
                  </Button>
                </Link>
                <Link href="/konfigurator">
                  <Button variant="secondary-narrow-blue" size="xs">
                    Konfigurieren
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 - Echo - Testimonials / Glass Quote Cards */}
        <section
          id="verlaesslichkeit"
          className="w-full bg-black py-8 md:py-16"
        >
          <div className="w-full">
            <SectionHeader
              title="Verlässlichkeit, auf die du bauen kannst"
              subtitle="Innovationen entstehen dort, wo junge Ideen auf Erfahrung treffen"
              titleClassName="text-white"
              subtitleClassName="text-white"
              wrapperMargin="mb-8 md:mb-12"
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

        {/* Section 3 - Unser Team - Team Values Cards */}
        <section id="unser-team" className="w-full bg-white py-8 md:py-16">
          <div className="w-full mb-8 md:mb-12 px-4 md:px-12">
            <div className="text-left">
              <h2 className="h2-title font-normal text-black mb-3 md:mb-4">
                Kreativität und Erfahrung vereint
              </h2>
              <h3 className="h3-secondary font-normal text-black">
                Wir stellen uns vor
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

        {/* Section 4 - Unser Partner */}
        <section id="unsere-partner">
          <PartnersSection />
        </section>

        {/* Section 5 - Innovation - Tall Video Cards Features */}
        <section id="innovation" className="w-full bg-white py-8 md:py-16">
          <div className="w-full">
            <SectionHeader
              title="Innovation für unsere Zukunft"
              subtitle="Weil Nachhaltigkeit schon mit deinem Zuhause beginnt"
              mobileTitle="Innovation für unsere Zukunft"
              wrapperMargin="mb-8 md:mb-16"
            />

            <UnifiedContentCard
              {...TALL_CARD_PROPS_WITH_PADDING}
              variant="responsive"
              noPadding={true}
              alignment="center"
              maxWidth={false}
              customData={[
                {
                  id: 1,
                  title: "Wohnen im Kreislauf ",
                  subtitle: "",
                  description:
                    "<span class='text-nest-gray'>Wohnen bedeutet Verantwortung. Deshalb bildet </span><span class='text-black font-medium'>Nest</span><span class='text-nest-gray'> jedes Modul als </span><span class='text-black font-medium'>Teil eines Kreislaufes</span><span class='text-nest-gray'> aus. Wir denken Gebäude so, dass sie sich verändern, zerlegen und </span><span class='text-black font-medium'>wiederverwenden</span><span class='text-nest-gray'> lassen. So entsteht ein Zuhause, das nicht nur gebaut, sondern bewusst geschaffen wird. Stets </span><span class='text-black font-medium'>im Einklang mit Mensch und Umwelt.</span>",
                  video: IMAGES.videos.nestHausTransport,
                  backgroundColor: "#F4F4F4",
                  buttons: [
                    {
                      text: "Das Nest System",
                      variant: "primary",
                      size: "xs",
                      link: "/nest-system",
                    },
                  ],
                },
                {
                  id: 2,
                  title: "Wohnen, dass mit dir wächst",
                  subtitle: "",
                  description:
                    "<span class='text-nest-gray'>Das Leben verändert sich, dein Zuhause sollte das auch können. Mit dem </span><span class='text-black font-medium'>modularen Aufbau</span><span class='text-nest-gray'> von Nest wächst oder schrumpft dein Raum, zieht mit dir um oder bleibt dort, wo du Wurzeln schlägst. So wird </span><span class='text-black font-medium'>Wohnen flexibel</span><span class='text-nest-gray'>, frei und zukunftsfähig. Wir glauben an ein </span><span class='text-black font-medium'>Zuhause ohne Kompromisse.</span>",
                  video: IMAGES.variantvideo.ten,
                  backgroundColor: "#F4F4F4",
                  buttons: [
                    {
                      text: "Konzept-Check",
                      variant: "primary",
                      size: "xs",
                      link: "/konzept-check",
                    },
                    {
                      text: "Jetzt konfigurieren",
                      variant: "secondary-narrow-blue",
                      size: "xs",
                      link: "/konfigurator",
                    },
                  ],
                },
                {
                  id: 3,
                  title: "Wohnen im Kreislauf",
                  subtitle: "",
                  description:
                    "<span class='text-nest-gray'>Holz ist </span><span class='text-black font-medium'>mehr als ein Baustoff</span><span class='text-nest-gray'>, es ist ein Versprechen an die </span><span class='text-black font-medium'>Zukunft.</span><span class='text-nest-gray'> Als nachwachsender Rohstoff </span><span class='text-black font-medium'>speichert</span><span class='text-nest-gray'> es CO₂, </span><span class='text-black font-medium'>reguliert</span><span class='text-nest-gray'> das Raumklima und schafft eine </span><span class='text-black font-medium'>Atmosphäre</span><span class='text-nest-gray'>, die natürlich wirkt und sich echt anfühlt. Mit moderner Fertigungstechnik macht Nest aus einem natürlichen Material eine </span><span class='text-black font-medium'>zukunftsfähige Bauweise.</span>",
                  image: IMAGES.flooring.eicheParkett,
                  backgroundColor: "#F4F4F4",
                  buttons: [
                    {
                      text: "Das Nest System",
                      variant: "primary",
                      size: "xs",
                      link: "/nest-system",
                    },
                  ],
                },
              ]}
            />
          </div>
        </section>

        {/* Section 6 - FAQ */}
        <section id="faq" className="w-full">
          <FAQSection />
        </section>
        <div className="h-8 md:h-16"></div>
      </SectionRouter>

      {/* Footer */}
      <Footer />
    </div>
  );
}
