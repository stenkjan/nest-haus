# Image Optimization & Handling System

## Overview

This document outlines the comprehensive image handling system for NEST Haus, designed for optimal performance, SEO, and user experience. The system implements a hybrid SSR/Client approach that follows project architecture rules.

## Architecture Principles

### 1. **Balanced SSR/Client Strategy**

- **SSR for Static Content**: Landing pages, marketing content, above-fold images
- **Client for Interactive Content**: Configurators, dynamic tools, user dashboards
- **Hybrid for Optimal Performance**: Automatic strategy selection based on content type

### 2. **Performance Optimization**

- **Image Caching**: Multi-level caching (memory, session, server)
- **Smart Preloading**: Predictive loading based on user behavior
- **Efficient Fallbacks**: Graceful degradation with semantic placeholders
- **Format Optimization**: WebP/AVIF support with automatic fallbacks

### 3. **Zero-Redundancy Design**

- **Memoized Lookups**: Cache image path calculations
- **Deduplication**: Prevent duplicate API calls
- **Smart Updates**: Only reload when configuration actually changes

## Component Architecture

### Core Components

#### 1. **HybridBlobImage** (Recommended)

```tsx
import { HybridBlobImage } from '@/components/images';

// Landing page hero (SSR)
<HybridBlobImage
  path="hero-image"
  isAboveFold={true}
  isCritical={true}
  strategy="ssr"
  alt="NEST Haus Hero"
/>

// Configurator preview (Client)
<HybridBlobImage
  path={dynamicImagePath}
  isInteractive={true}
  strategy="client"
  enableCache={true}
  alt="Configuration Preview"
/>

// Auto-determined strategy
<HybridBlobImage
  path="product-image"
  strategy="auto"
  isAboveFold={false}
  isCritical={false}
  isInteractive={false}
  alt="Product"
/>
```

#### 2. **ServerBlobImage** (SSR-Optimized)

```tsx
import { ServerBlobImage } from "@/components/images";

// Server component usage
<ServerBlobImage
  path="static-content-image"
  enableSSRFetch={true}
  alt="Static Content"
  priority={true}
/>;
```

#### 3. **ClientBlobImage** (Client-Optimized)

```tsx
import { ClientBlobImage } from "@/components/images";

// Client component usage
<ClientBlobImage
  path="dynamic-image"
  enableCache={true}
  enableMobileDetection={true}
  showLoadingSpinner={true}
  alt="Dynamic Content"
/>;
```

### ImageManager (Core Logic)

#### Features:

- **Memoized Path Resolution**: Prevents redundant calculations
- **Smart Caching**: In-memory cache for image paths
- **Intelligent Fallbacks**: Multi-level fallback system
- **Preloading**: Predictive image loading

#### Usage:

```tsx
import { ImageManager } from "@/app/konfigurator/core/ImageManager";

// Get optimized image path
const imagePath = ImageManager.getPreviewImage(configuration, "exterior");

// Preload related images
await ImageManager.preloadImages(configuration);

// Get available views
const availableViews = ImageManager.getAvailableViews(configuration);
```

## Usage Guidelines

### When to Use Each Component

#### Use **HybridBlobImage** (Default Choice):

- ✅ Any new image implementation
- ✅ When you want automatic optimization
- ✅ Mixed content (some static, some dynamic)
- ✅ When unsure about the best strategy

#### Use **ServerBlobImage**:

- ✅ Static marketing pages
- ✅ Above-fold hero images
- ✅ SEO-critical content
- ✅ Content that doesn't change frequently
- ❌ Interactive configurators
- ❌ User dashboards

#### Use **ClientBlobImage**:

- ✅ Interactive applications
- ✅ Dynamic image loading
- ✅ User-uploaded content
- ✅ Real-time updates
- ❌ Static landing page content
- ❌ Above-fold hero images

### Configuration Examples

#### Landing Page (SSR Priority)

```tsx
// Hero images - critical for SEO and Core Web Vitals
<HybridBlobImage
  path="1-NEST-Haus-Berg-Vision-AUSTRIA-SWISS-Holzlattung-Laerche"
  strategy="ssr"
  isAboveFold={true}
  isCritical={true}
  priority={true}
  alt="NEST Haus Mountain Vision"
  sizes="100vw"
  style={{ aspectRatio: "16/9" }}
/>
```

#### Configurator (Client Priority)

```tsx
// Dynamic preview - requires instant feedback
<HybridBlobImage
  path={currentImagePath}
  strategy="client"
  isInteractive={true}
  enableCache={true}
  enableMobileDetection={true}
  alt="Configuration Preview"
  sizes="(max-width: 768px) 100vw, 70vw"
  quality={85}
/>
```

#### Gallery (Hybrid Strategy)

```tsx
// Auto-determined based on position
<HybridBlobImage
  path="gallery-image"
  strategy="auto"
  isAboveFold={index < 2} // First 2 images above fold
  isCritical={index === 0} // Hero image is critical
  isInteractive={false}
  alt="Gallery Image"
  loading={index < 2 ? "eager" : "lazy"}
/>
```

## Performance Optimizations

### 1. **Caching Strategy**

- **Memory Cache**: Resolved image paths (ImageManager)
- **Session Cache**: Blob URLs (ClientBlobImage)
- **Server Cache**: Blob API responses (1 hour TTL)
- **Browser Cache**: Next.js Image optimization (24 hours TTL)

### 2. **Loading Strategy**

- **Critical Images**: SSR + priority loading
- **Above-fold**: SSR with placeholder
- **Below-fold**: Lazy loading with intersectionObserver
- **Interactive**: Client-side with intelligent preloading

### 3. **Fallback System**

```
1. Exact image match
2. Fallback with default material
3. Fallback with default size
4. Final default image
5. Semantic placeholder (with context)
```

### 4. **Format Optimization**

```typescript
// Next.js config optimizations
images: {
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24, // 24 hours
}
```

## API Routes

### Image API (`/api/images`)

- **Purpose**: Resolve blob URLs from image paths
- **Caching**: Server-side cache with 1-hour TTL
- **Fallback**: Semantic placeholders for missing images
- **Extensions**: Auto-detection (.jpg, .jpeg, .png, .webp, .avif)

### Placeholder API (`/api/placeholder/[width]/[height]`)

- **Purpose**: Generate semantic SVG placeholders
- **Features**: NEST Haus branding, context-aware messages
- **Performance**: Cached with immutable headers
- **Customization**: Query params for text, colors, style

## Error Handling

### Graceful Degradation

1. **Image Not Found**: Semantic placeholder with context
2. **API Error**: Fallback placeholder with error styling
3. **Network Issues**: Cached images when available
4. **Loading States**: Smooth loading indicators

### Development Debugging

```typescript
// Enable detailed logging in development
if (process.env.NODE_ENV === "development") {
  console.log("🖼️ Image loading details");
}
```

## Best Practices

### DO:

- ✅ Use `HybridBlobImage` for new implementations
- ✅ Set appropriate `alt` text for accessibility
- ✅ Use `priority={true}` for above-fold critical images
- ✅ Implement proper `sizes` attribute for responsive images
- ✅ Cache frequently accessed images
- ✅ Preload predictable next images
- ✅ Use `ClientBlobVideo` event handlers only in Client Components ("use client")

### DON'T:

- ❌ Use client-side loading for critical above-fold content
- ❌ Skip accessibility attributes
- ❌ Load full-resolution images on mobile unnecessarily
- ❌ Block user interactions waiting for images
- ❌ Create redundant API calls
- ❌ Use fixed pixel sizes for responsive layouts
- ❌ Pass event handlers to `ClientBlobVideo` from Server Components

## Migration Guide

### From Old System

```tsx
// OLD: Legacy blob image
<ClientBlobImage path="image" />

// NEW: Optimized hybrid approach
<HybridBlobImage
  path="image"
  strategy="auto"
  alt="Descriptive text"
/>
```

### From Static Images

```tsx
// OLD: Static Next.js Image
<Image src="/static/image.jpg" alt="..." />

// NEW: Blob-optimized with fallback
<HybridBlobImage
  path="image-name"
  strategy="ssr"
  alt="..."
  fallbackSrc="/static/image.jpg"
/>
```

## Monitoring & Analytics

### Performance Metrics

- **Loading Times**: Track image load performance
- **Cache Hit Rates**: Monitor caching effectiveness
- **Error Rates**: Track failed image loads
- **User Experience**: Core Web Vitals impact

### Development Tools

```typescript
// ImageManager debugging
ImageManager.clearPreloadedImages(); // Reset cache
ImageManager.getPreviewImage(config, "exterior"); // Test resolution
```

## Future Improvements

### Planned Features

1. **Progressive Loading**: BlurHash or LQIP implementation
2. **Advanced Preloading**: ML-based prediction
3. **CDN Integration**: Geographic optimization
4. **Format Selection**: Device-specific optimization
5. **Bandwidth Adaptation**: Network-aware loading

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Image Load Time**: < 500ms (cached), < 2s (uncached)

## Troubleshooting

### Common Issues

#### "Image not loading"

1. Check blob storage URL configuration
2. Verify image path in constants
3. Test fallback placeholder
4. Check browser network tab

#### "Slow image loading"

1. Verify caching is enabled
2. Check image format optimization
3. Test preloading implementation
4. Monitor API response times

#### "Layout shift"

1. Set explicit aspect ratios
2. Use proper placeholder sizing
3. Implement blur placeholders
4. Test responsive breakpoints

## Video Component Integration

### **ClientBlobVideo Component**

The `ClientBlobVideo` component extends our blob storage architecture to support video content with advanced features like reverse playback and seamless looping. 

**Production Implementation**: Currently integrated in the `/unser-part` page's "Dein Nest System" section, demonstrating modular architecture concepts through video content.

#### **Basic Usage**

```tsx
import { ClientBlobVideo } from "@/components/images";

// Standard video playback with loop
<ClientBlobVideo
  path="demo-video"
  className="w-full h-full object-cover"
  autoPlay={true}
  loop={true}
  muted={true}
  playsInline={true}
  controls={true}
  onLoad={() => console.log("🎥 Video loaded")}
  onError={(error) => console.error("❌ Video error:", error)}
/>;
```

#### **Advanced Reverse Playback**

```tsx
// Ping-pong effect for seamless animation loops without controls
<ClientBlobVideo
  path="animation-loop"
  className="w-full h-auto"
  reversePlayback={true}
  autoPlay={true}
  loop={false}
  muted={true}
  playsInline={true}
  controls={false}
/>
```

#### **Seamless Background Animation**

```tsx
// Clean looping animation without any UI elements
<div className="relative w-full aspect-video">
  <ClientBlobVideo
    path="background-animation"
    className="w-full h-full object-cover"
    autoPlay={true}
    loop={false}
    muted={true}
    playsInline={true}
    controls={false}
    reversePlayback={true}
  />
  <span className="sr-only">Continuous looping background animation</span>
</div>
```

#### **Hero Background Video**

```tsx
// Full-screen background video with overlay
<div className="relative w-full h-screen overflow-hidden">
  <ClientBlobVideo
    path="hero-background"
    className="absolute inset-0 w-full h-full object-cover"
    autoPlay={true}
    loop={true}
    muted={true}
    playsInline={true}
  />
  <div className="absolute inset-0 bg-black/30">
    {/* Hero content overlay */}
  </div>
</div>
```

#### **Unser-Part Page Implementation**

```tsx
// Production example from /unser-part - Seamless reverse playback loop without controls
<div className="w-full max-w-6xl aspect-video rounded-lg overflow-hidden bg-gray-900">
  <ClientBlobVideo
    path={IMAGES.function.nestHausModulSchema}
    className="w-full h-full object-cover"
    autoPlay={true}
    loop={false}
    muted={true}
    playsInline={true}
    controls={false}
    enableCache={true}
    reversePlayback={true}
    fallbackSrc={IMAGES.function.nestHausModulSchema}
  />
  {/* Accessibility description for screen readers */}
  <span className="sr-only">
    Video demonstration of NEST-Haus modular construction system showing architectural components and assembly process in a continuous forward and reverse loop animation
  </span>
</div>
```

```tsx
// If using in a Client Component, event handlers are available
"use client";

<ClientBlobVideo
  path="video-path"
  onLoad={() => console.log('🎥 Video loaded successfully')}
  onError={(error) => console.error('🎥 Video error:', error)}
  // ... other props
/>
```

**Implementation Features:**
- ✅ **Graceful Fallback**: Uses existing image as fallback if video fails to load
- ✅ **Seamless Loop**: Ping-pong reverse playback creates endless smooth animation
- ✅ **Clean UI**: No controls (progress bar, buttons) for distraction-free viewing
- ✅ **Mobile Optimized**: `playsInline` and `muted` for mobile compatibility
- ✅ **Performance**: Caching enabled with error handling
- ✅ **Responsive Design**: `aspect-video` maintains 16:9 ratio across devices
- ✅ **Accessibility**: Screen reader description for video content
- ✅ **SEO Friendly**: Replaces static image while maintaining content purpose

#### **Video Component Features**

- ✅ **Blob Storage Integration**: Uses existing `/api/images` endpoint
- ✅ **Advanced Caching**: Session-based URL caching with performance monitoring
- ✅ **Reverse Playback**: Dual video strategy for ping-pong effects
- ✅ **Error Handling**: Graceful degradation with fallback options
- ✅ **Mobile Optimized**: Support for `playsInline` and autoplay restrictions
- ✅ **TypeScript**: Fully typed interface
- ✅ **Performance**: Intelligent loading states and preloading

#### **Supported Video Formats**

The API now supports multiple video formats:

- `.mp4` - Standard H.264 video
- `.webm` - Modern WebM format
- `.mov` - QuickTime format

#### **Performance Considerations**

- **Reverse Playback**: Uses dual video elements (2x memory usage)
- **Mobile Optimization**: Always use `playsInline={true}`
- **Autoplay**: Must be muted for autoplay to work in browsers
- **Loading Strategy**: Use intersection observer for below-fold videos

#### **Migration from Standard Video**

```tsx
// OLD: Basic HTML5 video
<video src="/videos/demo.mp4" autoPlay loop muted />

// NEW: Blob-optimized with advanced features
<ClientBlobVideo
  path="demo-video"
  autoPlay={true}
  loop={true}
  muted={true}
  className="w-full h-auto"
/>
```
