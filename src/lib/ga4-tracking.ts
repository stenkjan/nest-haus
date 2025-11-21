/**
 * Google Analytics 4 Event Tracking
 * 
 * Client-side utility for pushing events to Google Analytics dataLayer
 */

// Extend Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

/**
 * Initialize dataLayer if it doesn't exist
 */
function initDataLayer() {
  window.dataLayer = window.dataLayer || [];
}

/**
 * Push an event to Google Analytics dataLayer
 */
function pushEvent(event: Record<string, unknown>) {
  initDataLayer();
  window.dataLayer.push(event);
  console.log('📊 GA4 Event:', event);
}

/**
 * Track form submission (lead generation)
 */
export function trackFormSubmit(formId: string, additionalData?: Record<string, unknown>) {
  pushEvent({
    event: 'generate_lead',
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
  pushEvent({
    event: 'generate_lead',
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
  pushEvent({
    event: 'generate_lead',
    form_id: 'kontaktformular_footer',
    event_category: 'contact',
    request_type: data?.requestType || 'contact',
    preferred_contact: data?.preferredContact || 'email',
  });
}

/**
 * Track configuration completion
 */
export function trackConfigurationComplete(data: {
  nestType?: string;
  planungspaket?: string;
  totalPrice?: number;
}) {
  pushEvent({
    event: 'begin_checkout',
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
  pushEvent({
    event: 'page_view',
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
  pushEvent({
    event: 'click',
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
  pushEvent({
    event: eventName,
    ...data,
  });
}

