export const CHECKOUT_STEPS = [
    "Übersicht",
    "Vorentwurfsplan & Grundstückscheck",
    "Planungspakete",
    "Terminvereinbarung",
    "Zusammenfassung",
] as const;

export type CheckoutStep = typeof CHECKOUT_STEPS[number];


