"use client";

import { useState } from "react";

export function usePlanungspaketePopup() {
    const [isOpen, setIsOpen] = useState(false);

    const openPlanungspakete = () => setIsOpen(true);
    const closePlanungspakete = () => setIsOpen(false);

    return {
        isOpen,
        openPlanungspakete,
        closePlanungspakete,
    };
}
