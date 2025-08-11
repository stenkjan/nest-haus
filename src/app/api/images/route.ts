import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

// Cache for blob URLs to prevent duplicate API calls
const urlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const redirect = searchParams.get('redirect') === 'true';

  if (!path) {
    return NextResponse.json({ error: 'No path provided' }, { status: 400 });
  }

  // Check cache first
  const cached = urlCache.get(path);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Cache hit for: ${path}`);
    }

    // Performance improvement: Direct redirect for immediate image serving
    if (redirect) {
      const response = NextResponse.redirect(cached.url, 302);
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      return response;
    }

    const jsonResponse = NextResponse.json({
      url: cached.url,
      path: path,
      type: 'cached'
    });
    jsonResponse.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return jsonResponse;
  }

  try {
    // Add images/ prefix if not already present (same logic as ServerBlobImage)
    const imagePath = path.startsWith('images/') ? path : `images/${path}`;
    const extensions = ['', '.jpg', '.jpeg', '.png', '.webp', '.avif', '.mp4', '.webm', '.mov'];

    // Timeout wrapper for blob list operations
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Blob operation timeout')), 15000); // 15 second timeout
    });

    // Try to find the image with different extensions
    for (const ext of extensions) {
      const pathToTry = `${imagePath}${ext}`;

      try {
        const { blobs } = await Promise.race([
          list({
            prefix: pathToTry,
            limit: 1
          }),
          timeoutPromise
        ]);

        if (blobs.length > 0) {
          const imageUrl = blobs[0].url;

          // Cache the result
          urlCache.set(path, { url: imageUrl, timestamp: Date.now() });

          if (process.env.NODE_ENV === 'development') {
            console.log(`🖼️ Found image: ${pathToTry} -> ${imageUrl.substring(0, 50)}...`);
          }

          // Performance improvement: Direct redirect for immediate image serving
          if (redirect) {
            const response = NextResponse.redirect(imageUrl, 302);
            response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
            return response;
          }

          const jsonResponse = NextResponse.json({
            url: imageUrl,
            path: path,
            type: 'blob'
          });
          jsonResponse.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
          return jsonResponse;
        }
      } catch (extError) {
        // Log individual extension failures in development
        if (process.env.NODE_ENV === 'development') {
          console.warn(`⚠️ Extension ${ext} failed for ${pathToTry}:`, extError instanceof Error ? extError.message : extError);
        }
        // Continue to next extension
        continue;
      }
    }

    // Image not found - return placeholder
    const placeholderUrl = `/api/placeholder/1200/800?text=Image Not Found&style=nest&path=${encodeURIComponent(path)}`;

    if (process.env.NODE_ENV === 'development') {
      console.warn(`🖼️ Image not found: ${imagePath} - returning placeholder`);
    }

    // Performance improvement: Direct redirect for immediate image serving
    if (redirect) {
      const response = NextResponse.redirect(placeholderUrl, 302);
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
      return response;
    }

    const jsonResponse = NextResponse.json({
      url: placeholderUrl,
      path: path,
      type: 'placeholder'
    });
    jsonResponse.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    return jsonResponse;

  } catch (error) {
    const isTimeoutError = error instanceof Error && error.message.includes('timeout');

    if (process.env.NODE_ENV === 'development') {
      if (isTimeoutError) {
        console.error(`⏰ API timeout for image: ${path}`, error);
      } else {
        console.error(`❌ Image API error for: ${path}`, error);
      }
    } else {
      // Only log in production if it's not a timeout (timeouts are expected)
      if (!isTimeoutError) {
        console.error('Image API error:', error);
      }
    }

    // Always return a working placeholder, never fail
    const errorType = isTimeoutError ? 'Timeout' : 'Error';
    const fallbackUrl = `/api/placeholder/400/300?text=${errorType}&style=nest&bgColor=%23ffeeee&textColor=%23cc0000`;

    // Performance improvement: Direct redirect for immediate image serving
    if (redirect) {
      const response = NextResponse.redirect(fallbackUrl, 302);
      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=3600');
      return response;
    }

    const jsonResponse = NextResponse.json({
      url: fallbackUrl,
      path: path,
      type: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    jsonResponse.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=3600');
    return jsonResponse;
  }
}
