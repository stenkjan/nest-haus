import { useState, useRef, useCallback, useEffect } from "react";

interface UsePingPongVideoOptions {
    reversePlayback?: boolean;
    reverseSpeedMultiplier?: number; // How much slower reverse should be (default: 3x slower)
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
    reverseSpeedMultiplier = 3 // Default: 3x slower than forward
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

    // Start reverse playback animation
    const startReversePlayback = useCallback(() => {
        const video = videoRef.current;
        if (!video || !reversePlayback || !video.duration || video.duration <= 0) {
            return;
        }

        // Pause the video to prevent forward playback during reverse
        video.pause();

        isReversePlayingRef.current = true;
        setIsPlayingReverse(true);

        const animate = () => {
            if (!isReversePlayingRef.current || !video) {
                return;
            }

            const now = performance.now();
            const deltaTime = now - lastTimeRef.current;
            lastTimeRef.current = now;

            // Calculate reverse playback speed - configurable slower than forward for dramatic effect
            // Convert deltaTime from milliseconds to seconds, then slow it down by the multiplier
            const reverseSpeed = (deltaTime / 1000) / reverseSpeedMultiplier;
            const currentTime = video.currentTime;
            const newTime = Math.max(0, currentTime - reverseSpeed);

            video.currentTime = newTime;

            // Check if we've reached the beginning
            if (newTime <= 0.1) { // Small threshold to avoid precision issues
                // Switch back to forward playback
                isReversePlayingRef.current = false;
                setIsPlayingReverse(false);
                video.currentTime = 0;

                // Start forward playback again
                video.play().catch(() => {
                    // Silently handle playback errors
                });
            } else {
                // Continue reverse animation
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        lastTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(animate);
    }, [reversePlayback, reverseSpeedMultiplier]);

    // Stop reverse playback
    const stopReversePlayback = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        isReversePlayingRef.current = false;
        setIsPlayingReverse(false);
    }, []);

    // Handle video end for ping-pong effect
    const handleVideoEnded = useCallback(() => {
        const video = videoRef.current;

        if (!reversePlayback || !video) {
            return;
        }

        startReversePlayback();
    }, [reversePlayback, startReversePlayback]);

    // Handle video metadata loaded
    const handleLoadedMetadata = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            setVideoDuration(video.duration);
            setIsVideoReady(true);
        }
    }, []);

    // Cleanup function
    const cleanup = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        isReversePlayingRef.current = false;
        setIsPlayingReverse(false);
    }, []);

    // Cleanup animation frame on unmount
    useEffect(() => {
        return cleanup;
    }, [cleanup]);

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