'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export function Dialog({ 
  isOpen, 
  onClose, 
  children, 
  transparent = false,
  className = '' 
}: DialogProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
          onClick={onClose}
          style={{
            backgroundColor: transparent ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.8)'
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
} 