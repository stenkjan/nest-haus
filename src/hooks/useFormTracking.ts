/**
 * Form Analytics Tracking Hook
 * 
 * Tracks form interactions, abandonment, and completion for conversion optimization
 */

import { useEffect, useRef, useState } from 'react';
import {
  trackFormStart,
  trackFormFieldInteraction,
  trackFormAbandonment,
  trackFormValidationError,
} from '@/lib/analytics/enhanced-tracking';

interface UseFormTrackingOptions {
  formId: string;
  formType: 'appointment' | 'contact' | 'grundstueck' | 'checkout';
  fields: string[]; // List of field names to track
  onAbandon?: (data: {
    fieldsCompleted: string[];
    completionRate: number;
    timeSpent: number;
  }) => void;
}

export function useFormTracking({
  formId,
  formType,
  fields,
  onAbandon,
}: UseFormTrackingOptions) {
  const [formStarted, setFormStarted] = useState(false);
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const startTimeRef = useRef<number>(0);
  const abandonTrackedRef = useRef(false);

  // Track form start on first field interaction
  const handleFieldFocus = (fieldName: string) => {
    if (!formStarted) {
      setFormStarted(true);
      startTimeRef.current = Date.now();
      trackFormStart(formId, formType);
    }

    trackFormFieldInteraction({
      formId,
      fieldName,
      fieldType: 'text', // Could be enhanced to detect input type
      action: 'focus',
    });
  };

  // Track field completion
  const handleFieldBlur = (fieldName: string, hasValue: boolean) => {
    trackFormFieldInteraction({
      formId,
      fieldName,
      fieldType: 'text',
      action: 'blur',
    });

    if (hasValue) {
      setCompletedFields(prev => new Set([...prev, fieldName]));
    }
  };

  // Track field changes
  const handleFieldChange = (fieldName: string) => {
    trackFormFieldInteraction({
      formId,
      fieldName,
      fieldType: 'text',
      action: 'change',
    });
  };

  // Track validation errors
  const handleValidationError = (fieldName: string, errorType: string, errorMessage?: string) => {
    trackFormValidationError({
      formId,
      fieldName,
      errorType,
      errorMessage,
    });
  };

  // Track form abandonment on unmount or page leave
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (formStarted && !abandonTrackedRef.current) {
        const timeSpent = Date.now() - startTimeRef.current;
        const fieldsCompletedArray = Array.from(completedFields);

        trackFormAbandonment({
          formId,
          formType,
          fieldsCompleted: fieldsCompletedArray,
          totalFields: fields.length,
          timeSpent,
        });

        if (onAbandon) {
          onAbandon({
            fieldsCompleted: fieldsCompletedArray,
            completionRate: (fieldsCompletedArray.length / fields.length) * 100,
            timeSpent,
          });
        }

        abandonTrackedRef.current = true;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Track abandonment on unmount if form was started but not submitted
      if (formStarted && !abandonTrackedRef.current) {
        const timeSpent = Date.now() - startTimeRef.current;
        const fieldsCompletedArray = Array.from(completedFields);

        if (timeSpent > 3000) { // Only track if user spent > 3 seconds
          trackFormAbandonment({
            formId,
            formType,
            fieldsCompleted: fieldsCompletedArray,
            totalFields: fields.length,
            timeSpent,
          });

          if (onAbandon) {
            onAbandon({
              fieldsCompleted: fieldsCompletedArray,
              completionRate: (fieldsCompletedArray.length / fields.length) * 100,
              timeSpent,
            });
          }
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formStarted, completedFields, fields.length, formId, formType]);

  // Mark form as submitted (prevents abandonment tracking)
  const markFormSubmitted = () => {
    abandonTrackedRef.current = true;
  };

  return {
    handleFieldFocus,
    handleFieldBlur,
    handleFieldChange,
    handleValidationError,
    markFormSubmitted,
    formStarted,
    completedFields: Array.from(completedFields),
    completionRate: (completedFields.size / fields.length) * 100,
  };
}
