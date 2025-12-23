/**
 * Google Analytics 4 Event Tracking
 * 
 * Client-side utility for tracking events in Google Analytics 4
 * Uses both gtag (direct GA4) and dataLayer (for GTM compatibility)
 */

/**
 * Initialize dataLayer if it doesn't exist
 */
function initDataLayer() {
  window.dataLayer = window.dataLayer || [];
}

/**
 * Push an event to both gtag (GA4) and dataLayer (GTM)
 */
function pushEvent(eventName: string, eventParams: Record<string, unknown>) {
  initDataLayer();

  // Enrich event parameters with hostname for multi-domain tracking
  const enrichedParams = {
    ...eventParams,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
  };

  // Push to dataLayer for GTM compatibility
  const dataLayerEvent = {
    event: eventName,
    ...enrichedParams,
  };
  window.dataLayer.push(dataLayerEvent);
  console.log('📊 DataLayer Event:', dataLayerEvent);

  // Send directly to GA4 via gtag
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, enrichedParams);
    console.log('📈 GA4 Event (gtag):', eventName, enrichedParams);
  } else {
    console.warn('⚠️ gtag not available - event only pushed to dataLayer');
  }
}

/**
 * Track form submission (lead generation)
 */
export function trackFormSubmit(formId: string, additionalData?: Record<string, unknown>) {
  pushEvent('generate_lead', {
    form_id: formId,
    ...additionalData,
  });
}

/**
 * Track appointment booking
 */
export function trackAppointmentBooking(data: {
  date?: string;
  time?: string;
  appointmentType?: string;
  timeSlotAvailable?: boolean;
}) {
  pushEvent('generate_lead', {
    form_id: 'terminbuchung_formular',
    event_category: 'appointment',
    event_label: data.appointmentType || 'Beratungstermin',
    appointment_date: data.date,
    appointment_time: data.time,
    time_slot_available: data.timeSlotAvailable,
  });
}

/**
 * Track contact form submission
 */
export function trackContactFormSubmit(data?: {
  requestType?: string;
  preferredContact?: string;
}) {
  pushEvent('generate_lead', {
    form_id: 'kontaktformular_footer',
    event_category: 'contact',
    request_type: data?.requestType || 'contact',
    preferred_contact: data?.preferredContact || 'email',
  });
}

/**
 * Track Grundstückscheck form submission
 * Triggered when user clicks "Speichern" button to submit property check data
 */
export function trackGrundstueckCheckSubmit(data?: {
  location?: string; // 'kontakt' or 'checkout'
  hasPropertyNumber?: boolean;
  hasCadastralCommunity?: boolean;
}) {
  pushEvent('grundstueck_check_submit', {
    form_id: 'grundstueck_check_formular',
    event_category: 'property_check',
    event_label: data?.location || 'unknown',
    property_number_provided: data?.hasPropertyNumber || false,
    cadastral_community_provided: data?.hasCadastralCommunity || false,
  });
}

/**
 * Track configuration completion (when user adds to cart)
 */
export function trackConfigurationComplete(data: {
  houseModel?: string;
  priceEstimated?: number;
  customizationOptions?: string[];
}) {
  // Convert customization options array to pipe-separated string
  const customizationString = data.customizationOptions?.join('|') || '';

  pushEvent('config_complete', {
    house_model: data.houseModel || 'Unknown',
    price_estimated: data.priceEstimated || 0,
    customization_options: customizationString,
  });
}

/**
 * Track add to cart (ecommerce event)
 */
export function trackAddToCart(data: {
  itemId?: string;
  itemName?: string;
  price?: number;
  quantity?: number;
}) {
  pushEvent('add_to_cart', {
    ecommerce: {
      currency: 'EUR',
      value: data.price || 0,
      items: [{
        item_id: data.itemId || 'HOUSE-CONF-UNKNOWN',
        item_name: data.itemName || 'Hoam Configuration',
        price: data.price || 0,
        quantity: data.quantity || 1,
      }]
    }
  });
}

/**
 * Track begin checkout (when user enters warenkorb to pay for Konzept-Check)
 * VALUE: Always use Konzept-Check price (€3,000) to match purchase event
 * ITEMS: Include house configuration if present (for context), but value reflects payment only
 */
export function trackBeginCheckout(data: {
  value: number; // Konzept-Check price in EUR (e.g., 3000.00)
  items: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    price: number;
    quantity: number;
  }>;
  hasConfiguration?: boolean; // Whether user has house config in cart
  configurationValue?: number; // House intent value for custom dimension
}) {
  pushEvent('begin_checkout', {
    ecommerce: {
      currency: 'EUR',
      value: data.value, // CRITICAL: Use payment value (€3k), NOT house value (€150k)
      items: data.items,
    },
    // Custom parameters for segmentation
    has_house_configuration: data.hasConfiguration || false,
    house_intent_value: data.configurationValue || 0, // Track separately for analysis
  });
}

/**
 * Track purchase (ecommerce event)
 */
export function trackPurchase(data: {
  transactionId?: string;
  value?: number;
  itemId?: string;
  itemName?: string;
  price?: number;
  quantity?: number;
}) {
  pushEvent('purchase', {
    ecommerce: {
      transaction_id: data.transactionId || `T-${new Date().getFullYear()}-${Math.random().toString(16).slice(2)}`,
      value: data.value || 0,
      currency: 'EUR',
      items: [{
        item_id: data.itemId || 'KONZEPT-CHECK-001',
        item_name: data.itemName || 'Konzeptcheck (Kauf)',
        price: data.price || 0,
        quantity: data.quantity || 1,
      }]
    }
  });
}

/**
 * Track configuration completion (legacy - for backward compatibility)
 * @deprecated Use trackConfigurationComplete instead
 */
export function trackConfigurationCompleteOld(data: {
  nestType?: string;
  planungspaket?: string;
  totalPrice?: number;
}) {
  pushEvent('begin_checkout', {
    event_category: 'ecommerce',
    value: data.totalPrice,
    currency: 'EUR',
    items: [
      {
        item_name: data.nestType || 'Unknown Nest',
        item_category: 'tiny_house',
        price: data.totalPrice,
      },
    ],
  });
}

/**
 * Track page view (manual tracking for SPAs)
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  pushEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });
}

/**
 * Track button/link clicks
 */
export function trackClick(data: {
  elementId?: string;
  elementText?: string;
  elementType?: string;
  destination?: string;
}) {
  pushEvent('click', {
    event_category: 'engagement',
    element_id: data.elementId,
    element_text: data.elementText,
    element_type: data.elementType,
    click_destination: data.destination,
  });
}

/**
 * Track custom events
 */
export function trackCustomEvent(eventName: string, data?: Record<string, unknown>) {
  pushEvent(eventName, data || {});
}

