// src/app/dialogs/CalendarDialog.tsx
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface CalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const BrightOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>((props, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className="fixed inset-0 z-50"
    style={{ 
      backdropFilter: "brightness(2.5) blur(4px)",
      backgroundColor: "transparent"
    }}
    {...props}
  />
));
BrightOverlay.displayName = "BrightOverlay";

const CONTENT_WIDTH = 'max-w-[1144px]';
const NAVBAR_HEIGHT = '64px'; // Adjust if your navbar is a different height

const CalendarDialog: React.FC<CalendarDialogProps> = ({
  isOpen,
  onClose
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [visibleTimeIndex, setVisibleTimeIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
    appointmentType: 'personal' as 'personal' | 'phone'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time slots available for booking
  const timeSlots = ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00"];

  // Month navigation
  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Time slots navigation
  const prevTime = () => {
    if (visibleTimeIndex > 0) {
      setVisibleTimeIndex(prev => prev - 1);
    }
  };

  const nextTime = () => {
    if (visibleTimeIndex < timeSlots.length - 3) {
      setVisibleTimeIndex(prev => prev + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        appointmentType: value as 'personal' | 'phone'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      alert('Bitte wähle ein Datum aus.');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real application, you would send this data to your API
      const appointmentData = {
        date: selectedDate.toISOString(),
        time: timeSlots[selectedTimeIndex],
        ...formData
      };

      console.log('Appointment data:', appointmentData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('Termin erfolgreich gebucht!');
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.');
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
          className={`text-center p-0.5 md:p-1 rounded-full text-[10px] md:text-sm font-medium transition-colors ${isToday ? 'border border-blue-500' : ''} ${isSelected ? 'border border-blue-500 text-blue-700 bg-white' : ''} ${!isAvailable ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-50'}`}
          onClick={() => isAvailable && setSelectedDate(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Title above the dialog */}
      <div
        className="fixed top-[1vh] z-[100] w-full max-w-[1700px] px-6 left-0 right-0 mx-auto"
      >
        <DialogTitle className="hidden md:block font-bold text-h2-mobile md:text-3xl text-center text-gray-900 mb-2 mt-[5vh] md:mt-[5vh]">
          Jetzt deinen Termin vereinbaren
        </DialogTitle>
      </div>
      <DialogPrimitive.Portal>
        <BrightOverlay />
        <DialogPrimitive.Content
          className="max-w-full w-[95vw] fixed top-[5vh] md:top-[10vh] left-0 right-0 mx-auto p-0 overflow-hidden z-[100]"
        >
          <div 
            className="relative w-full h-[90vh] md:h-[88vh] overflow-y-auto pt-1 pb-1 md:pt-2 md:pb-2 px-1 md:px-1 flex justify-center items-start"
            style={{ minHeight: '300px' }}
          >
            <div className="max-w-[1700px] mx-auto bg-[#F4F4F4] rounded-[32px] md:rounded-[32px] px-1 md:px-5 pb-3 flex flex-col items-center shadow-md">
              <div className="relative w-full flex flex-col md:flex-row justify-start items-start gap-4 md:gap-8 pt-0 px-2 sm:px-4 lg:px-8 overflow-y-auto h-full pointer-events-auto z-10">
                {/* Left Info Section */}
                <div className="w-full md:flex-1 md:min-w-[180px] md:max-w-[340px] xl:min-w-[320px] xl:max-w-[420px] flex flex-col justify-start px-2 sm:px-4 md:pl-4 md:pr-0 lg:pl-10 md:mt-7 z-10">
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-700 mb-3 leading-snug">
                        Der Kauf deines Hauses ist ein großer Schritt – <span className="font-bold">und wir sind da, um dir dabei zu helfen.</span> Für mehr Sicherheit und Klarheit <span className="font-bold">stehen wir dir jederzeit persönlich zur Seite.</span> Ruf uns an, um dein <span className="font-bold">Beratungsgespräch</span> zu vereinbaren, oder buche deinen <span className="font-bold">Termin ganz einfach online.</span> Dein Weg zu deinem Traumhaus beginnt mit einem Gespräch.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-[#f4f4f4] border border-gray-200 rounded-lg p-2 md:p-4">
                        <h4 className="font-bold mb-1 text-gray-800 text-sm md:text-base">Kontakt</h4>
                        <div className="grid grid-cols-[max-content_1fr] gap-x-2 md:gap-x-4 text-xs md:text-sm text-gray-700">
                          <span>Telefon:</span><span>03847 75090</span>
                          <span>Mobil:</span><span>0664 394 9604</span>
                          <span>Email:</span><span>nest@haus.at</span>
                        </div>
                      </div>
                      <div className="bg-[#f4f4f4] border border-gray-200 rounded-lg p-2 md:p-4">
                        <h4 className="font-bold mb-1 text-gray-800 text-sm md:text-base">Adresse</h4>
                        <div className="text-xs md:text-sm text-gray-700">
                          Am Ölberg 17<br />
                          8020, Graz<br />
                          Steiermark<br />
                          Österreich
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Calendar/Form Section */}
                <div className="w-full md:flex-1 md:min-w-[260px] md:max-w-[540px] flex flex-col px-2 sm:px-4 md:pl-8 md:pr-4 lg:pl-12 lg:pr-0 pb-4 md:mt-[2vh]">
                  <div className="w-full flex flex-col items-start gap-1 md:gap-2">
                    {/* Calendar Box */}
                    <div className="border border-gray-200 rounded-2xl bg-white p-1.5 px-[3vw] md:p-3 w-full md:px-3">
                      <div className="flex justify-between items-center mb-1">
                        <button
                          type="button"
                          className="p-0.5 rounded-full hover:bg-gray-100 text-sm md:text-base"
                          onClick={prevMonth}
                        >&#10094;</button>
                        <span className="font-medium text-gray-900 text-sm md:text-base">
                          {currentMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                          type="button"
                          className="p-0.5 rounded-full hover:bg-gray-100 text-sm md:text-base"
                          onClick={nextMonth}
                        >&#10095;</button>
                      </div>
                      <div className="grid grid-cols-7 gap-0.5 mb-1 text-center text-[10px] md:text-xs font-medium text-gray-500">
                        <div>Mo</div><div>Di</div><div>Mi</div><div>Do</div><div>Fr</div><div>Sa</div><div>So</div>
                      </div>
                      <div className="grid grid-cols-7 gap-0.5">
                        {renderCalendar()}
                      </div>
                    </div>
                    {/* Time Slot Selection */}
                    <div className="border border-gray-200 rounded-2xl bg-white p-1 md:p-2 w-full flex items-center justify-center gap-1 px-[5vw] md:px-3">
                      <button type="button" className="p-0.5 text-gray-600 text-sm md:text-base" onClick={prevTime} disabled={visibleTimeIndex === 0}>&#10094;</button>
                      <div className="flex gap-1 w-full justify-center">
                        {timeSlots.slice(visibleTimeIndex, visibleTimeIndex + 1).map((time, index) => (
                          <div
                            key={index + visibleTimeIndex}
                            className={`px-2 md:px-4 py-0.5 md:py-1 rounded-lg border text-[10px] md:text-sm font-medium cursor-pointer transition-colors ${selectedTimeIndex === visibleTimeIndex + index ? 'border-gray-400 bg-gray-100 text-gray-900' : 'border-gray-200 bg-white hover:border-gray-400'}`}
                            onClick={() => setSelectedTimeIndex(visibleTimeIndex + index)}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                      <button type="button" className="p-0.5 text-gray-600 text-sm md:text-base" onClick={nextTime} disabled={visibleTimeIndex >= timeSlots.length - 1}>&#10095;</button>
                    </div>
                    {/* Verfügbar/Öffnungszeiten */}
                    <div className="flex justify-between w-full text-xs text-gray-500 mt-0">
                      <span>verfügbar<br />nicht verfügbar</span>
                      <span className="text-right">Öffnungszeiten<br />Mo.-Fr.: 08:00 - 14:00<br />Sa.: 08:00 - 14:00</span>
                    </div>
                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-1 md:gap-2 w-full">
                      <div className="grid grid-cols-2 gap-1 md:gap-2">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-md p-1 md:p-1.5 bg-[#f8f8f8] text-xs md:text-sm"
                          placeholder="Name"
                          required
                        />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-md p-1 md:p-1.5 bg-[#f8f8f8] text-xs md:text-sm"
                          placeholder="Nachname"
                          required
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-md p-1 md:p-1.5 bg-[#f8f8f8] text-xs md:text-sm"
                          placeholder="Telefon"
                          required
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-md p-1 md:p-1.5 bg-[#f8f8f8] text-xs md:text-sm"
                          placeholder="Email"
                          required
                        />
                      </div>
                      <div className="flex gap-2 md:gap-3 items-center justify-center mt-1 mb-1">
                        <label className="flex items-center gap-1 text-[10px] md:text-xs font-medium">
                          <input
                            type="radio"
                            name="appointmentType"
                            value="personal"
                            checked={formData.appointmentType === 'personal'}
                            onChange={handleInputChange}
                            className="w-3 h-3 md:w-4 md:h-4 accent-blue-600"
                          />
                          Persönliches Gespräch
                        </label>
                        <label className="flex items-center gap-1 text-[10px] md:text-xs font-medium">
                          <input
                            type="radio"
                            name="appointmentType"
                            value="phone"
                            checked={formData.appointmentType === 'phone'}
                            onChange={handleInputChange}
                            className="w-3 h-3 md:w-4 md:h-4 accent-blue-600"
                          />
                          Telefonische Beratung
                        </label>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary mt-2 w-full max-w-xs mx-auto text-xs md:text-base"
                      >
                        {isSubmitting ? 'Wird gebucht...' : 'Jetzt Anfragen'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};

export default CalendarDialog;