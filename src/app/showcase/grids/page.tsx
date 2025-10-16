import {
  TwoByTwoImageGrid,
  ThreeByOneGrid,
  ThreeByOneAdaptiveHeight,
  FullWidthImageGrid,
  FullWidthTextGrid,
  ImageWithFourTextGrid,
} from "@/components/grids";
import { UnifiedContentCard } from "@/components/cards";
import { IMAGES } from "@/constants/images";

export default function GridsShowcasePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 overflow-x-hidden">
      <div className="space-y-16">
        {/* Page Header */}
        <section>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Grid Components Showcase
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our collection of responsive grid layouts: 2x2 interactive
              grids, 3x1 layouts, full-width image grids, and single image
              displays. Each component adapts seamlessly to different screen
              sizes and provides optimal user experience.
            </p>
          </div>
        </section>

        {/* Single Image Grid Section - Removed due to component issues */}

        {/* Image Grid Section - 2x2 Interactive Grid */}
        <section className="overflow-visible">
          <div className="mb-8 text-center">
            <h2 className="h2-secondary text-gray-900 mb-4">
              Interactive 2x2 Image Grid
            </h2>
            <p className="text-gray-600">
              2x2 grid with individual card lightboxes • Click any card to open
              detailed view
            </p>
          </div>
          <TwoByTwoImageGrid
            maxWidth={false}
            customData={[
              {
                id: 1,
                title: "Grid Item 1",
                subtitle: "Sample subtitle",
                description: "Sample description for grid item 1",
                image:
                  "/images/1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche.png",
                backgroundColor: "bg-gray-900",
                primaryAction: "Learn More",
                secondaryAction: "View Details",
              },
              {
                id: 2,
                title: "Grid Item 2",
                subtitle: "Sample subtitle",
                description: "Sample description for grid item 2",
                image:
                  "/images/2-NEST-Haus-7-Module-Ansicht-Weisse-Fassadenplatten.png",
                backgroundColor: "bg-gray-800",
                primaryAction: "Learn More",
                secondaryAction: "View Details",
              },
              {
                id: 3,
                title: "Grid Item 3",
                subtitle: "Sample subtitle",
                description: "Sample description for grid item 3",
                image:
                  "/images/3-NEST-Haus-3-Gebaeude-Vogelperspektive-Holzlattung-Laerche.png",
                backgroundColor: "bg-gray-700",
                primaryAction: "Learn More",
                secondaryAction: "View Details",
              },
              {
                id: 4,
                title: "Grid Item 4",
                subtitle: "Sample subtitle",
                description: "Sample description for grid item 4",
                image:
                  "/images/4-NEST-Haus-2-Gebaeude-Schnee-Stirnseite-Schwarze-Trapezblech-Fassade.png",
                backgroundColor: "bg-gray-600",
                primaryAction: "Learn More",
                secondaryAction: "View Details",
              },
            ]}
          />
        </section>

        {/* Image Text Boxes Section - Full Width Image Grid */}
        <section className="overflow-visible">
          <FullWidthImageGrid
            maxWidth={true}
            image={IMAGES.function.nestHausModulAnsicht}
            textBox1="Standardisierung für Effizienz und Kostenoptimierung. Höchste Qualität zu einem leistbaren Preis durch intelligente Optimierung – und volle gestalterische Freiheit dort, wo sie wirklich zählt."
            textBox2="Alles, was sinnvoll standardisierbar ist, wird perfektioniert: Präzisionsgefertigte Module, effiziente Fertigung und bewährte Konstruktion sichern höchste Qualität bei optimalen Kosten."
            backgroundColor="black"
          />
        </section>

        {/* Text Image Grid Section - Left Position with Black Background */}
        <section className="overflow-visible">
          <ThreeByOneAdaptiveHeight
            maxWidth={false}
            backgroundColor="black"
            image="21-NEST-Haus-Modul-Ansicht-Modul-Holz-Schema-Konzept"
            imageDescription="Modulkonzept zeigt die durchdachte Konstruktion und optimierte Fertigung"
          />
        </section>

        {/* Text Image Grid Section - Right Text Position with Black Background */}
        <section className="overflow-visible">
          <ThreeByOneGrid
            maxWidth={false}
            textPosition="right"
            backgroundColor="black"
            image1="23-NEST-Haus-Modul-Ansicht-Seite-Holz-Schema-Konzept"
            image2="24-NEST-Haus-Modul-Ansicht-Seite-Holz-Schema-Konzept-Liniengrafik"
            text="Seitliche Ansicht des Moduls zeigt die durchdachte Konstruktion und die optimierte Statik. Jedes Modul ist selbsttragend und kann flexibel mit anderen Modulen kombiniert werden. Die präzise Fertigung garantiert perfekte Passgenauigkeit und höchste Qualität."
            image1Description="Seitliche Ansicht zeigt die durchdachte Konstruktion"
            image2Description="Liniengrafik verdeutlicht die optimierte Statik"
          />
        </section>

        {/* Adaptive Height Grid Section */}
        <section className="overflow-visible">
          <ThreeByOneAdaptiveHeight
            maxWidth={false}
            backgroundColor="black"
            image={IMAGES.function.nestHausFensterTuerenPosition}
            imageDescription="NEST Haus Fenster und Türen Positionierung Konzept"
            text="Mit deinem Nest-Haus bestimmst du selbst, wo Fenster und Türen ihren Platz finden sollen. Nach deiner Reservierung setzen wir uns mit dir in Verbindung, um die ideale Platzierung festzulegen. Auf Basis deiner Vorgaben fertigen wir dein Zuhause mit passgenauen Öffnungen an. Dort platzieren wir im Anschluss deine Fenster & Türen."
          />
        </section>

        {/* Full Width Text Grid Section */}
        <section className="overflow-visible">
          <FullWidthTextGrid
            maxWidth={true}
            backgroundColor="black"
            textBox1="This grid component focuses purely on text content with two responsive columns. Perfect for detailed explanations, feature descriptions, or content that doesn't require visual media. The layout automatically adapts to mobile devices by stacking the columns vertically."
            textBox2="The component maintains the same design consistency as other grid components while providing a clean, text-focused layout. It includes smooth animations, responsive typography scaling, and configurable background colors to match your design needs."
          />
        </section>

        {/* Image with Four Text Grid Section */}
        <section className="overflow-visible">
          <ImageWithFourTextGrid
            maxWidth={false}
            image={IMAGES.function.nestHausModulElektrikSanitaer}
            imageDescription="NEST Haus Planung Elektrik Sanitär Einbau Gebäudetechnik HKLS Modul"
            backgroundColor="black"
            textCellTitle1="Effizienz"
            textCellTitle2="Nachhaltigkeit"
            textCellTitle3="Flexibilität"
            textCellTitle4="Qualität"
            textCell1="Intelligente Standardisierung ermöglicht präzisionsgefertigte Module und garantiert höchste Qualität bei optimalen Kosten."
            textCell2="Alle verwendeten Materialien sind umweltfreundlich und tragen zu einer besseren CO2-Bilanz bei."
            textCell3="Trotz Standardisierung bieten wir vollständige gestalterische Freiheit dort, wo sie wirklich zählt."
            textCell4="Bewährte Konstruktion und modernste Fertigung sichern Langlebigkeit und Zuverlässigkeit."
          />
        </section>

        {/* Image Glass Card Section */}
        <section className="overflow-visible bg-black py-16">
          <UnifiedContentCard
            layout="image-only"
            style="glass"
            variant="static"
            backgroundColor="black"
            maxWidth={true}
            showInstructions={false}
            customData={[
              {
                id: 1,
                title: "NEST-Haus Hand Drawing",
                subtitle: "",
                description: "",
                image:
                  "/images/26-NEST-Haus-Planung-Innenausbau-Zeichnen-Grundriss.png",
                backgroundColor: "#121212",
              },
            ]}
            enableLightbox={false}
          />
        </section>
      </div>
    </div>
  );
}
