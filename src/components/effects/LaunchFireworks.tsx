"use client";

import { useEffect } from 'react';

interface LaunchFireworksProps {
  onComplete?: () => void;
}

export default function LaunchFireworks({ onComplete }: LaunchFireworksProps) {
  useEffect(() => {
    // Auto-cleanup after 5.5 seconds
    const timeout = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 5500);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  // Generate random firework positions
  const fireworks = [
    { x: 20, y: 30, delay: 0, color: '#FFD700' }, // Gold
    { x: 80, y: 25, delay: 0.3, color: '#00FFFF' }, // Cyan
    { x: 50, y: 40, delay: 0.6, color: '#FF00FF' }, // Magenta
    { x: 35, y: 20, delay: 0.9, color: '#00FF00' }, // Lime
    { x: 65, y: 35, delay: 1.2, color: '#FF6B00' }, // Orange
    { x: 45, y: 15, delay: 1.5, color: '#FF1493' }, // Hot Pink
    { x: 75, y: 45, delay: 1.8, color: '#FFD700' }, // Gold
    { x: 25, y: 50, delay: 2.1, color: '#00FFFF' }, // Cyan
  ];

  return (
    <>
      <style jsx>{`
        .fireworks-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          pointer-events: none;
          animation: fadeOut 5.5s ease-out forwards;
        }

        .firework {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          opacity: 0;
          animation: launch 0.8s ease-out forwards;
        }

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: burst 2s ease-out forwards;
        }

        @keyframes launch {
          0% {
            opacity: 1;
            transform: translateY(100vh) scale(0.5);
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
          }
          20% {
            opacity: 1;
            transform: translate(var(--tx), var(--ty)) scale(1.5);
          }
          100% {
            opacity: 0;
            transform: translate(calc(var(--tx) * 2), calc(var(--ty) * 2)) scale(0.5);
          }
        }

        @keyframes fadeOut {
          0%, 80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        /* Create particles around each firework */
        ${fireworks
          .map(
            (_, i) => `
          .firework-${i} .particle:nth-child(1) { --tx: -60px; --ty: -80px; animation-delay: ${0.8 + i * 0.3}s; }
          .firework-${i} .particle:nth-child(2) { --tx: 40px; --ty: -90px; animation-delay: ${0.8 + i * 0.3}s; }
          .firework-${i} .particle:nth-child(3) { --tx: 80px; --ty: -40px; animation-delay: ${0.8 + i * 0.3}s; }
          .firework-${i} .particle:nth-child(4) { --tx: 90px; --ty: 30px; animation-delay: ${0.8 + i * 0.3}s; }
          .firework-${i} .particle:nth-child(5) { --tx: 60px; --ty: 80px; animation-delay: ${0.8 + i * 0.3}s; }
          .firework-${i} .particle:nth-child(6) { --tx: -30px; --ty: 90px; animation-delay: ${0.8 + i * 0.3}s; }
          .firework-${i} .particle:nth-child(7) { --tx: -80px; --ty: 50px; animation-delay: ${0.8 + i * 0.3}s; }
          .firework-${i} .particle:nth-child(8) { --tx: -90px; --ty: -20px; animation-delay: ${0.8 + i * 0.3}s; }
          .firework-${i} .particle:nth-child(9) { --tx: -50px; --ty: -70px; animation-delay: ${0.8 + i * 0.3}s; }
          .firework-${i} .particle:nth-child(10) { --tx: 20px; --ty: -100px; animation-delay: ${0.8 + i * 0.3}s; }
          .firework-${i} .particle:nth-child(11) { --tx: 100px; --ty: 10px; animation-delay: ${0.8 + i * 0.3}s; }
          .firework-${i} .particle:nth-child(12) { --tx: 70px; --ty: 70px; animation-delay: ${0.8 + i * 0.3}s; }
        `
          )
          .join('\n')}
      `}</style>

      <div className="fireworks-overlay">
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
            {/* Create 12 particles per firework */}
            {[...Array(12)].map((_, p) => (
              <div
                key={p}
                className="particle"
                style={{
                  backgroundColor: fw.color,
                  boxShadow: `0 0 20px ${fw.color}, 0 0 40px ${fw.color}, 0 0 60px ${fw.color}`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

