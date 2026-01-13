/**
 * A/B Testing Infrastructure
 * 
 * Client-side variant assignment and tracking for conversion optimization
 * 
 * Features:
 * - Variant assignment based on user ID
 * - Persistent variant across sessions
 * - Event tracking integration
 * - Admin dashboard for results analysis
 */

import { trackCustomEvent } from '../ga4-tracking';

export interface Experiment {
  id: string;
  name: string;
  variants: Variant[];
  status: 'active' | 'paused' | 'completed';
  targetMetric: 'conversion_rate' | 'click_through_rate' | 'form_completion';
}

export interface Variant {
  id: string;
  name: string;
  weight: number; // 0-100, sum of all weights should be 100
}

// Active experiments configuration
const EXPERIMENTS: Record<string, Experiment> = {
  cta_button_text: {
    id: 'cta_button_text',
    name: 'CTA Button Text Optimization',
    variants: [
      { id: 'control', name: 'Jetzt konfigurieren', weight: 50 },
      { id: 'variant_a', name: 'Traumhaus gestalten', weight: 25 },
      { id: 'variant_b', name: 'Jetzt starten', weight: 25 },
    ],
    status: 'active',
    targetMetric: 'click_through_rate',
  },
  pricing_display: {
    id: 'pricing_display',
    name: 'Pricing Display Format',
    variants: [
      { id: 'control', name: 'Standard Format', weight: 50 },
      { id: 'variant_a', name: 'With €/m² Display', weight: 50 },
    ],
    status: 'active',
    targetMetric: 'conversion_rate',
  },
  form_layout: {
    id: 'form_layout',
    name: 'Appointment Form Layout',
    variants: [
      { id: 'control', name: 'Two Column Layout', weight: 50 },
      { id: 'variant_a', name: 'Single Column Layout', weight: 50 },
    ],
    status: 'active',
    targetMetric: 'form_completion',
  },
};

/**
 * Get or assign variant for a user
 */
export function getVariant(experimentId: string): string {
  if (typeof window === 'undefined') return 'control';

  const experiment = EXPERIMENTS[experimentId];
  if (!experiment || experiment.status !== 'active') {
    return 'control';
  }

  // Check if user already has an assigned variant
  const storageKey = `ab_test_${experimentId}`;
  const existing = localStorage.getItem(storageKey);
  if (existing) {
    return existing;
  }

  // Assign new variant based on weights
  const variant = assignVariant(experiment.variants);
  localStorage.setItem(storageKey, variant.id);

  // Track variant assignment
  trackCustomEvent('ab_test_assigned', {
    experiment_id: experimentId,
    experiment_name: experiment.name,
    variant_id: variant.id,
    variant_name: variant.name,
  });

  return variant.id;
}

/**
 * Assign variant based on weights
 */
function assignVariant(variants: Variant[]): Variant {
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const variant of variants) {
    cumulative += variant.weight;
    if (random <= cumulative) {
      return variant;
    }
  }

  // Fallback to first variant (control)
  return variants[0];
}

/**
 * Track experiment goal/conversion
 */
export function trackExperimentGoal(experimentId: string, goalType: string, value?: number) {
  const variant = getVariant(experimentId);
  const experiment = EXPERIMENTS[experimentId];

  if (!experiment) return;

  trackCustomEvent('ab_test_goal', {
    experiment_id: experimentId,
    experiment_name: experiment.name,
    variant_id: variant,
    goal_type: goalType,
    value: value || 0,
  });
}

/**
 * Get all active experiments
 */
export function getActiveExperiments(): Experiment[] {
  return Object.values(EXPERIMENTS).filter(e => e.status === 'active');
}

/**
 * React hook for A/B testing
 */
export function useABTest(experimentId: string): {
  variant: string;
  trackGoal: (goalType: string, value?: number) => void;
} {
  const variant = getVariant(experimentId);

  const trackGoal = (goalType: string, value?: number) => {
    trackExperimentGoal(experimentId, goalType, value);
  };

  return { variant, trackGoal };
}

/**
 * Helper to render variant-specific content
 */
export function renderVariant<T>(
  experimentId: string,
  variants: Record<string, T>,
  defaultValue: T
): T {
  const variantId = getVariant(experimentId);
  return variants[variantId] || defaultValue;
}
