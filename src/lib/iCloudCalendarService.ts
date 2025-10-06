import ical from 'node-ical';

export interface iCloudEvent {
    id: string;
    summary: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
}

export interface TimeSlot {
    start: string;
    end: string;
    available: boolean;
}

export interface AvailabilityRequest {
    date: string; // YYYY-MM-DD format
    timeZone?: string;
}

export class iCloudCalendarService {
    private static readonly ICAL_URL = process.env.ICLOUD_CALENDAR_URL || 'https://caldav.icloud.com/published/2/NDYwNTcxMTc4NDYwNTcxMTAjdgQKqgaw1FkYs83tvGOWWDJQ3U7DBxsbtAhlhGD19NbQ84s14Pj9OAvbWpz6jbnnMgCmKJoic2qptGU5Pn0';
    private static readonly TIME_ZONE = 'Europe/Vienna';

    // Business hours configuration: 8-12 and 13-19 (lunch break 12-13)
    private static readonly BUSINESS_HOURS = {
        morningStart: 8,  // 8 AM
        morningEnd: 12,   // 12 PM
        afternoonStart: 13, // 1 PM  
        afternoonEnd: 19,   // 7 PM
        duration: 60, // 60 minutes per appointment
    };

    private static readonly BUSINESS_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday

    /**
     * Fetch and parse iCloud calendar events
     */
    private static async fetchCalendarEvents(): Promise<iCloudEvent[]> {
        try {
            console.log('📅 Fetching iCloud calendar events...');

            // Fetch the iCal data
            const response = await fetch(this.ICAL_URL);
            const icalData = await response.text();

            // Parse the iCal data
            const events = ical.parseICS(icalData);
            const parsedEvents: iCloudEvent[] = [];

            for (const key in events) {
                const event = events[key];

                // Only process VEVENT types (actual calendar events)
                if (event.type === 'VEVENT' && event.start && event.end) {
                    parsedEvents.push({
                        id: event.uid || key,
                        summary: event.summary || 'Busy',
                        start: new Date(event.start),
                        end: new Date(event.end),
                        description: event.description || undefined,
                        location: event.location || undefined,
                    });
                }
            }

            console.log(`✅ Parsed ${parsedEvents.length} events from iCloud calendar`);
            return parsedEvents;

        } catch (error) {
            console.error('❌ Failed to fetch iCloud calendar events:', error);
            return [];
        }
    }

    /**
     * Get available time slots for a specific date
     */
    static async getAvailableTimeSlots(request: AvailabilityRequest): Promise<TimeSlot[]> {
        try {
            console.log(`📅 Getting available time slots for ${request.date}`);

            // Parse the requested date
            const requestDate = new Date(request.date);
            const dayOfWeek = requestDate.getDay();

            // Check if it's a business day
            if (!this.BUSINESS_DAYS.includes(dayOfWeek)) {
                console.log('📅 Not a business day, returning empty slots');
                return [];
            }

            // Generate time slots for the day - Morning: 8-12, Afternoon: 13-19
            const timeSlots: TimeSlot[] = [];
            const duration = this.BUSINESS_HOURS.duration;

            // Morning slots: 8 AM - 12 PM
            for (let hour = this.BUSINESS_HOURS.morningStart; hour < this.BUSINESS_HOURS.morningEnd; hour++) {
                const startTime = new Date(requestDate);
                startTime.setHours(hour, 0, 0, 0);

                const endTime = new Date(startTime);
                endTime.setMinutes(duration);

                timeSlots.push({
                    start: startTime.toISOString(),
                    end: endTime.toISOString(),
                    available: true, // Will be updated based on existing events
                });
            }

            // Afternoon slots: 1 PM - 7 PM (skip lunch break 12-13)
            for (let hour = this.BUSINESS_HOURS.afternoonStart; hour < this.BUSINESS_HOURS.afternoonEnd; hour++) {
                const startTime = new Date(requestDate);
                startTime.setHours(hour, 0, 0, 0);

                const endTime = new Date(startTime);
                endTime.setMinutes(duration);

                timeSlots.push({
                    start: startTime.toISOString(),
                    end: endTime.toISOString(),
                    available: true, // Will be updated based on existing events
                });
            }

            // Fetch existing events from iCloud
            const existingEvents = await this.fetchCalendarEvents();

            // Filter events for the requested date
            const dayEvents = existingEvents.filter(event => {
                const eventDate = new Date(event.start);
                return eventDate.toDateString() === requestDate.toDateString();
            });

            // Mark conflicting time slots as unavailable
            for (const event of dayEvents) {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);

                timeSlots.forEach(slot => {
                    const slotStart = new Date(slot.start);
                    const slotEnd = new Date(slot.end);

                    // Check for overlap
                    if (
                        (slotStart >= eventStart && slotStart < eventEnd) ||
                        (slotEnd > eventStart && slotEnd <= eventEnd) ||
                        (slotStart <= eventStart && slotEnd >= eventEnd)
                    ) {
                        slot.available = false;
                    }
                });
            }

            // Filter out past time slots for today
            const now = new Date();
            const availableSlots = timeSlots.filter(slot => {
                const slotStart = new Date(slot.start);
                return slotStart > now;
            });

            console.log(`✅ Found ${availableSlots.filter(s => s.available).length} available slots out of ${availableSlots.length} total slots`);
            return availableSlots;

        } catch (error) {
            console.error('❌ Failed to get available time slots:', error);
            return [];
        }
    }

    /**
     * Get calendar events for a date range
     */
    static async getEventsForDateRange(startDate: string, endDate: string): Promise<iCloudEvent[]> {
        try {
            const events = await this.fetchCalendarEvents();
            const start = new Date(startDate);
            const end = new Date(endDate);

            return events.filter(event => {
                const eventStart = new Date(event.start);
                return eventStart >= start && eventStart <= end;
            });

        } catch (error) {
            console.error('❌ Failed to get events for date range:', error);
            return [];
        }
    }

    /**
     * Check if a specific time slot is available
     */
    static async isTimeSlotAvailable(dateTime: string, durationMinutes: number = 60): Promise<boolean> {
        try {
            const requestedStart = new Date(dateTime);
            const requestedEnd = new Date(requestedStart);
            requestedEnd.setMinutes(requestedStart.getMinutes() + durationMinutes);

            // Get events for the day
            const dayStart = new Date(requestedStart);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(requestedStart);
            dayEnd.setHours(23, 59, 59, 999);

            const events = await this.getEventsForDateRange(
                dayStart.toISOString(),
                dayEnd.toISOString()
            );

            // Check for conflicts
            for (const event of events) {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);

                // Check for overlap
                if (
                    (requestedStart >= eventStart && requestedStart < eventEnd) ||
                    (requestedEnd > eventStart && requestedEnd <= eventEnd) ||
                    (requestedStart <= eventStart && requestedEnd >= eventEnd)
                ) {
                    return false; // Conflict found
                }
            }

            return true; // No conflicts

        } catch (error) {
            console.error('❌ Failed to check time slot availability:', error);
            return false; // Assume not available on error
        }
    }

    /**
     * Generate appointment request email content
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static generateAppointmentRequestEmail(inquiry: any, requestedDateTime: string): {
        subject: string;
        html: string;
        text: string;
    } {
        const appointmentDate = new Date(requestedDateTime);
        const formattedDate = appointmentDate.toLocaleString('de-DE', {
            timeZone: this.TIME_ZONE,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const subject = `📅 Terminanfrage: ${inquiry.name} - ${formattedDate}`;

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #007AFF; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .appointment-request { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; margin: 20px 0; }
    .customer-info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .actions { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📅 Neue Terminanfrage</h1>
    <p>NEST-Haus Appointment Request</p>
  </div>
  
  <div class="content">
    <div class="appointment-request">
      <h2>⏰ Gewünschter Termin:</h2>
      <h3>${formattedDate}</h3>
      <p><strong>Zeitzone:</strong> ${this.TIME_ZONE}</p>
    </div>
    
    <div class="customer-info">
      <h3>👤 Kundendaten:</h3>
      <p><strong>Name:</strong> ${inquiry.name}</p>
      <p><strong>E-Mail:</strong> ${inquiry.email}</p>
      ${inquiry.phone ? `<p><strong>Telefon:</strong> ${inquiry.phone}</p>` : ''}
      <p><strong>Bevorzugter Kontakt:</strong> ${inquiry.preferredContact}</p>
      ${inquiry.message ? `<p><strong>Nachricht:</strong><br>${inquiry.message}</p>` : ''}
    </div>
    
    <div class="actions">
      <h3>📋 Nächste Schritte:</h3>
      <ol>
        <li><strong>Verfügbarkeit prüfen</strong> in deinem iCloud Kalender</li>
        <li><strong>Termin bestätigen</strong> per E-Mail an den Kunden</li>
        <li><strong>Termin hinzufügen</strong> zu deinem iCloud Kalender</li>
        <li><strong>Kalendereinladung senden</strong> an ${inquiry.email}</li>
      </ol>
    </div>
    
    <div style="margin-top: 30px; padding: 15px; background: #f0f0f0; border-radius: 5px;">
      <p><strong>Anfrage-ID:</strong> ${inquiry.id}</p>
      <p><strong>Erstellt:</strong> ${new Date().toLocaleString('de-DE')}</p>
      <p><strong>Admin-Panel:</strong> <a href="https://nest-haus.at/admin/customer-inquiries/${inquiry.id}">Anfrage bearbeiten</a></p>
    </div>
  </div>
</body>
</html>`;

        const text = `
NEST-Haus - Neue Terminanfrage

Gewünschter Termin: ${formattedDate}
Zeitzone: ${this.TIME_ZONE}

Kundendaten:
- Name: ${inquiry.name}
- E-Mail: ${inquiry.email}
${inquiry.phone ? `- Telefon: ${inquiry.phone}\n` : ''}- Bevorzugter Kontakt: ${inquiry.preferredContact}
${inquiry.message ? `- Nachricht: ${inquiry.message}\n` : ''}
Nächste Schritte:
1. Verfügbarkeit prüfen in deinem iCloud Kalender
2. Termin bestätigen per E-Mail an den Kunden
3. Termin hinzufügen zu deinem iCloud Kalender
4. Kalendereinladung senden an ${inquiry.email}

Anfrage-ID: ${inquiry.id}
Admin-Panel: https://nest-haus.at/admin/customer-inquiries/${inquiry.id}
`;

        return { subject, html, text };
    }
}
