import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

// Cache for blob URLs to prevent duplicate API calls
const urlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'No path provided' }, { status: 400 });
  }

  // Check cache first
  const cached = urlCache.get(path);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({
      url: cached.url,
      path: path,
      type: 'cached'
    });
  }

  try {
    // Add images/ prefix if not already present (same logic as ServerBlobImage)
    const imagePath = path.startsWith('images/') ? path : `images/${path}`;
    const extensions = ['', '.jpg', '.jpeg', '.png', '.webp', '.avif', '.mp4', '.webm', '.mov'];

    // Try to find the image with different extensions
    for (const ext of extensions) {
      const pathToTry = `${imagePath}${ext}`;
      const { blobs } = await list({
        prefix: pathToTry,
        limit: 1
      });

      if (blobs.length > 0) {
        const imageUrl = blobs[0].url;

        // Cache the result
        urlCache.set(path, { url: imageUrl, timestamp: Date.now() });

        if (process.env.NODE_ENV === 'development') {
          console.log(`🖼️ Found image: ${pathToTry} -> ${imageUrl}`);
        }

        return NextResponse.json({
          url: imageUrl,
          path: path,
          type: 'blob'
        });
      }
    }

    // Image not found - return placeholder
    const placeholderUrl = `/api/placeholder/1200/800?text=Image Not Found&style=nest&path=${encodeURIComponent(path)}`;

    if (process.env.NODE_ENV === 'development') {
      console.warn(`🖼️ Image not found: ${imagePath} - returning placeholder`);
    }

    return NextResponse.json({
      url: placeholderUrl,
      path: path,
      type: 'placeholder'
    });

  } catch (error) {
    console.error('Image API error:', error);

    // Always return a working placeholder, never fail
    const fallbackUrl = `/api/placeholder/400/300?text=Error&style=nest&bgColor=%23ffeeee&textColor=%23cc0000`;

    return NextResponse.json({
      url: fallbackUrl,
      path: path,
      type: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
