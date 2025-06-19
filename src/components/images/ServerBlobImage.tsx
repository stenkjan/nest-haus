import Image, { ImageProps } from 'next/image';
import { list } from '@vercel/blob';
import { unstable_cache } from 'next/cache';

interface ServerBlobImageProps extends Omit<ImageProps, 'src'> {
  path: string;
  fallbackSrc?: string;
  critical?: boolean;
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
  fallbackSrc = '/api/placeholder/400/300',
  critical = false,
  alt,
  width,
  height,
  fill,
  ...props
}: ServerBlobImageProps) {
  // Early return for invalid path to prevent unnecessary processing
  if (!path || path === 'undefined' || path === '') {
    console.warn('ServerBlobImage: Invalid path provided:', path);
    return (
      <Image
        src={fallbackSrc}
        alt={alt || 'Placeholder'}
        {...(fill ? { fill: true } : { width: width || 400, height: height || 300 })}
        {...props}
        unoptimized
      />
    );
  }

  let imageUrl: string | null = null;
  
  try {
    // Get the primary image URL
    imageUrl = await getCachedImageUrl(path);
    
    // If primary image not found and fallbackSrc is a blob path (not a placeholder)
    if (!imageUrl && fallbackSrc && !fallbackSrc.startsWith('/api/placeholder') && !fallbackSrc.startsWith('http')) {
      imageUrl = await getCachedImageUrl(fallbackSrc);
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
        {...(fill ? { fill: true } : { width: width || 400, height: height || 300 })}
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
      {...(fill ? { fill: true } : { width: width || 400, height: height || 300 })}
      priority={critical}
      {...props}
    />
  );
} 