"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import StripeCheckoutForm from "./StripeCheckoutForm";
import PaymentErrorBoundary from "./PaymentErrorBoundary";
import StripeTest from "./StripeTest";

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
}

interface PaymentSuccessProps {
  paymentIntentId: string;
  amount: number;
  currency: string;
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
  onClose,
}: PaymentSuccessProps) {
  const formattedAmount = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  return (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Zahlung erfolgreich!
      </h3>

      <p className="text-gray-600 mb-6">
        Ihre Zahlung über <strong>{formattedAmount}</strong> wurde erfolgreich
        verarbeitet.
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="text-sm text-gray-600">
          <div className="flex justify-between mb-2">
            <span>Transaktions-ID:</span>
            <span className="font-mono text-xs">{paymentIntentId}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-600 font-medium">Bezahlt</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-600 mb-8">
        <p>✅ Eine Bestätigungsmail wurde an Ihre E-Mail-Adresse gesendet.</p>
        <p>✅ Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.</p>
        <p>✅ Ihre Konfiguration wurde gespeichert und wird bearbeitet.</p>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Schließen
      </button>
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

      <p className="text-gray-600 mb-6">{error}</p>

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

      <div className="text-xs text-gray-500">
        <p>Bei weiteren Problemen kontaktieren Sie uns unter:</p>
        <p className="mt-1">📧 support@nest-haus.at</p>
      </div>
    </div>
  );
}

// Main payment modal component
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
}: PaymentModalProps) {
  const [paymentState, setPaymentState] = useState<
    "form" | "success" | "error"
  >("form");
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentState("form");
      setPaymentIntentId("");
      setErrorMessage("");
    }
  }, [isOpen]);

  // Handle successful payment
  const handlePaymentSuccess = (intentId: string) => {
    setPaymentIntentId(intentId);
    setPaymentState("success");
    onSuccess(intentId);
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
    setPaymentState("error");
    onError(error);
  };

  // Handle retry payment
  const handleRetry = () => {
    setPaymentState("form");
    setErrorMessage("");
  };

  // Handle modal close
  const handleClose = useCallback(() => {
    setPaymentState("form");
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
        <div
          className={`relative bg-white rounded-xl shadow-2xl border border-gray-200/50 max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
            isAnimating
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-4"
          }`}
        >
          {/* Close button - only show for form state */}
          {paymentState === "form" && (
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
          <div className="p-6">
            {paymentState === "form" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Zahlung abschließen
                  </h2>
                  <p className="text-gray-600">
                    Schließen Sie Ihre NEST-Haus Konfiguration mit einer
                    sicheren Zahlung ab.
                  </p>
                </div>

                <StripeTest />

                <PaymentErrorBoundary
                  onError={(error) => handlePaymentError(error.message)}
                >
                  <StripeCheckoutForm
                    amount={amount}
                    currency={currency}
                    customerEmail={customerEmail}
                    customerName={customerName}
                    inquiryId={inquiryId}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onCancel={handleClose}
                  />
                </PaymentErrorBoundary>
              </div>
            )}

            {paymentState === "success" && (
              <PaymentSuccess
                paymentIntentId={paymentIntentId}
                amount={amount}
                currency={currency}
                onClose={handleClose}
              />
            )}

            {paymentState === "error" && (
              <PaymentError
                error={errorMessage}
                onRetry={handleRetry}
                onClose={handleClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal using portal
  return createPortal(modalContent, document.body);
}
