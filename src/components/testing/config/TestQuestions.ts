/**
 * ========================================
 * NEST-HAUS ALPHA TEST QUESTIONS CONFIG
 * ========================================
 * 
 * This file contains ALL questions for the usability test.
 * Edit this file to modify questions, add new ones, or change the test flow.
 * 
 * IMPORTANT: Only edit the content in this file - the logic is handled elsewhere.
 * 
 * Last Updated: January 2025
 * Team Review Status: [ ] Pending Review [ ] Approved
 */

// ========================================
// QUESTION TYPES AVAILABLE
// ========================================
// - 'rating': 1-10 scale questions
// - 'text': Open text input
// - 'multiple_choice': Select one option from list
// - 'yes_no': Simple yes/no questions

// ========================================
// SECTION 1: WELCOME & CONSENT
// ========================================
// Purpose: Get user consent and basic device comfort assessment
// Duration: ~1-2 minutes
// Critical: These questions are required for legal compliance

const WELCOME_QUESTIONS = [
    {
        id: "consent",
        type: "yes_no" as const,
        question: "Sind Sie damit einverstanden, dass wir Ihre Interaktionen für die Verbesserung unserer Website aufzeichnen?",
        required: true,
        // Internal note: GDPR compliance - user must consent to data collection
    },
    {
        id: "device_comfort",
        type: "rating" as const,
        question: "Wie vertraut sind Sie mit der Nutzung von Websites auf diesem Gerät?",
        required: true,
        // Internal note: Helps contextualize other usability scores
    },
];

// ========================================
// SECTION 2: LANDING PAGE EVALUATION
// ========================================
// Purpose: First impression and navigation clarity
// Duration: ~2-3 minutes
// Target Page: / (Homepage)

const LANDING_PAGE_QUESTIONS = [
    {
        id: "first_impression",
        type: "rating" as const,
        question: "Wie ist Ihr erster Eindruck der Website? (1 = sehr schlecht, 10 = ausgezeichnet)",
        required: true,
        // Internal note: Key metric for overall website appeal
    },
    {
        id: "clarity",
        type: "rating" as const,
        question: "Wie klar ist es, worum es bei NEST-Haus geht?",
        required: true,
        // Internal note: Measures brand message clarity
    },
    {
        id: "navigation_clarity",
        type: "multiple_choice" as const,
        question: "Welche Seite interessiert Sie als nächstes am meisten?",
        options: [
            "Entdecken - Mehr über modulare Häuser",
            "Unser Part - Was NEST-Haus bietet",
            "Dein Part - Ihre Rolle im Bauprozess",
            "Warum Wir - Unsere Philosophie",
            "Konfigurator - Haus konfigurieren",
            "Kontakt - Beratung anfragen",
        ],
        required: true,
        // Internal note: Shows user interest priorities and navigation preferences
    },
];

// ========================================
// SECTION 3: ENTDECKEN PAGE
// ========================================
// Purpose: Content clarity and visual appeal assessment
// Duration: ~2 minutes
// Target Page: /entdecken

const ENTDECKEN_PAGE_QUESTIONS = [
    {
        id: "content_clarity",
        type: "rating" as const,
        question: "Wie verständlich sind die Informationen über modulare Häuser?",
        required: true,
        // Internal note: Tests educational content effectiveness
    },
    {
        id: "visual_presentation",
        type: "rating" as const,
        question: "Wie ansprechend ist die visuelle Darstellung?",
        required: true,
        // Internal note: Visual design assessment
    },
    {
        id: "information_completeness",
        type: "rating" as const,
        question: "Finden Sie genügend Informationen über das Konzept?",
        required: true,
        // Internal note: Content depth evaluation
    },
];

// ========================================
// SECTION 4: UNSER PART PAGE
// ========================================
// Purpose: Service clarity and trust building
// Duration: ~2 minutes
// Target Page: /unser-part

const UNSER_PART_QUESTIONS = [
    {
        id: "service_clarity",
        type: "rating" as const,
        question: "Wie klar wird vermittelt, was NEST-Haus für Sie übernimmt?",
        required: true,
        // Internal note: Service communication effectiveness
    },
    {
        id: "trust_building",
        type: "rating" as const,
        question: "Wie vertrauenswürdig wirkt das Unternehmen auf Sie?",
        required: true,
        // Internal note: Brand trust assessment - critical for conversion
    },
    {
        id: "service_completeness",
        type: "multiple_choice" as const,
        question: "Welcher Service-Aspekt interessiert Sie am meisten?",
        options: [
            "Planung und Design",
            "Baugenehmigung",
            "Fertigung",
            "Montage vor Ort",
            "Qualitätskontrolle",
        ],
        required: true,
        // Internal note: Identifies most valued services for marketing focus
    },
];

// ========================================
// SECTION 5: DEIN PART PAGE
// ========================================
// Purpose: Role clarity and process understanding
// Duration: ~2 minutes
// Target Page: /dein-part

const DEIN_PART_QUESTIONS = [
    {
        id: "role_clarity",
        type: "rating" as const,
        question: "Wie klar wird Ihre Rolle im Bauprozess erklärt?",
        required: true,
        // Internal note: Customer responsibility communication
    },
    {
        id: "responsibility_understanding",
        type: "rating" as const,
        question: "Verstehen Sie, was Sie selbst beitragen müssen?",
        required: true,
        // Internal note: Expectation management effectiveness
    },
    {
        id: "process_transparency",
        type: "rating" as const,
        question: "Wie transparent ist der gesamte Bauprozess dargestellt?",
        required: true,
        // Internal note: Process communication clarity
    },
];

// ========================================
// SECTION 6: WARUM WIR PAGE
// ========================================
// Purpose: Philosophy and values alignment
// Duration: ~2 minutes
// Target Page: /warum-wir

const WARUM_WIR_QUESTIONS = [
    {
        id: "philosophy_clarity",
        type: "rating" as const,
        question: "Wie überzeugend ist die Unternehmensphilosophie?",
        required: true,
        // Internal note: Brand philosophy effectiveness
    },
    {
        id: "values_alignment",
        type: "rating" as const,
        question: "Wie sehr entsprechen die Werte Ihren eigenen Vorstellungen?",
        required: true,
        // Internal note: Value proposition alignment
    },
    {
        id: "differentiation",
        type: "rating" as const,
        question: "Wie gut hebt sich NEST-Haus von anderen Anbietern ab?",
        required: true,
        // Internal note: Competitive differentiation perception
    },
];

// ========================================
// SECTION 7: CONFIGURATOR FIRST IMPRESSION
// ========================================
// Purpose: Initial configurator usability assessment
// Duration: ~2 minutes
// Target Page: /konfigurator

const CONFIGURATOR_START_QUESTIONS = [
    {
        id: "configurator_clarity",
        type: "rating" as const,
        question: "Wie intuitiv ist die Bedienung des Konfigurators?",
        required: true,
        // Internal note: Initial usability impression - critical for tool adoption
    },
    {
        id: "visual_appeal",
        type: "rating" as const,
        question: "Wie gefällt Ihnen das Design des Konfigurators?",
        required: true,
        // Internal note: Visual design assessment for main tool
    },
    {
        id: "navigation_ease",
        type: "rating" as const,
        question: "Wie einfach ist die Navigation zwischen den Optionen?",
        required: true,
        // Internal note: Navigation usability within configurator
    },
];

// ========================================
// SECTION 8: CONFIGURATOR FULL USAGE
// ========================================
// Purpose: Complete configurator testing and understanding
// Duration: ~5-7 minutes (longest section)
// Target Page: /konfigurator

const CONFIGURATOR_USAGE_QUESTIONS = [
    {
        id: "ease_of_use",
        type: "rating" as const,
        question: "Wie einfach war es, Ihre gewünschte Konfiguration zu erstellen?",
        required: true,
        // Internal note: Overall configurator usability - primary conversion tool
    },
    {
        id: "price_understanding",
        type: "rating" as const,
        question: "Verstehen Sie die Preislogik und wie sich Preise zusammensetzen?",
        required: true,
        // Internal note: Price transparency - critical for purchase decisions
    },
    {
        id: "house_visualization",
        type: "rating" as const,
        question: "Können Sie sich vorstellen, wie Ihr konfiguriertes Haus aussehen wird?",
        required: true,
        // Internal note: Visualization effectiveness - key for customer confidence
    },
    {
        id: "option_completeness",
        type: "rating" as const,
        question: "Sind genügend Konfigurationsoptionen vorhanden?",
        required: true,
        // Internal note: Feature completeness assessment
    },
    {
        id: "missing_features",
        type: "text" as const,
        question: "Welche Funktionen oder Optionen haben Sie vermisst?",
        required: false,
        // Internal note: Feature gap identification for product development
    },
];

// ========================================
// SECTION 9: ORDER PROCESS UNDERSTANDING
// ========================================
// Purpose: Purchase process clarity and confidence
// Duration: ~3 minutes
// Target Page: /konfigurator

const ORDER_PROCESS_QUESTIONS = [
    {
        id: "payment_understanding",
        type: "rating" as const,
        question: "Verstehen Sie, was Sie wann bezahlen müssen?",
        required: true,
        // Internal note: Payment process clarity - critical for conversion
    },
    {
        id: "included_services",
        type: "rating" as const,
        question: "Ist klar, was im Hauspreis enthalten ist?",
        required: true,
        // Internal note: Service inclusion transparency
    },
    {
        id: "customer_responsibilities",
        type: "rating" as const,
        question: "Verstehen Sie Ihre Aufgaben im Bauprozess?",
        required: true,
        // Internal note: Customer role clarity in purchase process
    },
    {
        id: "timeline_clarity",
        type: "rating" as const,
        question: "Ist der Zeitplan für den Hausbau verständlich?",
        required: true,
        // Internal note: Timeline communication effectiveness
    },
    {
        id: "next_steps",
        type: "multiple_choice" as const,
        question: "Was wären Ihre nächsten Schritte nach der Konfiguration?",
        options: [
            "Beratungstermin vereinbaren",
            "Weitere Informationen anfordern",
            "Finanzierung klären",
            "Grundstück suchen",
            "Ich bin noch unsicher",
        ],
        required: true,
        // Internal note: Next action preferences - guides CTA optimization
    },
];

// ========================================
// SECTION 10: FINAL EVALUATION & PURCHASE INTENT
// ========================================
// Purpose: Overall assessment and realistic purchase likelihood
// Duration: ~3-4 minutes
// Target Page: /kontakt

const FINAL_EVALUATION_QUESTIONS = [
    {
        id: "overall_experience",
        type: "rating" as const,
        question: "Wie bewerten Sie die gesamte Website-Erfahrung?",
        required: true,
        // Internal note: Overall UX score - primary success metric
    },
    {
        id: "process_understanding",
        type: "rating" as const,
        question: "War es einfach, alle Schritte zu verstehen?",
        required: true,
        // Internal note: Process clarity across entire journey
    },
    {
        id: "configuration_satisfaction",
        type: "rating" as const,
        question: "Wie zufrieden sind Sie mit den Konfigurationsmöglichkeiten?",
        required: true,
        // Internal note: Configurator satisfaction - tool effectiveness
    },
    {
        id: "purchase_likelihood",
        type: "rating" as const,
        question: "Wie wahrscheinlich würden Sie realistisch ein solches Haus kaufen? (1 = sehr unwahrscheinlich, 10 = sehr wahrscheinlich)",
        required: true,
        // Internal note: CRITICAL METRIC - Realistic purchase intent
    },
    {
        id: "recommendation",
        type: "rating" as const,
        question: "Wie wahrscheinlich würden Sie NEST-Haus weiterempfehlen?",
        required: true,
        // Internal note: Net Promoter Score equivalent
    },
    {
        id: "main_concerns",
        type: "text" as const,
        question: "Falls Sie kein Haus kaufen würden: Was sind die Hauptgründe oder Bedenken?",
        required: false,
        // Internal note: Barrier identification - critical for addressing objections
    },
    {
        id: "improvement_suggestions",
        type: "text" as const,
        question: "Was können wir verbessern? (Optional)",
        required: false,
        // Internal note: Direct improvement feedback
    },
];

// ========================================
// TEST STEP CONFIGURATION
// ========================================
// This combines questions with page information and instructions
// Edit the instructions to change what users see during the test

export const TEST_STEPS = [
    {
        id: "welcome",
        title: "Willkommen zum NEST-Haus Alpha Test",
        description: "Vielen Dank für Ihre Teilnahme! Dieser Test dauert ca. 15-20 Minuten.",
        targetPage: "/",
        questions: WELCOME_QUESTIONS,
        instructions: "Bitte beantworten Sie zunächst diese Fragen, bevor wir mit dem Test beginnen.",
        nextAction: "stay" as const,
    },
    {
        id: "landing_page",
        title: "Startseite Bewertung",
        description: "Schauen Sie sich die Startseite an und bewerten Sie den ersten Eindruck.",
        targetPage: "/",
        questions: LANDING_PAGE_QUESTIONS,
        instructions: "Scrollen Sie durch die Startseite und verschaffen Sie sich einen Überblick.",
        nextAction: "navigate" as const,
        nextTarget: "/entdecken",
    },
    {
        id: "entdecken_page",
        title: "Entdecken Seite",
        description: "Bewerten Sie die Informationen über modulare Häuser.",
        targetPage: "/entdecken",
        questions: ENTDECKEN_PAGE_QUESTIONS,
        instructions: "Schauen Sie sich die Inhalte auf der Entdecken-Seite an und navigieren Sie durch die verschiedenen Abschnitte.",
        nextAction: "navigate" as const,
        nextTarget: "/unser-part",
    },
    {
        id: "unser_part_page",
        title: "Unser Part Seite",
        description: "Bewerten Sie die Informationen über NEST-Haus Services.",
        targetPage: "/unser-part",
        questions: UNSER_PART_QUESTIONS,
        instructions: "Lesen Sie die Informationen über die Services von NEST-Haus.",
        nextAction: "navigate" as const,
        nextTarget: "/dein-part",
    },
    {
        id: "dein_part_page",
        title: "Dein Part Seite",
        description: "Bewerten Sie die Informationen über Ihre Rolle im Bauprozess.",
        targetPage: "/dein-part",
        questions: DEIN_PART_QUESTIONS,
        instructions: "Informieren Sie sich über Ihre Aufgaben und Verantwortlichkeiten.",
        nextAction: "navigate" as const,
        nextTarget: "/warum-wir",
    },
    {
        id: "warum_wir_page",
        title: "Warum Wir Seite",
        description: "Bewerten Sie die Unternehmensphilosophie und Werte.",
        targetPage: "/warum-wir",
        questions: WARUM_WIR_QUESTIONS,
        instructions: "Lesen Sie über die Philosophie und Werte von NEST-Haus.",
        nextAction: "navigate" as const,
        nextTarget: "/konfigurator",
    },
    {
        id: "configurator_start",
        title: "Konfigurator - Erster Eindruck",
        description: "Bewerten Sie den Konfigurator beim ersten Öffnen.",
        targetPage: "/konfigurator",
        questions: CONFIGURATOR_START_QUESTIONS,
        instructions: "Schauen Sie sich den Konfigurator an, aber machen Sie noch keine Auswahl.",
        nextAction: "stay" as const,
    },
    {
        id: "configurator_usage",
        title: "Konfigurator - Vollständige Nutzung",
        description: "Verwenden Sie den Konfigurator und konfigurieren Sie ein komplettes Haus.",
        targetPage: "/konfigurator",
        questions: CONFIGURATOR_USAGE_QUESTIONS,
        instructions: "Gehen Sie durch ALLE Konfigurationsoptionen: Nest-Typ, Gebäudehülle, Innenverkleidung, Fußboden, PV-Anlage, Fenster und Planungspaket. Erstellen Sie eine vollständige Konfiguration.",
        nextAction: "stay" as const,
    },
    {
        id: "order_process",
        title: "Bestellprozess & Verständnis",
        description: "Bewerten Sie Ihr Verständnis des Bestellprozesses.",
        targetPage: "/konfigurator",
        questions: ORDER_PROCESS_QUESTIONS,
        instructions: "Denken Sie über den gesamten Prozess nach: von der Konfiguration bis zum fertigen Haus.",
        nextAction: "navigate" as const,
        nextTarget: "/kontakt",
    },
    {
        id: "final_evaluation",
        title: "Gesamtbewertung & Kaufinteresse",
        description: "Abschließende Bewertung der gesamten Website-Erfahrung.",
        targetPage: "/kontakt",
        questions: FINAL_EVALUATION_QUESTIONS,
        instructions: "Schauen Sie sich die Kontaktseite an. Denken Sie über die gesamte Erfahrung nach.",
        nextAction: "complete" as const,
    },
];

// ========================================
// EXPORT FOR USE IN COMPONENTS
// ========================================
export default TEST_STEPS;

/**
 * ========================================
 * EDITING GUIDELINES FOR TEAM REVIEW
 * ========================================
 * 
 * TO ADD A NEW QUESTION:
 * 1. Add it to the appropriate section above
 * 2. Use the format: { id: "unique_id", type: "question_type", question: "Your question?", required: true/false }
 * 3. For multiple choice, add: options: ["Option 1", "Option 2", ...]
 * 
 * TO MODIFY EXISTING QUESTIONS:
 * 1. Find the question by its ID
 * 2. Change the "question" text
 * 3. For multiple choice, modify the "options" array
 * 
 * TO CHANGE TEST FLOW:
 * 1. Modify the TEST_STEPS array at the bottom
 * 2. Change "instructions" to update what users see
 * 3. Change "nextTarget" to modify page navigation
 * 
 * TO REMOVE A QUESTION:
 * 1. Delete the question object from its section
 * 2. Make sure no other questions depend on it
 * 
 * QUESTION TYPES:
 * - "rating": 1-10 scale (good for satisfaction, clarity, likelihood)
 * - "text": Open text input (good for feedback, suggestions, concerns)
 * - "multiple_choice": Select one option (good for preferences, next actions)
 * - "yes_no": Simple yes/no (good for consent, understanding)
 * 
 * BEST PRACTICES:
 * - Keep questions clear and specific
 * - Avoid leading questions
 * - Use consistent rating scales (1-10)
 * - Mark critical questions as required: true
 * - Add internal notes for context
 */
