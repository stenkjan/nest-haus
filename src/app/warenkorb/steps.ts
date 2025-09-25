export const CHECKOUT_STEPS = [
    "Übersicht",
    "Vorentwurfsplan",
    "Planungspakete",
    "Terminvereinbarung",
    "Finale Übersicht",
    "Bezahlen",
] as const;

export type CheckoutStep = typeof CHECKOUT_STEPS[number];

