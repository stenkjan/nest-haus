import { TwoByTwoImageGrid, ThreeByOneGrid, ThreeByOneAdaptiveHeight, FullWidthImageGrid } from '@/components/grids';
import { IMAGES } from '@/constants/images';

export default function GridsShowcasePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 overflow-x-hidden">
      <div className="space-y-16">
        
        {/* Page Header */}
        <section>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Grid Components Showcase</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our collection of responsive grid layouts: 2x2 interactive grids, 3x1 layouts, full-width image grids, and single image displays. 
              Each component adapts seamlessly to different screen sizes and provides optimal user experience.
            </p>
          </div>
        </section>

        {/* Single Image Grid Section - Removed due to component issues */}

        {/* Image Grid Section - 2x2 Interactive Grid */}
        <section className="overflow-visible">
          <TwoByTwoImageGrid 
            title="Interactive 2x2 Image Grid"
            subtitle="2x2 grid with individual card lightboxes • Click any card to open detailed view"
            maxWidth={false}
          />
        </section>

        {/* Image Text Boxes Section - Full Width Image Grid */}
        <section className="overflow-visible">
          <FullWidthImageGrid 
            title="Full Width Image Grid"
            subtitle="Large image at top with two text boxes below • Responsive design adapts layout for mobile and desktop"
            maxWidth={true}
            image={IMAGES.function.nestHausModulAnsicht}
            textBox1="Standardisierung für Effizienz und Kostenoptimierung. Höchste Qualität zu einem leistbaren Preis durch intelligente Optimierung – und volle gestalterische Freiheit dort, wo sie wirklich zählt."
            textBox2="Alles, was sinnvoll standardisierbar ist, wird perfektioniert: Präzisionsgefertigte Module, effiziente Fertigung und bewährte Konstruktion sichern höchste Qualität bei optimalen Kosten."
            backgroundColor="black"
          />
        </section>

        {/* Text Image Grid Section - Left Position with Black Background */}
        <section className="overflow-visible">
          <ThreeByOneGrid 
            title="3x1 Grid - Left Position"
            subtitle="3-column layout: text left, images center and right • Black background variant"
            maxWidth={true}
            textPosition="left"
            backgroundColor="black"
            image1="21-NEST-Haus-Modul-Ansicht-Modul-Holz-Schema-Konzept"
            image2="22-NEST-Haus-Modul-Ansicht-Modul-Holz-Schema-Konzept-Liniengrafik"
            image1Description="Modulkonzept zeigt die durchdachte Konstruktion und optimierte Fertigung"
            image2Description="Seitenansicht verdeutlicht die präzise Statik und Passgenauigkeit"
          />
        </section>

        {/* Text Image Grid Section - Right Text Position with Black Background */}
        <section className="overflow-visible">
          <ThreeByOneGrid 
            title="3x1 Grid - Right Position"
            subtitle="3-column layout: text right, images left and center • Black background variant"
            maxWidth={true}
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
            title="3x1 Grid - Adaptive Height (No Width Constraints)"
            subtitle="Standard grid layout: side cells 4/3 ratio, middle adapts to image • Full width • Fenster & Türen Planung"
            maxWidth={false}
            backgroundColor="black"
            image={IMAGES.function.nestHausFensterTuerenPosition}
            imageDescription="NEST Haus Fenster und Türen Positionierung Konzept"
            text="Mit deinem Nest-Haus bestimmst du selbst, wo Fenster und Türen ihren Platz finden sollen. Nach deiner Reservierung setzen wir uns mit dir in Verbindung, um die ideale Platzierung festzulegen. Auf Basis deiner Vorgaben fertigen wir dein Zuhause mit passgenauen Öffnungen an. Dort platzieren wir im Anschluss deine Fenster & Türen."
          />
        </section>

      </div>
    </div>
  );
} 