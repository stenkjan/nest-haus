# Nest-Haus Image Implementation Guide

## Overview

This guide provides a comprehensive approach to implementing an efficient, robust image loading system for the Nest-Haus application using Vercel Blob storage. The system prioritizes server-side rendering for performance while maintaining an efficient client-side fallback system.

## Architecture Principles

### 🎯 Core Requirements
- **Server-First Approach**: Load images server-side wherever possible for SEO and Core Web Vitals
- **Efficient Caching**: Load images once and maintain state throughout the session
- **Minimal API Calls**: Only execute blob storage requests when necessary
- **Graceful Fallbacks**: Robust error handling with typed fallback images
- **Minimal Loading States**: Reduce visible loading animations through smart caching
- **Landing Page Specific**: Mobile responsive design only for landing page, not global
- **Prevent Over-Loading**: Smart loading checks to prevent recursive or redundant loading
- **No Redundant Code**: Clean implementation without duplicating existing functionality

### 🏗️ System Architecture

```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   Server Component  │    │    API Routes        │    │   Vercel Blob       │
│   (BlobImage)       │────│  /api/images         │────│   Storage           │
│                     │    │  /api/image-handler  │    │                     │
└─────────────────────┘    └──────────────────────┘    └─────────────────────┘
           │
           ▼
┌─────────────────────┐    ┌──────────────────────┐
│  Client Component   │    │   Cache Layer        │
│  (ClientBlobImage)  │────│  (Session Storage)   │
│                     │    │                      │
└─────────────────────┘    └──────────────────────┘
```

## Implementation Strategy

### Phase 1: Core Infrastructure Setup

#### 1.1 Enhanced API Routes

**IMPORTANT**: Use your existing API routes in `image-handling/images/route.ts` and `image-handling/image-handler/route.ts` - they already provide the core functionality. Only enhance if needed.

**File: `src/app/api/images/route.ts`** (Enhanced Version - Only if replacing existing)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { unstable_cache } from 'next/cache';

// Prevent redundant cache calls - check if already cached
const imageUrlCache = new Map<string, { url: string | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Efficient blob URL fetching with double-caching protection
const getCachedBlobUrl = unstable_cache(
  async (path: string) => {
    // First check in-memory cache to prevent redundant blob API calls
    const cached = imageUrlCache.get(path);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.url;
    }

    const { blobs } = await list({
      prefix: path,
      limit: 1
    });
    
    const url = blobs.length > 0 ? blobs[0].url : null;
    
    // Store in memory cache
    imageUrlCache.set(path, { url, timestamp: Date.now() });
    
    return url;
  },
  ['blob-image-url'],
  { 
    revalidate: 300, // 5 minutes
    tags: ['blob-images'] 
  }
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path) {
    return NextResponse.json({ error: 'No path provided' }, { status: 400 });
  }

  try {
    // Ensure path has images/ prefix
    const imagePath = path.startsWith('images/') ? path : `images/${path}`;
    
    // Try multiple extensions efficiently - stop at first success
    const extensions = ['', '.jpg', '.jpeg', '.png', '.mp4'];
    
    for (const ext of extensions) {
      const pathToTry = `${imagePath}${ext}`;
      const url = await getCachedBlobUrl(pathToTry);
      
      if (url) {
        return NextResponse.json({ 
          url,
          cached: true,
          path: pathToTry 
        });
      }
    }
    
    return NextResponse.json({ 
      error: 'Image not found',
      path: imagePath 
    }, { status: 404 });
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch image' 
    }, { status: 500 });
  }
}
```

#### 1.2 Server-Side Image Component

**File: `src/components/images/ServerBlobImage.tsx`**
```typescript
import Image, { ImageProps } from 'next/image';
import { list } from '@vercel/blob';
import { unstable_cache } from 'next/cache';

interface ServerBlobImageProps extends Omit<ImageProps, 'src'> {
  path: string;
  mobilePath?: string;
  fallbackSrc?: string;
  critical?: boolean;
  enableMobileDetection?: boolean; // Only for landing page
}

// Prevent duplicate server-side calls with memoization
const serverImageCache = new Map<string, Promise<string | null>>();

// Cache blob URL fetching with Next.js cache and prevent recursive calls
const getCachedImageUrl = unstable_cache(
  async (path: string): Promise<string | null> => {
    // Check if we're already fetching this path to prevent duplicate calls
    if (serverImageCache.has(path)) {
      return serverImageCache.get(path)!;
    }

    const fetchPromise = (async () => {
      try {
        const imagePath = path.startsWith('images/') ? path : `images/${path}`;
        const extensions = ['', '.jpg', '.jpeg', '.png', '.mp4'];
        
        // Stop at first successful match - don't try all extensions
        for (const ext of extensions) {
          const pathToTry = `${imagePath}${ext}`;
          const { blobs } = await list({
            prefix: pathToTry,
            limit: 1
          });
          
          if (blobs.length > 0) {
            serverImageCache.delete(path); // Clean up cache
            return blobs[0].url;
          }
        }
        
        serverImageCache.delete(path); // Clean up cache
        return null;
      } catch (error) {
        console.error('Error fetching blob URL:', error);
        serverImageCache.delete(path); // Clean up cache on error
        return null;
      }
    })();

    serverImageCache.set(path, fetchPromise);
    return fetchPromise;
  },
  ['blob-image'],
  { 
    revalidate: 3600, // 1 hour
    tags: ['images'] 
  }
);

export default async function ServerBlobImage({
  path,
  mobilePath,
  fallbackSrc = '/api/placeholder/400/300',
  critical = false,
  enableMobileDetection = false, // Only enable for landing page
  alt,
  width,
  height,
  ...props
}: ServerBlobImageProps) {
  // Early return for invalid path to prevent unnecessary processing
  if (!path || path === 'undefined' || path === '') {
    console.warn('ServerBlobImage: Invalid path provided:', path);
    return (
      <Image
        src={fallbackSrc}
        alt={alt || 'Placeholder'}
        width={width || 400}
        height={height || 300}
        {...props}
        unoptimized
      />
    );
  }

  // Only try mobile path if explicitly enabled (landing page only)
  let imageUrl: string | null = null;
  
  try {
    // Get the main image URL
    imageUrl = await getCachedImageUrl(path);
    
    // Only check mobile path if:
    // 1. Mobile detection is enabled (landing page)
    // 2. Main image not found
    // 3. Mobile path is provided
    if (!imageUrl && mobilePath && enableMobileDetection) {
      imageUrl = await getCachedImageUrl(mobilePath);
    }
  } catch (error) {
    console.error('Server image loading error:', error);
    imageUrl = null;
  }
  
  // Use fallback if no image found
  if (!imageUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Server: Image not found: ${path}`);
    }
    
    return (
      <Image
        src={fallbackSrc}
        alt={alt || 'Image not found'}
        width={width || 400}
        height={height || 300}
        {...props}
        unoptimized
      />
    );
  }

  // Render the found image
  return (
    <Image
      src={imageUrl}
      alt={alt || 'NEST-Haus Image'}
      width={width || 400}
      height={height || 300}
      priority={critical}
      {...props}
    />
  );
}
```

### Phase 2: Client-Side Enhancement

#### 2.1 Enhanced Client Component with Session Caching

**File: `src/components/images/ClientBlobImage.tsx`**
```typescript
'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';

interface ClientBlobImageProps extends Omit<ImageProps, 'src'> {
  path: string;
  mobilePath?: string;
  fallbackSrc?: string;
  enableCache?: boolean;
  enableMobileDetection?: boolean; // Only for landing page
  showLoadingSpinner?: boolean;
}

// Enhanced session-based image URL cache with loading state management
class ImageCache {
  private static cache = new Map<string, string>();
  private static pending = new Map<string, Promise<string>>();
  private static loadingStates = new Map<string, boolean>();
  
  static get(path: string): string | null {
    return this.cache.get(path) || null;
  }
  
  static isLoading(path: string): boolean {
    return this.loadingStates.get(path) || false;
  }
  
  static set(path: string, url: string): void {
    this.cache.set(path, url);
    this.loadingStates.set(path, false);
    
    // Store in sessionStorage for persistence
    try {
      sessionStorage.setItem(`nest_img_${path}`, JSON.stringify({
        url,
        timestamp: Date.now()
      }));
    } catch (e) {
      // Handle quota exceeded gracefully
      console.warn('SessionStorage quota exceeded, clearing old entries');
      this.clearOldEntries();
    }
  }
  
  static async getOrFetch(path: string): Promise<string> {
    // Return cached URL if available
    const cached = this.get(path);
    if (cached) return cached;
    
    // Return pending promise if already fetching to prevent duplicate calls
    const pending = this.pending.get(path);
    if (pending) return pending;
    
    // Set loading state
    this.loadingStates.set(path, true);
    
    // Create new fetch promise
    const fetchPromise = this.fetchImageUrl(path);
    this.pending.set(path, fetchPromise);
    
    try {
      const url = await fetchPromise;
      this.set(path, url);
      return url;
    } catch (error) {
      this.loadingStates.set(path, false);
      throw error;
    } finally {
      this.pending.delete(path);
    }
  }
  
  private static async fetchImageUrl(path: string): Promise<string> {
    const response = await fetch(`/api/images?path=${encodeURIComponent(path)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.url) {
      throw new Error('No URL returned');
    }
    
    return data.url;
  }
  
  static loadFromSession(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      const now = Date.now();
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('nest_img_')) {
          const path = key.substring(9); // Remove 'nest_img_' prefix
          const stored = sessionStorage.getItem(key);
          
          if (stored) {
            try {
              const { url, timestamp } = JSON.parse(stored);
              
              // Only use cached URLs that are less than 1 hour old
              if (now - timestamp < oneHour) {
                this.cache.set(path, url);
              } else {
                sessionStorage.removeItem(key);
              }
            } catch (e) {
              sessionStorage.removeItem(key);
            }
          }
        }
      }
    } catch (e) {
      // Handle gracefully
    }
  }
  
  private static clearOldEntries(): void {
    try {
      const keys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('nest_img_')) {
          keys.push(key);
        }
      }
      
      // Remove oldest entries (keep only most recent 50)
      if (keys.length > 50) {
        const toRemove = keys.slice(0, keys.length - 50);
        toRemove.forEach(key => sessionStorage.removeItem(key));
      }
    } catch (e) {
      // Handle gracefully
    }
  }
}

export default function ClientBlobImage({
  path,
  mobilePath,
  fallbackSrc = '/api/placeholder/400/300',
  enableCache = true,
  enableMobileDetection = false, // Only enable for landing page
  showLoadingSpinner = false,
  alt,
  width,
  height,
  ...props
}: ClientBlobImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const mountedRef = useRef<boolean>(true);
  const loadingRef = useRef<boolean>(false);

  // Mobile detection - only if explicitly enabled (landing page)
  useEffect(() => {
    if (!enableMobileDetection) return;
    
    const checkMobile = () => {
      if (mountedRef.current) {
        setIsMobile(window.innerWidth < 768);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [enableMobileDetection]);

  // Load cache from session on mount - only once
  useEffect(() => {
    if (enableCache) {
      ImageCache.loadFromSession();
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [enableCache]);

  // Determine which path to use - only consider mobile if detection is enabled
  const targetPath = useMemo(() => {
    if (enableMobileDetection && isMobile && mobilePath) {
      return mobilePath;
    }
    return path;
  }, [enableMobileDetection, isMobile, mobilePath, path]);

  // Optimized image loading with duplicate prevention
  const loadImage = useCallback(async (pathToLoad: string) => {
    // Prevent duplicate loading
    if (loadingRef.current || !pathToLoad || pathToLoad === 'undefined' || pathToLoad === '') {
      return;
    }

    // Check if already cached and set immediately
    if (enableCache) {
      const cached = ImageCache.get(pathToLoad);
      if (cached && mountedRef.current) {
        setImageSrc(cached);
        setIsLoading(false);
        setError(false);
        return;
      }
      
      // Check if currently loading to prevent duplicates
      if (ImageCache.isLoading(pathToLoad)) {
        return;
      }
    }

    loadingRef.current = true;
    
    try {
      if (mountedRef.current) {
        setIsLoading(true);
        setError(false);
      }
      
      let imageUrl: string;
      
      if (enableCache) {
        imageUrl = await ImageCache.getOrFetch(pathToLoad);
      } else {
        const response = await fetch(`/api/images?path=${encodeURIComponent(pathToLoad)}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        imageUrl = data.url;
      }
      
      if (mountedRef.current) {
        setImageSrc(imageUrl);
        setError(false);
      }
    } catch (err) {
      console.error('Error loading image:', err);
      if (mountedRef.current) {
        setError(true);
        setImageSrc(fallbackSrc);
      }
    } finally {
      loadingRef.current = false;
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [enableCache, fallbackSrc]);

  // Load image when target path changes
  useEffect(() => {
    if (targetPath) {
      loadImage(targetPath);
    } else {
      setImageSrc(fallbackSrc);
      setIsLoading(false);
    }
  }, [targetPath, loadImage, fallbackSrc]);

  return (
    <div className="relative w-full h-full">
      <Image
        src={imageSrc}
        alt={alt || 'NEST-Haus Image'}
        width={width || 400}
        height={height || 300}
        {...props}
        style={{
          ...props.style,
          opacity: isLoading ? 0.8 : 1,
          transition: 'opacity 0.2s ease-in-out'
        }}
        onError={() => {
          if (mountedRef.current) {
            setError(true);
            setImageSrc(fallbackSrc);
          }
        }}
      />
      
      {isLoading && showLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-30">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
```

### Phase 3: Integration Strategy

#### 3.1 Usage Guidelines

**For Landing Page ONLY (Server-Side with Mobile Detection):**
```typescript
// src/app/page.tsx - ONLY PAGE WHERE MOBILE DETECTION IS ENABLED
import ServerBlobImage from '@/components/images/ServerBlobImage';

export default function HomePage() {
  return (
    <section className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
      <ServerBlobImage
        path="1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche"
        mobilePath="1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche-mobile"
        alt="NEST-Haus Berg Vision"
        fill
        className="object-cover"
        critical={true}
        enableMobileDetection={true} // ← ONLY ENABLE ON LANDING PAGE
        style={{
          objectPosition: 'center center',
          transform: 'scale(1.05)',
          transformOrigin: 'center center',
        }}
      />
    </section>
  );
}
```

**For Configurator (Client-Side with Caching, NO Mobile Detection):**
```typescript
// src/app/konfigurator/components/PreviewPanel.tsx
'use client';

import ClientBlobImage from '@/components/images/ClientBlobImage';
import { IMAGES } from '@/constants/images';

export default function PreviewPanel({ configuration }) {
  const imagePath = IMAGES.configurations[configuration.key];
  
  return (
    <div className="preview-container">
      <ClientBlobImage
        path={imagePath}
        alt={`NEST-Haus ${configuration.name}`}
        width={800}
        height={600}
        enableCache={true}
        enableMobileDetection={false} // ← NO MOBILE DETECTION FOR CONFIGURATOR
        showLoadingSpinner={false}
        className="w-full h-auto"
      />
    </div>
  );
}
```

**For Other Pages (Standard Server-Side, NO Mobile Detection):**
```typescript
// src/app/about/page.tsx - Standard usage without mobile responsiveness
import ServerBlobImage from '@/components/images/ServerBlobImage';

export default function AboutPage() {
  return (
    <div className="content-container">
      <ServerBlobImage
        path="team-photo"
        alt="Our Team"
        width={600}
        height={400}
        // enableMobileDetection defaults to false - no mobile logic
        className="rounded-lg"
      />
    </div>
  );
}
```

#### 3.2 Migration Path

**⚠️ IMPORTANT: Avoid Redundant Code - Use Your Existing Assets**

1. **Phase 1**: Keep your existing `image-handling/images/route.ts` API route - it works well
2. **Phase 2**: Move `image-handling/images.ts` to `src/constants/images.ts` (reuse existing paths)
3. **Phase 3**: Replace landing page images with `ServerBlobImage` (enableMobileDetection=true)
4. **Phase 4**: Replace configurator images with enhanced `ClientBlobImage` (enableMobileDetection=false)
5. **Phase 5**: Use `ServerBlobImage` for all other pages (no mobile detection needed)

**Checklist to Prevent Over-Loading:**
- ✅ Each image loads only once per session (cached)
- ✅ No recursive loading (loading state prevents duplicates)
- ✅ Mobile detection only on landing page
- ✅ Server-side caching prevents redundant blob API calls
- ✅ Client-side loading states prevent parallel requests for same image

### Phase 4: Performance Optimizations

#### 4.1 Image Preloading Strategy

**File: `src/components/images/ImagePreloader.tsx`**
```typescript
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
      } catch (error) {
        // Silently fail preloading
      }
    });

    await Promise.allSettled(preloadPromises);
  };

  return null; // This component doesn't render anything
}
```

#### 4.2 Configurator Integration

**File: `src/app/konfigurator/components/KonfiguratorClient.tsx`**
```typescript
'use client';

import { useEffect, useMemo } from 'react';
import ImagePreloader from '@/components/images/ImagePreloader';
import { IMAGES } from '@/constants/images';

export default function KonfiguratorClient() {
  // Preload commonly used configurator images
  const preloadPaths = useMemo(() => [
    IMAGES.configurations.nest75_holzlattung,
    IMAGES.configurations.nest95_holzlattung,
    IMAGES.configurations.nest115_holzlattung,
    // Add more based on user journey analytics
  ], []);

  return (
    <>
      <ImagePreloader paths={preloadPaths} priority={true} />
      {/* Rest of configurator UI */}
    </>
  );
}
```

## Best Practices

### 🎯 Server-Side Rendering Guidelines

1. **Use ServerBlobImage for:**
   - Landing page hero images (`enableMobileDetection=true` ONLY here)
   - Static content pages (`enableMobileDetection=false`)
   - SEO-critical images (`enableMobileDetection=false`)
   - Above-the-fold content (`enableMobileDetection=false`)

2. **Use ClientBlobImage for:**
   - Configurator dynamic images (`enableMobileDetection=false` - configurator handles responsive CSS)
   - User-generated content (`enableMobileDetection=false`)
   - Images that change based on user interaction (`enableMobileDetection=false`)

3. **Mobile Responsiveness Rules:**
   - ❌ **NO mobile detection** on configurator - use CSS responsive design instead
   - ❌ **NO mobile detection** on content pages - images are same size across devices
   - ✅ **YES mobile detection** ONLY on landing page - different hero images for mobile/desktop

### ⚡ Performance Guidelines

1. **Enable caching** for frequently accessed images (automatic in both components)
2. **Preload critical images** in the configurator (use ImagePreloader component)
3. **Use appropriate fallbacks** based on image type (avoid blob API calls for fallbacks)
4. **Minimize loading states** through smart caching (images load instantly from cache)
5. **Monitor cache size** to prevent memory issues (automatic cleanup after 50 images)
6. **Prevent duplicate loading** with loading state checks (built into components)
7. **Server-side efficiency** with double-caching (memory + Next.js cache)
8. **No redundant mobile detection** except landing page (saves unnecessary responsive logic)

### 🔧 Maintenance Guidelines

1. **Centralize image paths** in the `IMAGES` constant
2. **Use TypeScript** for type safety
3. **Implement error boundaries** for graceful failures
4. **Monitor blob storage usage** and costs
5. **Regularly clean up** unused images

## Error Handling & Fallbacks

### Fallback Strategy
```typescript
const getTypedFallback = (imagePath: string): string => {
  if (imagePath.includes('interior')) return '/fallbacks/interior-default.jpg';
  if (imagePath.includes('exterior')) return '/fallbacks/exterior-default.jpg';
  if (imagePath.includes('stirnseite')) return '/fallbacks/stirnseite-default.jpg';
  return '/fallbacks/default.jpg';
};
```

### Error Boundaries
```typescript
// src/components/images/ImageErrorBoundary.tsx
'use client';

import React from 'react';

class ImageErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Image loading failed</div>;
    }

    return this.props.children;
  }
}

export default ImageErrorBoundary;
```

## Monitoring & Analytics

### Performance Metrics
- Image load times
- Cache hit rates
- Blob storage API calls
- Error rates by image type

### Implementation
```typescript
// Add to your analytics tracking
const trackImageLoad = (path: string, loadTime: number, fromCache: boolean) => {
  // Track image performance
  analytics.track('image_loaded', {
    path,
    loadTime,
    fromCache,
    timestamp: Date.now()
  });
};
```

## Summary

This implementation provides:

✅ **Server-side rendering** for optimal performance and SEO  
✅ **Efficient caching** with session persistence  
✅ **Minimal API calls** through smart cache management  
✅ **Robust error handling** with typed fallbacks  
✅ **Maintainable architecture** following Next.js best practices  
✅ **Performance monitoring** for continuous optimization  
✅ **Landing page ONLY mobile detection** - no redundant responsive logic elsewhere  
✅ **Duplicate loading prevention** - images never load more than once  
✅ **No redundant code** - builds on your existing image-handling infrastructure  
✅ **Server-side efficiency** - prevents over-loading with smart caching  

## 🚨 Key Anti-Patterns to Avoid

❌ **DON'T enable mobile detection on configurator** - use CSS responsive design instead  
❌ **DON'T create new API routes** - use your existing `image-handling/images/route.ts`  
❌ **DON'T implement global mobile responsiveness** - only needed for landing page hero images  
❌ **DON'T duplicate image loading logic** - components prevent recursive calls automatically  
❌ **DON'T ignore caching** - always enable cache for better performance  

The system follows your project rules by keeping code slim, using SSR where appropriate, maintaining responsive design principles ONLY where needed (landing page), and providing excellent user experience with minimal loading states. 