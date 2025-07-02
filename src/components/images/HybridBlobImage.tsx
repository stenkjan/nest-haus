import React, { Suspense } from 'react';
import { ImageProps } from 'next/image';
import { ServerBlobImage } from './ServerBlobImage';
import ClientBlobImage from './ClientBlobImage';

interface HybridBlobImageProps extends Omit<ImageProps, 'src'> {
  path: string;
  mobilePath?: string;
  fallbackSrc?: string;
  
  // Rendering strategy
  strategy?: 'ssr' | 'client' | 'auto';
  
  // Context hints for intelligent strategy selection
  isAboveFold?: boolean;
  isCritical?: boolean;
  isInteractive?: boolean;
  
  // Client-specific options
  enableCache?: boolean;
  enableMobileDetection?: boolean;
  showLoadingSpinner?: boolean;
}

/**
 * HybridBlobImage - Intelligent SSR/Client Image Component
 * 
 * Automatically chooses the best rendering strategy based on:
 * - Content criticality (above fold, critical content)
 * - User interaction requirements (dynamic, configurator)
 * - Performance optimization needs
 * 
 * Following project rules:
 * - SSR for static content pages, landing pages, SEO-critical content
 * - Client-side for interactive apps, configurators, dynamic forms
 * - Balanced approach for optimal performance
 */
export default function HybridBlobImage({
  path,
  mobilePath,
  fallbackSrc = '/api/placeholder/1200/800?style=nest&text=Loading...',
  strategy = 'auto',
  isAboveFold = false,
  isCritical = false,
  isInteractive = false,
  enableCache = true,
  enableMobileDetection = false,
  showLoadingSpinner = false,
  ...props
}: HybridBlobImageProps) {
  
  // Intelligent strategy selection when 'auto' is chosen
  const renderingStrategy = strategy === 'auto' 
    ? determineStrategy(isAboveFold, isCritical, isInteractive)
    : strategy;

  // SSR Strategy: Best for static content, above-fold, critical images
  if (renderingStrategy === 'ssr') {
    return (
      <Suspense fallback={
        <div className="animate-pulse bg-gray-200 w-full h-full flex items-center justify-center">
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      }>
        <ServerBlobImage
          path={path}
          mobilePath={mobilePath}
          fallbackSrc={fallbackSrc}
          enableSSRFetch={true}
          enableMobileDetection={enableMobileDetection}
          priority={isAboveFold || isCritical}
          {...props}
        />
      </Suspense>
    );
  }

  // Client Strategy: Best for interactive content, dynamic loading
  return (
    <ClientBlobImage
      path={path}
      mobilePath={mobilePath}
      fallbackSrc={fallbackSrc}
      enableCache={enableCache}
      enableMobileDetection={enableMobileDetection}
      showLoadingSpinner={showLoadingSpinner}
      priority={isAboveFold || isCritical}
      {...props}
    />
  );
}

/**
 * Intelligent strategy determination based on content characteristics
 */
function determineStrategy(
  isAboveFold: boolean,
  isCritical: boolean, 
  isInteractive: boolean
): 'ssr' | 'client' {
  // Prefer SSR for critical, above-fold content (SEO + Core Web Vitals)
  if (isAboveFold || isCritical) {
    return 'ssr';
  }
  
  // Prefer Client for interactive content (instant feedback)
  if (isInteractive) {
    return 'client';
  }
  
  // Default to SSR for better initial performance
  return 'ssr';
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
  strategy="ssr"
  alt="Gallery Image"
/>

// Product showcase (auto-determined strategy)
<HybridBlobImage 
  path="product-showcase"
  isAboveFold={false}
  isCritical={false}
  isInteractive={false}
  alt="Product"
/>
*/ 