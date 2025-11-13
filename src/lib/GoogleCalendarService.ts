import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export interface CalendarEvent {
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

export class GoogleCalendarService {
    private static readonly CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'c_0143623b3c51294d60b53cb259d8c76b8b8ecf51a84a2913afb053dc6540261b@group.calendar.google.com';
    private static readonly TIME_ZONE = process.env.CALENDAR_TIMEZONE || 'Europe/Vienna';

    // Business hours configuration: 8-12 and 13-19 (lunch break 12-13)
    private static readonly BUSINESS_HOURS = {
        morningStart: 8,  // 8 AM
        morningEnd: 12,   // 12 PM (noon)
        afternoonStart: 13, // 1 PM  
        afternoonEnd: 19,   // 7 PM (19:00) - LAST SLOT STARTS AT 18:00
        duration: 60, // 60 minutes per appointment
    };

    private static readonly BUSINESS_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday

    /**
     * Get authenticated Google Calendar client
     */
    private static async getCalendarClient() {
        try {
            // Load service account credentials from file
            const serviceAccountKeyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || 'service-account-key.json';
            
            // Create JWT auth client
            const auth = new JWT({
                keyFile: serviceAccountKeyFile,
                scopes: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events'],
            });

            // Create calendar client
            const calendar = google.calendar({ version: 'v3', auth });

            return calendar;
        } catch (error) {
            console.error('❌ Failed to create Google Calendar client:', error);
            throw new Error('Failed to authenticate with Google Calendar API');
        }
    }

    /**
     * Fetch calendar events for a specific date range
     */
    private static async fetchCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
        try {
            console.log('📅 Fetching Google Calendar events...');

            const calendar = await this.getCalendarClient();

            // Fetch events from Google Calendar
            const response = await calendar.events.list({
                calendarId: this.CALENDAR_ID,
                timeMin: startDate.toISOString(),
                timeMax: endDate.toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
            });

            const events: CalendarEvent[] = [];

            if (response.data.items) {
                for (const event of response.data.items) {
                    if (event.start && event.end) {
                        // Parse start and end times
                        const start = event.start.dateTime 
                            ? new Date(event.start.dateTime)
                            : new Date(event.start.date || '');
                        
                        const end = event.end.dateTime 
                            ? new Date(event.end.dateTime)
                            : new Date(event.end.date || '');

                        events.push({
                            id: event.id || '',
                            summary: event.summary || 'Busy',
                            start,
                            end,
                            description: event.description || undefined,
                            location: event.location || undefined,
                        });
                    }
                }
            }

            console.log(`✅ Parsed ${events.length} events from Google Calendar`);
            return events;

        } catch (error) {
            console.error('❌ Failed to fetch Google Calendar events:', error);
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
            // This creates slots: 13:00-14:00, 14:00-15:00, 15:00-16:00, 16:00-17:00, 17:00-18:00, 18:00-19:00
            for (let hour = this.BUSINESS_HOURS.afternoonStart; hour < this.BUSINESS_HOURS.afternoonEnd; hour++) {
                // Additional safety check: don't create slots starting at or after 19:00
                if (hour >= 19) {
                    console.warn(`⚠️ Skipping slot starting at hour ${hour} (after 19:00)`);
                    break;
                }

                const startTime = new Date(requestDate);
                startTime.setHours(hour, 0, 0, 0);

                const endTime = new Date(startTime);
                endTime.setMinutes(duration);

                // Double-check: ensure end time doesn't exceed 19:00
                if (endTime.getHours() > 19) {
                    console.warn(`⚠️ Skipping slot ${hour}:00-${endTime.getHours()}:00 (ends after 19:00)`);
                    break;
                }

                timeSlots.push({
                    start: startTime.toISOString(),
                    end: endTime.toISOString(),
                    available: true, // Will be updated based on existing events
                });
            }

            console.log(`📅 Generated ${timeSlots.length} time slots for ${request.date}:`,
                timeSlots.map(slot => {
                    const start = new Date(slot.start);
                    const end = new Date(slot.end);
                    return `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}-${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
                }).join(', ')
            );

            // Fetch existing events from Google Calendar
            const dayStart = new Date(requestDate);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(requestDate);
            dayEnd.setHours(23, 59, 59, 999);

            const existingEvents = await this.fetchCalendarEvents(dayStart, dayEnd);

            // Mark conflicting time slots as unavailable
            for (const event of existingEvents) {
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

            // Filter out past time slots for today and enforce business hours
            const now = new Date();
            const availableSlots = timeSlots.filter(slot => {
                const slotStart = new Date(slot.start);
                const slotEnd = new Date(slot.end);

                // Must be in the future
                const isFuture = slotStart > now;

                // Must not start at or after 19:00 (7 PM)
                const withinBusinessHours = slotStart.getHours() < 19;

                // Must not end after 19:00 (7 PM)
                const endsWithinBusinessHours = slotEnd.getHours() <= 19;

                if (!withinBusinessHours || !endsWithinBusinessHours) {
                    console.warn(`⚠️ Filtering out slot outside business hours: ${slotStart.getHours()}:${slotStart.getMinutes().toString().padStart(2, '0')}-${slotEnd.getHours()}:${slotEnd.getMinutes().toString().padStart(2, '0')}`);
                }

                return isFuture && withinBusinessHours && endsWithinBusinessHours;
            });

            console.log(`✅ Found ${availableSlots.filter(s => s.available).length} available slots out of ${availableSlots.length} total slots (after business hours filtering)`);
            return availableSlots;

        } catch (error) {
            console.error('❌ Failed to get available time slots:', error);
            return [];
        }
    }

    /**
     * Get calendar events for a date range
     */
    static async getEventsForDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]> {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);

            return await this.fetchCalendarEvents(start, end);

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

            const events = await this.fetchCalendarEvents(dayStart, dayEnd);

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
     * Create a calendar event for a confirmed appointment
     */
    static async createEvent(appointmentData: {
        summary: string;
        description?: string;
        location?: string;
        startDateTime: string;
        endDateTime: string;
        attendeeEmail?: string;
        attendeeName?: string;
    }): Promise<{ success: boolean; eventId?: string; error?: string }> {
        try {
            console.log('📅 Creating Google Calendar event...');

            const calendar = await this.getCalendarClient();

            const event = {
                summary: appointmentData.summary,
                description: appointmentData.description || '',
                location: appointmentData.location || '',
                start: {
                    dateTime: appointmentData.startDateTime,
                    timeZone: this.TIME_ZONE,
                },
                end: {
                    dateTime: appointmentData.endDateTime,
                    timeZone: this.TIME_ZONE,
                },
                attendees: appointmentData.attendeeEmail ? [{
                    email: appointmentData.attendeeEmail,
                    displayName: appointmentData.attendeeName || '',
                    responseStatus: 'needsAction',
                }] : [],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 }, // 1 day before
                        { method: 'popup', minutes: 60 }, // 1 hour before
                    ],
                },
            };

            const response = await calendar.events.insert({
                calendarId: this.CALENDAR_ID,
                requestBody: event,
                sendUpdates: 'all', // Send email notifications to attendees
            });

            console.log('✅ Google Calendar event created:', response.data.id);

            return {
                success: true,
                eventId: response.data.id || undefined,
            };

        } catch (error) {
            console.error('❌ Failed to create Google Calendar event:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
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
        <li><strong>Verfügbarkeit prüfen</strong> in deinem Google Calendar</li>
        <li><strong>Termin bestätigen</strong> per E-Mail an den Kunden</li>
        <li><strong>Termin wird automatisch hinzugefügt</strong> zu Google Calendar</li>
        <li><strong>Kalendereinladung wird gesendet</strong> an ${inquiry.email}</li>
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
1. Verfügbarkeit prüfen in deinem Google Calendar
2. Termin bestätigen per E-Mail an den Kunden
3. Termin wird automatisch hinzugefügt zu Google Calendar
4. Kalendereinladung wird gesendet an ${inquiry.email}

Anfrage-ID: ${inquiry.id}
Admin-Panel: https://nest-haus.at/admin/customer-inquiries/${inquiry.id}
`;

        return { subject, html, text };
    }
}

