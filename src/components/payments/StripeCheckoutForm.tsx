"use client";

import React, { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe
let stripePromise: Promise<import("@stripe/stripe-js").Stripe | null> | null =
  null;

const getStripePromise = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      return null;
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

interface PaymentFormProps {
  clientSecret: string;
  customerEmail: string;
  customerName: string;
  amount: number;
  currency: string;
  selectedPaymentMethod?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
  onCancel: () => void;
}

interface StripeCheckoutFormProps {
  amount: number;
  currency?: string;
  customerEmail: string;
  customerName: string;
  inquiryId?: string;
  selectedPaymentMethod?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

// Payment element configuration
const getPaymentElementOptions = (selectedMethod?: string) => {
  // Determine which payment methods to show based on selection
  // Only show card, EPS, and SOFORT in step 2
  // Klarna, Apple Pay, and Google Pay are handled in step 1 (redirect-based)
  let paymentMethodTypes: string[] = ["card", "eps", "sofort"];
  
  if (selectedMethod === "card") {
    paymentMethodTypes = ["card"];
  } else if (selectedMethod === "eps") {
    paymentMethodTypes = ["eps"];
  } else if (selectedMethod === "sofort") {
    paymentMethodTypes = ["sofort"];
  }

  return {
    layout: {
      type: "tabs" as const,
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: true,
    },
    fields: {
      billingDetails: "auto" as const,
    },
    wallets: {
      applePay: "never" as const,
      googlePay: "never" as const,
    },
    paymentMethodOrder: paymentMethodTypes,
  };
};

// Payment form component (inside Elements provider)
function PaymentForm({
  clientSecret: _clientSecret,
  customerEmail: _customerEmail,
  customerName: _customerName,
  amount,
  currency,
  selectedPaymentMethod,
  onSuccess,
  onError,
  onLoading,
  onCancel,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError(
        "Stripe wurde noch nicht geladen. Bitte versuchen Sie es erneut."
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    onLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/warenkorb?payment=success`,
        },
        redirect: "if_required",
      });

      if (error) {
        const errorMsg =
          error.message || "Ein unbekannter Fehler ist aufgetreten.";
        setErrorMessage(errorMsg);
        onError(errorMsg);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Confirm payment on our backend
        try {
          const response = await fetch("/api/payments/confirm-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
            }),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            onSuccess(paymentIntent.id);
          } else {
            onError(
              result.message ||
                "Zahlung erfolgreich, aber Bestätigung fehlgeschlagen."
            );
          }
        } catch {
          onError("Zahlung erfolgreich, aber Bestätigung fehlgeschlagen.");
        }
      }
    } catch {
      onError("Fehler bei der Zahlungsverarbeitung.");
    } finally {
      setIsProcessing(false);
      onLoading(false);
    }
  };

  // Get payment element options with the selected payment method
  const paymentElementOptions = getPaymentElementOptions(selectedPaymentMethod);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zahlungsmethode wählen
        </label>
        <div className="border border-gray-300 rounded-2xl p-4 bg-[#F4F4F4]">
          <PaymentElement options={paymentElementOptions} />
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#F4F4F4] rounded-2xl p-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Zu zahlender Betrag:</span>
          <span className="font-semibold text-gray-900">
            {new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: currency.toUpperCase(),
            }).format(amount / 100)}
          </span>
        </div>
      </div>

      <div className="pt-2 text-center">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mb-4">
          <span>🔒 SSL verschlüsselt</span>
          <span>•</span>
          <span>Powered by Stripe</span>
        </div>
        
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center font-normal whitespace-nowrap bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-400 box-border px-4 py-1.5 text-sm xl:text-base 2xl:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center font-normal whitespace-nowrap bg-[#3D6CE1] border border-[#3D6CE1] text-white hover:bg-[#2E5BC7] hover:border-[#2E5BC7] focus:ring-[#3D6CE1] box-border px-4 py-1.5 text-sm xl:text-base 2xl:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Wird verarbeitet...
              </div>
            ) : (
              "Jetzt bezahlen"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

// Main Stripe checkout form component
export default function StripeCheckoutForm({
  amount,
  currency = "eur",
  customerEmail,
  customerName,
  inquiryId,
  selectedPaymentMethod,
  onSuccess,
  onError,
  onCancel,
}: StripeCheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Create payment intent on component mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        // Determine payment method types to enable
        const paymentMethodTypes = ["card", "eps", "sofort"];
        
        const response = await fetch("/api/payments/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency,
            customerEmail,
            customerName,
            inquiryId,
            paymentMethodTypes, // Specify allowed payment methods
            metadata: {
              source: "warenkorb-checkout",
              selectedMethod: selectedPaymentMethod || "card",
            },
          }),
        });

        const data = await response.json();

        if (response.ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          onError(data.message || "Fehler beim Erstellen der Zahlung.");
        }
      } catch {
        onError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, currency, customerEmail, customerName, inquiryId, selectedPaymentMethod, onError]);

  const elementsOptions: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#3D6CE1",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, -apple-system, sans-serif",
        spacingUnit: "4px",
        borderRadius: "16px",
      },
      rules: {
        ".Tab": {
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
        },
        ".Tab--selected": {
          borderColor: "#3D6CE1",
          backgroundColor: "#ffffff",
        },
        ".Input": {
          backgroundColor: "#ffffff",
          borderRadius: "12px",
        },
        ".Label": {
          color: "#374151",
        },
      },
    },
    locale: "de",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <svg
            className="animate-spin h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-gray-600">
            Zahlungsformular wird geladen...
          </span>
        </div>
      </div>
    );
  }

  const currentStripePromise = getStripePromise();

  if (!currentStripePromise) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p className="text-gray-600 mb-4">
          Stripe-Konfiguration fehlt. Bitte kontaktieren Sie den Support.
        </p>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Zurück
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p className="text-gray-600 mb-4">
          Zahlungsformular konnte nicht geladen werden.
        </p>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Zurück
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sichere Zahlung
        </h3>
        <p className="text-sm text-gray-600">
          Ihre Zahlungsdaten werden verschlüsselt übertragen und sicher
          verarbeitet.
        </p>
      </div>

      <Elements stripe={currentStripePromise} options={elementsOptions}>
        <PaymentForm
          clientSecret={clientSecret}
          customerEmail={customerEmail}
          customerName={customerName}
          amount={amount}
          currency={currency}
          selectedPaymentMethod={selectedPaymentMethod}
          onSuccess={onSuccess}
          onError={onError}
          onLoading={setPaymentLoading}
          onCancel={onCancel}
        />
      </Elements>
    </div>
  );
}
