import { ButtonShowcase } from '@/components/ui';
import { ContentCards, ContentCardsLightbox } from '@/components/cards';

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="space-y-16">
        
        {/* Content Cards Section - Normal */}
        <section className="overflow-visible">
          <ContentCards 
            variant="normal"
            title="Content Cards"
            subtitle="Navigate with arrow keys or swipe on mobile"
            maxWidth={false}
          />
          
          {/* Lightbox Button for Normal Cards */}
          <div className="flex justify-center mt-8">
            <ContentCardsLightbox 
              variant="normal"
              title="Content Cards - Lightbox View"
              subtitle="Navigate with arrow keys or swipe • Click outside or press ESC to close"
              triggerText="Open Normal Cards in Lightbox"
              triggerClassName="mx-2"
            />
          </div>
        </section>

        {/* Content Cards Wide Section - Full Width */}
        <section className="overflow-visible">
          <ContentCards 
            variant="wide"
            title="Content Cards Wide"
            subtitle="Navigate with arrow keys or swipe on mobile"
            maxWidth={false}
          />
          
          {/* Lightbox Button for Wide Cards */}
          <div className="flex justify-center mt-8">
            <ContentCardsLightbox 
              variant="wide"
              title="Content Cards Wide - Lightbox View"
              subtitle="Navigate with arrow keys or swipe • Click outside or press ESC to close"
              triggerText="Open Wide Cards in Lightbox"
              triggerClassName="mx-2"
            />
          </div>
        </section>

        {/* Content Cards Extra-Wide Section - Single Card */}
        <section className="overflow-visible">
          <ContentCards 
            variant="extra-wide"
            title="Content Cards Extra-Wide"
            subtitle="Single card with 1/3 text and 2/3 image layout"
            maxWidth={false}
          />
          
          {/* Lightbox Button for Extra-Wide Cards */}
          <div className="flex justify-center mt-8">
            <ContentCardsLightbox 
              variant="extra-wide"
              title="Content Cards Extra-Wide - Lightbox View"
              subtitle="1/3 text, 2/3 image layout • Click outside or press ESC to close"
              triggerText="Open Extra-Wide Card in Lightbox"
              triggerClassName="mx-2"
            />
          </div>
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