import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

// ✅ PERFORMANCE: Enhanced cache with proper TTL and memory management
const urlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const MAX_CACHE_SIZE = 1000; // Prevent memory bloat

// ✅ PERFORMANCE: Cache cleanup function
function cleanupCache() {
  const now = Date.now();
  const toDelete: string[] = [];
  
  for (const [key, value] of urlCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      toDelete.push(key);
    }
  }
  
  // Clean expired entries
  toDelete.forEach(key => urlCache.delete(key));
  
  // If still too large, remove oldest entries
  if (urlCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(urlCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE);
    toRemove.forEach(([key]) => urlCache.delete(key));
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path) {
    return NextResponse.json(
      { error: 'No path provided' }, 
      { 
        status: 400,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    );
  }

  // ✅ PERFORMANCE: Cleanup cache periodically
  if (Math.random() < 0.01) { // 1% chance to cleanup
    cleanupCache();
  }

  // Check cache first
  const cached = urlCache.get(path);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(
      { 
        url: cached.url,
        path: path,
        type: 'cached'
      },
      {
        // ✅ PERFORMANCE: Aggressive caching for images
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'CDN-Cache-Control': 'public, s-maxage=86400',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=86400',
          'X-Cache-Status': 'HIT'
        }
      }
    );
  }

  try {
    // Add images/ prefix if not already present (same logic as ServerBlobImage)
    const imagePath = path.startsWith('images/') ? path : `images/${path}`;
    const extensions = ['', '.jpg', '.jpeg', '.png', '.webp', '.avif', '.mp4'];
    
    // ✅ PERFORMANCE: Try to find the image with different extensions
    for (const ext of extensions) {
      const pathToTry = `${imagePath}${ext}`;
      const { blobs } = await list({
        prefix: pathToTry,
        limit: 1
      });
      
      if (blobs.length > 0) {
        const imageUrl = blobs[0].url;
        
        // Cache the result with proper size management
        if (urlCache.size < MAX_CACHE_SIZE) {
          urlCache.set(path, { url: imageUrl, timestamp: Date.now() });
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`🖼️ Found image: ${pathToTry} -> ${imageUrl}`);
        }
        
        return NextResponse.json(
          { 
            url: imageUrl,
            path: path,
            type: 'blob'
          },
          {
            // ✅ PERFORMANCE: Long-term caching for blob URLs
            headers: {
              'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
              'CDN-Cache-Control': 'public, s-maxage=86400',
              'Vercel-CDN-Cache-Control': 'public, s-maxage=86400',
              'X-Cache-Status': 'MISS',
              'X-Image-Source': 'blob-storage'
            }
          }
        );
      }
    }
    
    // ✅ PERFORMANCE: Cache placeholders too (shorter TTL)
    const placeholderUrl = `/api/placeholder/1200/800?text=Image Not Found&style=nest&path=${encodeURIComponent(path)}`;
    
    if (urlCache.size < MAX_CACHE_SIZE) {
      urlCache.set(path, { url: placeholderUrl, timestamp: Date.now() });
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(`🖼️ Image not found: ${imagePath} - returning placeholder`);
    }
    
    return NextResponse.json(
      { 
        url: placeholderUrl,
        path: path,
        type: 'placeholder'
      },
      {
        // ✅ PERFORMANCE: Shorter cache for placeholders
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
          'CDN-Cache-Control': 'public, s-maxage=300',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=300',
          'X-Cache-Status': 'PLACEHOLDER'
        }
      }
    );
    
  } catch (error) {
    console.error('Image API error:', error);
    
    // ✅ PERFORMANCE: Always return a working fallback, never fail
    const fallbackUrl = `/api/placeholder/400/300?text=Error&style=nest&bgColor=%23ffeeee&textColor=%23cc0000`;
    
    return NextResponse.json(
      { 
        url: fallbackUrl,
        path: path,
        type: 'fallback',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        // ✅ PERFORMANCE: No caching for errors
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Cache-Status': 'ERROR'
        }
      }
    );
  }
}

// ✅ PERFORMANCE: Export route config for optimization
export const dynamic = 'force-dynamic'; // Always fresh for blob storage
export const runtime = 'nodejs'; // Use Node.js runtime for better performance
