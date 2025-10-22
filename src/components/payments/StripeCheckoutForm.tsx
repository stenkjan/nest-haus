"use client";

import React, { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe with error handling
let stripePromise: Promise<import("@stripe/stripe-js").Stripe | null> | null = null;

const getStripePromise = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error("❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
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
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
}

interface StripeCheckoutFormProps {
  amount: number;
  currency?: string;
  customerEmail: string;
  customerName: string;
  inquiryId?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

// Payment element options for better payment method display
const paymentElementOptions = {
  layout: {
    type: "tabs" as const, // Show payment methods as tabs for better visibility
    defaultCollapsed: false,
    radios: false, // Use tabs instead of radio buttons for better UX
    spacedAccordionItems: true, // Better spacing for multiple methods
  },
  fields: {
    billingDetails: "auto" as const, // Collect billing details automatically
  },
  wallets: {
    applePay: "auto" as const,
    googlePay: "auto" as const,
  },
};

// Payment form component (inside Elements provider)
function PaymentForm({
  clientSecret: _clientSecret,
  customerEmail: _customerEmail,
  customerName: _customerName,
  amount,
  currency,
  onSuccess,
  onError,
  onLoading,
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
      // Confirm payment with Stripe using the modern confirmPayment method
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/warenkorb?payment=success`,
        },
        redirect: "if_required", // Only redirect if necessary (e.g., for 3D Secure)
      });

      if (error) {
        console.error("❌ Payment confirmation error:", error);
        const errorMsg =
          error.message || "Ein unbekannter Fehler ist aufgetreten.";
        setErrorMessage(errorMsg);
        onError(errorMsg);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("✅ Payment succeeded:", paymentIntent.id);

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
            console.log("✅ Payment confirmed on backend");
            onSuccess(paymentIntent.id);
          } else {
            console.error("❌ Backend confirmation failed:", result);
            onError(
              result.message ||
                "Zahlung erfolgreich, aber Bestätigung fehlgeschlagen."
            );
          }
        } catch (backendError) {
          console.error("❌ Backend confirmation error:", backendError);
          onError("Zahlung erfolgreich, aber Bestätigung fehlgeschlagen.");
        }
      }
    } catch (paymentError) {
      console.error("❌ Payment processing error:", paymentError);
      onError("Fehler bei der Zahlungsverarbeitung.");
    } finally {
      setIsProcessing(false);
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zahlungsmethode wählen
        </label>
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <PaymentElement options={paymentElementOptions} />
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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

      <div className="bg-gray-50 rounded-lg p-4">
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

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          isProcessing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Zahlung wird verarbeitet...
          </div>
        ) : (
          `Jetzt bezahlen`
        )}
      </button>
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
        console.log("💳 Creating payment intent for amount:", amount);

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
            metadata: {
              source: "warenkorb-checkout",
            },
          }),
        });

        const data = await response.json();

        if (response.ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
          console.log("✅ Payment intent created successfully");
        } else {
          console.error("❌ Failed to create payment intent:", data);
          onError(data.message || "Fehler beim Erstellen der Zahlung.");
        }
      } catch (error) {
        console.error("❌ Error creating payment intent:", error);
        onError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, currency, customerEmail, customerName, inquiryId, onError]);

  // Stripe Elements options optimized for PaymentElement
  const elementsOptions: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#3b82f6",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, -apple-system, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
      rules: {
        ".Tab": {
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        },
        ".Tab--selected": {
          borderColor: "#3b82f6",
          backgroundColor: "#eff6ff",
        },
      },
    },
    // Ensure EUR currency and Austrian locale for better payment method selection
    locale: "de",
    // Provide default billing details for Austrian customers
    defaultValues: {
      billingDetails: {
        address: {
          country: "AT",
        },
      },
    },
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
      <div className="bg-white rounded-lg p-6">
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
            onSuccess={onSuccess}
            onError={onError}
            onLoading={setPaymentLoading}
          />
        </Elements>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            disabled={paymentLoading}
            className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            Abbrechen
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>🔒 SSL verschlüsselt</span>
          <span>•</span>
          <span>Powered by Stripe</span>
        </div>
      </div>
    </div>
  );
}
