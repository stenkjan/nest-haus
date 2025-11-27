/**
 * ICS (iCalendar) File Generator
 * RFC 5545 Compliant
 * 
 * Generates calendar invitation files for appointment bookings
 */

export interface ICSEventData {
  inquiryId: string;
  customerName: string;
  customerEmail: string;
  appointmentDateTime: Date;
  durationMinutes?: number;
  location?: string;
  description?: string;
  organizerEmail?: string;
  organizerName?: string;
}

/**
 * Format date for ICS format: YYYYMMDDTHHMMSSZ (UTC)
 */
function formatICSDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Format date for TZID format (Europe/Vienna timezone)
 * YYYYMMDDTHHMMSS (local time)
 */
function formatLocalDate(date: Date): string {
  // Convert to Vienna timezone
  const viennaDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Vienna' }));
  
  const year = viennaDate.getFullYear();
  const month = String(viennaDate.getMonth() + 1).padStart(2, '0');
  const day = String(viennaDate.getDate()).padStart(2, '0');
  const hours = String(viennaDate.getHours()).padStart(2, '0');
  const minutes = String(viennaDate.getMinutes()).padStart(2, '0');
  const seconds = String(viennaDate.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Escape special characters for ICS format
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Fold long lines to comply with RFC 5545 (max 75 chars per line)
 */
function foldLine(line: string): string {
  if (line.length <= 75) {
    return line;
  }
  
  const lines: string[] = [];
  let currentLine = line.substring(0, 75);
  let remaining = line.substring(75);
  
  lines.push(currentLine);
  
  while (remaining.length > 0) {
    const chunk = remaining.substring(0, 74); // 74 because we add a space
    lines.push(' ' + chunk); // Continuation lines start with space
    remaining = remaining.substring(74);
  }
  
  return lines.join('\r\n');
}

/**
 * Generate ICS file content for appointment booking
 */
export function generateICS(data: ICSEventData): string {
  const {
    inquiryId,
    customerName,
    customerEmail,
    appointmentDateTime,
    durationMinutes = 60,
    location = 'NEST-Haus Office, Karmeliterplatz 8, 8010 Graz, Austria',
    description,
    organizerEmail = 'mail@nest-haus.at',
    organizerName = 'NEST-Haus Team',
  } = data;

  // Calculate end time
  const endDateTime = new Date(appointmentDateTime.getTime() + durationMinutes * 60 * 1000);
  
  // Current timestamp for DTSTAMP
  const now = new Date();
  
  // Generate unique UID
  const uid = `inquiry-${inquiryId}@nest-haus.at`;
  
  // Format dates
  const dtStart = formatLocalDate(appointmentDateTime);
  const dtEnd = formatLocalDate(endDateTime);
  const dtStamp = formatICSDate(now);
  
  // Build description
  const fullDescription = description || 
    `Beratungstermin bei NEST-Haus\n\n` +
    `Kunde: ${customerName}\n` +
    `E-Mail: ${customerEmail}\n` +
    `Anfrage-ID: ${inquiryId}\n\n` +
    `Bitte bestätigen Sie den Termin innerhalb von 24 Stunden.`;
  
  // Build ICS content
  const icsLines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NEST-Haus//Appointment Booking//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VTIMEZONE',
    'TZID:Europe/Vienna',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'TZNAME:CEST',
    'DTSTART:19700329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'TZNAME:CET',
    'DTSTART:19701025T030000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=Europe/Vienna:${dtStart}`,
    `DTEND;TZID=Europe/Vienna:${dtEnd}`,
    foldLine(`SUMMARY:NEST-Haus Beratungstermin - ${escapeICSText(customerName)}`),
    foldLine(`DESCRIPTION:${escapeICSText(fullDescription)}`),
    foldLine(`LOCATION:${escapeICSText(location)}`),
    `STATUS:TENTATIVE`,
    `SEQUENCE:0`,
    foldLine(`ORGANIZER;CN=${escapeICSText(organizerName)}:mailto:${organizerEmail}`),
    foldLine(`ATTENDEE;CN=${escapeICSText(customerName)};RSVP=TRUE;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT:mailto:${customerEmail}`),
    'BEGIN:VALARM',
    'TRIGGER:-PT23H',
    'ACTION:DISPLAY',
    foldLine(`DESCRIPTION:Ihr Termin läuft in 1 Stunde ab. Bitte bestätigen Sie den Termin.`),
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    foldLine(`DESCRIPTION:Erinnerung: Ihr Termin bei NEST-Haus beginnt in 1 Stunde.`),
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  // Join with CRLF (required by RFC 5545)
  return icsLines.join('\r\n');
}

/**
 * Generate ICS file name for appointment
 */
export function generateICSFilename(inquiryId: string): string {
  return `nest-haus-termin-${inquiryId}.ics`;
}

/**
 * Get MIME type for ICS files
 */
export function getICSMimeType(): string {
  return 'text/calendar; charset=utf-8; method=REQUEST';
}
