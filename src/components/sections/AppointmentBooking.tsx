"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import { TerminVereinbarenContent } from "./TerminVereinbarenContent";

/**
 * Text Preset: Description Text Small
 * Usage: text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base
 *
 * This preset provides much smaller text than the standard description text preset
 * (text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl) for compact UI elements.
 *
 * Standard Description Text: text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl
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
}

const AppointmentBooking = ({
  showLeftSide = true,
}: AppointmentBookingProps) => {
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

  // Time slots available for booking
  const timeSlots = [
    "08:00-10:00",
    "10:00-12:00",
    "12:00-14:00",
    "14:00-16:00",
    "16:00-18:00",
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
      setSelectedTimeIndex((prev) => prev - 1);
    }
  };

  const nextTime = () => {
    if (selectedTimeIndex < timeSlots.length - 1) {
      setSelectedTimeIndex((prev) => prev + 1);
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

    setIsSubmitting(true);

    try {
      // In a real application, you would send this data to your API
      const appointmentData = {
        date: selectedDate.toISOString(),
        time: timeSlots[selectedTimeIndex],
        ...formData,
      };

      console.log("🗓️ Appointment data:", appointmentData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitSuccess(true);
      // Reset form
      setSelectedDate(null);
      setFormData({
        name: "",
        lastName: "",
        phone: "",
        email: "",
        appointmentType: "personal",
      });
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
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isAvailable = !isPast && !isWeekend;

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
      <div className="max-w-5xl mx-auto bg-green-50 border border-green-200 text-green-700 px-8 py-10 rounded-[35px] text-center shadow-lg">
        <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-semibold mb-4 text-green-700">
          Termin erfolgreich gebucht!
        </h3>
        <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl mb-6">
          Vielen Dank für deine Terminanfrage. Wir melden uns in Kürze bei dir,
          um alle Details zu bestätigen.
        </p>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-8 py-3 shadow-md"
          onClick={() => setSubmitSuccess(false)}
        >
          Weiteren Termin buchen
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Layout: Text first, then calendar and form below */}
      <div className="lg:hidden space-y-8">
        {/* Descriptive Text for Mobile - NO BOX */}
        {showLeftSide && (
          <div className="text-center px-4">
            <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-gray-700 leading-relaxed leading-relaxed">
              Der Kauf deines Hauses ist ein großer Schritt – und{" "}
              <strong>wir sind da, um dir dabei zu helfen</strong>. Für mehr
              Sicherheit und Klarheit{" "}
              <strong>stehen wir dir jederzeit persönlich zur Seite</strong>.
              Ruf uns an, um dein Beratungsgespräch zu vereinbaren, oder buche
              deinen <strong>Termin ganz einfach online</strong>. Dein Weg zu
              deinem Traumhaus beginnt mit einem Gespräch.
            </p>
          </div>
        )}

        {/* Calendar Section for Mobile */}
        <div className="px-4 space-y-4">
          {/* Month Navigation - ABOVE calendar - WITH CIRCLES */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-black hover:border-2 flex items-center justify-center text-lg transition-all"
              onClick={prevMonth}
            >
              &#10094;
            </button>
            <span className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium">
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
            <span className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium">
              {timeSlots[selectedTimeIndex]}
            </span>
            <button
              type="button"
              className="w-8 h-8 rounded-full border border-black hover:border-2 flex items-center justify-center text-sm disabled:opacity-30 disabled:hover:border disabled:hover:border-black transition-all"
              onClick={nextTime}
              disabled={selectedTimeIndex >= timeSlots.length - 1}
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
                Mo-Fr: 08:00-14:00
              </div>
              <div className="text-gray-400 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                15:30-19:00
              </div>
              <div className="text-gray-400 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                Sa: 08:00-14:00
              </div>
            </div>
          </div>
        </div>

        {/* Form Section for Mobile */}
        <form onSubmit={handleSubmit} className="space-y-6 px-4">
          {/* Contact Information - WIDER FORM FIELDS */}
          <div>
            <h3 className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium mb-6">
              Deine Daten
            </h3>
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
                  <span className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl">
                    Persönliches Gespräch
                  </span>
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
                  <span className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl">
                    Telefonische Beratung
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || !selectedDate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-normal rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center justify-center shadow-sm w-36 sm:w-40 lg:w-44 xl:w-48 px-2 py-1.5 text-sm xl:text-base 2xl:text-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Wird gesendet..." : "Jetzt Anfragen"}
            </button>
          </div>

          {/* Contact Info Boxes for Mobile - UPDATED CONTENT */}
          {showLeftSide && (
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-gray-50 hover:scale-[1.02] transition-transform">
                <div className="p-6">
                  <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-900 mb-3 text-center">
                    Kontakt <span className="text-gray-400">Melde dich!</span>
                  </h2>
                  <div className="text-center">
                    <p className="text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base text-gray-700 leading-relaxed">
                      <span className="font-medium">Telefon:</span> +43 (0) 3847
                      75090
                      <br />
                      <span className="font-medium">Mobil:</span> +43 (0) 664
                      3949604
                      <br />
                      <span className="font-medium">Email:</span> nest@haus.at
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-gray-50 hover:scale-[1.02] transition-transform">
                <div className="p-6">
                  <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-900 mb-3 text-center">
                    Adresse <span className="text-gray-400">Komm vorbei!</span>
                  </h2>
                  <div className="text-center">
                    <p className="text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base text-gray-700 leading-relaxed">
                      <span className="font-medium">Telefon:</span> +43 (0) 3847
                      75090
                      <br />
                      <span className="font-medium">Mobil:</span> +43 (0) 664
                      3949604
                      <br />
                      <span className="font-medium">Email:</span> nest@haus.at
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Desktop Layout: Side by side or centered form */}
      <div
        className={`hidden ${
          showLeftSide
            ? "lg:grid lg:grid-cols-2 gap-8 xl:gap-12 2xl:gap-16"
            : "lg:flex lg:justify-center"
        } items-start max-w-[1536px] mx-auto px-[5%]`}
      >
        {/* Left side - Info and Contact boxes - POSITIONED AT LEFT EDGE */}
        {showLeftSide && (
          <div className="space-y-8 max-w-[500px] justify-self-start">
            {/* Spacer to align text with calendar border start */}
            <div className="h-16"></div>

            {/* Descriptive Text - INCREASED LINE SPACING */}
            <div>
              <p className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl text-gray-700 leading-relaxed leading-relaxed">
                Der Kauf deines Hauses ist ein großer Schritt – und{" "}
                <strong>wir sind da, um dir dabei zu helfen</strong>. Für mehr
                Sicherheit und Klarheit{" "}
                <strong>stehen wir dir jederzeit persönlich zur Seite</strong>.
                Ruf uns an, um dein Beratungsgespräch zu vereinbaren, oder buche
                deinen <strong>Termin ganz einfach online</strong>. Dein Weg zu
                deinem Traumhaus beginnt mit einem Gespräch.
              </p>
            </div>

            {/* Spacer to push contact boxes down to radio button level */}
            <div className="h-3"></div>

            {/* Contact Box - UPDATED CONTENT */}
            <div className="rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-gray-50 hover:scale-[1.02] transition-transform">
              <div className="p-6">
                <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-900 mb-3">
                  Kontakt <span className="text-gray-400">Melde dich!</span>
                </h2>
                <div>
                  <p className="text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base text-gray-700 leading-relaxed">
                    <span className="font-medium">Telefon:</span> +43 (0) 3847
                    75090
                    <br />
                    <span className="font-medium">Mobil:</span> +43 (0) 664
                    3949604
                    <br />
                    <span className="font-medium">Email:</span> nest@haus.at
                  </p>
                </div>
              </div>
            </div>

            {/* Address Box - UPDATED CONTENT */}
            <div className="rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-gray-50 hover:scale-[1.02] transition-transform">
              <div className="p-6">
                <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-900 mb-3">
                  Adresse <span className="text-gray-400">Komm vorbei!</span>
                </h2>
                <div>
                  <p className="text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base text-gray-700 leading-relaxed">
                    <span className="font-medium">Telefon:</span> +43 (0) 3847
                    75090
                    <br />
                    <span className="font-medium">Mobil:</span> +43 (0) 664
                    3949604
                    <br />
                    <span className="font-medium">Email:</span> nest@haus.at
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
              <span className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium">
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
              <span className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium">
                {timeSlots[selectedTimeIndex]}
              </span>
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-black hover:border-2 flex items-center justify-center text-sm disabled:opacity-30 disabled:hover:border disabled:hover:border-black transition-all"
                onClick={nextTime}
                disabled={selectedTimeIndex >= timeSlots.length - 1}
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
                  Mo-Fr: 08:00-14:00
                </div>
                <div className="text-gray-400 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                  15:30-19:00
                </div>
                <div className="text-gray-400 text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
                  Sa: 08:00-14:00
                </div>
              </div>
            </div>

            {/* Contact Information - WIDER FORM FIELDS */}
            <div className="mb-8">
              <h3 className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl font-medium mb-6">
                Deine Daten
              </h3>
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
                  <span className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl">
                    Persönliches Gespräch
                  </span>
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
                  <span className="text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl">
                    Telefonische Beratung
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting || !selectedDate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-normal rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center justify-center shadow-sm w-36 sm:w-40 lg:w-44 xl:w-48 px-2 py-1.5 text-sm xl:text-base 2xl:text-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Wird gesendet..." : "Jetzt Anfragen"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
