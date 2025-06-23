// src/app/konfigurator/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { DialogProvider } from '@/context/DialogContext';
import Configurator, { ConfiguratorRef } from '@/components/custom/Configurator';
import { IMAGES } from '../../constants/images';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateMonthlyPayment } from '../../utils/configurator';
import styles from './configurator.module.css';
import { useConfiguratorContext, ConfiguratorProvider } from '../../context/ConfiguratorContext';

function KonfiguratorContent() {
  const { totalPrice, selections } = useConfiguratorContext();
  const { cartItems } = useCart();
  const configuratorRef = useRef<ConfiguratorRef>(null);
  const [canScrollMain, setCanScrollMain] = React.useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isIOSMobile, setIsIOSMobile] = useState(false);

  // Utility function to detect iOS
  function isIOS() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent.includes('Macintosh') && typeof document !== 'undefined' && 'ontouchend' in document)
    );
  }

  // Check if we're on desktop and iOS mobile
  useEffect(() => {
    const checkPlatform = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
      setIsIOSMobile(isIOS() && window.innerWidth < 1024);
    };

    // Initial check
    checkPlatform();

    // Add resize listener
    window.addEventListener('resize', checkPlatform);
    return () => window.removeEventListener('resize', checkPlatform);
  }, []);

  // Handle scroll events - only on desktop
  useEffect(() => {
    if (!isDesktop) return; // Skip scroll handling on mobile

    const handleScroll = (e: Event) => {
      if (configuratorRef.current) {
        const { isRightPanelAtBottom } = configuratorRef.current;
        setCanScrollMain(isRightPanelAtBottom);
      }
    };

    // Add scroll listeners
    const mainContainer = document.querySelector(`.${styles.configuratorPage}`);
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Prevent default scroll only on the main container when right panel is not at bottom
    const preventScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      // Don't prevent scroll if we're scrolling the right panel
      if (target.closest('.right-panel')) {
        return;
      }

      // Only prevent scroll on the main container when right panel is not at bottom
      if (!canScrollMain && target.closest(`.${styles.configuratorPage}`)) {
        e.preventDefault();
      }
    };

    if (mainContainer) {
      mainContainer.addEventListener('wheel', preventScroll as EventListener, { passive: false });
    }

    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
        mainContainer.removeEventListener('wheel', preventScroll as EventListener);
      }
    };
  }, [canScrollMain, isDesktop]);

  // Use the same price calculation as Configurator.tsx
  const finalTotalPrice = React.useMemo(() => {
    return totalPrice;
  }, [totalPrice]);

  return (
    <div 
      className={`${styles.configuratorPage} relative overflow-hidden lg:overflow-auto hide-scrollbar min-h-screen flex flex-col`}
      style={{ 
        // Only apply scroll control on desktop
        overflow: isDesktop ? (canScrollMain ? 'auto' : 'hidden') : 'auto',
        height: isDesktop ? '100vh' : 'auto'
      }}
    >
      {/* Configurator Component */}
      <section className={`${styles.configuratorContainer} w-full bg-white pt-12 hide-scrollbar flex-1`}>
        <div className="px-4 lg:px-8 hide-scrollbar h-full">
          <Configurator ref={configuratorRef} />
        </div>
      </section>

      {/* Information Section - Hidden on iOS mobile */}
      {!isIOSMobile && (
        <section className="w-full py-2 bg-gray-50 mt-auto">
          <div className="content-width">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium mb-4 tracking-[-0.015em]">Individualisierung</h3>
                <p className="text-gray-600 font-normal text-[11px] tracking-[-0.015em] leading-[15px]">
                  Passe Größe, Raumaufteilung und Fassade nach deinen individuellen Bedürfnissen an. Gestalte ein Zuhause, das perfekt zu dir passt.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium mb-4 tracking-[-0.015em]">Preistransparenz</h3>
                <p className="text-gray-600 font-normal text-[7px] tracking-[-0.015em] leading-[10px]">
                  Alle Änderungen werden in Echtzeit kalkuliert. Du behältst stets den vollen Überblick über die Kosten deines Projekts.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium mb-4 tracking-[-0.015em]">Beratung inklusive</h3>
                <p className="text-gray-600 font-normal text-[6px] tracking-[-0.015em] leading-[8px]">
                  Nach der Konfiguration erhältst du eine persönliche Beratung durch unsere Experten, um dein Traumprojekt zu optimieren.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer - Updated to match design */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50">
        <div className="max-w-[1600px] mx-auto px-4 flex justify-between items-center">
          {/* Neu konfigurieren as text button, no underline, smaller on mobile */}
          <button
            className="bg-transparent border-none p-0 m-0 text-[#222] font-normal focus:outline-none cursor-pointer text-xs lg:text-base hover:text-[#3D6DE1]"
            style={{ minWidth: 0 }}
            onClick={() => {
              configuratorRef.current?.reset();
            }}
            type="button"
          >
            Neu konfigurieren
          </button>
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Price and monthly rate */}
            <div className="text-right mr-2">
              <p className="font-semibold leading-tight text-xs lg:text-xl">{formatPrice(finalTotalPrice)}</p>
              <p className="text-[10px] lg:text-xs text-gray-500 leading-tight">oder {calculateMonthlyPayment(finalTotalPrice)} für 120 Mo.</p>
            </div>
            {/* Jetzt bauen button, smaller on mobile */}
            <Link
              href="/warenkorb"
              className={`bg-[#3D6DE1] text-white rounded-full font-medium text-xs lg:text-base px-3 py-1 lg:px-6 lg:py-2 ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={e => cartItems.length === 0 && e.preventDefault()}
            >
              Jetzt bauen
            </Link>
          </div>
        </div>
      </div>

      {/* Add padding to the bottom of the content to account for the fixed footer */}
      <div className="h-20"></div>
    </div>
  );
}

export default function KonfiguratorPage() {
  return (
    <DialogProvider>
      <ConfiguratorProvider>
        <KonfiguratorContent />
      </ConfiguratorProvider>
    </DialogProvider>
  );
}