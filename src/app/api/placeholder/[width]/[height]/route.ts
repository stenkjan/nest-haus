import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ width: string; height: string }> }
) {
  // Extract the width and height from the Promise
  const { width: widthParam, height: heightParam } = await params;
  
  try {
    const width = parseInt(widthParam) || 400;
    const height = parseInt(heightParam) || 300;
    const { searchParams } = new URL(request.url);
    
    // Get text parameters
    const text = searchParams.get('text') || 'Image not found';
    const textColor = searchParams.get('textColor') || '#666666';
    const bgColor = searchParams.get('bgColor') || '#f0f0f0';
    
    // Get branding and style parameters
    const withBranding = searchParams.get('branding') !== 'false';
    const style = searchParams.get('style') || 'default';
    
    // Create SVG with specified parameters
    let svg = '';
    
    if (style === 'nest') {
      // Nest Haus styled placeholder with house icon and branding
      svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${bgColor}" />
          <rect width="100%" height="6" fill="#3D6DE1" />
          
          <!-- House icon -->
          <svg x="${width/2 - 40}" y="${height/2 - 80}" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="${textColor}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          
          <!-- Main text -->
          <text 
            x="50%" 
            y="${height/2 + 20}" 
            font-family="Arial, sans-serif" 
            font-size="${Math.max(16, width/25)}" 
            fill="${textColor}" 
            text-anchor="middle" 
            dominant-baseline="middle"
          >
            ${text}
          </text>
          
          ${withBranding ? `
            <!-- Branding -->
            <text 
              x="50%" 
              y="${height - 20}" 
              font-family="Arial, sans-serif" 
              font-size="14" 
              fill="#3D6DE1" 
              text-anchor="middle" 
              dominant-baseline="middle"
            >
              NEST Haus
            </text>
          ` : ''}
        </svg>
      `;
    } else {
      // Default simple placeholder
      svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${bgColor}" />
          <text 
            x="50%" 
            y="50%" 
            font-family="Arial, sans-serif" 
            font-size="${Math.max(16, width/25)}" 
            fill="${textColor}" 
            text-anchor="middle" 
            dominant-baseline="middle"
          >
            ${text}
          </text>
          
          ${withBranding ? `
            <text 
              x="50%" 
              y="${height - 20}" 
              font-family="Arial, sans-serif" 
              font-size="12" 
              fill="#999999" 
              text-anchor="middle" 
              dominant-baseline="middle"
            >
              Image Placeholder
            </text>
          ` : ''}
        </svg>
      `;
    }
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating placeholder:', error);
    
    // Create a simple fallback SVG in case of error
    const errorSvg = `
      <svg width="${widthParam || 400}" height="${heightParam || 300}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ffeeee" />
        <text 
          x="50%" 
          y="50%" 
          font-family="Arial, sans-serif" 
          font-size="16" 
          fill="#cc0000" 
          text-anchor="middle" 
          dominant-baseline="middle"
        >
          Error generating placeholder
        </text>
      </svg>
    `;
    
    return new NextResponse(errorSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
      },
    });
  }
} 