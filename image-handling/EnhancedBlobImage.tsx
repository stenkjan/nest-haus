// src/app/components/client/ClientBlobImage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { generatePlaceholder, getPlaceholderTextFromPath, removeFileExtension } from '../../../lib/image-fallback';

interface ClientBlobImageProps extends Omit<ImageProps, 'src'> {
  path: string;
  fallbackSrc?: string;
  mobilePath?: string;
  onLoad?: () => void;
  onError?: (error: Error | React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function ClientBlobImage({
  path,
  fallbackSrc,
  mobilePath,
  alt,
  width,
  height,
  onLoad,
  onError,
  ...props
}: ClientBlobImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);

  // Generate a default fallback if none provided
  const defaultFallback = generatePlaceholder(
    width as number || 400, 
    height as number || 300, 
    getPlaceholderTextFromPath(path)
  );

  // Mobile detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Set initial image source to fallback or placeholder while loading
  useEffect(() => {
    setImageSrc(fallbackSrc || defaultFallback);
  }, [fallbackSrc, defaultFallback]);

  // Fetch image URL
  useEffect(() => {
    if (!path) return;
    
    const fetchImage = async () => {
      try {
        setLoading(true);
        
        // Determine which path to use
        let imagePath = path;
        
        // Use mobile path on mobile devices if provided
        if (isMobile && mobilePath) {
          imagePath = mobilePath;
        }
        
        // Remove file extension if present to allow for format flexibility
        const normalizedPath = removeFileExtension(imagePath);
        
        // Fetch the image URL
        const response = await fetch(`/api/image-handler?path=${encodeURIComponent(normalizedPath)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image URL: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.url) {
          throw new Error(`No image URL returned for path: ${normalizedPath}`);
        }
        
        setImageSrc(data.url);
        setError(false);
        
        if (onLoad) onLoad();
      } catch (err) {
        console.error('Error loading image:', err, 'Path:', path);
        setError(true);
        
        // Keep using the fallback that was set initially
        // The fallback is already set in the initial useEffect
        
        if (onError && err instanceof Error) onError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImage();
  }, [path, mobilePath, isMobile, onLoad, onError, retryCount]);

  // Handle retry when image fails to load
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
    }
  };

  return (
    <div className="relative w-full h-full">
      <Image
        src={imageSrc}
        alt={alt || getPlaceholderTextFromPath(path)}
        {...(props.fill ? { fill: true } : { width: width || 400, height: height || 300 })}
        {...props}
        style={{
          ...props.style,
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
        onError={handleRetry}
        unoptimized={error} // Skip image optimization when using fallbacks
      />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}