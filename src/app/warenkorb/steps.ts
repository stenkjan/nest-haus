export const CHECKOUT_STEPS = [
    "Übersicht",
    "Check & Vorentwurf",
    "Terminvereinbarung",
    "Planungspakete",
    "Abschluss",
] as const;

export type CheckoutStep = typeof CHECKOUT_STEPS[number];

