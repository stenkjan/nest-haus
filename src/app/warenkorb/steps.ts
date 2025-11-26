export const CHECKOUT_STEPS_NORMAL = [
    "Übersicht",
    "Konzept-Check",
    "Terminvereinbarung",
    "Planungspakete",
    "Abschluss",
] as const;

export const CHECKOUT_STEPS_KONZEPT = [
    "Konzept-Check",
    "Abschluss",
] as const;

// Keep for backward compatibility
export const CHECKOUT_STEPS = CHECKOUT_STEPS_NORMAL;

export type CheckoutStep = typeof CHECKOUT_STEPS[number];

