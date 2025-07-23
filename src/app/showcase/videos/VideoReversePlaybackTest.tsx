"use client";

import React, { useState } from "react";
import { ClientBlobVideo } from "@/components/images";

export default function VideoReversePlaybackTest() {
  const [reverseEnabled, setReverseEnabled] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [testVideoPath, setTestVideoPath] = useState("hero-animation");

  const handleClearConsole = () => {
    console.clear();
    console.log("🎥 DEBUG: Console cleared - starting fresh debug session");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Video Reverse Playback Debug Test
        </h1>

        {/* Debug Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Debug Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={reverseEnabled}
                  onChange={(e) => setReverseEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Enable Reverse Playback (Ping-Pong)</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoPlayEnabled}
                  onChange={(e) => setAutoPlayEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Enable Auto-Play</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showControls}
                  onChange={(e) => setShowControls(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Show Video Controls</span>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Test Video Path:
                </label>
                <input
                  type="text"
                  value={testVideoPath}
                  onChange={(e) => setTestVideoPath(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter video path"
                />
              </div>

              <button
                onClick={handleClearConsole}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Clear Console & Start Fresh Debug
              </button>
            </div>
          </div>

          {/* Debug Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="font-medium text-yellow-800 mb-2">
              Debug Instructions:
            </h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Open browser dev tools console to see debug logs</li>
              <li>Enable reverse playback and auto-play</li>
              <li>Wait for video to load and start playing</li>
              <li>Watch console for detailed debugging information</li>
              <li>
                Look for &quot;🎥 DEBUG:&quot; messages to track reverse
                playback
              </li>
            </ol>
          </div>
        </div>

        {/* Video Test Area */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Video</h2>

            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Current Settings:</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Reverse Playback:{" "}
                  {reverseEnabled ? "✅ Enabled" : "❌ Disabled"}
                </li>
                <li>
                  • Auto-Play: {autoPlayEnabled ? "✅ Enabled" : "❌ Disabled"}
                </li>
                <li>• Controls: {showControls ? "✅ Visible" : "❌ Hidden"}</li>
                <li>• Video Path: {testVideoPath}</li>
              </ul>
            </div>

            {/* Video Container */}
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <ClientBlobVideo
                  path={testVideoPath}
                  className="w-full h-full object-cover"
                  reversePlayback={reverseEnabled}
                  autoPlay={autoPlayEnabled}
                  controls={showControls}
                  muted={true}
                  playsInline={true}
                  onLoad={() => {
                    console.log("🎥 TEST: Video onLoad callback fired");
                  }}
                  onError={(error) => {
                    console.error(
                      "🎥 TEST: Video onError callback fired:",
                      error
                    );
                  }}
                />
              </div>
            </div>

            {/* Expected Behavior */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="font-medium text-green-800 mb-2">
                Expected Behavior:
              </h3>
              <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                <li>Video loads and starts playing automatically</li>
                <li>When video reaches the end, reverse playback begins</li>
                <li>Video plays backwards until reaching the beginning</li>
                <li>
                  Forward playback resumes, creating endless ping-pong loop
                </li>
                <li>Console shows detailed debug logs for each step</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Debug Scenarios */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Common Debug Scenarios</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">🔍 What to Look For:</h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
                <li>&quot;handleVideoEnded called&quot; when video finishes</li>
                <li>&quot;playReverse called&quot; when reverse starts</li>
                <li>&quot;Reverse frame&quot; logs during reverse playback</li>
                <li>
                  &quot;switched to forward playback&quot; when cycle completes
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">⚠️ Potential Issues:</h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
                <li>Video not loading (check path and API)</li>
                <li>Ended event not firing (check video duration)</li>
                <li>
                  Reverse animation not starting (check requestAnimationFrame)
                </li>
                <li>
                  Time not updating during reverse (check currentTime
                  manipulation)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
