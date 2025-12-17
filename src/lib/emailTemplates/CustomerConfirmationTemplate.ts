interface CustomerConfirmationData {
  name: string;
  email: string;
  requestType: 'contact' | 'appointment';
  appointmentDateTime?: string;
  appointmentType?: 'personal' | 'phone';
  message?: string;
  inquiryId?: string;
}

export function generateCustomerConfirmationEmail(data: CustomerConfirmationData): {
  subject: string;
  html: string;
  text: string;
} {
  const isAppointment = data.requestType === 'appointment';
  const isPhoneAppointment = data.appointmentType === 'phone';
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
    ? `Terminanfrage bestätigt - ${formattedDate}`
    : 'Kontaktanfrage bestätigt - ®Hoam';

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
    .glass-card--plain {
      background: #f4f4f4;
      border-radius: 0;
      box-shadow: none;
      border: none;
    }
    .glass-card--plain .info-item {
      border-radius: 0 !important;
    }
    .cta-section {
      background: #f4f4f4;
      padding: 40px 30px;
      margin: 0;
      border-radius: 0;
    }
    .cta-content {
      max-width: 600px;
      margin: 0 auto;
    }
    .cta-text {
      text-align: center;
      margin-bottom: 24px;
    }
    .cta-text h2 {
      font-size: 24px;
      font-weight: 400;
      color: #1a1a1a;
      margin: 0 0 16px 0;
    }
    .cta-text p {
      font-size: 15px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 0;
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
      .cta-section {
        padding: 30px 20px;
      }
      .cta-text h2 {
        font-size: 20px;
      }
      .cta-text p {
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
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
        <h2>${isPhoneAppointment ? 'Ihr gewünschter Gesprächstermin' : 'Ihr gewünschter Termin'}</h2>
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
          Sie finden eine Kalendereinladung (.ics-Datei) im Anhang dieser E-Mail, die Sie zu Ihrem Kalender hinzufügen können.
        </p>
      </div>
      ` : ''}
      
      <!-- Next Steps Card -->
      <div class="glass-card">
        <h2>Die nächsten Schritte</h2>
        <p>${isAppointment
      ? '1. <strong>Kalendereinladung:</strong> Sie erhalten eine Kalendereinladung per E-Mail<br>2. <strong>Vorbereitung:</strong> Notieren Sie sich Ihre Fragen und Wünsche<br>3. <strong>Gespräch:</strong> Wir besprechen Ihr ®Hoam-Projekt im Detail'
      : '1. <strong>Rückmeldung:</strong> Wir melden uns innerhalb von 2 Werktagen bei Ihnen<br>2. <strong>Beratung:</strong> Gemeinsam besprechen wir Ihre individuellen Anforderungen<br>3. <strong>Planung:</strong> Wir entwickeln eine maßgeschneiderte Lösung für Sie'
    }</p>
        ${isPhoneAppointment ? `
        <p style="margin-top: 16px; font-size: 15px; color: #4a4a4a; line-height: 1.6;">
          Sie können sich auch jederzeit früher für Rückfragen bei uns bei der unten angeführten Telefonnummer melden. Wir freuen uns auf Ihren Anruf!
        </p>
        ` : ''}
      </div>
      
      <!-- Contact Info Cards -->
      <div class="glass-card glass-card--plain">
        <h2>Kontakt <span style="color: #737373; font-weight: 400;">Melde dich!</span></h2>
        <div class="info-grid">
        <div class="info-item" style="border-radius:0 !important">
          <div class="info-label">Mobil</div>
          <div class="info-value">+43 (0) 664 3949605</div>
        </div>
          <div class="info-item" style="border-radius:0 !important">
            <div class="info-label">Telefon</div>
            <div class="info-value">+43 (0) 660 5649683</div>
          </div>
          <div class="info-item" style="border-radius:0 !important">
            <div class="info-label">Email</div>
            <div class="info-value">mail@hoam.at</div>
          </div>
        </div>
      </div>
      
      <div class="glass-card glass-card--plain">
        <h2>Adresse <span style="color: #737373; font-weight: 400;">Komm vorbei!</span></h2>
        <div class="info-grid">
          <div class="info-item" style="border-radius:0 !important">
            <div class="info-label">Straße</div>
            <div class="info-value">Karmeliterplatz 8</div>
          </div>
          <div class="info-item" style="border-radius:0 !important">
            <div class="info-label">Stadt</div>
            <div class="info-value">8010, Graz, Steiermark</div>
          </div>
          <div class="info-item" style="border-radius:0 !important">
            <div class="info-label">Land</div>
            <div class="info-value">Österreich</div>
          </div>
        </div>
      </div>
      
      ${data.inquiryId ? `
      <p style="font-size: 13px; color: #999; margin-top: 20px;">
        Anfrage-ID: ${data.inquiryId}
      </p>
      ` : ''}
    </div>
    
    <!-- CTA Section -->
    <div class="cta-section">
      <div class="cta-content">
        <div class="cta-text">
          <h2>Planen heißt Preise kennen</h2>
          <p>Wenn du dein Nest schon jetzt konfigurierst, erhältst du volle Klarheit über Preis, Umfang und Möglichkeiten. Deine Auswahl bleibt dabei flexibel und kann jederzeit angepasst werden, falls sich deine Wünsche im Laufe der Planung verändern.</p>
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://hoam.at/konfigurator" class="btn-primary">
              Jetzt konfigurieren
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>
        <strong>®Hoam</strong><br>
        Dein Stil. Dein Zuhause.
      </p>
      <p style="margin-top: 16px;">
        <a href="https://hoam.at">Website</a> ·
        <a href="https://hoam.at/impressum">Impressum</a> ·
        <a href="https://hoam.at/datenschutz">Datenschutz</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
®Hoam - ${isAppointment ? 'Terminanfrage bestätigt' : 'Kontaktanfrage bestätigt'}

Hallo ${data.name},

${isAppointment
      ? `Vielen Dank für Ihre Terminanfrage. Wir haben Ihre Anfrage erhalten und freuen uns auf unser Gespräch.

${isPhoneAppointment ? 'Ihr gewünschter Gesprächstermin:' : 'Ihr gewünschter Termin:'}
${formattedDate}
Zeitzone: Europe/Vienna (CET/CEST)

Sie finden eine Kalendereinladung (.ics-Datei) im Anhang dieser E-Mail, die Sie zu Ihrem Kalender hinzufügen können.`
      : `Vielen Dank für Ihre Kontaktanfrage. Wir haben Ihre Nachricht erhalten und melden uns in Kürze bei Ihnen.`
    }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIE NÄCHSTEN SCHRITTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${isAppointment
      ? '1. Kalendereinladung: Sie erhalten eine Kalendereinladung per E-Mail\n2. Vorbereitung: Notieren Sie sich Ihre Fragen und Wünsche\n3. Gespräch: Wir besprechen Ihr ®Hoam-Projekt im Detail'
      : '1. Rückmeldung: Wir melden uns innerhalb von 2 Werktagen bei Ihnen\n2. Beratung: Gemeinsam besprechen wir Ihre individuellen Anforderungen\n3. Planung: Wir entwickeln eine maßgeschneiderte Lösung für Sie'
    }${isPhoneAppointment ? '\n\nSie können sich auch jederzeit früher für Rückfragen bei uns bei der unten angeführten Telefonnummer melden. Wir freuen uns auf Ihren Anruf!' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KONTAKT - Melde dich!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Telefon: +43 (0) 660 5649683
Mobil: +43 (0) 664 3949605
Email: mail@hoam.at

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADRESSE - Komm vorbei!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Straße: Karmeliterplatz 8
Stadt: 8010, Graz, Steiermark
Land: Österreich

${data.inquiryId ? `Anfrage-ID: ${data.inquiryId}\n\n` : '\n'}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLANEN HEIẞT PREISE KENNEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Wenn du dein Nest schon jetzt konfigurierst, erhältst du volle Klarheit über Preis, Umfang und Möglichkeiten. Deine Auswahl bleibt dabei flexibel und kann jederzeit angepasst werden, falls sich deine Wünsche im Laufe der Planung verändern.

Jetzt konfigurieren: https://hoam.at/konfigurator

--
®Hoam
Modulares Wohnen. Nachhaltig. Österreichisch.

Website: https://hoam.at
Impressum: https://hoam.at/impressum
Datenschutz: https://hoam.at/datenschutz
  `;

  return { subject, html, text };
}

