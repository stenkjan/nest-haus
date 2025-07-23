"use client";

import React from "react";
import { ClientBlobVideo } from "@/components/images";
import Link from "next/link";

export default function VideoShowcase() {
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-medium text-4xl md:text-[60px] tracking-[-0.02em] mb-4 text-center">
          ClientBlobVideo Showcase
        </h1>
        <h2 className="text-xl md:text-2xl font-medium tracking-[-0.015em] leading-8 mb-8 max-w-3xl mx-auto text-center text-gray-600">
          Demonstrating video loading capabilities with blob storage integration
        </h2>

        {/* Debug Test Link */}
        <div className="text-center mb-16">
          <Link 
            href="/showcase/videos/reverse-test"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔧 Debug Reverse Playback Test
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            Interactive debugging tool for reverse playback functionality
          </p>
        </div>

        <div className="grid gap-12">
          {/* Basic Video Example */}
          <section className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-xl font-medium">Basic Video with Loop</h3>
              <p className="text-gray-600 mt-2">
                Standard video playback with automatic looping enabled
              </p>
              <code className="block mt-2 text-sm bg-gray-100 p-2 rounded">
                {`<ClientBlobVideo
  path="demo-video"
  autoPlay={true}
  loop={true}
  muted={true}
  playsInline={true}
  controls={true}
/>`}
              </code>
            </div>
            <div className="aspect-video">
              <ClientBlobVideo
                path="demo-video"
                className="w-full h-full object-cover"
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                controls={true}
                onLoad={() => console.log("🎥 Basic video loaded")}
                onError={(error) =>
                  console.error("❌ Basic video error:", error)
                }
              />
            </div>
          </section>

          {/* Reverse Playback Example */}
          <section className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-xl font-medium">
                Reverse Playback (Ping-Pong Effect)
              </h3>
              <p className="text-gray-600 mt-2">
                Advanced dual-video technique for seamless forward/reverse
                looping
              </p>
              <code className="block mt-2 text-sm bg-gray-100 p-2 rounded">
                {`<ClientBlobVideo
  path="animation-loop"
  reversePlayback={true}
  autoPlay={true}
  muted={true}
  playsInline={true}
/>`}
              </code>
            </div>
            <div className="aspect-video">
              <ClientBlobVideo
                path="animation-loop"
                className="w-full h-full object-cover"
                reversePlayback={true}
                autoPlay={true}
                muted={true}
                playsInline={true}
                onLoad={() => console.log("🎥 Reverse playback video loaded")}
                onError={(error) =>
                  console.error("❌ Reverse playback error:", error)
                }
              />
            </div>
          </section>

          {/* Interactive Video Example */}
          <section className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-xl font-medium">
                Interactive Video with Controls
              </h3>
              <p className="text-gray-600 mt-2">
                User-controlled video with standard HTML5 controls, no autoplay
              </p>
              <code className="block mt-2 text-sm bg-gray-100 p-2 rounded">
                {`<ClientBlobVideo
  path="product-demo"
  controls={true}
  autoPlay={false}
  loop={true}
  muted={false}
/>`}
              </code>
            </div>
            <div className="aspect-video">
              <ClientBlobVideo
                path="product-demo"
                className="w-full h-full object-cover"
                controls={true}
                autoPlay={false}
                loop={true}
                muted={false}
                playsInline={true}
                onLoad={() => console.log("🎥 Interactive video loaded")}
                onError={(error) =>
                  console.error("❌ Interactive video error:", error)
                }
              />
            </div>
          </section>

          {/* Hero Background Video Example */}
          <section className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-xl font-medium">Hero Background Video</h3>
              <p className="text-gray-600 mt-2">
                Full-width background video with overlay content
              </p>
              <code className="block mt-2 text-sm bg-gray-100 p-2 rounded">
                {`<div className="relative w-full h-96 overflow-hidden">
  <ClientBlobVideo
    path="hero-background"
    className="absolute inset-0 w-full h-full object-cover"
    autoPlay={true}
    loop={true}
    muted={true}
    playsInline={true}
  />
  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
    <h2 className="text-white text-3xl font-bold">Overlay Content</h2>
  </div>
</div>`}
              </code>
            </div>
            <div className="relative w-full h-96 overflow-hidden rounded-b-lg">
              <ClientBlobVideo
                path="hero-background"
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                onLoad={() => console.log("🎥 Hero background video loaded")}
                onError={(error) =>
                  console.error("❌ Hero background error:", error)
                }
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-white text-3xl font-bold">
                  Overlay Content
                </h2>
              </div>
            </div>
          </section>

          {/* Features Summary */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-medium mb-4">Component Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                ✅ <strong>Blob Storage Integration:</strong> Seamless
                integration with existing image API
              </li>
              <li>
                ✅ <strong>Advanced Caching:</strong> Session-based URL caching
                with performance monitoring
              </li>
              <li>
                ✅ <strong>Reverse Playback:</strong> Unique ping-pong effect
                using dual video elements
              </li>
              <li>
                ✅ <strong>Error Handling:</strong> Graceful degradation with
                fallback options
              </li>
              <li>
                ✅ <strong>Mobile Optimized:</strong> Support for playsInline
                and autoplay restrictions
              </li>
              <li>
                ✅ <strong>TypeScript:</strong> Fully typed with comprehensive
                interface
              </li>
              <li>
                ✅ <strong>Performance:</strong> Intelligent loading states and
                preloading capabilities
              </li>
              <li>
                ✅ <strong>SSR Compatible:</strong> Client-side rendering
                following project patterns
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
