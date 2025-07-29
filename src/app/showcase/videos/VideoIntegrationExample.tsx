"use client";

import React, { useState } from "react";
import { ClientBlobVideo } from "@/components/images";

interface VideoIntegrationExampleProps {
  heroVideoPath: string;
  productDemoPath: string;
  backgroundVideoPath: string;
}

export default function VideoIntegrationExample({
  heroVideoPath,
  productDemoPath,
  backgroundVideoPath,
}: VideoIntegrationExampleProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoErrors, setVideoErrors] = useState<Record<string, string>>({});

  const handleVideoLoad = (videoType: string) => {
    console.log(`🎥 ${videoType} video loaded successfully`);
    setIsVideoLoaded(true);
  };

  const handleVideoError = (videoType: string, error: Error) => {
    console.error(`❌ ${videoType} video error:`, error);
    setVideoErrors((prev) => ({
      ...prev,
      [videoType]: error.message,
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Video */}
      <section className="relative w-full h-screen overflow-hidden">
        <ClientBlobVideo
          path={heroVideoPath}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          onLoad={() => handleVideoLoad("hero")}
          onError={(error) => handleVideoError("hero", error)}
        />

        {/* Hero overlay content */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Experience Innovation
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover how our solutions transform possibilities into reality
            </p>
            <button className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Loading indicator for hero video */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-white text-lg">Video wird geladen...</div>
          </div>
        )}
      </section>

      {/* Product Demo Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Product Demo</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Watch our interactive product demonstration to see how our
                technology works in real-world scenarios.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li>✓ Real-time performance monitoring</li>
                <li>✓ Intuitive user interface</li>
                <li>✓ Advanced analytics dashboard</li>
                <li>✓ Seamless integration capabilities</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <ClientBlobVideo
                path={productDemoPath}
                className="w-full aspect-video"
                controls={true}
                autoPlay={false}
                loop={true}
                muted={false}
                playsInline={true}
                onLoad={() => handleVideoLoad("demo")}
                onError={(error) => handleVideoError("demo", error)}
              />

              {videoErrors.demo && (
                <div className="p-4 bg-red-50 text-red-600 text-sm">
                  Fehler beim Laden des Demo-Videos: {videoErrors.demo}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Background Animation Section */}
      <section className="relative py-24 overflow-hidden">
        <ClientBlobVideo
          path={backgroundVideoPath}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          onLoad={() => handleVideoLoad("background")}
          onError={(error) => handleVideoError("background", error)}
        />

        <div className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Innovative Solutions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our cutting-edge technology delivers exceptional results across
            various industries and applications.
          </p>
        </div>
      </section>

      {/* Debug Information (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <section className="py-8 bg-yellow-50 border-t border-yellow-200">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-lg font-medium mb-4">
              🛠️ Development Debug Info
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded">
                <strong>Hero Video:</strong> {heroVideoPath}
                <br />
                Status: {videoErrors.hero ? "❌ Error" : "✅ Loaded"}
              </div>
              <div className="bg-white p-3 rounded">
                <strong>Demo Video:</strong> {productDemoPath}
                <br />
                Status: {videoErrors.demo ? "❌ Error" : "✅ Loaded"}
              </div>
              <div className="bg-white p-3 rounded">
                <strong>Background Video:</strong> {backgroundVideoPath}
                <br />
                Status: {videoErrors.background ? "❌ Error" : "✅ Loaded"}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
