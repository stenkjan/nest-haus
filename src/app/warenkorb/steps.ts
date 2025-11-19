export const CHECKOUT_STEPS = [
    "Übersicht",
    "Konzeptcheck",
    "Terminvereinbarung",
    "Planungspakete",
    "Abschluss",
] as const;

export type CheckoutStep = typeof CHECKOUT_STEPS[number];

