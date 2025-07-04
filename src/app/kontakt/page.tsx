'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { HybridBlobImage } from '@/components/images';

// Type definitions
interface ConfigurationData {
  totalPrice?: number;
  selections?: Record<string, unknown>;
  [key: string]: unknown;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  bestTimeToCall?: string;
  configurationData?: ConfigurationData;
  appointmentDate?: string;
  appointmentTime?: string;
}

interface FormErrors {
  [key: string]: string;
}

// Google Analytics gtag function type
interface GtagWindow extends Window {
  gtag?: (command: string, event: string, params?: Record<string, unknown>) => void;
}

declare const window: GtagWindow;

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredContact: 'email',
    bestTimeToCall: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formType, setFormType] = useState<'contact' | 'appointment'>('contact');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }

    if (formData.preferredContact === 'phone' && !formData.phone?.trim()) {
      newErrors.phone = 'Telefonnummer ist erforderlich für Telefon-Kontakt';
    }

    if (formType === 'appointment') {
      if (!formData.appointmentDate) {
        newErrors.appointmentDate = 'Terminwunsch ist erforderlich';
      }
      if (!formData.appointmentTime) {
        newErrors.appointmentTime = 'Uhrzeit ist erforderlich';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Get configuration data from store if available
      const configurationData = window?.localStorage?.getItem('configurator-state') 
        ? JSON.parse(window.localStorage.getItem('configurator-state') || '{}') 
        : null;

      const submissionData = {
        ...formData,
        configurationData,
        requestType: formType,
        appointmentDateTime: formType === 'appointment' && formData.appointmentDate && formData.appointmentTime
          ? new Date(`${formData.appointmentDate}T${formData.appointmentTime}`)
          : null,
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        
        // Track successful contact submission
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'contact_form_submission', {
            event_category: 'engagement',
            event_label: formType,
          });
        }
      } else {
        throw new Error('Fehler beim Senden der Nachricht');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setErrors({ submit: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {formType === 'appointment' ? 'Terminanfrage gesendet!' : 'Nachricht gesendet!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {formType === 'appointment' 
                ? 'Wir melden uns in Kürze bei Ihnen, um Ihren Wunschtermin zu bestätigen.'
                : 'Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze bei Ihnen.'
              }
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="primary"
            >
              Zur Startseite
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: 'var(--navbar-height, 3.5rem)' }}>
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <HybridBlobImage
          path="kontakt-hero"
          alt="NEST-Haus Kontakt"
          fill
          className="object-cover"
          strategy="ssr"
          isAboveFold={true}
          isCritical={true}
          priority={true}
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Kontakt</h1>
            <p className="text-xl md:text-2xl">Lassen Sie uns Ihr Traumhaus planen</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            {/* Form Type Selection */}
            <div className="mb-8">
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setFormType('contact')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    formType === 'contact' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Allgemeine Anfrage
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('appointment')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    formType === 'appointment' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Beratungstermin
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ihr vollständiger Name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-Mail *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ihre.email@beispiel.de"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon {formData.preferredContact === 'phone' ? '*' : '(optional)'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+49 123 456789"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Bevorzugte Kontaktart
                </label>
                <select
                  name="preferredContact"
                  id="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email">E-Mail</option>
                  <option value="phone">Telefon</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              {/* Best Time to Call (if phone contact) */}
              {formData.preferredContact !== 'email' && (
                <div>
                  <label htmlFor="bestTimeToCall" className="block text-sm font-medium text-gray-700 mb-1">
                    Beste Anrufzeit
                  </label>
                  <input
                    type="text"
                    name="bestTimeToCall"
                    id="bestTimeToCall"
                    value={formData.bestTimeToCall}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="z.B. Montag-Freitag 9-17 Uhr"
                  />
                </div>
              )}

              {/* Appointment Date and Time (if appointment type) */}
              {formType === 'appointment' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Wunschtermin *
                    </label>
                    <input
                      type="date"
                      name="appointmentDate"
                      id="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.appointmentDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.appointmentDate && <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>}
                  </div>
                  <div>
                    <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Wunschzeit *
                    </label>
                    <input
                      type="time"
                      name="appointmentTime"
                      id="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.appointmentTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.appointmentTime && <p className="mt-1 text-sm text-red-600">{errors.appointmentTime}</p>}
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Nachricht {formType === 'appointment' ? '(optional)' : ''}
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    formType === 'appointment' 
                      ? "Zusätzliche Informationen für den Beratungstermin..."
                      : "Beschreiben Sie Ihr Anliegen..."
                  }
                />
              </div>

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting 
                    ? 'Wird gesendet...' 
                    : formType === 'appointment' 
                      ? 'Terminanfrage senden' 
                      : 'Nachricht senden'
                  }
                </Button>
                {errors.submit && <p className="mt-2 text-sm text-red-600">{errors.submit}</p>}
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="lg:pl-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Kontaktinformationen</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Adresse</h4>
                <p className="text-gray-600">
                  NEST-Haus GmbH<br />
                  Musterstraße 123<br />
                  12345 Musterstadt
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Telefon</h4>
                <p className="text-gray-600">
                  <a href="tel:+49123456789" className="hover:text-blue-600">
                    +49 123 456 789
                  </a>
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">E-Mail</h4>
                <p className="text-gray-600">
                  <a href="mailto:info@nest-haus.de" className="hover:text-blue-600">
                    info@nest-haus.de
                  </a>
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Öffnungszeiten</h4>
                <div className="text-gray-600 space-y-1">
                  <p>Montag - Freitag: 9:00 - 17:00 Uhr</p>
                  <p>Samstag: 10:00 - 14:00 Uhr</p>
                  <p>Sonntag: Nach Vereinbarung</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 