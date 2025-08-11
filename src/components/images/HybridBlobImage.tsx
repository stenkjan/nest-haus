"use client";

import React from "react";
import { ImageProps } from "next/image";
import ClientBlobImage from "./ClientBlobImage";

interface HybridBlobImageProps extends Omit<ImageProps, "src"> {
  path: string;
  mobilePath?: string;
  fallbackSrc?: string;

  // Rendering strategy
  strategy?: "ssr" | "client" | "auto";

  // Context hints for intelligent strategy selection
  isAboveFold?: boolean;
  isCritical?: boolean;
  isInteractive?: boolean;

  // Client-specific options
  enableCache?: boolean;
  enableMobileDetection?: boolean;
}

/**
 * HybridBlobImage - Client-Side Image Component
 *
 * NOTE: This component has been simplified to use only client-side rendering
 * due to Next.js constraints where async server components cannot be used
 * in client component contexts.
 *
 * For true hybrid SSR/Client approach, use:
 * - ServerBlobImage directly in server components
 * - ClientBlobImage directly in client components
 * - This component as a client-optimized solution
 *
 * Following project rules:
 * - Client-side for interactive apps, configurators, dynamic forms
 * - Optimized caching and performance for client contexts
 * - Graceful fallbacks and error handling
 */
export default function HybridBlobImage({
  path,
  mobilePath,
  fallbackSrc,
  strategy = "auto",
  isAboveFold = false,
  isCritical = false,
  isInteractive = false,
  enableCache = true,
  enableMobileDetection = false,
  ...props
}: HybridBlobImageProps) {
  // Since we're in client context, always use ClientBlobImage
  // Optimize settings based on strategy hints
  const optimizedSettings = getClientOptimizedSettings(
    strategy,
    isAboveFold,
    isCritical,
    isInteractive
  );

  return (
    <ClientBlobImage
      path={path}
      mobilePath={mobilePath}
      fallbackSrc={fallbackSrc}
      enableCache={enableCache && optimizedSettings.enableCache}
      enableMobileDetection={enableMobileDetection}
      priority={isAboveFold || isCritical}
      {...props}
    />
  );
}

/**
 * Optimize client-side settings based on strategy hints
 */
function getClientOptimizedSettings(
  strategy: "ssr" | "client" | "auto",
  isAboveFold: boolean,
  isCritical: boolean,
  isInteractive: boolean
) {
  // For critical/above-fold content, optimize for speed
  if (isAboveFold || isCritical) {
    return {
      enableCache: true,
    };
  }

  // For interactive content, optimize for responsiveness
  if (isInteractive) {
    return {
      enableCache: true,
    };
  }

  // Default optimizations
  return {
    enableCache: true,
  };
}

// Usage examples for documentation:
/*
// Landing page hero image (critical, above fold)
<HybridBlobImage 
  path="hero-image"
  isAboveFold={true}
  isCritical={true}
  alt="NEST Haus Hero"
/>

// Configurator preview (interactive, dynamic)
<HybridBlobImage 
  path={dynamicImagePath}
  isInteractive={true}
  enableCache={true}
  enableMobileDetection={true}
  alt="Configuration Preview"
/>

// Gallery image (below fold, static)
<HybridBlobImage 
  path="gallery-image-1"
  strategy="client"
  alt="Gallery Image"
/>

// Product showcase (auto-optimized)
<HybridBlobImage 
  path="product-showcase"
  isAboveFold={false}
  isCritical={false}
  isInteractive={false}
  alt="Product"
/>
*/
