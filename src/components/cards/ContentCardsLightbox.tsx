'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import ContentCards from './ContentCards';

interface ContentCardsLightboxProps {
  variant?: 'normal' | 'wide' | 'extra-wide' | 'pricing';
  title?: string;
  subtitle?: string;
  triggerClassName?: string;
  triggerText?: string;
}

// Custom pricing lightbox that handles card clicks
interface PricingCardsLightboxProps {
  title?: string;
  subtitle?: string;
}

export function PricingCardsLightbox({ 
  title = 'Pricing Details',
  subtitle = 'Click on any card to see detailed information'
}: PricingCardsLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [_selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const handleCardClick = (cardId: number) => {
    setSelectedCardId(cardId);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCardId(null);
  };

  return (
    <>
      {/* Main Pricing Cards - Clickable */}
      <ContentCards 
        variant="pricing"
        title={title}
        subtitle={subtitle}
        maxWidth={false}
        showInstructions={true}
        isLightboxMode={false}
        onCardClick={handleCardClick}
      />

      {/* Lightbox Dialog */}
      <Dialog 
        isOpen={isOpen} 
        onClose={handleClose}
        transparent={true}
        className="p-0"
      >
        <div className="w-full h-full flex items-center justify-center p-8">
          {/* ContentCards in lightbox mode */}
          <div className="w-full max-w-none">
            <ContentCards 
              variant="pricing"
              title=""
              subtitle=""
              maxWidth={false}
              showInstructions={false}
              isLightboxMode={true}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default function ContentCardsLightbox({ 
  variant = 'normal',
  title = 'Content Cards',
  subtitle: _subtitle = 'Navigate with arrow keys or swipe on mobile',
  triggerClassName = '',
  triggerText = 'Open in Lightbox'
}: ContentCardsLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl ${triggerClassName}`}
      >
        {triggerText}
      </button>

      {/* Lightbox Dialog */}
      <Dialog 
        isOpen={isOpen} 
        onClose={handleClose}
        transparent={true}
        className="p-0"
      >
        <div className="w-full h-full flex items-center justify-center">
          {/* ContentCards with transparent background */}
          <div className="w-full max-w-none">
            <ContentCards 
              variant={variant}
              title={title}
              subtitle=""
              maxWidth={false}
              showInstructions={false}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
} 