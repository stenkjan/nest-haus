export const CHECKOUT_STEPS = [
    "Übersicht",
    "Vorentwurfsplan",
    "Planungspakete",
    "Terminvereinbarung",
    "Liefertermin",
] as const;

export type CheckoutStep = typeof CHECKOUT_STEPS[number];

