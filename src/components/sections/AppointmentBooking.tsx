"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { TerminVereinbarenContent } from "./TerminVereinbarenContent";
import { useCartStore } from "@/store/cartStore";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { trackAppointmentBooking } from "@/lib/ga4-tracking";

/**
 * Text Preset: Description Text Small
 * Usage: text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base
 *
 * This preset provides much smaller text than the standard description text preset
 * (p-primary) for compact UI elements.
 *
 * Standard Description Text: p-primary
 * Description Text Small: text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base
 *
 * Use this for most text elements in forms, labels, and general content
 * where you want compact, readable text with consistent responsive scaling.
 */

interface AppointmentFormData {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  appointmentType: "personal" | "phone";
}

interface AppointmentBookingProps {
  showLeftSide?: boolean;
  showSubmitButton?: boolean;
  addPadding?: boolean;
}

const AppointmentBooking = ({
  showLeftSide = true,
  showSubmitButton = true,
  addPadding = false,
}: AppointmentBookingProps) => {
  const { setAppointmentDetails } = useCartStore();
  const { sessionId } = useConfiguratorStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    appointmentType: "personal",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    Array<{ start: string; end: string; available: boolean }>
  >([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Static time slots as fallback - Business hours: 8-12 and 13-19
  const fallbackTimeSlots = [
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    // Lunch break 12:00-13:00 - no appointments
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
    "17:00-18:00",
    "18:00-19:00",
  ];

  // Month navigation
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
    if (selectedTimeIndex > 0) {
      setSelectedTimeIndex((prev) => Math.max(prev - 1, 0));
    }

    const currentTimeSlots = getCurrentTimeSlots();
    console.log(
      `🕐 Time navigation: ${selectedTimeIndex}/${currentTimeSlots.length} slots`
    );
  };

  // Get current time slots (either from calendar API or fallback)
  const getCurrentTimeSlots = () => {
    if (availableTimeSlots.length > 0) {
      // Filter API slots to ensure no slots after 19:00
      return availableTimeSlots.filter((slot) => {
        if (!slot.available) return false;

        // Additional safety check: parse the start time and ensure it's before 19:00
        try {
          const startTime = new Date(slot.start);
          const startHour = startTime.getHours();

          if (startHour >= 19) {
            console.warn(
              `⚠️ Frontend: Filtering out slot starting at ${startHour}:00 (after 19:00)`
            );
            return false;
          }

          return true;
        } catch (error) {
          console.error("Error parsing slot time:", error);
          return slot.available;
        }
      });
    } else {
      // Use fallback slots only if no calendar data is available
      return fallbackTimeSlots.map((slot) => ({
        start: slot,
        end: slot,
        available: true,
      }));
    }
  };

  const nextTime = () => {
    const currentTimeSlots = getCurrentTimeSlots();
    const maxIndex = currentTimeSlots.length - 1;

    if (selectedTimeIndex < maxIndex) {
      setSelectedTimeIndex((prev) => Math.min(prev + 1, maxIndex));
    }

    console.log(
      `🕐 Time navigation: ${selectedTimeIndex + 1}/${currentTimeSlots.length} slots`
    );
  };

  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableTimeSlots = async (date: Date) => {
    setIsLoadingSlots(true);
    try {
      // Fix timezone offset issue - use local date formatting
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`; // YYYY-MM-DD format
      const response = await fetch(
        `/api/calendar/availability?date=${dateString}`
      );
      const data = await response.json();

      if (data.success && data.timeSlots) {
        const availableSlots = data.timeSlots.filter(
          (slot: { start: string; end: string; available: boolean }) =>
            slot.available
        );
        setAvailableTimeSlots(data.timeSlots);
        setSelectedTimeIndex(0); // Reset to first available slot
        console.log(
          `📅 Loaded ${data.availableCount} available slots for ${dateString} (${availableSlots.length} actually available)`
        );
      } else {
        console.warn("Failed to load time slots, using fallback");
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setAvailableTimeSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        appointmentType: value as "personal" | "phone",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      alert("Bitte wähle ein Datum aus.");
      return;
    }

    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Bitte fülle Name und E-Mail aus.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the selected time slot
      const currentTimeSlots = getCurrentTimeSlots();

      const selectedSlot = currentTimeSlots[selectedTimeIndex];

      // Create appointment date/time
      const appointmentDateTime = selectedSlot?.start
        ? selectedSlot.start
        : (() => {
            // Create date in local timezone to avoid offset issues
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth();
            const day = selectedDate.getDate();
            const hour = 9 + selectedTimeIndex; // Business hours start at 9 AM

            // Create date in Vienna timezone
            const localDate = new Date(year, month, day, hour, 0, 0);
            return localDate.toISOString();
          })();

      // Prepare contact form data
      const fullName =
        `${formData.name.trim()} ${formData.lastName.trim()}`.trim();
      const contactData = {
        name: fullName || formData.name.trim(), // Fallback to just first name if last name is empty
        email: formData.email,
        phone: formData.phone || undefined,
        message: `Terminart: ${formData.appointmentType === "personal" ? "Persönliches Gespräch" : "Telefonische Beratung"}`,
        requestType: "appointment" as const,
        preferredContact: "email" as const,
        appointmentDateTime: appointmentDateTime,
      };

      console.log("🗓️ Sending appointment request:", contactData);

      // Send appointment request to contact API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      console.log("📬 Appointment API response:", { ok: response.ok, result });

      if (response.ok && result.success) {
        console.log("✅ Appointment request sent successfully");

        // Save appointment to cart store for reference
        const appointmentDetails = {
          date: selectedDate,
          time: selectedSlot?.start
            ? new Date(selectedSlot.start).toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : fallbackTimeSlots[selectedTimeIndex],
          appointmentType: formData.appointmentType,
          customerInfo: {
            name: formData.name,
            lastName: formData.lastName,
            phone: formData.phone,
            email: formData.email,
          },
          sessionId: sessionId || null,
          inquiryId: result.inquiryId,
          timeSlotAvailable: result.timeSlotAvailable,
        };

        setAppointmentDetails(appointmentDetails);

        // Track appointment booking in Google Analytics 4
        trackAppointmentBooking({
          date: selectedDate.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD string
          time: appointmentDetails.time,
          appointmentType: formData.appointmentType,
          timeSlotAvailable: result.timeSlotAvailable,
        });

        // IMPORTANT: Always show success message after successful submission
        console.log(
          "✅ Setting submitSuccess to true - success message should appear"
        );
        setSubmitSuccess(true);

        // Store contact info in localStorage for checkout validation
        localStorage.setItem(
          "nest-haus-contact-submitted",
          JSON.stringify({
            email: result.email,
            name: appointmentDetails.customerInfo.name,
            timestamp: Date.now(),
          })
        );

        // Reset form
        setSelectedDate(null);
        setAvailableTimeSlots([]);
        setFormData({
          name: "",
          lastName: "",
          phone: "",
          email: "",
          appointmentType: "personal",
        });
      } else {
        console.error("❌ Appointment booking failed:", result);
        throw new Error(
          result.error || result.message || "Appointment booking failed"
        );
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
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

      // Block dates before one week from now - only allow booking from one week onwards
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      oneWeekFromNow.setHours(0, 0, 0, 0);
      const isTooEarly = date < oneWeekFromNow;

      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isAvailable = !isTooEarly && !isWeekend;

      days.push(
        <div
          key={day}
          className={`text-center p-3 rounded-full text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base cursor-pointer transition-colors
            ${isToday ? "border border-blue-500" : ""}
            ${isSelected ? "bg-blue-500 text-white" : ""}
            ${
              !isAvailable
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }
            ${isAvailable && !isSelected ? "text-gray-700" : ""}
          `}
          onClick={() => isAvailable && setSelectedDate(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  if (submitSuccess) {
    return (
      <div className="max-w-l mx-auto bg-white text-black px-8 md:px-12 lg:px-16 xl:px-18 2xl:px-20 py-10 md:py-14 xl:py-18 2xl:py-20 rounded-[35px] text-left shadow-lg flex items-center justify-center min-h-[330px] md:min-h-[400px] mt-18">
        <div className="w-full">
          <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-semibold mb-4 text-black">
            Terminanfrage erfolgreich gesendet!
          </h3>
          <p
            className="p-primary mb-8"
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
          >
            Vielen Dank für deine Terminanfrage. Wir haben deine Verfügbarkeit
            geprüft und melden uns innerhalb der nächsten 24 Stunden per E-Mail
            bei dir, um den Termin zu bestätigen.
          </p>
          <div className="flex justify-start">
            <Button
              variant="landing-secondary-blue"
              size="xs"
              onClick={() => {
                // Show toast: "aktuell nicht möglich"
                const windowWithToast = window as Window & {
                  toast?: (message: string) => void;
                };
                if (typeof window !== "undefined" && windowWithToast.toast) {
                  windowWithToast.toast("Aktuell nicht möglich");
                } else if (typeof window !== "undefined") {
                  // fallback: alert if no toast system
                  alert("Aktuell nicht möglich");
                }
              }}
              disabled
            >
              Weiteren Termin buchen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Layout: Text first, then calendar and form below */}
      <div className="lg:hidden space-y-8 px-4 md:px-12">
        {/* Descriptive Text for Mobile - NO BOX */}
        {showLeftSide && <TerminVereinbarenContent variant="mobile" />}

        {/* Calendar Section for Mobile */}
        <div className="space-y-4">
          {/* Month Navigation - ABOVE calendar - WITH CIRCLES */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-black hover:border-2 flex items-center justify-center text-lg transition-all"
              onClick={prevMonth}
            >
              &#10094;
            </button>
            <span className="p-primary font-medium">
              {currentMonth.toLocaleDateString("de-DE", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-black hover:border-2 flex items-center justify-center text-lg transition-all"
              onClick={nextMonth}
            >
              &#10095;
            </button>
          </div>

          {/* Calendar with Border - Updated to grey border and 35px radius */}
          <div className="border border-gray-300 rounded-[35px] p-4">
            <div className="grid grid-cols-7 gap-1 mb-4 text-center font-medium text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base text-gray-500">
              <div>Mo</div>
              <div>Di</div>
              <div>Mi</div>
              <div>Do</div>
              <div>Fr</div>
              <div>Sa</div>
              <div>So</div>
            </div>

            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </div>

          {/* Time Slot Selector - Single box with arrows WITH CIRCLES */}
          <div className="border border-gray-300 rounded-full px-4 py-3 flex items-center justify-between">
            <button
              type="button"
              className="w-8 h-8 rounded-full border border-black hover:border-2 flex items-center justify-center text-sm disabled:opacity-30 disabled:hover:border disabled:hover:border-black transition-all"
              onClick={prevTime}
              disabled={selectedTimeIndex === 0}
            >
              &#10094;
            </button>
            <span className="p-primary font-medium">
              {isLoadingSlots
                ? "Laden..."
                : (() => {
                    const currentTimeSlots = getCurrentTimeSlots();
                    const slot = currentTimeSlots[selectedTimeIndex];

                    if (availableTimeSlots.length > 0 && slot?.start) {
                      return (
                        new Date(slot.start).toLocaleTimeString("de-DE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) +
                        " - " +
                        new Date(slot.end).toLocaleTimeString("de-DE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      );
                    } else {
                      const currentTimeSlots = getCurrentTimeSlots();
                      if (currentTimeSlots.length === 0) {
                        return "nicht verfügbar";
                      }
                      return (
                        fallbackTimeSlots[selectedTimeIndex] ||
                        "nicht verfügbar"
                      );
                    }
                  })()}
            </span>
            <button
              type="button"
              className="w-8 h-8 rounded-full border border-black hover:border-2 flex items-center justify-center text-sm disabled:opacity-30 disabled:hover:border disabled:hover:border-black transition-all"
              onClick={nextTime}
              disabled={(() => {
                const currentTimeSlots = getCurrentTimeSlots();
                return selectedTimeIndex >= currentTimeSlots.length - 1;
              })()}
            >
              &#10095;
            </button>
          </div>

          {/* Availability and Opening Hours Text */}
          <div className="flex justify-between text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
            <div>
              <div className="text-gray-700 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                verfügbar
              </div>
              <div className="text-gray-400 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                nicht verfügbar
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-700 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                Öffnungszeiten
              </div>
              <div className="text-gray-400 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                Mo-Fr: 08:00-12:00
              </div>
              <div className="text-gray-400 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                13:00-19:00
              </div>
            </div>
          </div>
        </div>

        {/* Form Section for Mobile */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information - WIDER FORM FIELDS */}
          <div>
            <h3 className="p-primary font-medium mb-6">Deine Daten</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border border-gray-200 rounded-[20px] p-4 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border border-gray-200 rounded-[20px] p-4 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  placeholder="Nachname"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border border-gray-200 rounded-[20px] p-4 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  placeholder="Telefon"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-200 rounded-[20px] p-4 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  placeholder="Email"
                  required
                />
              </div>
            </div>

            {/* Appointment Type - HORIZONTAL LAYOUT */}
            <div className="mt-6">
              <div className="flex gap-6 justify-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="appointmentType"
                    value="personal"
                    checked={formData.appointmentType === "personal"}
                    onChange={handleInputChange}
                    className="mr-3 w-4 h-4"
                    style={{ accentColor: "#3D6CE1" }}
                  />
                  <span className="p-primary">Persönliches Gespräch</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="appointmentType"
                    value="phone"
                    checked={formData.appointmentType === "phone"}
                    onChange={handleInputChange}
                    className="mr-3 w-4 h-4"
                    style={{ accentColor: "#3D6CE1" }}
                  />
                  <span className="p-primary">Telefonische Beratung</span>
                </label>
              </div>
            </div>
          </div>

          {showSubmitButton && (
            <div className="flex justify-center mb-12">
              <button
                type="submit"
                disabled={isSubmitting || !selectedDate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-normal rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center justify-center shadow-sm w-36 sm:w-40 lg:w-44 xl:w-48 px-2 py-1.5 text-sm xl:text-base 2xl:text-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Wird gesendet..." : "Jetzt Anfragen"}
              </button>
            </div>
          )}

          {/* Contact Info Boxes for Mobile - UPDATED CONTENT */}
          {showLeftSide && (
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-3xl shadow-lg overflow-hidden bg-[#f4f4f4]">
                <div className="p-6">
                  <h2 className="h2-title text-black mb-4 text-left">
                    Kontakt <span className="text-nest-gray">Melde dich!</span>
                  </h2>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 p-primary-small leading-relaxed">
                    <span className="text-nest-gray">Telefon1:</span>
                    <span className="text-black font-medium">
                      +43 (0) 664 2531869
                    </span>
                    <span className="text-nest-gray">Telefon2:</span>
                    <span className="text-black font-medium">
                      +43 (0) 664 1001947
                    </span>
                    <span className="text-nest-gray">Email:</span>
                    <span className="text-black font-medium">
                      mail@nest-haus.at
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl shadow-lg overflow-hidden bg-[#f4f4f4]">
                <div className="p-6">
                  <h2 className="h2-title text-black mb-4 text-left">
                    Adresse <span className="text-nest-gray">Komm vorbei!</span>
                  </h2>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 p-primary-small leading-relaxed">
                    <span className="text-nest-gray">Straße:</span>
                    <span className="text-black font-medium">
                      Karmeliterplatz 8
                    </span>
                    <span className="text-nest-gray">Stadt:</span>
                    <span className="text-black font-medium">
                      8010, Graz, Steiermark
                    </span>
                    <span className="text-nest-gray">Land:</span>
                    <span className="text-black font-medium">Österreich</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Desktop Layout: Side by side or centered form */}
      <div className="hidden lg:flex lg:justify-center w-full">
        <div
          className={`${
            showLeftSide
              ? "lg:grid lg:grid-cols-2 gap-8 xl:gap-12 2xl:gap-16"
              : "flex justify-center"
          } items-start max-w-[1536px] w-full${addPadding ? " px-4 md:px-12" : ""}`}
        >
          {/* Left side - Info and Contact boxes - POSITIONED AT LEFT EDGE */}
          {showLeftSide && <TerminVereinbarenContent variant="desktop" />}

          {/* Right side - Calendar and Form - POSITIONED AT RIGHT EDGE */}
          <div
            className={`space-y-6 ${
              showLeftSide
                ? "max-w-[500px] justify-self-end"
                : "w-full max-w-none"
            }`}
          >
            <form onSubmit={handleSubmit}>
              {/* Month Navigation - ABOVE calendar - WITH CIRCLES */}
              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full border border-black hover:border-2 flex items-center justify-center text-lg transition-all"
                  onClick={prevMonth}
                >
                  &#10094;
                </button>
                <span className="p-primary font-medium">
                  {currentMonth.toLocaleDateString("de-DE", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full border border-black hover:border-2 flex items-center justify-center text-lg transition-all"
                  onClick={nextMonth}
                >
                  &#10095;
                </button>
              </div>

              {/* Calendar with Border - Updated to grey border and 35px radius */}
              <div className="border border-gray-300 rounded-[35px] p-6 mb-4">
                <div className="grid grid-cols-7 gap-2 mb-4 text-center font-medium text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base text-gray-500">
                  <div>Mo</div>
                  <div>Di</div>
                  <div>Mi</div>
                  <div>Do</div>
                  <div>Fr</div>
                  <div>Sa</div>
                  <div>So</div>
                </div>

                <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
              </div>

              {/* Time Slot Selector - Single box with arrows WITH CIRCLES */}
              <div className="border border-gray-300 rounded-full px-6 py-3 flex items-center justify-between mb-4">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-black hover:border-2 flex items-center justify-center text-sm disabled:opacity-30 disabled:hover:border disabled:hover:border-black transition-all"
                  onClick={prevTime}
                  disabled={selectedTimeIndex === 0}
                >
                  &#10094;
                </button>
                <span className="p-primary font-medium">
                  {isLoadingSlots
                    ? "Laden..."
                    : (() => {
                        const currentTimeSlots = getCurrentTimeSlots();
                        const slot = currentTimeSlots[selectedTimeIndex];

                        if (availableTimeSlots.length > 0 && slot?.start) {
                          return (
                            new Date(slot.start).toLocaleTimeString("de-DE", {
                              hour: "2-digit",
                              minute: "2-digit",
                            }) +
                            " - " +
                            new Date(slot.end).toLocaleTimeString("de-DE", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          );
                        } else {
                          const currentTimeSlots = getCurrentTimeSlots();
                          if (currentTimeSlots.length === 0) {
                            return "nicht verfügbar";
                          }
                          return (
                            fallbackTimeSlots[selectedTimeIndex] ||
                            "nicht verfügbar"
                          );
                        }
                      })()}
                </span>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-black hover:border-2 flex items-center justify-center text-sm disabled:opacity-30 disabled:hover:border disabled:hover:border-black transition-all"
                  onClick={nextTime}
                  disabled={(() => {
                    const currentTimeSlots = getCurrentTimeSlots();
                    return selectedTimeIndex >= currentTimeSlots.length - 1;
                  })()}
                >
                  &#10095;
                </button>
              </div>

              {/* Availability and Opening Hours Text */}
              <div className="flex justify-between text-sm md:text-sm lg:text-base 2xl:text-lg mb-6">
                <div>
                  <div className="text-gray-700 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                    verfügbar
                  </div>
                  <div className="text-gray-400 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                    nicht verfügbar
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-700 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                    Öffnungszeiten
                  </div>
                  <div className="text-gray-400 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                    Mo-Fr: 08:00-12:00
                  </div>
                  <div className="text-gray-400 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                    13:00-19:00
                  </div>
                </div>
              </div>

              {/* Contact Information - WIDER FORM FIELDS */}
              <div className="mb-8">
                <h3 className="p-primary font-medium mb-6">Deine Daten</h3>
                <div className="space-y-3 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border border-gray-200 rounded-[20px] p-4 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                      placeholder="Name"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="border border-gray-200 rounded-[20px] p-4 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                      placeholder="Nachname"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border border-gray-200 rounded-[20px] p-4 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                      placeholder="Telefon"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border border-gray-200 rounded-[20px] p-4 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>

                {/* Appointment Type - HORIZONTAL LAYOUT */}
                <div className="flex gap-6 mb-8 justify-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="appointmentType"
                      value="personal"
                      checked={formData.appointmentType === "personal"}
                      onChange={handleInputChange}
                      className="mr-3 w-4 h-4"
                      style={{ accentColor: "#3D6CE1" }}
                    />
                    <span className="p-primary">Persönliches Gespräch</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="appointmentType"
                      value="phone"
                      checked={formData.appointmentType === "phone"}
                      onChange={handleInputChange}
                      className="mr-3 w-4 h-4"
                      style={{ accentColor: "#3D6CE1" }}
                    />
                    <span className="p-primary">Telefonische Beratung</span>
                  </label>
                </div>
              </div>

              {showSubmitButton && (
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedDate}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-normal rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center justify-center shadow-sm w-36 sm:w-40 lg:w-44 xl:w-48 px-2 py-1.5 text-sm xl:text-base 2xl:text-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Wird gesendet..." : "Jetzt Anfragen"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
