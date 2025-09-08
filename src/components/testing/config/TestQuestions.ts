/**
 * ===================================================================
 * NEST-HAUS ALPHA TEST CONFIGURATION
 * ===================================================================
 * 
 * This file contains the complete test flow for the NEST-Haus alpha test.
 * The test follows a 4-step user journey:
 * 
 * 1. OVERVIEW PHASE - User explores the website
 * 2. CONFIGURATOR PHASE - User designs their house
 * 3. CART PHASE - User completes the order process
 * 4. FEEDBACK PHASE - User provides detailed feedback
 * 
 * EDITING INSTRUCTIONS:
 * - Each step has specific trigger conditions and content
 * - Questions can be modified without changing the technical structure
 * - Add/remove questions by updating the questions array
 * - Maintain the step IDs and structure for proper functionality
 * 
 * QUESTION TYPES:
 * - "rating": 1-6 scale buttons
 * - "text": Open text area
 * - "multiple_choice": Radio button options
 * - "yes_no": Yes/No radio buttons
 */

interface TestQuestion {
    id: string;
    type: "rating" | "text" | "multiple_choice" | "yes_no";
    question: string;
    options?: string[];
    required?: boolean;
    step?: string;
}

interface TestStep {
    id: string;
    title: string;
    description: string;
    targetPage: string;
    questions: TestQuestion[];
    instructions?: string;
    nextAction?: "navigate" | "stay" | "complete" | "none";
    nextTarget?: string;
    triggerCondition?: string; // Custom condition for when this step should appear
}

/**
 * ===================================================================
 * MAIN TEST FLOW CONFIGURATION
 * ===================================================================
 */

export const TEST_STEPS: TestStep[] = [
    /**
 * STEP 1: OVERVIEW PHASE
 * Only shows when user manually opens popup after exploring the website
 * Should only show instruction text and a "Weiter" button, no questions
 */
    {
        id: "overview-phase",
        title: "Schritt 1: Website erkunden",
        description: "Mach dir einen Überblick über unsere Website",
        targetPage: "/", // Can appear on any page
        triggerCondition: "manual_open_only",
        instructions: "Hast du dir einen Überblick über die Website verschafft? Falls nicht, schließ das Popup, verschaff dir einen Überblick und öffne das Popup dann wieder um dann auf weiter zu klicken.",
        questions: [], // No questions, just instruction text
        nextAction: "stay"
    },

    /**
     * STEP 2: CONFIGURATOR AND CART PHASE (MERGED)
     * Appears when user is in configurator and has completed step 1
     * Covers both configuration and cart completion
     */
    {
        id: "configurator-phase",
        title: "Schritt 2: Haus konfigurieren und bestellen",
        description: "Gestalte dein Traumhaus und schließ die Bestellung ab",
        targetPage: "/konfigurator",
        triggerCondition: "step1_completed_and_in_configurator",
        instructions: "Jetzt geht es an die Substanz - gestalte dir dein Haus mit unserem Konfigurator, schaue dir dabei jede Sektion an und treffe eine Auswahl, bestelle das Haus anschließend und führe dabei den Kaufabschluss bis zum Ende durch (Keine Angst, du musst es nicht wirklich kaufen ;-)",
        questions: [], // No questions, just instruction text
        nextAction: "stay"
    },

    /**
     * STEP 3A: PURCHASE VALIDATION
     * Appears when user tries to access step 3 without completing purchase
     * Asks user to complete purchase process or provides skip option
     */
    {
        id: "purchase-validation",
        title: "Schritt 3: Kaufprozess abschließen",
        description: "Bitte schließ den Kaufprozess ab",
        targetPage: "/warenkorb",
        triggerCondition: "step2_completed_but_not_purchased",
        instructions: "Bitte geh durch den vollständigen Kaufprozess und klick auf 'Zur Kassa' oder 'Mit Apple Pay bezahlen', bevor du zu Schritt 3 weitergehen kannst.",
        questions: [
            {
                id: "purchase-completion-issue",
                type: "text",
                question: "Falls du Probleme beim Abschluss des Prozesses hast, gib uns hier dein Feedback, warum du Schritt 2 nicht beenden konntest:",
                required: false,
                step: "purchase-validation"
            }
        ],
        nextAction: "none"
    },

    /**
     * STEP 3B: FEEDBACK PHASE
     * Appears when user has completed the purchase process or manually triggered
     * Contains the main questionnaire with quantitative and qualitative questions
     */
    {
        id: "feedback-phase",
        title: "Schritt 3: Feedback-Fragebogen",
        description: "Teile deine Erfahrungen mit uns",
        targetPage: "*", // Can appear on any page
        triggerCondition: "purchase_completed_or_manual",
        instructions: "VORABINFO: Wir bitten dich darum wirklich ehrliche Antworten zu geben. Schmeichelei bringt uns nix weiter - wir suchen nach harter Kritik an den richtigen stellen, damit wir unsere Website weiter optimieren können! :-)\n\n→ Sei ehrlich und direkt! ;-)\n\nNun würden wir uns sehr freuen wenn du dir ein paar Minuten Zeit nimmst, und versuchst unsere Feedback-Fragen bestmöglichst zu beantworten. Keine Sorge, es gibt kein richtig oder falsch, uns hilft jede ehrliche Antwort.",
        questions: [
            // ===== QUANTITATIVE QUESTIONS (1-6 Scale) =====
            // (1 = sehr schlecht / 6 = sehr gut)
            {
                id: "navigation-ease",
                type: "rating",
                question: "Wie einfach war es für dich, sich auf der Website zu orientieren und zu navigieren?",
                required: true,
                step: "feedback"
            },
            {
                id: "configurator-usability",
                type: "rating",
                question: "Wie benutzerfreundlich fandest du den Haus-Konfigurator?",
                required: true,
                step: "feedback"
            },
            {
                id: "nest-haus-understanding",
                type: "rating",
                question: "Hast du das Gefühl, dass du verstanden hast wie das Nest Haus funktioniert?",
                required: true,
                step: "feedback"
            },
            {
                id: "purchase-process",
                type: "rating",
                question: "Wie bewertest du den Bestellprozess im Warenkorb?",
                required: true,
                step: "feedback"
            },
            {
                id: "configurator-options",
                type: "rating",
                question: "Wie gut gefallen dir die Auswahlmöglichkeiten im Konfigurator?",
                required: true,
                step: "feedback"
            },
            {
                id: "website-overall",
                type: "rating",
                question: "Wie gefällt dir unsere Nest Haus Website?",
                required: true,
                step: "feedback"
            },
            {
                id: "purchase-intention",
                type: "rating",
                question: "Könntest du dir vorstellen einmal ein Nest Haus zu bauen?",
                required: true,
                step: "feedback"
            },

            // ===== QUALITATIVE QUESTIONS (Open Text) =====
            {
                id: "content-display-issues",
                type: "text",
                question: "Waren die Inhalte und Grafiken gut erkennbar oder gab es Darstellungsprobleme, Lade-Probleme oder dergleichen?",
                required: true,
                step: "feedback"
            },
            {
                id: "main-challenge",
                type: "text",
                question: "Gab es eine grundsätzliche Herausforderung oder ein großes Problem bei der Nutzung der Website?",
                required: true,
                step: "feedback"
            },
            {
                id: "nest-haus-concept-understanding",
                type: "text",
                question: "Hast du nach dem Besuch der Website verstanden, wie das NEST-Haus funktioniert (z. B. Module, Aufbau, Flexibilität)?",
                required: true,
                step: "feedback"
            },
            {
                id: "missing-information",
                type: "text",
                question: "Welche Informationen hast du vermisst oder hättest du gerne zusätzlich gesehen?",
                required: true,
                step: "feedback"
            },
            {
                id: "improvement-suggestions",
                type: "text",
                question: "Hast du konkrete Verbesserungsvorschläge für die Website oder den Konfigurator?",
                required: true,
                step: "feedback"
            },
            {
                id: "advantages-disadvantages",
                type: "text",
                question: "Versuche Vor- und Nachteile aus deiner Sicht gegenüber herkömmlichen Hausbaumethoden zu erklären. (Bitte bestmöglich beantworten - ist für uns eine sehr wichtige Frage)",
                required: true,
                step: "feedback"
            },
            {
                id: "purchase-to-move-in-process",
                type: "text",
                question: "Erkläre den Prozess von Kauf bis zum bezugsfertigen Haus in eigenen Worten.",
                required: true,
                step: "feedback"
            },
            {
                id: "window-wall-positioning",
                type: "text",
                question: "Wie wird die Positionierung von Fenstern und Innenwänden festgelegt?",
                required: true,
                step: "feedback"
            },
            {
                id: "house-categorization",
                type: "text",
                question: "Wie würdest du das Nest Haus kategorisieren? (Fertigteilhaus, Tiny House, Massivhaus, Modulbauhaus, Holz-Haus, mobile-home oder eine eigene Kategorie?)",
                required: true,
                step: "feedback"
            },
            {
                id: "additional-costs",
                type: "text",
                question: "Welche weiteren Kosten kommen deiner Meinung nach, nach dem Kauf noch auf dich zu, bis du einziehen kannst?",
                required: true,
                step: "feedback"
            },
            {
                id: "unclear-topics",
                type: "text",
                question: "Welches Thema ist für dich noch am unklarsten? Wo bleiben Fragezeichen?",
                required: true,
                step: "feedback"
            },
            {
                id: "confusing-elements",
                type: "text",
                question: "Gab es irgendetwas, was dich irritiert oder verunsichert hat?",
                required: true,
                step: "feedback"
            },
            {
                id: "detailed-description-needs",
                type: "text",
                question: "Was hättest du gerne noch genauer beschrieben?",
                required: true,
                step: "feedback"
            }
        ],
        nextAction: "complete"
    }
];

/**
 * ===================================================================
 * HELPER FUNCTIONS FOR TEST LOGIC
 * ===================================================================
 */

/**
 * Get the current step based on user progress and current page
 */
export function getCurrentTestStep(currentPath: string, manualOpen: boolean = false, isPopupActive: boolean = false): TestStep | null {
    // Check localStorage for test progress
    const step1Completed = localStorage.getItem("nest-haus-test-step1-completed") === "true";
    const step2Completed = localStorage.getItem("nest-haus-test-step2-completed") === "true";
    const purchaseCompleted = localStorage.getItem("nest-haus-test-purchase-completed") === "true";

    console.log("🧪 Step status:", {
        step1Completed,
        step2Completed,
        purchaseCompleted,
        currentPath,
        manualOpen,
        localStorage: {
            step1: localStorage.getItem("nest-haus-test-step1-completed"),
            step2: localStorage.getItem("nest-haus-test-step2-completed"),
            purchase: localStorage.getItem("nest-haus-test-purchase-completed")
        }
    });

    // Step 3B: Feedback (after purchase completed or purchase validation completed)
    const purchaseValidationCompleted = localStorage.getItem("nest-haus-test-purchase-validation-completed") === "true";
    console.log("🧪 Step detection - purchaseCompleted:", purchaseCompleted, "purchaseValidationCompleted:", purchaseValidationCompleted);
    if (purchaseCompleted || purchaseValidationCompleted) {
        console.log("🧪 Showing feedback phase");
        return TEST_STEPS.find(step => step.id === "feedback-phase") || null;
    }

    // Step 3A: Purchase validation (if step 2 completed but not purchased, when manually opened or popup is already active)
    if (step1Completed && step2Completed && !purchaseCompleted && (manualOpen || isPopupActive)) {
        console.log("🧪 Showing purchase validation (manual open or popup active, steps 1&2 done, not purchased)");
        return TEST_STEPS.find(step => step.id === "purchase-validation") || null;
    }

    // Handle warenkorb page - show purchase validation if step 2 completed but not purchased
    if (currentPath === "/warenkorb") {
        // If step 1 is not completed, show catch-up logic
        if (!step1Completed) {
            return TEST_STEPS.find(step => step.id === "overview-phase") || null;
        }
        // Purchase validation logic moved above to handle all paths
        // Don't show popup automatically until "zur Kassa" is clicked
        console.log("🧪 No popup in warenkorb - waiting for purchase trigger");
        return null;
    }

    // Step 2: Configurator phase - show if user is in configurator and step 1 is completed
    if (currentPath === "/konfigurator") {
        if (step1Completed && !step2Completed) {
            return TEST_STEPS.find(step => step.id === "configurator-phase") || null;
        }
        // If step 1 is not completed, show step 1
        if (!step1Completed) {
            return TEST_STEPS.find(step => step.id === "overview-phase") || null;
        }
    }

    // Step 1: Overview phase - show if manually opened and step 1 not completed
    // OR if on landing page and step 1 not completed
    if (!step1Completed && (manualOpen || currentPath === "/")) {
        return TEST_STEPS.find(step => step.id === "overview-phase") || null;
    }

    // Step 2: If step 1 completed but step 2 not completed, show configurator phase
    // (This handles the case where user completed step 1 but is still on landing page)
    if (step1Completed && !step2Completed && (manualOpen || currentPath === "/")) {
        return TEST_STEPS.find(step => step.id === "configurator-phase") || null;
    }

    // Step 3A: If steps 1 and 2 completed but not purchased, show purchase validation
    // (This handles the case where user completed step 2 but hasn't clicked "zur Kassa")
    if (step1Completed && step2Completed && !purchaseCompleted && manualOpen) {
        return TEST_STEPS.find(step => step.id === "purchase-validation") || null;
    }

    return null;
}

/**
 * Mark a test step as completed
 */
export function markStepCompleted(stepId: string): void {
    console.log("🧪 markStepCompleted called with:", stepId);
    switch (stepId) {
        case "overview-phase":
            localStorage.setItem("nest-haus-test-step1-completed", "true");
            console.log("🧪 Step 1 marked as completed");
            break;
        case "configurator-phase":
            localStorage.setItem("nest-haus-test-step2-completed", "true");
            console.log("🧪 Step 2 (configurator + cart) marked as completed");
            break;
        case "purchase-validation":
            // Mark purchase validation as completed to allow access to feedback phase
            localStorage.setItem("nest-haus-test-purchase-validation-completed", "true");
            console.log("🧪 Purchase validation step completed (user skipped to feedback)");
            break;
        case "feedback-phase":
            localStorage.setItem("nest-haus-test-completed", "true");
            console.log("🧪 Test marked as completed");
            break;
        default:
            console.warn("🧪 Unknown step ID:", stepId);
    }
}

/**
 * Check if user should see the "zur Kassa" completion trigger
 */
export function shouldTriggerPurchaseComplete(): boolean {
    const step1Completed = localStorage.getItem("nest-haus-test-step1-completed") === "true";
    const _step2Completed = localStorage.getItem("nest-haus-test-step2-completed") === "true";
    const step3Completed = localStorage.getItem("nest-haus-test-step3-completed") === "true";

    return step1Completed && _step2Completed && step3Completed;
}

/**
 * Check if we should show the tooltip for step 1
 */
export function shouldShowStep1Tooltip(): boolean {
    const step1Completed = localStorage.getItem("nest-haus-test-step1-completed") === "true";
    const testStarted = localStorage.getItem("nest-haus-test-session-id") !== null;

    return testStarted && !step1Completed;
}

/**
 * Reset all test data and return to intro screen
 */
export function resetAlphaTest(): void {
    // Clear all test-related localStorage items
    localStorage.removeItem("nest-haus-test-session-id");
    localStorage.removeItem("nest-haus-test-step1-completed");
    localStorage.removeItem("nest-haus-test-step2-completed");

    localStorage.removeItem("nest-haus-test-purchase-completed");
    localStorage.removeItem("nest-haus-test-purchase-validation-completed");
    localStorage.removeItem("nest-haus-test-completed");
    localStorage.removeItem("nest-haus-test-user-name");
    localStorage.removeItem("nest-haus-test-current-step");
    localStorage.removeItem("nest-haus-test-responses");
    localStorage.removeItem("nest-haus-test-start-time");
    localStorage.removeItem("nest-haus-test-last-closed");
    localStorage.removeItem("alphaTestNavigationTriggered");

    console.log("🧪 Alpha test data cleared - fresh start");
}

/**
 * Check if we're in local development environment
 */
export function isLocalDevelopment(): boolean {
    return typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1" ||
            window.location.hostname.includes("localhost"));
}

/**
 * ===================================================================
 * CONFIGURATION NOTES FOR TEAM REVIEW
 * ===================================================================
 * 
 * STEP FLOW LOGIC:
 * 1. User starts test → Step 1 (Overview) appears
 * 2. User completes Step 1 → Popup hides, user explores freely
 * 3. User goes to /konfigurator → Step 2 (Configurator) appears
 * 4. User completes Step 2 → Popup hides, user configures freely
 * 5. User goes to /warenkorb → Step 3 (Cart) appears
 * 6. User completes Step 3 → Popup hides, user completes purchase
 * 7. User clicks "zur Kassa" OR manually opens popup → Step 4 (Feedback) appears
 * 8. User completes feedback → Test ends, redirect to thank you page
 * 
 * CATCH-UP LOGIC:
 * - If user goes to /warenkorb without completing Steps 1&2, show catch-up question
 * - If user goes to Step 4 without completing purchase, show purchase validation
 * 
 * POPUP BEHAVIOR:
 * - Popup only opens automatically on specific triggers
 * - User can manually open/close popup anytime via floating button
 * - Popup state persists across page navigation
 * - No automatic redirections - user navigates manually
 * 
 * QUESTION CUSTOMIZATION:
 * - Modify question text directly in the questions array
 * - Add/remove questions by updating the array
 * - Change rating scale by modifying the rating component (currently 1-6)
 * - All questions support required/optional flags
 */