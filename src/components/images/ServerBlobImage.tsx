import React from 'react';
import Image, { ImageProps } from 'next/image';
import { list } from '@vercel/blob';

interface ServerBlobImageProps extends Omit<ImageProps, 'src'> {
  path: string;
  fallbackSrc?: string;
  enableSSRFetch?: boolean;
}

/**
 * ServerBlobImage - SSR-optimized image component
 * 
 * Attempts to resolve image URLs on the server when possible,
 * falling back to client-side loading only when necessary.
 * 
 * Following project rules:
 * - Prefer SSR for static content and initial loads
 * - Use client-side only for dynamic/interactive content
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

export default async function ServerBlobImage({
  path,
  fallbackSrc = '/api/placeholder/1200/800?style=nest&text=Loading...',
  enableSSRFetch = true,
  alt,
  ...props
}: ServerBlobImageProps) {
  // Attempt SSR fetch for optimal performance
  let imageSrc = fallbackSrc;
  
  if (enableSSRFetch && path) {
    const serverUrl = await getImageUrl(path);
    if (serverUrl) {
      imageSrc = serverUrl;
    } else {
      // Generate semantic placeholder with context
      imageSrc = `/api/placeholder/1200/800?style=nest&text=${encodeURIComponent(alt || 'Image not found')}&path=${encodeURIComponent(path)}`;
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