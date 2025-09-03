"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { useIOSViewport, getIOSViewportStyles } from "@/hooks/useIOSViewport";
import PlanungspaketeCards, {
  PlanungspaketeCardData,
} from "./PlanungspaketeCards";

interface PlanungspaketeCardsLightboxProps {
  title?: string;
  subtitle?: string;
  triggerClassName?: string;
  triggerText?: string;
  customData?: PlanungspaketeCardData[];
}

export default function PlanungspaketeCardsLightbox({
  title = "Planungspakete Details",
  subtitle: _subtitle = "Click on any card to see detailed information",
  triggerClassName = "",
  triggerText = "Open Planungspakete in Lightbox",
  customData,
}: PlanungspaketeCardsLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  // iOS viewport hook for stable lightbox sizing
  const viewport = useIOSViewport();

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
        <div
          className="w-full h-full flex items-center justify-center p-2 md:p-8 overflow-y-auto ios-dialog-container"
          style={getIOSViewportStyles(viewport)}
        >
          {/* PlanungspaketeCards with transparent background */}
          <div className="w-full max-w-none my-4">
            <PlanungspaketeCards
              title={title}
              subtitle=""
              maxWidth={false}
              showInstructions={false}
              isLightboxMode={true}
              customData={customData}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
