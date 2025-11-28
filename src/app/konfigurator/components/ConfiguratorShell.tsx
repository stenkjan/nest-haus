"use client";

import React, { useEffect } from "react";
import type { ConfiguratorProps } from "../types/configurator.types";
import { useConfiguratorLogic } from "../hooks/useConfiguratorLogic";
import ConfiguratorUI from "./ConfiguratorUI";

export default function ConfiguratorShell({
  onPriceChange,
  rightPanelRef,
}: ConfiguratorProps & { rightPanelRef?: React.RefObject<HTMLDivElement | null> }) {
  const logic = useConfiguratorLogic(rightPanelRef);

  // Notify parent components of price changes
  useEffect(() => {
    onPriceChange?.(logic.currentPrice);
  }, [logic.currentPrice, onPriceChange]);

  return <ConfiguratorUI logic={logic} rightPanelRef={rightPanelRef} />;
}
