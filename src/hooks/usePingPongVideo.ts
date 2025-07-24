import { useState, useRef, useCallback, useEffect } from "react";

interface UsePingPongVideoOptions {
    reversePlayback?: boolean;
    enableDebugLogging?: boolean;
}

interface UsePingPongVideoReturn {
    // State
    isPlayingReverse: boolean;
    videoDuration: number;
    isVideoReady: boolean;

    // Event handlers
    handleVideoEnded: () => void;
    handleLoadedMetadata: () => void;

    // Refs for video element
    videoRef: React.RefObject<HTMLVideoElement | null>;

    // Control functions
    startReversePlayback: () => void;
    stopReversePlayback: () => void;

    // Cleanup function
    cleanup: () => void;
}

export const usePingPongVideo = ({
    reversePlayback = true,
    enableDebugLogging = process.env.NODE_ENV === "development"
}: UsePingPongVideoOptions = {}): UsePingPongVideoReturn => {
    // State management
    const [isPlayingReverse, setIsPlayingReverse] = useState(false);
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const [isVideoReady, setIsVideoReady] = useState(false);

    // Refs for animation and video control
    const videoRef = useRef<HTMLVideoElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const isReversePlayingRef = useRef<boolean>(false);
    const lastTimeRef = useRef<number>(0);

    // Debug logging helper
    const debugLog = useCallback((message: string, data?: any) => {
        if (enableDebugLogging) {
            console.log(`🎥 ${message}`, data || "");
        }
    }, [enableDebugLogging]);

    // Start reverse playback animation
    const startReversePlayback = useCallback(() => {
        const video = videoRef.current;
        if (!video || !reversePlayback) {
            debugLog("startReversePlayback: conditions not met", {
                hasVideo: !!video,
                reversePlayback
            });
            return;
        }

        debugLog("Starting reverse playback", {
            currentTime: video.currentTime,
            duration: video.duration
        });

        // Pause the video to prevent forward playback during reverse
        video.pause();

        isReversePlayingRef.current = true;
        setIsPlayingReverse(true);

        const animate = () => {
            if (!isReversePlayingRef.current || !video) {
                debugLog("Reverse animation stopping", {
                    isReversePlaying: isReversePlayingRef.current,
                    hasVideo: !!video
                });
                return;
            }

            const now = performance.now();
            const deltaTime = now - lastTimeRef.current;
            lastTimeRef.current = now;

            // Calculate reverse playback speed (approximately 30fps)
            const reverseSpeed = deltaTime * 0.03;
            const currentTime = video.currentTime;
            const newTime = Math.max(0, currentTime - reverseSpeed);

            // Debug logging for reverse frames (throttled)
            if (enableDebugLogging && Math.floor(now) % 1000 < 50) {
                debugLog("Reverse frame", {
                    deltaTime: deltaTime.toFixed(2),
                    reverseSpeed: reverseSpeed.toFixed(4),
                    currentTime: currentTime.toFixed(3),
                    newTime: newTime.toFixed(3)
                });
            }

            video.currentTime = newTime;

            // Check if we've reached the beginning
            if (newTime <= 0.1) { // Small threshold to avoid precision issues
                debugLog("Reached beginning, switching to forward", {
                    finalTime: newTime,
                    duration: video.duration
                });

                // Switch back to forward playback
                isReversePlayingRef.current = false;
                setIsPlayingReverse(false);
                video.currentTime = 0;

                // Start forward playback again
                video.play().catch((error) => {
                    debugLog("Failed to restart forward playback", error);
                });

                debugLog("Ping-pong: switched to forward playback");
            } else {
                // Continue reverse animation
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        lastTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(animate);
        debugLog("Ping-pong: started reverse playback");
    }, [reversePlayback, debugLog, enableDebugLogging]);

    // Stop reverse playback
    const stopReversePlayback = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        isReversePlayingRef.current = false;
        setIsPlayingReverse(false);
        debugLog("Reverse playback stopped");
    }, [debugLog]);

    // Handle video end for ping-pong effect
    const handleVideoEnded = useCallback(() => {
        const video = videoRef.current;

        debugLog("handleVideoEnded called", {
            reversePlayback,
            hasVideo: !!video,
            currentTime: video?.currentTime,
            duration: video?.duration
        });

        if (!reversePlayback || !video) {
            debugLog("Standard loop behavior - reversePlayback disabled");
            return;
        }

        debugLog("Video ended, starting reverse playback");
        startReversePlayback();
    }, [reversePlayback, startReversePlayback, debugLog]);

    // Handle video metadata loaded
    const handleLoadedMetadata = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            setVideoDuration(video.duration);
            setIsVideoReady(true);
            debugLog("Video metadata loaded", {
                duration: video.duration,
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
                readyState: video.readyState
            });
        }
    }, [debugLog]);

    // Cleanup function
    const cleanup = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        isReversePlayingRef.current = false;
        setIsPlayingReverse(false);
        debugLog("Ping-pong video hook cleaned up");
    }, [debugLog]);

    // Cleanup animation frame on unmount
    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    // Debug state logging (throttled)
    useEffect(() => {
        if (!enableDebugLogging || !isVideoReady) return;

        const interval = setInterval(() => {
            const video = videoRef.current;
            if (video) {
                debugLog("Component state", {
                    currentTime: video.currentTime.toFixed(2),
                    duration: video.duration?.toFixed(2) || "unknown",
                    paused: video.paused,
                    ended: video.ended,
                    isPlayingReverse,
                    reversePlayback,
                    readyState: video.readyState
                });
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isVideoReady, isPlayingReverse, reversePlayback, enableDebugLogging, debugLog]);

    return {
        // State
        isPlayingReverse,
        videoDuration,
        isVideoReady,

        // Event handlers
        handleVideoEnded,
        handleLoadedMetadata,

        // Refs
        videoRef,

        // Control functions
        startReversePlayback,
        stopReversePlayback,

        // Cleanup
        cleanup
    };
};

export default usePingPongVideo; 