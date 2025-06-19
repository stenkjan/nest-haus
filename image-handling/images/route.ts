// src/app/api/images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put, del, list } from '@vercel/blob';
import { getImageUrl, getImagesByPrefix, getBlobImages } from '../../../lib/blob-utils';

// Maximum file size (4MB to stay under Vercel's 4.5MB limit with overhead)
const MAX_SIZE = 4 * 1024 * 1024; // 4MB

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get the path parameter
  const path = searchParams.get('path');
  const prefix = searchParams.get('prefix');
  const debug = searchParams.get('debug') === 'true';
  
  // Comment out all GET request logging
  /*
  console.log('API called with path:', path);
  */
  
  // If path is provided, return a specific image URL
  if (path) {
    try {
      // If the path is already a blob storage URL, return it directly
      if (path.includes('blob.vercel-storage')) {
        return NextResponse.json({ url: path });
      }

      // Ensure path has 'images/' prefix but preserve any number prefixes
      const imagePath = path.startsWith('images/') ? path : `images/${path}`;
      /*
      console.log('Looking for image/video with exact path:', imagePath);
      */
      
      // Try to get the file with the exact path first
      let fileUrl = await getImageUrl(imagePath);
      
      // If not found and it's a video request, try with explicit .mp4 extension
      if (!fileUrl && !path.endsWith('.mp4')) {
        const videoPath = `${imagePath}.mp4`;
        /*
        console.log('Trying video path:', videoPath);
        */
        fileUrl = await getImageUrl(videoPath);
      }
      
      /*
      console.log('Final file URL result:', fileUrl);
      */
      
      if (!fileUrl) {
        /*
        console.log('File not found with path:', imagePath);
        */
        
        // In debug mode, add extra information about available images in the same category
        if (debug) {
          // Extract category from path
          const pathParts = imagePath.split('/');
          const category = pathParts.length > 2 ? pathParts[1] : '';
          
          // If we have a category, get all images in that category
          let similarImages: string | any[] = [];
          if (category) {
            const allImages = await getImagesByPrefix(category);
            similarImages = allImages.map(img => ({
              pathname: img.pathname,
              filename: img.filename
            }));
          }
          
          return NextResponse.json({ 
            error: 'File not found',
            path: imagePath,
            category,
            similarImagesCount: similarImages.length,
            similarImages: similarImages.slice(0, 5) // Show only first 5 to avoid too much output
          }, { status: 404 });
        }
        
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      
      return NextResponse.json({ url: fileUrl });
    } catch (error) {
      /*
      console.error('Error getting file:', error);
      */
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to get file' 
      }, { status: 500 });
    }
  }
  
  // If prefix is provided, return all images with that prefix
  if (prefix) {
    try {
      const images = await getImagesByPrefix(prefix);
      return NextResponse.json({ images });
    } catch (error) {
      /*
      console.error('Error getting images by prefix:', error);
      */
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to get images by prefix' 
      }, { status: 500 });
    }
  }
  
  // If no path or prefix is provided, return all images
  try {
    const images = await getBlobImages();
    return NextResponse.json({ images });
  } catch (error) {
    /*
    console.error('Error getting all images:', error);
    */
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to get all images' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify access to Blob storage
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not defined');
      return NextResponse.json(
        { error: 'Server configuration error: Missing Blob token' },
        { status: 500 }
      );
    }

    // Check if the request has the correct content type for a form upload
    const contentType = request.headers.get('content-type') || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Request must be multipart/form-data' }, { status: 400 });
    }
    
    // Get form data
    const formData = await request.formData();
    
    // Get the file from the form data
    const file = formData.get('file') as File | null;
    const pathParam = formData.get('path') as string | null;

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the ${MAX_SIZE / (1024 * 1024)}MB limit` },
        { status: 400 }
      );
    }

    // Determine path and filename
    let pathname = file.name;
    if (pathParam) {
      pathname = pathParam;
    }

    // Clean the path - ensure it has the proper format
    // If it doesn't start with 'images/', add it
    if (!pathname.startsWith('images/')) {
      pathname = `images/${pathname}`;
    }

    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: true, // Adds a unique ID to prevent collisions
      contentType: file.type,
      cacheControlMaxAge: 60 * 60 * 24 * 30, // 30 days in seconds
    });

    // Return the blob URL and details
    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: 'File upload failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pathname = searchParams.get('pathname');
    
    if (!pathname) {
      return NextResponse.json({ error: 'Missing pathname parameter' }, { status: 400 });
    }

    // In a real application, you would check authentication/authorization here
    // Only authenticated admins should be able to delete files

    // Attempt to delete the blob
    await del(pathname);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete image' },
      { status: 500 }
    );
  }
}

// For larger uploads, we need to increase the bodyParser limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // This should match MAX_SIZE
    },
  },
};