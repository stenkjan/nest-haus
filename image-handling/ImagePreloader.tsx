// src/app/components/server/ImagePreloader.tsx
import React from 'react';
import { getImageUrl } from '../../../lib/image-utils';
import { headers } from 'next/headers';

interface ImagePreloaderProps {
  paths: string[];
  mobilePaths?: string[];
  enableMobile?: boolean;
}

/**
 * Server component that preloads images by adding them to the head as link preload tags
 * This improves performance for critical images like hero sections
 */
export async function ImagePreloader({ 
  paths, 
  mobilePaths = [], 
  enableMobile = false 
}: ImagePreloaderProps) {
  // Filter out any empty or invalid paths
  const validPaths = paths.filter(path => path && typeof path === 'string');
  
  // Get the base URL using headers() for server components
  const headersList = await headers();
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = headersList.get('host') || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;
  
  // Attempt to resolve all image URLs in parallel
  const desktopUrlPromises = validPaths.map(path => getImageUrl(path, { 
    mobile: false,
    isServer: true // Indicate this is server-side execution
  }));
  
  // Only process mobile URLs if explicitly enabled
  const mobileUrlPromises = enableMobile ? [
    ...mobilePaths.map(path => getImageUrl(path, { 
      mobile: true,
      isServer: true // Indicate this is server-side execution
    })),
    ...validPaths.filter(path => !mobilePaths.includes(path))
      .map(path => getImageUrl(path, { 
        mobile: true,
        isServer: true // Indicate this is server-side execution
      }))
  ] : [];
  
  try {
    // Await all promises in parallel
    const [desktopUrls, mobileUrls] = await Promise.all([
      Promise.all(desktopUrlPromises),
      enableMobile ? Promise.all(mobileUrlPromises) : Promise.resolve([])
    ]);
    
    // Filter out any undefined or error URLs
    const validDesktopUrls = desktopUrls.filter(url => url && !url.startsWith('/api/placeholder'));
    const validMobileUrls = mobileUrls.filter(url => url && !url.startsWith('/api/placeholder'));
    
    // Combine and deduplicate URLs
    const allUrls = [...new Set([...validDesktopUrls, ...validMobileUrls])];
    
    return (
      <>
        {allUrls.map((url, index) => (
          <link 
            key={`preload-${index}`}
            rel="preload" 
            as="image" 
            href={url} 
            // Mark only the first few as high priority
            fetchPriority={index < 3 ? "high" : "auto"}
          />
        ))}
      </>
    );
  } catch (error) {
    console.error('Error preloading images:', error);
    // Return empty fragment in case of error to avoid breaking the rendering
    return <></>;
  }
}