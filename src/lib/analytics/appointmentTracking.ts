/**
 * Appointment Booking Tracking Utilities
 * 
 * Centralized tracking functions for appointment booking flow
 * Integrates with user session tracking system
 */

interface AppointmentInteractionData {
  eventType: string;
  category: string;
  elementId: string;
  selectionValue?: string;
  previousValue?: string;
  additionalData?: Record<string, unknown>;
}

/**
 * Track interaction with backend API
 */
async function trackInteraction(sessionId: string, interaction: AppointmentInteractionData): Promise<void> {
  try {
    const response = await fetch('/api/sessions/track-interaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        interaction,
      }),
    });

    if (!response.ok) {
      console.warn('⚠️ Tracking API returned error:', response.status);
    }
  } catch (error) {
    console.warn('⚠️ Failed to track interaction (non-blocking):', error);
    // Don't throw - tracking failures shouldn't break user experience
  }
}

/**
 * Track when appointment booking form is viewed
 */
export async function trackAppointmentFormView(sessionId: string): Promise<void> {
  console.log('📊 Tracking appointment form view');

  await trackInteraction(sessionId, {
    eventType: 'page_view',
    category: 'appointment_booking',
    elementId: 'terminvereinbarung_form',
    additionalData: {
      formType: 'appointment_booking',
      timestamp: Date.now(),
    },
  });
}

/**
 * Track when user selects a date on the calendar
 */
export async function trackDateSelection(
  sessionId: string,
  selectedDate: Date,
  previousDate?: Date
): Promise<void> {
  console.log('📊 Tracking date selection:', selectedDate.toISOString().split('T')[0]);

  await trackInteraction(sessionId, {
    eventType: 'click',
    category: 'appointment_booking',
    elementId: 'calendar_date_select',
    selectionValue: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
    previousValue: previousDate?.toISOString().split('T')[0],
    additionalData: {
      dayOfWeek: selectedDate.getDay(),
      timestamp: Date.now(),
    },
  });
}

/**
 * Track when user selects a time slot
 */
export async function trackTimeSlotSelection(
  sessionId: string,
  timeSlot: string,
  isPrevious: boolean = false,
  previousTimeSlot?: string
): Promise<void> {
  console.log('📊 Tracking time slot selection:', timeSlot);

  await trackInteraction(sessionId, {
    eventType: 'click',
    category: 'appointment_booking',
    elementId: isPrevious ? 'time_slot_previous' : 'time_slot_next',
    selectionValue: timeSlot,
    previousValue: previousTimeSlot,
    additionalData: {
      navigation: isPrevious ? 'previous' : 'next',
      timestamp: Date.now(),
    },
  });
}

/**
 * Track when user submits appointment booking form
 */
export async function trackAppointmentSubmission(
  sessionId: string,
  appointmentData: {
    date: Date;
    timeSlot: string;
    appointmentType: 'personal' | 'phone';
    customerEmail: string;
    customerName: string;
    inquiryId?: string;
  }
): Promise<void> {
  console.log('📊 Tracking appointment submission');

  await trackInteraction(sessionId, {
    eventType: 'form_submit',
    category: 'conversion',
    elementId: 'appointment_booking_submit',
    selectionValue: `${appointmentData.date.toISOString().split('T')[0]}_${appointmentData.timeSlot}`,
    additionalData: {
      appointmentType: appointmentData.appointmentType,
      appointmentDate: appointmentData.date.toISOString(),
      timeSlot: appointmentData.timeSlot,
      customerEmail: appointmentData.customerEmail,
      customerName: appointmentData.customerName,
      inquiryId: appointmentData.inquiryId,
      timestamp: Date.now(),
      conversionType: 'appointment_booking',
    },
  });
}

/**
 * Track when user changes appointment type (personal vs phone)
 */
export async function trackAppointmentTypeChange(
  sessionId: string,
  newType: 'personal' | 'phone',
  previousType?: 'personal' | 'phone'
): Promise<void> {
  console.log('📊 Tracking appointment type change:', newType);

  await trackInteraction(sessionId, {
    eventType: 'selection',
    category: 'appointment_booking',
    elementId: 'appointment_type_select',
    selectionValue: newType,
    previousValue: previousType,
    additionalData: {
      timestamp: Date.now(),
    },
  });
}

/**
 * Track when user fills out form fields
 */
export async function trackFormFieldCompletion(
  sessionId: string,
  fieldName: string,
  hasValue: boolean
): Promise<void> {
  await trackInteraction(sessionId, {
    eventType: 'input',
    category: 'appointment_booking',
    elementId: `appointment_form_${fieldName}`,
    selectionValue: hasValue ? 'completed' : 'cleared',
    additionalData: {
      fieldName,
      timestamp: Date.now(),
    },
  });
}
