'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ClientBlobVideoProps {
  path: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  reversePlayback?: boolean;
}

export const ClientBlobVideo: React.FC<ClientBlobVideoProps> = ({
  path,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  onLoad,
  onError,
  reversePlayback = false,
}) => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState(1);
  const [isReversed, setIsReversed] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        if (path.includes('blob.vercel-storage.com')) {
          setVideoUrl(path);
        } else {
          const response = await fetch(`/api/images?path=${encodeURIComponent(path)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch video URL');
          }
          const data = await response.json();
          if (!data.url) {
            throw new Error('No video URL returned');
          }
          setVideoUrl(data.url);
        }
        if (onLoad) onLoad();
      } catch (error) {
        console.error('Error loading video:', error);
        if (onError && error instanceof Error) onError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [path, onLoad, onError]);

  useEffect(() => {
    if (!reversePlayback) return;

    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    if (!video1 || !video2) return;

    const handleEnded = (video: HTMLVideoElement, isFirst: boolean) => {
      if (isFirst === (activeVideo === 1)) {
        const otherVideo = isFirst ? video2 : video1;
        otherVideo.currentTime = isReversed ? 0 : otherVideo.duration;
        otherVideo.playbackRate = isReversed ? 1 : -1;
        otherVideo.play();
        setActiveVideo(isFirst ? 2 : 1);
        setIsReversed(!isReversed);
      }
    };

    const handleVideo1Ended = () => handleEnded(video1, true);
    const handleVideo2Ended = () => handleEnded(video2, false);

    video1.addEventListener('ended', handleVideo1Ended);
    video2.addEventListener('ended', handleVideo2Ended);

    // Initialize the first video
    video1.currentTime = 0;
    video1.playbackRate = 1;
    video1.play();

    return () => {
      video1.removeEventListener('ended', handleVideo1Ended);
      video2.removeEventListener('ended', handleVideo2Ended);
    };
  }, [reversePlayback, activeVideo, isReversed]);

  if (loading) {
    return (
      <div className="w-full h-full bg-black" />
    );
  }

  return (
    <div className={className} style={{ position: 'relative' }}>
      <video
        ref={videoRef1}
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: activeVideo === 1 ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
        autoPlay={autoPlay}
        loop={!reversePlayback && loop}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <video
        ref={videoRef2}
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: activeVideo === 2 ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
        autoPlay={false}
        loop={!reversePlayback && loop}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
};