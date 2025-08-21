# Partners Section - Code Extraction

## 🎯 Main Component: PartnersSection.tsx

```tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ClientBlobImage } from "@/components/client/ClientBlobImage";
import Link from "next/link";
import { IMAGES } from "../../../constants/images";

interface PartnersSectionProps {
  className?: string;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({
  className,
}) => {
  const partners = [
    {
      id: "tu-graz",
      name: "TU Graz",
      path: IMAGES.partners.partner1,
    },
    {
      id: "engelsmann-peters",
      name: "Engelsmann Peters",
      path: IMAGES.partners.partner2,
    },
    {
      id: "tu-iam",
      name: "TU-IAM",
      path: IMAGES.partners.partner3,
    },
    {
      id: "tu-bauphysik",
      name: "Tu-Bauphysik",
      path: IMAGES.partners.partner4,
    },
    {
      id: "schwarz",
      name: "Schwarz",
      path: IMAGES.partners.partner5,
    },
  ];

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-5xl font-sans mb-4">
            Gemeinsam mit starken Partnern.
          </h2>
          <p className="text-gray-600 mb-8 text-xl">
            Wir setzen auf ein Netzwerk aus erfahrenen Experten
          </p>

          <div className="flex justify-center items-center gap-4 md:gap-8 lg:gap-12 mb-12 px-4 mx-auto w-full">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex-1 flex flex-col items-center justify-center aspect-[2/1]"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <ClientBlobImage
                    path={`images/${partner.path}`}
                    alt={partner.name}
                    width={240}
                    height={120}
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    fallbackSrc={`/api/placeholder/240/120?text=${partner.name}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              asChild
              className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full"
            >
              <Link href="/warum-nest">Warum Nest?</Link>
            </Button>
            <Button
              asChild
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-full border border-blue-600 transition duration-300"
            >
              <Link href="/konfigurator">Jetzt bauen</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
```

## 🧩 Dependencies

### 1. ClientBlobImage Component

**File:** `src/app/components/client/ClientBlobImage.tsx`

```tsx
"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { getMobilePath } from "../../../lib/image-utils";
import { toFilesystemPath } from "../../../lib/image-name-mapper";

// Add type declaration for deviceMemory
declare global {
  interface Navigator {
    deviceMemory?: number;
  }
}

export interface ClientBlobImageProps
  extends Omit<ImageProps, "src" | "onLoad" | "onError"> {
  path: string;
  fallbackSrc?: string;
  mobilePath?: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (error: Error) => void;
  strict?: boolean;
  quality?: number;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  disableMobilePath?: boolean;
}

export const ClientBlobImage: React.FC<ClientBlobImageProps> = ({
  path,
  fallbackSrc = "/api/placeholder/400/300",
  mobilePath,
  alt,
  width,
  height,
  onLoad,
  onError,
  strict = true,
  className = "",
  quality = 85,
  sizes = "100vw",
  priority = false,
  fill,
  disableMobilePath = false,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  // Add default general fallback images for different types
  const GLOBAL_FALLBACKS = {
    exterior: "/assets/fallbacks/exterior-default.jpg",
    interior: "/assets/fallbacks/interior-default.jpg",
    stirnseite: "/assets/fallbacks/stirnseite-default.jpg",
    holzlattung: "/assets/fallbacks/holzlattung-default.jpg",
    trapezblech: "/assets/fallbacks/trapezblech-default.jpg",
    plattenschwarz: "/assets/fallbacks/exterior-default.jpg",
    plattenweiss: "/assets/fallbacks/exterior-default.jpg",
    holznatur: "/assets/fallbacks/interior-default.jpg",
    holzweiss: "/assets/fallbacks/interior-default.jpg",
    eiche: "/assets/fallbacks/interior-default.jpg",
    default: fallbackSrc,
  };

  // Try to determine image type from path to use appropriate fallback
  const getTypedFallback = (imagePath: string): string => {
    if (!imagePath) return GLOBAL_FALLBACKS.default;

    // Material/exterior type detection
    if (imagePath.includes("trapezblech")) {
      return GLOBAL_FALLBACKS.trapezblech;
    }

    if (imagePath.includes("holzlattung")) {
      return GLOBAL_FALLBACKS.holzlattung;
    }

    if (imagePath.includes("plattenschwarz")) {
      return GLOBAL_FALLBACKS.plattenschwarz;
    }

    if (imagePath.includes("plattenweiss")) {
      return GLOBAL_FALLBACKS.plattenweiss;
    }

    // Interior materials
    if (imagePath.includes("holznatur")) {
      return GLOBAL_FALLBACKS.holznatur;
    }

    if (imagePath.includes("holzweiss")) {
      return GLOBAL_FALLBACKS.holzweiss;
    }

    if (imagePath.includes("eiche")) {
      return GLOBAL_FALLBACKS.eiche;
    }

    // View type detection
    if (
      imagePath.includes("interior") ||
      imagePath.includes("kalkstein") ||
      imagePath.includes("parkett") ||
      imagePath.includes("granit")
    ) {
      return GLOBAL_FALLBACKS.interior;
    }

    if (imagePath.includes("stirnseite")) {
      return GLOBAL_FALLBACKS.stirnseite;
    }

    // Default to exterior fallback for other cases
    return GLOBAL_FALLBACKS.exterior;
  };

  // Mobile detection with reduced logging
  useEffect(() => {
    let isMounted = true;

    function detectMobile() {
      // Check if we're on a real mobile device
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(
          userAgent
        );

      // Mobile media query for responsive design detection
      const mobileMediaQuery = window.matchMedia("(max-width: 768px)");

      // Check for touch capabilities (strong signal of mobile)
      const hasTouchScreen =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0 ||
        ("matchMedia" in window &&
          window.matchMedia("(pointer: coarse)").matches);

      // Check viewport width
      const isSmallViewport = window.innerWidth < 768;

      // Check orientation API (only available on mobile)
      const hasOrientationAPI =
        typeof window.orientation !== "undefined" ||
        "orientation" in window ||
        navigator.userAgent.indexOf("Mobile") !== -1;

      // Check for device memory limitations
      const hasLimitedMemory =
        navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;

      // Combine mobile features into a single flag
      const hasMobileFeatures =
        hasTouchScreen ||
        hasOrientationAPI ||
        isSmallViewport ||
        hasLimitedMemory;

      // Use a combination of signals, with priority on hardware indicators
      return (
        (isMobileDevice && (hasTouchScreen || hasOrientationAPI)) ||
        (hasTouchScreen && hasOrientationAPI) ||
        (isMobileDevice && hasMobileFeatures && isSmallViewport)
      );
    }

    // Initial detection
    const initialMobileStatus = detectMobile();
    if (isMounted) {
      setIsMobile(initialMobileStatus);
    }

    // Set up orientation change listener (only triggers on real mobile devices)
    const handleOrientationChange = () => {
      if (isMounted) {
        setIsMobile(true);
      }
    };

    // Set up resize listener with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isMounted) {
          const newMobileStatus = detectMobile();
          setIsMobile(newMobileStatus);
        }
      }, 200); // Debounce resize events
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      clearTimeout(resizeTimeout);
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array since we only want to set up listeners once

  // Image loading logic
  useEffect(() => {
    const fetchImage = async () => {
      // Basic validation - if no path, use fallback
      if (!path || path === "undefined" || path === "{}" || path === "null") {
        console.warn("Invalid image path provided:", path);
        setImageSrc(fallbackSrc);
        setLoading(false);
        setError(false);
        return;
      }

      // Safety check - if path is empty or invalid, use typed fallback
      if (
        !path ||
        path === undefined ||
        path === "undefined" ||
        path === "{}" ||
        path === "null" ||
        path === "undefined_undefined" ||
        path.includes("_undefined_")
      ) {
        console.warn("Invalid image path provided:", path);
        setImageSrc(getTypedFallback(path));
        setLoading(false);
        setError(false);
        return;
      }

      if (retryCount > MAX_RETRIES) {
        console.warn("Max retries reached for path:", path);
        setImageSrc(getTypedFallback(path));
        setLoading(false);
        setError(false);
        return;
      }

      // Standard image loading for all path types
      try {
        setLoading(true);

        // Determine which path to use based on mobile status and disableMobilePath prop
        let imagePath = path;
        const shouldUseMobile =
          !disableMobilePath && (isMobile || window.innerWidth < 768);

        if (shouldUseMobile) {
          imagePath = mobilePath || getMobilePath(path);
        }

        // Normalize path by removing any existing extension
        const basePath = imagePath.replace(/\.(jpg|jpeg|png|mp4)$/i, "");

        // Get the base URL for API calls
        const baseUrl =
          typeof window === "undefined"
            ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
            : window.location.origin;

        // Try each extension separately with debug mode for more information
        let response = null;
        let successfulPath = "";
        const extensions = [".jpg", ".jpeg", ".png"];

        for (const ext of extensions) {
          const pathWithExt = `${basePath}${ext}`;
          // Enable debug for trapezblech paths to understand why they're failing
          const isDebug = path.includes("trapezblech") || retryCount > 0;
          try {
            response = await fetch(
              `${baseUrl}/api/images?path=${encodeURIComponent(
                pathWithExt
              )}&strict=${strict}&debug=${isDebug}`
            );

            if (response.ok) {
              successfulPath = pathWithExt;
              break;
            } else if (isDebug) {
              // Log response for debugging
              const respData = await response.clone().json();
              console.debug(`Debug - Failed to load ${pathWithExt}:`, respData);
            }
          } catch (fetchError) {
            console.error(`Error fetching ${pathWithExt}:`, fetchError);
          }
        }

        // If not found, try mp4 as last resort
        if (!response?.ok) {
          const mp4Path = `${basePath}.mp4`;
          response = await fetch(
            `${baseUrl}/api/images?path=${encodeURIComponent(
              mp4Path
            )}&strict=${strict}&debug=false`
          );
          if (response.ok) successfulPath = mp4Path;
        }

        if (!response?.ok) {
          // Try with the exact path as a last resort (no extension added)
          response = await fetch(
            `${baseUrl}/api/images?path=${encodeURIComponent(
              imagePath
            )}&strict=${strict}&debug=true`
          );
          if (response.ok) successfulPath = imagePath;
        }

        if (!response?.ok) {
          throw new Error("Image not found");
        }

        const data = await response.json();

        if (!data.url) {
          console.error(`No image URL returned for path: ${basePath}`, data);
          throw new Error(`No image URL returned for path: ${basePath}`);
        }

        // Log successful image loading for debugging
        if (path.includes("trapezblech")) {
          console.debug(
            `Successfully loaded image: ${successfulPath} -> ${data.url}`
          );
        }

        setImageSrc(data.url);
        setError(false);

        if (onLoad) onLoad({} as React.SyntheticEvent<HTMLImageElement>);
      } catch (error) {
        console.error(`Error loading image: ${path}`, error);
        setError(true);

        // Add immediate retry logic for trapezblech images
        if (path.includes("trapezblech") && retryCount < MAX_RETRIES) {
          console.log(
            `Retrying trapezblech image: ${path}, attempt ${retryCount + 1}`
          );
          setRetryCount((prev) => prev + 1);
          return; // Will trigger another fetch due to retryCount changing
        }

        // Set fallback after max retries
        setImageSrc(getTypedFallback(path));

        if (onError && error instanceof Error) onError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [
    path,
    mobilePath,
    isMobile,
    strict,
    onLoad,
    onError,
    retryCount,
    disableMobilePath,
  ]);

  // Image error handling
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.error("Error loading image on client:", path);
    setError(true);

    // Use typed fallback on image load error
    setImageSrc(getTypedFallback(path));

    if (onError) onError(new Error(`Failed to load image: ${path}`));
  };

  return (
    <div className="relative w-full h-full">
      <Image
        src={imageSrc}
        alt={alt || "Image"}
        width={width}
        height={height}
        fill={fill}
        quality={quality}
        sizes={sizes}
        priority={priority}
        {...props}
        className={`${className} ${fill ? "object-cover" : "object-contain"}`}
        style={{
          ...props.style,
          opacity: loading ? 0.7 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
        onError={handleImageError}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};
```

### 2. Button Component

**File:** `src/app/components/ui/button.tsx`

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#3D6CE1] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-[#3D6CE1] text-white hover:bg-[#3560d0]",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-[#3D6CE1] text-[#3D6CE1] hover:bg-[#3D6CE1]/10",
        "outline-no-hover": "border border-[#3D6CE1] text-[#3D6CE1]",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "underline-offset-4 hover:underline text-[#3D6CE1] hover:text-[#3560d0]",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### 3. Image Constants

**File:** `src/constants/images.ts` (Partner section only)

```tsx
export const IMAGES = {
  // Partner logos
  partners: {
    partner1:
      "60-NEST-Haus-Partner-Kooperation-Technische-Universitaet-Graz-TU-Graz",
    partner2:
      "61-NEST-Haus-Partner-Kooperation-Engelsmann-Peters-Professor-TU-Graz-Stefan-Peters",
    partner3:
      "62-NEST-Haus-Partner-Kooperation-Technische-Universitaet-Graz-TU-Graz-IAM-Institut",
    partner4:
      "63-NEST-Haus-Partner-Kooperation-Technische-Universitaet-Graz-TU-Graz-Labor-Bauphysik",
    partner5: "64-NEST-Haus-Partner-Kooperation-Schwarz-Partner-Patentanwaelte",
    partner6:
      "65-NEST-Haus-Partner-Kooperation-Sobitsch-Zimmerer-Zimmerermeisterbetrieb-Holzbaumeister-Innenausbau",
  },
} as const;
```

### 4. Utility Functions

**File:** `src/lib/image-utils.ts`

```tsx
export function getMobilePath(path: string): string {
  if (!path) return path;

  // Check if path already has a -mobile suffix
  if (path.includes("-mobile")) return path;

  // Remove any existing extension
  const basePath = path.replace(/\.(jpg|jpeg|png|mp4)$/i, "");

  // For mobile images, we always use .png extension
  return `${basePath}-mobile.png`;
}
```

**File:** `src/lib/image-name-mapper.ts`

```tsx
export function toFilesystemPath(seoPath: string): string {
  // Your existing mapping logic here
  return seoPath;
}
```

**File:** `src/lib/utils.ts`

```tsx
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 📋 Required Dependencies

```json
{
  "@radix-ui/react-slot": "^1.0.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "next": "^14.0.0",
  "react": "^18.0.0"
}
```

## 🚀 Usage

```tsx
import { PartnersSection } from "@/components/custom/PartnersSection";

// In your page component
<PartnersSection className="my-custom-class" />;
```

That's it! Copy these files to your new identical app and it should work exactly the same.
