/**
 * Global Session Interaction Tracker
 *
 * Tracks all user interactions for regular sessions (not alpha tests)
 * Provides data for admin analytics dashboard
 */

"use client";

import { useEffect } from "react";
import { useInteractionTracking } from "@/hooks/useInteractionTracking";
import { useSessionId } from "@/hooks/useSessionId";
import { useConfiguratorStore } from "@/store/configuratorStore";

export default function SessionInteractionTracker() {
  // CRITICAL: Use configurator's session ID, not a separate one!
  const { configuration } = useConfiguratorStore();
  const fallbackSessionId = useSessionId();

  // Use configurator session ID if available, fall back to localStorage session
  const sessionId = configuration?.sessionId || fallbackSessionId;

  // Log session ID for debugging
  useEffect(() => {
    if (sessionId) {
      console.log(
        "🎯 SessionInteractionTracker initialized with session ID:",
        sessionId,
        configuration?.sessionId ? "(from configurator)" : "(from localStorage)"
      );
    } else {
      console.warn("⚠️ SessionInteractionTracker - no session ID yet");
    }
  }, [sessionId, configuration?.sessionId]);

  // Initialize tracking with auto-tracking enabled
  const { trackClick, trackFormInteraction } = useInteractionTracking({
    sessionId,
    enableClickTracking: true,
    enablePageTracking: true,
    debounceMs: 300,
  });

  // Manual tracking for specific elements that need custom handling
  useEffect(() => {
    // Track configurator card clicks specifically
    const handleConfiguratorCardClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const card = target.closest("[data-configurator-card]");

      if (card) {
        const category = card.getAttribute("data-category") || "unknown";
        const value = card.getAttribute("data-value") || "unknown";

        trackClick(
          `configurator-card-${value}`,
          "configurator_selection",
          `${category}:${value}`
        );
      }
    };

    // Track form submissions specifically
    const handleFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      const formId = form.id || form.getAttribute("name") || "unknown-form";

      trackFormInteraction(formId, "submit", "submit");
    };

    // Add specific event listeners
    document.addEventListener("click", handleConfiguratorCardClick);
    document.addEventListener("submit", handleFormSubmit);

    return () => {
      document.removeEventListener("click", handleConfiguratorCardClick);
      document.removeEventListener("submit", handleFormSubmit);
    };
  }, [trackClick, trackFormInteraction]);

  // This component doesn't render anything
  return null;
}
