"use client";

import React, { useState } from "react";
import { PingPongVideo } from "@/components/videos";
import { ClientBlobVideo } from "@/components/images";

export default function PingPongVideoDemo() {
  const [videoSrc, setVideoSrc] = useState("/api/placeholder/800/450");
  const [videoPath, setVideoPath] = useState("test-video"); // For ClientBlobVideo
  const [componentType, setComponentType] = useState<
    "PingPongVideo" | "ClientBlobVideo"
  >("ClientBlobVideo");
  const [autoPlay, setAutoPlay] = useState(true);
  const [muted, setMuted] = useState(true);
  const [reversePlayback, setReversePlayback] = useState(true);
  const [enableDebugLogging, setEnableDebugLogging] = useState(true);
  const [controls, setControls] = useState(false);
  const [reverseSpeedMultiplier, setReverseSpeedMultiplier] = useState(3);

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Ping-Pong Video Components
          </h1>
          <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
            Test both PingPongVideo (simple) and ClientBlobVideo (blob storage)
            components that create seamless ping-pong effects with true reverse
            playback using requestAnimationFrame for smooth reverse animation.
          </p>
        </div>

        {/* Video Player */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-2">
              Live Demo - {componentType}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {reversePlayback
                ? `Video will play forward → reverse (${reverseSpeedMultiplier}x slower) → forward in an endless loop`
                : "Video will play normally with standard looping"}
            </p>
            <p className="text-xs text-blue-600">
              {componentType === "ClientBlobVideo"
                ? "Using blob storage path resolution with advanced caching"
                : "Using direct video URL with simplified interface"}
            </p>
          </div>

          <div className="p-6">
            {componentType === "PingPongVideo" ? (
              <PingPongVideo
                src={videoSrc}
                className="w-full h-auto rounded-lg"
                autoPlay={autoPlay}
                muted={muted}
                playsInline={true}
                controls={controls}
                reversePlayback={reversePlayback}
                reverseSpeedMultiplier={reverseSpeedMultiplier}
                enableDebugLogging={enableDebugLogging}
                onLoad={() =>
                  console.log("🎥 PingPongVideo loaded successfully")
                }
                onError={(error) =>
                  console.error("🎥 PingPongVideo error:", error)
                }
              />
            ) : (
              <ClientBlobVideo
                path={videoPath}
                className="w-full h-auto rounded-lg"
                autoPlay={autoPlay}
                muted={muted}
                playsInline={true}
                controls={controls}
                reversePlayback={reversePlayback}
                reverseSpeedMultiplier={reverseSpeedMultiplier}
                enableCache={true}
                onLoad={() =>
                  console.log("🎥 ClientBlobVideo loaded successfully")
                }
                onError={(error) =>
                  console.error("🎥 ClientBlobVideo error:", error)
                }
              />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold">Configuration</h2>

          {/* Component Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Component Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="PingPongVideo"
                  checked={componentType === "PingPongVideo"}
                  onChange={(e) =>
                    setComponentType(e.target.value as "PingPongVideo")
                  }
                  className="rounded"
                />
                <span className="text-sm">PingPongVideo (Direct URL)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="ClientBlobVideo"
                  checked={componentType === "ClientBlobVideo"}
                  onChange={(e) =>
                    setComponentType(e.target.value as "ClientBlobVideo")
                  }
                  className="rounded"
                />
                <span className="text-sm">ClientBlobVideo (Blob Storage)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video Source */}
            {componentType === "PingPongVideo" ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Video URL</label>
                <input
                  type="text"
                  value={videoSrc}
                  onChange={(e) => setVideoSrc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter video URL"
                />
                <p className="text-xs text-gray-500">
                  Try: /api/placeholder/800/450 or any MP4 URL
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Video Path (Blob)
                </label>
                <input
                  type="text"
                  value={videoPath}
                  onChange={(e) => setVideoPath(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter blob path"
                />
                <p className="text-xs text-gray-500">
                  Try: test-video, hero-animation, or any blob path
                </p>
              </div>
            )}

            {/* Reverse Speed */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Reverse Speed (Multiplier): {reverseSpeedMultiplier}x slower
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={reverseSpeedMultiplier}
                onChange={(e) =>
                  setReverseSpeedMultiplier(parseFloat(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1x (Same as forward)</span>
                <span>10x (Very slow)</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Quick Presets</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setVideoSrc("/api/placeholder/800/450")}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Placeholder
                </button>
                <button
                  onClick={() =>
                    setVideoSrc(
                      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    )
                  }
                  className="px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Sample Video
                </button>
              </div>
            </div>
          </div>

          {/* Debug Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">🔧 Debugging Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Open browser Developer Tools (F12) and check the Console tab</li>
              <li>• Enable "Debug" checkbox to see detailed ping-pong logs</li>
              <li>• Look for logs like "🎬 Video ended" → "🔄 Starting reverse playback" → "▶️ switched to forward"</li>
              <li>• Adjust "Reverse Speed" slider - higher values = slower reverse playback</li>
              <li>• Try different component types to compare behavior</li>
            </ul>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={reversePlayback}
                onChange={(e) => setReversePlayback(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Ping-Pong Effect</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Auto Play</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={muted}
                onChange={(e) => setMuted(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Muted</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={controls}
                onChange={(e) => setControls(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Controls</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={enableDebugLogging}
                onChange={(e) => setEnableDebugLogging(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Debug</span>
            </label>
          </div>

          {/* Clear Console Button */}
          <div className="pt-4 border-t">
            <button
              onClick={() => console.clear()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Console
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Open browser DevTools console to see debug output
            </p>
          </div>
        </div>

        {/* Features & Usage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Features */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-4">
              ✅ Key Features
            </h3>
            <ul className="text-sm text-green-700 space-y-2">
              <li>• True reverse playback using requestAnimationFrame</li>
              <li>• Seamless forward → reverse → forward loop</li>
              <li>• Works on all modern browsers</li>
              <li>• Mobile-optimized with playsInline</li>
              <li>• No visual flipping - actual reverse playback</li>
              <li>• Comprehensive error handling</li>
              <li>• Development debug overlay</li>
              <li>• React event props for reliability</li>
            </ul>
          </div>

          {/* Usage Tips */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-4">🎯 Usage Tips</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Best for videos under 30 seconds</li>
              <li>• Keep muted=true for autoplay</li>
              <li>• Use playsInline=true for mobile</li>
              <li>• Check browser console for debug info</li>
              <li>• Works with any MP4 video source</li>
              <li>• Disable controls during reverse playback</li>
              <li>• Perfect for hero animations and product demos</li>
              <li>• Combine with HybridBlobImage for blob storage</li>
            </ul>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-semibold mb-4">Usage Examples</h3>

          <div className="space-y-6">
            {/* Basic Example */}
            <div>
              <h4 className="text-sm font-medium mb-2">
                Basic Ping-Pong Video
              </h4>
              <pre className="text-sm bg-gray-100 p-4 rounded border overflow-x-auto">
                {`import { PingPongVideo } from '@/components/videos';

<PingPongVideo
  src="/videos/your-video.mp4"
  className="w-full h-auto"
  autoPlay={true}
  muted={true}
  playsInline={true}
  reversePlayback={true}
/>`}
              </pre>
            </div>

            {/* Hero Section */}
            <div>
              <h4 className="text-sm font-medium mb-2">
                Hero Section Animation
              </h4>
              <pre className="text-sm bg-gray-100 p-4 rounded border overflow-x-auto">
                {`<section className="relative w-full h-screen overflow-hidden">
  <PingPongVideo
    src="/videos/hero-animation.mp4"
    className="absolute inset-0 w-full h-full object-cover"
    autoPlay={true}
    muted={true}
    playsInline={true}
    reversePlayback={true}
    enableDebugLogging={false}
  />
</section>`}
              </pre>
            </div>

            {/* With Error Handling */}
            <div>
              <h4 className="text-sm font-medium mb-2">With Error Handling</h4>
              <pre className="text-sm bg-gray-100 p-4 rounded border overflow-x-auto">
                {`<PingPongVideo
  src="/videos/product-demo.mp4"
  className="w-full aspect-video rounded-lg"
  autoPlay={true}
  muted={true}
  reversePlayback={true}
  onLoad={() => console.log('Video loaded!')}
  onError={(error) => {
    console.error('Video failed:', error);
    // Handle error - show fallback content
  }}
/>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Integration Info */}
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-4">
            🔄 Integration with Existing Components
          </h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>
              • <strong>ClientBlobVideo</strong>: Still available for blob URL
              resolution with ping-pong support
            </p>
            <p>
              • <strong>PingPongVideo</strong>: Simplified component for direct
              video URLs
            </p>
            <p>
              • <strong>usePingPongVideo</strong>: Reusable hook for custom
              implementations
            </p>
            <p>
              • All components use the same reliable ping-pong logic under the
              hood
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <a
            href="/showcase/videos"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ← Back to Video Showcase
          </a>
        </div>
      </div>
    </div>
  );
}
