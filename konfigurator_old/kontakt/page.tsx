'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Footer from '@/components/custom/Footer';
import { SectionRouter } from '@/components/custom/SectionRouter';

const sections = [
  { id: 'calendar', title: 'Termin vereinbaren', slug: 'termin' },
  { id: 'contact', title: 'Kontakt', slug: 'kontakt' },
  { id: 'address', title: 'Adresse', slug: 'adresse' }
];

const KontaktPage = () => {
  const [currentSection, setCurrentSection] = useState(sections[0].id);
  // Calendar form state
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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Time slots available for booking
  const timeSlots = ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00"];

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const section = sections.find(s => s.slug === hash);
      if (section) {
        setCurrentSection(section.id);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

      setSubmitSuccess(true);
      // Reset form
      setSelectedDate(null);
      setFormData({
        name: '',
        lastName: '',
        phone: '',
        email: '',
        appointmentType: 'personal'
      });
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
          className={`text-center p-2 rounded-full ${isToday ? 'border border-blue-500' : ''
            } ${isSelected ? 'bg-blue-500 text-white' : ''
            } ${!isAvailable ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'
            }`}
          onClick={() => isAvailable && setSelectedDate(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen pt-16">
      <SectionRouter sections={sections}>
        {/* Calendar Form Section */}
        <section id="calendar" className="w-full py-16 bg-white">
          <div className="w-full px-[5%]">
            <h2 className="font-inter font-medium text-[60px] tracking-[-0.02em] mb-4 text-center">Vereinbare jetzt deinen Termin</h2>
            <h3 className="text-2xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-8 max-w-3xl mx-auto text-center">
              Wir helfen gerne.
            </h3>
            {submitSuccess ? (
              <div className="max-w-5xl mx-auto bg-green-100 border border-green-200 text-green-700 px-6 py-5 rounded-lg text-center">
                <h3 className="text-xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-4 text-green-700">Termin erfolgreich gebucht!</h3>
                <p className="text-base font-inter font-normal tracking-[-0.015em] leading-[22px]">Vielen Dank für deine Terminanfrage. Wir melden uns in Kürze bei dir, um alle Details zu bestätigen.</p>
                <Button 
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-inter font-medium text-[16px] tracking-[-0.015em] rounded-full px-5 py-1.5"
                  onClick={() => setSubmitSuccess(false)}
                >
                  Weiteren Termin buchen
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
                {/* Info Section */}
                <div className="bg-white p-8 rounded-lg min-h-[600px]">
                  <p className="text-lg font-inter font-normal tracking-[-0.015em] leading-[28px] mb-8">
                    Ruf uns an, um dein Beratungsgespräch zu vereinbaren, oder buche deinen Termin hier direkt online. 
                    Dein Weg zu deinem Traumhaus beginnt mit einem Gespräch.
                  </p>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                    <h4 className="font-inter font-medium text-lg mb-3">Kontakt</h4>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 text-lg font-inter font-normal tracking-[-0.015em] leading-[28px]">
                      <span>Telefon:</span><span>03847 75090</span>
                      <span>Mobil:</span><span>0664 394 9604</span>
                      <span>Email:</span><span>hello@nest.at</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                    <h4 className="font-inter font-medium text-lg mb-3">Adresse</h4>
                    <p className="text-lg font-inter font-normal tracking-[-0.015em] leading-[28px]">
                      SustainNest GmbH<br />
                      Karmeliterplatz 1<br />
                      8010 Graz<br />
                      Österreich
                    </p>
                  </div>
                </div>

                {/* Calendar Section */}
                <div className="bg-white p-8 rounded-lg min-h-[600px]">
                  <form onSubmit={handleSubmit}>
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
                          {currentMonth.toLocaleDateString('de-DE', {
                            month: 'long',
                            year: 'numeric'
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
                        {timeSlots.slice(visibleTimeIndex, visibleTimeIndex + 3).map((time, index) => (
                          <div
                            key={index}
                            className={`time-slot py-3 px-6 border rounded-lg cursor-pointer font-inter font-medium text-lg ${
                              index + visibleTimeIndex === selectedTimeIndex ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => setSelectedTimeIndex(index + visibleTimeIndex)}
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
                    <h3 className="text-2xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-6">Deine Kontaktdaten</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-3 text-lg font-inter"
                        placeholder="Vorname"
                        required
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-3 text-lg font-inter"
                        placeholder="Nachname"
                        required
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-3 text-lg font-inter"
                        placeholder="Telefon"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-3 text-lg font-inter"
                        placeholder="Email"
                        required
                      />
                    </div>

                    {/* Appointment Type */}
                    <h3 className="text-2xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-6">Art des Termins</h3>
                    <div className="flex gap-6 mb-8 text-lg font-inter font-normal tracking-[-0.015em] leading-[28px]">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="appointmentType"
                          value="personal"
                          checked={formData.appointmentType === 'personal'}
                          onChange={handleInputChange}
                          className="mr-2 w-5 h-5"
                        />
                        Persönliches Gespräch
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="appointmentType"
                          value="phone"
                          checked={formData.appointmentType === 'phone'}
                          onChange={handleInputChange}
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
                      {isSubmitting ? 'Wird gesendet...' : 'Jetzt anfragen'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Map Section */}
        <section id="address" className="w-full py-16 bg-gray-50">
          <div className="w-full px-[5%]">
            <h2 className="font-inter font-medium text-[60px] tracking-[-0.02em] mb-4 text-center">Wo du uns findest</h2>
            <h3 className="text-2xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-8 max-w-3xl mx-auto text-center">
              Komm vorbei um deinen Traum mit uns zu besprechen.
            </h3>
            <div className="relative h-[600px] w-full bg-white rounded-lg overflow-hidden">
              <iframe 
                title="Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2717.0612860304307!2d15.416334776632444!3d47.08126897114428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476e3352d2429edf%3A0x3a9430b9a0f0fd25!2sAm%20%C3%96lberg%2017%2C%208052%20Graz%2C%20Austria!5e0!3m2!1sen!2sus!4v1712087456318!5m2!1sen!2sus"
                width="600"
                height="450"
                style={{width: '100%', height: '100%', border: 0}}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
        
        {/* Grundstückscheck Section */}
        <section id="contact" className="w-full py-16">
          <div className="w-full px-[5%]">
            <h2 className="font-inter font-medium text-[60px] tracking-[-0.02em] mb-4 text-center">Dein Grundstück - Unser Check</h2>
            <h3 className="text-2xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-8 max-w-3xl mx-auto text-center">
              Wir überprüfen für dich wie dein neues Haus auf ein Grundstück deiner Wahl passt
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
              {/* Info Section */}
              <div className="bg-white p-6 rounded-lg flex flex-col justify-between">
                <div>
                  <p className="text-lg font-inter font-normal tracking-[-0.015em] leading-[22px] mb-4">
                    Bevor dein Traum vom Nest-Haus Realität wird, ist es wichtig, dass dein Grundstück alle rechtlichen und baulichen Anforderungen erfüllt. Genau hier setzen wir an!
                  </p>
                  <p className="text-lg font-inter font-normal tracking-[-0.015em] leading-[22px] mb-6">
                    Für nur € 200,- übernehmen wir für dich die Prüfung der relevanten Rahmenbedingungen und Baugesetze, um dir Sicherheit und Klarheit zu verschaffen. Jetzt den Quick-Check machen und uns die rechtlichen und baulichen Voraussetzungen deines Grundstücks prüfen lassen, damit du entspannt und sicher in die Planung deines Nest-Hauses starten kannst.
                  </p>
                </div>

                <div className="mt-auto text-sm space-y-4">
                  <div>
                    <h4 className="font-inter font-medium mb-1">Was wir prüfen</h4>
                    <p className="text-base font-inter font-normal tracking-[-0.015em] leading-[16px]">
                      Rechtliche Rahmenbedingungen: Wir prüfen, ob dein Grundstück den Vorgaben des jeweiligen Landes-Baugesetzes, des Raumordnungsgesetzes und ortsgebundener Vorschriften entspricht.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-inter font-medium mb-1">Baugesetze</h4>
                    <p className="text-base font-inter font-normal tracking-[-0.015em] leading-[16px]">
                      Alle relevanten Bauvorschriften werden detailliert überprüft, um sicherzustellen, dass dein Bauvorhaben genehmigungsfähig ist.
                      Geeignetheit des Grundstücks: Wir stellen fest, ob dein Grundstück alle notwendigen Voraussetzungen für den Aufbau deines Nest-Hauses erfüllt.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="bg-white p-6 rounded-lg">
                <form className="space-y-4">
                  <h3 className="text-xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-4">Daten Bewerber</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      name="name"
                      className="border border-gray-300 rounded-md p-2 font-inter"
                      placeholder="Name"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      className="border border-gray-300 rounded-md p-2 font-inter"
                      placeholder="Nachname"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      className="border border-gray-300 rounded-md p-2 font-inter"
                      placeholder="Telefon"
                    />
                    <input
                      type="email"
                      name="email"
                      className="border border-gray-300 rounded-md p-2 font-inter"
                      placeholder="Email"
                      required
                    />
                  </div>

                  <h3 className="text-xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-4">Informationen zum Grundstück</h3>
                  <div className="space-y-4 mb-6">
                    <input
                      type="text"
                      name="address"
                      className="w-full border border-gray-300 rounded-md p-2 font-inter"
                      placeholder="Straße und Hausnummer"
                      required
                    />
                    <input
                      type="text"
                      name="addressLine2"
                      className="w-full border border-gray-300 rounded-md p-2 font-inter"
                      placeholder="Straße - Zeile 2 - optional"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="propertyNumber"
                        className="border border-gray-300 rounded-md p-2 font-inter"
                        placeholder="Grundstücknummer"
                      />
                      <input
                        type="text"
                        name="cadastralCommunity"
                        className="border border-gray-300 rounded-md p-2 font-inter"
                        placeholder="Katastergemeinde"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        className="border border-gray-300 rounded-md p-2 font-inter"
                        placeholder="Stadt"
                        required
                      />
                      <input
                        type="text"
                        name="state"
                        className="border border-gray-300 rounded-md p-2 font-inter"
                        placeholder="Bundesland"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="postalCode"
                        className="border border-gray-300 rounded-md p-2 font-inter"
                        placeholder="Postleitzahl"
                        required
                      />
                      <input
                        type="text"
                        name="country"
                        defaultValue="Österreich"
                        className="border border-gray-300 rounded-md p-2 font-inter"
                        placeholder="Land"
                        required
                      />
                    </div>
                  </div>

                  <h3 className="text-xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-4">Anmerkungen</h3>
                  <textarea
                    name="notes"
                    rows={4}
                    className="w-full border border-gray-300 rounded-md p-2 mb-6 font-inter"
                    placeholder="Zusatzinformationen - optional"
                  />

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-inter font-medium text-[16px] tracking-[-0.015em] rounded-full px-5 py-1.5"
                  >
                    Zum Warenkorb
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Grey bar section with text */}
        <section className="w-full py-16 bg-gray-50">
          <div className="w-full px-[5%]">
            <div className="text-center mb-6">
              <h2 className="font-inter font-medium text-[60px] tracking-[-0.02em] mb-4 text-center">Impressum</h2>
              <h3 className="text-xl font-inter font-medium tracking-[-0.015em] leading-[32px] mb-8 max-w-2xl mx-auto text-center">
                Alle wichtigen Infos und Vorgaben, damit dein Projekt sicher auf festen Regeln steht.
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-8 text-gray-700 w-full">
              <div>
                <p className="text-lg font-inter font-normal tracking-[-0.015em] leading-[22px] mb-4">
                  Mit Nest erreichst du in Rekordzeit dein Traumhaus. Unsere seriell gefertigten Module überzeugen durch ihre einfache Transportierbarkeit und schnelle Fertigung. Dank eines durchdachten Konzepts wird dein Haus in wenigen Wochen vom Zimmerer-Werkstatt direkt auf dein Grundstück geliefert und verwandelt sich rasch in dein Eigenheim.Mit Nest erreichst du in Rekordzeit dein Traumhaus. Unsere seriell gefertigten Module überzeugen durch ihre einfache Transportierbarkeit und schnelle Fertigung. Dank eines durchdachten Konzepts wird dein Haus in wenigen Wochen vom Zimmerer-Werkstatt direkt auf dein Grundstück geliefert und verwandelt sich rasch in dein Eigenheim.Mit Nest erreichst du in Rekordzeit dein Traumhaus. Unsere seriell gefertigten Module überzeugen durch ihre einfache Transportierbarkeit und schnelle Fertigung.
                </p>
                <p className="text-lg font-inter font-normal tracking-[-0.015em] leading-[22px] mb-4">
                  Dank eines durchdachten Konzepts wird dein Haus in wenigen Wochen vom Zimmerer-Werkstatt direkt auf dein Grundstück geliefert und verwandelt sich rasch in dein Eigenheim.Mit Nest erreichst du in Rekordzeit dein Traumhaus. Unsere seriell gefertigten Module überzeugen durch ihre einfache Transportierbarkeit und schnelle Fertigung. Dank eines durchdachten Konzepts wird dein Haus in wenigen Wochen vom 
                </p>
              </div>
            </div>

            {/* <div className="flex justify-center gap-4 mt-10">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-inter font-medium text-[16px] tracking-[-0.015em] rounded-full px-5 py-1.5">
                <Link href="/entdecken">Entdecken</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-inter font-medium text-[16px] tracking-[-0.015em] rounded-full px-5 py-1.5">
                <Link href="/termin">Jetzt vereinbaren</Link>
              </Button>
            </div> */}
          </div>
        </section>
      </SectionRouter>
    </div>
  );
};

export default KontaktPage;