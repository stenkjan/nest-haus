"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  getCurrentTestStep,
  markStepCompleted,
  resetAlphaTest,
} from "./config/TestQuestions";

interface TestQuestion {
  id: string;
  type: "rating" | "text" | "multiple_choice" | "yes_no";
  question: string;
  options?: string[];
  required?: boolean;
  step?: string; // which page/section this question belongs to
}

interface _TestStep {
  id: string;
  title: string;
  description: string;
  targetPage: string;
  questions: TestQuestion[];
  instructions?: string;
  nextAction?: "navigate" | "stay" | "complete" | "none";
  nextTarget?: string;
}

interface UsabilityTestPopupProps {
  isActive: boolean;
  onClose: () => void;
  testId?: string;
  onMinimize?: () => void;
  isMinimized?: boolean;
  manualOpen?: boolean;
}

export default function UsabilityTestPopup({
  isActive,
  onClose: _onClose,
  testId: _testId,
  onMinimize,
  isMinimized = false,
  manualOpen = false,
}: UsabilityTestPopupProps) {
  // Determine current step based on user progress and current page
  const [currentStep, setCurrentStep] = useState<{
    id: string;
    title: string;
    description: string;
    targetPage: string;
    questions: TestQuestion[];
    instructions?: string;
    nextAction?: "navigate" | "stay" | "complete" | "none";
    nextTarget?: string;
    triggerCondition?: string;
  } | null>(null);
  const [_currentStepIndex, _setCurrentStepIndex] = useState(0);

  const [responses, setResponses] = useState<
    Record<string, { value: unknown; [key: string]: unknown }>
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nest-haus-test-responses");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [testStartTime] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nest-haus-test-start-time");
      return saved ? parseInt(saved, 10) : Date.now();
    }
    return Date.now();
  });

  const [stepStartTime, _setStepStartTime] = useState(Date.now());

  const [testSessionId] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nest-haus-test-session-id");
      if (saved) return saved;
    }
    const newId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    if (typeof window !== "undefined") {
      localStorage.setItem("nest-haus-test-session-id", newId);
      localStorage.setItem(
        "nest-haus-test-start-time",
        testStartTime.toString()
      );
    }
    return newId;
  });

  const [testInitialized, setTestInitialized] = useState(false);

  const [consoleErrors, setConsoleErrors] = useState<unknown[]>([]);
  const [showBackButton, setShowBackButton] = useState(false);
  const [stepCompletionTrigger, setStepCompletionTrigger] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  const isLastStep = currentStep?.nextAction === "complete";
  const progress = currentStep
    ? currentStep.id === "overview-phase"
      ? 25
      : currentStep.id === "configurator-phase"
        ? 50
        : currentStep.id === "purchase-validation"
          ? 75
          : currentStep.id === "feedback-phase"
            ? 100
            : 0
    : 0;

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && currentStep) {
      localStorage.setItem("nest-haus-test-current-step", currentStep.id);
    }
  }, [currentStep]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "nest-haus-test-responses",
        JSON.stringify(responses)
      );
    }
  }, [responses]);

  // Console error tracking
  useEffect(() => {
    if (!isActive) return;

    const originalConsoleError = console.error;
    const capturedErrors: Array<{
      timestamp: number;
      message: string;
      stack?: string;
    }> = [];

    console.error = (...args) => {
      capturedErrors.push({
        timestamp: Date.now(),
        message: args.join(" "),
        stack: new Error().stack,
      });
      setConsoleErrors((prev) => [...prev, ...capturedErrors]);
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, [isActive]);

  // Determine which step to show based on current page and progress
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;

      // Check if we have an active test session
      const hasTestSession =
        localStorage.getItem("nest-haus-test-session-id") !== null;

      // Always try to get a step, even without a session (for new tests)
      const step = getCurrentTestStep(currentPath, manualOpen, isActive);
      console.log("🧪 Step detection:", {
        currentPath,
        manualOpen,
        isActive,
        step: step?.id,
        hasTestSession,
      });

      if (step) {
        setCurrentStep(step);

        // Handle special cases for purchase validation (when user hasn't completed previous steps)
        if (step.id === "purchase-validation") {
          const step1Done =
            localStorage.getItem("nest-haus-test-step1-completed") === "true";
          const step2Done =
            localStorage.getItem("nest-haus-test-step2-completed") === "true";

          if (!step1Done || !step2Done) {
            setShowBackButton(true);
          }
        }

        // Show back button for all steps except the first one
        if (step.id !== "overview-phase") {
          console.log("🧪 Showing back button for step:", step.id);
          setShowBackButton(true);
        } else {
          console.log("🧪 Hiding back button for overview phase");
          setShowBackButton(false);
        }

        // Handle special cases for feedback phase
        if (step.id === "feedback-phase") {
          // No special handling needed for feedback phase
        }
      } else {
        setCurrentStep(null);
      }
    }
  }, [isActive, manualOpen, stepCompletionTrigger]);

  // Listen for purchase completion to re-evaluate step
  useEffect(() => {
    const handlePurchaseCompleted = () => {
      console.log(
        "🧪 UsabilityTestPopup: Purchase completion event received, re-evaluating step"
      );
      setStepCompletionTrigger((prev) => prev + 1);
    };

    window.addEventListener(
      "alpha-test-purchase-completed",
      handlePurchaseCompleted
    );

    return () => {
      window.removeEventListener(
        "alpha-test-purchase-completed",
        handlePurchaseCompleted
      );
    };
  }, []);

  const initializeTest = useCallback(async () => {
    try {
      console.log("🧪 Initializing test with ID:", testSessionId);

      const deviceInfo = {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        screen: {
          width: screen.width,
          height: screen.height,
        },
        devicePixelRatio: window.devicePixelRatio,
        language: navigator.language,
        platform: navigator.platform,
      };

      // Get participant name from localStorage
      const participantName =
        localStorage.getItem("nest-haus-test-user-name") || "Anonymous";

      const response = await fetch("/api/usability-test/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: testSessionId,
          deviceInfo,
          startUrl: window.location.href,
          participantName,
        }),
      });

      const result = await response.json();
      console.log("🧪 Test initialization response:", result);

      if (!response.ok) {
        throw new Error(`API Error: ${result.error || "Unknown error"}`);
      }

      console.log("🧪 Usability test started successfully:", testSessionId);
    } catch (error) {
      console.error("❌ Failed to initialize test:", error);
    }
  }, [testSessionId]);

  // Initialize test when needed (only once)
  useEffect(() => {
    console.log("🧪 Initialization check:", {
      isActive,
      currentStep: currentStep?.id,
      testInitialized,
      shouldInitialize: isActive && currentStep && !testInitialized,
    });

    if (isActive && currentStep && !testInitialized) {
      console.log("🧪 Initializing test session for step:", currentStep.id);
      initializeTest().then(() => {
        setTestInitialized(true);
      });
    }
  }, [isActive, currentStep, testInitialized, initializeTest]);

  const trackInteraction = async (
    eventType: string,
    data: Record<string, unknown>
  ) => {
    if (!currentStep) return;

    try {
      await fetch("/api/usability-test/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: testSessionId,
          stepId: currentStep.id,
          eventType,
          timestamp: Date.now(),
          duration: Date.now() - stepStartTime,
          ...data,
        }),
      });
    } catch (error) {
      console.warn("Failed to track interaction:", error);
    }
  };

  const handleResponseChange = (questionId: string, value: unknown) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        value,
        timestamp: Date.now(),
        responseTime: Date.now() - stepStartTime,
      },
    }));
  };

  const validateCurrentStep = () => {
    if (!currentStep || !currentStep.questions) return true;
    const requiredQuestions = currentStep.questions.filter((q) => q.required);
    return requiredQuestions.every((q) => responses[q.id]?.value !== undefined);
  };

  const handleNext = async () => {
    if (!currentStep) return;

    // Validate required questions
    if (currentStep.questions.length > 0 && !validateCurrentStep()) {
      alert("Bitte beantworten Sie alle erforderlichen Fragen.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save responses if there are questions
      if (currentStep.questions.length > 0) {
        console.log("🧪 Submitting responses for step:", currentStep.id);
        const responseData = {
          testId: testSessionId,
          stepId: currentStep.id,
          responses: currentStep.questions.map((q) => ({
            questionId: q.id,
            questionType: q.type,
            questionText: q.question,
            response: responses[q.id]?.value,
            responseTime: responses[q.id]?.responseTime,
          })),
        };
        console.log("🧪 Response data:", responseData);

        const response = await fetch("/api/usability-test/response", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(responseData),
        });

        const result = await response.json();
        console.log("🧪 Response submission result:", result);
      }

      await trackInteraction("step_completed", {
        stepId: currentStep.id,
        responsesCount: Object.keys(responses).length,
        success: true,
      });

      // Mark step as completed
      console.log("🧪 Marking step completed:", currentStep.id);
      markStepCompleted(currentStep.id);

      // Trigger step re-detection
      setStepCompletionTrigger((prev) => prev + 1);

      // Handle step completion
      if (currentStep.nextAction === "complete") {
        console.log("🧪 Completing test");
        await completeTest();
      } else {
        console.log("🧪 Step completed, checking for next step");
        // Clear responses for next step
        setResponses({});

        // The step re-detection will automatically show the next step
        // Don't close the popup - let it show the next step
      }
    } catch (error) {
      console.error("Failed to save responses:", error);
      await trackInteraction("error", {
        stepId: currentStep.id,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        success: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeTest = async () => {
    try {
      const totalDuration = Date.now() - testStartTime;

      console.log("🧪 Completing test:", testSessionId);
      const completionData = {
        testId: testSessionId,
        totalDuration,
        consoleErrors,
        completionRate: 100,
        finalUrl: window.location.href,
      };
      console.log("🧪 Completion data:", completionData);

      const response = await fetch("/api/usability-test/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completionData),
      });

      const result = await response.json();
      console.log("🧪 Test completion result:", result);

      // Clear test state from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("nest-haus-test-step");
        localStorage.removeItem("nest-haus-test-responses");
        localStorage.removeItem("nest-haus-test-session-id");
        localStorage.removeItem("nest-haus-test-start-time");
      }

      // Removed alert - user will be redirected to completion page

      // Redirect to alpha-test completion page
      window.location.href = `/alpha-test-complete?completed=true&testId=${testSessionId}`;
    } catch (error) {
      console.error("Failed to complete test:", error);
      alert(
        "Es gab einen Fehler beim Abschließen des Tests. Ihre Antworten wurden trotzdem gespeichert."
      );
    }
  };

  const handleBack = () => {
    if (!currentStep) return;

    console.log("🧪 Zurück button clicked, current step:", currentStep.id);

    // Navigate back based on current step
    switch (currentStep.id) {
      case "configurator-phase":
        // Go back to step 1 (overview) - stay on current page but reset step 2
        localStorage.removeItem("nest-haus-test-step2-completed");
        // Force step detection to re-run
        setStepCompletionTrigger((prev) => prev + 1);
        break;

      case "purchase-validation":
        // Go back to step 2 (configurator) - stay in warenkorb but reset purchase validation
        localStorage.removeItem("nest-haus-test-purchase-validation-completed");
        // Force step detection to re-run
        setStepCompletionTrigger((prev) => prev + 1);
        break;

      case "feedback-phase":
        // Go back to purchase validation - stay in popup, don't redirect
        console.log(
          "🧪 Going back from feedback-phase, removing localStorage items"
        );
        localStorage.removeItem("nest-haus-test-purchase-validation-completed");
        localStorage.removeItem("nest-haus-test-purchase-completed");
        console.log("🧪 Triggering step re-evaluation");
        // Force step detection to re-run
        setStepCompletionTrigger((prev) => prev + 1);
        break;

      default:
        // Default: go back to homepage
        window.location.href = "/?alpha-test=true";
        break;
    }
  };

  const handleReset = () => {
    if (
      confirm(
        "Möchten Sie den Test wirklich zurücksetzen? Alle bisherigen Antworten gehen verloren."
      )
    ) {
      resetAlphaTest();
      // Navigate to intro screen
      window.location.href = "/alpha-test";
    }
  };

  // Handle manual navigation to a specific page during the test
  const handleNavigateToPage = (targetPage: string) => {
    // Mark that navigation was triggered by the popup
    localStorage.setItem("alphaTestNavigationTriggered", "true");

    const targetUrl = new URL(targetPage, window.location.origin);
    targetUrl.searchParams.set("alpha-test", "true");
    window.location.href = targetUrl.toString();
  };

  console.log("🧪 Popup render check:", {
    isActive,
    currentStep: currentStep?.id,
    hasCurrentStep: !!currentStep,
  });

  if (!isActive || !currentStep) return null;

  // Show minimized state
  if (isMinimized) {
    return (
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999]">
        <button
          onClick={onMinimize}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-colors flex items-center justify-center opacity-70 hover:opacity-100"
        >
          {/* Mobile: Show only icon */}
          <span className="sm:hidden text-lg p-3">🧪</span>

          {/* Desktop: Show compact text */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2">
            <span className="text-sm">🧪</span>
            <span className="text-sm font-medium">zum Test</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
    >
      <div
        ref={popupRef}
        className="bg-white/98 backdrop-blur-sm rounded-lg shadow-2xl max-w-sm sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-300 relative"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)", // Safari support
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          borderRadius: "0.5rem",
          border: "2px solid rgb(147, 197, 253)",
          maxWidth: "42rem",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50/90 to-blue-100/90">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {currentStep.id === "overview-phase"
                ? "1"
                : currentStep.id === "configurator-phase"
                  ? "2"
                  : currentStep.id === "cart-phase"
                    ? "3"
                    : "4"}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {currentStep.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                {currentStep.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Reset button (only in development or always visible) */}
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-red-600 transition-colors p-1 flex items-center space-x-1"
              title="Test zurücksetzen"
            >
              <span className="text-lg">🔄</span>
              <span className="text-xs">Reset</span>
            </button>

            {onMinimize && (
              <button
                onClick={onMinimize}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex items-center space-x-1"
                title="Minimieren"
              >
                <span className="text-lg">−</span>
                <span className="text-xs">Min</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50/90">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Fortschritt</span>
            <span>
              {currentStep.id === "overview-phase"
                ? "1"
                : currentStep.id === "configurator-phase"
                  ? "2"
                  : currentStep.id === "purchase-validation"
                    ? "3"
                    : currentStep.id === "feedback-phase"
                      ? "4"
                      : "?"}{" "}
              von 4
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep.instructions && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-0.5 flex-shrink-0">ℹ️</span>
                <div className="flex-1">
                  <p className="text-sm sm:text-base text-blue-800">
                    {currentStep.instructions}
                  </p>
                  {currentStep.targetPage !== window.location.pathname &&
                    currentStep.id !== "feedback-phase" && (
                      <div className="mt-3 p-2 bg-yellow-100/80 rounded text-xs text-yellow-800">
                        <strong>Hinweis:</strong> Sie können frei auf der
                        Website navigieren. Das Test-Popup passt sich
                        automatisch an die aktuelle Seite an.
                        {currentStep.targetPage && (
                          <button
                            onClick={() =>
                              handleNavigateToPage(currentStep.targetPage)
                            }
                            className="ml-2 underline hover:no-underline text-blue-700"
                          >
                            zu{" "}
                            {currentStep.targetPage === "/"
                              ? "Startseite"
                              : currentStep.targetPage.slice(1)}{" "}
                            wechseln
                          </button>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Special handling for purchase validation step */}
          {currentStep.id === "purchase-validation" && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 mb-4">
                <strong>Bitte schließen Sie den Kaufprozess ab</strong>
              </p>
              <p className="text-yellow-700 text-sm mb-4">
                Gehen Sie durch den vollständigen Kaufprozess und klicken Sie
                auf &apos;Zur Kassa&apos; oder &apos;Mit Apple Pay
                bezahlen&apos;, bevor Sie zu Schritt 3 weitergehen können.
              </p>
              <p className="text-yellow-700 text-sm mb-4">
                Falls Sie Probleme beim Abschluss des Prozesses haben, können
                Sie hier mit Schritt 3 fortfahren:{" "}
                <button
                  onClick={async () => {
                    // Save any feedback from the purchase validation question if provided
                    const feedbackResponse =
                      responses["purchase-completion-issue"]?.value;
                    if (feedbackResponse) {
                      try {
                        await fetch("/api/usability-test/response", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            testId: testSessionId,
                            stepId: "purchase-validation",
                            responses: [
                              {
                                questionId: "purchase-completion-issue",
                                questionType: "text",
                                questionText:
                                  "Falls Sie Probleme beim Abschluss des Prozesses haben, geben Sie uns hier Ihr Feedback, warum Sie Schritt 3 nicht beenden konnten:",
                                response: feedbackResponse,
                                responseTime: 0,
                              },
                            ],
                          }),
                        });
                      } catch (error) {
                        console.error(
                          "Failed to save purchase validation feedback:",
                          error
                        );
                      }
                    }

                    // Skip to feedback phase by completing purchase validation and triggering step detection
                    markStepCompleted("purchase-validation");
                    setStepCompletionTrigger((prev) => prev + 1);
                  }}
                  className="underline hover:no-underline text-blue-700 font-medium"
                >
                  Schritt 3
                </button>
              </p>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {currentStep.questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <label className="block text-sm font-medium text-gray-900">
                  {question.question}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {question.type === "rating" && (
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5, 6].map((rating) => (
                      <button
                        key={rating}
                        onClick={() =>
                          handleResponseChange(question.id, rating)
                        }
                        className={`w-10 h-10 rounded-full border-2 text-sm font-medium transition-colors ${
                          responses[question.id]?.value === rating
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                )}

                {question.type === "text" && (
                  <textarea
                    value={String(responses[question.id]?.value || "")}
                    onChange={(e) =>
                      handleResponseChange(question.id, e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Ihre Antwort..."
                  />
                )}

                {question.type === "multiple_choice" && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={responses[question.id]?.value === option}
                          onChange={(e) =>
                            handleResponseChange(question.id, e.target.value)
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === "yes_no" && (
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        value="yes"
                        checked={responses[question.id]?.value === "yes"}
                        onChange={(e) =>
                          handleResponseChange(question.id, e.target.value)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Ja</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        value="no"
                        checked={responses[question.id]?.value === "no"}
                        onChange={(e) =>
                          handleResponseChange(question.id, e.target.value)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Nein</span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          {showBackButton ? (
            <button
              onClick={() => {
                console.log("🧪 Zurück button clicked!");
                handleBack();
              }}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
            >
              <span>←</span>
              <span>Zurück</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center space-x-3">
            {!validateCurrentStep() && currentStep?.id !== "feedback-phase" && (
              <span className="text-sm text-red-600">
                Bitte beantworten Sie alle erforderlichen Fragen
              </span>
            )}

            <div className="flex items-center space-x-2">
              <button
                onClick={onMinimize}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
              >
                <span>−</span>
                <span>Minimieren</span>
              </button>

              {/* Hide main action button for purchase validation step */}
              {currentStep.nextAction !== "none" && (
                <button
                  onClick={handleNext}
                  disabled={!validateCurrentStep() || isSubmitting}
                  className="flex items-center space-x-2 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {isLastStep
                          ? "Test abschließen"
                          : currentStep.id === "purchase-validation"
                            ? "Verstanden"
                            : "Weiter"}
                      </span>
                      {!isLastStep && <span>→</span>}
                      {isLastStep && <span>✓</span>}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
