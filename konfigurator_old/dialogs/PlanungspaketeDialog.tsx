// src/components/custom/dialogs/PlanungspaketeDialog.tsx
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { PlanungspaketeGrid } from '@/components/custom/PlanungspaketeGrid';
import { PLANUNGSPAKETE } from '../../types/planungspakete';
import { PLANNING_PACKAGES } from '../../constants/configurator';
import * as DialogPrimitive from "@radix-ui/react-dialog";

// Map dialog package IDs to configurator package values
const PACKAGE_ID_TO_VALUE: { [key: string]: string } = {
    'paket-01': 'basis',
    'paket-02': 'basis_plus',
    'paket-03': 'basis_pro'
};

interface PlanungspaketeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPackage?: (packageId: string | null) => void;
  showExtendedInfo?: boolean;
}

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

const PlanungspaketeDialog: React.FC<PlanungspaketeDialogProps> = ({
  isOpen,
  onClose,
  onSelectPackage,
  showExtendedInfo = false
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handlePackageSelect = (packageId: string | null) => {
    setSelectedPackage(packageId);
  };

  const handleConfirmSelection = () => {
    if (selectedPackage) {
      // Map the dialog package ID to the configurator package value
      const configuratorPackageValue = PACKAGE_ID_TO_VALUE[selectedPackage];
      if (configuratorPackageValue) {
        onSelectPackage?.(configuratorPackageValue);
        onClose();
      } else {
        console.warn(`No mapping found for package ID: ${selectedPackage}`);
      }
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      {/* Title above the dialog */}
      <div
        className="fixed top-[1vh] z-[100] w-full max-w-[1700px] px-6 left-0 right-0 mx-auto"
      >
        <DialogTitle className="hidden md:block font-bold text-h2-mobile md:text-3xl text-center text-gray-900 mb-2 mt-[5vh] md:mt-[5vh]">
          Unsere Planungspakete
        </DialogTitle>
      </div>
      <DialogPrimitive.Portal>
        <BrightOverlay />
        <DialogPrimitive.Content
          className="max-w-full w-[95vw] fixed top-[5vh] md:top-[10vh] left-0 right-0 mx-auto p-0 overflow-hidden z-[100]"
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('input[type="radio"]') || target.closest('label[for*="planningPackage"]')) {
              e.preventDefault();
            }
          }}
        >
          <div 
            className="relative w-full h-[90vh] md:h-[88vh] overflow-y-auto pt-1 pb-1 md:pt-2 md:pb-2 px-1 md:px-1 flex justify-center items-start"
            style={{ minHeight: '300px' }}
          >
            <div className="max-w-[1700px] mx-auto bg-[#F4F4F4] rounded-[32px] md:rounded-[32px] px-1 md:px-5 pb-3 flex flex-col items-center shadow-md">
              <PlanungspaketeGrid
                variant="dialog"
                packages={PLANUNGSPAKETE}
                onSelectPackage={handlePackageSelect}
                selectedPackage={selectedPackage}
                showExtendedInfo={showExtendedInfo}
                showButtons={true}
                className="mt-2"
                onConfirmSelection={handleConfirmSelection}
              />
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};

export default PlanungspaketeDialog;