"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import StripeCheckoutForm from "./StripeCheckoutForm";
import PaymentErrorBoundary from "./PaymentErrorBoundary";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency?: string;
  customerEmail: string;
  customerName: string;
  inquiryId?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  initialPaymentIntentId?: string; // For redirect returns
  initialPaymentState?: "form" | "verifying" | "success" | "error"; // For redirect returns
}

interface PaymentSuccessProps {
  paymentIntentId: string;
  amount: number;
  currency: string;
  sessionId?: string;
  onClose: () => void;
}

interface PaymentErrorProps {
  error: string;
  onRetry: () => void;
  onClose: () => void;
}

// Payment success component
function PaymentSuccess({
  paymentIntentId,
  amount,
  currency,
  sessionId,
  onClose: _onClose,
}: PaymentSuccessProps) {
  const formattedAmount = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  // Format current date and time
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, "0")}.${(now.getMonth() + 1).toString().padStart(2, "0")}.${now.getFullYear()}`;
  const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  return (
    <div className="text-center py-2">
      {/* Green highlighted box with transaction details */}
      <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 mb-6">
        <div className="space-y-3 text-left">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Deine Nest ID:</span>
            <span className="font-mono text-sm bg-white px-3 py-1.5 rounded-lg border border-green-300">
              {sessionId || "nest-haus-" + paymentIntentId.substring(0, 10)}
            </span>
          </div>

          {/* Transaktion section with centered title */}
          <div className="space-y-2 pt-2">
            <div className="text-center">
              <span className="text-gray-700 font-semibold">Transaktion</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-gray-700 font-medium flex-shrink-0">
                ID:
              </span>
              <span className="font-mono text-xs bg-white px-2 py-1.5 rounded-lg border border-green-300 break-all text-right">
                {paymentIntentId}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Betrag:</span>
            <span className="text-green-700 font-bold text-lg">
              {formattedAmount}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Status:</span>
            <span className="text-green-600 font-bold">Bezahlt</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Datum:</span>
            <span className="text-gray-700">
              {formattedDate} | {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* White box with next steps */}
      <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 text-left">
        <h4 className="font-semibold text-gray-900 mb-4">Nächste Schritte:</h4>
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            <strong>Entwurf bestätigt</strong> - Sie erhalten eine Bestätigung
            per Mail sobald die Zahlung bei uns eingeht
          </p>
          <p>
            <strong>Wir melden uns Zeitnah</strong> - Unser Team kontaktiert Sie
            zum vereinbarten Termin
          </p>
        </div>
      </div>

      {/* Contact info */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Noch Fragen? Mail:{" "}
          <a
            href="mailto:mail@nest-haus.at"
            className="text-blue-600 hover:text-blue-800"
          >
            mail@nest-haus.at
          </a>{" "}
          | Tel:{" "}
          <a
            href="tel:+436643949605"
            className="text-blue-600 hover:text-blue-800"
          >
            +43 664 3949605
          </a>
        </p>
      </div>
    </div>
  );
}

// Payment method selection component (Step 1)
function PaymentMethodSelection({
  onMethodSelect: _onMethodSelect,
  onCancel: _onCancel,
  selectedMethod,
  onSelectionChange,
}: {
  onMethodSelect: (method: PaymentMethod) => void;
  onCancel: () => void;
  selectedMethod: PaymentMethod;
  onSelectionChange: (method: PaymentMethod) => void;
}) {
  const methods = [
    {
      id: "card" as PaymentMethod,
      name: "Debit-oder Kreditkarte",
      icons: [
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
          alt: "Mastercard",
        },
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
          alt: "Visa",
        },
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
          alt: "American Express",
        },
      ],
    },
    {
      id: "eps" as PaymentMethod,
      name: "EPS-Überweisung",
      icons: [
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Eps-%C3%9Cberweisung_Logo.svg",
          alt: "EPS",
        },
      ],
    },
    {
      id: "klarna" as PaymentMethod,
      name: "Klarna",
      icons: [
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/4/40/Klarna_Payment_Badge.svg",
          alt: "Klarna",
        },
      ],
    },
  ];

  return (
    <div className="py-6">
      <p className="text-sm text-gray-600 mb-6">
        *Nach Auswahl der Zahlungsmethode wirst du zum Anbieter weitergeleitet
      </p>

      <div className="space-y-4 mb-8">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectionChange(method.id)}
            className={`w-full border-2 rounded-2xl p-6 flex items-center justify-between transition-all min-h-[80px] ${
              selectedMethod === method.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          >
            <div className="flex items-center gap-4">
              {method.icons.map((icon, idx) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={idx}
                  src={icon.src}
                  alt={icon.alt}
                  className="h-8 object-contain"
                  style={{ maxWidth: "60px" }}
                />
              ))}
            </div>
            <span className="text-gray-900 font-medium">{method.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Payment error component
function PaymentError({ error, onRetry, onClose }: PaymentErrorProps) {
  return (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Zahlung fehlgeschlagen
      </h3>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800 text-sm">{error}</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-yellow-800 mb-2">Mögliche Lösungen:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Überprüfen Sie Ihre Kartendaten</li>
          <li>• Stellen Sie sicher, dass Ihr Konto ausreichend gedeckt ist</li>
          <li>• Versuchen Sie eine andere Zahlungsmethode</li>
          <li>• Kontaktieren Sie Ihre Bank bei wiederholten Problemen</li>
        </ul>
      </div>

      <div className="space-y-3 mb-8">
        <button
          onClick={onRetry}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Erneut versuchen
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Abbrechen
        </button>
      </div>

      <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
        <p className="font-medium mb-2">Benötigen Sie Hilfe?</p>
        <div className="space-y-1">
          <p>
            {" "}
            <a
              href="mailto:mail@nest-haus.at"
              className="text-blue-600 hover:text-blue-800"
            >
              support@nest-haus.at
            </a>
          </p>
          <p>
            {" "}
            <a
              href="tel:+43123456789"
              className="text-blue-600 hover:text-blue-800"
            >
              +43 123 456 789
            </a>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Montag - Freitag: 9:00 - 17:00 Uhr
          </p>
        </div>
      </div>
    </div>
  );
}

// Main payment modal component
type PaymentMethod = "card" | "eps" | "klarna";
type PaymentStep = "method-selection" | "payment-details" | "verifying" | "success" | "error";

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  currency = "eur",
  customerEmail,
  customerName,
  inquiryId,
  onSuccess,
  onError,
  initialPaymentIntentId,
  initialPaymentState,
}: PaymentModalProps) {
  // Payment step state (3-step flow + verifying)
  const [paymentStep, setPaymentStep] = useState<PaymentStep>(
    initialPaymentState === "success" 
      ? "success" 
      : initialPaymentState === "verifying"
      ? "verifying"
      : "method-selection"
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [paymentState, setPaymentState] = useState<
    "form" | "success" | "error"
  >(initialPaymentState || "form");
  const [paymentIntentId, setPaymentIntentId] = useState<string>(
    initialPaymentIntentId || ""
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state when modal opens (but respect initial state for redirects)
  useEffect(() => {
    if (isOpen) {
      setPaymentState(initialPaymentState || "form");
      setPaymentStep(
        initialPaymentState === "success" 
          ? "success" 
          : initialPaymentState === "verifying"
          ? "verifying"
          : "method-selection"
      );
      setPaymentIntentId(initialPaymentIntentId || "");
      setErrorMessage("");
    }
  }, [isOpen, initialPaymentState, initialPaymentIntentId]);

  // Watch for initialPaymentState changes (verifying → success transition)
  useEffect(() => {
    if (initialPaymentState === "success" && paymentStep === "verifying") {
      setPaymentStep("success");
      setPaymentState("success");
    }
  }, [initialPaymentState, paymentStep]);

  // Handle successful payment
  const _handlePaymentSuccess = (intentId: string) => {
    setPaymentIntentId(intentId);
    setPaymentState("success");
    onSuccess(intentId);
  };

  // Handle payment error
  const _handlePaymentError = (error: string) => {
    setErrorMessage(error);
    setPaymentState("error");
    onError(error);
  };

  // Handle retry payment
  const _handleRetry = () => {
    setPaymentState("form");
    setErrorMessage("");
  };

  // Handle modal close
  const handleClose = useCallback(() => {
    setPaymentState("form");
    setPaymentStep("method-selection");
    setPaymentIntentId("");
    setErrorMessage("");
    onClose();
  }, [onClose]);

  // Add entrance animation
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && paymentState !== "success") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, paymentState, handleClose]);

  // Don't render on server
  if (!mounted || !isOpen) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur effect */}
      <div
        className={`fixed inset-0 bg-black/10 backdrop-blur-md transition-all duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={paymentState === "form" ? handleClose : undefined}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Title and subtitle - outside the box, not blurred */}
          {paymentStep === "method-selection" && (
            <div className="mb-6 text-center relative z-50">
              <h2 className="h2-title text-black mb-2">Gleich geschafft</h2>
              <h3 className="h3-primary text-gray-700">
                Wähle eine Zahlungsmethode
              </h3>
            </div>
          )}

          {/* Title for payment details step - outside the box */}
          {paymentStep === "payment-details" && (
            <div className="mb-6 text-center relative z-50">
              <h2 className="h2-title text-black mb-2">Gleich geschafft</h2>
              <p className="h3-primary text-gray-700">
                Fülle die Informationen aus
              </p>
            </div>
          )}

          {/* Title for success step - outside the box */}
          {paymentStep === "success" && (
            <div className="mb-6 text-center relative z-50">
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                Zahlung erfolgreich!
              </h1>
              <h2 className="h2-title text-gray-700">
                Vielen Dank! Ihre Zahlung wurde verarbeitet
              </h2>
            </div>
          )}

          <div
            className={`relative bg-[#F4F4F4] rounded-3xl shadow-2xl border border-gray-200/50 w-full max-h-[80vh] overflow-y-auto transform transition-all duration-300 ${
              isAnimating
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-95 opacity-0 translate-y-4"
            }`}
          >
            {/* Close button - only show for method selection and payment details */}
            {(paymentStep === "method-selection" ||
              paymentStep === "payment-details") && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Step 1: Payment Method Selection */}
              {paymentStep === "method-selection" && (
                <div>
                  <PaymentMethodSelection
                    selectedMethod={selectedMethod}
                    onSelectionChange={setSelectedMethod}
                    onMethodSelect={(method) => {
                      setSelectedMethod(method);
                      // For all payment methods (card, EPS, Klarna), go to payment-details
                      // Stripe will handle redirects automatically for EPS/Klarna
                      setPaymentStep("payment-details");
                    }}
                    onCancel={handleClose}
                  />
                </div>
              )}

              {/* Step 2: Payment Details Form */}
              {paymentStep === "payment-details" && (
                <div>
                  <PaymentErrorBoundary
                    onError={(error) => _handlePaymentError(error.message)}
                  >
                    <StripeCheckoutForm
                      amount={amount}
                      currency={currency}
                      customerEmail={customerEmail}
                      customerName={customerName}
                      inquiryId={inquiryId}
                      selectedPaymentMethod={selectedMethod}
                      onSuccess={(intentId) => {
                        setPaymentIntentId(intentId);
                        setPaymentStep("success");
                        onSuccess(intentId);
                      }}
                      onError={(error) => {
                        setErrorMessage(error);
                        setPaymentStep("error");
                        onError(error);
                      }}
                      onCancel={() => setPaymentStep("method-selection")}
                    />
                  </PaymentErrorBoundary>
                </div>
              )}

              {/* Verifying State - During redirect payment verification */}
              {paymentStep === "verifying" && (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Zahlung wird überprüft...
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Bitte warten Sie, während wir Ihre Zahlung bestätigen.
                  </p>
                </div>
              )}

              {/* Step 3: Success */}
              {paymentStep === "success" && (
                <PaymentSuccess
                  paymentIntentId={paymentIntentId}
                  amount={amount}
                  currency={currency}
                  sessionId={inquiryId}
                  onClose={handleClose}
                />
              )}

              {/* Error State */}
              {paymentStep === "error" && (
                <PaymentError
                  error={errorMessage}
                  onRetry={() => setPaymentStep("payment-details")}
                  onClose={handleClose}
                />
              )}
            </div>
          </div>

          {/* Action buttons outside the box - only for method selection */}
          {paymentStep === "method-selection" && (
            <div className="flex gap-4 justify-center mt-6 relative z-50">
              <button
                onClick={handleClose}
                className="rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center font-normal whitespace-nowrap bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-400 box-border px-4 py-1.5 text-sm xl:text-base 2xl:text-lg"
              >
                Vorgang abbrechen
              </button>
              <button
                onClick={() => {
                  // Proceed to payment details for all methods
                  // Stripe handles redirects automatically for EPS/Klarna
                  setPaymentStep("payment-details");
                }}
                className="rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center font-normal whitespace-nowrap bg-[#3D6CE1] border border-[#3D6CE1] text-white hover:bg-[#2E5BC7] hover:border-[#2E5BC7] focus:ring-[#3D6CE1] box-border px-4 py-1.5 text-sm xl:text-base 2xl:text-lg"
              >
                Fortfahren
              </button>
            </div>
          )}

          {/* Button for success step - outside the box */}
          {paymentStep === "success" && (
            <div className="flex justify-center mt-6 relative z-50">
              <button
                onClick={handleClose}
                className="rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center font-normal whitespace-nowrap bg-[#3D6CE1] border border-[#3D6CE1] text-white hover:bg-[#2E5BC7] hover:border-[#2E5BC7] focus:ring-[#3D6CE1] box-border px-6 py-3 text-sm xl:text-base 2xl:text-lg"
              >
                Zurück zur Kaufübersicht
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render modal using portal
  return createPortal(modalContent, document.body);
}
