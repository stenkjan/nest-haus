import { ButtonShowcase } from '@/components/ui';
import { ContentCards, ContentCardsLightbox, ImageGrid, TextImageGrid, PricingCardsLightbox } from '@/components/cards';

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

        {/* Text Image Grid Section - 3 Column Layout */}
        <section className="overflow-visible">
          <TextImageGrid 
            title="Text & Image Grid"
            subtitle="3-column layout: text left, images center and right • Responsive mobile stacking"
            maxWidth={false}
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