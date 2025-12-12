/**
 * Appointment Reminder Email Template
 * Sent 1 hour before appointment expiration (23 hours after booking)
 */

interface AppointmentReminderData {
  name: string;
  email: string;
  appointmentDateTime: string;
  expiresAt: string;
  inquiryId: string;
}

export function generateAppointmentReminderEmail(data: AppointmentReminderData): {
  subject: string;
  html: string;
  text: string;
} {
  const appointmentDate = new Date(data.appointmentDateTime);
  const expiresDate = new Date(data.expiresAt);
  const formattedDate = appointmentDate.toLocaleString('de-DE', {
    timeZone: 'Europe/Vienna',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate time remaining
  const now = new Date();
  const timeRemaining = Math.floor((expiresDate.getTime() - now.getTime()) / (1000 * 60)); // minutes
  const hoursRemaining = Math.floor(timeRemaining / 60);
  const minutesRemaining = timeRemaining % 60;

  const subject = `Erinnerung: Termin läuft in ${hoursRemaining}h ${minutesRemaining}min ab - NEST-Haus`;

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f4f4f4;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }
    .header p {
      font-size: 16px;
      margin: 0;
      opacity: 0.95;
    }
    .content {
      padding: 40px 30px;
    }
    .urgent-box {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      border-radius: 12px;
      padding: 24px;
      margin: 0 0 24px 0;
      text-align: center;
    }
    .urgent-box h2 {
      font-size: 24px;
      font-weight: 600;
      color: #92400e;
      margin: 0 0 12px 0;
    }
    .urgent-box p {
      font-size: 16px;
      color: #78350f;
      margin: 0;
    }
    .time-remaining {
      font-size: 36px;
      font-weight: 700;
      color: #d97706;
      margin: 16px 0;
    }
    .appointment-details {
      background: #f9fafb;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }
    .appointment-details h3 {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 12px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #6b7280;
      font-size: 14px;
    }
    .detail-value {
      color: #1f2937;
      font-weight: 500;
      font-size: 14px;
    }
    .cta-button {
      display: inline-block;
      background: #3D6CE1;
      color: white !important;
      padding: 16px 32px;
      border-radius: 9999px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
    }
    .cta-button:hover {
      background: #2d5ad0;
    }
    .steps {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 20px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .steps h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1e40af;
      margin: 0 0 12px 0;
    }
    .steps ol {
      margin: 0;
      padding-left: 20px;
      color: #1e3a8a;
    }
    .steps li {
      margin: 8px 0;
      font-size: 14px;
    }
    .footer {
      background: #f9f9f9;
      padding: 24px;
      text-align: center;
      font-size: 13px;
      color: #666;
    }
    .footer a {
      color: #3D6CE1;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
      .time-remaining {
        font-size: 28px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Terminbestätigung läuft bald ab</h1>
      <p>Bitte bestätigen Sie Ihren Termin</p>
    </div>
    
    <div class="content">
      <div class="urgent-box">
        <h2>Ihr Termin läuft in Kürze ab</h2>
        <div class="time-remaining">${hoursRemaining}h ${minutesRemaining}min</div>
        <p>Bitte bestätigen Sie Ihren Termin durch Hinzufügen zum Kalender</p>
      </div>
      
      <p style="font-size: 16px; color: #4a4a4a; margin-bottom: 16px;">
        Hallo ${data.name},
      </p>
      
      <p style="font-size: 15px; color: #6b7280; line-height: 1.6;">
        Dies ist eine freundliche Erinnerung: Ihre Terminanfrage bei NEST-Haus muss innerhalb der nächsten Stunde bestätigt werden, andernfalls wird der reservierte Zeitslot automatisch freigegeben.
      </p>
      
      <div class="appointment-details">
        <h3>Ihr reservierter Termin</h3>
        <div class="detail-row">
          <span class="detail-label">Datum & Uhrzeit:</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Zeitzone:</span>
          <span class="detail-value">Europe/Vienna (CET/CEST)</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Anfrage-ID:</span>
          <span class="detail-value">${data.inquiryId}</span>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="mailto:${data.email}" class="cta-button">
          Kalendereinladung erneut öffnen
        </a>
      </div>
      
      <div class="steps">
        <h3>So bestätigen Sie Ihren Termin:</h3>
        <ol>
          <li>Öffnen Sie die Kalendereinladung (.ics-Datei) aus unserer vorherigen E-Mail</li>
          <li>Klicken Sie auf "Ja" / "Akzeptieren" / "Zum Kalender hinzufügen"</li>
          <li>Der Termin wird automatisch bestätigt und in unserem Kalender eingetragen</li>
        </ol>
      </div>
      
      <p style="font-size: 14px; color: #6b7280; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <strong>Hinweis:</strong> Wenn Sie die Kalendereinladung nicht finden, überprüfen Sie bitte Ihren Spam-Ordner oder antworten Sie direkt auf diese E-Mail.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Nest-Haus</strong><br>Modulares Wohnen. Nachhaltig. Österreichisch.</p>
      <p style="margin-top: 12px;">
        <a href="https://nest-haus.at">Website</a> ·
        <a href="mailto:mail@nest-haus.at">E-Mail</a> ·
        <a href="tel:+436643949605">Telefon</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
NEST-Haus - Terminbestätigung läuft bald ab

Ihr Termin läuft in ${hoursRemaining}h ${minutesRemaining}min ab

Hallo ${data.name},

Dies ist eine freundliche Erinnerung: Ihre Terminanfrage bei NEST-Haus muss innerhalb der nächsten Stunde bestätigt werden, andernfalls wird der reservierte Zeitslot automatisch freigegeben.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IHR RESERVIERTER TERMIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Datum & Uhrzeit: ${formattedDate}
Zeitzone: Europe/Vienna (CET/CEST)
Anfrage-ID: ${data.inquiryId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SO BESTÄTIGEN SIE IHREN TERMIN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Öffnen Sie die Kalendereinladung (.ics-Datei) aus unserer vorherigen E-Mail
2. Klicken Sie auf "Ja" / "Akzeptieren" / "Zum Kalender hinzufügen"
3. Der Termin wird automatisch bestätigt und in unserem Kalender eingetragen

Hinweis: Wenn Sie die Kalendereinladung nicht finden, überprüfen Sie bitte Ihren Spam-Ordner oder antworten Sie direkt auf diese E-Mail.

--
NEST-Haus
Modulares Wohnen. Nachhaltig. Österreichisch.

Website: https://nest-haus.at
E-Mail: mail@nest-haus.at
Telefon: +43 664 3949605
  `;

  return { subject, html, text };
}

