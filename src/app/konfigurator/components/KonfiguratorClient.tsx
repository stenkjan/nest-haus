"use client";

import React, { useRef, useEffect } from "react";
import { useConfiguratorStore } from "@/store/configuratorStore";
import ConfiguratorShell from "./ConfiguratorShell";
import { ConfiguratorPanelProvider } from "@/contexts/ConfiguratorPanelContext";

// Client Component - Handles all interactive functionality
export default function KonfiguratorClient() {
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const { initializeSession } = useConfiguratorStore();

  // Initialize session once on mount - no dependencies to prevent infinite loop
  useEffect(() => {
    initializeSession();
  }, [initializeSession]); // Include initializeSession dependency

  // Development performance monitoring - runs once on mount
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "🔧 Configurator Debug Mode: Use window.exportDebugSession() for session export"
      );

      // Add export function to window for development debugging
      (
        window as unknown as { exportDebugSession?: () => void }
      ).exportDebugSession = () => {
        const currentStore = useConfiguratorStore.getState();
        const sessionData = {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          sessionId: currentStore.sessionId || "unknown",
          configuration: currentStore.configuration,
        };

        const dataStr = JSON.stringify(sessionData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nest-haus-debug-session-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log("🔍 Debug session exported!");
      };

      return () => {
        // Cleanup debug functions on unmount
        delete (window as unknown as { exportDebugSession?: () => void })
          .exportDebugSession;
      };
    }

    return undefined;
  }, []); // Only run once on mount

  return (
    <div className="bg-white">
      <ConfiguratorPanelProvider value={rightPanelRef}>
        <ConfiguratorShell rightPanelRef={rightPanelRef} />
      </ConfiguratorPanelProvider>
    </div>
  );
}
