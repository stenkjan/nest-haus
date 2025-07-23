# SectionRouter System Documentation

A comprehensive section-based navigation system for React/Next.js applications with hash-based routing, intersection observer, and smooth scrolling.

## ✅ Implementation Status

**COMPLETED**: Section routing has been successfully implemented for:

- ✅ **Landing Page** (`/`): 8 sections with navigation (`#dein-nest-haus`, `#wohnen-ohne-grenzen`, etc.)
- ✅ **Kontakt Page** (`/kontakt`): 4 sections with navigation (`#termin`, `#standort`, `#grundstueck-check`, `#impressum`)

### Live URLs:

- Landing page with section routing: `http://localhost:3000/#dein-nest-haus`
- Kontakt page with section routing: `http://localhost:3000/kontakt#termin`

## Overview

The SectionRouter system provides:

- ✅ Hash-based URL navigation (`example.com/page#section-name`)
- ✅ Automatic section detection while scrolling
- ✅ Smooth scrolling between sections
- ✅ Mobile-responsive behavior
- ✅ SEO-friendly slugs
- ✅ TypeScript support

## Core Components

### 1. SectionRouter Component

**File:** `components/SectionRouter.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

interface Section {
  id: string;
  title: string;
  slug: string;
}

interface SectionRouterProps {
  sections: Section[];
  children: React.ReactNode;
  onSectionChange?: (sectionId: string) => void;
}

export const SectionRouter = ({
  sections,
  children,
  onSectionChange,
}: SectionRouterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [currentSection, setCurrentSection] = useState<string>(sections[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Handle hash changes and scroll to section
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const section = sections.find((s) => s.slug === hash);
        if (section && sectionRefs.current[section.id]) {
          sectionRefs.current[section.id]?.scrollIntoView({
            behavior: "smooth",
          });
          setCurrentSection(section.id);
          onSectionChange?.(section.id);
        }
      }
    };

    // Initial hash check
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [sections, onSectionChange]);

  // Set up intersection observer for scroll-based hash updates
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("data-section-id");
            if (sectionId) {
              const section = sections.find((s) => s.id === sectionId);
              if (section) {
                // Update URL hash without triggering scroll
                const newHash = `#${section.slug}`;
                if (window.location.hash !== newHash) {
                  window.history.replaceState(null, "", newHash);
                  setCurrentSection(sectionId);
                  onSectionChange?.(sectionId);
                }
              }
            }
          }
        });
      },
      {
        threshold: 0.5, // Section is considered visible when 50% is in view
        rootMargin: "-10% 0px -10% 0px", // Add some margin to prevent too frequent updates
      }
    );

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) {
        observerRef.current?.observe(ref);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sections, onSectionChange]);

  // Add refs to sections
  const setSectionRef = (id: string, element: HTMLDivElement | null) => {
    sectionRefs.current[id] = element;
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement<{ id?: string }>(child)) {
          const sectionId = child.props.id;
          if (!sectionId) return child;

          const section = sections.find((s) => s.id === sectionId);
          if (section) {
            return React.cloneElement(child, {
              ref: (el: HTMLDivElement) => setSectionRef(sectionId, el),
              id: section.slug,
              "data-section-id": sectionId,
            } as any);
          }
        }
        return child;
      })}
    </div>
  );
};

export default SectionRouter;
```

### 2. SectionNavigation Component (Optional)

**File:** `components/SectionNavigation.tsx`

```tsx
"use client";

import { useRouter, usePathname } from "next/navigation";

interface Section {
  id: string;
  title: string;
  slug: string;
}

interface SectionNavigationProps {
  sections: Section[];
  currentSectionId: string;
}

export const SectionNavigation = ({
  sections,
  currentSectionId,
}: SectionNavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const currentIndex = sections.findIndex(
    (section) => section.id === currentSectionId
  );
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < sections.length - 1;

  const navigateToSection = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      // Use window.location.hash for immediate URL update
      window.location.hash = section.slug;
      // Then update the router state
      router.push(`${pathname}#${section.slug}`, { scroll: false });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      {hasPrevious && (
        <button
          onClick={() => navigateToSection(sections[currentIndex - 1].id)}
          className="bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg transition-all duration-200"
          aria-label="Previous section"
        >
          ←
        </button>
      )}
      {hasNext && (
        <button
          onClick={() => navigateToSection(sections[currentIndex + 1].id)}
          className="bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg transition-all duration-200"
          aria-label="Next section"
        >
          →
        </button>
      )}
    </div>
  );
};

export default SectionNavigation;
```

### 3. Device Detection Hook

**File:** `hooks/useDeviceDetect.ts`

```tsx
"use client";

import { useState, useEffect } from "react";

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
}

export function useDeviceDetect(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: typeof window !== "undefined" ? window.innerWidth : 1024,
  });

  useEffect(() => {
    function detectDevice() {
      // Get viewport width
      const width = window.innerWidth;

      // Check for mobile device signals
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice =
        /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );
      const isTabletDevice = /ipad|tablet/i.test(userAgent);

      // Check for touch capabilities
      const hasTouchScreen =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0 ||
        ("matchMedia" in window &&
          window.matchMedia("(pointer: coarse)").matches);

      // Check for orientation API (mobile/tablet specific)
      const hasOrientationAPI =
        typeof window.orientation !== "undefined" ||
        "orientation" in window ||
        navigator.userAgent.indexOf("Mobile") !== -1;

      // Determine device type using multiple signals
      const isMobile =
        (width < 768 &&
          (isMobileDevice || (hasTouchScreen && hasOrientationAPI))) ||
        (isMobileDevice && hasTouchScreen);

      const isTablet =
        (width >= 768 && width < 1024 && (isTabletDevice || hasTouchScreen)) ||
        (isTabletDevice && hasTouchScreen);

      const isDesktop = !isMobile && !isTablet;

      return {
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
      };
    }

    // Initial detection
    setDeviceInfo(detectDevice());

    // Set up listeners for changes
    const handleResize = () => {
      setDeviceInfo(detectDevice());
    };

    const handleOrientationChange = () => {
      // Force mobile detection on orientation change
      const width = window.innerWidth;
      setDeviceInfo((prev) => ({
        ...prev,
        isMobile: true,
        isTablet: width >= 768 && width < 1024,
        isDesktop: false,
        screenWidth: width,
      }));
    };

    // Add event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return deviceInfo;
}
```

## Required CSS

Add to your global CSS file:

```css
/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}

/* Ensure proper scrolling behavior */
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

html {
  overflow-y: auto !important;
}

body {
  min-height: 100vh;
  overflow-y: visible !important;
  position: relative;
}
```

## Basic Usage Example

```tsx
"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";

const sections = [
  { id: "hero", title: "Welcome", slug: "welcome" },
  { id: "about", title: "About Us", slug: "about-us" },
  { id: "services", title: "Our Services", slug: "services" },
  { id: "contact", title: "Contact", slug: "contact" },
];

export default function MyPage() {
  const [currentSectionId, setCurrentSectionId] = useState("hero");
  const { isMobile } = useDeviceDetect();

  return (
    <div className="min-h-screen">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        {/* Each section needs an id that matches the section.id */}
        <section
          id="hero"
          className="min-h-screen bg-blue-500 flex items-center justify-center"
        >
          <h1 className="text-4xl text-white">Welcome Section</h1>
        </section>

        <section
          id="about"
          className="min-h-screen bg-green-500 flex items-center justify-center"
        >
          <h1 className="text-4xl text-white">About Section</h1>
        </section>

        <section
          id="services"
          className="min-h-screen bg-red-500 flex items-center justify-center"
        >
          <h1 className="text-4xl text-white">Services Section</h1>
        </section>

        <section
          id="contact"
          className="min-h-screen bg-purple-500 flex items-center justify-center"
        >
          <h1 className="text-4xl text-white">Contact Section</h1>
        </section>
      </SectionRouter>
    </div>
  );
}
```

## Advanced Usage with Navigation

```tsx
"use client";

import React, { useState } from "react";
import { SectionRouter } from "@/components/SectionRouter";
import { SectionNavigation } from "@/components/SectionNavigation";

const sections = [
  { id: "hero", title: "Hero", slug: "hero" },
  { id: "features", title: "Features", slug: "features" },
  { id: "testimonials", title: "Testimonials", slug: "testimonials" },
  { id: "pricing", title: "Pricing", slug: "pricing" },
];

export default function LandingPage() {
  const [currentSectionId, setCurrentSectionId] = useState("hero");

  return (
    <div className="relative">
      <SectionRouter sections={sections} onSectionChange={setCurrentSectionId}>
        <section id="hero" className="min-h-screen">
          {/* Hero content */}
        </section>

        <section id="features" className="min-h-screen">
          {/* Features content */}
        </section>

        <section id="testimonials" className="min-h-screen">
          {/* Testimonials content */}
        </section>

        <section id="pricing" className="min-h-screen">
          {/* Pricing content */}
        </section>
      </SectionRouter>

      {/* Optional navigation buttons */}
      <SectionNavigation
        sections={sections}
        currentSectionId={currentSectionId}
      />
    </div>
  );
}
```

## Navigation Menu Integration

Create navigation links that work with the SectionRouter:

```tsx
const NavigationMenu = ({ sections, currentSectionId }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-6 py-4">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.slug}`}
                className={`px-3 py-2 rounded-md transition-colors ${
                  currentSectionId === section.id
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:text-blue-500"
                }`}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
```

## TypeScript Interfaces

```tsx
interface Section {
  id: string; // Internal identifier
  title: string; // Display name
  slug: string; // URL-friendly version
}

interface SectionRouterProps {
  sections: Section[];
  children: React.ReactNode;
  onSectionChange?: (sectionId: string) => void;
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
}
```

## Installation Dependencies

For Next.js projects, you'll need:

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Key Features

### 1. **Hash-based Navigation**

- URLs automatically update with section slugs
- Direct linking to sections works
- Browser back/forward buttons work correctly

### 2. **Intersection Observer**

- Automatically detects which section is visible
- Updates URL without triggering scroll
- Configurable threshold and margins

### 3. **Smooth Scrolling**

- CSS `scroll-behavior: smooth`
- JavaScript `scrollIntoView({ behavior: 'smooth' })`

### 4. **Mobile Responsive**

- Device detection with `useDeviceDetect`
- Orientation change handling
- Touch-friendly navigation

### 5. **SEO Friendly**

- Semantic section structure
- Meaningful URLs with slugs
- Proper heading hierarchy support

## Configuration Options

### Intersection Observer Settings

```tsx
// In SectionRouter component
{
  threshold: 0.5, // 50% of section must be visible
  rootMargin: '-10% 0px -10% 0px' // Margin before triggering
}
```

### Device Detection Breakpoints

```tsx
// Customize in useDeviceDetect hook
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;
```

## Troubleshooting

### Common Issues

1. **Sections not detected**: Ensure each section has an `id` prop that matches the section definition
2. **Smooth scrolling not working**: Check that CSS `scroll-behavior: smooth` is applied to `html`
3. **Hash not updating**: Verify intersection observer is properly initialized
4. **Mobile issues**: Test device detection with various user agents

### Debug Tips

```tsx
// Add to SectionRouter for debugging
console.log("Current section:", currentSection);
console.log("Available sections:", sections);
console.log("Hash:", window.location.hash);
```

## License

This implementation is based on modern React patterns and can be freely used in your projects.
