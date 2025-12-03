import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

// Vercel serverless function configuration
export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds max execution time

// Cache for blob URLs to prevent duplicate API calls
const urlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
    // Verify blob storage is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('❌ BLOB_READ_WRITE_TOKEN is not configured');
        return NextResponse.json({
            error: 'Blob storage not configured',
            details: 'BLOB_READ_WRITE_TOKEN environment variable is missing'
        }, { status: 503 });
    }

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
            console.log(`📦 Cache hit for file: ${path}`);
        }

        // Performance improvement: Direct redirect for immediate file serving
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
        // Add files/ prefix if not already present
        const filePath = path.startsWith('files/') ? path : `files/${path}`;
        const extensions = ['', '.pdf', '.doc', '.docx', '.txt', '.zip', '.xlsx', '.xls'];

        // Timeout wrapper for blob list operations
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Blob operation timeout')), 15000); // 15 second timeout
        });

        // Try to find the file with different extensions
        for (const ext of extensions) {
            const pathToTry = `${filePath}${ext}`;

            try {
                const { blobs } = await Promise.race([
                    list({
                        prefix: pathToTry,
                        limit: 1
                    }),
                    timeoutPromise
                ]);

                if (blobs.length > 0) {
                    const fileUrl = blobs[0].url;

                    // Cache the result
                    urlCache.set(path, { url: fileUrl, timestamp: Date.now() });

                    if (process.env.NODE_ENV === 'development') {
                        console.log(`📄 Found file: ${pathToTry} -> ${fileUrl.substring(0, 50)}...`);
                    }

                    // Performance improvement: Direct redirect for immediate file serving
                    if (redirect) {
                        const response = NextResponse.redirect(fileUrl, 302);
                        response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
                        return response;
                    }

                    const jsonResponse = NextResponse.json({
                        url: fileUrl,
                        path: path,
                        type: 'blob'
                    });
                    jsonResponse.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
                    return jsonResponse;
                }
            } catch (extError) {
                // Log individual extension failures in development
                if (process.env.NODE_ENV === 'development') {
                    console.log(`⚠️ Extension ${ext} failed for ${pathToTry}:`, extError);
                }
                continue;
            }
        }

        // If no file found with any extension
        console.error(`❌ File not found in blob storage: ${filePath}`);
        return NextResponse.json(
            {
                error: 'File not found',
                path: path,
                searchedPaths: extensions.map(ext => `${filePath}${ext}`)
            },
            { status: 404 }
        );

    } catch (error) {
        console.error(`❌ Error fetching file from blob storage:`, error);

        return NextResponse.json(
            {
                error: 'Failed to fetch file from blob storage',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
