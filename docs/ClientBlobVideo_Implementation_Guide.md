# ClientBlobVideo Component Implementation Guide

## Overview

The `ClientBlobVideo` component is a sophisticated video player designed for blob storage integration with advanced features like reverse playback and seamless looping. This component follows client-side rendering patterns for optimal user experience with video content.

## Core Features

### 🎥 **Blob Storage Integration**

- Automatic URL resolution for blob storage paths
- Direct blob URL support with fallback API fetching
- Graceful error handling and loading states

### 🔄 **Advanced Playback Controls**

- **Reverse Playback**: Unique ping-pong effect using dual video elements
- **Seamless Looping**: Smooth transitions between forward/reverse cycles
- **Standard Controls**: Full HTML5 video API support

### ⚡ **Performance Optimized**

- Client-side rendering for instant feedback
- Dual video element strategy for smooth transitions
- Minimal loading states and error boundaries

## Component Architecture

### **TypeScript Interface**

```tsx
interface ClientBlobVideoProps {
  path: string; // Blob path or direct URL
  className?: string; // CSS styling
  autoPlay?: boolean; // Auto-start playback
  loop?: boolean; // Standard looping
  muted?: boolean; // Audio state
  playsInline?: boolean; // Mobile optimization
  controls?: boolean; // Show/hide controls
  onLoad?: () => void; // Success callback
  onError?: (error: Error) => void; // Error callback
  reversePlayback?: boolean; // Enable ping-pong effect
}
```

### **Core State Management**

```tsx
// URL Resolution State
const [videoUrl, setVideoUrl] = useState<string>("");
const [loading, setLoading] = useState(true);

// Dual Video Strategy (for reverse playback)
const videoRef1 = useRef<HTMLVideoElement>(null);
const videoRef2 = useRef<HTMLVideoElement>(null);
const [activeVideo, setActiveVideo] = useState(1);
const [isReversed, setIsReversed] = useState(false);
```

## Implementation Patterns

### **1. Basic Video Usage**

```tsx
import { ClientBlobVideo } from "@/components/videos";

// Standard video playback
<ClientBlobVideo
  path="hero-video"
  className="w-full h-full object-cover"
  autoPlay={true}
  loop={true}
  muted={true}
  playsInline={true}
  onLoad={() => console.log("🎥 Video loaded")}
  onError={(error) => console.error("❌ Video error:", error)}
/>;
```

### **2. Advanced Reverse Playback**

```tsx
// Ping-pong video effect
<ClientBlobVideo
  path="animation-loop"
  className="w-full h-auto"
  reversePlayback={true}
  autoPlay={true}
  muted={true}
  playsInline={true}
/>
```

### **3. Interactive Video with Controls**

```tsx
// User-controlled video
<ClientBlobVideo
  path="product-demo"
  className="rounded-lg shadow-lg"
  controls={true}
  autoPlay={false}
  loop={false}
  muted={false}
/>
```

## Technical Implementation Details

### **URL Resolution Strategy**

```tsx
const fetchVideo = async () => {
  try {
    setLoading(true);

    // Direct blob URL - use immediately
    if (path.includes("blob.vercel-storage.com")) {
      setVideoUrl(path);
    } else {
      // API resolution for path-based access
      const response = await fetch(
        `/api/images?path=${encodeURIComponent(path)}`
      );
      if (!response.ok) throw new Error("Failed to fetch video URL");

      const data = await response.json();
      if (!data.url) throw new Error("No video URL returned");

      setVideoUrl(data.url);
    }

    if (onLoad) onLoad();
  } catch (error) {
    console.error("🎥 Error loading video:", error);
    if (onError && error instanceof Error) onError(error);
  } finally {
    setLoading(false);
  }
};
```

### **Reverse Playback Mechanism**

The component uses a sophisticated dual-video strategy for seamless reverse playback:

```tsx
// Dual video element coordination
const handleEnded = (video: HTMLVideoElement, isFirst: boolean) => {
  if (isFirst === (activeVideo === 1)) {
    const otherVideo = isFirst ? video2 : video1;

    // Set playback direction and position
    otherVideo.currentTime = isReversed ? 0 : otherVideo.duration;
    otherVideo.playbackRate = isReversed ? 1 : -1;
    otherVideo.play();

    // Switch active video and direction
    setActiveVideo(isFirst ? 2 : 1);
    setIsReversed(!isReversed);
  }
};
```

### **Responsive Rendering Strategy**

```tsx
// Dual video elements with opacity transitions
<div className={className} style={{ position: "relative" }}>
  <video
    ref={videoRef1}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      opacity: activeVideo === 1 ? 1 : 0,
      transition: "opacity 0.3s ease-in-out",
    }}
    // ... video props
  />
  <video
    ref={videoRef2}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      opacity: activeVideo === 2 ? 1 : 0,
      transition: "opacity 0.3s ease-in-out",
    }}
    // ... video props
  />
</div>
```

## Integration Guidelines

### **Blob Storage API Integration**

The component expects your `/api/images` endpoint to handle video paths:

```tsx
// API Route Example (/api/images/route.ts)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  try {
    // Resolve video URL from blob storage
    const videoUrl = await resolveVideoFromBlob(path);
    return Response.json({ url: videoUrl });
  } catch (error) {
    return Response.json({ error: "Video not found" }, { status: 404 });
  }
}
```

### **Error Boundary Integration**

```tsx
// Wrap video components in error boundaries
<ErrorBoundary fallback={<VideoPlaceholder />}>
  <ClientBlobVideo
    path="video-content"
    onError={(error) => {
      // Log error for debugging
      console.error("🎥 Video error:", error);
      // Optional: Track error for analytics
      trackVideoError(error);
    }}
  />
</ErrorBoundary>
```

### **Performance Optimization**

```tsx
// Lazy loading for below-fold videos
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setIsVisible(entry.isIntersecting),
    { threshold: 0.1 }
  );

  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
}, []);

// Conditional rendering
{
  isVisible && <ClientBlobVideo path="video-path" autoPlay={true} />;
}
```

## Migration to New Architecture

### **From Legacy Video Components**

```tsx
// OLD: Basic video element
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

### **Enhanced Features Migration**

```tsx
// Add reverse playback to existing videos
<ClientBlobVideo
  path="existing-video"
  reversePlayback={true} // Enable ping-pong effect
  autoPlay={true}
  muted={true}
/>
```

## Best Practices

### **✅ DO:**

- Use `reversePlayback` for seamless animation loops
- Always provide `onError` callbacks for debugging
- Set `playsInline={true}` for mobile optimization
- Use appropriate `className` for responsive design
- Handle loading states gracefully
- Mute videos when auto-playing (browser requirements)

### **❌ DON'T:**

- Auto-play unmuted videos (browser blocks this)
- Skip error handling - videos can fail to load
- Use reverse playback for long videos (performance impact)
- Ignore mobile optimization settings
- Assume videos will always load successfully

## Component Integration Examples

### **Hero Section Video**

```tsx
// Full-screen hero with reverse animation
<section className="relative w-full h-screen overflow-hidden">
  <ClientBlobVideo
    path="hero-animation"
    className="absolute inset-0 w-full h-full object-cover"
    reversePlayback={true}
    autoPlay={true}
    muted={true}
    playsInline={true}
  />
  <div className="absolute inset-0 bg-black/30">
    {/* Hero content overlay */}
  </div>
</section>
```

### **Product Showcase**

```tsx
// Interactive product demo
<div className="bg-white rounded-lg shadow-lg overflow-hidden">
  <ClientBlobVideo
    path="product-demo"
    className="w-full aspect-video"
    controls={true}
    autoPlay={false}
    loop={true}
    playsInline={true}
  />
  <div className="p-6">{/* Product information */}</div>
</div>
```

### **Background Animation**

```tsx
// Subtle background animation
<div className="relative min-h-screen">
  <ClientBlobVideo
    path="background-animation"
    className="absolute inset-0 w-full h-full object-cover opacity-20"
    reversePlayback={true}
    autoPlay={true}
    muted={true}
    playsInline={true}
  />
  <div className="relative z-10">{/* Main content */}</div>
</div>
```

## Performance Considerations

### **Loading Strategy**

- **Above-fold videos**: Load immediately with `autoPlay`
- **Below-fold videos**: Use intersection observer for lazy loading
- **Background videos**: Lower priority, load after critical content

### **Memory Management**

- **Reverse playback**: Uses dual video elements (2x memory usage)
- **Long videos**: Consider standard looping instead of reverse playback
- **Mobile optimization**: Use `playsInline` and appropriate video sizes

### **Error Recovery**

- **Network failures**: Provide graceful fallbacks
- **Format support**: Use multiple video formats if needed
- **Loading states**: Show appropriate loading indicators

## Development & Debugging

### **Development Helpers**

```tsx
// Debug video loading
<ClientBlobVideo
  path="debug-video"
  onLoad={() => console.log("🎥 Video loaded successfully")}
  onError={(error) => console.error("❌ Video error:", error)}
/>
```

### **Performance Monitoring**

```tsx
// Track video performance
const handleVideoLoad = () => {
  console.log("🎥 Video load time:", performance.now());
  // Optional: Send analytics
};
```

## Future Enhancements

### **Potential Improvements**

- **Multiple format support**: WebM, AVIF video formats
- **Adaptive streaming**: Quality adjustment based on connection
- **Preloading strategies**: Intelligent preloading of next videos
- **Gesture controls**: Touch controls for mobile playback

### **Integration Opportunities**

- **Analytics tracking**: Video engagement metrics
- **A/B testing**: Video performance comparison
- **CDN optimization**: Edge caching for video content
- **Progressive loading**: Chunked video loading for faster start times

## Conclusion

The `ClientBlobVideo` component provides a robust foundation for video content in blob storage environments. Its dual-video reverse playback feature and comprehensive error handling make it ideal for modern web applications requiring sophisticated video experiences.

Follow the implementation patterns and best practices outlined in this guide to ensure optimal performance and user experience across all devices and network conditions.
