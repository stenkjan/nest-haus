/**
 * Generate iCalendar (.ics) file for appointment bookings
 * Follows RFC 5545 iCalendar specification
 */

export interface ICSEventData {
  appointmentDateTime: string; // ISO 8601 format
  customerName: string;
  customerEmail: string;
  adminEmail: string; // markus@sustain-nest.com
  inquiryId: string;
  duration?: number; // minutes, default 60
  location?: string;
}

/**
 * Format date to iCalendar format (YYYYMMDDTHHMMSSZ)
 */
function formatICalDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Generate unique UID for calendar event
 */
function generateUID(inquiryId: string): string {
  return `appointment-${inquiryId}@nest-haus.at`;
}

/**
 * Escape special characters in iCalendar text fields
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generate .ics calendar file content
 */
export function generateICSFile(data: ICSEventData): string {
  const startDate = new Date(data.appointmentDateTime);
  const duration = data.duration || 60; // Default 60 minutes
  const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
  const location = data.location || 'NEST-Haus Office, Karmeliterplatz 8, 8010 Graz';
  
  // Current timestamp for DTSTAMP
  const now = new Date();
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NEST-Haus//Appointment System//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${generateUID(data.inquiryId)}`,
    `DTSTAMP:${formatICalDate(now)}`,
    `DTSTART:${formatICalDate(startDate)}`,
    `DTEND:${formatICalDate(endDate)}`,
    `SUMMARY:NEST-Haus Beratungstermin - ${escapeICalText(data.customerName)}`,
    `DESCRIPTION:Beratungstermin für NEST-Haus Konfiguration\\n\\nKunde: ${escapeICalText(data.customerName)}\\nE-Mail: ${data.customerEmail}\\nAnfrage-ID: ${data.inquiryId}\\n\\nBitte bestätigen Sie den Termin innerhalb von 24 Stunden.`,
    `LOCATION:${escapeICalText(location)}`,
    `ORGANIZER;CN=NEST-Haus Team:mailto:${data.adminEmail}`,
    `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=${escapeICalText(data.customerName)}:mailto:${data.customerEmail}`,
    'STATUS:TENTATIVE',
    'SEQUENCE:0',
    'TRANSP:OPAQUE',
    
    // 24-hour reminder (email)
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:EMAIL',
    `ATTENDEE:mailto:${data.adminEmail}`,
    `SUMMARY:Erinnerung: NEST-Haus Termin in 24 Stunden`,
    `DESCRIPTION:Termin mit ${escapeICalText(data.customerName)} am ${startDate.toLocaleDateString('de-DE')} um ${startDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`,
    'END:VALARM',
    
    // 1-hour reminder (popup)
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:NEST-Haus Termin in 1 Stunde - ${escapeICalText(data.customerName)}`,
    'END:VALARM',
    
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  
  return icsContent;
}

/**
 * Generate filename for .ics file
 */
export function generateICSFilename(inquiryId: string): string {
  return `termin-${inquiryId}.ics`;
}

