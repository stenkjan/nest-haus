export const CHECKOUT_STEPS = [
    "Übersicht",
    "Check und Vorentwurf",
    "Terminvereinbarung",
    "Planungspakete",
    "Abschluss",
] as const;

export type CheckoutStep = typeof CHECKOUT_STEPS[number];

