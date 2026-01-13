/**
 * Scroll Depth and Time on Page Tracking Hook
 * 
 * Tracks user engagement metrics:
 * - Scroll depth milestones (25%, 50%, 75%, 100%)
 * - Time spent on page
 * 
 * Usage: Call in page component
 */

import { useEffect } from 'react';
import { trackScrollDepth, trackTimeOnPage } from '@/lib/analytics/enhanced-tracking';

export function useScrollTracking(pagePath?: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const path = pagePath || window.location.pathname;
    const startTime = Date.now();
    const tracked = { '25': false, '50': false, '75': false, '100': false };

    // Scroll depth tracking handler
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;

      (['25', '50', '75', '100'] as const).forEach(threshold => {
        const thresholdNum = parseInt(threshold);
        if (scrollPercent >= thresholdNum && !tracked[threshold]) {
          trackScrollDepth(thresholdNum as 25 | 50 | 75 | 100);
          tracked[threshold] = true;
        }
      });
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup on unmount - track time on page
    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      const duration = Math.floor((Date.now() - startTime) / 1000);
      if (duration > 10) { // Only track if > 10 seconds
        const category =
          duration < 60 ? '<1min' :
          duration < 300 ? '1-5min' :
          duration < 600 ? '5-10min' : '>10min';

        trackTimeOnPage({
          pagePath: path,
          durationSeconds: duration,
          durationCategory: category,
        });
      }
    };
  }, [pagePath]);
}
