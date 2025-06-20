'use client';

import { useEffect } from 'react';

interface ImagePreloaderProps {
  paths: string[];
  priority?: boolean;
}

export default function ImagePreloader({ paths, priority = false }: ImagePreloaderProps) {
  useEffect(() => {
    if (!priority) {
      // Delay non-priority preloading
      const timer = setTimeout(() => {
        preloadImages(paths);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      preloadImages(paths);
    }
  }, [paths, priority]);

  const preloadImages = async (imagePaths: string[]) => {
    const preloadPromises = imagePaths.map(async (path) => {
      try {
        const response = await fetch(`/api/images?path=${encodeURIComponent(path)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            // Preload the actual image
            const img = new Image();
            img.src = data.url;
          }
        }
      } catch {
        // Silently fail preloading
      }
    });

    await Promise.allSettled(preloadPromises);
  };

  return null; // This component doesn't render anything
} 