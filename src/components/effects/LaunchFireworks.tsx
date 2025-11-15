"use client";

import { useEffect, useState, useMemo } from 'react';

interface LaunchFireworksProps {
  onComplete?: () => void;
}

export default function LaunchFireworks({ onComplete }: LaunchFireworksProps) {
  const [countdown, setCountdown] = useState(3);
  const [showFireworks, setShowFireworks] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished, show fireworks
      setShowFireworks(true);
      return undefined;
    }
  }, [countdown]);

  // Auto-cleanup after fireworks complete
  useEffect(() => {
    if (showFireworks) {
      const timeout = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 6000); // 6 seconds for fireworks + confetti

      return () => clearTimeout(timeout);
    }
  }, [showFireworks, onComplete]);

  // Generate more firework positions for spectacular effect
  const fireworks = useMemo(() => [
    { x: 20, y: 30, delay: 0, color: '#FFD700' }, // Gold
    { x: 80, y: 25, delay: 0.2, color: '#00FFFF' }, // Cyan
    { x: 50, y: 40, delay: 0.4, color: '#FF00FF' }, // Magenta
    { x: 35, y: 20, delay: 0.6, color: '#00FF00' }, // Lime
    { x: 65, y: 35, delay: 0.8, color: '#FF6B00' }, // Orange
    { x: 45, y: 15, delay: 1.0, color: '#FF1493' }, // Hot Pink
    { x: 75, y: 45, delay: 1.2, color: '#FFD700' }, // Gold
    { x: 25, y: 50, delay: 1.4, color: '#00FFFF' }, // Cyan
    { x: 55, y: 25, delay: 1.6, color: '#FF00FF' }, // Magenta
    { x: 40, y: 45, delay: 1.8, color: '#00FF00' }, // Lime
    { x: 70, y: 30, delay: 2.0, color: '#FF6B00' }, // Orange
    { x: 30, y: 35, delay: 2.2, color: '#FF1493' }, // Hot Pink
  ], []);

  // Generate confetti pieces - memoized to prevent animation glitches on re-render
  const confettiPieces = useMemo(() => 
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      rotation: Math.random() * 360,
      color: ['#FFD700', '#00FFFF', '#FF00FF', '#00FF00', '#FF6B00', '#FF1493', '#FF0000', '#0000FF'][Math.floor(Math.random() * 8)],
    })),
  []);

  return (
    <>
      <style jsx>{`
        .countdown-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          pointer-events: none;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeInOut 3s ease-in-out forwards;
        }

        .countdown-number {
          font-size: 200px;
          font-weight: 900;
          color: white;
          text-shadow: 0 0 40px rgba(255, 255, 255, 0.8),
                       0 0 80px rgba(61, 108, 225, 0.6),
                       0 0 120px rgba(61, 108, 225, 0.4);
          animation: countdownPulse 1s ease-in-out;
        }

        .fireworks-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          pointer-events: none;
          animation: fadeOut 6s ease-out forwards;
        }

        .firework {
          position: absolute;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          opacity: 0;
          animation: launch 0.6s ease-out forwards;
        }

        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: burst 2.5s ease-out forwards;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -20px;
          animation: confettiFall linear forwards;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes countdownPulse {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        @keyframes launch {
          0% {
            opacity: 1;
            transform: translateY(100vh) scale(0.3);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes burst {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
            filter: brightness(2);
          }
          15% {
            opacity: 1;
            transform: translate(var(--tx), var(--ty)) scale(2);
            filter: brightness(3);
          }
          100% {
            opacity: 0;
            transform: translate(calc(var(--tx) * 2.5), calc(var(--ty) * 2.5)) scale(0.3);
            filter: brightness(1);
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0.3;
          }
        }

        @keyframes fadeOut {
          0%, 70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        /* Create particles around each firework - more spectacular spread */
        ${fireworks
          .map(
            (_, i) => `
          .firework-${i} .particle:nth-child(1) { --tx: -80px; --ty: -100px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(2) { --tx: 60px; --ty: -110px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(3) { --tx: 110px; --ty: -50px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(4) { --tx: 120px; --ty: 40px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(5) { --tx: 80px; --ty: 100px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(6) { --tx: -40px; --ty: 110px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(7) { --tx: -100px; --ty: 60px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(8) { --tx: -110px; --ty: -30px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(9) { --tx: -70px; --ty: -90px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(10) { --tx: 30px; --ty: -120px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(11) { --tx: 130px; --ty: 15px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(12) { --tx: 90px; --ty: 90px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(13) { --tx: 0px; --ty: -130px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(14) { --tx: 130px; --ty: 0px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(15) { --tx: 0px; --ty: 130px; animation-delay: ${0.6 + i * 0.2}s; }
          .firework-${i} .particle:nth-child(16) { --tx: -130px; --ty: 0px; animation-delay: ${0.6 + i * 0.2}s; }
        `
          )
          .join('\n')}
      `}</style>

      {/* Countdown Display */}
      {countdown > 0 && (
        <div className="countdown-overlay">
          <div className="countdown-number">{countdown}</div>
        </div>
      )}

      {/* Fireworks and Confetti */}
      {showFireworks && (
        <div className="fireworks-overlay">
          {/* Fireworks */}
          {fireworks.map((fw, i) => (
            <div
              key={i}
              className={`firework firework-${i}`}
              style={{
                left: `${fw.x}%`,
                top: `${fw.y}%`,
                animationDelay: `${fw.delay}s`,
              }}
            >
              {/* Create 16 particles per firework for more spectacular effect */}
              {[...Array(16)].map((_, p) => (
                <div
                  key={p}
                  className="particle"
                  style={{
                    backgroundColor: fw.color,
                    boxShadow: `0 0 30px ${fw.color}, 0 0 60px ${fw.color}, 0 0 90px ${fw.color}`,
                  }}
                />
              ))}
            </div>
          ))}

          {/* Confetti */}
          {confettiPieces.map((confetti) => (
            <div
              key={confetti.id}
              className="confetti"
              style={{
                left: `${confetti.left}%`,
                backgroundColor: confetti.color,
                animationDuration: `${confetti.duration}s`,
                animationDelay: `${confetti.delay}s`,
                transform: `rotate(${confetti.rotation}deg)`,
                boxShadow: `0 0 10px ${confetti.color}`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

