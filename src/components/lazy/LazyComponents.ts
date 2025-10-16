import { lazy } from "react";

// Lazy load heavy components to reduce initial bundle size
export const LazyConfiguratorShell = lazy(
    () => import("@/app/konfigurator/components/ConfiguratorShell")
);

export const LazyPreviewPanel = lazy(
    () => import("@/app/konfigurator/components/PreviewPanel")
);

export const LazySummaryPanel = lazy(
    () => import("@/app/konfigurator/components/SummaryPanel")
);

// Lazy load grid components with motion
export const LazyFullWidthImageGrid = lazy(
    () => import("@/components/grids/FullWidthImageGrid")
);

export const LazyFullWidthVideoGrid = lazy(
    () => import("@/components/grids/FullWidthVideoGrid")
);

export const LazyTwoByTwoImageGrid = lazy(
    () => import("@/components/grids/TwoByTwoImageGrid")
);

// Lazy load dialog components
export const LazyCalendarDialog = lazy(
    () => import("@/components/dialogs/CalendarDialog")
);

export const LazyGrundstueckCheckDialog = lazy(
    () => import("@/components/dialogs/GrundstueckCheckDialog")
);
