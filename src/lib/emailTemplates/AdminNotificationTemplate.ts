interface AdminNotificationData {
  inquiryId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  requestType: 'contact' | 'appointment';
  preferredContact: 'EMAIL' | 'PHONE' | 'WHATSAPP';
  appointmentDateTime?: string;
  configurationData?: unknown;
  totalPrice?: number;
  sessionId?: string;
  clientIP?: string;
  userAgent?: string;
}

export function generateAdminNotificationEmail(data: AdminNotificationData): {
  subject: string;
  html: string;
  text: string;
} {
  const isAppointment = data.requestType === 'appointment';
  const formattedDate = data.appointmentDateTime 
    ? new Date(data.appointmentDateTime).toLocaleString('de-DE', {
        timeZone: 'Europe/Vienna',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  const subject = isAppointment
    ? `Neue Terminanfrage: ${data.name} - ${formattedDate}`
    : `Neue Kontaktanfrage: ${data.name}`;

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
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f4f4f4;
      padding: 20px;
    }
    .email-container {
      max-width: 700px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: ${isAppointment ? '#3D6CE1' : '#10b981'};
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
    .content {
      padding: 30px;
    }
    .section {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 12px;
      font-size: 15px;
    }
    .info-label {
      color: #6b7280;
      font-weight: 500;
    }
    .info-value {
      color: #1f2937;
    }
    .highlight-box {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }
    .success-box {
      background: #d1fae5;
      border-left: 4px solid #10b981;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      margin: 8px 8px 8px 0;
      transition: all 0.3s;
    }
    .btn-primary {
      background: #3D6CE1;
      color: white !important;
    }
    .btn-primary:hover {
      background: #2d5ad0;
    }
    .btn-secondary {
      background: #f3f4f6;
      color: #374151 !important;
      border: 1px solid #d1d5db;
    }
    .btn-secondary:hover {
      background: #e5e7eb;
    }
    .actions {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }
    .meta-info {
      font-size: 13px;
      color: #9ca3af;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>${isAppointment ? 'Neue Terminanfrage' : 'Neue Kontaktanfrage'}</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">NEST-Haus Admin Notification</p>
    </div>
    
    <div class="content">
      ${isAppointment ? `
      <div class="highlight-box">
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Gewünschter Termin:</div>
        <div style="font-size: 18px; font-weight: 600; color: #1f2937;">${formattedDate}</div>
        <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">Zeitzone: Europe/Vienna</div>
      </div>
      ` : ''}
      
      <!-- Customer Information -->
      <div class="section">
        <div class="section-title">Kundendaten</div>
        <div class="info-grid">
          <div class="info-label">Name:</div>
          <div class="info-value"><strong>${data.name}</strong></div>
          
          <div class="info-label">E-Mail:</div>
          <div class="info-value"><a href="mailto:${data.email}" style="color: #3D6CE1; text-decoration: none;">${data.email}</a></div>
          
          ${data.phone ? `
          <div class="info-label">Telefon:</div>
          <div class="info-value"><a href="tel:${data.phone}" style="color: #3D6CE1; text-decoration: none;">${data.phone}</a></div>
          ` : ''}
          
          <div class="info-label">Bevorzugt:</div>
          <div class="info-value">${data.preferredContact}</div>
        </div>
        
        ${data.message ? `
        <div style="margin-top: 16px;">
          <div class="info-label" style="margin-bottom: 8px;">Nachricht:</div>
          <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${data.message}</div>
        </div>
        ` : ''}
      </div>
      
      ${data.configurationData && data.totalPrice ? `
      <!-- Configuration Information -->
      <div class="section">
        <div class="section-title">🏡 Konfiguration</div>
        <div class="success-box">
          <div style="font-size: 15px; margin-bottom: 8px;">Kunde hat eine Konfiguration erstellt:</div>
          <div style="font-size: 24px; font-weight: 600; color: #10b981;">
            ${new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(data.totalPrice)}
          </div>
          <div style="font-size: 13px; color: #059669; margin-top: 4px;">Geschätzter Gesamtpreis</div>
        </div>
      </div>
      ` : ''}
      
      <!-- Actions -->
      <div class="actions">
        <div class="section-title">Nächste Schritte</div>
        <ol style="margin: 16px 0; padding-left: 20px; color: #4b5563;">
          ${isAppointment ? `
          <li>Kunde direkt kontaktieren: ${data.email}</li>
          <li>Termin im Kalender eintragen</li>
          <li>Anfrage im Admin-Panel verwalten</li>
          ` : `
          <li>Kunde per ${data.preferredContact} kontaktieren</li>
          <li>Beratungsgespräch vereinbaren</li>
          <li>Anfrage im Admin-Panel als "CONTACTED" markieren</li>
          `}
        </ol>
        
        <div style="margin-top: 20px;">
          <a href="https://nest-haus.at/admin/customer-inquiries" class="btn btn-primary">
            Admin-Panel öffnen
          </a>
          <a href="mailto:${data.email}" class="btn btn-secondary">
            E-Mail senden
          </a>
          ${data.phone ? `
          <a href="tel:${data.phone}" class="btn btn-secondary">
            Anrufen
          </a>
          ` : ''}
        </div>
      </div>
      
      <!-- Meta Information -->
      <div class="meta-info">
        <div><strong>Anfrage-ID:</strong> ${data.inquiryId}</div>
        ${data.sessionId ? `<div><strong>Session-ID:</strong> ${data.sessionId}</div>` : ''}
        <div><strong>Erstellt:</strong> ${new Date().toLocaleString('de-DE')}</div>
        ${data.clientIP ? `<div><strong>Client-IP:</strong> ${data.clientIP}</div>` : ''}
        ${data.userAgent ? `<div><strong>User-Agent:</strong> ${data.userAgent}</div>` : ''}
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
NEST-Haus - ${isAppointment ? 'Neue Terminanfrage' : 'Neue Kontaktanfrage'}

${isAppointment ? `
Gewünschter Termin: ${formattedDate}
Zeitzone: Europe/Vienna
` : ''}

KUNDENDATEN
Name: ${data.name}
E-Mail: ${data.email}
${data.phone ? `Telefon: ${data.phone}\n` : ''}Bevorzugter Kontakt: ${data.preferredContact}

${data.message ? `
Nachricht:
${data.message}
` : ''}

${data.configurationData && data.totalPrice ? `
🏡 KONFIGURATION
Geschätzter Gesamtpreis: ${new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(data.totalPrice)}
` : ''}

NÄCHSTE SCHRITTE:
${isAppointment ? `
1. Kunde direkt kontaktieren: ${data.email}
2. Termin im Kalender eintragen
3. Anfrage im Admin-Panel verwalten
` : `
1. Kunde per ${data.preferredContact} kontaktieren
2. Beratungsgespräch vereinbaren
3. Anfrage im Admin-Panel als "CONTACTED" markieren
`}

Admin-Panel: https://nest-haus.at/admin/customer-inquiries
E-Mail senden: mailto:${data.email}
${data.phone ? `Anrufen: tel:${data.phone}\n` : ''}
---

Anfrage-ID: ${data.inquiryId}
${data.sessionId ? `Session-ID: ${data.sessionId}\n` : ''}Erstellt: ${new Date().toLocaleString('de-DE')}
${data.clientIP ? `Client-IP: ${data.clientIP}\n` : ''}${data.userAgent ? `User-Agent: ${data.userAgent}\n` : ''}
  `;

  return { subject, html, text };
}

