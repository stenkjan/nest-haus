import { ButtonShowcase } from '@/components/ui';
import { ContentCards, ContentCardsLightbox, ImageGrid, TextImageGrid, ImageTextBoxes, PricingCardsLightbox } from '@/components/cards';
import { IMAGES } from '@/constants/images';

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 overflow-x-hidden">
      <div className="space-y-16">
        
        {/* Content Cards Section - Responsive */}
        <section className="overflow-visible">
          <ContentCards 
            variant="responsive"
            title="Content Cards Responsive"
            subtitle="Automatically adapts: Wide layout on desktop, mobile layout on tablets/phones • Navigate with arrow keys or swipe"
            maxWidth={false}
          />
          
          {/* Lightbox Button for Responsive Cards */}
          <div className="flex justify-center mt-8">
            <ContentCardsLightbox 
              variant="responsive"
              title="Content Cards Responsive - Lightbox View"
              subtitle="Automatically adapts to screen size • Navigate with arrow keys or swipe • Click outside or press ESC to close"
              triggerText="Open Responsive Cards in Lightbox"
              triggerClassName="mx-2"
            />
          </div>
        </section>

        {/* Content Cards Pricing Section - Clickable Cards with Lightbox */}
        <section className="overflow-visible">
          <PricingCardsLightbox 
            title="Content Cards Pricing"
            subtitle="Click on any card to see detailed information in lightbox"
          />
        </section>

        {/* Content Cards Static Section - Single Responsive Card */}
        <section className="overflow-visible">
          <ContentCards 
            variant="static"
            title="Content Cards Static"
            subtitle="Single responsive card: Wide layout on desktop, mobile layout on tablets/phones"
            maxWidth={false}
          />
          
          {/* Lightbox Button for Static Cards */}
          <div className="flex justify-center mt-8">
            <ContentCardsLightbox 
              variant="static"
              title="Content Cards Static - Lightbox View"
              subtitle="Responsive single card • Adapts layout based on screen size • Click outside or press ESC to close"
              triggerText="Open Static Card in Lightbox"
              triggerClassName="mx-2"
            />
          </div>
        </section>

        {/* Image Grid Section - 2x2 Interactive Grid */}
        <section className="overflow-visible">
          <ImageGrid 
            title="Interactive Image Grid"
            subtitle="2x2 grid with individual card lightboxes • Click any card to open detailed view"
            maxWidth={false}
          />
        </section>

        {/* Image Text Boxes Section - New Component */}
        <section className="overflow-visible">
          <ImageTextBoxes 
            title="Image & Text Boxes Layout"
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
          <TextImageGrid 
            title="Text & Image Grid - Left Position"
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
          <TextImageGrid 
            title="Text & Image Grid - Right Position"
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

        {/* Button Showcase Section - Constrained Width */}
        <section>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Button Components</h2>
              <p className="text-gray-600">Various button styles and variants</p>
            </div>
            <ButtonShowcase />
          </div>
        </section>

      </div>
    </div>
  );
} 