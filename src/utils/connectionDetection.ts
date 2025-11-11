/**
 * Connection Detection Utilities
 * 
 * Provides network-aware optimizations for better mobile performance
 */

// Type definitions for Network Information API
interface NetworkConnection {
    effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
    downlink?: number;
    rtt?: number;
    addEventListener?: (type: string, listener: () => void) => void;
    removeEventListener?: (type: string, listener: () => void) => void;
}

interface NavigatorWithConnection extends Navigator {
    connection?: NetworkConnection;
    mozConnection?: NetworkConnection;
    webkitConnection?: NetworkConnection;
}

export interface ConnectionInfo {
    isSlowConnection: boolean;
    effectiveType: string;
    downlink?: number;
    rtt?: number;
    isMobile: boolean;
}

/**
 * Detect if user is on a slow connection
 */
export function getConnectionInfo(): ConnectionInfo {
    // Default to safe assumption
    let connectionInfo: ConnectionInfo = {
        isSlowConnection: true, // Conservative default
        effectiveType: 'unknown',
        isMobile: false
    };

    // Check if we're in browser environment
    if (typeof window === 'undefined') {
        return connectionInfo;
    }

    // Detect mobile device
    // BALANCED APPROACH: Allow both laptop testing (>= 1024px) and mobile testing (< 768px)
    const width = window.innerWidth;
    
    // Large viewports (>= 1024px) are always desktop
    if (width >= 1024) {
        connectionInfo = {
            isSlowConnection: false,
            effectiveType: 'desktop',
            isMobile: false
        };
    } 
    // Small viewports (< 768px) are always mobile (for DevTools testing and real devices)
    else if (width < 768) {
        connectionInfo = {
            isSlowConnection: true,
            effectiveType: 'mobile-fallback',
            isMobile: true
        };
    }
    // Medium range (768-1023px): Check device signals
    else {
        const userAgent = navigator.userAgent || '';
        const isMobileUserAgent = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTabletUserAgent = /iPad|tablet/i.test(userAgent);
        
        // Check for touch capabilities
        const hasTouchScreen =
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
        
        // Tablet range: only mobile if it's a real tablet
        const isMobile = (isTabletUserAgent || isMobileUserAgent) && hasTouchScreen;
        
        connectionInfo = {
            isSlowConnection: isMobile,
            effectiveType: isMobile ? 'mobile-fallback' : 'desktop-fallback',
            isMobile
        };
    }

    // Network Information API (limited browser support)
    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    if (connection) {
        const slowTypes: Array<NetworkConnection['effectiveType']> = ['slow-2g', '2g'];
        const isSlowConnection = slowTypes.includes(connection.effectiveType);

        connectionInfo = {
            isSlowConnection,
            effectiveType: connection.effectiveType || 'unknown',
            downlink: connection.downlink,
            rtt: connection.rtt,
            isMobile
        };
    } else {
        // Fallback: assume mobile devices have slower connections
        connectionInfo = {
            isSlowConnection: isMobile,
            effectiveType: isMobile ? 'mobile-fallback' : 'desktop-fallback',
            isMobile
        };
    }

    return connectionInfo;
}

/**
 * Should we limit preloading based on connection?
 */
export function shouldLimitPreloading(): boolean {
    const { isSlowConnection, isMobile } = getConnectionInfo();
    return isSlowConnection || isMobile;
}

/**
 * Get optimal preload count based on connection
 */
export function getOptimalPreloadCount(): number {
    const { isSlowConnection, isMobile, effectiveType } = getConnectionInfo();

    if (isSlowConnection || effectiveType === 'slow-2g' || effectiveType === '2g') {
        return 1; // Only preload next image
    }

    if (isMobile || effectiveType === '3g') {
        return 2; // Preload 2 images
    }

    return 4; // Desktop with good connection can preload more
}

/**
 * Get preload delay based on connection (to avoid bandwidth competition)
 */
export function getPreloadDelay(): number {
    const { isSlowConnection, isMobile } = getConnectionInfo();

    if (isSlowConnection) {
        return 800; // Longer delay for slow connections
    }

    if (isMobile) {
        return 400; // Medium delay for mobile
    }

    return 100; // Fast delay for desktop
}
