import { IMAGES } from '@/constants/images';

interface CustomerConfirmationData {
  name: string;
  email: string;
  requestType: 'contact' | 'appointment';
  appointmentDateTime?: string;
  message?: string;
  inquiryId?: string;
}

export function generateCustomerConfirmationEmail(data: CustomerConfirmationData): {
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
    ? `📅 Terminanfrage bestätigt - ${formattedDate}`
    : '✅ Kontaktanfrage bestätigt - NEST-Haus';

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
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    .hero-image {
      width: 100%;
      height: auto;
      display: block;
    }
    .content {
      padding: 40px 30px;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 30px;
      margin: 20px 0;
      border: 1px solid rgba(61, 108, 225, 0.1);
      box-shadow: 0 4px 20px rgba(61, 108, 225, 0.08);
    }
    h1 {
      font-size: 28px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 10px;
      line-height: 1.2;
    }
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 20px 0 12px 0;
    }
    p {
      font-size: 16px;
      color: #4a4a4a;
      margin-bottom: 16px;
      line-height: 1.6;
    }
    .highlight {
      color: #3D6CE1;
      font-weight: 500;
    }
    .btn-primary {
      display: inline-block;
      background: #3D6CE1;
      color: white !important;
      padding: 14px 32px;
      border-radius: 9999px;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
      margin: 10px 0;
      transition: background 0.3s;
    }
    .btn-primary:hover {
      background: #2d5ad0;
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
    .footer {
      background: #f9f9f9;
      padding: 30px;
      text-align: center;
      font-size: 14px;
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
      .glass-card {
        padding: 20px;
      }
      h1 {
        font-size: 24px;
      }
      .btn-primary {
        display: block;
        text-align: center;
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Hero Image -->
    <img 
      src="https://nest-haus.at/api/images/${IMAGES.hero.nestHaus3}" 
      alt="NEST-Haus Interior"
      class="hero-image"
    />
    
    <!-- Main Content -->
    <div class="content">
      <h1>Vielen Dank, ${data.name}!</h1>
      <p>${isAppointment 
        ? 'Wir haben Ihre Terminanfrage erhalten und freuen uns auf unser Gespräch.'
        : 'Wir haben Ihre Kontaktanfrage erhalten und melden uns in Kürze bei Ihnen.'
      }</p>
      
      ${isAppointment ? `
      <!-- Appointment Details Card -->
      <div class="glass-card">
        <h2>📅 Ihr gewünschter Termin</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Datum und Uhrzeit</div>
            <div class="info-value">${formattedDate}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Zeitzone</div>
            <div class="info-value">Europe/Vienna (CET/CEST)</div>
          </div>
        </div>
        <p style="margin-top: 16px; font-size: 15px; color: #666;">
          Wir überprüfen die Verfügbarkeit und bestätigen Ihren Termin innerhalb von 24 Stunden per E-Mail.
        </p>
      </div>
      ` : ''}
      
      <!-- Next Steps Card -->
      <div class="glass-card">
        <h2>⏭️ Die nächsten Schritte</h2>
        <p>${isAppointment 
          ? '1. <strong>Terminbestätigung:</strong> Sie erhalten eine Kalendereinladung per E-Mail<br>2. <strong>Vorbereitung:</strong> Notieren Sie sich Ihre Fragen und Wünsche<br>3. <strong>Gespräch:</strong> Wir besprechen Ihr Nest-Haus-Projekt im Detail'
          : '1. <strong>Rückmeldung:</strong> Wir melden uns innerhalb von 2 Werktagen bei Ihnen<br>2. <strong>Beratung:</strong> Gemeinsam besprechen wir Ihre individuellen Anforderungen<br>3. <strong>Planung:</strong> Wir entwickeln eine maßgeschneiderte Lösung für Sie'
        }</p>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://nest-haus.at/konfigurator" class="btn-primary">
            Jetzt konfigurieren
          </a>
        </div>
      </div>
      
      <!-- Contact Info -->
      <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 16px;">
        <h2 style="margin-top: 0;">📧 Kontakt</h2>
        <p style="margin: 0;">
          <strong>E-Mail:</strong> <a href="mailto:mail@nest-haus.at" style="color: #3D6CE1; text-decoration: none;">mail@nest-haus.at</a><br>
          <strong>Telefon:</strong> <span class="highlight">+43 XXX XXXXXXX</span><br>
          <strong>Website:</strong> <a href="https://nest-haus.at" style="color: #3D6CE1; text-decoration: none;">nest-haus.at</a>
        </p>
      </div>
      
      ${data.inquiryId ? `
      <p style="font-size: 13px; color: #999; margin-top: 20px;">
        Anfrage-ID: ${data.inquiryId}
      </p>
      ` : ''}
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>
        <strong>NEST-Haus</strong><br>
        Modulares Wohnen. Nachhaltig. Österreichisch.
      </p>
      <p style="margin-top: 16px;">
        <a href="https://nest-haus.at">Website</a> ·
        <a href="https://nest-haus.at/impressum">Impressum</a> ·
        <a href="https://nest-haus.at/datenschutz">Datenschutz</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
NEST-Haus - ${isAppointment ? 'Terminanfrage bestätigt' : 'Kontaktanfrage bestätigt'}

Hallo ${data.name},

${isAppointment 
  ? `Vielen Dank für Ihre Terminanfrage. Wir haben Ihre Anfrage erhalten und freuen uns auf unser Gespräch.

Ihr gewünschter Termin:
${formattedDate}
Zeitzone: Europe/Vienna (CET/CEST)

Wir überprüfen die Verfügbarkeit und bestätigen Ihren Termin innerhalb von 24 Stunden per E-Mail.`
  : `Vielen Dank für Ihre Kontaktanfrage. Wir haben Ihre Nachricht erhalten und melden uns in Kürze bei Ihnen.`
}

Die nächsten Schritte:
${isAppointment 
  ? '1. Terminbestätigung: Sie erhalten eine Kalendereinladung per E-Mail\n2. Vorbereitung: Notieren Sie sich Ihre Fragen und Wünsche\n3. Gespräch: Wir besprechen Ihr Nest-Haus-Projekt im Detail'
  : '1. Rückmeldung: Wir melden uns innerhalb von 2 Werktagen bei Ihnen\n2. Beratung: Gemeinsam besprechen wir Ihre individuellen Anforderungen\n3. Planung: Wir entwickeln eine maßgeschneiderte Lösung für Sie'
}

Jetzt konfigurieren: https://nest-haus.at/konfigurator

Kontakt:
E-Mail: mail@nest-haus.at
Telefon: +43 XXX XXXXXXX
Website: nest-haus.at

${data.inquiryId ? `Anfrage-ID: ${data.inquiryId}` : ''}

--
NEST-Haus
Modulares Wohnen. Nachhaltig. Österreichisch.

Website: https://nest-haus.at
Impressum: https://nest-haus.at/impressum
Datenschutz: https://nest-haus.at/datenschutz
  `;

  return { subject, html, text };
}

