export const CHECKOUT_STEPS = [
    "Übersicht",
    "Konzept-Check",
    "Terminvereinbarung",
    "Planungspakete",
    "Abschluss",
] as const;

export type CheckoutStep = typeof CHECKOUT_STEPS[number];

