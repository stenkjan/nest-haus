"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import ContentCardsGlass from "./ContentCardsGlass";

interface ContentCardsGlassLightboxProps {
  variant?: "responsive" | "static";
  title?: string;
  subtitle?: string;
  triggerClassName?: string;
  triggerText?: string;
}

export default function ContentCardsGlassLightbox({
  variant = "responsive",
  title = "Content Cards Glass",
  subtitle: _subtitle = "Navigate with arrow keys or swipe on mobile",
  triggerClassName = "",
  triggerText = "Open Glass Cards in Lightbox",
}: ContentCardsGlassLightboxProps) {
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
        <div className="w-full h-full flex items-center justify-center p-2 md:p-8 overflow-y-auto">
          {/* ContentCardsGlass with transparent background */}
          <div className="w-full max-w-none my-4">
            <ContentCardsGlass
              variant={variant}
              title={title}
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
