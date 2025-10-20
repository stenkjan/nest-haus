"use client";

import { useEffect } from "react";
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";
import { SEOMonitoringService } from "@/lib/SEOMonitoringService";

/**
 * Web Vitals Tracker Component
 *
 * Tracks Core Web Vitals metrics and sends them to SEOMonitoringService for analysis
 * - LCP (Largest Contentful Paint): Target < 2.5s
 * - INP (Interaction to Next Paint): Target < 200ms
 * - CLS (Cumulative Layout Shift): Target < 0.1
 * - FCP (First Contentful Paint): Target < 1.8s
 * - TTFB (Time to First Byte): Target < 600ms
 */
export default function WebVitals() {
  useEffect(() => {
    // Only track in production or when explicitly enabled
    const shouldTrack =
      process.env.NODE_ENV === "production" ||
      process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS === "true";

    if (!shouldTrack) {
      console.log("📊 Web Vitals tracking disabled in development");
      return;
    }

    const handleMetric = (metric: Metric) => {
      // Send to SEO Monitoring Service
      SEOMonitoringService.trackCoreWebVitals(metric);

      // Also log to console in development for debugging
      if (process.env.NODE_ENV === "development") {
        console.log(`⚡ ${metric.name}:`, {
          value: metric.value.toFixed(2),
          rating: metric.rating,
          id: metric.id,
        });
      }

      // In production, could also send to analytics service
      // Example: Google Analytics 4
      // if (typeof window !== 'undefined' && window.gtag) {
      //   window.gtag('event', metric.name, {
      //     value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      //     metric_id: metric.id,
      //     metric_value: metric.value,
      //     metric_delta: metric.delta,
      //     metric_rating: metric.rating,
      //   });
      // }
    };

    // Track all Core Web Vitals
    onCLS(handleMetric);
    onINP(handleMetric);
    onLCP(handleMetric);
    onFCP(handleMetric);
    onTTFB(handleMetric);

    console.log("📊 Web Vitals tracking initialized");
  }, []);

  // This component doesn't render anything
  return null;
}
