import React from 'react';
import Image, { ImageProps } from 'next/image';
import { list } from '@vercel/blob';

interface ServerBlobImageProps extends Omit<ImageProps, 'src'> {
  path: string;
  mobilePath?: string;
  fallbackSrc?: string;
  enableSSRFetch?: boolean;
  enableMobileDetection?: boolean;
}

/**
 * ServerBlobImage - SSR-optimized image component with mobile detection
 * 
 * Attempts to resolve image URLs on the server when possible,
 * with server-side mobile detection using user agent.
 * 
 * Following project rules:
 * - Prefer SSR for static content and initial loads
 * - Support mobile detection for landing page images
 * - Optimize for SEO and Core Web Vitals
 */
async function getImageUrl(path: string): Promise<string | null> {
  if (!path || path === 'undefined' || path === '') {
    return null;
  }

  try {
    // Add images/ prefix if not already present
    const imagePath = path.startsWith('images/') ? path : `images/${path}`;
    const extensions = ['', '.jpg', '.jpeg', '.png', '.webp', '.avif'];
    
    // Try to find the image with different extensions
    for (const ext of extensions) {
      const pathToTry = `${imagePath}${ext}`;
      const { blobs } = await list({
        prefix: pathToTry,
        limit: 1
      });
      
      if (blobs.length > 0) {
        return blobs[0].url;
      }
    }
    
    return null;
  } catch (error) {
    console.error('SSR Image fetch error:', error);
    return null;
  }
}

/**
 * Server-side mobile detection using user agent
 * Gracefully handles cases where headers are not available
 */
async function isMobileDevice(): Promise<boolean> {
  try {
    // Dynamic import to avoid issues when headers() is not available
    const { headers } = await import('next/headers');
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    
    // Mobile device patterns
    const mobilePatterns = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
      /Mobile/i,
      /Tablet/i
    ];
    
    return mobilePatterns.some(pattern => pattern.test(userAgent));
  } catch (error) {
    // If headers are not available (e.g., client-side usage, static generation), default to desktop
    console.warn('Could not access headers for mobile detection (expected in client contexts):', error);
    return false;
  }
}

export default async function ServerBlobImage({
  path,
  mobilePath,
  fallbackSrc = '/api/placeholder/1200/800?style=nest&text=Loading...',
  enableSSRFetch = true,
  enableMobileDetection = false,
  alt,
  ...props
}: ServerBlobImageProps) {
  // Determine which path to use based on mobile detection
  let targetPath = path;
  
  if (enableMobileDetection && mobilePath) {
    try {
      const isMobile = await isMobileDevice();
      if (isMobile) {
        targetPath = mobilePath;
      }
    } catch (error) {
      // If mobile detection fails, continue with desktop path
      console.warn('Mobile detection failed, using desktop image:', error);
    }
  }

  // Attempt SSR fetch for optimal performance
  let imageSrc = fallbackSrc;
  
  if (enableSSRFetch && targetPath) {
    const serverUrl = await getImageUrl(targetPath);
    if (serverUrl) {
      imageSrc = serverUrl;
    } else {
      // Generate semantic placeholder with context
      imageSrc = `/api/placeholder/1200/800?style=nest&text=${encodeURIComponent(alt || 'Image not found')}&path=${encodeURIComponent(targetPath)}`;
    }
  }

  return (
    <Image
      src={imageSrc}
      alt={alt || ''}
      {...props}
      // Optimize for server-rendered images
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      priority={false} // Let Next.js determine priority
    />
  );
}

// Export both as default and named for flexibility
export { ServerBlobImage }; 