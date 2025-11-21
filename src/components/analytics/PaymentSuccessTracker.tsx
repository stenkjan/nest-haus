"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackPurchase } from '@/lib/ga4-tracking';

/**
 * PaymentSuccessTracker
 * 
 * Tracks GA4 purchase event when payment is successful
 * Triggered by payment_intent query parameter from Stripe redirect
 */
export default function PaymentSuccessTracker() {
  const searchParams = useSearchParams();
  
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
            // Clean up old tracking flags (older than 7 days)
            const now = Date.now();
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('purchase_tracked_')) {
                const timestamp = localStorage.getItem(`${key}_timestamp`);
                if (timestamp && (now - parseInt(timestamp)) > 7 * 24 * 60 * 60 * 1000) {
                  localStorage.removeItem(key);
                  localStorage.removeItem(`${key}_timestamp`);
                }
              }
            });
            localStorage.setItem(`${trackedKey}_timestamp`, now.toString());
          }
          
          console.log('✅ Purchase event tracked:', transactionId);
        }
      } catch (error) {
        console.error('❌ Failed to fetch payment details for tracking:', error);
      }
    };
    
    fetchPaymentDetails();
  }, [searchParams]);
  
  return null; // This component doesn't render anything
}

