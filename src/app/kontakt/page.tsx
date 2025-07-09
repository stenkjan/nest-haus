"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui";

// Section definitions for navigation
const sections = [
  { id: "calendar", title: "Termin vereinbaren", slug: "termin" },
  { id: "contact", title: "Kontakt", slug: "kontakt" },
  { id: "property", title: "Grundstückscheck", slug: "grundstueck" },
  { id: "address", title: "Adresse", slug: "adresse" },
  { id: "impressum", title: "Impressum", slug: "impressum" },
];

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
  preferredContact: "email" | "phone" | "whatsapp";
  bestTimeToCall?: string;
  configurationData?: ConfigurationData;
  appointmentDate?: string;
  appointmentTime?: string;
}

interface CalendarFormData {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  appointmentType: "personal" | "phone";
}

interface PropertyCheckFormData {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  addressLine2: string;
  propertyNumber: string;
  cadastralCommunity: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

// Google Analytics gtag function type
interface GtagWindow extends Window {
  gtag?: (
    command: string,
    event: string,
    params?: Record<string, unknown>
  ) => void;
}

declare const window: GtagWindow;

export default function ContactPage() {
  // Navigation state
  const [currentSection, setCurrentSection] = useState(sections[0].id);

  // Contact form state
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredContact: "email",
    bestTimeToCall: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  // Calendar form state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [visibleTimeIndex, setVisibleTimeIndex] = useState(0);
  const [calendarFormData, setCalendarFormData] = useState<CalendarFormData>({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    appointmentType: "personal",
  });

  // Property check form state
  const [propertyFormData, setPropertyFormData] =
    useState<PropertyCheckFormData>({
      name: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      addressLine2: "",
      propertyNumber: "",
      cadastralCommunity: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Österreich",
      notes: "",
    });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formType, setFormType] = useState<"contact" | "appointment">(
    "contact"
  );

  // Time slots available for booking
  const timeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
  ];

  // Handle URL hash changes for section navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const section = sections.find((s) => s.slug === hash);
      if (section) {
        setCurrentSection(section.id);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Calendar navigation functions
  const prevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // Time slots navigation
  const prevTime = () => {
    if (visibleTimeIndex > 0) {
      setVisibleTimeIndex((prev) => prev - 1);
    }
  };

  const nextTime = () => {
    if (visibleTimeIndex < timeSlots.length - 3) {
      setVisibleTimeIndex((prev) => prev + 1);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name ist erforderlich";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-Mail ist erforderlich";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ungültige E-Mail-Adresse";
    }

    if (formData.preferredContact === "phone" && !formData.phone?.trim()) {
      newErrors.phone = "Telefonnummer ist erforderlich für Telefon-Kontakt";
    }

    if (formType === "appointment") {
      if (!formData.appointmentDate) {
        newErrors.appointmentDate = "Terminwunsch ist erforderlich";
      }
      if (!formData.appointmentTime) {
        newErrors.appointmentTime = "Uhrzeit ist erforderlich";
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
      const configurationData = window?.localStorage?.getItem(
        "configurator-state"
      )
        ? JSON.parse(window.localStorage.getItem("configurator-state") || "{}")
        : null;

      const submissionData = {
        ...formData,
        configurationData,
        requestType: formType,
        appointmentDateTime:
          formType === "appointment" &&
          formData.appointmentDate &&
          formData.appointmentTime
            ? new Date(
                `${formData.appointmentDate}T${formData.appointmentTime}`
              )
            : null,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setIsSubmitted(true);

        // Track successful contact submission
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "contact_form_submission", {
            event_category: "engagement",
            event_label: formType,
          });
        }
      } else {
        throw new Error("Fehler beim Senden der Nachricht");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setErrors({
        submit: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCalendarInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setCalendarFormData((prev) => ({
        ...prev,
        appointmentType: value as "personal" | "phone",
      }));
    } else {
      setCalendarFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePropertyInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPropertyFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCalendarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      alert("Bitte wähle ein Datum aus.");
      return;
    }

    setIsSubmitting(true);

    try {
      const appointmentData = {
        date: selectedDate.toISOString(),
        time: timeSlots[selectedTimeIndex],
        ...calendarFormData,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...appointmentData,
          requestType: "calendar_appointment",
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
        setSelectedDate(null);
        setCalendarFormData({
          name: "",
          lastName: "",
          phone: "",
          email: "",
          appointmentType: "personal",
        });
      } else {
        throw new Error("Fehler beim Buchen des Termins");
      }
    } catch (error) {
      console.error("Calendar appointment error:", error);
      alert("Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...propertyFormData,
          requestType: "property_check",
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
        setPropertyFormData({
          name: "",
          lastName: "",
          phone: "",
          email: "",
          address: "",
          addressLine2: "",
          propertyNumber: "",
          cadastralCommunity: "",
          city: "",
          state: "",
          postalCode: "",
          country: "Österreich",
          notes: "",
        });
      } else {
        throw new Error("Fehler beim Senden der Grundstückscheck-Anfrage");
      }
    } catch (error) {
      console.error("Property check error:", error);
      alert("Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate calendar days
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month (0 = Sunday, 1 = Monday, etc.)
    let firstDay = new Date(year, month, 1).getDay();
    if (firstDay === 0) firstDay = 7; // Adjust Sunday to be 7 instead of 0

    // Last date of the month
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 1; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-center p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= lastDate; day++) {
      const date = new Date(year, month, day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isAvailable = !isPast && !isWeekend;

      days.push(
        <div
          key={day}
          className={`text-center p-2 rounded-full ${
            isToday ? "border border-blue-500" : ""
          } ${isSelected ? "bg-blue-500 text-white" : ""} ${
            !isAvailable
              ? "text-gray-300 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-200"
          }`}
          onClick={() => isAvailable && setSelectedDate(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nachricht erfolgreich gesendet!
            </h2>
            <p className="text-gray-600 mb-6">
              Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze bei Ihnen.
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
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
    <div className="min-h-screen pt-16">
      {/* Section Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.slug}`}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  currentSection === section.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentSection(section.id);
                  window.location.hash = section.slug;
                }}
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Calendar Form Section */}
      {currentSection === "calendar" && (
        <section id="calendar" className="w-full py-16 bg-white">
          <div className="w-full px-[5%]">
            <h2 className="font-inter font-medium text-[60px] tracking-[-0.02em] mb-4 text-center">
              Vereinbare jetzt deinen Termin
            </h2>
            <h3 className="text-2xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-8 max-w-3xl mx-auto text-center">
              Wir helfen gerne.
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
              {/* Info Section */}
              <div className="bg-white p-8 rounded-lg min-h-[600px]">
                <p className="text-lg font-inter font-normal tracking-[-0.015em] leading-[28px] mb-8">
                  Ruf uns an, um dein Beratungsgespräch zu vereinbaren, oder
                  buche deinen Termin hier direkt online. Dein Weg zu deinem
                  Traumhaus beginnt mit einem Gespräch.
                </p>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                  <h4 className="font-inter font-medium text-lg mb-3">
                    Kontakt
                  </h4>
                  <div className="grid grid-cols-[max-content_1fr] gap-x-4 text-lg font-inter font-normal tracking-[-0.015em] leading-[28px]">
                    <span>Telefon:</span>
                    <span>03847 75090</span>
                    <span>Mobil:</span>
                    <span>0664 394 9604</span>
                    <span>Email:</span>
                    <span>hello@nest.at</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                  <h4 className="font-inter font-medium text-lg mb-3">
                    Adresse
                  </h4>
                  <p className="text-lg font-inter font-normal tracking-[-0.015em] leading-[28px]">
                    SustainNest GmbH
                    <br />
                    Karmeliterplatz 1<br />
                    8010 Graz
                    <br />
                    Österreich
                  </p>
                </div>
              </div>

              {/* Calendar Section */}
              <div className="bg-white p-8 rounded-lg min-h-[600px]">
                <form onSubmit={handleCalendarSubmit}>
                  {/* Calendar */}
                  <div className="calendar-container border border-gray-200 rounded-lg p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <button
                        type="button"
                        className="p-2 rounded-full hover:bg-gray-100 text-lg"
                        onClick={prevMonth}
                      >
                        &#10094;
                      </button>
                      <span className="font-inter font-medium text-xl">
                        {currentMonth.toLocaleDateString("de-DE", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        type="button"
                        className="p-2 rounded-full hover:bg-gray-100 text-lg"
                        onClick={nextMonth}
                      >
                        &#10095;
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4 text-center font-inter font-medium text-lg">
                      <div>Mo</div>
                      <div>Di</div>
                      <div>Mi</div>
                      <div>Do</div>
                      <div>Fr</div>
                      <div>Sa</div>
                      <div>So</div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {renderCalendar()}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <button
                      type="button"
                      className="p-2 text-gray-600 text-lg"
                      onClick={prevTime}
                      disabled={visibleTimeIndex === 0}
                    >
                      &#10094;
                    </button>
                    <div className="flex gap-3">
                      {timeSlots
                        .slice(visibleTimeIndex, visibleTimeIndex + 3)
                        .map((time, index) => (
                          <div
                            key={index}
                            className={`time-slot py-3 px-6 border rounded-lg cursor-pointer font-inter font-medium text-lg ${
                              index + visibleTimeIndex === selectedTimeIndex
                                ? "bg-blue-500 text-white"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() =>
                              setSelectedTimeIndex(index + visibleTimeIndex)
                            }
                          >
                            {time}
                          </div>
                        ))}
                    </div>
                    <button
                      type="button"
                      className="p-2 text-gray-600 text-lg"
                      onClick={nextTime}
                      disabled={visibleTimeIndex >= timeSlots.length - 3}
                    >
                      &#10095;
                    </button>
                  </div>

                  {/* Contact Information */}
                  <h3 className="text-2xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-6">
                    Deine Kontaktdaten
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <input
                      type="text"
                      name="name"
                      value={calendarFormData.name}
                      onChange={handleCalendarInputChange}
                      className="border border-gray-300 rounded-md p-3 text-lg font-inter"
                      placeholder="Vorname"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={calendarFormData.lastName}
                      onChange={handleCalendarInputChange}
                      className="border border-gray-300 rounded-md p-3 text-lg font-inter"
                      placeholder="Nachname"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={calendarFormData.phone}
                      onChange={handleCalendarInputChange}
                      className="border border-gray-300 rounded-md p-3 text-lg font-inter"
                      placeholder="Telefon"
                    />
                    <input
                      type="email"
                      name="email"
                      value={calendarFormData.email}
                      onChange={handleCalendarInputChange}
                      className="border border-gray-300 rounded-md p-3 text-lg font-inter"
                      placeholder="Email"
                      required
                    />
                  </div>

                  {/* Appointment Type */}
                  <h3 className="text-2xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-6">
                    Art des Termins
                  </h3>
                  <div className="flex gap-6 mb-8 text-lg font-inter font-normal tracking-[-0.015em] leading-[28px]">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="appointmentType"
                        value="personal"
                        checked={
                          calendarFormData.appointmentType === "personal"
                        }
                        onChange={handleCalendarInputChange}
                        className="mr-2 w-5 h-5"
                      />
                      Persönliches Gespräch
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="appointmentType"
                        value="phone"
                        checked={calendarFormData.appointmentType === "phone"}
                        onChange={handleCalendarInputChange}
                        className="mr-2 w-5 h-5"
                      />
                      Telefonat
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedDate}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-inter font-medium text-lg tracking-[-0.015em] rounded-full px-8 py-3 disabled:bg-gray-400"
                  >
                    {isSubmitting ? "Wird gesendet..." : "Jetzt anfragen"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      {currentSection === "contact" && (
        <section id="contact" className="w-full py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-inter font-medium text-[60px] tracking-[-0.02em] mb-4 text-center">
              Kontakt
            </h2>
            <h3 className="text-2xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-8 max-w-3xl mx-auto text-center">
              Lassen Sie uns Ihr Traumhaus planen
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                {/* Form Type Selection */}
                <div className="mb-8">
                  <div className="flex rounded-lg bg-gray-100 p-1">
                    <button
                      type="button"
                      onClick={() => setFormType("contact")}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        formType === "contact"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Allgemeine Anfrage
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType("appointment")}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        formType === "appointment"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Beratungstermin
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Ihr vollständiger Name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="ihre.email@beispiel.de"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nachricht {formType === "appointment" ? "(optional)" : ""}
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={
                        formType === "appointment"
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
                        ? "Wird gesendet..."
                        : formType === "appointment"
                          ? "Terminanfrage senden"
                          : "Nachricht senden"}
                    </Button>
                    {errors.submit && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.submit}
                      </p>
                    )}
                  </div>
                </form>
              </div>

              {/* Contact Information */}
              <div className="lg:pl-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Kontaktinformationen
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Adresse
                    </h4>
                    <p className="text-gray-600">
                      SustainNest GmbH
                      <br />
                      Karmeliterplatz 1<br />
                      8010 Graz, Österreich
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Telefon
                    </h4>
                    <p className="text-gray-600">
                      <a href="tel:+4338477509" className="hover:text-blue-600">
                        03847 75090
                      </a>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">E-Mail</h4>
                    <p className="text-gray-600">
                      <a
                        href="mailto:hello@nest.at"
                        className="hover:text-blue-600"
                      >
                        hello@nest.at
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Property Check Section */}
      {currentSection === "property" && (
        <section id="property" className="w-full py-16 bg-white">
          <div className="w-full px-[5%]">
            <h2 className="font-inter font-medium text-[60px] tracking-[-0.02em] mb-4 text-center">
              Dein Grundstück - Unser Check
            </h2>
            <h3 className="text-2xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-8 max-w-3xl mx-auto text-center">
              Wir überprüfen für dich wie dein neues Haus auf ein Grundstück
              deiner Wahl passt
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
              {/* Info Section */}
              <div className="bg-white p-6 rounded-lg flex flex-col justify-between">
                <div>
                  <p className="text-lg font-inter font-normal tracking-[-0.015em] leading-[22px] mb-4">
                    Bevor dein Traum vom Nest-Haus Realität wird, ist es
                    wichtig, dass dein Grundstück alle rechtlichen und baulichen
                    Anforderungen erfüllt. Genau hier setzen wir an!
                  </p>
                  <p className="text-lg font-inter font-normal tracking-[-0.015em] leading-[22px] mb-6">
                    Für nur € 200,- übernehmen wir für dich die Prüfung der
                    relevanten Rahmenbedingungen und Baugesetze, um dir
                    Sicherheit und Klarheit zu verschaffen.
                  </p>
                </div>

                <div className="mt-auto text-sm space-y-4">
                  <div>
                    <h4 className="font-inter font-medium mb-1">
                      Was wir prüfen
                    </h4>
                    <p className="text-base font-inter font-normal tracking-[-0.015em] leading-[16px]">
                      Rechtliche Rahmenbedingungen: Wir prüfen, ob dein
                      Grundstück den Vorgaben des jeweiligen Landes-Baugesetzes
                      entspricht.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-inter font-medium mb-1">Baugesetze</h4>
                    <p className="text-base font-inter font-normal tracking-[-0.015em] leading-[16px]">
                      Alle relevanten Bauvorschriften werden detailliert
                      überprüft, um sicherzustellen, dass dein Bauvorhaben
                      genehmigungsfähig ist.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="bg-white p-6 rounded-lg">
                <form onSubmit={handlePropertySubmit} className="space-y-4">
                  <h3 className="text-xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-4">
                    Daten Bewerber
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      name="name"
                      value={propertyFormData.name}
                      onChange={handlePropertyInputChange}
                      className="border border-gray-300 rounded-md p-2 font-inter"
                      placeholder="Name"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={propertyFormData.lastName}
                      onChange={handlePropertyInputChange}
                      className="border border-gray-300 rounded-md p-2 font-inter"
                      placeholder="Nachname"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={propertyFormData.phone}
                      onChange={handlePropertyInputChange}
                      className="border border-gray-300 rounded-md p-2 font-inter"
                      placeholder="Telefon"
                    />
                    <input
                      type="email"
                      name="email"
                      value={propertyFormData.email}
                      onChange={handlePropertyInputChange}
                      className="border border-gray-300 rounded-md p-2 font-inter"
                      placeholder="Email"
                      required
                    />
                  </div>

                  <h3 className="text-xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-4">
                    Informationen zum Grundstück
                  </h3>
                  <div className="space-y-4 mb-6">
                    <input
                      type="text"
                      name="address"
                      value={propertyFormData.address}
                      onChange={handlePropertyInputChange}
                      className="w-full border border-gray-300 rounded-md p-2 font-inter"
                      placeholder="Straße und Hausnummer"
                      required
                    />
                    <input
                      type="text"
                      name="city"
                      value={propertyFormData.city}
                      onChange={handlePropertyInputChange}
                      className="w-full border border-gray-300 rounded-md p-2 font-inter"
                      placeholder="Stadt"
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="postalCode"
                        value={propertyFormData.postalCode}
                        onChange={handlePropertyInputChange}
                        className="border border-gray-300 rounded-md p-2 font-inter"
                        placeholder="Postleitzahl"
                        required
                      />
                      <input
                        type="text"
                        name="country"
                        value={propertyFormData.country}
                        onChange={handlePropertyInputChange}
                        className="border border-gray-300 rounded-md p-2 font-inter"
                        placeholder="Land"
                        required
                      />
                    </div>
                  </div>

                  <h3 className="text-xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-4">
                    Anmerkungen
                  </h3>
                  <textarea
                    name="notes"
                    value={propertyFormData.notes}
                    onChange={handlePropertyInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md p-2 mb-6 font-inter"
                    placeholder="Zusatzinformationen - optional"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-inter font-medium text-[16px] tracking-[-0.015em] rounded-full px-5 py-1.5"
                  >
                    {isSubmitting ? "Wird gesendet..." : "Zum Warenkorb"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Map/Address Section */}
      {currentSection === "address" && (
        <section id="address" className="w-full py-16 bg-gray-50">
          <div className="w-full px-[5%]">
            <h2 className="font-inter font-medium text-[60px] tracking-[-0.02em] mb-4 text-center">
              Wo du uns findest
            </h2>
            <h3 className="text-2xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-8 max-w-3xl mx-auto text-center">
              Komm vorbei um deinen Traum mit uns zu besprechen.
            </h3>
            <div className="relative h-[600px] w-full bg-white rounded-lg overflow-hidden">
              <iframe
                title="Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2717.0612860304307!2d15.416334776632444!3d47.08126897114428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476e3352d2429edf%3A0x3a9430b9a0f0fd25!2sKarmeliterplatz%201%2C%208010%20Graz%2C%20Austria!5e0!3m2!1sen!2sus!4v1712087456318!5m2!1sen!2sus"
                width="600"
                height="450"
                style={{ width: "100%", height: "100%", border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}

      {/* Impressum Section */}
      {currentSection === "impressum" && (
        <section id="impressum" className="w-full py-16 bg-gray-50">
          <div className="w-full px-[5%]">
            <div className="text-center mb-6">
              <h2 className="font-inter font-medium text-[60px] tracking-[-0.02em] mb-4 text-center">
                Impressum
              </h2>
              <h3 className="text-xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-8 max-w-2xl mx-auto text-center">
                Alle wichtigen Infos und Vorgaben, damit dein Projekt sicher auf
                festen Regeln steht.
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-8 text-gray-700 w-full">
              <div>
                <p className="text-lg font-inter font-normal tracking-[-0.015em] leading-[22px] mb-4">
                  Mit Nest erreichst du in Rekordzeit dein Traumhaus. Unsere
                  seriell gefertigten Module überzeugen durch ihre einfache
                  Transportierbarkeit und schnelle Fertigung. Dank eines
                  durchdachten Konzepts wird dein Haus in wenigen Wochen vom
                  Zimmerer-Werkstatt direkt auf dein Grundstück geliefert und
                  verwandelt sich rasch in dein Eigenheim.
                </p>
                <p className="text-lg font-inter font-normal tracking-[-0.015em] leading-[22px] mb-4">
                  Dank eines durchdachten Konzepts wird dein Haus in wenigen
                  Wochen vom Zimmerer-Werkstatt direkt auf dein Grundstück
                  geliefert und verwandelt sich rasch in dein Eigenheim. Mit
                  Nest erreichst du in Rekordzeit dein Traumhaus.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
