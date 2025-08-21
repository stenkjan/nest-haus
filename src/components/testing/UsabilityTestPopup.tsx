"use client";

import React, { useState, useEffect, useRef } from "react";
import { TEST_STEPS } from "./config/TestQuestions";

interface TestQuestion {
  id: string;
  type: "rating" | "text" | "multiple_choice" | "yes_no";
  question: string;
  options?: string[];
  required?: boolean;
  step?: string; // which page/section this question belongs to
}

interface TestStep {
  id: string;
  title: string;
  description: string;
  targetPage: string;
  questions: TestQuestion[];
  instructions?: string;
  nextAction?: "navigate" | "stay" | "complete";
  nextTarget?: string;
}

interface UsabilityTestPopupProps {
  isActive: boolean;
  onClose: () => void;
  testId?: string;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

export default function UsabilityTestPopup({
  isActive,
  onClose,
  testId: _testId,
  onMinimize,
  isMinimized = false,
}: UsabilityTestPopupProps) {
  // Load state from localStorage or initialize
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nest-haus-test-step");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const [responses, setResponses] = useState<Record<string, unknown>>(() => {
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

  const [stepStartTime, setStepStartTime] = useState(Date.now());

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

  const [consoleErrors, setConsoleErrors] = useState<unknown[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);

  const currentStep = TEST_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === TEST_STEPS.length - 1;
  const progress = ((currentStepIndex + 1) / TEST_STEPS.length) * 100;

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nest-haus-test-step", currentStepIndex.toString());
    }
  }, [currentStepIndex]);

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
    const capturedErrors: any[] = [];

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

  // Initialize test session and sync with current page
  useEffect(() => {
    if (isActive) {
      // Check if we need to sync the test step with the current page
      const currentPath = window.location.pathname;
      const expectedPage = currentStep.targetPage;

      // If we're on a different page than expected for this step,
      // find the correct step for the current page
      if (currentPath !== expectedPage) {
        const correctStepIndex = TEST_STEPS.findIndex(
          (step) => step.targetPage === currentPath
        );
        if (correctStepIndex !== -1 && correctStepIndex !== currentStepIndex) {
          setCurrentStepIndex(correctStepIndex);
          setStepStartTime(Date.now());
          return;
        }
      }

      // Initialize test if it's the first step
      if (currentStepIndex === 0) {
        initializeTest();
      }
    }
  }, [isActive, currentStepIndex]);

  const initializeTest = async () => {
    try {
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

      await fetch("/api/usability-test/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: testSessionId,
          deviceInfo,
          startUrl: window.location.href,
        }),
      });

      console.log("🧪 Usability test started:", testSessionId);
    } catch (error) {
      console.error("Failed to initialize test:", error);
    }
  };

  const trackInteraction = async (
    eventType: string,
    data: Record<string, unknown>
  ) => {
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
    const requiredQuestions = currentStep.questions.filter((q) => q.required);
    return requiredQuestions.every((q) => responses[q.id]?.value !== undefined);
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      alert("Bitte beantworten Sie alle erforderlichen Fragen.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save responses for current step
      await fetch("/api/usability-test/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: testSessionId,
          stepId: currentStep.id,
          responses: currentStep.questions.map((q) => ({
            questionId: q.id,
            questionType: q.type,
            questionText: q.question,
            response: responses[q.id]?.value,
            responseTime: responses[q.id]?.responseTime,
          })),
        }),
      });

      await trackInteraction("step_completed", {
        stepId: currentStep.id,
        responsesCount: Object.keys(responses).length,
        success: true,
      });

      // Handle navigation
      if (currentStep.nextAction === "navigate" && currentStep.nextTarget) {
        // Mark that navigation was triggered by the popup
        localStorage.setItem("alphaTestNavigationTriggered", "true");

        // Preserve alpha-test parameter during navigation
        const targetUrl = new URL(
          currentStep.nextTarget,
          window.location.origin
        );
        targetUrl.searchParams.set("alpha-test", "true");

        // Navigate to the target page with alpha test parameter
        window.location.href = targetUrl.toString();
        // Continue to next step immediately (popup will show on new page)
        setCurrentStepIndex((prev) => prev + 1);
        setStepStartTime(Date.now());
        setResponses({});
      } else if (currentStep.nextAction === "complete") {
        await completeTest();
      } else {
        setCurrentStepIndex((prev) => prev + 1);
        setStepStartTime(Date.now());
        setResponses({});
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

      await fetch("/api/usability-test/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: testSessionId,
          totalDuration,
          consoleErrors,
          completionRate: 100,
          finalUrl: window.location.href,
        }),
      });

      // Clear test state from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("nest-haus-test-step");
        localStorage.removeItem("nest-haus-test-responses");
        localStorage.removeItem("nest-haus-test-session-id");
        localStorage.removeItem("nest-haus-test-start-time");
      }

      alert(
        "Vielen Dank für Ihre Teilnahme am Test! Ihre Antworten helfen uns, die Website zu verbessern."
      );

      // Remove alpha-test parameter from URL after completion
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("alpha-test");
      window.history.replaceState({}, "", currentUrl.toString());

      onClose();
    } catch (error) {
      console.error("Failed to complete test:", error);
      alert(
        "Es gab einen Fehler beim Abschließen des Tests. Ihre Antworten wurden trotzdem gespeichert."
      );
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setStepStartTime(Date.now());
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

  if (!isActive) return null;

  // Show minimized state
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onMinimize}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-2"
        >
          <span className="text-sm">🧪</span>
          <span className="text-sm font-medium">Test fortsetzen</span>
          <span className="text-xs bg-blue-500 px-2 py-1 rounded">
            {currentStepIndex + 1}/{TEST_STEPS.length}
          </span>
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
        className="bg-white/98 backdrop-blur-sm rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-300 relative"
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
              {currentStepIndex + 1}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStep.title}
              </h2>
              <p className="text-sm text-gray-600">{currentStep.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onMinimize && (
              <button
                onClick={onMinimize}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="Minimieren"
              >
                <span className="text-lg">−</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="Test beenden"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50/90">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Fortschritt</span>
            <span>
              {currentStepIndex + 1} von {TEST_STEPS.length}
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
                  <p className="text-blue-800">{currentStep.instructions}</p>
                  {currentStep.targetPage !== window.location.pathname && (
                    <div className="mt-3 p-2 bg-yellow-100/80 rounded text-xs text-yellow-800">
                      <strong>Hinweis:</strong> Sie können frei auf der Website
                      navigieren. Das Test-Popup passt sich automatisch an die
                      aktuelle Seite an.
                      {currentStep.targetPage && (
                        <button
                          onClick={() =>
                            handleNavigateToPage(currentStep.targetPage)
                          }
                          className="ml-2 underline hover:no-underline text-blue-700"
                        >
                          Zur{" "}
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
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
                    value={responses[question.id]?.value || ""}
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
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>←</span>
            <span>Zurück</span>
          </button>

          <div className="flex items-center space-x-3">
            {!validateCurrentStep() && (
              <span className="text-sm text-red-600">
                Bitte beantworten Sie alle erforderlichen Fragen
              </span>
            )}

            <button
              onClick={handleNext}
              disabled={!validateCurrentStep() || isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLastStep ? "Test abschließen" : "Weiter"}</span>
                  {!isLastStep && <span>→</span>}
                  {isLastStep && <span>✓</span>}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
