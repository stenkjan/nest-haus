import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

// Cache for blob URLs to prevent duplicate API calls
const urlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface BatchImageRequest {
    paths: string[];
}

interface BatchImageResult {
    [path: string]: {
        url: string;
        type: 'cached' | 'blob' | 'placeholder' | 'fallback';
        error?: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body: BatchImageRequest = await request.json();
        const { paths } = body;

        if (!paths || !Array.isArray(paths) || paths.length === 0) {
            return NextResponse.json({ error: 'No paths provided' }, { status: 400 });
        }

        // Limit batch size to prevent abuse
        if (paths.length > 20) {
            return NextResponse.json({ error: 'Batch size too large (max 20)' }, { status: 400 });
        }

        const results: BatchImageResult = {};

        // Process all paths concurrently
        const pathPromises = paths.map(async (path) => {
            try {
                const result = await processSingleImage(path);
                results[path] = result;
            } catch (error) {
                results[path] = {
                    url: `/api/placeholder/400/300?text=Error&style=nest&bgColor=%23ffeeee&textColor=%23cc0000`,
                    type: 'fallback',
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });

        // Wait for all images to be processed
        await Promise.allSettled(pathPromises);

        if (process.env.NODE_ENV === 'development') {
            console.log(`🔄 Batch processed ${paths.length} images`);
        }

        return NextResponse.json({
            success: true,
            results,
            processed: paths.length
        });

    } catch (error) {
        console.error('Batch images API error:', error);
        return NextResponse.json(
            { error: 'Failed to process batch request' },
            { status: 500 }
        );
    }
}

async function processSingleImage(path: string): Promise<{
    url: string;
    type: 'cached' | 'blob' | 'placeholder' | 'fallback';
    error?: string;
}> {
    // Check cache first
    const cached = urlCache.get(path);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`📦 Batch cache hit: ${path}`);
        }
        return {
            url: cached.url,
            type: 'cached'
        };
    }

    try {
        // Add images/ prefix if not already present
        const imagePath = path.startsWith('images/') ? path : `images/${path}`;
        const extensions = ['', '.jpg', '.jpeg', '.png', '.webp', '.avif', '.mp4', '.webm', '.mov'];

        // Timeout for blob operations
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Blob operation timeout')), 10000); // 10s timeout for batch
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
                        console.log(`🎯 Batch found: ${pathToTry}`);
                    }

                    return {
                        url: imageUrl,
                        type: 'blob'
                    };
                }
            } catch (extError) {
                // Continue to next extension
                continue;
            }
        }

        // Image not found - return placeholder
        const placeholderUrl = `/api/placeholder/1200/800?text=Image Not Found&style=nest&path=${encodeURIComponent(path)}`;

        if (process.env.NODE_ENV === 'development') {
            console.warn(`🖼️ Batch not found: ${imagePath}`);
        }

        return {
            url: placeholderUrl,
            type: 'placeholder'
        };

    } catch (error) {
        const isTimeoutError = error instanceof Error && error.message.includes('timeout');

        if (process.env.NODE_ENV === 'development') {
            if (isTimeoutError) {
                console.error(`⏰ Batch timeout: ${path}`);
            } else {
                console.error(`❌ Batch error: ${path}`, error);
            }
        }

        // Return fallback
        const errorType = isTimeoutError ? 'Timeout' : 'Error';
        return {
            url: `/api/placeholder/400/300?text=${errorType}&style=nest&bgColor=%23ffeeee&textColor=%23cc0000`,
            type: 'fallback',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
} 