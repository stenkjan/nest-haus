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

      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        🎉 Zahlung erfolgreich!
      </h3>

      <p className="text-gray-600 mb-8 text-lg">
        Vielen Dank! Ihre Zahlung über <strong>{formattedAmount}</strong> wurde
        erfolgreich verarbeitet und Ihre NEST-Haus Konfiguration ist jetzt
        bestätigt.
      </p>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 border border-green-200">
        <div className="text-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Transaktions-ID:</span>
            <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
              {paymentIntentId}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Betrag:</span>
            <span className="text-green-700 font-bold text-lg">
              {formattedAmount}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Status:</span>
            <span className="text-green-600 font-bold flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Bezahlt
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Datum:</span>
            <span className="text-gray-600">
              {new Date().toLocaleDateString("de-DE")}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Nächste Schritte
        </h4>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              <strong>Bestätigungsmail gesendet</strong> - Prüfen Sie Ihr
              E-Mail-Postfach
            </span>
          </div>
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              <strong>Kontaktaufnahme innerhalb 24h</strong> - Unser Team meldet
              sich bei Ihnen
            </span>
          </div>
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              <strong>Konfiguration in Bearbeitung</strong> - Ihre Planung wird
              vorbereitet
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          ✨ Perfekt! Weiter zur Konfiguration
        </button>

        <div className="text-center text-sm text-gray-500">
          <p>Fragen? Kontaktieren Sie uns:</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a
              href="mailto:info@nest-haus.at"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              📧 info@nest-haus.at
            </a>
            <a
              href="tel:+43123456789"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              📞 +43 123 456 789
            </a>
          </div>
        </div>
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
          🔄 Erneut versuchen
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
            📧{" "}
            <a
              href="mailto:support@nest-haus.at"
              className="text-blue-600 hover:text-blue-800"
            >
              support@nest-haus.at
            </a>
          </p>
          <p>
            📞{" "}
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
          className={`relative bg-white rounded-xl shadow-2xl border border-gray-200/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
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
