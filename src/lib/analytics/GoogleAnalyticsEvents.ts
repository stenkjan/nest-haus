/**
 * Google Analytics 4 Event Tracking
 * 
 * Custom event tracking integrated with existing analytics system
 * Sends relevant events to GA4 for demographics and marketing insights
 */

/**
 * Track page view in GA4
 */
export const trackPageView = (url: string, title: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: title,
      page_location: url,
      page_path: new URL(url).pathname,
    })
  }
}

/**
 * Track configuration started
 */
export const trackConfigurationStarted = (nestType: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'EUR',
      items: [{
        item_id: nestType,
        item_name: `Hoam-House ${nestType}`,
        item_category: 'Modulhaus',
        quantity: 1,
      }]
    })
  }
}

/**
 * Track configuration completed
 */
export const trackConfigurationCompleted = (
  nestType: string,
  totalPrice: number,
  configuration: Record<string, string>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'EUR',
      value: totalPrice / 100, // Convert cents to euros
      items: [{
        item_id: nestType,
        item_name: `Hoam-House ${nestType}`,
        item_category: 'Modulhaus',
        item_variant: configuration.gebaeudehuelle,
        price: totalPrice / 100,
        quantity: 1,
      }]
    })
  }
}

/**
 * Track inquiry form submission (cart reached)
 */
export const trackInquiryStarted = (totalPrice: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'EUR',
      value: totalPrice / 100,
      checkout_step: 1,
    })
  }
}

/**
 * Track inquiry form completed
 */
export const trackInquiryCompleted = (
  sessionId: string,
  totalPrice: number,
  _customerEmail: string
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: sessionId,
      value: totalPrice / 100,
      currency: 'EUR',
      items: [{
        item_id: 'inquiry',
        item_name: 'Hoam-House Anfrage',
        item_category: 'Inquiry',
        price: 0,
        quantity: 1,
      }]
    })

    // Set user properties for segmentation
    window.gtag('set', 'user_properties', {
      customer_type: 'inquiry',
      inquiry_value: totalPrice / 100,
    })
  }
}

/**
 * Track Konzept-check purchase
 */
export const trackKonzeptcheckPurchase = (
  sessionId: string,
  amount: number,
  paymentMethod: string
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: sessionId,
      value: amount / 100,
      currency: 'EUR',
      payment_type: paymentMethod,
      items: [{
        item_id: 'konzeptcheck',
        item_name: 'Konzept-Check',
        item_category: 'Service',
        price: amount / 100,
        quantity: 1,
      }]
    })

    // Track as conversion
    window.gtag('event', 'conversion', {
      send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Update with actual conversion ID
      value: amount / 100,
      currency: 'EUR',
      transaction_id: sessionId,
    })
  }
}

/**
 * Track custom interaction events
 */
export const trackInteraction = (
  category: string,
  action: string,
  label: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

/**
 * Track button clicks
 */
export const trackButtonClick = (buttonId: string, location: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'engagement',
      event_label: buttonId,
      page_location: location,
    })
  }
}

/**
 * Track video plays
 */
export const trackVideoPlay = (videoName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'video_start', {
      video_title: videoName,
    })
  }
}

/**
 * Track form field interactions
 */
export const trackFormFieldFocus = (formId: string, fieldName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_start', {
      form_id: formId,
      form_name: fieldName,
    })
  }
}

/**
 * Track search (if implemented)
 */
export const trackSearch = (searchTerm: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
    })
  }
}

/**
 * Track outbound links
 */
export const trackOutboundLink = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'outbound',
      event_label: url,
      transport_type: 'beacon',
    })
  }
}

/**
 * Track file downloads
 */
export const trackDownload = (fileName: string, fileType: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'file_download', {
      file_name: fileName,
      file_extension: fileType,
    })
  }
}

