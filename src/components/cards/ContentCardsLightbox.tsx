'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import ContentCards from './ContentCards';

interface ContentCardsLightboxProps {
  variant?: 'normal' | 'wide';
  title?: string;
  subtitle?: string;
  triggerClassName?: string;
  triggerText?: string;
}

export default function ContentCardsLightbox({ 
  variant = 'normal',
  title = 'Content Cards',
  subtitle = 'Navigate with arrow keys or swipe on mobile',
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
              subtitle={subtitle}
              maxWidth={false}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
} 