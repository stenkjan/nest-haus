"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import ContentCards from "./ContentCards";

interface CardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  mobileDescription?: string;
  image: string;
  backgroundColor: string;
}

interface StaticCardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  mobileDescription?: string;
  image: string;
  backgroundColor: string;
  buttons?: Array<{
    text: string;
    variant: "primary" | "secondary";
    size: "xs" | "sm" | "md" | "lg";
    link?: string;
    onClick?: () => void;
  }>;
}

interface ContentCardsLightboxProps {
  variant?: "responsive" | "static";
  title?: string;
  subtitle?: string;
  triggerClassName?: string;
  triggerText?: string;
  customData?: CardData[] | StaticCardData[];
}

export default function ContentCardsLightbox({
  variant = "responsive",
  title = "Content Cards",
  subtitle: _subtitle = "Navigate with arrow keys or swipe on mobile",
  triggerClassName = "",
  triggerText = "Open in Lightbox",
  customData,
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
        <div className="w-full h-full flex items-center justify-center overflow-y-auto">
          {/* ContentCards with transparent background */}
          <div className="w-full max-w-none my-4">
            <ContentCards
              variant={variant}
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
