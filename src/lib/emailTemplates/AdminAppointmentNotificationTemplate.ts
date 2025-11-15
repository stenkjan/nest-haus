import { generateICSFile, generateICSFilename } from '../utils/icsGenerator';

export interface AdminAppointmentNotificationData {
  inquiryId: string;
  name: string;
  email: string;
  phone?: string;
  appointmentDateTime: string;
  appointmentExpiresAt: string;
  message?: string;
  configurationData?: Record<string, unknown>;
  sessionId?: string;
  clientIP?: string;
  userAgent?: string;
  confirmToken: string;
}

export function generateAdminAppointmentNotification(
  data: AdminAppointmentNotificationData
): {
  subject: string;
  html: string;
  text: string;
  icsAttachment: {
    filename: string;
    content: string;
    contentType: string;
  };
} {
  const appointmentDate = new Date(data.appointmentDateTime);
  const expiresDate = new Date(data.appointmentExpiresAt);
  const now = new Date();
  const hoursUntilExpiry = Math.max(0, Math.floor((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60)));

  const formattedDate = appointmentDate.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = appointmentDate.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedExpiry = expiresDate.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nest-haus.at';
  const confirmLink = `${baseUrl}/api/appointments/confirm?id=${data.inquiryId}&token=${data.confirmToken}`;
  const rejectLink = `${baseUrl}/api/appointments/reject?id=${data.inquiryId}&token=${data.confirmToken}`;

  const subject = `🔔 NEUE TERMINANFRAGE - ${formattedDate} um ${formattedTime}`;

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
      max-width: 700px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .header p {
      font-size: 14px;
      opacity: 0.95;
    }
    .content {
      padding: 40px 30px;
    }
    .urgent-box {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .urgent-box h2 {
      color: #92400e;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .urgent-box p {
      color: #78350f;
      font-size: 15px;
      margin: 0;
    }
    .urgent-box .countdown {
      font-size: 28px;
      font-weight: 700;
      color: #92400e;
      margin-top: 8px;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 30px;
      margin: 20px 0;
      border: 1px solid rgba(245, 158, 11, 0.2);
      box-shadow: 0 4px 20px rgba(245, 158, 11, 0.1);
    }
    .glass-card h2 {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 20px 0;
    }
    .info-grid {
      display: grid;
      gap: 12px;
      margin: 20px 0;
    }
    .info-item {
      padding: 12px;
      background: #f9f9f9;
      border-radius: 12px;
      font-size: 15px;
    }
    .info-label {
      color: #666;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .info-value {
      color: #1a1a1a;
      font-weight: 500;
    }
    .info-value a {
      color: #f59e0b;
      text-decoration: none;
    }
    .info-value a:hover {
      text-decoration: underline;
    }
    .action-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 30px 0;
    }
    .btn {
      display: inline-block;
      padding: 16px 24px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      text-align: center;
      transition: all 0.2s;
    }
    .btn-confirm {
      background: #10b981;
      color: white !important;
    }
    .btn-confirm:hover {
      background: #059669;
    }
    .btn-reject {
      background: #ef4444;
      color: white !important;
    }
    .btn-reject:hover {
      background: #dc2626;
    }
    .btn-secondary {
      background: #f3f4f6;
      color: #374151 !important;
      border: 1px solid #d1d5db;
    }
    .btn-secondary:hover {
      background: #e5e7eb;
    }
    .config-summary {
      background: #eff6ff;
      border: 1px solid #dbeafe;
      border-radius: 16px;
      padding: 20px;
      margin: 20px 0;
    }
    .config-summary h3 {
      color: #1e40af;
      font-size: 16px;
      margin-bottom: 12px;
    }
    .config-summary ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .config-summary li {
      color: #1e3a8a;
      font-size: 14px;
      padding: 6px 0;
      border-bottom: 1px solid #dbeafe;
    }
    .config-summary li:last-child {
      border-bottom: none;
    }
    .tech-info {
      background: #f5f3ff;
      border: 1px solid #e9d5ff;
      border-radius: 12px;
      padding: 16px;
      margin-top: 20px;
      font-size: 13px;
      color: #6b21a8;
    }
    .tech-info code {
      background: #ede9fe;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #6b7280;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .action-buttons {
        grid-template-columns: 1fr;
      }
      .header h1 {
        font-size: 20px;
      }
      .urgent-box .countdown {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>🔔 NEUE TERMINANFRAGE</h1>
      <p>Aktion erforderlich - Bestätigung innerhalb von 24 Stunden</p>
    </div>
    
    <!-- Main Content -->
    <div class="content">
      <!-- Urgent Expiration Warning -->
      <div class="urgent-box">
        <h2>⏰ Läuft ab in:</h2>
        <div class="countdown">${hoursUntilExpiry} Stunden</div>
        <p>Bitte bestätigen oder ablehnen bis: <strong>${formattedExpiry}</strong></p>
        <p style="margin-top: 8px; font-size: 13px;">Nicht bestätigte Termine werden automatisch storniert.</p>
      </div>
      
      <!-- Appointment Details -->
      <div class="glass-card">
        <h2>📅 Termindetails</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Datum</div>
            <div class="info-value">${formattedDate}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Uhrzeit</div>
            <div class="info-value">${formattedTime} (Europe/Vienna)</div>
          </div>
          <div class="info-item">
            <div class="info-label">Dauer</div>
            <div class="info-value">60 Minuten</div>
          </div>
        </div>
      </div>
      
      <!-- Customer Information -->
      <div class="glass-card">
        <h2>👤 Kundeninformationen</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Name</div>
            <div class="info-value">${data.name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">E-Mail</div>
            <div class="info-value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          ${
            data.phone
              ? `
          <div class="info-item">
            <div class="info-label">Telefon</div>
            <div class="info-value"><a href="tel:${data.phone}">${data.phone}</a></div>
          </div>
          `
              : ''
          }
          ${
            data.message
              ? `
          <div class="info-item">
            <div class="info-label">Nachricht</div>
            <div class="info-value">${data.message}</div>
          </div>
          `
              : ''
          }
        </div>
      </div>
      
      ${
        data.configurationData
          ? `
      <!-- Configuration Summary -->
      <div class="config-summary">
        <h3>🏠 Konfiguration</h3>
        <ul>
          <li>Anfrage-ID: ${data.inquiryId}</li>
          ${data.sessionId ? `<li>Session-ID: ${data.sessionId}</li>` : ''}
          <li>Konfigurationsdaten verfügbar</li>
        </ul>
      </div>
      `
          : ''
      }
      
      <!-- Action Buttons -->
      <div class="action-buttons">
        <a href="${confirmLink}" class="btn btn-confirm">
          ✅ Termin bestätigen
        </a>
        <a href="${rejectLink}" class="btn btn-reject">
          ❌ Termin ablehnen
        </a>
      </div>
      
      <div class="action-buttons">
        <a href="mailto:${data.email}" class="btn btn-secondary">
          📧 Kunde kontaktieren
        </a>
        <a href="${baseUrl}/admin/customer-inquiries" class="btn btn-secondary">
          📋 Admin-Panel öffnen
        </a>
      </div>
      
      <!-- Technical Information -->
      ${
        data.clientIP || data.userAgent
          ? `
      <div class="tech-info">
        <strong>Technische Informationen:</strong><br>
        ${data.clientIP ? `IP: <code>${data.clientIP}</code><br>` : ''}
        ${data.userAgent ? `Browser: <code>${data.userAgent}</code>` : ''}
      </div>
      `
          : ''
      }
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p><strong>NEST-Haus Admin-Benachrichtigung</strong></p>
      <p style="margin-top: 8px;">
        Dieser Termin wurde automatisch als .ics-Datei angehängt.<br>
        Fügen Sie ihn zu Ihrem Kalender (markus@sustain-nest.com) hinzu.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
NEST-Haus - NEUE TERMINANFRAGE

⏰ DRINGEND: Läuft ab in ${hoursUntilExpiry} Stunden
Bitte bestätigen oder ablehnen bis: ${formattedExpiry}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TERMINDETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Datum: ${formattedDate}
Uhrzeit: ${formattedTime} (Europe/Vienna)
Dauer: 60 Minuten

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KUNDENINFORMATIONEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name}
E-Mail: ${data.email}
${data.phone ? `Telefon: ${data.phone}` : ''}
${data.message ? `\nNachricht: ${data.message}` : ''}

${
  data.configurationData
    ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Anfrage-ID: ${data.inquiryId}
${data.sessionId ? `Session-ID: ${data.sessionId}` : ''}
Konfigurationsdaten verfügbar
`
    : ''
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AKTIONEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Termin bestätigen: ${confirmLink}
Termin ablehnen: ${rejectLink}
Kunde kontaktieren: mailto:${data.email}
Admin-Panel: ${baseUrl}/admin/customer-inquiries

Diese E-Mail enthält eine .ics-Kalenderdatei als Anhang.
Fügen Sie den Termin zu Ihrem Kalender (markus@sustain-nest.com) hinzu.

--
NEST-Haus Terminverwaltung
Automatische Benachrichtigung
  `;

  // Generate ICS attachment
  const icsContent = generateICSFile({
    appointmentDateTime: data.appointmentDateTime,
    customerName: data.name,
    customerEmail: data.email,
    adminEmail: 'markus@sustain-nest.com',
    inquiryId: data.inquiryId,
    duration: 60,
  });

  const icsAttachment = {
    filename: generateICSFilename(data.inquiryId),
    content: icsContent,
    contentType: 'text/calendar; charset=UTF-8; method=REQUEST',
  };

  return { subject, html, text, icsAttachment };
}

