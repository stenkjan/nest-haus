// Shared types for content pages
export interface SectionDefinition {
    id: string;
    title: string;
    slug: string;
}

export interface PageMetadata {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    ogImage?: string;
    twitterImage?: string;
}

export interface StructuredDataSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  [key: string]: unknown;
}

export interface ContentPageProps {
    sections: SectionDefinition[];
    metadata?: PageMetadata;
    trackingEnabled?: boolean;
}

// Performance optimization types
export interface ImagePreloadConfig {
    sectionId: string;
    imagePaths: string[];
    priority?: boolean;
}

// Analytics types for content tracking
export interface ContentAnalytics {
    pageType: "content" | "landing" | "product";
    sectionViews: Record<string, number>;
    buttonClicks: Record<string, number>;
    scrollDepth: number;
    timeSpent: number;
} 