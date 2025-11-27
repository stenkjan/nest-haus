'use client';

import { useState } from 'react';

interface CalendarViewProps {
  calendarId?: string;
}

/**
 * Google Calendar iframe integration for admin panel
 * 
 * Displays the shared NEST-Haus calendar inline with appointments
 */
export function CalendarView({ calendarId }: CalendarViewProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  const defaultCalendarId = calendarId || 
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || 
    'c_0143623b3c51294d60b53cb259d8c76b8b8ecf51a84a2913afb053dc6540261b@group.calendar.google.com';

  const calendarUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(defaultCalendarId)}&ctz=Europe/Vienna&mode=WEEK&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            📅 NEST-Haus Kalender
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Terminübersicht und gebuchte Slots
          </p>
        </div>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {showCalendar ? 'Kalender ausblenden' : 'Kalender anzeigen'}
        </button>
      </div>

      {showCalendar && (
        <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={calendarUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
            }}
            frameBorder="0"
            scrolling="no"
            title="NEST-Haus Calendar"
          />
        </div>
      )}

      {!showCalendar && (
        <div className="px-6 py-12 text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-4 text-sm">
            Klicken Sie auf "Kalender anzeigen", um die Terminübersicht zu öffnen
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Appointment Status Badge
 * 
 * Shows visual indicator for appointment status with countdown timer
 */
export function AppointmentStatusBadge({
  status,
  expiresAt,
}: {
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED' | null;
  expiresAt: string | null;
}) {
  if (!status) return null;

  const getStatusColor = () => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'PENDING':
        return '🟡 Ausstehend';
      case 'CONFIRMED':
        return '🟢 Bestätigt';
      case 'EXPIRED':
        return '🔴 Abgelaufen';
      case 'CANCELLED':
        return '⚫ Abgesagt';
      default:
        return status;
    }
  };

  const getTimeRemaining = () => {
    if (status !== 'PENDING' || !expiresAt) return null;

    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();

    if (diff <= 0) return '⏰ Abgelaufen';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `⏳ ${hours}h ${minutes}min verbleibend`;
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor()}`}>
        {getStatusLabel()}
      </span>
      {getTimeRemaining() && (
        <span className="text-xs text-orange-600 font-medium">
          {getTimeRemaining()}
        </span>
      )}
    </div>
  );
}

