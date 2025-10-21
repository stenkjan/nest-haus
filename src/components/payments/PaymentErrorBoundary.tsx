"use client";

import React, { Component, ReactNode } from "react";

interface PaymentErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface PaymentErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error) => void;
  fallback?: ReactNode;
}

export default class PaymentErrorBoundary extends Component<
  PaymentErrorBoundaryProps,
  PaymentErrorBoundaryState
> {
  constructor(props: PaymentErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): PaymentErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      "💳 Payment Error Boundary caught an error:",
      error,
      errorInfo
    );

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error);
    }

    // Track error in analytics
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("payment-error", {
            detail: {
              error: error.message,
              stack: error.stack,
              componentStack: errorInfo.componentStack,
            },
          })
        );
      }
    } catch (trackingError) {
      console.warn("Failed to track payment error:", trackingError);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
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

          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Zahlungsfehler
          </h3>

          <p className="text-red-700 mb-4">
            Bei der Zahlungsverarbeitung ist ein unerwarteter Fehler
            aufgetreten.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
              }}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Erneut versuchen
            </button>

            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.reload();
                }
              }}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Seite neu laden
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-600">
            <p>Fehlerdetails: {this.state.error?.message}</p>
            <p className="mt-1">
              Bei anhaltenden Problemen kontaktieren Sie uns unter{" "}
              <a
                href="mailto:support@nest-haus.at"
                className="text-red-600 hover:text-red-800"
              >
                support@nest-haus.at
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
