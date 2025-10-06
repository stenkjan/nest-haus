import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import path from 'path';
import fs from 'fs';

export interface CalendarEvent {
    id?: string;
    summary: string;
    description?: string;
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    attendees?: Array<{
        email: string;
        displayName?: string;
    }>;
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
    private static calendar: unknown = null;
    private static readonly CALENDAR_ID = 'primary'; // Use primary calendar
    private static readonly TIME_ZONE = 'Europe/Vienna'; // Austrian timezone

    // Business hours configuration
    private static readonly BUSINESS_HOURS = {
        start: 9, // 9 AM
        end: 17,  // 5 PM
        duration: 60, // 60 minutes per appointment
    };

    private static readonly BUSINESS_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday

    /**
     * Initialize Google Calendar API client
     */
    private static async initializeCalendar() {
        if (this.calendar) {
            return this.calendar;
        }

        try {
            // Load service account credentials
            const serviceAccountPath = path.join(process.cwd(), process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || 'service-account-key.json');

            if (!fs.existsSync(serviceAccountPath)) {
                throw new Error(`Service account file not found: ${serviceAccountPath}`);
            }

            const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

            // Create JWT client
            const jwtClient = new JWT({
                email: serviceAccount.client_email,
                key: serviceAccount.private_key,
                scopes: [
                    'https://www.googleapis.com/auth/calendar',
                    'https://www.googleapis.com/auth/calendar.events'
                ],
            });

            // Initialize calendar API
            this.calendar = google.calendar({ version: 'v3', auth: jwtClient });

            console.log('✅ Google Calendar API initialized successfully');
            return this.calendar;

        } catch (error) {
            console.error('❌ Failed to initialize Google Calendar API:', error);
            throw error;
        }
    }

    /**
     * Create a new calendar event (appointment)
     */
    static async createAppointment(eventData: CalendarEvent): Promise<string | null> {
        try {
            console.log('📅 Creating calendar appointment...');

            const calendar = await this.initializeCalendar();

            const event = {
                summary: eventData.summary,
                description: eventData.description,
                start: {
                    dateTime: eventData.start.dateTime,
                    timeZone: eventData.start.timeZone || this.TIME_ZONE,
                },
                end: {
                    dateTime: eventData.end.dateTime,
                    timeZone: eventData.end.timeZone || this.TIME_ZONE,
                },
                attendees: eventData.attendees || [],
                location: eventData.location || 'NEST-Haus Büro, Karmeliterplatz 8, 8010 Graz',
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 }, // 24 hours before
                        { method: 'popup', minutes: 60 },      // 1 hour before
                    ],
                },
                conferenceData: {
                    createRequest: {
                        requestId: `nest-haus-${Date.now()}`,
                        conferenceSolutionKey: { type: 'hangoutsMeet' },
                    },
                },
                guestsCanModify: false,
                guestsCanInviteOthers: false,
                guestsCanSeeOtherGuests: false,
            };

            const response = await calendar.events.insert({
                calendarId: this.CALENDAR_ID,
                resource: event,
                conferenceDataVersion: 1,
                sendUpdates: 'all', // Send invites to all attendees
            });

            console.log('✅ Calendar appointment created:', response.data.id);
            return response.data.id || null;

        } catch (error) {
            console.error('❌ Failed to create calendar appointment:', error);
            return null;
        }
    }

    /**
     * Get available time slots for a specific date
     */
    static async getAvailableTimeSlots(request: AvailabilityRequest): Promise<TimeSlot[]> {
        try {
            console.log(`📅 Getting available time slots for ${request.date}`);

      const calendar = await this.initializeCalendar();
      const _timeZone = request.timeZone || this.TIME_ZONE;

            // Parse the requested date
            const requestDate = new Date(request.date);
            const dayOfWeek = requestDate.getDay();

            // Check if it's a business day
            if (!this.BUSINESS_DAYS.includes(dayOfWeek)) {
                console.log('📅 Not a business day, returning empty slots');
                return [];
            }

            // Generate time slots for the day
            const timeSlots: TimeSlot[] = [];
            const startHour = this.BUSINESS_HOURS.start;
            const endHour = this.BUSINESS_HOURS.end;
            const duration = this.BUSINESS_HOURS.duration;

            for (let hour = startHour; hour < endHour; hour++) {
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

            // Get existing events for the day
            const dayStart = new Date(requestDate);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(requestDate);
            dayEnd.setHours(23, 59, 59, 999);

            const existingEvents = await calendar.events.list({
                calendarId: this.CALENDAR_ID,
                timeMin: dayStart.toISOString(),
                timeMax: dayEnd.toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
            });

            // Mark conflicting time slots as unavailable
            if (existingEvents.data.items) {
                for (const event of existingEvents.data.items) {
                    if (event.start?.dateTime && event.end?.dateTime) {
                        const eventStart = new Date(event.start.dateTime);
                        const eventEnd = new Date(event.end.dateTime);

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
                }
            }

            // Filter out past time slots for today
            const now = new Date();
            const availableSlots = timeSlots.filter(slot => {
                const slotStart = new Date(slot.start);
                return slotStart > now;
            });

            console.log(`✅ Found ${availableSlots.filter(s => s.available).length} available slots`);
            return availableSlots;

        } catch (error) {
            console.error('❌ Failed to get available time slots:', error);
            return [];
        }
    }

    /**
     * Update an existing calendar event
     */
    static async updateAppointment(eventId: string, eventData: Partial<CalendarEvent>): Promise<boolean> {
        try {
            console.log(`📅 Updating calendar appointment: ${eventId}`);

            const calendar = await this.initializeCalendar();

            const updateData: Record<string, unknown> = {};

            if (eventData.summary) updateData.summary = eventData.summary;
            if (eventData.description) updateData.description = eventData.description;
            if (eventData.start) updateData.start = eventData.start;
            if (eventData.end) updateData.end = eventData.end;
            if (eventData.attendees) updateData.attendees = eventData.attendees;
            if (eventData.location) updateData.location = eventData.location;

            await calendar.events.patch({
                calendarId: this.CALENDAR_ID,
                eventId: eventId,
                resource: updateData,
                sendUpdates: 'all',
            });

            console.log('✅ Calendar appointment updated successfully');
            return true;

        } catch (error) {
            console.error('❌ Failed to update calendar appointment:', error);
            return false;
        }
    }

    /**
     * Cancel a calendar event
     */
    static async cancelAppointment(eventId: string): Promise<boolean> {
        try {
            console.log(`📅 Canceling calendar appointment: ${eventId}`);

            const calendar = await this.initializeCalendar();

            await calendar.events.delete({
                calendarId: this.CALENDAR_ID,
                eventId: eventId,
                sendUpdates: 'all',
            });

            console.log('✅ Calendar appointment canceled successfully');
            return true;

        } catch (error) {
            console.error('❌ Failed to cancel calendar appointment:', error);
            return false;
        }
    }

    /**
     * Generate calendar event data from customer inquiry
     */
    static generateEventFromInquiry(inquiry: any): CalendarEvent {
        const appointmentDate = new Date(inquiry.appointmentDateTime || inquiry.followUpDate);
        const endDate = new Date(appointmentDate);
        endDate.setMinutes(appointmentDate.getMinutes() + this.BUSINESS_HOURS.duration);

        return {
            summary: `NEST-Haus Beratungstermin - ${inquiry.name}`,
            description: this.generateEventDescription(inquiry),
            start: {
                dateTime: appointmentDate.toISOString(),
                timeZone: this.TIME_ZONE,
            },
            end: {
                dateTime: endDate.toISOString(),
                timeZone: this.TIME_ZONE,
            },
            attendees: [
                {
                    email: inquiry.email,
                    displayName: inquiry.name,
                },
                {
                    email: 'markus@sustain-nest.com',
                    displayName: 'Markus - NEST-Haus',
                },
            ],
            location: 'NEST-Haus Büro, Karmeliterplatz 8, 8010 Graz',
        };
    }

    /**
     * Generate detailed event description
     */
    private static generateEventDescription(inquiry: any): string {
        let description = `NEST-Haus Beratungstermin\n\n`;
        description += `Kunde: ${inquiry.name}\n`;
        description += `E-Mail: ${inquiry.email}\n`;

        if (inquiry.phone) {
            description += `Telefon: ${inquiry.phone}\n`;
        }

        description += `Bevorzugter Kontakt: ${inquiry.preferredContact}\n\n`;

        if (inquiry.message) {
            description += `Nachricht:\n${inquiry.message}\n\n`;
        }

        if (inquiry.configurationData) {
            description += `Konfiguration:\n`;
            if (inquiry.configurationData.nest?.name) {
                description += `- Nest-Modell: ${inquiry.configurationData.nest.name}\n`;
            }
            if (inquiry.configurationData.gebaeudehuelle?.name) {
                description += `- Gebäudehülle: ${inquiry.configurationData.gebaeudehuelle.name}\n`;
            }
            if (inquiry.totalPrice) {
                description += `- Geschätzter Preis: €${(inquiry.totalPrice / 100).toLocaleString('de-DE')}\n`;
            }
            description += `\n`;
        }

        description += `Anfrage-ID: ${inquiry.id}\n`;
        description += `Erstellt: ${new Date(inquiry.createdAt).toLocaleString('de-DE')}\n\n`;
        description += `Admin-Panel: https://nest-haus.at/admin/customer-inquiries/${inquiry.id}`;

        return description;
    }
}
