// src/app/components/server/BlobImage.tsx
import { getImageUrl } from '../../../lib/blob-utils';
import Image, { ImageProps } from 'next/image';
import { generatePlaceholder, getPlaceholderTextFromPath, removeFileExtension } from '../../../lib/image-fallback';

interface BlobImageProps extends Omit<ImageProps, 'src'> {
  path: string;
  mobilePath?: string;
  fallbackSrc?: string;
  errorComponent?: React.ReactNode;
  critical?: boolean;
}

export async function BlobImage({
  path,
  mobilePath,
  fallbackSrc,
  errorComponent,
  critical = false,
  alt,
  width,
  height,
  ...props
}: BlobImageProps) {
  if (!path) {
    console.warn('BlobImage: No path provided');
    return renderFallback();
  }

  // Generate a default placeholder based on the path
  const defaultPlaceholder = generatePlaceholder(
    width as number || 400,
    height as number || 300,
    getPlaceholderTextFromPath(path)
  );

  // Clean up the path for proper processing
  const cleanPath = path.replace(/^images\//, '');
  const imagePath = `images/${cleanPath}`;
  const normalizedPath = removeFileExtension(imagePath);

  // Try to fetch the image URL from Blob storage
  let imageUrl = await getImageUrl(normalizedPath);

  // If desktop image isn't found but mobile path is provided, try that as fallback
  if (!imageUrl && mobilePath) {
    const cleanMobilePath = mobilePath.replace(/^images\//, '');
    const mobileImagePath = `images/${cleanMobilePath}`;
    const normalizedMobilePath = removeFileExtension(mobileImagePath);
    imageUrl = await getImageUrl(normalizedMobilePath);
  }

  // If the image URL is not found, use fallback
  if (!imageUrl) {
    // Log warning in development to help debug missing images
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Image not found in Blob storage: ${normalizedPath}, using fallback`);
    }
    return renderFallback();
  }

  // Image found, render it
  return (
    <Image
      src={imageUrl}
      alt={alt || getPlaceholderTextFromPath(path)}
      {...(props.fill ? { fill: true } : { width: width || 400, height: height || 300 })}
      {...props}
    />
  );

  // Helper function to render the fallback
  function renderFallback() {
    // If custom error component is provided, show that
    if (errorComponent) {
      return <>{errorComponent}</>;
    }

    // Use the provided fallback or generate a placeholder
    const src = fallbackSrc || defaultPlaceholder;
    
    return (
      <Image
        src={src}
        alt={alt || getPlaceholderTextFromPath(path)}
        {...(props.fill ? { fill: true } : { width: width || 400, height: height || 300 })}
        {...props}
        unoptimized={true} // Don't optimize placeholder images
      />
    );
  }
}