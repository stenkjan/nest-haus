// Lightweight motion wrapper to reduce bundle size
// Only import specific motion components instead of entire library

import React from "react";

// Pre-configured motion components for common use cases
export const MotionDiv = () => import("motion/react").then(m => m.motion.div);
export const MotionSection = () => import("motion/react").then(m => m.motion.section);
export const MotionButton = () => import("motion/react").then(m => m.motion.button);

// Fallback for when motion is not needed
export const StaticDiv = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>;
export const StaticSection = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => <section {...props}>{children}</section>;
export const StaticButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>;

// Conditional motion loading based on user preference or device
export const useMotionPreference = () => {
    if (typeof window === 'undefined') return false;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check device capabilities (mobile might not need heavy animations)
    const isMobile = window.innerWidth < 768;

    return !prefersReducedMotion && !isMobile;
};