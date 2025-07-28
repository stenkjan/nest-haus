# Ping-Pong Video System

## Overview

The ping-pong video system provides seamless forward-reverse-forward looping for video content using `requestAnimationFrame`-based reverse playback. This creates a true ping-pong effect where videos play forward to the end, then reverse back to the beginning, and repeat indefinitely.

## Components

### Core Hook: `usePingPongVideo`

**Location**: `src/hooks/usePingPongVideo.ts`

The main hook that provides ping-pong functionality through manual frame control during reverse playback.

**Key Features**:

- True reverse playback using `requestAnimationFrame`
- Configurable reverse speed multiplier
- Automatic cleanup of animation frames
- Seamless forward-to-reverse-to-forward transitions

**Interface**:

```typescript
interface UsePingPongVideoOptions {
  reversePlayback?: boolean;
  reverseSpeedMultiplier?: number; // Default: 3x slower than forward
}
```

### Video Components

#### `PingPongVideo`

**Location**: `src/components/videos/PingPongVideo.tsx`

Simplified component for direct video URLs with ping-pong functionality.

**Usage**:

```tsx
<PingPongVideo
  src="/videos/your-video.mp4"
  reversePlayback={true}
  reverseSpeedMultiplier={1}
  autoPlay={true}
  muted={true}
  playsInline={true}
/>
```

#### `ClientBlobVideo`

**Location**: `src/components/images/ClientBlobVideo.tsx`

Advanced component with blob storage integration and ping-pong support.

**Usage**:

```tsx
<ClientBlobVideo
  path="video-name"
  reversePlayback={true}
  reverseSpeedMultiplier={1}
  autoPlay={true}
  muted={true}
  enableCache={true}
/>
```

## Technical Implementation

### Forward Playback

- Standard HTML5 video playback using native browser controls
- Triggers `onEnded` event when video reaches the end

### Reverse Playback

- Manual control using `requestAnimationFrame`
- Video element is paused during reverse to prevent forward progression
- `currentTime` is manually decremented frame by frame
- Configurable speed multiplier controls reverse playback rate

### Transition Logic

1. Video plays forward normally
2. `onEnded` event triggers reverse playback initialization
3. `requestAnimationFrame` loop controls reverse motion
4. When `currentTime` reaches beginning (≤ 0.1s), forward playback resumes
5. Cycle repeats indefinitely

## Configuration Options

| Option                   | Type    | Default | Description                         |
| ------------------------ | ------- | ------- | ----------------------------------- |
| `reversePlayback`        | boolean | `true`  | Enable ping-pong effect             |
| `reverseSpeedMultiplier` | number  | `3`     | Reverse speed (higher = slower)     |
| `autoPlay`               | boolean | `true`  | Auto-start playback                 |
| `muted`                  | boolean | `true`  | Audio state (required for autoplay) |
| `playsInline`            | boolean | `true`  | Mobile optimization                 |

## Best Practices

### ✅ **Recommended Use Cases**

- Hero section animations
- Product demonstration loops
- Short promotional videos (< 30 seconds)
- Visual effects and transitions

### ✅ **Optimal Settings**

- `reverseSpeedMultiplier: 1` for noticeable reverse effect
- `muted: true` for autoplay compatibility
- `playsInline: true` for mobile devices
- Videos with clear directional motion for obvious ping-pong effect

### ❌ **Not Recommended**

- Long videos (> 30 seconds) due to performance impact
- Videos without obvious motion (effect may not be visible)
- Critical content where seamless playback is essential

## Browser Compatibility

✅ **Supported**: All modern browsers with HTML5 video support

- Chrome/Chromium (all versions)
- Firefox (all versions)
- Safari (all versions)
- Edge (all versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Characteristics

- **Forward Playback**: Native HTML5 performance
- **Reverse Playback**: ~60fps using `requestAnimationFrame`
- **Memory Usage**: Minimal overhead with proper cleanup
- **CPU Impact**: Low impact optimized for mobile devices

## Integration Notes

### With Existing Video Systems

The ping-pong system integrates seamlessly with:

- Blob storage video delivery (`ClientBlobVideo`)
- Standard video sources (`PingPongVideo`)
- Existing video caching mechanisms
- Error handling and fallback systems

### State Management

- Components maintain minimal state for reverse playback tracking
- Automatic cleanup prevents memory leaks
- No external state management required

## Troubleshooting

**Video not reversing**:

- Ensure the file is actually a video, not an image
- Check that `reversePlayback` is set to `true`
- Verify video has clear motion for visible effect

**Performance issues**:

- Reduce `reverseSpeedMultiplier` for faster reverse playback
- Use shorter video durations
- Ensure proper cleanup on component unmount

**Autoplay blocked**:

- Set `muted={true}` (browser requirement)
- Use `playsInline={true}` for mobile
- Handle autoplay failures gracefully

## Current Status

✅ **Production Ready**: The ping-pong video system is fully functional and tested
✅ **Clean Implementation**: All debug logging removed for production use
✅ **Cross-Browser Compatible**: Works on all modern browsers and mobile devices
✅ **Performance Optimized**: Efficient `requestAnimationFrame` implementation
✅ **Error Handling**: Graceful fallbacks and error recovery

The system successfully provides seamless forward-reverse-forward video looping through manual frame control, creating an engaging visual effect for appropriate use cases.
