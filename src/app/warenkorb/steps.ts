export const CHECKOUT_STEPS = [
    "Übersicht",
    "Vorentwurfsplan & Grundstückscheck",
    "Planungspakete",
    "Terminvereinbarung",
    "Liefertermin",
] as const;

export type CheckoutStep = typeof CHECKOUT_STEPS[number];


