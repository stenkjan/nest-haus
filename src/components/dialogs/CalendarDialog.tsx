"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui";
import { TerminVereinbarenContent } from "@/components/sections/TerminVereinbarenContent";

interface CalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendarDialog: React.FC<CalendarDialogProps> = ({ isOpen, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [visibleTimeIndex, setVisibleTimeIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    appointmentType: "personal" as "personal" | "phone",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time slots available for booking
  const timeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
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
    if (visibleTimeIndex > 0) {
      setVisibleTimeIndex((prev) => prev - 1);
    }
  };

  const nextTime = () => {
    if (visibleTimeIndex < timeSlots.length - 3) {
      setVisibleTimeIndex((prev) => prev + 1);
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

      console.log("Appointment data:", appointmentData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Termin erfolgreich gebucht!");
      onClose();
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
          className={`text-center p-0.5 sm:p-1 rounded-full text-[10px] sm:text-xs cursor-pointer transition-colors
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

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      transparent={true}
      className="p-0"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Title above the dialog - Responsive positioning */}
        <div className="absolute top-[5vh] 2xl:top-[8vh] z-[100] w-full max-w-[1700px] px-6 left-0 right-0 mx-auto">
          <h2 className="hidden md:block h2-title text-center text-gray-900 mb-0">
            Vereinbare jetzt deinen Termin
          </h2>
        </div>

        <div
          className="relative w-[95vw] h-ios-90 md:h-ios-85 2xl:h-[70vh] overflow-y-auto pt-1 pb-1 md:pt-2 md:pb-2 px-1 md:px-1 flex justify-center items-start mt-ios-10 md:mt-ios-5 2xl:mt-0 2xl:items-center ios-dialog-container"
          style={{ minHeight: "300px" }}
        >
          <div className="max-w-[1700px] mx-auto bg-[#F4F4F4] rounded-[32px] md:rounded-[32px] px-1 md:px-5 pb-3 flex flex-col items-center shadow-md">
            <div className="relative w-full flex flex-col md:flex-row justify-start items-start gap-4 md:gap-8 pt-0 px-2 sm:px-4 lg:px-8 overflow-y-auto h-full pointer-events-auto z-10">
              {/* Left Info Section */}
              <div className="w-full md:flex-1 md:min-w-[180px] md:max-w-[340px] xl:min-w-[320px] xl:max-w-[420px] flex flex-col justify-start px-2 sm:px-4 md:pl-4 md:pr-0 lg:pl-10 md:mt-7 z-10">
                <TerminVereinbarenContent variant="dialog" />
              </div>

              {/* Right Calendar/Form Section */}
              <div className="w-full md:flex-1 md:min-w-[260px] md:max-w-[540px] flex flex-col px-2 sm:px-4 md:pl-8 md:pr-4 lg:pl-12 lg:pr-0 pb-4 md:mt-[2vh]">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-2 sm:space-y-3"
                >
                  {/* Month Navigation - WITH CIRCLES */}
                  <div className="flex justify-between items-center mb-1 sm:mb-2">
                    <button
                      type="button"
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-black hover:border-2 flex items-center justify-center text-xs sm:text-sm transition-all"
                      onClick={prevMonth}
                    >
                      &#10094;
                    </button>
                    <span className="text-xs sm:text-sm font-medium">
                      {currentMonth.toLocaleDateString("de-DE", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      type="button"
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-black hover:border-2 flex items-center justify-center text-xs sm:text-sm transition-all"
                      onClick={nextMonth}
                    >
                      &#10095;
                    </button>
                  </div>

                  {/* Calendar with Border - Compact */}
                  <div className="border border-gray-300 rounded-2xl p-2 sm:p-3">
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2 text-center font-medium text-[10px] sm:text-xs text-gray-500">
                      <div>Mo</div>
                      <div>Di</div>
                      <div>Mi</div>
                      <div>Do</div>
                      <div>Fr</div>
                      <div>Sa</div>
                      <div>So</div>
                    </div>

                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                      {renderCalendar()}
                    </div>
                  </div>

                  {/* Time Slot Selector - Compact */}
                  <div className="border border-gray-300 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 flex items-center justify-between">
                    <button
                      type="button"
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-black hover:border-2 flex items-center justify-center text-[10px] sm:text-xs disabled:opacity-30 disabled:hover:border disabled:hover:border-black transition-all"
                      onClick={prevTime}
                      disabled={visibleTimeIndex === 0}
                    >
                      &#10094;
                    </button>
                    <span className="text-xs sm:text-sm font-medium">
                      {timeSlots[visibleTimeIndex] || "nicht verfügbar"}
                    </span>
                    <button
                      type="button"
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-black hover:border-2 flex items-center justify-center text-[10px] sm:text-xs disabled:opacity-30 disabled:hover:border disabled:hover:border-black transition-all"
                      onClick={nextTime}
                      disabled={visibleTimeIndex >= timeSlots.length - 1}
                    >
                      &#10095;
                    </button>
                  </div>

                  {/* Availability and Opening Hours Text - Compact */}
                  <div className="flex justify-between text-[10px] sm:text-xs">
                    <div>
                      <div className="text-gray-700">verfügbar</div>
                      <div className="text-gray-400">nicht verfügbar</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-700">Öffnungszeiten</div>
                      <div className="text-gray-400">Mo-Fr: 08:00-12:00</div>
                      <div className="text-gray-400">13:00-19:00</div>
                    </div>
                  </div>

                  {/* Contact Information - Form Fields - Compact */}
                  <div>
                    <h3 className="font-normal mb-1 sm:mb-2 text-xs sm:text-sm text-gray-700">
                      Deine Daten
                    </h3>
                    <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                          placeholder="Name"
                          required
                        />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                          placeholder="Nachname"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                          placeholder="Telefon"
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="p-1 sm:p-1.5 border rounded text-xs sm:text-sm h-7 sm:h-8"
                          placeholder="Email"
                          required
                        />
                      </div>
                    </div>

                    {/* Appointment Type - Compact */}
                    <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3 justify-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="appointmentType"
                          value="personal"
                          checked={formData.appointmentType === "personal"}
                          onChange={handleInputChange}
                          className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4"
                          style={{ accentColor: "#3D6CE1" }}
                        />
                        <span className="text-[10px] sm:text-xs">
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
                          className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4"
                          style={{ accentColor: "#3D6CE1" }}
                        />
                        <span className="text-[10px] sm:text-xs">
                          Telefonische Beratung
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedDate}
                      className="bg-blue-600 text-white hover:bg-blue-700 rounded-full py-1.5 sm:py-2 text-xs sm:text-sm px-6 whitespace-nowrap min-w-[120px] flex-shrink-0 !w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Wird gesendet..." : "Jetzt Anfragen"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CalendarDialog;
