'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogPortal } from '@/components/ui/dialog';
import { MaterialsSlider } from '@/components/custom/MaterialsSlider';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { FramerMaterialsSlider } from '@/components/custom/FramerMaterialsSlider';

export interface MaterialCard {
  id: number;
  title: string;
  subtitle?: string;
  description: string | {
    mobile: string;
    desktop: string;
  };
  imagePath: string;
}

export interface MaterialSliderDialogConfig {
  title: {
    main: string;
    subtitle?: string;
  };
  cards: MaterialCard[];
  actionButton: {
    text: string;
    href: string;
  };
  sliderKey: string;
}

interface MaterialSliderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  config: MaterialSliderDialogConfig;
}

// Custom overlay with brightness filter
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

const MaterialSliderDialog: React.FC<MaterialSliderDialogProps> = ({
  isOpen,
  onClose,
  config
}) => {
  // Ensure dialog is properly mounted/unmounted
  const [mounted, setMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      setMounted(false);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop - closes dialog when clicked */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Dialog Content */}
      <div 
        className="relative z-10 w-full h-full md:w-[90vw] md:h-[80vh] md:max-w-6xl md:rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Hidden on mobile, visible on desktop */}
        <div className="hidden bg-white/95 backdrop-blur-sm p-3 md:p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{config.title.main}</h2>
              {config.title.subtitle && (
                <p className="text-gray-600 mt-1">{config.title.subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Close Button - Top left corner, visible on both mobile and desktop */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-30 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Slider Content */}
        <div 
          className="h-full"
          style={{ 
            touchAction: 'manipulation',
            pointerEvents: 'auto'
          }}
        >
          <FramerMaterialsSlider
            cards={config.cards}
            animationType="smooth"
          />
        </div>
      </div>
    </div>
  );
};

export default MaterialSliderDialog; 