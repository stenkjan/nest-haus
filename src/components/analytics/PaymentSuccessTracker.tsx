"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackPurchase } from '@/lib/ga4-tracking';
import { useConfiguratorStore } from '@/store/configuratorStore';

/**
 * PaymentSuccessTrackerInner
 * 
 * Inner component that uses useSearchParams
 * Must be wrapped in Suspense boundary
 * 
 * Tracks purchase events from TWO sources:
 * 1. URL parameters (redirect-based payments like EPS, SOFORT)
 * 2. Session configuration data (webhook-triggered, all payment types)
 */
function PaymentSuccessTrackerInner() {
  const searchParams = useSearchParams();
  const { configuration } = useConfiguratorStore();
  
  // Track purchase from URL parameters (redirect-based payments)
  useEffect(() => {
    const paymentIntent = searchParams?.get('payment_intent');
    const paymentIntentClientSecret = searchParams?.get('payment_intent_client_secret');
    
    // Only track if we have payment parameters (indicates redirect from Stripe)
    if (!paymentIntent || !paymentIntentClientSecret) {
      return;
    }
    
    // Check if we've already tracked this purchase (prevent double-tracking)
    const trackedKey = `purchase_tracked_${paymentIntent}`;
    if (typeof window !== 'undefined' && localStorage.getItem(trackedKey)) {
      console.log('📊 Purchase already tracked for payment:', paymentIntent);
      return;
    }
    
    // Fetch payment details from our API
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`/api/payments/verify-redirect?payment_intent=${paymentIntent}`);
        const data = await response.json();
        
        if (data.success && data.status === 'succeeded') {
          // Payment successful - track purchase event
          const transactionId = `T-${new Date().getFullYear()}-${paymentIntent.substring(paymentIntent.length - 8)}`;
          const amount = data.amount / 100; // Convert from cents to euros
          
          trackPurchase({
            transactionId,
            value: amount,
            itemId: 'KONZEPT-CHECK-001',
            itemName: 'Konzeptcheck (Kauf)',
            price: amount,
            quantity: 1,
          });
          
          // Mark as tracked
          if (typeof window !== 'undefined') {
            localStorage.setItem(trackedKey, 'true');
            localStorage.setItem(`${trackedKey}_timestamp`, Date.now().toString());
          }
          
          console.log('✅ Purchase event tracked from URL redirect:', transactionId);
        }
      } catch (error) {
        console.error('❌ Failed to fetch payment details for tracking:', error);
      }
    };
    
    fetchPaymentDetails();
  }, [searchParams]);
  
  // Track purchase from session configuration (webhook-triggered purchases)
  useEffect(() => {
    if (!configuration?.sessionId) {
      return;
    }

    // Check session for purchase tracking data set by webhook
    const checkPurchaseData = async () => {
      try {
        const response = await fetch(`/api/sessions/get-session?sessionId=${configuration.sessionId}`);
        const data = await response.json();
        
        if (data.success && data.session?.configurationData) {
          const configData = data.session.configurationData as Record<string, unknown>;
          const purchaseData = configData.purchaseData as {
            transactionId?: string;
            amount?: number;
            currency?: string;
            paymentIntentId?: string;
            timestamp?: string;
          } | undefined;
          
          // Check if purchase was completed and not yet tracked on client
          if (configData.purchaseTracked && purchaseData?.paymentIntentId) {
            const trackedKey = `purchase_tracked_${purchaseData.paymentIntentId}`;
            
            // Check if we've already tracked this purchase
            if (typeof window !== 'undefined' && localStorage.getItem(trackedKey)) {
              console.log('📊 Purchase already tracked for webhook payment:', purchaseData.paymentIntentId);
              return;
            }
            
            // Track the purchase event
            const amount = (purchaseData.amount || 150000) / 100; // Convert from cents to euros
            
            trackPurchase({
              transactionId: purchaseData.transactionId || `T-${new Date().getFullYear()}-${Math.random().toString(16).slice(2)}`,
              value: amount,
              itemId: 'KONZEPT-CHECK-001',
              itemName: 'Konzeptcheck (Kauf)',
              price: amount,
              quantity: 1,
            });
            
            // Mark as tracked
            if (typeof window !== 'undefined') {
              localStorage.setItem(trackedKey, 'true');
              localStorage.setItem(`${trackedKey}_timestamp`, Date.now().toString());
            }
            
            console.log('✅ Purchase event tracked from webhook data:', purchaseData.transactionId);
          }
        }
      } catch (error) {
        console.error('❌ Failed to check session purchase data:', error);
      }
    };
    
    // Check immediately and on mount
    checkPurchaseData();
    
    // Also check periodically in case webhook completes after page load
    const interval = setInterval(checkPurchaseData, 3000); // Check every 3 seconds
    
    // Clean up after 30 seconds (webhook should complete by then)
    const timeout = setTimeout(() => clearInterval(interval), 30000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [configuration?.sessionId]);
  
  return null;
}

/**
 * PaymentSuccessTracker
 * 
 * Tracks GA4 purchase event when payment is successful
 * Triggered by payment_intent query parameter from Stripe redirect
 * Wrapped in Suspense to prevent SSR issues
 */
export default function PaymentSuccessTracker() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessTrackerInner />
    </Suspense>
  );
}

