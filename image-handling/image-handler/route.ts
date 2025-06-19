// src/app/api/image-handler/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { ensureImagesPrefix } from '../../../lib/image-fallback';

// Helper function to calculate string similarity
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // If strings are identical, return 1
  if (s1 === s2) return 1;
  
  // If one string contains the other, return high similarity
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;
  
  // Calculate similarity based on common characters
  const set1 = new Set(s1.split(''));
  const set2 = new Set(s2.split(''));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const strict = searchParams.get('strict') === 'true';
    const debug = searchParams.get('debug') === 'true';
    
    if (!path) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 });
    }

    // Convert .jpeg to .jpg immediately
    const convertedPath = path.replace(/\.jpeg$/i, '.jpg');
    
    // Make sure the path has the images/ prefix
    const normalizedPath = ensureImagesPrefix(convertedPath);
    
    // console.log(`Looking for image: ${normalizedPath}`);
    
    // Try multiple file extensions in order of preference
    const extensions = ['', '.jpg', '.png'];
    const attemptedPaths = [];
    let bestMatch: { url: string; similarity: number } | null = null;
    
    // Try each extension
    for (const ext of extensions) {
      // Skip empty extension if path already has an extension
      if (ext === '' && /\.(jpg|jpeg|png)$/i.test(normalizedPath)) {
        continue;
      }
      
      const pathToTry = ext ? `${normalizedPath}${ext}` : normalizedPath;
      attemptedPaths.push(pathToTry);
      
      try {
        // console.log(`Trying path: ${pathToTry}`);
        const { blobs } = await list({
          prefix: pathToTry.split('/').slice(0, -1).join('/'), // Search in the same directory
          limit: 20
        });
        
        if (blobs.length > 0) {
          // First check for exact matches
          const exactMatch = blobs.find(blob => blob.pathname === pathToTry);
          if (exactMatch) {
            // console.log(`Found exact match: ${exactMatch.url}`);
            return NextResponse.json({ url: exactMatch.url });
          }
          
          // If no exact match and not in strict mode, look for similar matches
          if (!strict) {
            for (const blob of blobs) {
              const similarity = calculateSimilarity(pathToTry, blob.pathname);
              
              // Update best match if this one is more similar
              if (!bestMatch || similarity > bestMatch.similarity) {
                bestMatch = {
                  url: blob.url,
                  similarity
                };
              }
            }
          }
        }
      } catch (error) {
        // console.error(`Error trying ${pathToTry}:`, error);
      }
    }
    
    // If we found a similar match and we're not in strict mode, use it
    if (!strict && bestMatch && bestMatch.similarity > 0.7) {
      // console.log(`Using best match with similarity ${bestMatch.similarity}: ${bestMatch.url}`);
      return NextResponse.json({ url: bestMatch.url });
    }
    
    // If all attempts fail, return 404
    // console.log(`No image found for: ${normalizedPath}`);
    return NextResponse.json({ 
      error: 'Image not found',
      requestedPath: normalizedPath,
      attemptedPaths
    }, { status: 404 });
    
  } catch (error) {
    // console.error('Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}