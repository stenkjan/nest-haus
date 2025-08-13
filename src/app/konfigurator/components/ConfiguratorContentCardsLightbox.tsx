"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Dialog } from "@/components/ui";
import { ContentCards } from "@/components/cards";
import {
  getConfiguratorDialogData,
  type TransformedDialogData,
} from "../core/DialogDataTransformer";

interface ConfiguratorContentCardsLightboxProps {
  categoryKey:
    | "materials"
    | "innenverkleidung"
    | "fenster"
    | "fussboden"
    | "photovoltaik";
  triggerClassName?: string;
  triggerText?: string;
}

export default function ConfiguratorContentCardsLightbox({
  categoryKey,
  triggerClassName = "",
  triggerText = "Mehr Informationen anzeigen",
}: ConfiguratorContentCardsLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogData, setDialogData] = useState<TransformedDialogData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Load dialog data asynchronously when component mounts or categoryKey changes
  useEffect(() => {
    const loadDialogData = async () => {
      try {
        setIsLoading(true);
        const data = await getConfiguratorDialogData(categoryKey);
        setDialogData(data);
      } catch (error) {
        console.error(`Failed to load dialog data for ${categoryKey}:`, error);
        setDialogData({
          title: "Information",
          subtitle: "Details",
          cards: [],
          actionButton: undefined,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDialogData();
  }, [categoryKey]);

  // Transform dialog data to ContentCards format
  const cardData = useMemo(() => {
    if (!dialogData?.cards) return [];

    return dialogData.cards.map((card) => ({
      id: card.id,
      title: card.title,
      subtitle: card.subtitle,
      description: card.description,
      mobileDescription: card.mobileDescription,
      image: card.image,
      backgroundColor: card.backgroundColor,
    }));
  }, [dialogData?.cards]);

  // Don't render if still loading
  if (isLoading || !dialogData) {
    return (
      <div
        className={`box_info flex justify-between items-center bg-gray-100 rounded-[1.2rem] px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] cursor-pointer mt-[clamp(1rem,2vh,1.5rem)] relative min-h-[3rem] min-h-[44px] transition-all duration-200 opacity-50 cursor-not-allowed ${triggerClassName}`}
      >
        <div className="flex-1 min-w-0 pr-4">
          <p className="font-medium text-[clamp(1rem,1.8vw,1.125rem)] tracking-wide leading-tight whitespace-nowrap overflow-hidden text-ellipsis mb-0 text-gray-500">
            Lade...
          </p>
        </div>

        <div className="min-w-[1.5rem] min-h-[1.5rem] rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-[0.75rem] h-[0.75rem]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Trigger Button - Matching exact InfoBox design with arrow icon */}
      <div
        onClick={handleOpen}
        className={`box_info flex justify-between items-center bg-gray-100 rounded-[1.2rem] px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] cursor-pointer mt-[clamp(1rem,2vh,1.5rem)] relative min-h-[3rem] min-h-[44px] transition-all duration-200 hover:bg-gray-200 ${triggerClassName}`}
      >
        <div className="flex-1 min-w-0 pr-4">
          <p className="font-medium text-[clamp(1rem,1.8vw,1.125rem)] tracking-wide leading-tight whitespace-nowrap overflow-hidden text-ellipsis mb-0 text-black">
            {triggerText}
          </p>
        </div>

        <div className="min-w-[1.5rem] min-h-[1.5rem] rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-[0.75rem] h-[0.75rem]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        transparent={true}
        className="p-0"
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-1 md:p-4 overflow-y-auto">
          {/* ContentCards with responsive variant and custom data - Compact spacing for lightbox */}
          <div className="w-full max-w-none">
            <ContentCards
              variant="responsive"
              title={dialogData.title}
              subtitle={dialogData.subtitle}
              maxWidth={false}
              showInstructions={false}
              isLightboxMode={true}
              customData={cardData}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
